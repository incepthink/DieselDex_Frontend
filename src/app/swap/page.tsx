"use client";

import React from "react";
import Image from "next/image";
import LayoutWrapper from "@/components/common/LayoutWrapper";
// import AuthLayout from "./Layout";
import Container from "@/components/common/Container";
import SwapForm from "./SwapForm";
// import RecentTrades from "./RecentTrades";
// import Chart from "./Chart";

const Swap = () => {
  return (
    <LayoutWrapper>
      {/* <AuthLayout> */}
      <div className="fixed top-0 bg-black w-full h-screen">
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

          <div
            style={{ boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)" }}
            className="relative z-20 mt-16 rounded-xl w-full sm:w-auto bg-white/20 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100"
          >
            {/* <div
              className="absolute -z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
              style={{
                height: 1000,
                width: 1000,
                background:
                  "radial-gradient(circle, rgba(0,234,128,1) 0%, rgba(2,0,36,0) 50%)",
              }}
            ></div> */}
            <SwapForm />
          </div>
        </Container>
      </div>
      {/* </AuthLayout> */}
    </LayoutWrapper>
  );
};

export default Swap;
