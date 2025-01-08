import styles from "./AddLiquidity.module.css";
import { useCallback, useState } from "react";
import PreviewAddLiquidityDialog, {
  AddLiquidityPreviewData,
} from "./PreviewAddLiquidityDialog";
import AddLiquidityDialog from "./AddLiquidityDialog";
import BackLink from "@/components/common/BackLink/BackLink";
import { useRouter } from "next/navigation";
import IconButton from "@/components/common/IconButton/IconButton";
import CloseIcon from "@/components/icons/Close/CloseIcon";
import { PoolId } from "mira-dex-ts";

type Props = {
  poolId: PoolId;
};

const AddLiquidity = ({ poolId }: Props) => {
  const router = useRouter();

  const [previewData, setPreviewData] =
    useState<AddLiquidityPreviewData | null>(null);

  const handleBackClick = useCallback(() => {
    if (previewData) {
      setPreviewData(null);
    } else {
      router.back();
    }
  }, [previewData, router]);

  const handleCloseClick = useCallback(() => {
    router.push("/liquidity");
  }, [router]);

  const showPreview = Boolean(previewData);

  return (
    <>
      <BackLink
        showOnDesktop
        onClick={handleBackClick}
        className={styles.backLink}
      />
      <section className={styles.addLiquidity}>
        <div className={styles.addLiquidityHeading}>
          <p className={styles.title}>Add Liquidity</p>
          {showPreview && (
            <IconButton onClick={handleCloseClick}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        {showPreview ? (
          <PreviewAddLiquidityDialog
            previewData={previewData!}
            setPreviewData={setPreviewData}
          />
        ) : (
          <AddLiquidityDialog poolId={poolId} setPreviewData={setPreviewData} />
        )}
      </section>
      {/* {showPreview && <div className={styles.loadingOverlay} />} */}
    </>
  );
};

export default AddLiquidity;
