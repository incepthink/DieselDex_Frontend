import styles from "./CoinPair.module.css";
import { clsx } from "clsx";
import { memo } from "react";
import { useAssetImage } from "@/hooks/useAssetImage";
import { B256Address } from "fuels";
import useAssetMetadata from "@/hooks/useAssetMetadata";

type Props = {
  firstCoin: B256Address;
  secondCoin: B256Address;
  isStablePool: boolean;
  withFee?: boolean;
  withFeeBelow?: boolean;
  withPoolDescription?: boolean;
  asset0symbol?: string;
  asset1symbol?: string;
};

const CoinPair = ({
  firstCoin,
  secondCoin,
  isStablePool,
  withFee,
  withFeeBelow,
  withPoolDescription,
  asset0symbol,
  asset1symbol,
}: Props) => {
  const firstCoinIcon = useAssetImage(firstCoin);
  const secondCoinIcon = useAssetImage(secondCoin);
  const { symbol: firstSymbol } = useAssetMetadata(firstCoin);
  const { symbol: secondSymbol } = useAssetMetadata(secondCoin);

  const feeText = isStablePool ? "0.05%" : "0.3%";
  const poolDescription = `${isStablePool ? "Stable" : "Volatile"}: ${feeText}`;

  return (
    <div
      className={clsx(
        styles.coinPair,
        withFeeBelow && styles.coinPairAlignStart
      )}
    >
      <div className={styles.coinPairIcons}>
        {firstCoinIcon && (
          <img src={firstCoinIcon} alt={`${firstSymbol} icon`} />
        )}
        {secondCoinIcon && (
          <img src={secondCoinIcon} alt={`${secondSymbol} icon`} />
        )}
      </div>
      <div className={styles.namesAndFee}>
        <p className={styles.coinNames} data-identifier="coin-pair">
          {asset0symbol || firstSymbol}/{asset1symbol || secondSymbol}
        </p>
        {withFeeBelow && <p className={styles.coinPairFee}>{feeText}</p>}
        {withPoolDescription && (
          <p className={styles.poolDescription}>{poolDescription}</p>
        )}
      </div>
      {withFee && <p className={styles.coinPairFee}>{feeText}</p>}
    </div>
  );
};

export default memo(CoinPair);
