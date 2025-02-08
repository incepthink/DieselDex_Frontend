import axios from "axios";
import { BackendUrl } from "../constants";
import { getBaseAssetPrice, getBaseAssetSupply } from "./assetFetch";
import { ChartData, Stats } from "@/app/swap/page";
import { PoolId } from "disel-dex-ts";
import { AssetId } from "fuels";

interface HistoricalPrice {
  time: number;
  high: number;
  low: number;
  open: number;
  close: number;
  volumefrom: number;
  volumeto: number;
}

// Add this function to fetch historical data
export const fetchTradesFromRedis = async (
  pool_id: string,
  limit: number = 1000
) => {
  try {
    const offset = 0;
    const response = await axios.get(
      `${BackendUrl}/trades?pool_id=${pool_id}&offset=${offset}&limit=${limit}`
    );

    const data = response.data;

    return data.data;
  } catch (error) {
    console.error("Error fetching trades from redis:", error);
    return [];
  }
};

// Update the generateETHPriceHistory function
export const generateETHPriceHistory = async (
  pool_id: string,
  ChartData: ChartData,
  startPrice: number,
  baseTimestamp: number,
  miraAmm: any
) => {
  // Fetch real ETH price data
  const historicalPrices = await fetchHistoricalPrices(pool_id, "ETH");
  const data = await calculateStats(historicalPrices, "24H");
  const poolData = await getPoolData(ChartData, miraAmm);
  const newData = await calculatePrice(poolData, historicalPrices);

  console.log("pool data", poolData);

  // if (historicalPrices.length === 0) {
  //   // Fallback to synthetic data if API fails
  //   return generateSyntheticPriceHistory(startPrice, baseTimestamp);
  // }

  return { historicalPrices, data: newData, poolData };
};

// let stats = {
//   price: { usd: "0", eth: "0", lastTradeIsBuy: false },
//   liquidity: { usd: 0, eth: 0, fdv: 0, mcap: 0 },
//   changes: { "1H": 0, "6H": 0, "24H": 0, "1W": 0 },

//   transactions: {
//     total: 0,
//     buys: 0,
//     sells: 0,
//     volume: 0,
//     buyVolume: 0,
//     sellVolume: 0,
//     volumeDelta: 0,
//     makers: 0,
//     buyers: 0,
//     sellers: 0,
//   },
// };

function calculatePriceChangeForPeriod(
  rawData: any,
  period: "1H" | "6H" | "24H" | "1W"
): number {
  const now = Date.now();
  const periodMs = {
    "1H": 60 * 60 * 1000,
    "6H": 6 * 60 * 60 * 1000,
    "24H": 24 * 60 * 60 * 1000,
    "1W": 7 * 24 * 60 * 60 * 1000,
  }[period];

  const cutoffTime = now - periodMs;
  const relevantTrades = rawData.filter(
    (trade) => trade.time * 1000 >= cutoffTime
  );

  if (relevantTrades.length < 2) return 0;

  const oldestExchangeRate = Number(relevantTrades[0].exchange_rate) / 1e18;
  const newestExchangeRate =
    Number(relevantTrades[relevantTrades.length - 1].exchange_rate) / 1e18;
  const deltaExchangeRate = oldestExchangeRate - newestExchangeRate;

  // Calculate percentage change
  const percentageChange = (deltaExchangeRate / oldestExchangeRate) * 100;

  // For stablecoin pairs, we need to invert the percentage change
  // if (['USDT', 'USDC', 'USDE', 'SDAI', 'SUSDE'].includes(pool.token1Name.toUpperCase())) {
  //     return -percentageChange;
  // }

  return percentageChange;
}

export async function calculateChangeTransactions(
  rawData: any,
  timeframe: string,
  stats: Stats
) {
  //console.log("isStatsLoading111", isStatsLoading)
  try {
    //console.log("calculateStats:::", timeframe)
    if (!rawData.length) return;

    const now = Date.now();
    const timeInMs = {
      "1H": 60 * 60 * 1000,
      "6H": 6 * 60 * 60 * 1000,
      "24H": 24 * 60 * 60 * 1000,
      "1W": 7 * 24 * 60 * 60 * 1000,
    }[timeframe];

    const cutoffTime = now - timeInMs;
    const relevantTrades = rawData.filter(
      (trade) => trade.time * 1000 >= cutoffTime
    );

    // Calculate transactions stats for the selected timeframe
    const buys = relevantTrades.filter((t) => t.is_buy);
    const sells = relevantTrades.filter((t) => t.is_sell);

    // Get unique addresses for the selected timeframe
    const uniqueMakers = new Set(relevantTrades.map((t) => t.recipient));
    const uniqueBuyers = new Set(buys.map((t) => t.recipient));
    const uniqueSellers = new Set(sells.map((t) => t.recipient));

    // Calculate volume in terms of token0 (base token)
    const buyVolume = buys.reduce(
      (acc, t) => acc + Number(t.asset_0_out) / 1e9,
      0
    );
    const sellVolume = sells.reduce(
      (acc, t) => acc + Number(t.asset_0_in) / 1e9,
      0
    );
    const volume = buyVolume + sellVolume;
    const volumeDelta = buyVolume - sellVolume;

    // Update stats object with new calculations
    stats.transactions = {
      total: relevantTrades.length,
      buys: buys.length,
      sells: sells.length,
      volume,
      buyVolume,
      sellVolume,
      volumeDelta,
      makers: uniqueMakers.size,
      buyers: uniqueBuyers.size,
      sellers: uniqueSellers.size,
    };

    stats.changes = {
      "1H": calculatePriceChangeForPeriod(rawData, "1H"),
      "6H": calculatePriceChangeForPeriod(rawData, "6H"),
      "24H": calculatePriceChangeForPeriod(rawData, "24H"),
      "1W": calculatePriceChangeForPeriod(rawData, "1W"),
    };

    return stats;
  } finally {
    //console.log("isStatsLoading222", isStatsLoading)
  }
}

export async function getLiquidityAndTokenData(
  ChartData: ChartData,
  miraAmm: any
) {
  try {
    // Get ETH price

    const counterPartyToken = await getBaseAssetPrice(
      ChartData.poolData.token1Address
    );
    const counterPartyTokenSupply = await getBaseAssetSupply(
      ChartData.poolData.token1Address
    );
    const token0Supply = await getBaseAssetSupply(
      ChartData.poolData.token0Address
    );
    console.log("token0Supply::::", token0Supply);
    let primaryTokenSupply;
    if (token0Supply?.supply <= 0) {
      primaryTokenSupply = 1000000000;
    } else {
      primaryTokenSupply = token0Supply.supply / 1e9;
    }
    console.log("primaryTokenSupply::::", primaryTokenSupply);
    let selectedPrimaryToken = {
      supply: primaryTokenSupply,
    };
    console.log("selectedPrimaryToken:::::", selectedPrimaryToken);
    let selectedCounterPartyToken = counterPartyToken;
    selectedCounterPartyToken["supply"] = counterPartyTokenSupply.supply / 1e9;
    console.log("selectedCounterPartyToken:::", selectedCounterPartyToken);
    //console.log('counterPartyTokenSupply', $counterPartyTokenSupply);

    console.log("selectedPool:::", ChartData);
    // Get pool metadata
    let poolMetadata = await getPoolMetadata(ChartData.poolData.id, miraAmm);

    // Calculate liquidity in USD
    if (poolMetadata && selectedCounterPartyToken.priceUSD) {
      const ethInPool = Number(poolMetadata.reserve1) / 1e9; // Convert from decimals
      let liquidityUSD = ethInPool * selectedCounterPartyToken.priceUSD * 2; // Multiply by 2 since it's paired liquidity
      return { liquidityUSD, selectedPrimaryToken, selectedCounterPartyToken };
    }
  } catch (error) {
    console.error("Error updating pool data:", error);
  }
}

export async function calculatePrice(
  statsPrice: any,
  rawData: any,
  stats: Stats
) {
  const latestTrade = rawData[0];
  console.log("latestTrade:::", latestTrade);
  const exchangeRate = Number(latestTrade.exchange_rate) / 1e18;
  console.log("exchangeRate:::", exchangeRate);
  console.log(
    "$selectedCounterPartyToken",
    statsPrice.selectedCounterPartyToken
  );
  let reducer = 1;
  if (statsPrice.selectedCounterPartyToken?.priceUSD == 1) {
    reducer = 1000;
  }
  const _usdPrice =
    (exchangeRate * (statsPrice.selectedCounterPartyToken?.priceUSD || 0)) /
    reducer;

  console.log("usdPrice:::11", _usdPrice);

  stats.price = {
    eth: exchangeRate.toString(),
    usd: _usdPrice.toString(),
    lastTradeIsBuy: latestTrade.is_buy,
  };

  stats.liquidity.mcap =
    Number(_usdPrice.toString()) *
    Number(statsPrice.selectedPrimaryToken.supply);

  stats.transactions.volume *= Number(_usdPrice.toString());

  return stats;
}

export async function getPoolMetadata(pool_id: string, miraAmm: any) {
  console.log("GETTING POOL METADATA");
  const poolIdparts = pool_id.split("_");

  const poolId: PoolId = [
    { bits: poolIdparts[0] } as AssetId,
    { bits: poolIdparts[1] } as AssetId,
    poolIdparts[2] === "true" ? true : false,
  ];

  //@ts-ignore
  const poolMetadata = await miraAmm.poolMetadata(poolId);
  console.log("poolMetadata response", poolMetadata);
  console.log("poolMetadata::", {
    ...poolMetadata,
    reserve0: Number(poolMetadata?.reserve0),
    reserve1: Number(poolMetadata?.reserve1),
  });
  return {
    ...poolMetadata,
    reserve0: Number(poolMetadata?.reserve0),
    reserve1: Number(poolMetadata?.reserve1),
  };
}

export function formatCurrency(value: number): string {
  try {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  } catch (e) {
    return "$0.00";
  }
}
