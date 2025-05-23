"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PiRocketLaunchDuotone } from "react-icons/pi";
import Container from "../common/Container";
import { useRouter } from "next/navigation";
import { manrope, orbitron, roboto } from "@/app/fonts";
import useWindowSize from "@/hooks/useWindowSize";
import axios from "axios";
import { BackendUrl } from "@/utils/constants";
import clsx from "clsx";
import { clientAxios } from "@/utils/common";

const mainData = [
  {
    title: "Better Prices",
    para: "We benchmark our prices against L1 prices and bridge internally to match them efficiently",
    id: 1,
  },
  {
    title: "Deeper Liquidity",
    para: "We add some of our own liquidity to each of our partner projects. Find them in our telegram.",
    id: 2,
  },
  {
    title: "Charts",
    para: "Price action on your favourite pairs alongside the swap interface",
    id: 3,
  },
  {
    title: "Telegram Bot",
    para: "Our Fuel BuyBot notifies you on every trade in your community",
    id: 4,
  },
];

const HeroSection = () => {
  const router = useRouter();
  const windowSize = useWindowSize();

  const [data, setdata] = useState({
    tvlUSD: "n/a",
    vol: "n/a",
    trades: 20,
  });

  const getHomeData = async () => {
    const res = await clientAxios.get(`${BackendUrl}/platform/home`);

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
    <div className="h-full w-full">
      <div className="relative">
        <Container className="h-full">
          <div className="relative flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-8 lg:gap-0 w-full h-screen">
            <section className="flex flex-col gap-4 lg:gap-16 w-full lg:w-1/2 mt-28 lg:mt-32">
              <div className="flex flex-col gap-2 lg:gap-4 w-full lg:w-[90%]">
                <h1
                  className={`${orbitron.variable} font-orbitron text-3xl lg:text-[80px] font-bold leading-none`}
                >
                  The Best Trading Experience On
                  <span className="text-[#00F48D] lg:text-7xl text-3xl">
                    {" "}
                    FUEL
                  </span>
                </h1>
                <p
                  className={`lg:text-2xl text-[rgba(255,255,255,0.8)] w-full lg:w-[80%] ${manrope.variable}`}
                  style={{ lineHeight: "38.4px" }}
                >
                  Trade, Earn and get Rewards using the most efficient AMM on
                  Fuel.
                </p>
              </div>
              <div>
                <button
                  className="flex justify-center items-center gap-2 px-6 py-2 lg:py-3 font-semibold rounded bg-[#00F48D] text-black"
                  onClick={() => router.push("/swap")}
                >
                  Trade with 0 fees on Fuel Network
                </button>
              </div>
            </section>
            {windowSize.width! < 1020 && (
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
            )}
          </div>
        </Container>
        {windowSize.width! >= 1020 && (
          <section className="flex w-full lg:w-1/2 h-full lg:absolute right-0 bottom-0">
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
      <Container className="flex-col gap-24">
        <div className="grid xl:grid-cols-3 mx-auto lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4 justify-between w-full xl:pt-0 md:pt-0 lg:pt-20">
          <div className="bg-[#1C1C1C] p-16 lg:px-32 px-10 rounded-md flex flex-col gap-8 justify-center items-center">
            <p className="text-6xl font-semibold text-[#00F48D]">
              ${data.tvlUSD}
            </p>
            <p className="lg:text-3xl text-xl">TVL</p>
          </div>

          <div className="bg-[#1C1C1C] p-16 lg:px-32 px-10 rounded-md flex flex-col gap-8 justify-center items-center">
            <p className="text-6xl font-semibold text-[#00F48D]">${data.vol}</p>
            <p className="lg:text-3xl text-xl">VOL</p>
          </div>

          <div className="bg-[#1C1C1C] p-16 lg:px-32 px-10 rounded-md flex flex-col gap-8 justify-center items-center">
            <p className="text-6xl font-semibold text-[#00F48D]">
              {data.trades}
            </p>
            <p className="lg:text-3xl text-xl">TRADES</p>
          </div>
        </div>

        <div className="w-full">
          <h2
            className={`${manrope.variable} font-manrope lg:text-4xl text-2xl font-semibold text-center mb-24`}
          >
            The best features for your{" "}
            <span className="text-[#00F48D] lg:text-4xl text-2xl">
              Trading Journey
            </span>
          </h2>

          {/* {mainData.map(({ title, para, id }) => {
            return (
              <div className="w-full flex flex-col items-center justify-center gap-4 text-center mt-4">
                <div>
                  <p className="lg:text-4xl text-2xl font-semibold font-manrope text-[#00F48D] mb-2">
                    {title}
                  </p>
                  <p className="lg:text-xl text-base">{para}</p>
                </div>
                {id !== 4 && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-4 w-4 bg-[#00F48D] rounded-full"></div>
                    <div className="w-1 h-24 bg-white"></div>
                  </div>
                )}
              </div>
            );
          })} */}

          <div className="flex lg:flex-row flex-col gap-4 mb-4">
            <div className="relative lg:w-3/5 w-full h-96 bg-[#2D2D2D] rounded-3xl overflow-hidden">
              <img
                src="/images/home-1.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <p className="absolute top-10 left-10 sm:text-3xl text-xl font-semibold">
                Better Prices
              </p>
            </div>
            <div className="relative lg:w-2/5 w-full h-96 bg-[#2D2D2D] rounded-3xl overflow-hidden">
              <img
                src="/images/home-2.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <p className="absolute top-10 left-10 sm:text-3xl text-xl font-semibold">
                Deeper Liquidity
              </p>
            </div>
          </div>

          <div className="flex lg:flex-row flex-col gap-4">
            <div className="relative lg:w-2/5 w-full h-96 bg-[#2D2D2D] rounded-3xl overflow-hidden">
              <img
                src="/images/home-3.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <p className="absolute top-10 left-10 sm:text-3xl text-xl font-semibold">
                Charts
              </p>
            </div>
            <div className="relative lg:w-3/5 w-full h-96 bg-[#2D2D2D] rounded-3xl overflow-hidden">
              <img
                src="/images/home-4.jpeg"
                alt=""
                className="w-full h-full object-cover"
              />
              <p className="absolute top-10 left-10 sm:text-3xl text-xl font-semibold">
                Telegram Bot
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#1C1C1C] p-16 rounded-3xl flex lg:flex-row flex-col justify-between">
          <div className="flex flex-col lg:gap-24 gap-12">
            <div className="flex flex-col gap-8">
              <p className="lg:text-5xl text-3xl font-semibold font-manrope">
                DIESEL{" "}
                <span className="lg:text-5xl text-3xl text-[#00F48D]">
                  REWARDS
                </span>
              </p>
              <p className="lg:text-2xl text-lg max-w-2xl">
                Let's grow the pie together. Join our community and look out for
                interesting rewards.{" "}
              </p>
            </div>
            <p className="text-[#00F48D] lg:text-5xl text-3xl font-semibold font-manrope">
              Coming Soon...
            </p>
          </div>

          <div className="relative pr-24">
            <div className="lg:w-96 w-60 h-80">
              <img
                src="/images/home-rewards.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:w-96 w-52 h-80 absolute lg:top-20 top-14 lg:-right-20 -right-10">
              <img
                src="/images/home-rewards-bg.png"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>

      <div className="bg-[#2D2D2D] w-full mt-24">
        <Container className="flex flex-col">
          <div className="flex md:flex-row flex-col md:gap-24 gap-16 items-center md:p-16 p-4 md:py-16 py-14">
            <div>
              <div className="flex gap-4 items-center mb-8">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="lg:text-3xl text-2xl font-semibold">
                  Diesel{" "}
                  <span className="text-[#00F48D] lg:text-3xl text-2xl font-semibold">
                    Dex
                  </span>
                </p>
              </div>

              <div>
                <p className="max-w-xl lg:text-2xl text-lg">
                  <span className="text-[#00F48D] lg:text-2xl text-lg">
                    Diesel{" "}
                  </span>
                  is committed to delivering the best trading experience on
                  Fuel, you name it, we build it.
                </p>
              </div>
            </div>
            <div>
              <button
                className="flex justify-center items-center gap-2 px-6 py-2 lg:py-3 font-semibold rounded bg-[#00F48D] text-black"
                onClick={() => router.push("/swap")}
              >
                Trade with 0 fees on Fuel Network
              </button>
            </div>
          </div>

          <div className="flex sm:flow-row flex-col items-center lg:gap-8 gap-8 justify-between w-full pb-14 text-center">
            <div>
              <p className="md:text-base text-sm">© 2025 www.dieseldex.com</p>
            </div>
            <div
              className={clsx(
                "flex lg:flow-row flex-row items-center md:gap-14 gap-4"
              )}
            >
              <p className="hover:text-[#00F48D] transition md:text-base text-sm">
                Terms of Service
              </p>
              <p className="hover:text-[#00F48D] transition md:text-base text-sm">
                Privacy Policy
              </p>
              <p className="hover:text-[#00F48D] transition md:text-base text-sm">
                Cookies
              </p>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default HeroSection;
