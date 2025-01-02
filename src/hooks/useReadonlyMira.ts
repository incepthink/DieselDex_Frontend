import { useMemo } from "react";
import { ReadonlyMiraAmm } from "disel-dex-ts";
import useProvider from "@/hooks/useProvider/useProvider";
import { DEFAULT_AMM_CONTRACT_ID } from "@/utils/constants";

const useReadonlyMira = () => {
  const provider = useProvider();

  return useMemo(() => {
    if (provider) {
      return new ReadonlyMiraAmm(provider, DEFAULT_AMM_CONTRACT_ID);
    }
  }, [provider]);
};

export default useReadonlyMira;
