import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/hooks/use-toast"
import { Subject } from "./subject"
import { deleteSubject } from "@/lib/api/SubjectApi"

type SubjectTableProps = {
  subjects: Subject[]
  onEdit: (subject: Subject) => void
}

export function SubjectTable({ subjects, onEdit }: SubjectTableProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast({ title: "Subject deleted successfully" })
    },
    onError: () => {
      toast({ title: "Failed to delete subject", variant: "destructive" })
    },
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Table>
      <TableHeader className="bg-gray-800">
        <TableRow className="hover:bg-gray-700 border-gray-700">
          <TableHead className="text-gray-300">Code</TableHead>
          <TableHead className="text-gray-300">Name</TableHead>
          <TableHead className="text-gray-300">Semester</TableHead>
          <TableHead className="text-gray-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-gray-800">
        {subjects.map((subject) => (
          <TableRow key={subject.id} className="hover:bg-gray-700 border-gray-700">
            <TableCell className="text-gray-300">{subject.subjectCode}</TableCell>
            <TableCell className="text-gray-300">{subject.name}</TableCell>
            <TableCell className="text-gray-300">{subject.semester}</TableCell>
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
                  <DropdownMenuItem onClick={() => onEdit(subject)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(subject.id)}>
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