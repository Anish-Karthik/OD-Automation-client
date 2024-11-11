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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <Loader className="animate-spin h-10 w-10 mb-4 text-blue-500" />
        <p className="text-lg font-medium">Loading students</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={() => {
            setEditingStudent(null)
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </Button>
        <BulkUploadButton />
      </div>
      <StudentTable
        students={paginatedItems}
        onEdit={(student) => {
          setEditingStudent(student)
          setIsAddDialogOpen(true)
        }}
      />
      <Pagination />
      <AddEditStudentDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        editingStudent={editingStudent}
      />
    </div>
  )
}
