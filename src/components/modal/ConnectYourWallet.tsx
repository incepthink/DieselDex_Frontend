import { useModal } from "@/context/ModalContext";
import Image from "next/image";
import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

const wallets = [
  {
    name: "Fuel Wallet",
    icon: "/images/icon/icon-fuel.png",
  },
  { name: "Fuel Wallet Development", icon: "/images/icon/icon-fuel-dev.png" },
  { name: "Fuelet Wallet", icon: "/images/icon/icon-fuelet.png" },
];

const ConnectYourWallet = () => {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== "ConnectYourWallet") return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 w-full bg-black/50 z-50 ">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
            <button
              onClick={closeModal}
              className="text-xl lg:text-2xl hover:text-[#E16B31] transition-colors duration-300"
            >
              <IoCloseCircleOutline />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto">
            {wallets.map((wallet, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-2 px-4 py-2 lg:py-2.5 border border-[#D4D4D8] hover:bg-[#FAF8F1] rounded-xl transition-colors"
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={100}
                  height={100}
                  quality={100}
                  className="w-6 lg:w-8 h-6 lg:h-8"
                />
                <div className="flex flex-col items-start">
                  <p className="text-sm lg:text-base">{wallet.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectYourWallet;
