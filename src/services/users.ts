import { apiInstance } from "@/lib/apiInstance";
import { User } from "@/types";

export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiInstance.get("/user/all");
    return response.data.data;
  },
  updateUser: async (id: string, payload: any) => {
    const response = await apiInstance.patch(`/user/update/${id}`, payload);
    console.log("user updated details:", response.data);
    return response.data;
  },
};
