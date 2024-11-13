import React, { useRef, useState } from "react";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileUp, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { bulkCreateResults } from "@/lib/api/ResultApi";

export default function ResultManagement() {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = new QueryClient();

  // Define the mutation to upload the PDF file
  const uploadFileMutation = useMutation({
    mutationFn: bulkCreateResults,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["results"] });
      toast({ title: "PDF uploaded successfully" });
      setIsUploading(false);
    },
    onError: () => {
      toast({ title: "Failed to upload PDF", variant: "destructive" });
      setIsUploading(false);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
    const file = event.target.files?.[0];
    // console.log(file);
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      // @ts-ignore
      uploadFileMutation.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-10 text-white">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Result Management</h1>
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
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center"
          >
            {isUploading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileUp className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload PDF"}
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          {/* Content area for uploaded results */}
        </div>
      </div>
    </div>
  );
}
