import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { toast } from "@/hooks/use-toast"
import { Student } from "./student"
import { deleteStudent } from "@/lib/api/StudentApi"

type StudentTableProps = {
  students: Student[]
  onEdit: (student: Student) => void
}

export function StudentTable({ students, onEdit }: StudentTableProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast({ title: "Student deleted successfully" })
    },
    onError: () => {
      toast({ title: "Failed to delete student", variant: "destructive" })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Table>
      <TableHeader className="bg-gray-800">
        <TableRow className="hover:bg-gray-700 border-gray-700">
          <TableHead className="text-gray-300">Reg No</TableHead>
          <TableHead className="text-gray-300">Roll No</TableHead>
          <TableHead className="text-gray-300">Name</TableHead>
          <TableHead className="text-gray-300">Year</TableHead>
          <TableHead className="text-gray-300">Section</TableHead>
          <TableHead className="text-gray-300">Semester</TableHead>
          <TableHead className="text-gray-300">Batch</TableHead>
          <TableHead className="text-gray-300">Email</TableHead>
          <TableHead className="text-gray-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-gray-800">
        {students.map((student) => (
          <TableRow key={student.id} className="hover:bg-gray-700 border-gray-700">
            <TableCell className="text-gray-300">{student.regNo}</TableCell>
            <TableCell className="text-gray-300">{student.rollno}</TableCell>
            <TableCell className="text-gray-300">{student.name}</TableCell>
            <TableCell className="text-gray-300">{student.year}</TableCell>
            <TableCell className="text-gray-300">{student.section}</TableCell>
            <TableCell className="text-gray-300">{student.semester}</TableCell>
            <TableCell className="text-gray-300">{student.batch}</TableCell>
            <TableCell className="text-gray-300">{student.email}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(student)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(student.userId)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}