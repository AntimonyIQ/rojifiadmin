import { apiInstance } from "@/lib/apiInstance";
import {
  AddStaffPayload,
  EditStaffPayload,
  OverviewProps,
  Staff,
  WalletOverview,
} from "@/types";

export const staffAPI = {
  getAllStaff: async (): Promise<Staff[]> => {
    const response = await apiInstance.get("/staff");
    // console.log("all staffs response data:", response.data.data);

    return response.data.data;
  },
  addNewStaff: async (payload: AddStaffPayload) => {
    const response = await apiInstance.post("/staff/add", payload);

    // console.log("added staff details:", response.data);
    return response.data;
  },
  editStaff: async (id: string, payload: EditStaffPayload) => {
    const response = await apiInstance.patch(`/staff/edit/${id}`, payload);

    console.log("edited staff details:", response.data);
    return response.data;
  },
  deleteStaff: async (id: string) => {
    const response = await apiInstance.delete(`/staff/remove/${id}`);

    console.log("deleted staff details:", response.data);
    return response.data;
  },
  staffOverview: async (): Promise<OverviewProps> => {
    const response = await apiInstance.get("/staff/dashboard");

    return response.data.data;
  },
  walletOverview: async (): Promise<WalletOverview> => {
    const response = await apiInstance.get("/wallet/overview/all");

    return response.data.data;
  },
};
