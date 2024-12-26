import CoinPair from "@/components/common/CoinPair/CoinPair";

import styles from "./DesktopPositions.module.css";
import { createPoolKey } from "@/utils/common";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { DesktopPosition } from "./DesktopPosition";
import { Position } from "@/hooks/usePositions";

type Props = {
  positions: Position[] | undefined;
};

const DesktopPositions = ({ positions }: Props) => {
  const router = useRouter();

  if (!positions) {
    return null;
  }

  return (
    <div className='rounded-xl border border-black border-opacity-20 shadow-sm overflow-auto lg:overflow-hidden'>
      <table className={clsx(styles.desktopPositions, "desktopOnly")}>
        <thead className='font-semibold text-[#84919A] bg-[#F6F8F9] '>
          <tr className='border-0 text-start text-sm lg:text-base'>
            <th className='font-semibold'>POSITIONS</th>
            <th>SIZE</th>
            <th>
              {/*<button className={styles.hideButton}>*/}
              {/*  Hide closed positions*/}
              {/*</button>*/}
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <DesktopPosition
              key={createPoolKey(position.poolId)}
              assetIdA={position.token0Position[0].bits}
              assetIdB={position.token1Position[0].bits}
              amountA={position.token0Position[1].toString()}
              amountB={position.token1Position[1].toString()}
              isStablePool={position.isStable}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopPositions;
