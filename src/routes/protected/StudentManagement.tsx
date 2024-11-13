'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Plus, Loader } from "lucide-react"  // Assuming you're using `lucide-react` for icons

import { usePagination } from "@/hooks/UsePagination"
import { Student } from "../components/students/student"
import { fetchStudents } from "@/lib/api/StudentApi"
import { StudentTable } from "../components/students/StudentTable"
import { AddEditStudentDialog } from "../components/students/AddEditStudentDialog"
import { BulkUploadButton } from "../components/students/BulkUploadButton"

export default function StudentManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)

  const { data: students = [], isLoading } = useQuery<Student[], Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  })

  const { paginatedItems, Pagination } = usePagination<Student>(students)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Loader className="animate-spin h-10 w-10 mb-4 text-yellow-400" />
        <p className="text-lg font-medium">Loading students</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto py-10 text-white">
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">Student Management</h1>
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => {
              setEditingStudent(null)
              setIsAddDialogOpen(true)
            }}
            className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Student
          </Button>
          <BulkUploadButton className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300" />
        </div>
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
          <StudentTable
            students={paginatedItems}
            onEdit={(student) => {
              setEditingStudent(student)
              setIsAddDialogOpen(true)
            }}
          />
        </div>
        <Pagination />
        <AddEditStudentDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          editingStudent={editingStudent}
        />
      </div>
    </div>
  )
}
