import { apiInstance } from "@/lib/apiInstance";
import { LoginPayload, LoginResponse } from "@/types";

export const authAPI = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiInstance.put<LoginResponse>(
      "/staff/login",
      payload
    );
    return response.data;
  },
  logout: async () => {
    const response = await apiInstance.post("/auth/logout");
    return;
  },
};
