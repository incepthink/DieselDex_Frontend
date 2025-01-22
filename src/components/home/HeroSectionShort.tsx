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
    <div className="w-full h-full max-h-screen">
      <div className="relative">
        <Container className="h-full">
          <div className="relative flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-4 lg:gap-0 w-full h-screen">
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
                <p
                  className={`text-lg xl:text-2xl !leading-8 xl:!leading-10 text-[rgba(255,255,255,0.8)] w-full lg:w-[80%] ${manrope.variable}`}
                >
                  Trade, Earn and get Rewards using the most efficient AMM on
                  Fuel.
                </p>
              </div>
              <ActionButton
                //   className="flex justify-center items-center gap-2 px-6 py-2 lg:py-3 font-semibold rounded bg-[#00F48D] text-black"
                variant="green"
                fullWidth={false}
                className="!w-fit !px-6 md:!px-10 !text-base md:!text-lg"
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
            <div className="absolute bottom-20 xl:bottom-28 w-full flex justify-center">
              <div className="flex gap-5 md:gap-10 w-full">
                <div className=" bg-white/15 flex-1 rounded-xl p-2 md:p-4 px-2 md:px-10 flex flex-col gap-1 md:gap-2 justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}${data.tvlUSD}
                  </p>
                  <p className="text-xs md:text-base">TVL</p>
                </div>
                <div className="bg-white/15 flex-1 rounded-xl p-2 md:p-4 px-2 md:px-10 flex flex-col gap-1 md:gap-2  justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}${data.vol}
                  </p>
                  <p className="text-xs md:text-base">VOL</p>
                </div>
                <div className="bg-white/15 flex-1 rounded-xl p-2 md:p-4 px-2 md:px-10 flex flex-col gap-1 md:gap-2  justify-center items-center">
                  <p className="text-base md:text-2xl font-medium text-[#00F48D]">
                    {/* ${data.tvlUSD} */}
                    {data.trades}
                  </p>
                  <p className="text-xs md:text-base">TRADES</p>
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
        <div className="bg-[#282828] absolute bottom-0 w-full flex justify-center p-2">
          <p className="md:text-base text-sm">© 2025 www.dieseldex.com</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionShort;
