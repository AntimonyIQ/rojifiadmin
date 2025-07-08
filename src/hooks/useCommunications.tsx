import { communicationsAPI } from "@/services/communications";
import { useMutation } from "@tanstack/react-query";

export const useSendBulkMessage = () => {
  return useMutation({
    mutationFn: communicationsAPI.sendBulkMail,
  });
};
