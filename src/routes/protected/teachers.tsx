"use client";

import { useState } from "react";
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
import AssignRoleForm, { type assignRoleSchema } from "./assign-role";

// Types
type Teacher = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "TUTOR" | "YEAR_IN_CHARGE" | "HOD" | null;
  assignedTo: string | null;
  countOfStudents: number | null;
};

type Department = {
  id: string;
  name: string;
  code: string;
};

// API functions
const fetchTeachers = async (): Promise<Teacher[]> => {
  const res = await api.get("/user.teacher.list");
  return res.data.result.data;
};

const fetchDepartments = async (): Promise<Department[]> => {
  const res = await api.get("/department.getAll");
  return res.data.result.data;
};

const createTeacher = async (data: Teacher) => {
  const res = await api.post("/user.teacher.create", data);
  return res.data.result.data;
};

const updateTeacher = async (data: Teacher) => {
  const res = await api.post("/user.teacher.create", data);
  
  return res.data.result.data;
};

const deleteTeacher = async (id: string) => {
   
  try {
    const res = await api.post('/user.delete', {id})
    console.log('deleteTeacher', res.data)
    return res.data.result.data
  }
  catch (err) {
    console.log('deleteTeacher', err)
  }

}

const bulkCreateTeachers = async (data: Teacher[]) => {
  const res = await api.post("/user.teacher.bulkCreate", { teachers: data });
  return res.data.result.data;
};

const assignRole = async (data: z.infer<typeof assignRoleSchema>) => {
  const res = await api.post("/user.teacher.assignRole", data);
  return res.data.result.data;
};

// Form schema
const teacherSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export default function TeacherManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignRoleDialogOpen, setIsAssignRoleDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();

  const { data: teachers = [], isLoading } = useQuery<Teacher[], Error>({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const { data: departments = [] } = useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const createMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher created successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create teacher", variant: "destructive" });
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher updated successfully" });
      setIsAddDialogOpen(false);
      setEditingTeacher(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update teacher", variant: "destructive" });
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teacher deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete teacher", variant: "destructive" });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: bulkCreateTeachers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Teachers bulk uploaded successfully" });
    },
    onError: () => {
      toast({
        title: "Failed to bulk upload teachers",
        variant: "destructive",
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({ title: "Role assigned successfully" });
      setIsAssignRoleDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to assign role", variant: "destructive" });
    },
  });

  const form = useForm<z.infer<typeof teacherSchema>>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof teacherSchema>) => {
    if (editingTeacher) {
      updateMutation.mutate({ ...editingTeacher, ...data });
    } else {
      createMutation.mutate(data as Teacher);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    form.reset(teacher);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleBulkUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Teacher[];
        bulkCreateMutation.mutate(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleAssignRole = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsAssignRoleDialogOpen(true);
  };

  const onAssignRoleSubmit = (data: z.infer<typeof assignRoleSchema>) => {
    assignRoleMutation.mutate(data);
  };

  const paginatedTeachers = teachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(teachers.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Teacher Management</h1>
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTeacher(null);
                form.reset();
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {editingTeacher ? "Update Teacher" : "Add Teacher"}
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
            <Button type="button">
              <FileUp className="mr-2 h-4 w-4" /> Bulk Upload
            </Button>
          </label>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Students Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTeachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>{teacher.role || "Not Assigned"}</TableCell>
              <TableCell>{teacher.assignedTo || "N/A"}</TableCell>
              <TableCell>{teacher.countOfStudents || 0}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(teacher)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(teacher.userId)}>
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAssignRole(teacher)}>
                      Assign Role
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

      <Dialog
        open={isAssignRoleDialogOpen}
        onOpenChange={setIsAssignRoleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to {selectedTeacher?.name}</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <AssignRoleForm
              teacher={selectedTeacher}
              departments={departments}
              onSubmit={onAssignRoleSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
