import { apiInstance } from "@/lib/apiInstance";
import { Permission } from "@/types";

export const permissionAPI = {
  get: async (): Promise<any> => {
    const response = await apiInstance.get("/staff/permission");

    // console.log("all permissions:", response.data.data);
    return response.data.data;
  },
  create: async (): Promise<Permission[]> => {
    const response = await apiInstance.post("/staff/permission");

    // console.log("permission created:", response.data.data);
    return response.data.data;
  },
  update: async (id: string, data: { permissions: string[] }) => {
    const response = await apiInstance.patch(
      `/staff/permission/staff/${id}`,
      data
    );

    // console.log("permission created:", response.data.data);
    return response.data.data;
  },
};
