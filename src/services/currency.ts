import { apiInstance } from "@/lib/apiInstance";
import {
  AddCurrencyPayload,
  AdminCurrencyProps,
  EditCurrencyPayload,
  ExchangeRate,
} from "@/types";

export const currencyAPI = {
  fetchPaymentProcessors: async (): Promise<AdminCurrencyProps[]> => {
    const response = await apiInstance.get("/currency/admin/all");
    // console.log("admin currencies response data:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, payload: EditCurrencyPayload): Promise<any> => {
    const response = await apiInstance.patch(`currency/${id}`, payload);
    // console.log("update currency response data:", response.data.data);
    return response.data.data;
  },
  create: async (payload: AddCurrencyPayload): Promise<any> => {
    const response = await apiInstance.post("/currency", payload);
    // console.log("create currency response data:", response.data.data);
    return response.data.data;
  },
  exchange_rates: async (): Promise<ExchangeRate[]> => {
    const response = await apiInstance.get("/exchange-rate");
    // console.log("exchnage rates response data:", response.data.data);
    return response.data.data;
  },
  update_rates: async (id: string, payload: any): Promise<any> => {
    const response = await apiInstance.patch(`exchange-rate/${id}`, {
      rate: payload,
    });
    console.log("updated exchange rate data:", response.data.data);
    return response.data.data;
  },
};
