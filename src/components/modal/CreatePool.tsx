"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import { PiQuestionDuotone } from "react-icons/pi";
import CustomInput from "../ui/CustomInput";
import CustomSelector from "../ui/CustomSelector";
import { useModal } from "@/context/ModalContext";

const tokens = [
  {
    label: "Choose Asset",
    value: "Choose Asset",
    icon: "/images/icon/icon-question.png",
  },
  {
    label: "ezETH",
    value: "ezETH",
    icon: "/images/icon/icon-pool-ezeth.png",
  },
  { label: "ETH", value: "ETH", icon: "/images/icon/icon-pool-eth.png" },
  { label: "USDC", value: "USDC", icon: "/images/icon/icon-pool-usdc.png" },
  { label: "USDT", value: "USDT", icon: "/images/icon/icon-pool-usdt.png" },
];

const CreatePool: React.FC = () => {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== "CreatePool") return null;

  const [sellToken, setSellToken] = useState<string>("Choose Asset");
  const [buyToken, setBuyToken] = useState<string>("Choose Asset");
  const [sellAmount, setSellAmount] = useState<string>("0");
  const [buyAmount, setBuyAmount] = useState<string>("0");

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

            <div className="flex justify-between items-center w-full mb-2">
              <div className="flex -space-x-2">
                {sellToken !== "Choose Asset" && (
                  <div className="w-5 lg:w-7 h-5 lg:h-7">
                    <Image
                      src={
                        tokens.find((token) => token.value === sellToken)
                          ?.icon || ""
                      }
                      alt="Sell token"
                      width={100}
                      height={100}
                      quality={100}
                      className="object-contain w-full"
                    />
                  </div>
                )}
                {buyToken !== "Choose Asset" && (
                  <div className="w-5 lg:w-7 h-5 lg:h-7">
                    <Image
                      src={
                        tokens.find((token) => token.value === buyToken)
                          ?.icon || ""
                      }
                      alt="Buy token"
                      width={100}
                      height={100}
                      quality={100}
                      className="object-contain w-full"
                    />
                  </div>
                )}
              </div>
              <div className="px-4 py-1 lg:py-1.5 rounded-full text-[#E16B31] bg-[#E16B31] bg-opacity-10">
                {sellToken !== "Choose Asset" && buyToken !== "Choose Asset"
                  ? `${sellToken}/${buyToken}`
                  : "Select Tokens"}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative p-2 bg-[#FAF8F1] w-full rounded-md cursor-pointer hover:ring-1 ring-[#E16B31]">
                <PiQuestionDuotone className="absolute top-2 right-2 text-lg text-[#757575]" />
                <p className="font-semibold text-black text-opacity-60">
                  Volatile pool
                </p>
                <p className="text-sm text-black text-opacity-60">
                  0.30% fee tier
                </p>
              </div>
              <div className="relative p-2 bg-[#FAF8F1] w-full rounded-md cursor-pointer hover:ring-1 ring-[#E16B31]">
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
                onChange={(value: string) => setSellToken(value)}
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
                onChange={(value: string) => setBuyToken(value)}
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
