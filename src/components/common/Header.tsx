"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import Container from "./Container";
import ConnectButton from "./ConnectButton/ConnectButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const navItems = [
  { name: "Swap", href: "/swap/" },
  { name: "Liquidity", href: "/liquidity/" },
  { name: "Rewards", href: "", disabled: true },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={`flex flex-col lg:flex-row justify-between lg:items-center gap-6 lg:gap-8 w-full ${className}`}
    >
      <div className="flex flex-col items-start lg:flex-row lg:items-center gap-6 lg:gap-16">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <Popover>
                <PopoverTrigger>
                  <p
                    key={item.name}
                    className={` justify-self-start font-medium text-lg `}
                  >
                    {item.name}
                  </p>
                </PopoverTrigger>
                <PopoverContent className="-translate-y-[52px] translate-x-[115px] lg:translate-y-[4px] lg:translate-x-[0px] relative bg-white/50 border-none flex justify-center items-center w-fit">
                  <div
                    className=" absolute -left-2 lg:left-[62px] lg:-top-[18px] w-0 h-0 
  lg:border-l-[10px] lg:border-l-transparent
  lg:border-b-[8px] lg:border-b-white/50
  lgborder-r-[10px] lg:border-r-transparent
  
  border-t-[10px] border-t-transparent
  border-r-[8px] border-r-white/50
  border-b-[10px] border-b-transparent"
                  ></div>
                  <p className=" py-2 text-white font-semibold">
                    Coming Soon...
                  </p>
                </PopoverContent>
              </Popover>
            );
          }
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`font-medium text-lg ${
                pathname === item.href
                  ? "text-[#00F48D]"
                  : "hover:text-[#00F48D] transition-all duration-300"
              }`}
              onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex lg:flex-row flex-col lg:items-center gap-6 lg:gap-10">
        <div className="flex gap-6 items-center">
          <a target="_blank" href="https://x.com/DieselDex_Fuel">
            <FaXTwitter className="text-white text-2xl hover:text-[#00F48D]" />
          </a>

          <a target="_blank" href="https://t.me/+TWXU1oStbYphMTll">
            <FaTelegram className="text-white text-2xl hover:text-[#00F48D]" />
          </a>
        </div>

        <ConnectButton className="text-black bg-white" />
      </div>
    </nav>
  );

  const BrandLogo = () => (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 lg:w-10 rounded-full overflow-hidden mr-2 ">
        <Image
          src="/images/logo.png"
          alt="Diesel Dex Logo"
          width={100}
          height={100}
          quality={100}
          className="object-contain w-full"
        />
      </div>
      <p className="text-xl lg:text-2xl font-bold text-nowrap">
        Diesel <span className="text-[#00F48D] text-xl lg:text-2xl">Dex</span>
      </p>
    </Link>
  );

  return (
    <header className="shadow-sm fixed top-0 left-0 w-full z-50 backdrop-blur-md">
      <div className="py-4 px-8 max-w-[1800px] mx-auto">
        <div className="flex justify-between items-center gap-20 w-full">
          <BrandLogo />
          <div className="hidden lg:block w-full">
            <NavLinks />
          </div>

          <button
            className="lg:hidden text-3xl hover:text-[#00F48D]"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex bg-black/50 h-screen backdrop-blur z-40">
          <div className="relative w-3/4 h-full p-6 bg-black text-white drop-shadow-lg">
            <BrandLogo />
            <NavLinks className="mt-8" />

            <button
              className="absolute top-6 right-6 text-3xl hover:text-[#00F48D]"
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
