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
      return null; // Explicitly return null instead of undefined
    }

    const firstCoinAmountToUse = bn.parseUnits(
      firstAssetAmount,
      firstAssetMetadata.decimals || 0
    );
    const secondCoinAmountToUse = bn.parseUnits(
      secondAssetAmount,
      secondAssetMetadata.decimals || 0
    );

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

    try {
      const gasCost = await wallet.getTransactionCost(txRequest);
      const fundedTx = await wallet.fund(txRequest, gasCost);
      const tx = await wallet.sendTransaction(fundedTx);
      return await tx.waitForResult(); // Ensure the transaction result is returned
    } catch (err) {
      console.error("Simulation failed:", err);
      return null; // Return null explicitly to prevent TypeScript issues
    }
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

  const { data, mutateAsync, isPending } = useMutation<{ id: string } | null>({ // Explicitly define the expected return type
    mutationFn,
  });

  return {
    createPoolData: data,
    createPool: mutateAsync,
    isPoolCreationPending: isPending,
  };
};

export default useCreatePool;
