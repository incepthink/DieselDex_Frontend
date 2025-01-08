"use client";

import Image from "next/image";
import { IoTimeOutline } from "react-icons/io5";
import { FiLink } from "react-icons/fi";
import { BiCopy } from "react-icons/bi";

const trades = [
  {
    time: "17M AGO",
    type: "SELL",
    price: "$0.00151988",
    value: "$0.780957",
    amount: {
      psycho: "-506.8 PSYCHO",
      eth: "+0.00344404 ETH",
    },
    hash: "2VDZLVPZRPVGW...",
  },
  {
    time: "17M AGO",
    type: "SELL",
    price: "$0.00151988",
    value: "$0.780957",
    amount: {
      psycho: "-506.8 PSYCHO",
      eth: "+0.00344404 ETH",
    },
    hash: "2VDZLVPZRPVGW...",
  },
];

export default function RecentTrades() {
  return (
    <div className="border border-black border-opacity-20 w-full font-medium p-6 rounded-md shadow-md">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-2">
        <p className="text-lg lg:text-xl font-bold text-[#E16B31]">
          Recent Trades
        </p>
        <input
          placeholder="Search transactions..."
          className="py-2 px-2 border border-black border-opacity-20 rounded outline-none"
        />
      </div>
      <div className="mt-4">
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm lg:text-base">
            <thead className="uppercase text-muted-foreground w-full">
              <tr className="text-[#84919A]">
                <th className="px-4 py-3">
                  <span className="flex gap-1 items-center">
                    Time <IoTimeOutline />
                  </span>
                </th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Hash</th>
                <th className="px-4 py-3">Links</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr
                  key={index}
                  className="border-t border-border hover:bg-muted/50"
                >
                  <td className="px-4 py-3">{trade.time}</td>
                  <td className="px-4 py-3">
                    <span className="flex justify-center items-center  bg-[#F23645] text-white p-2 w-8 h-8 rounded-full">
                      {trade.type === "SELL" ? "S" : "B"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{trade.price}</td>
                  <td className="px-4 py-3">{trade.value}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-4 h-4">
                          <Image
                            src="/images/icon/icon-psycho.png"
                            alt="icon"
                            width={100}
                            height={100}
                            quality={100}
                            className="object-cover w-full"
                          />
                        </div>
                        <span>{trade.amount.psycho}</span>
                      </div>
                      <div className="flex justify-start items-center gap-1">
                        <div className="w-4 h-4">
                          <Image
                            src="/images/icon/icon-eth.png"
                            alt="icon"
                            width={100}
                            height={100}
                            quality={100}
                            className="object-cover w-full"
                          />
                        </div>
                        <span>{trade.amount.eth}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {trade.hash}
                    <button>
                      <BiCopy className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button>
                        <FiLink />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
