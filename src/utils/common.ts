import { CoinName, coinsConfig } from "@/utils/coinsConfig";
import { B256Address } from "fuels";
import { buildPoolId, PoolId } from "disel-dex-ts";
import axios from "axios";

export const openNewTab = (url: string) => {
  window.open(url, "_blank");
};

export const assetsList = Array.from(coinsConfig.values());

export const isPoolIdValid = (poolId: PoolId) => {
  return poolId[0].bits.length === 66 && poolId[1].bits.length === 66;
};

export const StablePoolKey = "stable" as const;
export const VolatilePoolKey = "volatile" as const;

// Entity used as query param for position/pool pages in format 'ETH-USDT-stable', mutually convertible with pool id
export const createPoolKey = (poolId: PoolId) => {
  const poolStability = poolId[2] ? StablePoolKey : VolatilePoolKey;
  return `${poolId[0].bits}_${poolId[1].bits}_${poolStability}`;
};

// TODO: Reconsider this function, maybe have an API call for /pools?
export const isPoolKeyValid = (key: string) => {
  const [coinA, coinB] = key.split("_") as [string, string];
  // TODO: check isStable?
  return coinA.length === 66 && coinB.length === 66;
};

export const createPoolIdFromPoolKey = (key: string) => {
  const [firstCoinAssetId, secondCoinAssetId, poolStability] = key.split(
    "_"
  ) as [
    B256Address,
    B256Address,
    typeof StablePoolKey | typeof VolatilePoolKey
  ];
  const poolStabilityValid =
    poolStability === StablePoolKey || poolStability === VolatilePoolKey;

  if (!firstCoinAssetId || !secondCoinAssetId || !poolStabilityValid) {
    return null;
  }

  return buildPoolId(
    firstCoinAssetId,
    secondCoinAssetId,
    poolStability === StablePoolKey
  );
};

export const createPoolIdFromAssetNames = (
  firstAssetName: CoinName,
  secondAssetName: CoinName,
  isStablePool: boolean
) => {
  const firstCoinAssetId = coinsConfig.get(firstAssetName)?.assetId!;
  const secondCoinAssetId = coinsConfig.get(secondAssetName)?.assetId!;
  return buildPoolId(firstCoinAssetId, secondCoinAssetId, isStablePool);
};

// Mira API returns pool id as string '0x3f007b72f7bcb9b1e9abe2c76e63790cd574b7c34f1c91d6c2f407a5b55676b9_0xce90621a26908325c42e95acbbb358ca671a9a7b36dfb6a5405b407ad1efcd30_false'
export const createPoolIdFromIdString = (id: string, splitBy?: string) => {
  const [firstAssetId, secondAssetId, isStable] = id.split("_");

  return buildPoolId(firstAssetId, secondAssetId, isStable === "true");
};

export const createPoolIdString = (poolId: PoolId) => {
  return `${poolId[0].bits}-${poolId[1].bits}-${poolId[2]}`;
};

export const arePoolIdsEqual = (firstPoolId: PoolId, secondPoolId: PoolId) => {
  return (
    firstPoolId[0].bits === secondPoolId[0].bits &&
    firstPoolId[1].bits === secondPoolId[1].bits &&
    firstPoolId[2] === secondPoolId[2]
  );
};

export const floorToTwoSignificantDigits = (
  value: number | null | undefined
) => {
  if (!value) {
    return 0;
  }

  const digitsBeforeDecimal = Math.floor(Math.log10(Math.abs(value))) + 1;
  const factor = Math.pow(10, 2 - digitsBeforeDecimal);

  return Math.floor(value * factor) / factor;
};

export const calculateSHA256Hash = async (message: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const byteArray = new Uint8Array(hashBuffer);
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const clientAxios = axios.create();

clientAxios.interceptors.request.use((config) => {
  config.headers["x-api-key"] = process.env.NEXT_PUBLIC_API_KEY || "";
  return config;
});

export { clientAxios };
