import { apiInstance } from "@/lib/apiInstance";

export const communicationsAPI = {
  sendBulkMail: async (payload: { subject: string; text: string }) => {
    const response = await apiInstance.post(
      `/communication/send-bulk-mail`,
      payload
    );
    return response.data;
  },

  fetchAllMessages: async ({ page = 1, limit = 10 }) => {
    const offset = page;
    const response = await apiInstance.get(
      `/communication/fetch-all-messages?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  updateMessage: async (
    id: string,
    payload: { subject: string; body: string }
  ) => {
    const response = await apiInstance.patch(
      `/communication/update-message/${id}`,
      payload
    );
    return response.data;
  },

  resendMessage: async (id: string) => {
    const response = await apiInstance.patch(
      `/communication/resend-message/${id}`
    );
    return response.data;
  },

  deleteMessage: async (id: string) => {
    const response = await apiInstance.delete(
      `/communication/delete-message/${id}`
    );
    return response.data;
  },
};
