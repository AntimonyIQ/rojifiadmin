import { feeConfigAPI } from "@/services/feeConfig";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchFeeConfig = () => {
  return useQuery({
    queryKey: ["fee_config"],
    queryFn: feeConfigAPI.fetchConfig,
  });
};

export const useCreateFeeConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_fee_config"],
    mutationFn: (payload: any) => feeConfigAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee_config"] });
    },
  });
};

export const useUpdateFeeConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_fee_config"],
    mutationFn: (payload: { id: string; data: any }) =>
      feeConfigAPI.update(payload.id, payload.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fee_config"] }),
  });
};
