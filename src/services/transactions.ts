import { apiInstance } from "@/lib/apiInstance";
import {
  Transaction,
  TransactionStatusPayload,
  TransactionVolume,
} from "@/types";

export const transactionAPI = {
  fetchAllTransactions: async (): Promise<Transaction[]> => {
    const response = await apiInstance.get("/transaction");

    return response.data.data;
  },
  fetchUserTransactions: async (userId: string) => {
    const response = await apiInstance.get(
      `/transaction/user/recent/${userId}?offset=1&limit=2`
    );

    console.log("user transactions response data:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, payload: TransactionStatusPayload) => {
    const response = await apiInstance.patch(`/transaction/${id}`, payload);

    return response.data;
  },
  fetchTransactionVolume: async (
    start_date: string,
    end_date: string
  ): Promise<TransactionVolume[]> => {
    const response = await apiInstance.get(
      `/transaction/volume/all?start_date=${start_date}&end_date=${end_date}`
    );

    console.log("transaction volume response data:", response.data.data);
    return response.data.data;
  },
};
