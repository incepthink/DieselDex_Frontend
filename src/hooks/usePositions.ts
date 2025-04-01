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
} => {
  const mira = useReadonlyMira();
  const { balances } = useBalances();

  const miraExists = Boolean(mira);

  const { data, isLoading } = useQuery({
    queryKey: ["positions", balances],
    queryFn: async () => {
      const assetIds = balances?.map((balance) => balance.assetId);

      const result = await clientAxios.post(`${BackendUrl}/pools/lp`, {
        ids: assetIds,
      });

      // const query = gql`
      //   query MyQuery {
      //     pools(where: {
      //       lpToken: {id_in: [${assetIds!
      //         .map((assetId) => `"${assetId}"`)
      //         .join(", ")}]}
      //     }) {
      //       id
      //       lpToken {
      //         id
      //       }
      //       asset0 {
      //         id
      //       }
      //       asset1 {
      //         id
      //       }
      //       isStable
      //     }
      //   }
      // `;

      // const result = await request<{ pools: any[] }>({
      //   url: SQDIndexerUrl,
      //   document: query,
      // });

      const pools = await Promise.all(
        result.data.pools.map(async (pool: any) => {
          if (pool !== null) {
            const poolId = createPoolIdFromIdString(pool.pool_id, "_");
            const lpBalance = balances!.find(
              (balance) => balance.assetId === pool.lpId
            );
            const [token0Position, token1Position] =
              await mira!.getLiquidityPosition(
                poolId,
                lpBalance!.amount.toString()
              );

            return {
              poolId,
              lpAssetId: pool.lpId,
              isStable: pool.is_stable,
              token0Position,
              token1Position,
            };
          }
        })
      );

      return pools.filter((element) => element !== undefined);
    },
    enabled: miraExists && !!balances,
  });
  console.log(data);
  return { data, isLoading };
};

export default usePositions;
