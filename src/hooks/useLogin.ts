import { authAPI } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { extractErrorMessage } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data:any) => {
      //   console.log("login response data:", data);
      const userData: any = {
        name: data.data.name,
        email: data.data.email,
      };

      // console.log('user data:', userData)
      // console.log('user token:', data.data.token)
      setAuth(userData, data.data.token);
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

  return clearAuth;
};
