"use client";

import Header from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

import styles from "./AddLiquidityPageLayout.module.css";
import AddLiquidity from "./AddLiquidity/AddLiquidity";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPoolIdFromIdString, isPoolIdValid } from "@/utils/common";
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
      <div className='fixed top-0 bg-gradient-to-r from-[#FAF7F0] to-[#F7D4C3] w-full h-screen'>
        <div className='absolute bottom-0 w-full z-0'>
          <Image
            src={"/images/bg-image.png"}
            alt='hero'
            width={1000}
            height={500}
            quality={100}
            className='object-contain w-full'
          />
        </div>
        <main className={styles.addLiquidityLayout} ref={mainRef}>
          <div className='z-20 mt-16 bg-white rounded-xl shadow-md h-[550px] overflow-y-scroll p-4 overflow-x-hidden'>
            <AddLiquidity poolId={poolId} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AddLiquidityPageLayout;
