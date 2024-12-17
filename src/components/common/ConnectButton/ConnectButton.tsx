import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
} from "@fuels/react";
import { useCallback, useMemo } from "react";
import useFormattedAddress from "../useFormattedAddress/useFormattedAddress";

const ConnectButton = () => {
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnectUI();
  const { disconnect, isPending: disconnectLoading } = useDisconnect();
  const { account } = useAccount();

  const handleConnection = useCallback(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleClick = useCallback(() => {
    if (!isConnected) {
      handleConnection();
    } else {
      handleDisconnect();
    }
  }, [isConnected, handleConnection]);

  const formattedAddress = useFormattedAddress(account);

  const title = useMemo(() => {
    if (isConnected) {
      return formattedAddress;
    }

    return "Connect Wallet";
  }, [isConnected, formattedAddress]);

  return (
    <>
      <button
        onClick={() => handleClick()}
        className='flex justify-center items-center gap-2 px-4 py-2 font-medium rounded text-white bg-black hover:bg-[#E16B31] transition-all duration-300'
      >
        {title}
      </button>
    </>
  );
};

export default ConnectButton;
