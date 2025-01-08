import { useQuery } from "@tanstack/react-query";
import { coinsConfig } from "../utils/coinsConfig";
import request, { gql } from "graphql-request";
import { BackendUrl, SQDIndexerUrl } from "../utils/constants";
import defaultImage from "@/assets/unknown-asset.svg";
import axios from "axios";

export const useAssetImage = (assetId: string | null): string | null => {
  const { data } = useQuery<string | null>({
    queryKey: ["assetImage", assetId],
    queryFn: async () => {
      const configImg = coinsConfig.get(assetId);
      if (configImg?.icon) {
        return configImg?.icon;
      }

      // const query = gql`
      //   query MyQuery {
      //       assetById(id: "${assetId}"){
      //         l1Address
      //         image
      //       }
      //   }`;

      // const results = await request<{ assetById: any }>({
      //   document: query,
      //   url: SQDIndexerUrl,
      // });

      const results = await axios.get(`${BackendUrl}/assets/${assetId}`);

      if (results.data.asset.icon) {
        return results.data.asset.icon;
      }

      // TODO: get images from L1 address
      return null;
    },
    enabled: assetId !== null,
  });

  return data || defaultImage.src;
};
