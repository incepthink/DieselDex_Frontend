import ActionButton from "@/components/common/ActionButton/ActionButton";
import CoinPair from "@/components/common/CoinPair/CoinPair";
import { PoolData } from "@/hooks/usePoolsData";
import { createPoolIdFromIdString, createPoolKey } from "@/utils/common";
import { DefaultLocale } from "@/utils/constants";
import Link from "next/link";
import styles from "./DesktopPools.module.css";
import clsx from "clsx";

export default function DesktopPoolRow({ poolData }: { poolData: PoolData }) {
  if (!poolData) {
    return null;
  }

  const { id } = poolData;

  const poolId = createPoolIdFromIdString(id);
  const key = createPoolKey(poolId);

  let aprValue = "n/a";
  let volumeValue = "n/a";
  let tvlValue = "n/a";

  if (poolData.details) {
    const {
      details: { apr, volume, tvl },
    } = poolData;

    if (apr && apr > 0) {
      aprValue = `${apr.toLocaleString(DefaultLocale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;
    }
    if (tvl && tvl > 0) {
      tvlValue = `$${tvl.toLocaleString(DefaultLocale, {
        maximumFractionDigits: 0,
      })}`;
    }
    if (volume && parseFloat(volume) > 0) {
      volumeValue = `$${parseFloat(volume).toLocaleString(DefaultLocale, {
        maximumFractionDigits: 0,
      })}`;
    }
  }

  return (
    <tr key={key} className="mt-2">
      <td className="pl-4">
        <CoinPair
          firstCoin={poolData.details.asset0Id}
          secondCoin={poolData.details.asset1Id}
          isStablePool={poolId[2]}
          withPoolDescription
        />
      </td>
      <td className={clsx(!aprValue && styles.pending)}>
        {aprValue ?? "Awaiting data"}
      </td>
      <td>{volumeValue}</td>
      <td>{tvlValue}</td>
      <td className="pr-4">
        <Link href={`/liquidity/add?pool=${poolData.id}`}>
          <ActionButton className={styles.addButton} variant="highlight">
            Add Liquidity
          </ActionButton>
        </Link>
      </td>
    </tr>
  );
}
