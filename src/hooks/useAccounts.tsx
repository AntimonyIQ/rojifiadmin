import { accountsAPI } from "@/services/accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchVirtualAccounts = (userId: string) => {
  return useQuery({
    queryKey: ["user_virtual_accounts", userId],
    queryFn: () => accountsAPI.getVirtualAccounts(userId),
    enabled: !!userId,
  });
};

export const useFetchLinkedBankAccounts = (userId: string) => {
  return useQuery({
    queryKey: ["user_linked_bank_accounts", userId],
    queryFn: () => accountsAPI.getLinkedAccounts(userId),
    enabled: !!userId,
  });
};

export const useIssueVirtualAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["issue_virtual_account"],
    mutationFn: (payload: { id: string }) =>
      accountsAPI.issueVirtualAccount(payload.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_virtual_accounts"] }),
  });
};
