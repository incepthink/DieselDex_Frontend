import MobilePositions from "@/components/pages/liquidity-page/Positions/MobilePositions/MobilePositions";

import styles from "./Positions.module.css";
import DesktopPositions from "@/components/pages/liquidity-page/Positions/MobilePositions/DesktopPositions/DesktopPositions";
import usePositions from "@/hooks/usePositions";
import DocumentIcon from "@/components/icons/Document/DocumentIcon";
import LoaderV2 from "@/components/common/LoaderV2/LoaderV2";
import useWindowSize from "@/hooks/useWindowSize";
import clsx from "clsx";
import axios from "axios";
import { useEffect, useState } from "react";

const Positions = () => {
  const { data, isLoading } = usePositions();
  console.log(data);

  const [pricedata, setPriceData] = useState([
    { name: "BTC", price: 0, image: "/images/bitcoin.png" },
    { name: "Fuel", price: 0, image: "/images/fuel.png" },
    { name: "ETH", price: 0, image: "/images/eth.png" },
  ]);

  const getPriceDefiLama = async () => {
    const res = await axios.get(
      "https://coins.llama.fi/prices/current/coingecko:bitcoin,coingecko:ethereum,fuel:0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82"
    );
    const fuelPrice =
      res.data.coins[
        "fuel:0x1d5d97005e41cae2187a895fd8eab0506111e0e2f3331cd3912c15c24e3c1d82"
      ].price;
    const ethPrice = res.data.coins["coingecko:ethereum"].price;
    const bitcoinPrice = res.data.coins["coingecko:bitcoin"].price;

    setPriceData([
      { name: "BTC", price: bitcoinPrice, image: "/images/bitcoin.png" },
      { name: "Fuel", price: fuelPrice, image: "/images/fuel.svg" },
      { name: "ETH", price: ethPrice, image: "/images/eth.svg" },
    ]);
  };

  useEffect(() => {
    getPriceDefiLama();
  }, []);

  const windowSize = useWindowSize();

  return (
    <section
      className={clsx(
        styles.positions
        // windowSize.width! < 1024
        //   ? (data && data.length === 0) || !data
        //     ? "pt-[500px]"
        //     : "pt-[800px]"
        //   : ""
      )}
    >
      {windowSize.width! <= 1024 && (
        <section className="w-full text-black mb-10">
          <div
            className={clsx(
              "flex flex-col justify-center items-center gap-6  "
              // windowSize.width! > 1020
              //   ? "flex-row gap-24"
              //   : "flex-col gap-10 mt-6 mb-6"
            )}
          >
            {pricedata.map((item) => {
              return (
                <div
                  style={{
                    boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
                  }}
                  className="p-8 text-white py-6 rounded-3xl bg-green-400/20 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100 flex gap-6 items-center"
                >
                  <div className="lg:w-14 w-10 lg:h-14 h-10 rounded-full overflow-hidden">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#00EA82] font-medium">
                      {item.name} Price
                    </p>
                    <p className="lg:text-2xl text-xl">${item.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

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
