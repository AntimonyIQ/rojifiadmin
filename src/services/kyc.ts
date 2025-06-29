import { apiInstance } from "@/lib/apiInstance";

export const kycAPI = {
  getUserKYC: async (id: string): Promise<any> => {
    const response = await apiInstance.get(`/kyc/user-kyc/info/${id}`);
    return response.data.data;
    },
    updateKyc: async (id: string, payload: any) => {
        const response = await apiInstance.patch(
          `/kyc/user-kyc/${id}`,
          payload
        );
    
        console.log("Kyc updated:", response.data);
        return response.data;
      },
};
