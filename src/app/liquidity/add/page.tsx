import LayoutWrapper from "@/components/common/LayoutWrapper";
import AddLiquidityPageLayout from "@/components/pages/add-liquidity/AddLiquidityPageLayout";

const AddLiquidityPage = () => {
  return (
    <LayoutWrapper>
      {/* <Suspense> */}
      <AddLiquidityPageLayout />
      {/* </Suspense> */}
    </LayoutWrapper>
  );
};

export default AddLiquidityPage;
