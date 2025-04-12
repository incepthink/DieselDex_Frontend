"use client";
import { ChartData } from "@/app/swap/page";
import TradingViewWidget from "@/components/common/chart/TradingViewWidget";
import { useAssetImage } from "@/hooks/useAssetImage";
import useAssetMetadata from "@/hooks/useAssetMetadata";
import useChartData from "@/hooks/useChartData";
import useReadonlyMira from "@/hooks/useReadonlyMira";
import { formatCurrency } from "@/utils/chart/dataFetch";
import React, { useEffect, useState } from "react";
import ChartTransactionHistory from "../ChartTransactionHistory/ChartTransactionHistory";
import SwapForm from "@/app/swap/SwapForm";

type TimeframeOption = {
  label: string;
  minutes: number;
};

export interface SwapEvent {
  exchange_rate: string;
  time: number;
  asset_0_in: string;
  asset_0_out: string;
  asset_1_in: string;
  asset_1_out: string;
  is_buy: boolean;
  is_sell: boolean;
  transaction_id: string;
  isNew?: boolean;
  recipient?: string;
}

export interface Trade {
  price: number;
  quantity: number;
  timestamp: number;
  time?: string;
  type?: "buy" | "sell";
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

interface UserTrade extends Trade {
  type: "buy" | "sell";
  timestamp: number;
}

const TIMEFRAME_OPTIONS: TimeframeOption[] = [
  { label: "5s", minutes: 5 / 60 }, // 5 seconds
  { label: "1m", minutes: 1 }, // 1 minute
  { label: "5m", minutes: 5 },
  { label: "15m", minutes: 15 },
  { label: "1h", minutes: 60 },
  { label: "4h", minutes: 240 },
  { label: "24h", minutes: 1440 },
];
type TradingPair = "ETH/USDT" | "ETH/USDC" | "USDC/USDT";

type Props = {
  pool_id: string;
  setChartData: React.Dispatch<React.SetStateAction<ChartData>>;
  ChartData: ChartData;
};

let stats = {
  price: { usd: "0", eth: "0", lastTradeIsBuy: false },
  liquidity: { usd: 0, eth: 0, fdv: 0, mcap: 0 },
  changes: { "1H": 0, "6H": 0, "24H": 0, "1W": 0 },

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
};

let poolData = {
  id: "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e_0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07_false",
  token0Address:
    "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e",
  token1Address:
    "0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07",
  selectedPrimaryToken: {
    supply: 0,
  },
  selectedCounterPartyToken: {
    supply: 0,
    price: 0,
  },
};

const Chart = ({ pool_id, setChartData, ChartData }: Props) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userTrades, setUserTrades] = useState<UserTrade[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPair>("ETH/USDT");
  const [stats, setStats] = useState<any>(undefined);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>(
    TIMEFRAME_OPTIONS[6]
  ); // Default to 5m

  const { data, isLoading } = useChartData(ChartData);
  const [token0Address, token1Address] = ChartData.poolData.id.split("_");

  const token0meta = useAssetMetadata(token0Address);
  const token1meta = useAssetMetadata(token1Address);

  const token0img = useAssetImage(token0Address);
  const token1img = useAssetImage(token1Address);
  console.log("HOOK::", data);

  // useEffect(() => {
  //   if (data !== undefined) {
  //     setChartData({
  //       ...ChartData,
  //       trades: data.trades,
  //       stats: data.data,
  //     });
  //   }
  // }, [data]);

  return (
    <>
      <div className="flex flex-col-reverse 2xl:flex-row items-center 2xl:items-start w-full gap-12">
        <div className="flex flex-col gap-12 mb-12">
          <div className=" backdrop-blur-2xl 2xl:w-auto max-w-screen bg-fuel-dark-800 border-[#84919A] border-[0.5px]  p-[20px] rounded-[16px] bg-white/10">
            {!isLoading && (
              <div className="flex justify-between items-center xl:mb-2 mb-1">
                <div className="flex flex-col">
                  <div className="flex gap-2 text-2xl mb-2">
                    <div className="flex items-center gap-2 text-2xl font-semibold">
                      <div className="xl:w-8 xl:h-8 h-4 w-4 rounded-full overflow-hidden">
                        <img
                          src={token0img || ""}
                          alt="token0"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="xl:text-xl lg:text-lg text-base">
                        {token0meta.symbol}
                      </p>
                    </div>
                    {"/"}
                    <div className="flex items-center gap-2 text-2xl font-semibold">
                      <div className="xl:w-8 xl:h-8 h-4 w-4 rounded-full overflow-hidden">
                        <img
                          src={token1img || ""}
                          alt="token1"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="xl:text-xl lg:text-lg text-base">
                        {token1meta.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm lg:mt-1 mt-1 ml-1 font-semibold">
                    {Number(data?.data.changes["24H"].toFixed(2)) > 0 ? (
                      <p className="text-green-400">
                        {data?.data.changes["24H"].toFixed(2)}%
                      </p>
                    ) : (
                      <p className="text-[#ef5350]">
                        {data?.data.changes["24H"].toFixed(2)}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <p className="text-sm opacity-80">FDV</p>
                    <p className="font-medium lg:text-lg text-sm">
                      {data ? formatCurrency(data.data.liquidity.fdv) : 0}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm opacity-80">24H Vol</p>
                    <p className="lg:text-lg font-medium text-sm">
                      {data ? formatCurrency(data.data.transactions.volume) : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-[400px] max-h-[600px] h-[60vh]">
              {isLoading ? (
                <div className="2xl:w-[800px] w-full flex justify-center items-center h-full">
                  <img
                    src="/images/loading.gif"
                    className="w-24 object-cover"
                    alt=""
                  />
                </div>
              ) : (
                <TradingViewWidget
                  trades={data ? data.trades : []}
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe} // Add this prop
                />
              )}
            </div>
          </div>
          <div>
            <ChartTransactionHistory
              trades={data ? data.trades : []}
              chartData={ChartData}
            />
          </div>
        </div>
        <div className="border-[#84919A] border-[0.5px] rounded-[16px] w-full bg-white/10 backdrop-blur-2xl">
          <SwapForm />
        </div>
      </div>

      {stats !== undefined && (
        <div>
          <p className="mt-2">Price changes:</p>
          <div className="flex gap-4 mt-3 *:flex *:flex-col *:items-center *:gap-1">
            <div>
              <p>1H: </p>
              <p>{stats.changes["1H"].toFixed(2)}%</p>
            </div>
            <div>
              <p>1W: </p>
              <p>{stats.changes["1W"].toFixed(2)}%</p>
            </div>
            <div>
              <p>6H: </p>
              <p>{stats.changes["6H"].toFixed(2)}%</p>
            </div>
            <div>
              <p>24H: </p>
              <p>{stats.changes["24H"].toFixed(2)}%</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chart;
