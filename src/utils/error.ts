import axios from "axios";

export const extractErrorMessage = (error: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  // @ts-ignore
  if (error instanceof Error) return error.message;
  return "Something went wrong";
};
