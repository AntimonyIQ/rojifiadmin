import { apiInstance } from "@/lib/apiInstance";

export const accountsAPI = {
  getVirtualAccounts: async (id: string): Promise<any> => {
    const response = await apiInstance.get(
      `/user/linked-virtual-accounts/${id}`
    );
    console.log("User virtual accounts:", response.data.data);
    return response.data.data;
  },
  getLinkedAccounts: async (id: string): Promise<any> => {
    const response = await apiInstance.get(`/user/linked-banks/${id}`);
    console.log("User linked accounts:", response.data.data);
    return response.data.data;
  },
  issueVirtualAccount: async (id: string) => {
    const response = await apiInstance.get(
      `/payment/issue-virtual-account/${id}`
    );
    console.log("issue virtual accounts:", response.data);
    return response.data;
  },
};
