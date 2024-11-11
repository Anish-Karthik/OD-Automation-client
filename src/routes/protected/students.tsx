"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, MoreHorizontal, FileUp } from "lucide-react";
import * as XLSX from "xlsx";
import { api } from "@/lib/axios";
import IncrementSemesterForm from "./increment-semester-form";

type StudentForm = {
  regNo: string;
  rollno: number;
  name: string;
  year: string;
  section: string;
  semester: string;
  batch: string;
  email: string | null;
  departmentId: string | null;
};

type StudentUpdateForm = StudentForm & {
  id: string;
};

// Student type
type Student = StudentUpdateForm & {
  vertical: string | null;
  userId: string;
  tutorId: string | null;
  yearInChargeId: string | null;
  departmentId: string | null;
};

type Department = {
  id: string;
  name: string;
  code: string;
};

// Helper function to generate year options
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2000; year <= currentYear + 6; year++) {
    years.push(year.toString());
  }
  return years;
};

// Form schema
const studentSchema = z
  .object({
    regNo: z.string().min(1, "Registration number is required"),
    rollno: z.number().min(1, "Roll number is required"),
    name: z.string().min(1, "Name is required"),
    year: z.union([z.enum(["1", "2", "3", "4"]), z.string().regex(/^[5-6]$/)]),
    section: z.union([
      z.enum(["A", "B", "C", "D"]),
      z.string().min(1, "Section is required"),
    ]),
    semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
    batch: z
      .string()
      .min(1, "Batch is required")
      .refine(
        (value) => {
          return generateYearOptions().includes(value);
        },
        {
          message: "Invalid batch Year, please select from the dropdown",
        }
      ),
    email: z.string().email().nullable(),
    departmentId: z.string().nullable(),
  })
  .refine(
    (data) => {
      const year = Number.parseInt(data.year);
      const semester = Number.parseInt(data.semester);
      return (
        (year === 1 && (semester === 1 || semester === 2)) ||
        (year === 2 && (semester === 3 || semester === 4)) ||
        (year === 3 && (semester === 5 || semester === 6)) ||
        (year === 4 && (semester === 7 || semester === 8)) ||
        (year >= 5 && semester >= 1 && semester <= 8)
      );
    },
    {
      message: "Invalid year and semester combination",
      path: ["semester"],
    }
  );

// API functions
const fetchStudents = async () => {
  const res = await api.get("/user.student.list");
  console.log("Students:", res.data.result.data);
  return res.data.result.data;
};
const fetchDepartments = async () => {
  const res = await api.get("/department.getAll");
  return res.data.result.data;
};
const createStudent = async (data: StudentForm) => {
  try {
    const res = await api.post("/user.student.create", {
      ...data,
      year: Number.parseInt(data.year),
      semester: Number.parseInt(data.semester),
    });
    return res.data.result;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw error;
  }
};

const updateStudent = async (data: StudentUpdateForm) => {
  try {
    const res = await api.post("/user.student.create", {
      ...data,
      year: Number.parseInt(data.year),
      semester: Number.parseInt(data.semester),
    });
    return res.data.result;
  } catch (error) {
    console.error("Failed to update student:", error);
    throw error;
  }
};

const deleteStudent = async (id: string) => {
  try {
    const res = await api.post("/user.delete", { id });
    return res.data.result;
  } catch (error) {
    console.error("Failed to delete student:", error);
    throw error;
  }
};

const bulkCreateStudents = async (data: Student[]) => {
  try {
    // Convert batch values to strings
    const formattedData = data.map((student) => ({
      ...student,
      batch: student.batch.toString(),
    }));

    console.log("Bulk creating students:", formattedData);

    // Send the formatted data to the API
    const res = await api.post("/user.student.createMany", formattedData);
    return res.data.result;
  } catch (error) {
    console.error("Failed to bulk create students:", error);
    throw error;
  }
};


export default function Component() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isIncrementSemesterDialogOpen, setIsIncrementSemesterDialogOpen] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery<Student[], Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: departments = [] } = useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student created successfully" });
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to create student", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student updated successfully" });
      setIsAddDialogOpen(false);
      setEditingStudent(null);
    },
    onError: () => {
      toast({ title: "Failed to update student", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete student", variant: "destructive" });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: bulkCreateStudents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Students bulk uploaded successfully" });
      setIsUploading(false);
    },
    onError: () => {
      toast({
        title: "Failed to bulk upload students",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      regNo: "",
      rollno: 1,
      name: "",
      year: "1",
      section: "A",
      semester: "1",
      batch: new Date().getFullYear().toString(),
      email: null,
      departmentId: departments[0]?.id ?? "",
    },
  });

  const year = form.watch("year");

  useEffect(() => {
    if (year) {
      form.setValue(
        "semester",
        String(Number(year) * 2 - 1) as
        | "1"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
      );
    }
  }, [year, form]);

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    if (editingStudent) {
      updateMutation.mutate({ ...editingStudent, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.reset({
      ...student,
      year: student.year.toString() as any,
      semester: student.semester.toString() as any,
      batch: student.batch ?? "", // Ensure batch is not null
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File uploaded:", event.target.files?.[0]);
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploading file:", file);
      setIsUploading(true);

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Student[];
          await bulkCreateMutation.mutateAsync(jsonData);
        } catch (error) {
          console.error("Error processing file:", error);
          toast({ title: "Error processing file", variant: "destructive" });
          setIsUploading(false);
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };


  const handleBulkUploadClick = () => {
    console.log("Bulk upload clicked");
    fileInputRef.current?.click();
  };

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(students.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="hover:bg-gray-500"

                onClick={() => {
                  setEditingStudent(null);
                  form.reset();
                }}
                
              >
                <Plus className="h-5 w-5" />
                <span>Add Student</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="regNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter registration number" />
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
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter roll number"
                              onChange={(e) =>
                                field.onChange(Number.parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter student name" />
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select batch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {generateYearOptions().map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {field.value === "other" && (
                            <Input
                              type="number"
                              placeholder="Enter year (5-6)"
                              onChange={(e) => field.onChange(e.target.value)}
                              min={5}
                              max={6}
                              className="mt-2"
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!year}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {year === "1" && (
                                <>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                </>
                              )}
                              
                              {year === "2" && (
                                <>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                </>
                              )}

                              {year === "3" && (
                                <>
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="6">6</SelectItem>
                                </>
                              )}

                              {year === "4" && (
                                <>
                                  <SelectItem value="7">7</SelectItem>
                                  <SelectItem value="8">8</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {field.value === "other" && (
                            <Input
                              placeholder="Enter section"
                              onChange={(e) => field.onChange(e.target.value)}
                              className="mt-2"
                            />
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Enter email"
                            />
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
                          <FormLabel>Department</FormLabel>
                          {departments?.length && (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value!}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments?.map((dept) => (
                                  <SelectItem key={dept.id} value={dept.id}>
                                    {dept.name} ({dept.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-3 bg-black text-white rounded-md shadow-md"
                  >
                    {editingStudent ? "Update Student" : "Add Student"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleBulkUpload}
            className="hidden"
            id="bulk-upload"
            disabled={isUploading}
            ref={fileInputRef}
          />
          <Button
            type="button"
            onClick={handleBulkUploadClick}
            disabled={isUploading}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Bulk Upload"}
          </Button>
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
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(student)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(student.userId)}
                    >
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
              className={
                currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
              }
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={
                currentPage === totalPages
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
