import { useQuery } from "@tanstack/react-query";
import { CurrencyBoxMode, SwapState } from "@/app/swap/SwapForm";
import useSwapData from "@/hooks/useAssetPair/useSwapData";
import useReadonlyMira from "@/hooks/useReadonlyMira";
import { buildPoolId, PoolId, Asset } from "disel-dex-ts";
import { ApiBaseUrl, BackendUrl } from "@/utils/constants";
import { InsufficientReservesError } from "disel-dex-ts/dist/sdk/errors";
import { BN } from "fuels";
import useAssetMetadata from "./useAssetMetadata";

type Props = {
  swapState: SwapState;
  mode: CurrencyBoxMode;
};

type TradeType = "ExactInput" | "ExactOutput";

type MultihopPreviewData = {
  path: [string, string, boolean][];
  input_amount: number;
  output_amount: number;
};

type SwapPreviewData = {
  pools: PoolId[];
  previewAmount: BN;
};

export class NoRouteFoundError extends Error {
  constructor() {
    super("No route found");
  }
}

const useSwapPreview = ({ swapState, mode }: Props) => {
  const { sellAssetId, buyAssetId } = useSwapData(swapState);

  const miraAmm = useReadonlyMira();
  const miraExists = Boolean(miraAmm);

  const sellMetadata = useAssetMetadata(sellAssetId);
  const buyMetadata = useAssetMetadata(buyAssetId);

  const amountString =
    mode === "sell" ? swapState.sell.amount : swapState.buy.amount;
  const amount = parseFloat(amountString);
  const amountValid = !isNaN(amount);
  const decimals =
    (mode === "sell" ? sellMetadata.decimals : buyMetadata.decimals) || 0;
  const normalizedAmount = amountValid ? amount * 10 ** decimals : 0;
  const amountNonZero = normalizedAmount > 0;

  const tradeType: TradeType = mode === "sell" ? "ExactInput" : "ExactOutput";

  const {
    data: multihopPreviewData,
    error: multihopPreviewError,
    isLoading: multihopPreviewLoading,
    failureCount: multihopFailureCount,
    refetch,
  } = useQuery({
    queryKey: [
      "multihopPreview",
      sellAssetId,
      buyAssetId,
      normalizedAmount,
      tradeType,
    ],
    queryFn: async () => {
      const res = await fetch(`${BackendUrl}/route/get_route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({
          input: sellAssetId,
          output: buyAssetId,
          amount: normalizedAmount,
          trade_type: tradeType,
        }),
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new NoRouteFoundError();
        }

        throw new Error("An error occurred while retrieving the path");
      }

      const previewData: MultihopPreviewData = await res.json();
      console.log(previewData);

      // API is returning unreliable data, let's re-simulate
      if (tradeType === "ExactInput") {
        const previewResponse = await miraAmm?.previewSwapExactInput(
          { bits: sellAssetId },
          normalizedAmount,
          previewData.path.map(([input, output, stable]) =>
            buildPoolId(`${input}`, `${output}`, stable)
          )
        );

        if (!previewResponse) {
          throw new Error("An error occurred while simulating the swap");
        }

        previewData.output_amount = previewResponse[1].toNumber();
      } else {
        const previewResponse = await miraAmm?.previewSwapExactOutput(
          { bits: buyAssetId },
          normalizedAmount,
          previewData.path.map(([input, output, stable]) =>
            buildPoolId(`${input}`, `${output}`, stable)
          )
        );

        if (!previewResponse) {
          throw new Error("An error occurred while simulating the swap");
        }

        previewData.input_amount = previewResponse[1].toNumber();
      }

      return previewData;
    },
    retry: (failureCount, error) => {
      if (error instanceof NoRouteFoundError) {
        return false;
      }

      return failureCount < 1;
    },
    retryDelay: 1000,
    enabled: amountNonZero && miraExists,
    refetchInterval: 15000,
  });

  const volatilePool = buildPoolId(
    { bits: sellAssetId },
    { bits: buyAssetId },
    false
  );
  const stablePool = buildPoolId(
    { bits: sellAssetId },
    { bits: buyAssetId },
    true
  );
  const shouldFetchFallback =
    Boolean(multihopPreviewError) &&
    multihopFailureCount === 2 &&
    miraExists &&
    amountNonZero;

  async function getFallbackPoolId(): Promise<PoolId | undefined> {
    try {
      const volatileMeta = await miraAmm
        ?.poolMetadata(volatilePool)
        .catch(() => undefined);
      const stableMeta = await miraAmm
        ?.poolMetadata(stablePool)
        .catch(() => undefined);

      if (!volatileMeta && !stableMeta) {
        return undefined;
      }

      if (!volatileMeta) return stablePool;
      if (!stableMeta) return volatilePool;

      const volatileReservesProduct = volatileMeta.reserve0.mul(
        volatileMeta.reserve1
      );
      const stableReservesProduct = stableMeta.reserve0.mul(
        stableMeta.reserve1
      );

      return volatileReservesProduct >= stableReservesProduct
        ? volatilePool
        : stablePool;
    } catch (error) {
      console.error("Error determining fallback pool:", error);
      return undefined;
    }
  }

  const {
    data: fallbackPreviewData,
    error: fallbackPreviewError,
    isLoading: fallbackPreviewLoading,
  } = useQuery({
    queryKey: ["fallbackPreview", sellAssetId, buyAssetId, normalizedAmount],
    queryFn: async () => {
      const fallbackPoolId = await getFallbackPoolId();

      if (!fallbackPoolId) {
        throw new NoRouteFoundError();
      }

      const fallbackPreviewResponse =
        mode === "sell"
          ? await miraAmm?.previewSwapExactInput(
              { bits: sellAssetId },
              normalizedAmount,
              [fallbackPoolId]
            )
          : await miraAmm?.previewSwapExactOutput(
              { bits: buyAssetId },
              normalizedAmount,
              [fallbackPoolId]
            );

      if (!fallbackPreviewResponse) {
        return;
      }

      return [fallbackPreviewResponse, fallbackPoolId] as [Asset, PoolId];
    },
    enabled: shouldFetchFallback,
    retry: (failureCount, error) => {
      if (
        error instanceof InsufficientReservesError ||
        error instanceof NoRouteFoundError
      ) {
        return false;
      }

      return failureCount < 1;
    },
    retryDelay: 1000,
    refetchInterval: 15000,
  });

  let previewData: SwapPreviewData | null = null;
  if (multihopPreviewData) {
    const { path, input_amount, output_amount } =
      multihopPreviewData as MultihopPreviewData;
    previewData = {
      pools: path.map(([input, output, stable]) =>
        buildPoolId(`${input}`, `${output}`, stable)
      ),
      previewAmount:
        mode === "sell"
          ? new BN(output_amount.toString())
          : new BN(input_amount.toString()),
    };
  } else if (fallbackPreviewData) {
    const [fallbackPreviewResponse, fallbackPoolId] = fallbackPreviewData;
    previewData = {
      pools: [fallbackPoolId],
      previewAmount: fallbackPreviewResponse[1],
    };
  }

  const previewError = !previewData
    ? fallbackPreviewError || multihopPreviewError
    : null;

  return {
    previewData,
    previewLoading: multihopPreviewLoading || fallbackPreviewLoading,
    previewError,
    refetchPreview: refetch,
  };
};

export default useSwapPreview;
