import React from "react";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import { PiCopyLight } from "react-icons/pi";
import { useModal } from "@/context/ModalContext";

const WalletProfile = () => {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== "WalletProfile") return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center p-4 w-full bg-black/50 z-50">
      <div className="lg:absolute lg:right-16 lg:top-20 bg-white rounded-2xl w-full lg:max-w-sm">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold">Wallet</h2>
            <button
              onClick={closeModal}
              className="text-xl lg:text-2xl hover:text-[#E16B31] transition-colors duration-300"
            >
              <IoCloseCircleOutline />
            </button>
          </div>

          <div className="space-y-4 lg:space-y-6 overflow-y-auto">
            <div className="flex justify-start items-center gap-2">
              <Image
                src="/images/icon/icon-fuel-dev.png"
                alt=""
                width={100}
                height={100}
                quality={100}
                className="w-6 lg:w-8 h-6 lg:h-8"
              />
              <p className="text-sm lg:text-base">2VdzLvPZrpvgwT5...</p>

              <div className="text-lg lg:text-xl cursor-pointer">
                <PiCopyLight />
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full pt-4 lg:pt-6 border-t border-[#E5E9EB] ">
              <p className="text-[#84919A]">December 12,2024</p>
              <div className="flex justify-between items-center">
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
                <div>
                  <button className="px-4 py-1 lg:py-1.5 rounded-full text-[#E16B31] bg-[#E16B31] bg-opacity-10">
                    Swap
                  </button>
                </div>
              </div>
              <p className="font-medium">NaN Physco Ducky For NaN Etherum</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletProfile;
