import { useQuery } from "@tanstack/react-query";
import useReadonlyMira from "./useReadonlyMira";
import {
  calculateChangeTransactions,
  calculatePrice,
  fetchTradesFromRedis,
  getLiquidityAndTokenData,
} from "@/utils/chart/dataFetch";
import { ChartData } from "@/app/swap/page";

const useChartData = (ChartData: ChartData) => {
  const miraAmm = useReadonlyMira();

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

  const { data, isLoading } = useQuery({
    queryKey: ["chartData", miraAmm, ChartData],
    queryFn: async () => {
      const trades = await fetchTradesFromRedis(ChartData.poolData.id);
      if (!trades) {
        throw new Error("Error fetching trades from Redis", trades);
      }
      const newStats = await calculateChangeTransactions(trades, "24H", stats);
      if (!newStats) {
        throw new Error("Error getting stats");
      }
      const poolData = await getLiquidityAndTokenData(ChartData, miraAmm);
      const newStats2 = await calculatePrice(poolData, trades, newStats);

      return { trades, data: newStats2 || stats, poolData };
    },
    enabled: !!miraAmm && !!ChartData,
  });

  return { data, isLoading };
};

export default useChartData;
