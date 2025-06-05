import { currencyAPI } from "@/services/currency";
import { AddCurrencyPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchAdminCurrencies = () => {
  return useQuery({
    queryKey: ["admin_currencies"],
    queryFn: currencyAPI.fetchPaymentProcessors,
  });
};

export const useFetchExchangeRates = () => {
  return useQuery({
    queryKey: ["exchange_rates"],
    queryFn: currencyAPI.exchange_rates,
  });
};

export const useEditExchangeRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit_exchange_rate"],
    mutationFn: (payload: { id: string; data: any }) =>
      currencyAPI.update_rates(payload.id, payload.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["exchange_rates"] }),
  });
};

export const useCreateCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_currency"],
    mutationFn: (payload: AddCurrencyPayload) => currencyAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_currencies"] });
    },
  });
};

export const useAddExchangeRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_exchange_rate"],
    mutationFn: (payload: any) => currencyAPI.add_exchange_rate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exchange_rates"] });
    },
  });
};

export const useEditCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit_currency"],
    mutationFn: (payload: { id: string; data: any }) =>
      currencyAPI.update(payload.id, payload.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin_currencies"] }),
  });
};
