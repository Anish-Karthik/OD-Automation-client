import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import * as XLSX from "xlsx"
import { bulkCreateStudents } from "@/lib/api/StudentApi"
import { Student } from "./student"

export function BulkUploadButton() {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const bulkCreateMutation = useMutation({
    mutationFn: bulkCreateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast({ title: "Students bulk uploaded successfully" })
      setIsUploading(false)
    },
    onError: () => {
      toast({ title: "Failed to bulk upload students", variant: "destructive" })
      setIsUploading(false)
    },
  })

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: "array" })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Student[]
          await bulkCreateMutation.mutateAsync(jsonData)
        } catch (error) {
          console.error("Error processing file:", error)
          toast({ title: "Error processing file", variant: "destructive" })
        } finally {
          setIsUploading(false)
          if (fileInputRef.current) {
            fileInputRef.current.value = ""
          }
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <>
      <Input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleBulkUpload}
        className="hidden"
        ref={fileInputRef}
        disabled={isUploading}
      />
    <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center justify-center">
        {isUploading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-800" />
        )}
        <FileUp className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Bulk Upload"}
      </Button>
    </>
  )
} 