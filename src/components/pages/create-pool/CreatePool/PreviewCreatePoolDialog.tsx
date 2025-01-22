import styles from "./AddLiquidity.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import Coin from "@/components/common/Coin/Coin";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import useModal from "@/hooks/useModal/useModal";
import CreatePoolSuccessModal from "../CreatePoolSuccessModal/CreatePoolSuccessModal";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import useCreatePool from "@/hooks/useCreatePool";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import clsx from "clsx";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";

type AssetsData = {
  assetId: string;
  amount: string;
};

export type CreatePoolPreviewData = {
  assets: AssetsData[];
  isStablePool: boolean;
};

type Props = {
  previewData: CreatePoolPreviewData;
};

const PreviewCreatePoolDialog = ({ previewData }: Props) => {
  const [SuccessModal, openSuccessModal] = useModal();
  const firstAssetMetadata = useAssetMetadata(previewData.assets[0].assetId);
  const secondAssetMetadata = useAssetMetadata(previewData.assets[1].assetId);

  const router = useRouter();

  const { assets, isStablePool } = previewData;

  const { createPoolData, createPool, isPoolCreationPending } = useCreatePool({
    firstAsset: assets[0].assetId,
    firstAssetAmount: assets[0].amount,
    secondAsset: assets[1].assetId,
    secondAssetAmount: assets[1].amount,
    isPoolStable: isStablePool,
  });
  console.log("PREVIEW DATA", previewData);

  const firstCoinAmount = previewData.assets[0].amount;
  const secondCoinAmount = previewData.assets[1].amount;

  // const rate = (
  //   parseFloat(firstCoinAmount) / parseFloat(secondCoinAmount)
  // ).toLocaleString(DefaultLocale, { minimumFractionDigits: 2 });

  const handleCreateLiquidity = useCallback(async () => {
    const data = await createPool();

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
  }, [createPool, openSuccessModal]);

  const redirectToLiquidity = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const feeText = isStablePool ? "0.05%" : "0.3%";

  return (
    <>
      <div className={styles.section}>
        <div className={styles.previewCoinPair}>
          <CoinPair
            firstCoin={previewData.assets[0].assetId}
            secondCoin={previewData.assets[1].assetId}
            isStablePool={isStablePool}
          />
        </div>
        <div
          // style={{
          //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          // }}
          //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
          className={clsx(
            "bg-white/10 text-white backdrop-blur-2xl ",
            styles.inputsPreview
          )}
        >
          <div className={styles.inputPreviewRow}>
            <Coin assetId={previewData.assets[0].assetId} />
            <p>{firstCoinAmount}</p>
          </div>
          <div className={styles.inputPreviewRow}>
            <Coin assetId={previewData.assets[1].assetId} />
            <p>{secondCoinAmount}</p>
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
      <ActionButton
        loading={isPoolCreationPending}
        onClick={handleCreateLiquidity}
        variant="green"
      >
        Create pool
      </ActionButton>
      <SuccessModal title={<></>} onClose={redirectToLiquidity}>
        <CreatePoolSuccessModal
          coinA={firstAssetMetadata.symbol || null}
          coinB={secondAssetMetadata.symbol || null}
          firstCoinAmount={firstCoinAmount}
          secondCoinAmount={secondCoinAmount}
          transactionHash={createPoolData?.id}
        />
      </SuccessModal>
    </>
  );
};

export default PreviewCreatePoolDialog;
