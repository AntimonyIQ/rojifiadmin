import { apiInstance } from "@/lib/apiInstance";

export const feeConfigAPI = {
  fetchConfig: async (): Promise<any> => {
    const response = await apiInstance.get("/payment/fee-config/all");
    console.log("config response:", response.data.data);
    return response.data.data;
  },
};
