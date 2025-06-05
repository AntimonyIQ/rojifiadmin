import { transactionAPI } from "@/services/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { TransactionStatusPayload } from "@/types";

export const useFetchTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionAPI.fetchAllTransactions(),
    staleTime: 1000 * 60 * 1, // 1 minutes
  });
};

export const useFetchUserTransactions = (userId: string) => {
  return useQuery({
    queryKey: ["user_transaction", userId],
    queryFn: () => transactionAPI.fetchUserTransactions(userId),
    enabled: !!userId,
  });
};

export const useFetchTransactionVolume = (
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ["transaction_volumne", startDate, endDate],
    queryFn: () => transactionAPI.fetchTransactionVolume(startDate, endDate),
  });
};

export const useFetchTransactionChannels = () => {
  return useQuery({
    queryKey: ["transaction_channels"],
    queryFn: transactionAPI.fetchTransactionChannels,
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["update_transaction"],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TransactionStatusPayload;
    }) => transactionAPI.update(id, payload),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["user_transaction", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast({
        title: "Transaction updated",
        description: `Updated transaction with ${variables.id}`,
      });
    },
  });
};

export const useCreateTransactionChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_transaction_channel"],
    mutationFn: transactionAPI.createTransactionChannel,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transaction_channels"] }),
  });
};

export const useUpdateTransactionChannel = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationKey: ["update_transaction_channel"],
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      transactionAPI.updateTransactionChannel(id, payload),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["transaction_channels", variables.id],
      });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });

      toast({
        title: "Transaction Channel updated",
        description: `Updated transaction channel with ${variables.id}`,
      });
    },
  });
};
