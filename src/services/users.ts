import { apiInstance } from "@/lib/apiInstance";

const LIMIT = 10;

export const userAPI = {
  getAllUsers: async (offset: number): Promise<any> => {
    const response = await apiInstance.get("/user/all", {
      params: { limit: LIMIT, offset },
    });
    return { users: response.data.data, metadata: response.data.metadata };
  },
  updateUser: async (id: string, payload: any) => {
    const response = await apiInstance.patch(`/user/update/${id}`, payload);
    console.log("user updated details:", response.data);
    return response.data;
  },
};
