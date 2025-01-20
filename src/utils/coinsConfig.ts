// import {ValidNetworkChainId} from "@/utils/constants";

import assets from "./verified-assets.json";

// TODO: Consider removing this type as we won't probably know the list of all coins ahead of time
export type CoinName = string | null;

export interface CoinData {
  name: string;
  assetId: string;
  decimals: number;
  symbol: string;
  icon?: string;
  contractId?: string;
  subId?: string;
  l1Address?: string;
  isVerified?: boolean;
  coinGeckoId?: string;
}

export interface CoinDataWithPrice extends CoinData {
  price: number;
}

// mapping of asset names & symbols to symbols
export const assetHandleToSymbol = new Map<string, string>();

// TODO: Make an API call to get the coins config
const initAssetsConfig = () => {
  const assetsConfig: Map<string, CoinData> = new Map();

  assets.forEach((asset) => {
    const assetData: CoinData = {
      name: asset.name,
      symbol: asset.symbol,
      assetId: asset.assetId!,
      decimals: asset.decimals,
      icon: asset.icon.default,
      isVerified: asset.isVerified,
      contractId: asset.contractId,
      subId: asset.subId,
    };

    assetsConfig.set(assetData.assetId, assetData);
  });

  const additionalAssetsConfig = initAdditionalAssetsConfig();

  additionalAssetsConfig.forEach((value, assetId) => {
    assetsConfig.set(assetId, value);
  });

  Array.from(assetsConfig.values()).forEach((asset) => {
    if (asset.name) {
      assetHandleToSymbol.set(asset.name, asset.name);
      assetHandleToSymbol.set(asset.symbol, asset.name);
    }
  });

  return assetsConfig;
};

const initAdditionalAssetsConfig = () => {
  const assetsConfig: Map<string, CoinData> = new Map();

  // place for additional assets
  const additionalAssets: CoinData[] = [
    {
      symbol: "PSYCHO",
      assetId:
        "0x86fa05e9fef64f76fa61c03f5906c87a03cb9148120b6171910566173d36fc9e",
      decimals: 9,
      name: "Psycho Ducky",
      icon: "https://mira-dex-resources.s3.us-east-1.amazonaws.com/icons/psycho-icon.png",
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      subId:
        "0x0000000000000000000000000000000000000000000000000000000000000031",
      isVerified: false,
    },
    {
      symbol: "MEOW",
      assetId:
        "0x6ff822c3231932e232aad8ec62931f7a1f3a9653b25c75dd5609c75d03b228b7",
      decimals: 9,
      name: "Meow Meow",
      icon: "https://mira-dex-resources.s3.us-east-1.amazonaws.com/icons/meow-sm.jpg",
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      subId:
        "0x0000000000000000000000000000000000000000000000000000000000000061",
      isVerified: false,
    },
    {
      symbol: "FPEPE",
      assetId:
        "0x7fb205b0048b5f17513355351b6be75eec086e26748a3a94dbe3dcca37d55814",
      decimals: 9,
      name: "Fuel Pepe",
      icon: "https://mira-dex-resources.s3.us-east-1.amazonaws.com/icons/fpepe.jpg",
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      subId:
        "0x0000000000000000000000000000000000000000000000000000000000000023",
      isVerified: false,
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0x61e10d15d424a879f301d1d715f525b5b6dcf9caad8dc2f6fa27055b2dc851c4",
      icon: "https://firebasestorage.googleapis.com/v0/b/meme-fun-fuel.appspot.com/o/images%2F15336fa9-08eb-40bc-a09a-cafbf54a24c3.webp?alt=media&token=b4dcc61f-3b03-4120-bcd6-013c796bc382",
      name: "A Hunter's Dream",
      symbol: "CAW",
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0x7bd0636f7bf10ea9f4aa47215dda0250c2cee64f5640326c5611c4c3c7408bf7",
      icon: "https://firebasestorage.googleapis.com/v0/b/meme-fun-fuel.appspot.com/o/images%2FHappy_Cat_Meme.gif?alt=media&token=ceceeb47-f086-440a-834b-fcaad0956d54",
      name: "Happy cat",
      symbol: "HAPPY",
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0x2655e694fbf1f367e4713b8d2817fae11b1cd6a94e9fb473d0d8844315e5f963",
      icon: "https://firebasestorage.googleapis.com/v0/b/meme-fun-fuel.appspot.com/o/images%2Fart23.png?alt=media&token=1cdd643e-fc07-463d-9f92-d40039997479",
      name: "Bera",
      symbol: "BERA",
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0x614f5caade6126ef1ff5a594e97d091d5d9fa174f673910f0314a63ee5a8a113",
      icon: "https://firebasestorage.googleapis.com/v0/b/meme-fun-fuel.appspot.com/o/images%2Farch25.jpg?alt=media&token=27bf8c24-1fe5-4397-bd9f-8dcac2de951c",
      name: "RetroByte",
      symbol: "RETRO",
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0xc1fdba80b28f51004ede0290e904a59a7dc69d2453706c169630118a80ccde94",
      icon: "https://firebasestorage.googleapis.com/v0/b/meme-fun-fuel.appspot.com/o/images%2Ffuel.jpg?alt=media&token=1f316cf1-af9e-4935-804a-0af949782a38",
      name: "Fuel Fairies",
      symbol: "FAIRY",
    },
    {
      contractId:
        "0x81d5964bfbb24fd994591cc7d0a4137458d746ac0eb7ececb9a9cf2ae966d942",
      decimals: 9,
      assetId:
        "0xa168394dda72a436becdbd920e7cdea302b49f7b1160ed13c5102ebf185f3bf4",
      icon: "/images/trump.jpeg",
      name: "Green TRUMP",
      symbol: "TRUMP",
    },
  ];

  for (const asset of additionalAssets) {
    assetsConfig.set(asset.assetId, asset);
  }

  return assetsConfig;
};

export const coinsConfig: Map<CoinName, CoinData> = initAssetsConfig();
