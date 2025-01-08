import SuccessIcon from "@/components/icons/Success/SuccessIcon";
import styles from "./SwapSuccessModal.module.css";
import { SwapState } from "@/app/swap/SwapForm";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import { useCallback } from "react";
import { openNewTab } from "@/utils/common";
import { FuelAppUrl } from "@/utils/constants";
import useAssetMetadata from "@/hooks/useAssetMetadata";

type Props = {
  swapState: SwapState;
  transactionHash: string | undefined;
};

const SwapSuccessModal = ({ swapState, transactionHash }: Props) => {
  const sellMetadata = useAssetMetadata(swapState.sell.assetId);
  const buyMetadata = useAssetMetadata(swapState.buy.assetId);

  const handleViewTransactionClick = useCallback(() => {
    if (!transactionHash) {
      return;
    }

    openNewTab(`${FuelAppUrl}/tx/${transactionHash}/simple`);
  }, [transactionHash]);

  const subText = `${swapState.sell.amount} ${sellMetadata.symbol} for ${swapState.buy.amount} ${buyMetadata.symbol}`;

  return (
    <div className={styles.claimFailureModal}>
      <SuccessIcon />
      <p className={styles.mainText}>Swap success</p>
      <p className={styles.subText}>{subText}</p>
      <ActionButton
        onClick={handleViewTransactionClick}
        className={styles.viewButton}
      >
        View transaction
      </ActionButton>
    </div>
  );
};

export default SwapSuccessModal;
