import usePoolsData from "@/hooks/usePoolsData";
import { memo, useMemo } from "react";

type Props = {
  selectPool: (pool: string) => void;
};

const PoolsSearchModal = ({ selectPool }: Props) => {
  const { data, isLoading } = usePoolsData();
  console.log(data);

  return (
    <>
      <div className="flex flex-col gap-0.5">
        {data?.map((pool, i) => {
          return (
            <div
              className="hover:bg-white/10 cursor-pointer p-2 rounded-md"
              onClick={() => selectPool(pool.id)}
            >
              <p className="text-xl font-semibold">
                {pool.details.asset_0_symbol} {"<>"}{" "}
                {pool.details.asset_1_symbol}
              </p>
              <p className="text-sm">TVL: ${pool.details.tvl}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default memo(PoolsSearchModal);
