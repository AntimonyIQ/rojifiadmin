import { roleAPI } from "@/services/roles";
import { RolePayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: roleAPI.get,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create_role"],
    mutationFn: (payload: RolePayload) => roleAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_role"],
    mutationFn: ({ id, payload }: { id: string; payload: RolePayload }) =>
      roleAPI.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["assign_role"],
    mutationFn: ({ staffId, role_id }: { staffId: string; role_id: string }) =>
      roleAPI.assign(staffId, role_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
  });
};
