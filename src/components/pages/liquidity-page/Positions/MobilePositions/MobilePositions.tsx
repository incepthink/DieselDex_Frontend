import MobilePositionItem from "@/components/pages/liquidity-page/Positions/MobilePositions/MobilePositionItem/MobilePositionItem";

import styles from "./MobilePositions.module.css";
import { PoolId } from "disel-dex-ts";
import { Fragment, useCallback } from "react";
import { createPoolKey } from "@/utils/common";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Position } from "@/hooks/usePositions";

type Props = {
  positions: Position[] | undefined;
};

const MobilePositions = ({ positions }: Props) => {
  const router = useRouter();

  const openPosition = useCallback(
    (poolId: PoolId) => {
      const poolKey = createPoolKey(poolId);
      router.push(`/liquidity/position?pool=${poolKey}`);
    },
    [router]
  );

  if (!positions) {
    return null;
  }

  return (
    <div
      style={{
        boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
      }}
      className={clsx(
        " bg-white/10 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
        styles.mobilePositions,
        "mobileOnly"
      )}
    >
      {positions.map((position, index) => {
        return (
          <Fragment key={createPoolKey(position.poolId)}>
            <MobilePositionItem
              position={position}
              onClick={() => openPosition(position.poolId)}
            />
            {index !== positions.length - 1 && (
              <div className={styles.separator} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default MobilePositions;
