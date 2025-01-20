import MobilePositions from "@/components/pages/liquidity-page/Positions/MobilePositions/MobilePositions";

import styles from "./Positions.module.css";
import DesktopPositions from "@/components/pages/liquidity-page/Positions/MobilePositions/DesktopPositions/DesktopPositions";
import usePositions from "@/hooks/usePositions";
import DocumentIcon from "@/components/icons/Document/DocumentIcon";
import LoaderV2 from "@/components/common/LoaderV2/LoaderV2";
import useWindowSize from "@/hooks/useWindowSize";
import clsx from "clsx";

const Positions = () => {
  const { data, isLoading } = usePositions();
  console.log(data);

  const windowSize = useWindowSize();

  return (
    <section
      className={clsx(
        styles.positions,
        windowSize.width! < 1024
          ? (data && data.length === 0) || !data
            ? "pt-[500px]"
            : "pt-[800px]"
          : ""
      )}
    >
      <p className={styles.positionsTitle}>Your Positions</p>
      {isLoading ? (
        <div className={styles.positionsFallback}>
          <LoaderV2 />
          <p>Loading positions...</p>
        </div>
      ) : (data && data.length === 0) || !data ? (
        <div
          style={{
            boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
          }}
          className={clsx(
            "bg-white/10 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100",
            styles.positionsFallback
          )}
        >
          <div className={styles.fallbackTop}>
            <div className={styles.icon}>
              <DocumentIcon />
            </div>
            <p className="font-medium text-lg">
              Your liquidity will appear here
            </p>
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
