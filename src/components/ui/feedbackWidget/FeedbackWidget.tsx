"use client";
import { useState } from "react";
import { clsx } from "clsx";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

export default function FeedbackWidget() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [shownstatus, setShownStatus] = useState("");
  const [data, setData] = useState({
    telegram: "",
    message: "",
    date: new Date().toString(),
  });

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log(JSON.stringify(data));

      // const res = await axios.post(
      //   "https://api.sheetbest.com/sheets/bf2514ed-9250-454b-8d70-b0a50165f744",
      //   JSON.stringify(data)
      // );

      const res = await fetch(
        "https://api.sheetbest.com/sheets/bf2514ed-9250-454b-8d70-b0a50165f744",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (res.ok) {
        setShownStatus("Successfully sent feedback!");
        setTimeout(() => {
          setShownStatus("");
          setIsExpanded(false);
          setData({
            ...data,
            telegram: "",
            message: "",
          });
        }, 2000);
      } else {
        setShownStatus("An Error occurred");
        setTimeout(() => {
          setShownStatus("");
          setIsExpanded(false);
          setData({
            ...data,
            telegram: "",
            message: "",
          });
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      setShownStatus("An Error occurred");
      setTimeout(() => {
        setShownStatus("");
        setIsExpanded(false);
        setData({
          ...data,
          telegram: "",
          message: "",
        });
      }, 2000);
      setLoading(false);
    }
  };

  return (
    <div
      style={{ zIndex: "100" }}
      className={clsx(
        "fixed lg:right-20 lg:bottom-20 right-6 bottom-6  ease-out flex justify-center items-center",
        !isExpanded &&
          "lg:w-28 lg:h-28 h-16 w-16  rounded-full cursor-pointer border-2",
        isExpanded && "bg-white/70 rounded-md text-black"
      )}
      onClick={() => {
        isExpanded === false && setIsExpanded(true);
      }}
    >
      {isExpanded ? (
        <div className="p-3 rounded-md shadow-2xl relative">
          {shownstatus !== "" && (
            <div className="absolute -translate-y-3 -translate-x-3 rounded-md w-full h-full bg-white flex items-center justify-center">
              <p className="text-xl font-semibold text-center">{shownstatus}</p>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium sm:text-2xl text-xl">Feedback</p>
            <button
              className="bg-[#00F48D] rounded-full p-1"
              onClick={() => {
                isExpanded === true && setIsExpanded(false);
              }}
            >
              <IoMdClose color="black" className="  text-xl" />
            </button>
          </div>

          <form
            action=""
            className="flex flex-col gap-2"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              type="text"
              name="telegram"
              placeholder="Telegram"
              className="bg-[#E6FDF3] p-2 rounded sm:text-xl text-lg"
              value={data.telegram}
              onChange={(e) => handleChange(e)}
              required
            />
            <textarea
              name="message"
              id=""
              placeholder="Message"
              rows={4}
              className="bg-[#E6FDF3] p-2 rounded sm:text-xl text-lg outline-none"
              value={data.message}
              onChange={(e) => handleChange(e)}
              required
            ></textarea>
            <button
              type="submit"
              className="bg-[#00F48D] text-black py-2 px-4 rounded-sm disabled:opacity-85 sm:text-xl text-lg"
              disabled={loading}
            >
              {loading ? "Loading.." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <>
          <p className="text-center font-semibold text-white lg:text-base hidden lg:block text-xs -translate-y-0.5">
            Give us Feedback
          </p>
          <p className="text-center font-semibold text-white text-xs lg:hidden -translate-y-0.5">
            Feedback
          </p>
        </>
        // <div>
        //   <img src="/images/logo.png" alt="logo" />
        // </div>
      )}
    </div>
  );
}
