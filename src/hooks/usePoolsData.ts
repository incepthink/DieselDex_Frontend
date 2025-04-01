import { useQuery } from "@tanstack/react-query";
import { CoinName } from "@/utils/coinsConfig";
import {
  ApiBaseUrl,
  BackendUrl,
  IndexerUrl,
  SQDIndexerUrl,
} from "@/utils/constants";
import { createPoolIdFromIdString, isPoolIdValid } from "@/utils/common";
import request, { gql } from "graphql-request";
import { time } from "console";
import { clientAxios } from "@/utils/common";

export type PoolData = {
  id: string;
  reserve_0: string;
  reserve_1: string;
  details: {
    asset0Id: string;
    asset1Id: string;
    asset_0_symbol: CoinName;
    asset_1_symbol: CoinName;
    apr: number | null;
    volume: string;
    tvl: number;
  };
  swap_count: number;
  create_time: number;
};

export type PoolsData = {
  pools: PoolData[];
};

export const usePoolsData = (): {
  data: PoolData[] | undefined;
  isLoading: boolean;
} => {
  const timestamp24hAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
  const query = gql`
    query PoolQuery {
      pools(orderBy: tvlUSD_DESC) {
        id
        isStable
        reserve0
        reserve1
        reserve0Decimal
        reserve1Decimal
        volumeAsset0
        volumeAsset1
        tvlUSD
        lpToken {
          symbol
          name
        }
        asset1 {
          id
          symbol
          decimals
        }
        asset0 {
          id
          symbol
          decimals
        }
        snapshots(where: { timestamp_gt: ${timestamp24hAgo} }) {
          timestamp
          volumeAsset0
          volumeAsset1
          volumeAsset0Decimal
          volumeAsset1Decimal
          volumeUSD
          feesUSD
        }
      }
    }
  `;

  const { data, isLoading } = useQuery<any>({
    queryKey: ["pools"],
    queryFn: async () => {
      return await clientAxios.get(`${BackendUrl}/pools/db`);
    },
    // enabled: shouldFetch,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  console.log(data);

  const dataTransformed = data?.data.success
    .map((pool: any): PoolData => {
      // const volume24h = pool.snapshots.reduce((acc: number, snapshot: any) => acc + parseFloat(snapshot.volumeUSD), 0);
      // const fees24h = pool.snapshots.reduce(
      //   (acc: number, snapshot: any) => acc + parseFloat(snapshot.feesUSD),
      //   0
      // );
      const feeRate = pool.isStable ? 0.05 : 0.3;
      const apr =
        (parseFloat(pool.volume24hr) * feeRate * 365) / parseFloat(pool.tvlUSD);

      // const apr = (pool.fees24hr / parseFloat(pool.tvlUSD)) * 365 * 100;

      return {
        id: pool.pool_id,
        reserve_0: pool.reserve_0,
        reserve_1: pool.reserve_1,
        details: {
          asset0Id: pool.Asset0.asset_id,
          asset1Id: pool.Asset1.asset_id,
          asset_0_symbol: pool.Asset0.symbol as CoinName,
          asset_1_symbol: pool.Asset1.symbol as CoinName,
          apr,
          // volume: pool.snapshots.reduce(
          //   (acc: number, snapshot: any) =>
          //     acc + parseFloat(snapshot.volumeUSD),
          //   0
          // ),
          volume: pool.swapVolume,
          tvl: parseFloat(pool.tvlUSD),
        },
        swap_count: 0,
        create_time: 0,
      };
    })
    .sort((a: PoolData, b: PoolData) => b.details.tvl - a.details.tvl);

  return { data: dataTransformed, isLoading };
};

export default usePoolsData;

// import { useQuery } from "@tanstack/react-query";
// import { CoinName } from "@/utils/coinsConfig";
// import {
//   ApiBaseUrl,
//   BackendUrl,
//   IndexerUrl,
//   SQDIndexerUrl,
// } from "@/utils/constants";
// import { createPoolIdFromIdString, isPoolIdValid } from "@/utils/common";
// import request, { gql } from "graphql-request";
// import { time } from "console";
// import axios from "axios";

// export type PoolData = {
//   id: string;
//   reserve_0: string;
//   reserve_1: string;
//   details: {
//     asset0Id: string;
//     asset1Id: string;
//     asset_0_symbol: CoinName;
//     asset_1_symbol: CoinName;
//     apr: number | null;
//     volume: string;
//     tvl: number;
//   };
//   swap_count: number;
//   create_time: number;
// };

// export type PoolsData = {
//   pools: PoolData[];
// };

// export const usePoolsData = (): {
//   data: PoolData[] | undefined;
//   isLoading: boolean;
// } => {
//   const timestamp24hAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
//   const query = gql`
//     query PoolQuery {
//       pools {
//         id
//         isStable
//         reserve0
//         reserve1
//         reserve0Decimal
//         reserve1Decimal
//         volumeAsset0
//         volumeAsset1
//         tvlUSD
//         lpToken {
//           symbol
//           name
//         }
//         asset1 {
//           id
//           symbol
//           decimals
//         }
//         asset0 {
//           id
//           symbol
//           decimals
//         }
//         snapshots(where: { timestamp_gt: ${timestamp24hAgo} }) {
//           timestamp
//           volumeAsset0
//           volumeAsset1
//           volumeAsset0Decimal
//           volumeAsset1Decimal
//           volumeUSD
//           feesUSD
//         }
//       }
//     }
//   `;

//   const { data, isLoading } = useQuery<any>({
//     queryKey: ["pools"],
//     queryFn: async () => {
//       return await clientAxios.get(`${BackendUrl}/pools`);
//     },
//     // enabled: shouldFetch,
//   });

//   console.log(data);

//   const dataTransformed = data?.data.success
//     .map((pool: any): PoolData => {
//       // const volume24h = pool.snapshots.reduce((acc: number, snapshot: any) => acc + parseFloat(snapshot.volumeUSD), 0);
//       // const fees24h = pool.snapshots.reduce(
//       //   (acc: number, snapshot: any) => acc + parseFloat(snapshot.feesUSD),
//       //   0
//       // );

//       const apr = ((pool.fees24hr) / (parseFloat(pool.tvlUSD))) * 365;

//       return {
//         id: pool.pool_id,
//         reserve_0: pool.reserve_0,
//         reserve_1: pool.reserve_1,
//         details: {
//           asset0Id: pool.Asset0.asset_id,
//           asset1Id: pool.Asset1.asset_id,
//           asset_0_symbol: pool.Asset0.symbol as CoinName,
//           asset_1_symbol: pool.Asset1.symbol as CoinName,
//           apr,
//           // volume: pool.snapshots.reduce(
//           //   (acc: number, snapshot: any) =>
//           //     acc + parseFloat(snapshot.volumeUSD),
//           //   0
//           // ),
//           volume: pool.volume24hr,
//           tvl: parseFloat(pool.tvlUSD),
//         },
//         swap_count: 0,
//         create_time: 0,
//       };
//     })
//     .sort((a: PoolData, b: PoolData) => b.details.tvl - a.details.tvl);

//   return { data: dataTransformed, isLoading };
// };

// export default usePoolsData;
