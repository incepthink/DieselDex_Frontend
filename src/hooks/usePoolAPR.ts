import { useQuery } from "@tanstack/react-query";
import { PoolId } from "disel-dex-ts";
import { createPoolIdString } from "@/utils/common";
import { BackendUrl, SQDIndexerUrl } from "@/utils/constants";
import request, { gql } from "graphql-request";
import { clientAxios } from "@/utils/common";

const usePoolAPR = (pool: PoolId) => {
  const poolIdString = createPoolIdString(pool);

  const { data, isPending } = useQuery({
    queryKey: ["poolAPR", poolIdString],
    queryFn: async () => {
      // CHANGE STRUCTURE OF ID
      const newID = poolIdString.replace(/-/g, "_");
      const res = await clientAxios.get(`${BackendUrl}/pools/apr/${newID}`);
      console.log(newID);

      console.log(res, newID);

      const apr = res.data.data.apr;

      return apr;
    },
  });

  return { apr: data, isPending };
};

export default usePoolAPR;
