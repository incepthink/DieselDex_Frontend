"use server";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import AddLiquidityPageLayout from "@/components/pages/add-liquidity/AddLiquidityPageLayout";
import { Suspense } from "react";
import { cookies } from "next/headers";

export async function returnToken() {
  return cookies().get("OutsideJWT");
}

const AddLiquidityPage = () => {
  return (
    <LayoutWrapper>
      <Suspense>
        <AddLiquidityPageLayout />
      </Suspense>
    </LayoutWrapper>
  );
};

export default AddLiquidityPage;
