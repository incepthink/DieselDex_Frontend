import { memo } from "react";
import { clsx } from "clsx";
import { BN, CoinQuantity } from "fuels";

import styles from "./CoinListItem.module.css";
import { useAssetImage } from "@/hooks/useAssetImage";
import useAssetMetadata from "@/hooks/useAssetMetadata";

type Props = {
  assetId: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  balance?: CoinQuantity | undefined;
};

const CoinListItem = ({ assetId, balance, name, symbol, decimals }: Props) => {
  const balanceValue = balance?.amount ?? new BN(0);
  const icon = useAssetImage(assetId);

  return (
    <span className={clsx(styles.coin, !name && styles.centered)}>
      {icon && <img src={icon} alt={`${name} icon`} />}
      <div className={styles.names}>
        <p className={styles.name}>{symbol}</p>
        <p className={styles.fullName}>{name}</p>
      </div>
      {balanceValue.gt(0) && (
        <p className={styles.balance}>
          {balanceValue.formatUnits(decimals || 0)}
        </p>
      )}
    </span>
  );
};

export default memo(CoinListItem);
