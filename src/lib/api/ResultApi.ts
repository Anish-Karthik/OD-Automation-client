import { Result } from "@/routes/components/results/result";
import { api, flask } from "../axios";

export const bulkCreateResults = async (formData: FormData): Promise<any> => {
  try {
    const res = await flask.post("/upload_pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Include credentials in the request
    });
    console.log("Response:", res.data); // Access response data consistently
    return res.data;
  } catch (error) {
    console.error("Failed to bulk create results:", error);
    throw error;
  }
};
