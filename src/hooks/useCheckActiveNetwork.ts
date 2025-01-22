import { useWallet } from "@fuels/react";
import { ValidNetworkChainId } from "@/utils/constants";

const useCheckActiveNetwork = () => {
  const { wallet } = useWallet();
  console.log(wallet?.provider.getChainId(), ValidNetworkChainId);

  return wallet?.provider.getChainId() === ValidNetworkChainId;
};

export default useCheckActiveNetwork;
