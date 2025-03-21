import useAssetMetadata from "@/hooks/useAssetMetadata";
import { B256Address, formatUnits } from "fuels";
import { buildPoolId } from "disel-dex-ts";
import styles from "./DesktopPosition.module.css";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import Link from "next/link";
import { createPoolKey } from "@/utils/common";

interface Props {
  assetIdA: B256Address;
  assetIdB: B256Address;
  amountA: string;
  amountB: string;
  isStablePool: boolean;
}

export const DesktopPosition = ({
  assetIdA,
  assetIdB,
  amountA,
  amountB,
  isStablePool,
}: Props) => {
  const assetAMetadata = useAssetMetadata(assetIdA);
  const assetBMetadata = useAssetMetadata(assetIdB);

  const coinAAmount = formatUnits(amountA, assetAMetadata.decimals);
  const coinBAmount = formatUnits(amountB, assetBMetadata.decimals);

  const poolId = buildPoolId(assetIdA, assetIdB, isStablePool);
  const poolKey = createPoolKey(poolId);
  const positionPath = `/liquidity/position?pool=${poolKey}`;

  return (
    <tr className={styles.positionRow}>
      <td>
        <Link href={positionPath}>
          <CoinPair
            firstCoin={assetIdA}
            secondCoin={assetIdB}
            isStablePool={poolId[2]}
            withPoolDescription
          />
        </Link>
      </td>
      <td>
        <Link href={positionPath}>
          {`${coinAAmount} ${assetAMetadata.symbol} <> ${coinBAmount} ${assetBMetadata.symbol}`}
        </Link>
      </td>
      <td className={styles.labelCell}>
        <Link
          className="text-[rgb(0,234,130)] font-medium hover:text-[rgba(0,234,130,0.6)]"
          href={positionPath}
        >
          Active
        </Link>
      </td>
    </tr>
  );
};
