import request, { gql } from "graphql-request";
import { BackendUrl, SQDIndexerUrl } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { CoinDataWithPrice, coinsConfig } from "../utils/coinsConfig";
import { clientAxios } from "@/utils/common";

export const useAssetList = (): {
  assets: CoinDataWithPrice[];
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery<CoinDataWithPrice[]>({
    queryKey: ["assets"],
    queryFn: async (): Promise<CoinDataWithPrice[]> => {
      // Primary source: SQD indexer. If it's unavailable we fall through to the
      // DB below so the asset list keeps working.
      let gqlAssets: CoinDataWithPrice[] = [];
      try {
        const gqlQuery = gql`
          query MyQuery {
            assets(where: { numPools_gt: 0 }) {
              image
              name
              symbol
              id
              decimals
              numPools
              l1Address
              price
              contractId
              subId
            }
          }
        `;

        const gqlResult = await request<{ assets: any[] }>({
          url: SQDIndexerUrl,
          document: gqlQuery,
        });

        gqlAssets = gqlResult.assets.map((asset: any): CoinDataWithPrice => {
          const config = coinsConfig.get(asset.id);
          return {
            assetId: asset.id,
            name: config?.name || asset.name,
            symbol: config?.symbol || asset.symbol,
            decimals: asset.decimals,
            icon: config?.icon || asset.image,
            l1Address: asset.l1Address,
            contractId: asset.contractId,
            subId: asset.subId,
            price: asset.price,
            isVerified: config?.isVerified || false,
          };
        });
      } catch (error) {
        console.warn(
          "SQD indexer unavailable, falling back to DB for asset list",
          error
        );
      }

      // Backup source: our own indexer DB. Used to fill any assets the SQD
      // indexer doesn't return, and as the sole source when SQD is down.
      const dbRes = await clientAxios.get(`${BackendUrl}/assets/db`);

      const dbAssets: CoinDataWithPrice[] = (dbRes.data.assets ?? []).map(
        (asset: any): CoinDataWithPrice => {
          const config = coinsConfig.get(asset.asset_id);
          return {
            assetId: asset.asset_id,
            name: config?.name || asset.name,
            symbol: config?.symbol || asset.symbol,
            decimals: asset.decimals,
            icon: config?.icon || asset.icon,
            l1Address: asset.l1_address,
            contractId: asset.contract_id,
            subId: asset.subId,
            price: asset.price_usd,
            isVerified: config?.isVerified ?? asset.is_verified ?? false,
          };
        }
      );

      const combinedMap = new Map<string, CoinDataWithPrice>();
      gqlAssets.forEach((asset) => combinedMap.set(asset.assetId, asset));
      dbAssets.forEach((asset) => {
        if (!combinedMap.has(asset.assetId)) {
          combinedMap.set(asset.assetId, asset);
        }
      });

      return Array.from(combinedMap.values());
    },
    staleTime: 1000 * 60 * 5, // optional
  });

  return {
    assets: data ?? [],
    isLoading,
  };
};
