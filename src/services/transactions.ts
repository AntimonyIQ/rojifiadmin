import { apiInstance } from "@/lib/apiInstance";
import {
  TransactionChannelsProps,
  TransactionResponse,
  TransactionStatusPayload,
  TransactionVolume,
} from "@/types";

const LIMIT = 10;

export const transactionAPI = {
  fetchAllTransactions: async (offset: number): Promise<TransactionResponse> => {
    const response = await apiInstance.get("/transaction", {
      params: { limit: LIMIT, offset },
    });

    return {
      transactions: response.data.data,
      metadata: response.data.metadata,
    };
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

    // console.log("transaction volume response data:", response.data.data);
    return response.data.data;
  },
  fetchTransactionChannels: async (): Promise<TransactionChannelsProps[]> => {
    const response = await apiInstance.get("/transaction/channel/all");
    // console.log("transaction channels response data:", response.data.data);
    return response.data.data;
  },
  updateTransactionChannel: async (id: string, payload: any) => {
    const response = await apiInstance.patch(
      `/transaction/channel/update/${id}`,
      payload
    );
    console.log("updated processor data:", response.data.data);
    return response.data.data;
  },
  createTransactionChannel: async ({
    channel,
  }: {
    channel: string;
  }): Promise<any> => {
    const response = apiInstance.post("transaction/channel/create", {
      channel,
    });
    console.log(
      "transaction channel creation data:",
      (await response).data.data
    );
    return (await response).data.data;
  },
};
