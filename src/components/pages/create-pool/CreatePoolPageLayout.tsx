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
            <main className={styles.addLiquidityLayout} ref={mainRef}>
              <div
                style={{
                  boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
                }}
                className="z-20 mt-16 bg-white/10 text-white overflow-hidden backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100 rounded-xl shadow-md p-4"
              >
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
