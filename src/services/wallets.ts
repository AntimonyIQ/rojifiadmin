import { apiInstance } from "@/lib/apiInstance";

export const walletsAPI = {
  getUserWallets: async (id: string): Promise<any> => {
    const response = await apiInstance.get(`/wallet/info/user/${id}`);
    // console.log("User wallets:", response.data.data);
    return response.data.data;
  },
  updateUserWallet: async (id: string, payload: any) => {
    const response = await apiInstance.patch(`/wallet/${id}`, payload);
    // console.log("User wallet updated:", response.data);
    return response.data;
  },
  creditUserWallet: async (payload: {
    amount: number;
    currency: string;
    user_id: string;
  }) => {
    const response = await apiInstance.post(`/wallet/user/credit`, payload);
    console.log("User wallet credited:", response.data);
    return response.data;
  },
  debitUserWallet: async (payload: {
    amount: number;
    currency: string;
    user_id: string;
  }) => {
    const response = await apiInstance.post(`/wallet/user/debit`, payload);
    console.log("User wallet debited:", response.data);
    return response.data;
  },
};
