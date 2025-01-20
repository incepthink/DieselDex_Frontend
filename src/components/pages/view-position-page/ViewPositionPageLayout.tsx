"use client";

import styles from "./ViewPositionPageLayout.module.css";
import { createPoolIdFromPoolKey, isPoolIdValid } from "@/utils/common";
import { useRouter, useSearchParams } from "next/navigation";
import PositionView from "@/components/pages/view-position-page/components/PositionView/PositionView";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import Image from "next/image";
import clsx from "clsx";

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
          <div className="fixed top-0 bg-black text-black w-full lg:pt-24 pt-10">
            <main className={styles.viewPositionLayout}>
              <div
                style={{
                  boxShadow: "inset 0px 0px 5px 5px rgba(255,255,255,0.1)",
                }}
                className={clsx(
                  "text-white bg-white/10 backdrop-blur-2xl inset-shadow-sm inset-shadow-white/20 ring ring-white/50 inset-ring inset-ring-white/100 z-20 mt-16 rounded-xl p-6 flex flex-col gap-6"
                )}
              >
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
