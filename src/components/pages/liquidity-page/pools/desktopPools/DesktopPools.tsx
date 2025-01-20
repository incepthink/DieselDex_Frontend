import styles from "./DesktopPools.module.css";
import { clsx } from "clsx";
import { PoolData } from "@/hooks/usePoolsData";
import DesktopPoolRow from "./DesktopPoolRow";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Link from "next/link";

type Props = {
  poolsData: PoolData[] | undefined;
};

const DesktopPools = ({ poolsData }: Props) => {
  if (!poolsData) {
    return null;
  }

  return (
    <table
      style={{
        boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
      }}
      className={clsx(
        "bg-white/10 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
        styles.desktopPools,
        "desktopOnly"
      )}
    >
      <thead className="font-semibold text-[#00EA82] bg-green-400/10">
        <tr>
          <th>POOLS</th>
          <th>APR</th>
          <th>VOLUME</th>
          <th>TVL</th>
          <th>
            <Link href="/liquidity/create-pool">
              <ActionButton className={styles.createButton} fullWidth={false}>
                Create Pool
              </ActionButton>
            </Link>
          </th>
        </tr>
      </thead>
      <tbody>
        {poolsData.map((poolData) => (
          <DesktopPoolRow key={poolData.id} poolData={poolData} />
        ))}
      </tbody>
    </table>
  );
};

export default DesktopPools;
