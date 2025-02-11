"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import LayoutWrapper from "@/components/common/LayoutWrapper";
// import AuthLayout from "./Layout";
import Container from "@/components/common/Container";
import SwapForm from "./SwapForm";
import Chart from "@/components/common/chart/Chart";
import { IoSearch } from "react-icons/io5";
import useModal from "@/hooks/useModal/useModal";
import PoolsSearchModal from "@/components/common/Swap/PoolsSearchModal/PoolsSearchModal";
import bgMain from "../../../public/images/main-bg.jpeg";
// import RecentTrades from "./RecentTrades";
// import Chart from "./Chart";

export interface Stats {
  price: {
    usd: string;
    eth: string;
    lastTradeIsBuy: boolean;
  };
  liquidity: {
    usd: number;
    eth: number;
    fdv: number;
    mcap: number;
  };
  changes: {
    "1H": number;
    "6H": number;
    "24H": number;
    "1W": number;
  };
  transactions: {
    total: number;
    buys: number;
    sells: number;
    volume: number;
    buyVolume: number;
    sellVolume: number;
    volumeDelta: number;
    makers: number;
    buyers: number;
    sellers: number;
  };
}

export interface ChartData {
  poolData: {
    id: string;
    token0Address: string;
    token1Address: string;
    selectedPrimaryToken?: {
      supply: number;
    };
    selectedCounterPartyToken?: {
      supply: number;
      price: number;
    };
  };
  stats: Stats;
  trades: [];
}

const Swap = () => {
  const [currentPool, setCurrentPool] = useState("");
  const [PoolsModal, openPoolsModal, closePoolsModal] = useModal();
  const [ChartData, setChartData] = useState<ChartData>({
    poolData: {
      id: "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e_0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07_false",
      token0Address:
        "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e",
      token1Address:
        "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
    },
    stats: {
      price: {
        usd: "0",
        eth: "0",
        lastTradeIsBuy: false,
      },
      liquidity: {
        usd: 0,
        eth: 0,
        mcap: 0,
        fdv: 0,
      },
      changes: {
        "1H": 0,
        "6H": 0,
        "24H": 0,
        "1W": 0,
      },
      transactions: {
        total: 0,
        buys: 0,
        sells: 0,
        volume: 0,
        buyVolume: 0,
        sellVolume: 0,
        volumeDelta: 0,
        makers: 0,
        buyers: 0,
        sellers: 0,
      },
    },
    trades: [],
  });

  const handlePoolsSelectorClick = () => {
    openPoolsModal();
  };

  const handlePoolSelection = (pool: string) => {
    const [token0Address, token1Address] = pool.split("_");
    setChartData({
      ...ChartData,
      poolData: { id: pool, token0Address, token1Address },
    });
    console.log();

    closePoolsModal();
  };

  useEffect(() => {
    console.log(ChartData);
  }, [ChartData]);

  return (
    <LayoutWrapper>
      <div className="relative ">
        {/* <AuthLayout> */}
        <div className="  w-full pt-24 flex flex-col items-center px-2 ">
          <div
            className="flex items-center bg-white/20 backdrop-blur-2xl rounded-full p-2 px-3 gap-2 sm:w-1/3 w-full cursor-pointer mb-4"
            onClick={handlePoolsSelectorClick}
          >
            <IoSearch size={26} />
            <div className="bg-transparent w-full">
              {" "}
              <p className="opacity-80">Search Pools</p>
            </div>
          </div>
          <Container className="">
            <div className=" p-6 rounded-2xl">
              <Chart
                pool_id={
                  "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e_0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07_false"
                }
                setChartData={setChartData}
                ChartData={ChartData}
              />
            </div>
          </Container>
        </div>
        <PoolsModal title={"Pools"}>
          <PoolsSearchModal selectPool={handlePoolSelection} />
        </PoolsModal>
        {/* </AuthLayout> */}
      </div>
    </LayoutWrapper>
  );
};

export default Swap;
