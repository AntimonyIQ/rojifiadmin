import { kycAPI } from "@/services/kyc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchUserKYC = (userId: string) => {
  return useQuery({
    queryKey: ["user_kyc", userId],
    queryFn: () => kycAPI.getUserKYC(userId),
    enabled: !!userId,
  });
};

export const useUpdateKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_kyc"],
    mutationFn: (payload: { id: string; data: any }) =>
      kycAPI.updateKyc(payload.id, payload.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["user_kyc", variables.id],
      });
    },
  });
};
