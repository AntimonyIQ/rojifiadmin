import { apiInstance } from "@/lib/apiInstance";
import { User } from "@/types";

export const userAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiInstance.get("/user/all");
    // console.log("user response data:", response.data.data);
    return response.data.data;
  },
};
