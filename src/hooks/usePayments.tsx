import { paymentAPI } from "@/services/payments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchPaymentProcessors = () => {
  return useQuery({
    queryKey: ["payment_processors"],
    queryFn: paymentAPI.fwtchPaymentProcessors,
  });
};

export const useUpdatePaymentProcessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_payment_processor"],
    mutationFn: (payload: { id: string; data: any }) =>
      paymentAPI.update(payload.id, payload.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payment_processors"] }),
  });
};

export const useAddProcessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_payment_processor"],
    mutationFn: (payload: any) => paymentAPI.create(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payment_processors"] }),
  });
};
