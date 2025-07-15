import { userAPI } from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFetchUsers = (page: number) => {
  const limit = 10;
  const offset = page === 1 ? (page - 1) * limit + 1 : page;

  return useQuery({
    queryKey: ["users", offset],
    queryFn: () => userAPI.getAllUsers(offset),
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

export const useUserOverview = () => {
  return useQuery({
    queryKey: ["users_overview"],
    queryFn: userAPI.getUsersOverview,
  });
};
