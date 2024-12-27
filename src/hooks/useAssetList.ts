// import request, { gql } from "graphql-request";
import { BackendUrl } from "../utils/constants";
import { useQuery } from "@tanstack/react-query";
import { CoinDataWithPrice, coinsConfig } from "../utils/coinsConfig";
import axios from "axios";

export const useAssetList = (): {
  assets: CoinDataWithPrice[];
  isLoading: boolean;
} => {
  const { data, isLoading } = useQuery<CoinDataWithPrice[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      // const query = gql`
      //   query MyQuery {
      //     assets(where: { numPools_gt: 0 }) {
      //       image
      //       name
      //       symbol
      //       id
      //       decimals
      //       numPools
      //       l1Address
      //       price
      //       contractId
      //       subId
      //     }
      //   }
      // `;

      // const results = await request<{ assets: any }>({
      //   url: SQDIndexerUrl,
      //   document: query,
      // });

      const results = await axios.get(`${BackendUrl}/assets/`);

      const assets = results.data.assets.map(
        (asset: any): CoinDataWithPrice => {
          const config = coinsConfig.get(asset.id);

          return {
            assetId: asset.asset_id,
            name: config?.name || asset.name,
            symbol: config?.name || asset.symbol,
            decimals: asset.decimals,
            icon: config?.icon || asset.icon,
            l1Address: asset.l1Address,
            contractId: asset.contract_id,
            subId: asset.subId,
            price: asset.price,
            isVerified: config?.isVerified || false,
          };
        }
      );

      return assets;
    },
  });
  return { assets: data!, isLoading };
};
