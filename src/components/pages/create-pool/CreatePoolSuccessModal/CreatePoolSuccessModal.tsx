import styles from "../CreatePool/AddLiquidity.module.css";
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

const CreatePoolSuccessModal = ({
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
    <div className='flex flex-col items-center justify-center gap-6'>
      <p className='text-2xl font-bold text-center'>Success</p>
      <p className='text-base text-center'>{subText}</p>
      <ActionButton
        onClick={handleViewTransactionClick}
        className={styles.viewButton}
      >
        View transaction
      </ActionButton>
    </div>
  );
};

export default CreatePoolSuccessModal;
