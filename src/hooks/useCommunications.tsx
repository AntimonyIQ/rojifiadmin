import { communicationsAPI } from "@/services/communications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export const useSendBulkMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: communicationsAPI.sendBulkMail,
    onSuccess: () => {
      toast({
        title: "Sent!",
        description: `Message sent successfully.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["all_communication_messages"],
      });
    },
    onError: () => {
      toast({
        title: "Failed!",
        description: `Failed to send message.`,
        variant: "destructive",
      });
    },
  });
};

export const useFetchAllMessages = (page: number, limit: number = 10) => {
  return useQuery({
    queryKey: ["all_communication_messages", page],
    queryFn: () => communicationsAPI.fetchAllMessages({ page, limit }),
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      subject,
      body,
    }: {
      id: string;
      subject: string;
      body: string;
    }) => communicationsAPI.updateMessage(id, { subject, body }),
    onSuccess: () => {
      toast({
        title: "Done!",
        description: `Message updated successfully.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["all_communication_messages"],
      });
    },
    onError: () => {
      toast({
        title: "Failed!",
        description: `Failed to update message.`,
        variant: "destructive",
      });
    },
  });
};

export const useResendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => communicationsAPI.resendMessage(id),
    onSuccess: () => {
      toast({
        title: "Done!",
        description: `Message resent successfully.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["all_communication_messages"],
      });
    },
    onError: () => {
      toast({
        title: "Failed!",
        description: `Failed to resend message`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => communicationsAPI.deleteMessage(id),
    onSuccess: () => {
      toast({
        title: "Done!",
        description: `Message deleted successfully.`,
      });
      queryClient.invalidateQueries({
        queryKey: ["all_communication_messages"],
      });
    },
    onError: () => {
      toast({
        title: "Failed!",
        description: `Failed to delete message.`,
        variant: "destructive",
      });
    },
  });
};
