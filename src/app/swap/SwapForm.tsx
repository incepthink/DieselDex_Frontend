import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { B256Address, bn, BN } from "fuels";
import { useDebounceCallback, useLocalStorage } from "usehooks-ts";
import { useConnectUI, useIsConnected } from "@fuels/react";
import { IoSwapVertical } from "react-icons/io5";
import clsx from "clsx";

import { useAssetList } from "@/hooks/useAssetList";
import useBalances from "@/hooks/useBalances/useBalances";
import useCheckActiveNetwork from "@/hooks/useCheckActiveNetwork";
import useCheckEthBalance from "@/hooks/useCheckEthBalance/useCheckEthBalance";
import useInitialSwapState from "@/hooks/useInitialSwapState/useInitialSwapState";
import useSwapPreview from "@/hooks/useSwapPreview";
import useSwap from "@/hooks/useSwap/useSwap";
import useModal from "@/hooks/useModal/useModal";
import useExchangeRate from "@/hooks/useExchangeRate/useExchangeRate";
import useReservesPrice from "@/hooks/useReservesPrice";
import { useAssetPrice } from "@/hooks/useAssetPrice";
import { PoolId } from "disel-dex-ts";

import IconButton from "@/components/common/IconButton/IconButton";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import SettingsIcon from "@/components/icons/Settings/SettingsIcon";
import ConvertIcon from "@/components/icons/Convert/ConvertIcon";
import SettingsModalContent from "@/components/common/Swap/SettingsModalContent/SettingsModalContent";
import CurrencyBox from "@/components/common/Swap/CurrencyBox/CurrencyBox";
import CoinsListModal from "@/components/common/Swap/CoinsListModal/CoinsListModal";
import SwapSuccessModal from "@/components/common/Swap/SwapSuccessModal/SwapSuccessModal";
import SwapFailureModal from "@/components/common/Swap/SwapFailureModal/SwapFailureModal";
import PriceImpact from "@/components/common/Swap/PriceImpact/PriceImpact";
import ExchangeRate from "@/components/common/Swap/ExchangeRate/ExchangeRate";

import { clientAxios, createPoolKey, openNewTab } from "@/utils/common";
import { BackendUrl, FuelAppUrl } from "@/utils/constants";

export type CurrencyBoxMode = "buy" | "sell";
export type CurrencyBoxState = {
  assetId: string | null;
  amount: string;
};
type InputState = {
  amount: string;
};
export type SwapState = Record<CurrencyBoxMode, CurrencyBoxState>;
type InputsState = Record<CurrencyBoxMode, InputState>;

export type SlippageMode = "auto" | "custom";
export const DefaultSlippageValue = 100;

function SwapRouteItem({ pool }: { pool: PoolId }) {
  const { assets } = useAssetList();

  const fromSymbol =
    assets.find((a) => a.assetId === pool[0].bits)?.symbol ?? "???";
  const toSymbol =
    assets.find((a) => a.assetId === pool[1].bits)?.symbol ?? "???";

  return (
    <>
      <p className="text-white/80">
        {fromSymbol} → {toSymbol}
      </p>
    </>
  );
}

const SwapForm: React.FC = () => {
  const [SettingsModal, openSettingsModal, closeSettingsModal] = useModal();
  const [CoinsModal, openCoinsModal, closeCoinsModal] = useModal();
  const [SuccessModal, openSuccess] = useModal();
  const [FailureModal, openFailure, closeFailureModal] = useModal();

  const initialSwapState = useInitialSwapState();
  const [swapState, setSwapState] = useState<SwapState>(initialSwapState);
  const [inputsState, setInputsState] = useState<InputsState>({
    sell: { amount: "" },
    buy: { amount: "" },
  });
  const [activeMode, setActiveMode] = useState<CurrencyBoxMode>("sell");
  const [slippage, setSlippage] = useState<number>(DefaultSlippageValue);
  const [txCost, setTxCost] = useState<number | null>(null);
  const [slippageMode, setSlippageMode] = useState<SlippageMode>("auto");
  const [swapCoins, setSwapCoins] = useLocalStorage("swapCoins", {
    sell: initialSwapState.sell.assetId,
    buy: initialSwapState.buy.assetId,
  });

  const { assets } = useAssetList();
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnectUI();
  const { balances, balancesPending, refetchBalances } = useBalances();
  const isValidNetwork = useCheckActiveNetwork();
  const sufficientEthBalance = useCheckEthBalance(swapState.sell);

  const sellMetadata = useMemo(() => {
    return assets.find((a) => a.assetId === swapState.sell.assetId);
  }, [assets, swapState.sell.assetId]);

  const buyMetadata = useMemo(() => {
    return assets.find((a) => a.assetId === swapState.buy.assetId);
  }, [assets, swapState.buy.assetId]);

  const sellBalanceValue =
    balances?.find((b) => b.assetId === swapState.sell.assetId)?.amount ??
    new BN(0);
  const buyBalanceValue =
    balances?.find((b) => b.assetId === swapState.buy.assetId)?.amount ??
    new BN(0);

  const sellValue = inputsState.sell.amount;
  const buyValue = inputsState.buy.amount;
  const anotherMode = activeMode === "sell" ? "buy" : "sell";

  const previewStateRef = useRef(swapState);
  const previewValueRef = useRef("");

  const { previewData, previewLoading, previewError, refetchPreview } =
    useSwapPreview({
      swapState,
      mode: activeMode,
    });

  const decimals =
    (anotherMode === "sell" ? sellMetadata?.decimals : buyMetadata?.decimals) ??
    0;

  const previewValueString =
    previewData?.previewAmount?.formatUnits(decimals) ??
    previewValueRef.current;

  previewValueRef.current = previewValueString;

  useEffect(() => {
    if (previewValueString !== swapState[anotherMode].amount) {
      setSwapState((prev) => ({
        ...prev,
        [anotherMode]: {
          ...prev[anotherMode],
          amount: previewValueString,
        },
      }));
    }
    if (previewValueString !== inputsState[anotherMode].amount) {
      setInputsState((prev) => ({
        ...prev,
        [anotherMode]: {
          amount: previewValueString,
        },
      }));
    }
  }, [previewValueString, anotherMode]);

  const debouncedSetState = useDebounceCallback(setSwapState, 500);

  const setAmount = useCallback(
    (mode: CurrencyBoxMode) => (amount: string) => {
      if (amount === "") {
        debouncedSetState((prev) => ({
          sell: { assetId: prev.sell.assetId, amount: "" },
          buy: { assetId: prev.buy.assetId, amount: "" },
        }));
        setInputsState({
          sell: { amount: "" },
          buy: { amount: "" },
        });
        previewValueRef.current = "";
        setActiveMode(mode);
        return;
      }

      debouncedSetState((prev) => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          amount,
        },
      }));

      setInputsState((prev) => ({
        ...prev,
        [mode]: { amount },
      }));

      setActiveMode(mode);
    },
    [debouncedSetState]
  );

  const swapAssets = () => {
    setSwapState((prev) => ({
      sell: { ...prev.buy },
      buy: { ...prev.sell },
    }));
    setInputsState((prev) => ({
      sell: { ...prev.buy },
      buy: { ...prev.sell },
    }));
    setSwapCoins((prev) => ({
      sell: prev.buy,
      buy: prev.sell,
    }));
    setActiveMode("sell");
  };

  const modeForCoinSelector = useRef<CurrencyBoxMode>("sell");

  const handleCoinSelectorClick = (mode: CurrencyBoxMode) => {
    modeForCoinSelector.current = mode;
    openCoinsModal();
  };

  const handleCoinSelection = (assetId: string | null) => {
    const mode = modeForCoinSelector.current;

    if (
      (mode === "buy" && swapState.sell.assetId === assetId) ||
      (mode === "sell" && swapState.buy.assetId === assetId)
    ) {
      swapAssets();
    } else {
      const amount = inputsState[mode].amount;
      setSwapState((prev) => ({
        ...prev,
        [mode]: {
          amount,
          assetId,
        },
      }));
      setInputsState((prev) => ({
        ...prev,
        [mode]: { amount },
      }));
    }

    setSwapCoins((prev) => ({
      ...prev,
      [mode]: assetId,
    }));

    setActiveMode(mode);
    closeCoinsModal();
  };

  const {
    fetchTxCost,
    txCostPending,
    txCostError,
    resetTxCost,
    triggerSwap,
    swapPending,
    swapResult,
    swapError,
    resetSwap,
  } = useSwap({
    swapState,
    mode: activeMode,
    slippage,
    pools: previewData?.pools,
  });

  const handleSwapClick = async () => {
    if (!sufficientEthBalance) {
      openNewTab(`${FuelAppUrl}/bridge?from=eth&to=fuel&auto_close=true`);
      return;
    }

    if (!sellValue || !buyValue || swapPending) return;

    previewStateRef.current = swapState;

    try {
      const txCostData = await fetchTxCost();

      if (txCostData?.txCost.gasPrice) {
        setTxCost(txCostData.txCost.gasPrice.toNumber() / 1e9);
      }

      if (txCostData?.tx) {
        const result = await triggerSwap(txCostData.tx);
        if (result) {
          openSuccess();
          await refetchBalances();
          void clientAxios.get(`${BackendUrl}/pools/`).catch(console.error);
          void clientAxios
            .get(`${BackendUrl}/platform/transactions/update`)
            .catch(console.error);
        }
      }
    } catch (e) {
      console.error(e);
      if (
        e instanceof Error &&
        !e.message.includes("User canceled sending transaction")
      ) {
        openFailure();
      }
    }
  };

  const insufficientBalance = (() => {
    try {
      const parsed = bn.parseUnits(sellValue, sellMetadata?.decimals ?? 0);
      return sellBalanceValue.lt(parsed);
    } catch {
      return true;
    }
  })();

  const swapDisabled =
    !isValidNetwork ||
    !swapState.sell.assetId ||
    !swapState.buy.assetId ||
    insufficientBalance ||
    !!previewError ||
    !sellValue ||
    !buyValue;

  const exchangeRate = useExchangeRate(swapState);
  const feePercent =
    previewData?.pools.reduce((acc, pool) => acc + (pool[2] ? 0.05 : 0.3), 0) ??
    0;

  const feeValue = ((feePercent / 100) * parseFloat(sellValue)).toFixed(
    sellMetadata?.decimals ?? 0
  );

  const sellAssetPrice = useAssetPrice(swapState.sell.assetId);
  const buyAssetPrice = useAssetPrice(swapState.buy.assetId);

  const previewPrice = useMemo(() => {
    const sellAmt = parseFloat(swapState.sell.amount);
    const buyAmt = parseFloat(swapState.buy.amount);
    return isNaN(sellAmt) || isNaN(buyAmt) ? undefined : buyAmt / sellAmt;
  }, [swapState]);

  const { reservesPrice } = useReservesPrice({
    pools: previewData?.pools,
    sellAssetId: swapState.sell.assetId,
    buyAssetId: swapState.buy.assetId,
  });

  return (
    <>
      <div className="p-4 lg:p-6 text-white space-y-4 border border-transparent rounded-md w-full 2xl:w-[350px]">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">Swap</p>
          <div className="flex gap-2">
            <div
              onClick={openSettingsModal}
              className="flex items-center px-4 py-2 gap-2 rounded-lg bg-white/10 hover:bg-green-400/30 border border-transparent hover:border-green-400/70 cursor-pointer"
            >
              <p className="text-sm text-white/60 font-medium">
                {slippage / 100}% slippage
              </p>
            </div>
            <IconButton onClick={openSettingsModal}>
              <SettingsIcon />
            </IconButton>
          </div>
        </div>

        <CurrencyBox
          value={sellValue}
          assetId={swapState.sell.assetId}
          symbol={sellMetadata?.symbol}
          name={sellMetadata?.name}
          decimals={sellMetadata?.decimals}
          icon={sellMetadata?.icon}
          mode="sell"
          balance={sellBalanceValue}
          setAmount={setAmount("sell")}
          swapPending={swapPending}
          loading={activeMode === "buy" && previewLoading}
          onCoinSelectorClick={handleCoinSelectorClick}
          usdRate={sellAssetPrice.price}
          previewError={activeMode === "buy" ? previewError : null}
        />

        <div className="flex justify-center items-center gap-4">
          <div className="h-[1px] w-full bg-[#E5E9EB]" />
          <IconButton onClick={swapAssets}>
            <IoSwapVertical />
          </IconButton>
          <div className="h-[1px] w-full bg-[#E5E9EB]" />
        </div>

        <CurrencyBox
          value={buyValue}
          assetId={swapState.buy.assetId}
          symbol={buyMetadata?.symbol}
          name={buyMetadata?.name}
          decimals={buyMetadata?.decimals}
          icon={buyMetadata?.icon}
          mode="buy"
          balance={buyBalanceValue}
          setAmount={setAmount("buy")}
          swapPending={swapPending}
          loading={activeMode === "sell" && previewLoading}
          onCoinSelectorClick={handleCoinSelectorClick}
          usdRate={buyAssetPrice.price}
          previewError={activeMode === "sell" ? previewError : null}
        />

        {isConnected && (
          <ActionButton
            onClick={handleSwapClick}
            disabled={swapDisabled}
            loading={balancesPending || txCostPending}
            variant="green"
          >
            {swapPending
              ? "Waiting for approval in wallet"
              : !sufficientEthBalance
              ? "Bridge ETH to Fuel"
              : insufficientBalance
              ? "Insufficient balance"
              : "Swap"}
          </ActionButton>
        )}

        {!isConnected && (
          <ActionButton
            onClick={connect}
            loading={isConnecting}
            variant="green"
          >
            Connect Wallet
          </ActionButton>
        )}

        {swapPending && (
          <div className="text-sm text-[#757575] space-y-2.5">
            <div className="flex justify-between">
              <p>Rate</p>
              <p className="text-white/80 font-semibold">{exchangeRate}</p>
            </div>
            <div className="flex justify-between">
              <p>Order Routing</p>
              <div className="flex gap-2">
                {previewData?.pools.map((pool, i) => (
                  <React.Fragment key={createPoolKey(pool)}>
                    <SwapRouteItem pool={pool} />
                    {i < (previewData.pools.length ?? 1) - 1 && (
                      <p className="ml-2 text-white/80">+</p>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <p>Estimated Fees</p>
              <p className="text-white/80 font-semibold">
                {feeValue} {sellMetadata?.symbol}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Network Cost</p>
              <p className="text-white/80 font-semibold">
                {txCost?.toFixed(9)} ETH
              </p>
            </div>
          </div>
        )}

        <div
          className={clsx(reservesPrice || previewPrice ? "pt-3 pb-2" : "h-0")}
        >
          <PriceImpact
            reservesPrice={reservesPrice}
            previewPrice={previewPrice}
          />
          <ExchangeRate swapState={swapState} />
        </div>
      </div>

      <SettingsModal title="Settings">
        <SettingsModalContent
          slippage={slippage}
          slippageMode={slippageMode}
          setSlippage={setSlippage}
          setSlippageMode={setSlippageMode}
          closeModal={closeSettingsModal}
        />
      </SettingsModal>

      <CoinsModal title="Choose Token">
        <CoinsListModal selectCoin={handleCoinSelection} balances={balances} />
      </CoinsModal>

      <SuccessModal title={<></>}>
        <SwapSuccessModal
          swapState={previewStateRef.current}
          transactionHash={swapResult?.id}
        />
      </SuccessModal>

      <FailureModal title={<></>} onClose={refetchPreview}>
        <SwapFailureModal
          error={txCostError || swapError}
          closeModal={closeFailureModal}
        />
      </FailureModal>
    </>
  );
};

export default SwapForm;
