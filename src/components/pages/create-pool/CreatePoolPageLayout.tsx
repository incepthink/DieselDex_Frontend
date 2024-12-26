"use client";

// import BackLink from "@/components/common/BackLink/BackLink";

import styles from "../add-liquidity/AddLiquidityPageLayout.module.css";
import CreatePool from "../create-pool/CreatePool/CreatePool";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { isPoolKeyValid } from "@/utils/common";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Container from "@/components/common/Container";
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
        <div className=''>
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
