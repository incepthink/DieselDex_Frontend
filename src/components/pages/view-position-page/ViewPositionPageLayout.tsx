"use client";

import styles from "./ViewPositionPageLayout.module.css";
import { createPoolIdFromPoolKey, isPoolIdValid } from "@/utils/common";
import { useRouter, useSearchParams } from "next/navigation";
import PositionView from "@/components/pages/view-position-page/components/PositionView/PositionView";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Image from "next/image";

const ViewPositionPageLayout = () => {
  const router = useRouter();
  const query = useSearchParams();
  const poolKey = query.get("pool");
  const poolId = poolKey ? createPoolIdFromPoolKey(poolKey) : null;

  if (!poolId || !isPoolIdValid(poolId)) {
    router.push("/liquidity");
    return null;
  }

  return (
    <>
      <LayoutWrapper>
        <div className='mt-16'>
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
            <main className={styles.viewPositionLayout}>
              <div className='z-20 mt-16 bg-white rounded-xl shadow-md h-max-[550px] overflow-y-scroll p-6 overflow-x-hidden flex flex-col gap-6'>
                <PositionView pool={poolId} />
              </div>
            </main>
          </div>
        </div>
      </LayoutWrapper>
    </>
  );
};

export default ViewPositionPageLayout;
