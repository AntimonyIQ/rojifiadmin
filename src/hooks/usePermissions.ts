import { permissionAPI } from "@/services/permissions";
// @ts-ignore
import { Permission } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchAllPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: permissionAPI.get,
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_permission"],
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      permissionAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
  });
};
