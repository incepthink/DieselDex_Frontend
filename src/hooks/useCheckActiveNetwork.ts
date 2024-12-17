import { useWallet } from "@fuels/react";
import { ValidNetworkChainId } from "@/utils/constants";

const useCheckActiveNetwork = () => {
  const { wallet } = useWallet();

  return wallet?.provider.getChainId() === ValidNetworkChainId;
};

export default useCheckActiveNetwork;
