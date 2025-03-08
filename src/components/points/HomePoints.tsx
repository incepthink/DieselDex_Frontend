import usePointsData from "@/hooks/usePointsData";
import React from "react";
import { ImCoinDollar } from "react-icons/im";
import { useAccount, useIsConnected } from "@fuels/react";
import ConnectButton from "../common/ConnectButton/ConnectButton";
import { MdOutlineSwapVerticalCircle } from "react-icons/md";
import { VscActivateBreakpoints } from "react-icons/vsc";

const HomePoints = () => {
  const { account } = useAccount();
  const { isConnected } = useIsConnected();

  const { data, isPending } = usePointsData(account || "");
  console.log(data, isPending);
  return (
    <div className="w-full xl:h-screen xl:pt-0 xl:pb-0 pt-32 pb-16 flex items-center justify-center">
      <div className="flex justify-center items-stretch gap-8 xl:flex-row flex-col md:w-auto w-full px-8">
        <div className="bg-white/20 backdrop-blur-2xl xl:p-20 p-8 rounded-md flex flex-col items-center">
          <p className="font-bold md:text-3xl text-2xl text-center mb-5">
            Total Trades
          </p>
          <div className="flex flex-col items-center justify-center rounded-full border-green-400 border-8 p-12 md:w-52 w-40 md:h-52 h-40">
            {isConnected && !isPending ? (
              <p className="font-bold md:text-7xl text-5xl">
                {data?.tradesCount || 0}
              </p>
            ) : (
              <p className="font-bold md:text-7xl text-5xl">0</p>
            )}
            <p className="text-sm opacity-80">TRADES</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-2xl p-4 flex flex-col rounded-md">
          <p className="font-semibold md:text-2xl text-xl mb-6">
            Engagement acrosss Diesel Dex
          </p>
          {isConnected ? (
            <div className="grid gap-6 md:grid-cols-2 grid-cols-1 md:*:w-[400px] *:w-auto flex-grow">
              {isPending ? (
                <div className="bg-[#181818] h-auto flex items-center justify-center">
                  <div className="w-10">
                    <img
                      src="/images/loading.gif"
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#181818] p-5 flex flex-col gap-6 justify-between rounded-md h-auto">
                  <ImCoinDollar className="opacity-60 md:text-5xl text-3xl" />
                  <div className="flex justify-between items-end">
                    <p className="md:text-4xl text-3xl font-semibold">
                      ${data?.totalSum.toFixed(2) || 0}
                    </p>
                    <p className="md:text-sm text-xs opacity-80 font-semibold">
                      TOTAL TVL
                    </p>
                  </div>
                </div>
              )}

              {isPending ? (
                <div className="bg-[#181818] h-auto flex items-center justify-center">
                  <div className="w-10">
                    <img
                      src="/images/loading.gif"
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#181818] p-5 flex flex-col gap-6 justify-between rounded-md">
                  <MdOutlineSwapVerticalCircle className="opacity-60 md:text-5xl text-3xl" />
                  <div className="flex justify-between items-end">
                    <p className="md:text-4xl text-3xl font-semibold">
                      {data?.tradesCount || 0}
                    </p>
                    <p className="md:text-sm text-xs opacity-80 font-semibold">
                      TRADES
                    </p>
                  </div>
                </div>
              )}

              {isPending ? (
                <div className="bg-[#181818] h-auto flex items-center justify-center">
                  <div className="w-10">
                    <img
                      src="/images/loading.gif"
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-[#181818] p-5 flex flex-col gap-6 justify-between rounded-md ">
                  <VscActivateBreakpoints className="opacity-60 md:text-5xl text-3xl" />
                  <div className="flex justify-between items-end">
                    <p className="md:text-2xl sm:text-xl text-base font-semibold">
                      Coming Soon...
                    </p>
                    <p className="md:text-sm text-xs opacity-80 font-semibold">
                      DIESEL POINTS
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePoints;
