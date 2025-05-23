import { userAPI } from "@/services/users";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: userAPI.getAllUsers,
  });
};
