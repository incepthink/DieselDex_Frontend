"use client";

import { FuelProvider } from "@fuels/react";
import { defaultConnectors } from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { coinbaseWallet } from "@wagmi/connectors";
import { http, createConfig, injected } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Config } from "@wagmi/core";

import { isMobile } from "react-device-detect";
import {
  BakoSafeConnector,
  BurnerWalletConnector,
  createConfig as createFuelConfig,
  FueletWalletConnector,
  FuelWalletConnector,
  SolanaConnector,
  WalletConnectConnector,
} from "@fuels/connectors";
import { ReactNode } from "react";
import { CHAIN_IDS, Network, Provider } from "fuels";
import { NetworkUrl } from "@/utils/constants";
import { walletConnect } from "@wagmi/connectors";

const queryClient = new QueryClient();
// // const WC_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID!;

// const wagmiConfig = createConfig({
//   chains: [mainnet],
//   transports: {
//     [mainnet.id]: http(),
//   },
//   connectors: [
//     injected({ shimDisconnect: false }),
//     // walletConnect({
//     //   projectId: WC_PROJECT_ID,
//     //   showQrModal: false,
//     // }),
//     coinbaseWallet({
//       appName: "Fuel Client",
//       darkMode: true,
//       reloadOnDisconnect: true,
//     }),
//   ],
// }) as Config;

// const fuelConfig = {
//   connectors: defaultConnectors({
//     devMode: false,
//     // wcProjectId: WC_PROJECT_ID,
//     //@ts-ignore
//     ethWagmiConfig: wagmiConfig,
//   }),
// };

type ExternalConnectorConfig = Partial<{
  chainId: number;
  fuelProvider: Promise<Provider>;
}>;
type Props = {
  children: ReactNode;
};
const networks: Array<Network> = [
  {
    chainId: CHAIN_IDS.fuel.mainnet,
    url: NetworkUrl,
  },
];

// Creates a protection for SRR
const FUEL_CONFIG = createFuelConfig(() => {
  const WalletConnectProjectId = "ecf169f1ed1534b70ed647ce6910990a";
  const wagmiConfig = createConfig({
    syncConnectedChain: false,
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
    connectors: [
      injected({ shimDisconnect: false }),
      walletConnect({
        projectId: WalletConnectProjectId,
        metadata: {
          name: "Diesel DEX",
          description: "The Best Trading Experience On FUEL",
          url: "https://www.dieseldex.com/",
          icons: ["https://connectors.fuel.network/logo_white.png"],
        },
      }),
    ],
  });

  const fuelProvider = Provider.create(NetworkUrl);

  const externalConnectorConfig: ExternalConnectorConfig = {
    chainId: CHAIN_IDS.fuel.mainnet,
    fuelProvider,
  };

  const fueletWalletConnector = new FueletWalletConnector();
  const burnerWalletConnector = new BurnerWalletConnector({
    fuelProvider,
  });
  const fuelWalletConnector = new FuelWalletConnector();
  const bakoSafeConnector = new BakoSafeConnector();
  const walletConnectConnector = new WalletConnectConnector({
    projectId: WalletConnectProjectId,
    wagmiConfig: wagmiConfig as any,
    ...externalConnectorConfig,
  });
  const solanaConnector = new SolanaConnector({
    projectId: WalletConnectProjectId,
    ...externalConnectorConfig,
  });

  return {
    connectors: [
      fueletWalletConnector,
      // burnerWalletConnector,
      walletConnectConnector,
      solanaConnector,
      ...(isMobile ? [] : [fuelWalletConnector, bakoSafeConnector]),
    ],
  };
});

const FuelProviderWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        networks={networks}
        fuelConfig={FUEL_CONFIG}
        uiConfig={{ suggestBridge: false }}
        theme="dark"
      >
        {children}
      </FuelProvider>
    </QueryClientProvider>
  );
};

export default FuelProviderWrapper;
