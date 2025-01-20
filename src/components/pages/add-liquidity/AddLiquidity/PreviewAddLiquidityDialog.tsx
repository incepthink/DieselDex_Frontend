import styles from "./AddLiquidity.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import Coin from "@/components/common/Coin/Coin";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import useAddLiquidity from "@/hooks/useAddLiquidity";
import useModal from "@/hooks/useModal/useModal";
import AddLiquiditySuccessModal from "../AddLiquiditySuccessModal/AddLiquiditySuccessModal";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useCallback } from "react";
import TransactionFailureModal from "@/components/common/TransactionFailureModal/TransactionFailureModal";
import { BN } from "fuels";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { QueryClient } from "@tanstack/react-query";
import clsx from "clsx";

type AssetsData = {
  assetId: string;
  amount: BN;
};

export type AddLiquidityPreviewData = {
  assets: AssetsData[];
  isStablePool: boolean;
};

type Props = {
  previewData: AddLiquidityPreviewData;
  setPreviewData: Dispatch<SetStateAction<AddLiquidityPreviewData | null>>;
};

const PreviewAddLiquidityDialog = ({ previewData, setPreviewData }: Props) => {
  const [SuccessModal, openSuccessModal] = useModal();
  const [FailureModal, openFailureModal, closeFailureModal] = useModal();

  const router = useRouter();

  const { assets, isStablePool } = previewData;

  const firstAssetMetadata = useAssetMetadata(assets[0].assetId);
  const secondAssetMetadata = useAssetMetadata(assets[1].assetId);

  const firstAssetAmount = assets[0].amount;
  const secondAssetAmount = assets[1].amount;

  const {
    data,
    mutateAsync,
    isPending,
    error: addLiquidityError,
  } = useAddLiquidity({
    firstAsset: previewData.assets[0].assetId,
    firstAssetAmount,
    secondAsset: previewData.assets[1].assetId,
    secondAssetAmount,
    isPoolStable: isStablePool,
  });

  const firstAssetAmountString = firstAssetAmount.formatUnits(
    firstAssetMetadata.decimals
  );
  const secondAssetAmountString = secondAssetAmount.formatUnits(
    secondAssetMetadata.decimals
  );

  // const rate = (
  //   parseFloat(firstCoinAmount) / parseFloat(secondCoinAmount)
  // ).toLocaleString(DefaultLocale, { minimumFractionDigits: 2 });

  const handleAddLiquidity = useCallback(async () => {
    try {
      const data = await mutateAsync();
      if (data?.id) {
        openSuccessModal();
        Promise.all([
          axios.get(`${BackendUrl}/pools/`).catch((error) => {
            console.error("Background pools fetch failed:", error);
          }),
        ]).catch((error) => {
          // Handle any errors that might occur in Promise.all
          console.error("Background tasks error:", error);
        });
      }
    } catch (e) {
      console.error(e);
      openFailureModal();
    }
  }, [mutateAsync, openFailureModal, openSuccessModal]);

  const onFailureModalClose = useCallback(() => {
    setPreviewData(null);
  }, [setPreviewData]);

  const redirectToLiquidity = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const feeText = isStablePool ? "0.05%" : "0.3%";

  return (
    <>
      <div className={styles.section}>
        <div className={styles.previewCoinPair}>
          <CoinPair
            firstCoin={assets[0].assetId}
            secondCoin={assets[1].assetId}
            isStablePool={isStablePool}
          />
        </div>
        <div
          style={{
            boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          }}
          className={clsx(
            "bg-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
            styles.inputsPreview
          )}
        >
          <div className={styles.inputPreviewRow}>
            <Coin assetId={assets[0].assetId} />
            <p>{firstAssetAmountString}</p>
          </div>
          <div className={styles.inputPreviewRow}>
            <Coin assetId={assets[1].assetId} />
            <p>{secondAssetAmountString}</p>
          </div>
          <div className="border-t-2 flex justify-between pt-2 border-neutral-300 mt-2">
            <p className="font-bold">Fee tier</p>
            <p>{feeText}</p>
          </div>
        </div>
      </div>
      {/* <div className={styles.section}>
        <p>Selected Price</p>
        <div className={styles.sectionContent}>
          <div className={styles.previewPriceBlocks}>
            <div className={styles.previewPriceBlock}>
              <p className={styles.previewPriceBlockTitle}>
                Low price
              </p>
              <p className={styles.previewPriceBlockValue}>
                0
              </p>
              <p className={styles.previewPriceBlockExchange}>
                {coinA} per {coinB}
              </p>
              <p className={styles.previewPriceBlockDescription}>
                Your position will be 100% composed of {coinA} at this price
              </p>
            </div>
            <div className={styles.previewPriceBlock}>
              <p className={styles.previewPriceBlockTitle}>
                High price
              </p>
              <p className={styles.previewPriceBlockValue}>
                ∞
              </p>
              <p className={styles.previewPriceBlockExchange}>
                {coinA} per {coinB}
              </p>
              <p className={styles.previewPriceBlockDescription}>
                Your position will be 100% composed of {coinB} at this price
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.previewCurrentPriceBlock}>
          <p className={styles.previewPriceBlockTitle}>
            Current Price
          </p>
          <p className={styles.previewPriceBlockValue}>
            {rate}
          </p>
          <p className={styles.previewPriceBlockExchange}>
            {coinA} per {coinB}
          </p>
        </div>
      </div> */}
      <ActionButton loading={isPending} onClick={handleAddLiquidity}>
        Add Liquidity
      </ActionButton>
      <SuccessModal title={<></>} onClose={redirectToLiquidity}>
        <AddLiquiditySuccessModal
          coinA={firstAssetMetadata.symbol || null}
          coinB={secondAssetMetadata.symbol || null}
          firstCoinAmount={firstAssetAmountString}
          secondCoinAmount={secondAssetAmountString}
          transactionHash={data?.id}
        />
      </SuccessModal>
      <FailureModal title={<></>} onClose={onFailureModalClose}>
        <TransactionFailureModal
          error={addLiquidityError}
          closeModal={closeFailureModal}
        />
      </FailureModal>
    </>
  );
};

export default PreviewAddLiquidityDialog;
