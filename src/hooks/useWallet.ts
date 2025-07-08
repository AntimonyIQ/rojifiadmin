import { walletsAPI } from "@/services/wallets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchUserWallets = (userId: string) => {
  return useQuery({
    queryKey: ["user_wallets", userId],
    queryFn: () => walletsAPI.getUserWallets(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_user_wallet"],
    mutationFn: (payload: { id: string; data: any }) =>
      walletsAPI.updateUserWallet(payload.id, payload.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_wallets"] }),
  });
};

export const useCreditUserWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["credit_user_wallet"],
    mutationFn: (payload: {
      amount: number;
      currency: string;
      user_id: string;
    }) => walletsAPI.creditUserWallet(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user_wallets", "transactions"],
      }),
  });
};

export const useDebitUserWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["debit_user_wallet"],
    mutationFn: (payload: {
      amount: number;
      currency: string;
      user_id: string;
    }) => walletsAPI.debitUserWallet(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user_wallets", "transactions"],
      }),
  });
};
