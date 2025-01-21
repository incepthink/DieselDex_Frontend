"use client";

import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import {
  useAccount,
  useConnectUI,
  useDisconnect,
  useIsConnected,
} from "@fuels/react";
import { clsx } from "clsx";

import styles from "./ConnectButton.module.css";

import ActionButton from "@/components/common/ActionButton/ActionButton";
import useFormattedAddress from "@/hooks/useFormattedAddress/useFormattedAddress";
import { ArrowDownIcon } from "../../icons/ArrowDown/ArrowDownIcon";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { ArrowUpIcon } from "../../icons/ArrowUp/ArrowUpIcon";
import { DropDownButtons } from "@/utils/DropDownButtons";
import { CopyNotification } from "../../common/CopyNotification/CopyNotification";
import { openNewTab } from "@/utils/common";
import TransactionsHistory from "@/components/common/TransactionsHistory/TransactionsHistory";
import { FuelAppUrl } from "@/utils/constants";
import { useScrollLock } from "usehooks-ts";
import { useRouter } from "next/navigation";
import useWindowSize from "@/hooks/useWindowSize";

type Props = {
  className?: string;
};

const ConnectButton = ({ className }: Props) => {
  const { isConnected } = useIsConnected();
  const { connect, isConnecting } = useConnectUI();
  const { disconnect, isPending: disconnectLoading } = useDisconnect();
  const { account } = useAccount();

  const { lock, unlock } = useScrollLock({ autoLock: false });

  // TODO: Hack to avoid empty button when account is changed to the not connected one in wallet
  // It is not reproducible on Fuelet, but on Fuel wallet
  // isConnected remains `true` while account is `null` which is not correct
  // Consider creating an issue in Fuel repo
  // useEffect(() => {
  //   if (isConnected && !account) {
  //     disconnect();
  //   }
  // }, [account, isConnected]);

  const loading = isConnecting || disconnectLoading;

  const [isMenuOpened, setMenuOpened] = useState(false);
  const [isHistoryOpened, setHistoryOpened] = useState(false);
  const [isAddressCopied, setAddressCopied] = useState(false);

  const menuRef = useRef<HTMLUListElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // TODO: Ugly, rewrite all modals/dropdowns/notifications/sidenavs to the separate logic layer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef?.current?.contains(event.target as Node)
      ) {
        setMenuOpened(false);
      }
    };

    const handleClickOutsideTransactions = (event: MouseEvent) => {
      if (
        transactionsRef.current &&
        !transactionsRef.current.contains(event.target as Node)
      ) {
        setHistoryOpened(false);
      }
    };

    if (isMenuOpened) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    if (isHistoryOpened) {
      document.addEventListener("mousedown", handleClickOutsideTransactions);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideTransactions);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideTransactions);
    };
  }, [isMenuOpened, isHistoryOpened]);

  const handleConnection = useCallback(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setMenuOpened(false);
  }, [disconnect]);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    if (!isConnected) {
      handleConnection();
    } else {
      setMenuOpened((prev) => !prev);
    }
  }, [isConnected, handleConnection]);

  const formattedAddress = useFormattedAddress(account);

  const title = useMemo(() => {
    if (isConnected) {
      return formattedAddress;
    }

    return "Connect Wallet";
  }, [isConnected, formattedAddress]);

  const handleCopy = useCallback(async () => {
    if (isConnected && account) {
      try {
        await navigator.clipboard.writeText(account);
        setAddressCopied(true);
        setTimeout(() => setAddressCopied(false), 3000);
      } catch (error) {
        console.error("Failed to copy address: ", error);
      }
    }
  }, [account, isConnected]);

  const handleExplorerClick = () => {
    openNewTab(`${FuelAppUrl}/account/${account}/transactions`);
  };

  const handleHistoryOpen = () => {
    setHistoryOpened(true);
    setMenuOpened(false);
  };

  const handleHistoryClose = () => {
    setHistoryOpened(false);
  };

  // const menuButtons = useMemo(() => {
  //   return DropDownButtons.map((button) => {
  //     return {
  //       ...button,
  //       onClick:
  //         button.text === "Disconnect"
  //           ? handleDisconnect
  //           : button.text === "Transaction History"
  //           ? handleHistoryOpen
  //           : button.text === "Copy Address"
  //           ? handleCopy
  //           : button.text === "View in Explorer"
  //           ? handleExplorerClick
  //           : button.onClick,
  //     };
  //   });
  // }, [handleDisconnect, handleCopy, handleExplorerClick]);

  const menuButtons = [
    { text: "View in Explorer", onClick: handleExplorerClick },
    { text: "Copy Address", onClick: handleCopy },
    { text: "Transaction History", onClick: handleHistoryOpen },
    { text: "Disconnect", onClick: handleDisconnect },
  ];

  useEffect(() => {
    if (isHistoryOpened) {
      lock();
    } else {
      unlock();
    }
  }, [isHistoryOpened]);

  const windowSize = useWindowSize();

  return (
    <>
      <div className="relative">
        <ActionButton
          className={clsx(className, isConnected && styles.connected)}
          onClick={handleClick}
          loading={loading}
          ref={buttonRef}
        >
          {isConnected && (
            <img src="/images/avatar.png" width="24" height="24" />
          )}
          {title}
          {isConnected && (!isMenuOpened ? <ArrowDownIcon /> : <ArrowUpIcon />)}
        </ActionButton>
        {isMenuOpened && (
          // <DropDownMenu
          //   windowSize={windowSize}
          //   buttons={menuButtons}
          //   ref={menuRef}
          // />
          <div className="bg-white/10 backdrop-blur-2xl w-[195.45px] absolute rounded-sm mt-2 transition ease-out overflow-hidden">
            <ul
              className={clsx(
                "bg-white/10 backdrop-blur-2xl p-2 flex flex-col gap-1",
                styles.menuList
              )}
            >
              {menuButtons.map((button) => (
                <li key={button.text}>
                  <button
                    className={styles.menuButton}
                    onClick={button.onClick}
                  >
                    {/* <button.icon /> */}
                    <span>{button.text}</span>
                    {/* {button.disabled && button.tooltip && (
                  <div className={styles.tooltip}>{button.tooltip}</div>
                )} */}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <TransactionsHistory
        onClose={handleHistoryClose}
        isOpened={isHistoryOpened}
        ref={transactionsRef}
      />
      {isAddressCopied && (
        <CopyNotification onClose={() => setAddressCopied(false)} />
      )}
    </>
  );
};

export default ConnectButton;
