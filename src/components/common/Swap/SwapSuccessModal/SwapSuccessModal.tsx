import SuccessIcon from "@/components/icons/Success/SuccessIcon";
import styles from "./SwapSuccessModal.module.css";
import { SwapState } from "@/app/swap/SwapForm";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import { useCallback, useEffect, useState } from "react";
import { openNewTab } from "@/utils/common";
import { FuelAppUrl } from "@/utils/constants";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import { MdOpenInNew, MdShare } from "react-icons/md";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

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

  const tweetText = `Seamlessly swapped $${sellMetadata.name} for $${buyMetadata.name} on @DieselDex_Fuel 🚀 Fast & smooth! 🔁💎 #CryptoSwap`;

  const handleShareClick = useCallback(() => {
    openNewTab(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    );
  }, [tweetText]);

  const subText = `${swapState.sell.amount} ${sellMetadata.symbol} for ${swapState.buy.amount} ${buyMetadata.symbol}`;

  return (
    <>
      <div className={styles.claimFailureModal}>
        <SuccessIcon />
        <p className={styles.mainText}>Swap success</p>
        <p className={styles.subText}>{subText}</p>
        <div className="flex gap-2 w-full">
          <ActionButton
            onClick={handleViewTransactionClick}
            className={styles.viewButton}
            variant="green"
          >
            Txn
            <MdOpenInNew className="text-xl ml-2" />
          </ActionButton>

          <ActionButton
            onClick={handleShareClick}
            className={styles.viewButton}
            variant="green"
          >
            Share
            <MdShare className="text-xl ml-2" />
          </ActionButton>
        </div>
      </div>
      <div className="">
        <Fireworks autorun={{ speed: 3, duration: 500 }} />
      </div>
    </>
  );
};

export default SwapSuccessModal;
