import { useQuery } from "@tanstack/react-query";
import useReadonlyMira from "@/hooks/useReadonlyMira";
import { PoolId } from "disel-dex-ts";

const usePoolsMetadata = (pools: PoolId[] | undefined) => {
  const mira = useReadonlyMira();
  const miraExists = Boolean(mira);

  const shouldFetch = miraExists && Boolean(pools);

  const { data, isPending } = useQuery({
    queryKey: ["poolsMetadata", pools],
    queryFn: async () => {
      return await Promise.all(
        pools!.map((poolId) => mira?.poolMetadata(poolId))
      );
    },
    enabled: shouldFetch,
  });

  return { poolsMetadata: data, poolsMetadataPending: isPending };
};

export default usePoolsMetadata;
