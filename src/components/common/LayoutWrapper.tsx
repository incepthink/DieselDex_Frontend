"use client";

import React from "react";
import Header from "./Header";
import { ModalProvider } from "@/context/ModalContext";
import ConnectYourWallet from "../modal/ConnectYourWallet";
import WalletProfile from "../modal/WalletProfile";
import CreatePool from "../modal/CreatePool";
import Providers from "../providers/Providers";

const LayoutWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Providers>
      <ModalProvider>
        <Header />
        {children}
        <ConnectYourWallet />
        <WalletProfile />
        <CreatePool />
      </ModalProvider>
    </Providers>
  );
};

export default LayoutWrapper;
