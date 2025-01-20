import MobilePoolItem from "@/components/pages/liquidity-page/pools/mobilePools/MobilePoolItem/MobilePoolItem";

import styles from "./MobilePools.module.css";
import { Fragment } from "react";
import { clsx } from "clsx";
import { PoolData } from "@/hooks/usePoolsData";

type Props = {
  poolsData: PoolData[] | undefined;
};

const MobilePools = ({ poolsData }: Props) => {
  if (!poolsData) {
    return null;
  }

  return (
    <div
      // style={{
      //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
      // }}
      //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
      className={clsx(
        " bg-white/10 backdrop-blur-2xl ",
        styles.mobilePools,
        "mobileOnly"
      )}
    >
      {poolsData.map((poolData) => {
        if (!poolData) {
          return null;
        }

        return (
          <Fragment key={poolData.id}>
            <MobilePoolItem poolData={poolData} />
            {poolsData.indexOf(poolData) !== poolsData.length - 1 && (
              <div className={styles.separator} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default MobilePools;
