import MobilePools from "@/components/pages/liquidity-page/pools/mobilePools/MobilePools";
import DesktopPools from "@/components/pages/liquidity-page/pools/desktopPools/DesktopPools";

import styles from "./Pools.module.css";
import usePoolsData from "@/hooks/usePoolsData";
import LoaderV2 from "@/components/common/LoaderV2/LoaderV2";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const Pools = () => {
  const router = useRouter();

  const handleCreatePoolClick = useCallback(() => {
    router.push("/liquidity/create-pool");
  }, [router]);

  const { data, isLoading } = usePoolsData();

  return (
    <section className={styles.pools}>
      <div className={styles.poolsHeader}>
        <p className={styles.poolsTitle}>All Pools</p>
        <ActionButton
          className={clsx("mobileOnly", styles.createButton)}
          onClick={handleCreatePoolClick}
          variant="outlined"
        >
          Create Pool
        </ActionButton>
      </div>
      <MobilePools poolsData={data} />
      <DesktopPools poolsData={data} />
      {isLoading && (
        <div className={styles.loadingFallback}>
          <LoaderV2 />
          <p>Loading pools...</p>
        </div>
      )}
    </section>
  );
};

export default Pools;
