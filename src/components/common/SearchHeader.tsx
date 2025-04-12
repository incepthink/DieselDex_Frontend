"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import svgLogo from "./logo-new.svg";
import ConnectButton from "./ConnectButton/ConnectButton";
import SearchBar from "./SearchBar"; // ✅ Make sure it's imported

const navItems = [
  { name: "Swap", href: "/swap/" },
  { name: "Liquidity", href: "/liquidity/" },
  { name: "Points", href: "/points/" },
];

type Props = {
  onSearchClick: () => void;
};

const SwapHeader: React.FC<Props> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const BrandLogo = () => (
    <Link href="/" className="flex items-center -mt-1.5">
      <div className="w-48 lg:w-48 rounded-full overflow-hidden">
        <Image
          src={svgLogo}
          alt="Diesel Dex Logo"
          width={100}
          height={100}
          quality={100}
          className="object-contain w-full"
        />
      </div>
    </Link>
  );

  return (
    <header className="shadow-sm fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="py-4 px-8 max-w-[1800px] mx-auto w-full flex justify-between items-center">
        <BrandLogo />

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-10 w-full justify-between ml-10">
          {/* Left: Navigation */}
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white font-medium text-lg hover:text-[#00F48D] transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Center: Search bar - only on desktop */}
          <div className="flex-1 max-w-[400px] mx-10">
            <SearchBar onClick={onSearchClick} />
          </div>

          {/* Right: Socials + Connect */}
          <div className="flex items-center gap-6">
            <a href="https://x.com/DieselDex_Fuel" target="_blank">
              <FaXTwitter className="text-white text-2xl hover:text-[#00F48D]" />
            </a>
            <a href="https://t.me/+TWXU1oStbYphMTll" target="_blank">
              <FaTelegram className="text-white text-2xl hover:text-[#00F48D]" />
            </a>
            <ConnectButton className="text-black bg-white" />
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-3xl hover:text-[#00F48D]"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
        </button>
      </div>

      {/* Mobile Slide Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex bg-black/50 h-screen backdrop-blur z-40">
          <div className="relative w-3/4 h-full p-6 bg-black text-white drop-shadow-lg flex flex-col gap-4">
            <BrandLogo />
            <div className="flex flex-col gap-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white font-medium text-lg hover:text-[#00F48D] transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex gap-4 mt-4">
                <a href="https://x.com/DieselDex_Fuel" target="_blank">
                  <FaXTwitter className="text-white text-2xl hover:text-[#00F48D]" />
                </a>
                <a href="https://t.me/+TWXU1oStbYphMTll" target="_blank">
                  <FaTelegram className="text-white text-2xl hover:text-[#00F48D]" />
                </a>
              </div>
              <ConnectButton className="text-black bg-white mt-4" />
            </div>
            <button
              className="absolute top-6 right-6 text-3xl hover:text-[#00F48D]"
              onClick={() => setMobileMenuOpen(false)}
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

export default SwapHeader;
