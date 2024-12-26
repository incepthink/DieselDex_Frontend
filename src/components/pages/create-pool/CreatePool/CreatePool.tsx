import styles from "./AddLiquidity.module.css";
import { useCallback, useState } from "react";
import { CreatePoolPreviewData } from "./PreviewCreatePoolDialog";
import CreatePoolDialog from "./CreatePoolDialog";
import BackLink from "@/components/common/BackLink/BackLink";
import { useRouter } from "next/navigation";
import IconButton from "@/components/common/IconButton/IconButton";
import CloseIcon from "@/components/icons/Close/CloseIcon";
import dynamic from "next/dynamic";

const PreviewCreatePoolDialog = dynamic(
  () => import("./PreviewCreatePoolDialog"),
  { ssr: false }
);

const CreatePool = () => {
  const router = useRouter();

  const [previewData, setPreviewData] = useState<CreatePoolPreviewData | null>(
    null
  );

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
          <p className={styles.title}>Create Pool</p>
          {showPreview && (
            <IconButton onClick={handleCloseClick}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        {showPreview ? (
          <PreviewCreatePoolDialog previewData={previewData!} />
        ) : (
          <CreatePoolDialog setPreviewData={setPreviewData} />
        )}
      </section>
    </>
  );
};

export default CreatePool;
