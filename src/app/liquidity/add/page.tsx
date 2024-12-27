import LayoutWrapper from "@/components/common/LayoutWrapper";
import AddLiquidityPageLayout from "@/components/pages/add-liquidity/AddLiquidityPageLayout";
import { Suspense } from "react";

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
