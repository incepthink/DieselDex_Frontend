import { useQuery } from "@tanstack/react-query";
import { PoolId } from "disel-dex-ts";
import { createPoolIdString } from "@/utils/common";
import { BackendUrl, SQDIndexerUrl } from "@/utils/constants";
import request, { gql } from "graphql-request";
import axios from "axios";

const usePoolAPR = (pool: PoolId) => {
  const poolIdString = createPoolIdString(pool);

  const { data, isPending } = useQuery({
    queryKey: ["poolAPR", poolIdString],
    queryFn: async () => {
      // CHANGE STRUCTURE OF ID
      const newID = poolIdString.replace(/-/g, "_");
      const res = await axios.get(`${BackendUrl}/pools/apr/${newID}`);
      console.log(res, poolIdString);

      const apr = res.data.data.apr;

      return apr;
    },
  });

  return { apr: data, isPending };
};

export default usePoolAPR;
