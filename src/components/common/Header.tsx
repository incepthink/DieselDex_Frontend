"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import Container from "./Container";
import ConnectButton from "./ConnectButton/ConnectButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Swap", href: "/swap" },
  { name: "Liquidity", href: "/liquidity" },
  { name: "Rewards", href: "", disabled: true },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={`flex flex-col lg:flex-row justify-between lg:items-center gap-6 lg:gap-8 w-full ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        {navItems.map((item) => {
          if (item.disabled) {
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`font-medium text-lg disabled opacity-80 bg-[#00F48D] text-black rounded-full p-2 px-4 hover:text-black`}
                    >
                      {item.name}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="mt-3">Coming Soon...</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
        <Link href="https://twitter.com/hash_case">
          <FaXTwitter className="text-white text-2xl hover:text-[#00F48D]" />
        </Link>

        <ConnectButton className="text-black bg-white" />
      </div>
    </nav>
  );

  const BrandLogo = () => (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 lg:w-10 rounded-full overflow-hidden mr-2 ">
        <Image
          src="/images/logo.jpeg"
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
      <Container className="py-4">
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
      </Container>

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
