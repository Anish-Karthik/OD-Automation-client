'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus, Loader } from "lucide-react"
import { usePagination } from "@/hooks/UsePagination"
import { Subject } from "../components/subjects/subject"
import { bulkCreateSubjects, fetchSubjects } from "@/lib/api/SubjectApi"
import { SubjectTable } from "../components/subjects/SubjectTable"
import { AddEditSubjectDialog } from "../components/subjects/AddEditSubjectDialog"
import { BulkUploadButton } from "../components/subjects/BulkUploadButton"



export default function SubjectManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)

  const { data: subjects = [], isLoading } = useQuery<Subject[], Error>({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  })
  // console.log(subjects)

  const { paginatedItems, Pagination } = usePagination<Subject>(subjects)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <Loader className="animate-spin h-10 w-10 mb-4 text-blue-500" />
        <p className="text-lg font-medium">Loading subjects</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Subject Management</h1>
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => {
            setEditingSubject(null)
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Subject
        </Button>
        <BulkUploadButton />
      </div>
     
      <SubjectTable
        subjects={paginatedItems}
        onEdit={(subject) => {
          setEditingSubject(subject)
          setIsAddDialogOpen(true)
        }}
      />
      <Pagination />
      <AddEditSubjectDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        editingSubject={editingSubject}
      />
    </div>
  )
}