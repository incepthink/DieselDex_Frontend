"use client";

import React from "react";
import Image from "next/image";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import AuthLayout from "./Layout";
import Container from "@/components/common/Container";
import SwapForm from "./SwapForm";
// import RecentTrades from "./RecentTrades";
// import Chart from "./Chart";

const Swap = () => {
  return (
    <LayoutWrapper>
      <AuthLayout>
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
            {/* <div className="flex flex-col justify-start items-start gap-10 rounded-lg p-4 lg:p-8 bg-white z-30 mt-24 max-h-[80%] w-full overflow-y-scroll">
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full">
              <div className="lg:col-span-2">
                <Chart />
              </div>
              <div className="h-full">
                <SwapForm />
              </div>
            </section>
            <section className="flex w-full pb-20">
              <RecentTrades />
            </section>
          </div> */}

            <div className="z-20 mt-16 bg-white rounded-xl shadow-md w-full sm:w-auto">
              <SwapForm />
            </div>
          </Container>
        </div>
      </AuthLayout>
    </LayoutWrapper>
  );
};

export default Swap;
