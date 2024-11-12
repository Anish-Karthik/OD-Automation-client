import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { Subject } from "./subject";
import { bulkCreateSubjects } from "@/lib/api/SubjectApi";

export function BulkUploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Mutation for bulk uploading subjects
  const bulkCreateMutation = useMutation({
    mutationFn: bulkCreateSubjects,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({ title: "Subjects bulk uploaded successfully" });
      setIsUploading(false);
    },
    onError: () => {
      toast({ title: "Failed to bulk upload subjects", variant: "destructive" });
      setIsUploading(false);
    },
  });

  // Handle file selection and upload
  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Subject[];
          await bulkCreateMutation.mutateAsync(jsonData);
        } catch (error) {
          console.error("Error processing file:", error);
          toast({ title: "Error processing file", variant: "destructive" });
        } finally {
          setIsUploading(false);
          resetFileInput();
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Reset file input to allow re-uploading the same file
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleBulkUpload}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center justify-center space-x-2"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-blue-800" />
        ) : (
          <FileUp className="h-4 w-4" />
        )}
        <span>{isUploading ? "Uploading..." : "Bulk Upload"}</span>
      </Button>
    </div>
  );
}
