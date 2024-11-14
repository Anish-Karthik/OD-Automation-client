import { ResultTable } from "@/routes/components/results/result";
import { api, flask } from "../axios";

interface ApiResponse {
  result: {
    data: ResultTable[]
  }
}

export const bulkCreateResults = async (formData: FormData): Promise<any> => {
  try {
    const res = await flask.post("/upload_pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Failed to bulk create results:", error);
    throw error;
  }
};

export const getSemesterUploads = async (): Promise<ApiResponse> => {
  try {
    const res = await api.get("/result.getSemesterUploads");
    return res.data;
  } catch (error) {
    console.error("Failed to get semester uploads:", error);
    throw error;
  }
};
