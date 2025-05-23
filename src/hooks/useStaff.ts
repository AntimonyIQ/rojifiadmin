import { staffAPI } from "@/services/staff";
import { AddStaffPayload, EditStaffPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchStaffs = () => {
  return useQuery({
    queryKey: ["staffs"],
    queryFn: staffAPI.getAllStaff,
  });
};

export const useFetchDashboardOverview = () => {
  return useQuery({
    queryKey: ["staff_overview"],
    queryFn: staffAPI.staffOverview,
  });
};

export const useFetchWalletOverview = () => {
  return useQuery({
    queryKey: ["wallet_overview"],
    queryFn: staffAPI.walletOverview,
  });
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_staff"],
    mutationFn: (payload: AddStaffPayload) => staffAPI.addNewStaff(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
  });
};

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["edit_staff"],
    mutationFn: (payload: { id: string; data: EditStaffPayload }) =>
      staffAPI.editStaff(payload.id, payload.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staffs"] }),
  });
};

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete_staff"],
    mutationFn: (id: string) => staffAPI.deleteStaff(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staffs"] }),
  });
};
