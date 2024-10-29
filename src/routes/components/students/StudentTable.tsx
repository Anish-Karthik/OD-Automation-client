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
      <TableHeader>
        <TableRow>
          <TableHead>Reg No</TableHead>
          <TableHead>Roll No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student) => (
          <TableRow key={student.id}>
            <TableCell>{student.regNo}</TableCell>
            <TableCell>{student.rollno}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.year}</TableCell>
            <TableCell>{student.section}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell>{student.batch}</TableCell>
            <TableCell>{student.email}</TableCell>
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