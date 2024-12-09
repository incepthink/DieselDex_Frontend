"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";
import { useModal } from "@/context/ModalContext";

interface Token {
  name: string;
  symbol: string;
  icon: string;
}

const tokens: Token[] = [
  {
    name: "PSYCHO Coin",
    symbol: "PSYCHO",
    icon: "/images/icon/icon-psycho.png",
  },
  { name: "Ethereum", symbol: "ETH", icon: "/images/icon/icon-eth.png" },
];

const ChooseToken: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");

  if (activeModal !== "ChooseToken") return null;

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 w-full bg-black/50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold">Choose Token</h2>
            <button
              onClick={closeModal}
              className="text-xl lg:text-2xl hover:text-[#E16B31] transition-colors duration-300"
            >
              <IoCloseCircleOutline />
            </button>
          </div>

          <div className="relative mb-4 lg:mb-6">
            <IoSearchOutline className="absolute left-2 top-1/2 -translate-y-1/2 text-xl" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2.5 bg-[#FAF8F1] w-full rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-1 lg:space-y-2 h-[230px] overflow-y-auto">
            {filteredTokens.map((token, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 p-3 lg:p-4 hover:bg-[#FAF8F1] rounded-xl transition-colors"
              >
                <Image
                  src={token.icon}
                  alt={token.name}
                  width={100}
                  height={100}
                  quality={100}
                  className="w-9 lg:w-10 h-9 lg:h-10 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">{token.symbol}</span>
                  <span className="text-sm text-[#757575]">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseToken;
