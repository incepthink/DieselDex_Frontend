"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const hideHeader = pathname.startsWith("/swap"); // 👈 hide Header on swap page

  return (
    <Providers>
      <ModalProvider>
        {!hideHeader && <Header />} {/* 👈 show Header only if not on /swap */}
        {children}
        <ConnectYourWallet />
        <WalletProfile />
        <CreatePool />
      </ModalProvider>
    </Providers>
  );
};

export default LayoutWrapper;
