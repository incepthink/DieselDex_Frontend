import { coinsConfig } from "../utils/coinsConfig";
import defaultImage from "@/assets/unknown-asset.svg";
import { useAssetList } from "./useAssetList";

export const useAssetImage = (assetId: string | null): string | null => {
  const { assets } = useAssetList();

  if (!assetId) return defaultImage.src;

  const config = coinsConfig.get(assetId);
  if (config?.icon) return config.icon;

  const found = assets.find((a) => a.assetId === assetId);
  return found?.icon || defaultImage.src;
};
