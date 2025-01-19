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
          <div className="z-20 mt-16 bg-white rounded-xl shadow-md p-4 overflow-x-hidden">
            <AddLiquidity poolId={poolId} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddLiquidityPageLayout;
