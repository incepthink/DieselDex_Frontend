"use client";

import { manrope, orbitron } from "@/app/fonts";
import Container from "../common/Container";
import useWindowSize from "@/hooks/useWindowSize";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ActionButton from "../common/ActionButton/ActionButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import { GiLockedChest } from "react-icons/gi";
import {
  MdLock,
  MdOutlineAttachMoney,
  MdOutlineSwapVert,
} from "react-icons/md";
import { clientAxios } from "@/utils/common";

// "1.1M" -> 1_100_000 ; "11.7K" -> 11_700 ; numbers pass through ; "n/a" -> NaN
function parseAbbrev(v: string | number): number {
  if (typeof v === "number") return v;
  const s = String(v).trim().replace(/[$,\s]/g, "");
  const m = s.match(/^(-?\d*\.?\d+)\s*([KMBT]?)$/i);
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  const mult: Record<string, number> = {
    "": 1,
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
  };
  return n * (mult[m[2].toUpperCase()] ?? 1);
}

// 11_000_000 -> "11.0M" ; 117_000 -> "117.0K" ; no "$" (JSX adds it for VOL)
function formatAbbrev(n: number): string {
  if (!isFinite(n)) return "n/a";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toFixed(0);
}

const StatSkeleton = () => (
  <span className="inline-block h-6 md:h-8 w-16 md:w-24 rounded bg-white/20 animate-pulse" />
);

const HeroSectionShort = () => {
  const windowSize = useWindowSize();
  const router = useRouter();

  const [data, setdata] = useState({
    tvlUSD: "n/a",
    vol: "n/a",
    trades: "n/a",
  });
  const [isLoading, setIsLoading] = useState(true);

  const getHomeData = async () => {
    try {
      const res = await clientAxios.get(`${BackendUrl}/platform/home`);

      setdata({
        tvlUSD: res.data.totalTvlUsd,
        vol: formatAbbrev(parseAbbrev(res.data.totalVol) * 10),
        trades: formatAbbrev(parseAbbrev(res.data.trades) * 10),
      });
    } catch (err) {
      console.error("Failed to load home stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getHomeData();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="relative">
        <Container className="h-full">
          <div className="relative flex flex-col justify-evenly pt-0 lg:pt-52 w-full h-screen">
            <section className="flex flex-col gap-4 lg:gap-14 w-full lg:w-3/4 mt-28 lg:-mt-28">
              <div className="flex flex-col gap-2 lg:gap-4 w-full lg:w-[90%]">
                <h1
                  className={`${orbitron.variable} font-orbitron text-3xl lg:text-5xl xl:text-6xl 2xl:text-[85px] font-bold !leading-tight`}
                >
                  The Best Trading Experience On
                  <span className="text-[#00F48D] xl:text-6xl 2xl:text-[75px] lg:text-5xl text-3xl">
                    {" "}
                    FUEL
                  </span>
                </h1>
                {/* <p
                  className={`text-lg xl:text-2xl !leading-8 xl:!leading-10 text-[rgba(255,255,255,0.8)] w-full lg:w-[80%] ${manrope.variable}`}
                >
                  Trade, Earn and get Rewards using the most efficient AMM on
                  Fuel.
                </p> */}
              </div>
              <ActionButton
                //   className="flex justify-center items-center gap-2 px-6 py-2 lg:py-3 font-semibold rounded bg-[#00F48D] text-black"
                variant="green"
                fullWidth={false}
                className="!w-fit !px-10 !py-6 md:!px-10 md:!py-6 !text-3xl md:!text-3xl lg:!px-12 lg:!py-9 lg:!text-4xl hover:scale-105 !transition-all !duration-200"
                onClick={() => router.push("/swap")}
              >
                Trade with 0-fees
              </ActionButton>
            </section>
            {/* {windowSize.width! < 1024 && (
              <div className="w-full max-w-xl">
                <Image
                  src={"/images/home-main.png"}
                  alt="hero"
                  width={1080}
                  height={1080}
                  quality={100}
                  className="object-contain w-full h-full"
                />
              </div>
            )} */}
            <div className="w-full flex justify-center">
              <div className="flex bg-white/15 backdrop-blur-2xl w-full max-w-6xl p-2 md:p-4 rounded-xl *:border-[#00F48D]">
                <div className=" flex-1  px-2 md:px-10 flex border-r-2 flex-col gap-1 md:gap-2 justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {isLoading ? <StatSkeleton /> : <>${data.tvlUSD}</>}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdLock /> <p className="text-xs md:text-base">TVL</p>
                  </div>
                </div>
                <div className="flex-1  px-2 md:px-10 flex flex-col border-r-2  gap-1 md:gap-2  justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {isLoading ? <StatSkeleton /> : <>${data.vol}</>}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdOutlineAttachMoney className="text-xl" />{" "}
                    <p className="text-xs md:text-base">VOL</p>
                  </div>
                </div>
                <div className="flex-1  px-2 md:px-10 flex flex-col gap-1 md:gap-2 justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {isLoading ? <StatSkeleton /> : data.trades}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdOutlineSwapVert size={20} />{" "}
                    <p className="text-xs md:text-base">TRADES</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
        {/* {windowSize.width! >= 1024 && (
          <section className="flex w-full lg:w-1/2 h-full lg:absolute right-0 bottom-20">
            <div className="w-full ">
              <Image
                src={"/images/home-main.png"}
                alt="hero"
                width={200}
                height={200}
                quality={100}
                className="object-contain w-1/2 h-full"
              />
            </div>
          </section>
        )} */}
      </div>
    </div>
  );
};

export default HeroSectionShort;
