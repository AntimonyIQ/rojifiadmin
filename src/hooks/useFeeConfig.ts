import { feeConfigAPI } from "@/services/feeConfig";
import { useQuery } from "@tanstack/react-query";

export const useFetchFeeConfig = () => {
  return useQuery({
    queryKey: ["fee_config"],
    queryFn: feeConfigAPI.fetchConfig,
  });
};
