import React, { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLoopLeftFill } from "react-icons/ri";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelector from "@/components/ui/CustomSelector";
import { useModal } from "@/context/ModalContext";
import Image from "next/image";

interface Token {
  label: string;
  value: string;
  icon: string;
}

const SwapForm: React.FC = () => {
  const { openModal } = useModal();

  const [sellToken, setSellToken] = useState<string>("PSYCHO");
  const [buyToken, setBuyToken] = useState<string>("ETH");
  const [sellAmount, setSellAmount] = useState<string>("0");
  const [buyAmount, setBuyAmount] = useState<string>("0");

  const [isWalletConnect, setIsWalletConnect] = useState<boolean>(true);
  console.log(setIsWalletConnect);

  const tokens: Token[] = [
    { label: "PSYCHO", value: "PSYCHO", icon: "/images/icon/icon-psycho.png" },
    { label: "ETH", value: "ETH", icon: "/images/icon/icon-eth.png" },
  ];

  return (
    <div className="border border-black border-opacity-0 w-full p-4 lg:p-6 rounded-md h-full">
      <div className="flex items-center justify-between">
        <p className="text-xl lg:text-xl font-bold">Swap</p>
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2 bg-black bg-opacity-10 rounded-md px-4 py-2">
            <p className="text-sm font-medium text-black text-opacity-60">
              1% slippage
            </p>
          </div>
          <IoSettingsOutline className="text-2xl text-[#757575]" />
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <div className="rounded-lg p-2 lg:p-4 bg-[#FAF8F1]">
          <p className="font-medium text-black text-opacity-75 mb-2">Sell</p>
          <div className="flex justify-between gap-1 lg:gap-2">
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
          {isWalletConnect && (
            <div className="flex justify-end items-end">
              <div className="flex justify-center items-center gap-1 text-[#757575]">
                <span className="text-sm lg:text-base font-medium">
                  Balance:
                </span>
                <span className="text-xs lg:text-sm">234563454343453</span>
                <span className="text-sm lg:text-base font-medium text-[#E16B31]">
                  Max
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4">
          <div className="h-[1px] w-full bg-[#E5E9EB]" />
          <div className="p-2 rounded-full bg-[#E16B31] text-xl text-white cursor-pointer">
            <RiLoopLeftFill />
          </div>
          <div className="h-[1px] w-full bg-[#E5E9EB]" />
        </div>

        <div className="rounded-lg p-2 lg:p-4 bg-[#FAF8F1]">
          <p className="font-medium text-black text-opacity-75 mb-2">Buy</p>
          <div className="flex justify-between gap-2">
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
          {isWalletConnect && (
            <div className="flex justify-end items-end">
              <div className="flex justify-center items-center gap-1 text-[#757575]">
                <span className="text-sm lg:text-base font-medium">
                  Balance:
                </span>
                <span className="text-xs lg:text-sm">0.0000000000453</span>
                <span className="text-sm lg:text-base font-medium text-[#E16B31]">
                  Max
                </span>
              </div>
            </div>
          )}
        </div>

        {isWalletConnect && (
          <div className="flex flex-col w-full gap-1 text-[#757575] text-sm lg:text-base">
            <div className="flex justify-between items-center gap-4">
              <p className="font-medium">Rate</p>
              <p className="font-semibold">1 PHYSCO ≈ 0.00000000453 ETH</p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <p className="font-medium">Order Routing</p>
              <div className="flex justify-center items-center gap-1">
                <div className="flex -space-x-2">
                  <div className="w-5 h-5">
                    <Image
                      src="/images/icon/icon-pool-ezeth.png"
                      alt="token"
                      width={100}
                      height={100}
                      quality={100}
                      className="object-contain w-full"
                    />
                  </div>
                  <div className="w-5 h-5">
                    <Image
                      src="/images/icon/icon-pool-eth.png"
                      alt="token"
                      width={100}
                      height={100}
                      quality={100}
                      className="object-contain w-full"
                    />
                  </div>
                </div>
                <p className="font-semibold">(0.3)</p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4">
              <p className="font-medium">Estimated Fees</p>
              <p className="font-semibold">3.0000 PHYSCO</p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <p className="font-medium">Network Cost</p>
              <p className="font-semibold">0.00000000003 ETH</p>
            </div>
          </div>
        )}

        <div className="py-4 pb-16 lg:pb-8">
          <button
            onClick={() => openModal("ConnectYourWallet")}
            className="w-full rounded-md bg-[#E16B31] hover:bg-[#E16B31] py-3 text-white"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
