import { useModal } from "@/context/ModalContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaTelegram, FaXTwitter } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import Confetti from "../common/Confetti";

const WaitlistModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const [show, setShow] = useState(false);

  const [data, setData] = useState({
    wallet: "",
    telegram: "",
    message: "",
    date: new Date().toString(),
  });

  if (activeModal !== "WaitlistModal") return null;

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      "https://api.sheetbest.com/sheets/d504785a-6ce7-44d9-9111-ee0fceec4837",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((r) => r.json())
      .then((data) => {
        // The response comes here
        console.log(data);
        setShow(true);
      })
      .catch((error) => {
        // Errors are reported there
        console.log(error);
      });

    setTimeout(() => {
      setShow(false);
      setData({ ...data, wallet: "", telegram: "", message: "" });
      closeModal();
    }, 3000);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center p-4 w-full bg-black/50 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="p-4 lg:p-6">
            <div className="mb-6">
              <div className="flex items-center justify-end ">
                <button
                  onClick={closeModal}
                  className="text-xl lg:text-2xl hover:text-[#E16B31] transition-colors duration-300"
                >
                  <IoCloseCircleOutline />
                </button>
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-lg lg:text-xl font-semibold">
                  Join Waitlist
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 w-60 mx-auto">
              <form
                action=""
                className="flex flex-col items-center gap-6 w-full"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  name="wallet"
                  placeholder="Wallet Address"
                  required
                  className="bg-[#e16c312a] py-2 px-3 rounded-lg font-medium outline-none border-2 border-[#e16c312d] focus:border-[#e16c3191]  w-full"
                  id=""
                  value={data.wallet}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="telegram"
                  placeholder="Telegram"
                  required
                  className="bg-[#e16c312a] py-2 px-3 rounded-lg font-medium outline-none border-2 border-[#e16c312d] focus:border-[#e16c3191] w-full"
                  id=""
                  value={data.telegram}
                  onChange={handleChange}
                />
                <textarea
                  name="message"
                  className="bg-[#e16c312a] py-2 px-3 rounded-lg font-medium outline-none border-2 border-[#e16c312d] focus:border-[#e16c3191] w-full"
                  placeholder="Message"
                  rows={3}
                  value={data.message}
                  onChange={handleChange}
                />
                <button className="bg-[#E16B31] text-white font-semibold text-xl px-6 py-3 rounded-lg">
                  Submit
                </button>
                <div className="flex justify-center gap-6 transition mt-2">
                  <Link href="https://x.com/hash_case" target="_blank">
                    <FaXTwitter className="text-black text-3xl hover:text-[#E16B31] transition" />
                  </Link>
                  <Link href="https://t.me/+mAwEa97RSwowYzVl" target="_blank">
                    <FaTelegram className="text-black text-3xl hover:text-[#E16B31] transition" />
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Confetti show={show} />
      </div>
    </>
  );
};

export default WaitlistModal;
