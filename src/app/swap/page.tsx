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
        <div className="absolute top-32" style={{ width: "1480px" }}>
          <img src="/images/line.png" alt="" className="w-full" />
        </div>
        <div
          className="absolute bottom-0 rotate-[135deg]"
          style={{ width: "1800px" }}
        >
          <img src="/images/line.png" alt="" className="w-full" />
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
      {/* </AuthLayout> */}
    </LayoutWrapper>
  );
};

export default Swap;
