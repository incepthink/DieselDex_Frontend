import usePointsData from "@/hooks/usePointsData";
import React, { useState } from "react";
import { ImCoinDollar } from "react-icons/im";
import { useAccount, useIsConnected } from "@fuels/react";
import ConnectButton from "../common/ConnectButton/ConnectButton";
import {
  MdOutlineAccessTime,
  MdOutlineSwapVert,
  MdOutlineSwapVerticalCircle,
} from "react-icons/md";
import { VscActivateBreakpoints } from "react-icons/vsc";
import useWalletTransactions, {
  Transaction,
} from "@/hooks/useWalletTransactions";
import assets from "@/utils/assetsByid.json";
import { IoMdAdd } from "react-icons/io";
import { RiSubtractFill } from "react-icons/ri";
import { FaLongArrowAltRight } from "react-icons/fa";
import { getTimeAgo } from "../common/ChartTransactionHistory/ChartTransactionHistory";

const ITEMS_PER_PAGE = 5;

const HomePoints = () => {
  const { account } = useAccount();
  const { isConnected } = useIsConnected();

  const { data, isPending } = usePointsData(account || "");
  const { transactions } = useWalletTransactions(account, true);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

  const assetMap = assets.reduce((map: any, asset) => {
    if (asset.asset_id && asset.symbol) {
      map[asset.asset_id] = {
        symbol: asset.symbol,
        decimals: asset.decimals,
      };
    }
    return map;
  }, {});

  const paginatedTrx = transactions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  return (
    <div className="w-full xl:h-screen md:pt-32 pt-28 max-w-[1800px] mx-auto md:px-8 px-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-end">
          <p className="sm:text-4xl text-3xl text-[#00EA82]">DIESEL POINTS:</p>
          <p className="sm:text-2xl text-lg">Coming Soon...</p>
        </div>
        <p className="sm:text-xl text-lg">
          Real-time Trading Analytics Dashboard
        </p>
      </div>

      <div className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 w-full gap-6 mt-8">
        <div className="bg-[#151515] p-4 rounded-md flex flex-col items-center">
          <p className="font-bold md:text-3xl text-2xl text-center mb-4">
            Total Trades
          </p>
          <div className=" rounded-full border-green-400 border-8 md:w-56 w-44 md:h-56 h-44 flex items-center justify-center">
            <div className="rounded-full border-dashed border-[2px] border-[rgba(255,255,255,0.3)] md:w-48 w-36 md:h-48 h-36 flex flex-col items-center justify-center">
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
        </div>

        <div className="bg-[#151515] p-5 flex flex-col gap-6 rounded-md h-auto">
          <div className="flex gap-4 items-end">
            <div className="w-8">
              <img
                src="/images/lp.png"
                alt=""
                className=" object-cover w-full"
              />
            </div>
            <p className="text-lg">LP Position</p>
          </div>
          <p className="lg:text-7xl text-5xl font-medium">
            ${data?.lpPositionSum.toFixed(2) || 0}
          </p>
          <p className="text-[#01CB6A] text-xl">+2.5% from last 24h</p>
        </div>

        <div className="bg-[#151515] p-5 flex flex-col gap-6 rounded-md h-auto">
          <div className="flex gap-4 items-end">
            <div className="w-8">
              <img
                src="/images/lp.png"
                alt=""
                className=" object-cover w-full"
              />
            </div>
            <p className="text-lg">Traded Volume</p>
          </div>
          <p className="lg:text-7xl text-5xl font-medium">
            ${data?.tradedVolSum.toFixed(2) || 0}
          </p>
          <p className="text-[#01CB6A] text-xl">+2.5% from last 24h</p>
        </div>
      </div>

      <div className="pb-10">
        <div className="bg-[#151515] rounded-md border-[1px] border-[rgba(255,255,255,0.1)] md:p-8 p-4 flex flex-col gap-6 mt-8">
          <p className="md:text-3xl text-2xl">Recent Activity</p>

          <div className="flex flex-col">
            {paginatedTrx?.map((transaction) => {
              return (
                <div className="flex justify-between items-end border-b-[1px] py-3 border-[rgba(255,255,255,0.2)]">
                  <div className="flex gap-2 items-center">
                    {transaction.transaction_type === "ADD_LIQUIDITY" && (
                      <div className="bg-[#000000CC] md:h-14 h-10 md:w-14 w-10 flex items-center justify-center rounded-full mr-2">
                        <IoMdAdd className="text-[#00EA82] md:text-3xl text-xl" />
                      </div>
                    )}
                    {transaction.transaction_type === "REMOVE_LIQUIDITY" && (
                      <div className="bg-[#000000CC] md:h-14 h-10 md:w-14 w-10 flex items-center justify-center rounded-full mr-2">
                        <RiSubtractFill className="text-[#00EA82] md:text-3xl text-xl" />
                      </div>
                    )}
                    {transaction.transaction_type === "SWAP" && (
                      <div className="bg-[#000000CC] md:h-14 h-10 md:w-14 w-10 flex items-center justify-center rounded-full mr-2">
                        <MdOutlineSwapVert className="text-[#00EA82] md:text-3xl text-xl" />
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      {transaction.transaction_type === "ADD_LIQUIDITY" && (
                        <>
                          <p className="md:text-3xl text-xl font-medium">
                            {transaction.transaction_type.replace(
                              "ADD_LIQUIDITY",
                              "Add Liquidity"
                            )}
                          </p>
                          <div className="flex gap-2 *:md:text-base *:text-sm">
                            <div className="flex gap-1">
                              <p>
                                {parseInt(transaction.asset_0_in) /
                                  10 **
                                    assetMap[transaction.pool_id.split("_")[0]]
                                      .decimals}
                              </p>{" "}
                              <p>
                                {
                                  assetMap[transaction.pool_id.split("_")[0]]
                                    .symbol
                                }
                              </p>
                            </div>
                            /
                            <div className="flex gap-1">
                              <p>
                                {parseInt(transaction.asset_1_in) /
                                  10 **
                                    assetMap[transaction.pool_id.split("_")[1]]
                                      .decimals}
                              </p>{" "}
                              <p>
                                {
                                  assetMap[transaction.pool_id.split("_")[1]]
                                    .symbol
                                }
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                      {transaction.transaction_type === "REMOVE_LIQUIDITY" && (
                        <>
                          <p className="md:text-3xl text-xl font-medium">
                            {transaction.transaction_type.replace(
                              "REMOVE_LIQUIDITY",
                              "Remove Liquidity"
                            )}
                          </p>
                          <div className="flex gap-2 *:md:text-base *:text-sm">
                            <div className="flex gap-1">
                              <p>
                                {parseInt(transaction.asset_0_out) /
                                  10 **
                                    assetMap[transaction.pool_id.split("_")[0]]
                                      .decimals}
                              </p>{" "}
                              <p>
                                {
                                  assetMap[transaction.pool_id.split("_")[0]]
                                    .symbol
                                }
                              </p>
                            </div>
                            /
                            <div className="flex gap-1">
                              <p>
                                {parseInt(transaction.asset_1_out) /
                                  10 **
                                    assetMap[transaction.pool_id.split("_")[1]]
                                      .decimals}
                              </p>{" "}
                              <p>
                                {
                                  assetMap[transaction.pool_id.split("_")[1]]
                                    .symbol
                                }
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {transaction.transaction_type === "SWAP" &&
                        parseInt(transaction.asset_0_in) > 0 && (
                          <>
                            <p className="md:text-3xl text-xl font-medium">
                              {transaction.transaction_type.replace(
                                "SWAP",
                                "Swap"
                              )}
                            </p>
                            <div className="flex gap-2 *:md:text-base *:text-sm items-center">
                              <div className="flex gap-1">
                                <p>
                                  {parseInt(transaction.asset_0_in) /
                                    10 **
                                      assetMap[
                                        transaction.pool_id.split("_")[0]
                                      ].decimals}
                                </p>{" "}
                                <p>
                                  {
                                    assetMap[transaction.pool_id.split("_")[0]]
                                      .symbol
                                  }
                                </p>
                              </div>
                              <FaLongArrowAltRight />
                              <div className="flex gap-1">
                                <p>
                                  {parseInt(transaction.asset_1_out) /
                                    10 **
                                      assetMap[
                                        transaction.pool_id.split("_")[1]
                                      ].decimals}
                                </p>{" "}
                                <p>
                                  {
                                    assetMap[transaction.pool_id.split("_")[1]]
                                      .symbol
                                  }
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                      {transaction.transaction_type === "SWAP" &&
                        parseInt(transaction.asset_1_in) > 0 && (
                          <>
                            <p className="md:text-3xl text-xl font-medium">
                              {transaction.transaction_type.replace(
                                "SWAP",
                                "Swap"
                              )}
                            </p>
                            <div className="flex gap-2 *:md:text-base *:text-sm items-center">
                              <div className="flex gap-1">
                                <p>
                                  {parseInt(transaction.asset_1_in) /
                                    10 **
                                      assetMap[
                                        transaction.pool_id.split("_")[1]
                                      ].decimals}
                                </p>{" "}
                                <p>
                                  {
                                    assetMap[transaction.pool_id.split("_")[1]]
                                      .symbol
                                  }
                                </p>
                              </div>
                              <FaLongArrowAltRight />
                              <div className="flex gap-1">
                                <p>
                                  {parseInt(transaction.asset_0_out) /
                                    10 **
                                      assetMap[
                                        transaction.pool_id.split("_")[0]
                                      ].decimals}
                                </p>{" "}
                                <p>
                                  {
                                    assetMap[transaction.pool_id.split("_")[0]]
                                      .symbol
                                  }
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <MdOutlineAccessTime className="md:text-3xl text-xl" />
                    <p className="md:text-base text-xs">
                      {getTimeAgo(transaction.block_time)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-4 mt-6 items-center">
            <button
              className="px-4 py-2 bg-white/20 backdrop-blur-2xl text-white rounded disabled:opacity-50 hover:bg-white/30"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span className="text-white">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="px-6 py-2 bg-white/20 backdrop-blur-2xl text-white rounded disabled:opacity-50 hover:bg-white/30"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="w-full xl:h-screen xl:pt-0 xl:pb-0 pt-32i pb-16 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-2xl flex justify-center items-stretch flex-col md:w-auto w-full rounded-md overflow-hidden">
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
          <div className="bg-[#181818] flex items-end justify-center gap-10 py-6 px-3">
            <h4 className="text-green-400 text-4xl font-semibold">
              DIESEL POINTS:
            </h4>
            <p className="text-2xl">Coming Soon...</p>
          </div>
        )}
        <div className="flex xl:flex-row flex-col gap-16 p-8 mt-2">
          <div className=" xl:p-0 p-8 rounded-md flex flex-col items-center">
            <p className="font-bold md:md:text-3xl text-xl text-2xl text-center mb-8">
              Total Trades
            </p>
            <div className=" rounded-full border-green-400 border-8 md:w-56 w-44 md:h-56 h-44 flex items-center justify-center">
              <div className="rounded-full border-dashed border-[2px] border-[rgba(255,255,255,0.3)] md:w-48 w-36 md:h-48 h-36 flex flex-col items-center justify-center">
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
          </div>
          <div className=" flex flex-col rounded-md">
            <p className="font-bold md:text-3xl text-2xl mb-8">
              Engagement acrosss Diesel Dex
            </p>
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
                <div className="bg-[rgb(24,24,24)] p-5 flex flex-col gap-6 justify-between rounded-md h-auto">
                  <div className="w-14">
                    <img
                      src="/images/lp.png"
                      alt=""
                      className=" object-cover w-full"
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="md:text-4xl text-3xl font-semibold">
                      ${data?.lpPositionSum.toFixed(2) || 0}
                    </p>
                    <p className="md:text-sm text-xs opacity-80 font-semibold">
                      LP POSITION
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
                  <div className="w-16">
                    <img
                      src="/images/swap.png"
                      alt=""
                      className=" object-cover w-full"
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="md:text-4xl text-3xl font-semibold">
                      ${data?.tradedVolSum.toFixed(2) || 0}
                    </p>
                    <p className="md:text-sm text-xs opacity-80 font-semibold">
                      TRADED VOLUME
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div> */
}

export default HomePoints;
