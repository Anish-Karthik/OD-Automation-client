'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus, Loader } from "lucide-react"
import { usePagination } from "@/hooks/UsePagination"
import { Subject } from "../components/subjects/subject"
import { fetchSubjects } from "@/lib/api/SubjectApi"
import { SubjectTable } from "../components/subjects/SubjectTable"
import { AddEditSubjectDialog } from "../components/subjects/AddEditSubjectDialog"




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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Loader className="animate-spin h-10 w-10 mb-4 text-yellow-400" />
        <p className="text-lg font-medium">Loading subjects</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-10 text-white">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Subject Management</h1>
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => {
              setEditingSubject(null)
              setIsAddDialogOpen(true)
            }}
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Subject
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <SubjectTable
            subjects={paginatedItems}
            onEdit={(subject) => {
              setEditingSubject(subject)
              setIsAddDialogOpen(true)
            }}
          />
        </div>
        <Pagination />
        <AddEditSubjectDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          editingSubject={editingSubject}
        />
      </div>
    </div>
  )
}