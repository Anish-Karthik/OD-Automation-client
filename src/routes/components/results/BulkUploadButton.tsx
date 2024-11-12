import React, { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileUp, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { bulkCreateResults } from "@/lib/api/ResultApi";

const ResultManagement: React.FC = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Define the mutation to upload the PDF file
  const uploadFileMutation = useMutation({
    mutationFn: bulkCreateResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["results"] });
      toast({ title: "PDF uploaded successfully" });
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    },
    onError: () => {
      toast({ title: "Failed to upload PDF", variant: "destructive" });
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input on error as well
      }
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      uploadFileMutation.mutate(formData);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Result Management</h1>
      <div className="flex justify-between items-center mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
          id="pdf-upload"
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center"
        >
          {isUploading ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileUp className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload PDF"}
        </Button>
      </div>
    </div>
  );
};

export default ResultManagement;
