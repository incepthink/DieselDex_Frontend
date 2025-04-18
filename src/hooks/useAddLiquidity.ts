import { useMutation } from "@tanstack/react-query";
import useMiraDex from "@/hooks/useMiraDex/useMiraDex";
import { useCallback } from "react";
import { useWallet } from "@fuels/react";
import { DefaultTxParams, MaxDeadline } from "@/utils/constants";
import { BN } from "fuels";
import { buildPoolId } from "disel-dex-ts";

type Props = {
  firstAsset: string;
  firstAssetAmount: BN;
  secondAsset: string;
  secondAssetAmount: BN;
  isPoolStable: boolean;
};

const useAddLiquidity = ({
  firstAsset,
  firstAssetAmount,
  secondAsset,
  secondAssetAmount,
  isPoolStable,
}: Props) => {
  const mira = useMiraDex();
  const { wallet } = useWallet();

  const mutationFn = useCallback(async () => {
    if (!mira || !wallet) {
      return;
    }

    const poolId = buildPoolId(firstAsset, secondAsset, isPoolStable);

    let asset0Amount;
    let asset1Amount;
    if (poolId[0].bits === firstAsset && poolId[1].bits === secondAsset) {
      asset0Amount = firstAssetAmount;
      asset1Amount = secondAssetAmount;
    } else if (
      poolId[0].bits === secondAsset &&
      poolId[1].bits === firstAsset
    ) {
      asset0Amount = secondAssetAmount;
      asset1Amount = firstAssetAmount;
    } else {
      throw new Error("Invalid pool id or asset configs");
    }
    console.log("asset0amt useAddliquidity", asset0Amount);
    console.log("asset1amt useAddliquidity", asset1Amount);

    const minAsset0Amount = asset0Amount.mul(99).div(100);
    const minAsset1Amount = asset1Amount.mul(99).div(100);
    const txRequest = await mira.addLiquidity(
      poolId,
      asset0Amount,
      asset1Amount,
      minAsset0Amount,
      minAsset1Amount,
      MaxDeadline,
      DefaultTxParams
    );
    const gasCost = await wallet.getTransactionCost(txRequest);
    const fundedTx = await wallet.fund(txRequest, gasCost);
    const tx = await wallet.sendTransaction(fundedTx, {
      estimateTxDependencies: true,
    });
    return await tx.waitForResult();
  }, [
    mira,
    wallet,
    firstAsset,
    secondAsset,
    isPoolStable,
    firstAssetAmount,
    secondAssetAmount,
  ]);

  const { data, mutateAsync, isPending, error } = useMutation({
    mutationFn,
  });

  return { data, mutateAsync, isPending, error };
};

export default useAddLiquidity;
