"use client";

// import BackLink from "@/components/common/BackLink/BackLink";

import styles from "../add-liquidity/AddLiquidityPageLayout.module.css";
import CreatePool from "../create-pool/CreatePool/CreatePool";
import { useEffect, useRef } from "react";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Image from "next/image";

const CreatePoolPageLayout = () => {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <LayoutWrapper>
        <div className="">
          <div className="fixed top-0 bg-black text-black w-full h-screen">
            <div className="absolute top-32" style={{ width: "1480px" }}>
              <img src="/images/line.png" alt="" className="w-full" />
            </div>
            <div
              className="absolute bottom-0 rotate-[135deg]"
              style={{ width: "1800px" }}
            >
              <img src="/images/line.png" alt="" className="w-full" />
            </div>
            <main className={styles.addLiquidityLayout} ref={mainRef}>
              <div className="z-20 mt-16 bg-white rounded-xl shadow-md h-[550px] overflow-y-scroll p-4 overflow-x-hidden">
                <CreatePool />
              </div>
            </main>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
};

export default CreatePoolPageLayout;
