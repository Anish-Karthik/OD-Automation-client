'use client'

import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from 'lucide-react'
import { getSemesterUploads } from '@/lib/api/ResultApi'
import { ResultTable as ResultTableType } from './result'

interface ApiResponse {
  result: {
    data: ResultTableType[]
  }
}

export function ResultTable() {
  // Use React Query to fetch data with the correct response type
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['semesterUploads'],
    queryFn: getSemesterUploads
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error instanceof Error) {
    return <div className="text-red-500">Error loading data: {error.message}</div>
  }

  // Correctly access the nested data array
  const uploads = data?.result?.data || []

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Semester Uploads</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Year</TableHead>
              <TableHead>Semester</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  No semester uploads found
                </TableCell>
              </TableRow>
            ) : (
              uploads.map((upload: ResultTableType) => (
                <TableRow key={`${upload.batchYear}-${upload.semester}`}>
                  <TableCell>{upload.batchYear}</TableCell>
                  <TableCell>Semester {upload.semester}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}