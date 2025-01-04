import useMiraDex from "@/hooks/useMiraDex/useMiraDex";
import { useMutation } from "@tanstack/react-query";
import { useWallet } from "@fuels/react";
import { useCallback } from "react";
import { DefaultTxParams, MaxDeadline } from "@/utils/constants";
import { bn } from "fuels";
import { useAssetMinterContract } from "./useAssetMinterContract";
import useAssetMetadata from "./useAssetMetadata";

type Props = {
  firstAsset: string;
  firstAssetAmount: string;
  secondAsset: string;
  secondAssetAmount: string;
  isPoolStable: boolean;
};

const useCreatePool = ({
  firstAsset,
  firstAssetAmount,
  secondAsset,
  secondAssetAmount,
  isPoolStable,
}: Props) => {
  const mira = useMiraDex();
  const { wallet } = useWallet();
  console.log(firstAsset);
  console.log(secondAsset);

  const firstAssetContract = useAssetMinterContract(firstAsset);
  const secondAssetContract = useAssetMinterContract(secondAsset);
  const firstAssetMetadata = useAssetMetadata(firstAsset);
  const secondAssetMetadata = useAssetMetadata(secondAsset);

  const mutationFn = useCallback(async () => {
    if (
      !mira ||
      !wallet ||
      !firstAssetContract.contractId ||
      !secondAssetContract.contractId ||
      !firstAssetContract.subId ||
      !secondAssetContract.subId
    ) {
      return;
    }

    console.log(
      "-----firstAssetAmount",
      firstAssetAmount,
      firstAssetMetadata.decimals
    );
    console.log(
      "-----secondAssetAmount",
      secondAssetAmount,
      secondAssetMetadata.decimals
    );

    const firstCoinAmountToUse = bn.parseUnits(
      firstAssetAmount,
      firstAssetMetadata.decimals || 0
    );
    const secondCoinAmountToUse = bn.parseUnits(
      secondAssetAmount,
      secondAssetMetadata.decimals || 0
    );

    console.log("firstAssetContractID:", firstAssetContract.contractId);
    console.log("firstAssetContractsubID", firstAssetContract.subId);
    console.log("secondAssetContractID", secondAssetContract.contractId);
    console.log("secondAssetContractsubID", secondAssetContract.subId);
    console.log("isPoolStable", isPoolStable);
    console.log("--------firstCoinAmountToUse", firstCoinAmountToUse);
    console.log("--------secondCoinAmountToUse", secondCoinAmountToUse);
    console.log("MaxDeadline", MaxDeadline);
    console.log("DefaultTxParams", DefaultTxParams);

    const txRequest = await mira.createPoolAndAddLiquidity(
      firstAssetContract.contractId,
      firstAssetContract.subId,
      secondAssetContract.contractId,
      secondAssetContract.subId,
      isPoolStable,
      firstCoinAmountToUse,
      secondCoinAmountToUse,
      MaxDeadline,
      DefaultTxParams
    );
    const gasCost = await wallet.getTransactionCost(txRequest);
    const fundedTx = await wallet.fund(txRequest, gasCost);
    const tx = await wallet.sendTransaction(fundedTx);
    return await tx.waitForResult();
  }, [
    mira,
    wallet,
    firstAssetContract,
    secondAssetContract,
    firstAssetMetadata,
    secondAssetMetadata,
    firstAssetAmount,
    secondAssetAmount,
    isPoolStable,
  ]);

  const { data, mutateAsync, isPending } = useMutation({
    mutationFn,
  });

  return {
    createPoolData: data,
    createPool: mutateAsync,
    isPoolCreationPending: isPending,
  };
};

export default useCreatePool;
