"use client";

import { FuelProvider } from "@fuels/react";
import { defaultConnectors } from "@fuels/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { coinbaseWallet } from "@wagmi/connectors";
import { http, createConfig, injected } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Config } from "@wagmi/core";

const queryClient = new QueryClient();
// const WC_PROJECT_ID = process.env.WALLET_CONNECT_PROJECT_ID!;

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: false }),
    // walletConnect({
    //   projectId: WC_PROJECT_ID,
    //   showQrModal: false,
    // }),
    coinbaseWallet({
      appName: "Fuel Client",
      darkMode: true,
      reloadOnDisconnect: true,
    }),
  ],
}) as Config;

const fuelConfig = {
  connectors: defaultConnectors({
    devMode: true,
    // wcProjectId: WC_PROJECT_ID,
    //@ts-ignore
    ethWagmiConfig: wagmiConfig,
  }),
};

const FuelProviderWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider theme='dark' fuelConfig={fuelConfig}>
        {children}
      </FuelProvider>
    </QueryClientProvider>
  );
};

export default FuelProviderWrapper;
