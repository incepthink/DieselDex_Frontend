import React from "react";
import Image from "next/image";
import { PiRocketLaunchDuotone } from "react-icons/pi";
import Container from "../common/Container";

const HeroSection = () => {
  return (
    <div className="fixed top-0 bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3] w-full h-screen">
      <Container className="h-full">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-8 lg:gap-0 w-full lg:h-full">
          <section className="flex flex-col gap-4 lg:gap-16 w-full lg:w-1/2 mt-28 lg:mt-32">
            <div className="flex flex-col gap-2 lg:gap-4 w-full lg:w-[85%]">
              <h1 className="text-3xl lg:text-8xl font-black">
                The Fast And Secure Dex On{" "}
                <span className="text-[#E16B31]"> Fuel</span>
              </h1>
              <p className="lg:text-xl w-full lg:w-[70%]">
                Trade, Earn and get Rewards using the most efficient AMM on
                Fuel.
              </p>
            </div>
            <div>
              <button className="flex justify-center items-center gap-2 px-6 py-2 lg:py-3 font-semibold rounded bg-[#E16B31] text-white">
                Launch App
                <PiRocketLaunchDuotone className="text-2xl lg:text-3xl" />
              </button>
            </div>
          </section>
          <section className="flex justify-end items-end w-full lg:w-1/2 h-full">
            <div className="w-full lg:w-[600px]">
              <Image
                src={"/images/hero-image.png"}
                alt="hero"
                width={900}
                height={900}
                quality={100}
                className="object-contain w-full"
              />
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
