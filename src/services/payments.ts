import { apiInstance } from "@/lib/apiInstance";
import { ProcessorChannelType } from "@/types";

export const paymentAPI = {
  fwtchPaymentProcessors: async (): Promise<ProcessorChannelType[]> => {
    const response = await apiInstance.get("/payment/processor");
    // console.log("payment processors response data:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, payload: any) => {
    const response = await apiInstance.patch(
      `/payment/processor/${id}`,
      payload
    );
    // console.log("updated processor data:", response.data.data);
    return response.data.data;
  },
  create: async (payload: any) => {
    const response = await apiInstance.post(`/payment/processor`, payload);
    console.log("Created processor data:", response.data.data);
    return response.data.data;
  },
};
