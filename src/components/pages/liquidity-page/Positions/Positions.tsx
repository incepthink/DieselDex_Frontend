import MobilePositions from "@/components/pages/liquidity-page/Positions/MobilePositions/MobilePositions";

import styles from "./Positions.module.css";
import DesktopPositions from "@/components/pages/liquidity-page/Positions/MobilePositions/DesktopPositions/DesktopPositions";
import usePositions from "@/hooks/usePositions";
import DocumentIcon from "@/components/icons/Document/DocumentIcon";
import LoaderV2 from "@/components/common/LoaderV2/LoaderV2";

const Positions = () => {
  const { data, isLoading } = usePositions();
  console.log(data);

  return (
    <section className={styles.positions}>
      <p className={styles.positionsTitle}>Your Positions</p>
      {isLoading ? (
        <div className={styles.positionsFallback}>
          <LoaderV2 />
          <p>Loading positions...</p>
        </div>
      ) : (data && data.length === 0) || !data ? (
        <div className={styles.positionsFallback}>
          <div className={styles.fallbackTop}>
            <div className={styles.icon}>
              <DocumentIcon />
            </div>
            <p>Your liquidity will appear here</p>
          </div>
          {/*<button className={styles.viewArchivedButton}>*/}
          {/*  View archive positions*/}
          {/*</button>*/}
        </div>
      ) : (
        <>
          <MobilePositions positions={data} />
          <DesktopPositions positions={data} />
        </>
      )}
    </section>
  );
};

export default Positions;
