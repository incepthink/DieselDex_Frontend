"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import Container from "./Container";
import { useModal } from "@/context/ModalContext";

const navItems = [
  { name: "Swap", href: "/swap" },
  { name: "Liquidity", href: "/liquidity" },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const { openModal } = useModal();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWalletConnect, setIsWalletConnect] = useState(false);

  console.log(setIsWalletConnect);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={`flex flex-col lg:flex-row justify-between lg:items-center gap-6 lg:gap-8 w-full ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`font-medium ${
              pathname === item.href
                ? "text-[#E16B31]"
                : "hover:text-[#E16B31] transition-all duration-300"
            }`}
            onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        <Link href="/">
          <FaXTwitter className="text-black text-2xl hover:text-[#E16B31]" />
        </Link>

        {isWalletConnect ? (
          <button
            onClick={() => openModal("WalletProfile")}
            className="flex items-center justify-between w-full px-4 py-2 font-medium rounded border border-[#E16B31]"
          >
            <span className="lg:max-w-24 overflow-hidden">
              2VdzLvPZrpvgwT5pUjTFZjDoJZonrBB2xm5jbC1KC671
            </span>
            ...
            <span className="ms-2 text-lg">
              <IoIosArrowDown />
            </span>
          </button>
        ) : (
          <button
            onClick={() => openModal("ChooseToken")}
            className="flex justify-center items-center gap-2 px-4 py-2 font-medium rounded text-white bg-black hover:bg-[#E16B31] transition-all duration-300"
          >
            Launch App
          </button>
        )}
      </div>
    </nav>
  );

  const BrandLogo = () => (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-6 lg:w-8">
        <Image
          src="/images/logo.png"
          alt="Ducky Dex Logo"
          width={100}
          height={100}
          quality={100}
          className="object-contain w-full"
        />
      </div>
      <p className="text-lg lg:text-xl font-bold text-nowrap">Ducky Dex</p>
    </Link>
  );

  return (
    <header className="shadow-sm fixed top-0 left-0 w-full z-50">
      <Container className="py-4">
        <div className="flex justify-between items-center gap-8 w-full">
          <BrandLogo />
          <div className="hidden lg:block w-full">
            <NavLinks />
          </div>

          <button
            className="lg:hidden text-3xl hover:text-[#E16B31]"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </Container>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex bg-black/50 backdrop-blur z-40">
          <div className="relative w-3/4 h-full p-6 bg-white drop-shadow-lg">
            <BrandLogo />
            <NavLinks className="mt-8" />

            <button
              className="absolute top-6 right-6 text-3xl hover:text-[#E16B31]"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <IoClose />
            </button>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
