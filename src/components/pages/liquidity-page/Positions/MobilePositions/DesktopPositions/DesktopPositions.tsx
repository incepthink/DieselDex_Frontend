import styles from "./DesktopPositions.module.css";
import { createPoolKey } from "@/utils/common";
import { clsx } from "clsx";
import { DesktopPosition } from "./DesktopPosition";
import { Position } from "@/hooks/usePositions";

type Props = {
  positions: Position[] | undefined;
};

const DesktopPositions = ({ positions }: Props) => {
  if (!positions) {
    return null;
  }

  return (
    <div className="rounded-xl border border-black border-opacity-20 shadow-sm overflow-auto lg:overflow-hidden">
      <table
        style={{
          boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
        }}
        className={clsx(
          "bg-white/10 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
          styles.desktopPositions,
          "desktopOnly"
        )}
      >
        <thead className="font-semibold text-[#00EA82] bg-green-400/10">
          <tr className="border-0 text-start text-sm lg:text-base">
            <th className="font-semibold">POSITIONS</th>
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
