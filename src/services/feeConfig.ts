import { apiInstance } from "@/lib/apiInstance";

export const feeConfigAPI = {
  fetchConfig: async (): Promise<any> => {
    const response = await apiInstance.get("/payment/fee-config/all");
    // console.log("config response:", response.data.data);
    return response.data.data;
  },
  create: async (payload: any): Promise<any> => {
    const response = await apiInstance.post("/payment/fee-config", payload);
    console.log("config created response:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, payload: any): Promise<any> => {
    const response = await apiInstance.patch(
      `/payment/fee-config/${id}`,
      payload
    );
    console.log("config update response:", response.data.data);
    return response.data.data;
  },
};
