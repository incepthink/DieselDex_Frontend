import SuccessIcon from "@/components/icons/Success/SuccessIcon";
import styles from "./AddLiquiditySuccessModal.module.css";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import { useCallback } from "react";
import { openNewTab } from "@/utils/common";
import { CoinName } from "@/utils/coinsConfig";
import { FuelAppUrl } from "@/utils/constants";

type Props = {
  coinA: CoinName;
  coinB: CoinName;
  firstCoinAmount: string;
  secondCoinAmount: string;
  transactionHash: string | undefined;
};

const AddLiquiditySuccessModal = ({
  coinA,
  coinB,
  firstCoinAmount,
  secondCoinAmount,
  transactionHash,
}: Props) => {
  const handleViewTransactionClick = useCallback(() => {
    if (!transactionHash) {
      return;
    }

    openNewTab(`${FuelAppUrl}/tx/${transactionHash}/simple`);
  }, [transactionHash]);

  const subText = `Added ${firstCoinAmount} ${coinA} and ${secondCoinAmount} ${coinB}`;

  return (
    <div className={styles.claimFailureModal}>
      <SuccessIcon />
      <p className={styles.mainText}>Success</p>
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

export default AddLiquiditySuccessModal;
