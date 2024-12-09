"use client";

import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { PiQuestionDuotone } from "react-icons/pi";
import CustomInput from "../ui/CustomInput";
import CustomSelector from "../ui/CustomSelector";
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

const CreatePool: React.FC = () => {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== "CreatePool") return null;

  const [sellToken, setSellToken] = useState("Choose Asset");
  const [buyToken, setBuyToken] = useState("Choose Asset");
  const [sellAmount, setSellAmount] = useState("0");
  const [buyAmount, setBuyAmount] = useState("0");

  const tokens = [
    {
      label: "Choose Asset",
      value: "Choose Asset",
      icon: "/images/icon/icon-question.png",
    },
    { label: "PSYCHO", value: "PSYCHO", icon: "/images/icon/icon-psycho.png" },
    { label: "ETH", value: "ETH", icon: "/images/icon/icon-eth.png" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 w-full bg-black/50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold">Create Pool</h2>
            <button
              onClick={closeModal}
              className="text-xl lg:text-2xl hover:text-[#E16B31] transition-colors duration-300"
            >
              <IoCloseCircleOutline />
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <p className="font-medium">Selected Pair</p>
            <div className="flex gap-4">
              <div className="relative p-2 bg-[#FAF8F1] w-full rounded-md">
                <PiQuestionDuotone className="absolute top-2 right-2 text-lg text-[#757575]" />
                <p className="font-semibold text-black text-opacity-60">
                  Volatile pool
                </p>
                <p className="text-sm text-black text-opacity-60">
                  0.30% fee tier
                </p>
              </div>
              <div className="relative p-2 bg-[#FAF8F1] w-full rounded-md">
                <PiQuestionDuotone className="absolute top-2 right-2 text-lg text-[#757575]" />
                <p className="font-semibold text-black text-opacity-60">
                  Volatile pool
                </p>
                <p className="text-sm text-black text-opacity-60">
                  0.30% fee tier
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-medium"> Create Assest</p>
            <div className="flex justify-between gap-2 p-2 rounded-md bg-[#FAF8F1]">
              <CustomInput
                label=""
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="border-none"
              />
              <CustomSelector
                label=""
                value={sellToken}
                onChange={(value: any) => setSellToken(value)}
                options={tokens}
                className="!border-none"
              />
            </div>
            <div className="flex justify-between gap-2 p-2 rounded-md bg-[#FAF8F1]">
              <CustomInput
                label=""
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="border-none"
              />
              <CustomSelector
                label=""
                value={buyToken}
                onChange={(value: any) => setBuyToken(value)}
                options={tokens}
                className="!border-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full rounded-md bg-[#E16B31] hover:bg-[#E16B31] py-3 text-white">
              Create Assest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePool;
