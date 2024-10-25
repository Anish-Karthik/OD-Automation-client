'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Plus, MoreHorizontal, FileUp } from 'lucide-react'
import * as XLSX from 'xlsx'
import { api } from '@/lib/axios'

// Mock API functions (replace with actual API calls)
const fetchStudents = async () => {
  const res = await api.get("/user.student.list");
  console.log('Students:', res.data.result.data)
  return res.data.result.data;
}

const createStudent = async (data: Student) => {
  try {

    const res = await api.post("/user.student.create", data);
    return res.data.result;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw error;
  }
}

const updateStudent = async (data: Student) => {
  // Simulated API callit 
  console.log('Updating student:', data)
  return data
}

const deleteStudent = async (id: string) => {
  // Simulated API call
  console.log('Deleting student:', id)
  return id
}

const bulkCreateStudents = async (data: Student[]) => {
  // Simulated API call
  console.log('Bulk creating students:', data)
  return data
}

// Student type
type Student = {
  id: string
  regNo: string
  rollno: number
  name: string
  year: number
  section: string
  semester: number
  vertical: string | null
  batch: string | null
  email: string | null
  userId: string
  tutorId: string | null
  yearInChargeId: string | null
  departmentId: string | null
}

// Form schema
const studentSchema = z.object({
  regNo: z.string().min(1, "Registration number is required"),
  rollno: z.number().min(1, "Roll number is required"),
  name: z.string().min(1, "Name is required"),
  year: z.number().min(1).max(5),
  section: z.string().min(1, "Section is required"),
  semester: z.number().min(1).max(10),
  batch: z.string().nullable(),
  email: z.string().email().nullable(),
  departmentId: z.string().nullable(),
})

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const itemsPerPage = 10

  const queryClient = useQueryClient()

  const { data: students = [], isLoading } = useQuery<Student[], Error>({
    queryKey: ['students'],
    queryFn: fetchStudents,
  })

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({ title: "Student created successfully" })
      setIsAddDialogOpen(false)
    },
    onError: () => {
      toast({ title: "Failed to create student", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({ title: "Student updated successfully" })
      setIsAddDialogOpen(false)
      setEditingStudent(null)
    },
    onError: () => {
      toast({ title: "Failed to update student", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({ title: "Student deleted successfully" })
    },
    onError: () => {
      toast({ title: "Failed to delete student", variant: "destructive" })
    },
  })

  const bulkCreateMutation = useMutation({
    mutationFn: bulkCreateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({ title: "Students bulk uploaded successfully" })
    },
    onError: () => {
      toast({ title: "Failed to bulk upload students", variant: "destructive" })
    },
  })

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      regNo: "",
      name: "",
      year: 1,
      section: "",
      semester: 1,
      batch: null,
      email: null,
      departmentId: "65f4607e11746c826b3f5128",
    },
  })

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    if (editingStudent) {
      updateMutation.mutate({ ...editingStudent, ...data })
    } else {
      createMutation.mutate(data as Student)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    form.reset(student)
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Student[]
        bulkCreateMutation.mutate(jsonData)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(students.length / itemsPerPage)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingStudent(null)
              form.reset()
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="regNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rollno"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Section</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department ID</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <div>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleBulkUpload}
            className="hidden"
            id="bulk-upload"
          />
          <label htmlFor="bulk-upload">
            <Button type='button'>
              <FileUp className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
          </label>
        </div>
      </div>
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
          {paginatedStudents.map((student) => (
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
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(student)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(student.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>

                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}