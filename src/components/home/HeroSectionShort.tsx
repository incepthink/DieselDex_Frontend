"use client";

import { manrope } from "@/app/fonts";
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

const HeroSectionShort = () => {
  const windowSize = useWindowSize();
  const router = useRouter();

  const [data, setdata] = useState({
    tvlUSD: "n/a",
    vol: "n/a",
    trades: 20,
  });

  const getHomeData = async () => {
    const res = await axios.get(`${BackendUrl}/platform/home`);

    setdata({
      tvlUSD: res.data.totalTvlUsd,
      vol: res.data.totalVol,
      trades: res.data.trades,
    });
  };

  useEffect(() => {
    getHomeData();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="relative">
        <Container className="h-full">
          <div className="relative flex flex-col justify-evenly pt-0 lg:pt-52 w-full h-screen">
            <section className="flex flex-col gap-4 lg:gap-14 w-full lg:w-1/2 mt-28 lg:-mt-28">
              <div className="flex flex-col gap-2 lg:gap-4 w-full lg:w-[90%]">
                <h1
                  className={`${manrope.variable} font-manrope text-3xl lg:text-5xl xl:text-6xl 2xl:text-[75px] font-bold !leading-tight`}
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
                Trade Now
              </ActionButton>
            </section>
            {windowSize.width! < 1024 && (
              <div className="w-full max-w-xl">
                <Image
                  src={"/images/home-main.gif"}
                  alt="hero"
                  width={1080}
                  height={1080}
                  quality={100}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <div className="w-full flex justify-center">
              <div className="flex bg-white/15 w-full max-w-6xl p-2 md:p-4 rounded-xl *:border-[#00F48D]">
                <div className=" flex-1  px-2 md:px-10 flex border-r-2 flex-col gap-1 md:gap-2 justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}${data.tvlUSD}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdLock /> <p className="text-xs md:text-base">TVL</p>
                  </div>
                </div>
                <div className="flex-1  px-2 md:px-10 flex flex-col border-r-2  gap-1 md:gap-2  justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}${data.vol}
                  </p>
                  <div className="flex items-center gap-1">
                    <MdOutlineAttachMoney className="text-xl" />{" "}
                    <p className="text-xs md:text-base">VOL</p>
                  </div>
                </div>
                <div className="flex-1  px-2 md:px-10 flex flex-col gap-1 md:gap-2 justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}
                    {data.trades}
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
        {windowSize.width! >= 1024 && (
          <section className="flex w-full lg:w-1/2 h-full lg:absolute right-0 bottom-20">
            <div className="w-full ">
              <Image
                src={"/images/home-main.gif"}
                alt="hero"
                width={1080}
                height={1080}
                quality={100}
                className="object-contain w-full h-full"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HeroSectionShort;
