import { userAPI } from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userAPI.getAllUsers,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update_user"],
    mutationFn: (payload: { id: string; data: any }) =>
      userAPI.updateUser(payload.id, payload.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};
