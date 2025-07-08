import { apiInstance } from "@/lib/apiInstance";

export const communicationsAPI = {
  sendBulkMail: async (payload: {
    subject: string;
    text: string;
  }) => {
    const response = await apiInstance.post(
      `/communication/send-bulk-mail`,
      payload
    );
    console.log("Bulk Message Sent:", response.data);
    return response.data;
  },
};
