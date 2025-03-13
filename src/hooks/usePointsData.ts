import { PointsBackend } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const usePointsData = (userAddress: string) => {
  const { data, isPending } = useQuery({
    queryKey: ["pointsData", userAddress],
    queryFn: async () => {
      if (userAddress === "") {
        return;
      }

      const res = await axios.get(
        `${PointsBackend}/platform/home/${userAddress}`
      );

      return res.data;
    },
  });

  return { data, isPending };
};

export default usePointsData;
