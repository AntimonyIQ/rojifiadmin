import { apiInstance } from "@/lib/apiInstance";
import { RolePayload } from "@/types";

export const roleAPI = {
  get: async () => {
    const response = await apiInstance.get("/staff/role");

    // console.log("roles:", response.data.data);
    return response.data.data;
  },
  create: async (payload: RolePayload) => {
    const response = await apiInstance.post("/staff/role", payload);

    // console.log("roles:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, payload: RolePayload) => {
    const response = await apiInstance.patch(`/staff/role/${id}`, payload);

    // console.log("roles:", response.data.data);
    return response.data.data;
  },
  assign: async (staffId: string, role_id: string) => {
    const response = await apiInstance.put(`/staff/assign-role/${staffId}`, {
      role_id,
    });

    // console.log("roles:", response.data.data);
    return response.data.data;
  },
};
