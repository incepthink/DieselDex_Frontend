import { useQuery } from "@tanstack/react-query";
import useReadonlyMira from "@/hooks/useReadonlyMira";
import useBalances from "@/hooks/useBalances/useBalances";
import request, { gql } from "graphql-request";
import { BackendUrl, SQDIndexerUrl } from "../utils/constants";
import { createPoolIdFromIdString } from "../utils/common";
import { Asset, PoolId } from "disel-dex-ts";
import { clientAxios } from "@/utils/common";

export interface Position {
  poolId: PoolId;
  lpAssetId: string;
  isStable: boolean;
  token0Position: Asset;
  token1Position: Asset;
}

const usePositions = (): {
  data: Position[] | undefined;
  isLoading: boolean;
  error?: Error | null;
} => {
  const mira = useReadonlyMira();
  const { balances } = useBalances();

  const miraExists = Boolean(mira);

  const { data, isLoading, error } = useQuery({
    queryKey: ["positions", balances],
    queryFn: async (): Promise<Position[]> => {
      try {
        if (!balances || balances.length === 0) {
          return [];
        }

        if (!mira) {
          throw new Error("Mira instance not available");
        }

        const assetIds = balances.map((balance) => balance.assetId);

        const result = await clientAxios.post(`${BackendUrl}/pools/lp`, {
          ids: assetIds,
        });

        if (!result.data?.pools) {
          return [];
        }

        const pools = result.data.pools;
        const positions: Position[] = [];
        
        for (let i = 0; i < pools.length; i++) {
          const pool = pools[i];

          if (!pool) {
            continue;
          }

          try {
            const poolId = createPoolIdFromIdString(pool.pool_id, "_");

            const lpBalance = balances.find(
              (balance) => balance.assetId === pool.lpId
            );

            if (!lpBalance || !lpBalance.amount) {
              continue;
            }

            const amountString = lpBalance.amount.toString();
            const amountNumber = Number(amountString);
            
            if (amountNumber <= 0) {
              continue;
            }

            const liquidityResult = await mira.getLiquidityPosition(
              poolId,
              amountString
            );
            
            const [token0Position, token1Position] = liquidityResult;
            
            const position: Position = {
              poolId,
              lpAssetId: pool.lpId,
              isStable: pool.is_stable,
              token0Position,
              token1Position,
            };
            
            positions.push(position);
            
          } catch (poolError) {
            // Continue processing other pools instead of failing completely
            continue;
          }
        }

        return positions;

      } catch (error) {
        throw error;
      }
    },
    enabled: miraExists && !!balances,
    retry: (failureCount, error) => {
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { data, isLoading, error };
};

export default usePositions;