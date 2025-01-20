"use client";

import Header from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

import styles from "./AddLiquidityPageLayout.module.css";
import AddLiquidity from "./AddLiquidity/AddLiquidity";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPoolIdFromIdString } from "@/utils/common";
import { isMobile } from "react-device-detect";
import Image from "next/image";

const AddLiquidityPageLayout = () => {
  const router = useRouter();
  const query = useSearchParams();
  const poolKey = query.get("pool");
  const poolId = poolKey ? createPoolIdFromIdString(poolKey) : null;

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobile && mainRef.current) {
      mainRef.current.scrollIntoView();
    }
  }, []);

  if (!poolId) {
    router.push("/liquidity");
    return null;
  }

  return (
    <>
      <Header />
      <div className="fixed top-0 bg-black text-white w-full h-screen">
        <main className={styles.addLiquidityLayout} ref={mainRef}>
          <div
            // style={{
            //   boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
            // }}
            //inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100
            className="z-20 mt-16 bg-white/10 overflow-hidden backdrop-blur-2xl  rounded-xl shadow-md p-4"
          >
            <AddLiquidity poolId={poolId} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddLiquidityPageLayout;
