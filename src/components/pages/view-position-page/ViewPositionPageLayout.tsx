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
        <div className="mt-16">
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
            <main className={styles.viewPositionLayout}>
              <div className="z-20 mt-16 bg-white rounded-xl shadow-md h-max-[550px] overflow-y-scroll p-6 overflow-x-hidden flex flex-col gap-6">
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
