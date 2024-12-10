"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PiFilesDuotone } from "react-icons/pi";
import { PiInfoDuotone } from "react-icons/pi";
import { PiTrophyDuotone } from "react-icons/pi";
import { IoSearchOutline } from "react-icons/io5";
import Container from "@/components/common/Container";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import { useModal } from "@/context/ModalContext";

const Liquidity = () => {
  return (
    <LayoutWrapper>
      <div className="fixed top-0 bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3] w-full h-screen">
        <div className="absolute bottom-0 w-full z-0">
          <Image
            src={"/images/bg-image.png"}
            alt="hero"
            width={1000}
            height={500}
            quality={100}
            className="object-contain w-full"
          />
        </div>
        <Container>
          <div className="flex flex-col justify-start items-start gap-10 rounded-xl p-4 lg:p-8 bg-white z-30 mt-16 lg:mt-20 h-[80%] lg:h-[82%] w-full overflow-y-scroll">
            <section className="flex flex-col justify-center items-center gap-2 bg-[#FAF8F1] px-4 py-4 lg:py-6 w-full">
              <div className="flex justify-center items-center">
                <div className="p-2 rounded-full bg-[#E16B31] text-xl text-white cursor-pointer">
                  <PiFilesDuotone />
                </div>
              </div>
              <p className="lg:text-lg font-semibold">
                Your liquidity will appear here
              </p>
            </section>

            <section className="w-full">
              <PoolTable />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full mb-12 lg:mb-0">
              <div className="flex justify-start items-center gap-2 bg-[#FAF8F1] px-4 lg:px-6 py-4 w-full">
                <div className="flex justify-center items-center">
                  <div className="p-2 lg:p-3 rounded-md bg-[#E16B31] text-2xl lg:text-3xl text-white cursor-pointer">
                    <PiInfoDuotone />
                  </div>
                </div>
                <div className="font-semibold">
                  <p className="lg:text-lg">Your liquidity will appear here</p>
                  <p className="text-sm lg:text-base text-black text-opacity-65">
                    Click here to see the guide
                  </p>
                </div>
              </div>
              <div className="flex justify-start items-center gap-2 bg-[#FAF8F1] px-4 lg:px-6 py-4 w-full">
                <div className="flex justify-center items-center">
                  <div className="p-2 lg:p-3 rounded-md bg-[#E16B31] text-2xl lg:text-3xl text-white cursor-pointer">
                    <PiTrophyDuotone />
                  </div>
                </div>
                <div className="font-semibold">
                  <p className="lg:text-lg">Fuel Points Program</p>
                  <p className="text-sm lg:text-base text-black text-opacity-65">
                    Join the Fuel Points program. Learn more
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </LayoutWrapper>
  );
};

export default Liquidity;

const PoolTable = () => {
  const { openModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPools = pools.filter((pool) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      pool.token0.symbol.toLowerCase().includes(searchTerm) ||
      pool.token1.symbol.toLowerCase().includes(searchTerm)
    );
  });
  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold">All Pools</h1>
        <div className="relative">
          <IoSearchOutline className="absolute left-2 top-1/2 -translate-y-1/2 text-xl" />
          <input
            type="text"
            placeholder="Search pools..."
            className="pl-9 pr-4 py-2.5 bg-[#FAF8F1] w-[300px] rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-black border-opacity-20 shadow-sm overflow-auto lg:overflow-hidden">
        <table className="w-full">
          <thead className="font-semibold text-[#84919A] bg-[#F6F8F9] ">
            <tr className="border-0 text-start text-sm lg:text-base">
              <th className="px-4 py-4 text-left">POOLS</th>
              <th className="px-4 py-4">APR</th>
              <th className="px-4 py-4">24H VOLUME</th>
              <th className="px-4 py-4">TVL</th>
              <th className="px-4 py-4">
                <button
                  onClick={() => openModal("CreatePool")}
                  className="px-4 lg:px-6 py-2 lg:py-2.5 rounded-md font-medium text-sm lg:text-lg text-white bg-[#E16B31]"
                >
                  Create Pool
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPools.length > 0 ? (
              filteredPools.map((pool) => (
                <tr key={pool.id} className="border-0">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-3">
                        <div className="w-6 lg:w-8 h-6 lg:h-8">
                          <Image
                            src={pool.token0.icon}
                            alt="token"
                            width={100}
                            height={100}
                            quality={100}
                            className="object-contain w-full"
                          />
                        </div>
                        <div className="w-6 lg:w-8 h-6 lg:h-8">
                          <Image
                            src={pool.token1.icon}
                            alt="token"
                            width={100}
                            height={100}
                            quality={100}
                            className="object-contain w-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="lg:text-lg font-semibold">
                          {pool.token0.symbol}/{pool.token1.symbol}
                        </div>
                        {pool.stable && (
                          <div className="text-sm text-[#E16B31]">
                            Stable: {pool.stableRate}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">{pool.apr}</td>
                  <td className="text-center py-4 px-4">
                    ${pool.volume24h.toLocaleString()}
                  </td>
                  <td className="text-center py-4 px-4">
                    ${pool.tvl.toLocaleString()}
                  </td>
                  <td className="text-center py-4 px-4">
                    <button className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base font-medium bg-[#E16B311A] text-[#E16B31]">
                      Add Liquidity
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-lg font-medium text-center py-6 text-black text-opacity-60"
                >
                  No pools available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface Pool {
  id: string;
  token0: {
    symbol: string;
    icon: string;
  };
  token1: {
    symbol: string;
    icon: string;
  };
  stable: boolean;
  stableRate: string;
  apr: string;
  volume24h: number;
  tvl: number;
}

const pools: Pool[] = [
  {
    id: "1",
    token0: {
      symbol: "ezETH",
      icon: "/images/icon/icon-pool-ezeth.png",
    },
    token1: {
      symbol: "ETH",
      icon: "/images/icon/icon-pool-eth.png",
    },
    stable: true,
    stableRate: "0.05%",
    apr: "0.25%",
    volume24h: 52571,
    tvl: 3789283,
  },
  {
    id: "2",
    token0: {
      symbol: "USDC",
      icon: "/images/icon/icon-pool-usdc.png",
    },
    token1: {
      symbol: "USDT",
      icon: "/images/icon/icon-pool-usdt.png",
    },
    stable: true,
    stableRate: "0.05%",
    apr: "1.12%",
    volume24h: 223272,
    tvl: 3644688,
  },
  {
    id: "3",
    token0: {
      symbol: "USDC",
      icon: "/images/icon/icon-pool-usdc.png",
    },
    token1: {
      symbol: "USDT",
      icon: "/images/icon/icon-pool-usdt.png",
    },
    stable: true,
    stableRate: "0.05%",
    apr: "1.12%",
    volume24h: 223272,
    tvl: 3644688,
  },
  {
    id: "4",
    token0: {
      symbol: "USDC",
      icon: "/images/icon/icon-pool-usdc.png",
    },
    token1: {
      symbol: "USDT",
      icon: "/images/icon/icon-pool-usdt.png",
    },
    stable: true,
    stableRate: "0.05%",
    apr: "1.12%",
    volume24h: 223272,
    tvl: 3644688,
  },
  {
    id: "5",
    token0: {
      symbol: "USDC",
      icon: "/images/icon/icon-pool-usdc.png",
    },
    token1: {
      symbol: "USDT",
      icon: "/images/icon/icon-pool-usdt.png",
    },
    stable: true,
    stableRate: "0.05%",
    apr: "1.12%",
    volume24h: 223272,
    tvl: 3644688,
  },
];
