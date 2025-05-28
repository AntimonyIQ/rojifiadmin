import { authAPI } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { extractErrorMessage } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      //   console.log("login response data:", data);
      setAuth(data.data.token, data.data.token);
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      console.error("Login Error:", message);
    },
  });
};

export const useLogout = () => {
  // @ts-ignore
  const setAuth = useAuthStore((state) => state.setAuth);
  // simulate the logout using clearAuth on useAuthStore
  const clearAuth = useAuthStore((state) => state.clearAuth);
  //  return the clearAuth function 
  
  return clearAuth
};
