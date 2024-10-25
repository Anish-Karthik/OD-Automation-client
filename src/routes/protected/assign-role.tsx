"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Type definitions
type Teacher = {
  id: string;
  name: string;
  email: string;
  role: "TUTOR" | "YEAR_IN_CHARGE" | "HOD";
  assignedTo: string;
  countOfStudents: number;
};

type Department = {
  id: string;
  name: string;
  code: string;
};

// Mock API functions (replace with actual API calls)
const fetchTeachers = async (): Promise<Teacher[]> => {
  // Simulated API call
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "TUTOR",
      assignedTo: "CS-2025-1-1-A",
      countOfStudents: 30,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "YEAR_IN_CHARGE",
      assignedTo: "CS-2025-2-3",
      countOfStudents: 120,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "HOD",
      assignedTo: "CS",
      countOfStudents: 500,
    },
  ];
};

const fetchDepartments = async (): Promise<Department[]> => {
  // Simulated API call
  return [
    { id: "CS", name: "Computer Science", code: "CS" },
    { id: "EE", name: "Electrical Engineering", code: "EE" },
    { id: "ME", name: "Mechanical Engineering", code: "ME" },
  ];
};

const assignRole = async (
  data: z.infer<typeof assignRoleSchema>
): Promise<z.infer<typeof assignRoleSchema>> => {
  // Simulated API call
  console.log("Assigning role:", data);
  return data;
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

// Zod schema for form validation
const assignRoleSchema = z
  .discriminatedUnion("role", [
    z.object({
      role: z.literal("TUTOR"),
      teacherId: z.string().min(1, "Teacher is required"),
      departmentId: z.string().min(1, "Department is required"),
      batch: z.string().min(1, "Batch is required"),
      year: z.union([
        z.enum(["1", "2", "3", "4"]),
        z.string().regex(/^[5-6]$/),
      ]),
      semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
      section: z.union([
        z.enum(["A", "B", "C", "D"]),
        z.string().min(1, "Section is required"),
      ]),
    }),
    z.object({
      role: z.literal("YEAR_IN_CHARGE"),
      teacherId: z.string().min(1, "Teacher is required"),
      departmentId: z.string().min(1, "Department is required"),
      batch: z.string().min(1, "Batch is required"),
      year: z.union([
        z.enum(["1", "2", "3", "4"]),
        z.string().regex(/^[5-6]$/),
      ]),
      semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
    }),
    z.object({
      role: z.literal("HOD"),
      teacherId: z.string().min(1, "Teacher is required"),
      departmentId: z.string().min(1, "Department is required"),
    }),
  ])
  .refine(
    (data) => {
      if (data.role === "TUTOR" || data.role === "YEAR_IN_CHARGE") {
        const year = parseInt(data.year);
        const semester = parseInt(data.semester);
        return (
          (year === 1 && (semester === 1 || semester === 2)) ||
          (year === 2 && (semester === 3 || semester === 4)) ||
          (year === 3 && (semester === 5 || semester === 6)) ||
          (year === 4 && (semester === 7 || semester === 8)) ||
          (year >= 5 && semester >= 1 && semester <= 8)
        );
      }
      return true;
    },
    {
      message: "Invalid year and semester combination",
      path: ["semester"],
    }
  );

export default function AssignRolePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const form = useForm<z.infer<typeof assignRoleSchema>>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      role: "TUTOR",
      teacherId: "",
      departmentId: "",
      batch: "",
      year: "1",
      semester: "1",
      section: "A",
    },
  });

  const role = form.watch("role");
  const year = form.watch("year");

  useEffect(() => {
    const loadData = async () => {
      const teachersData = await fetchTeachers();
      const departmentsData = await fetchDepartments();
      setTeachers(teachersData);
      setDepartments(departmentsData);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (year) {
      form.setValue("semester", "1");
    }
  }, [year, form]);

  const onSubmit = async (data: z.infer<typeof assignRoleSchema>) => {
    try {
      await assignRole(data);
      toast({ title: "Role assigned successfully" });
    } catch (error) {
      toast({ title: "Failed to assign role", variant: "destructive" });
    }
  };

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
      form.setValue("role", teacher.role);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Assign Role</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleTeacherChange(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedTeacher && (
            <div className="bg-secondary p-4 rounded-md mb-4">
              <p>
                <strong>Current Role:</strong> {selectedTeacher.role}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedTeacher.assignedTo}
              </p>
              <p>
                <strong>Students Count:</strong>{" "}
                {selectedTeacher.countOfStudents}
              </p>
            </div>
          )}

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TUTOR">Tutor</SelectItem>
                    <SelectItem value="YEAR_IN_CHARGE">
                      Year In Charge
                    </SelectItem>
                    <SelectItem value="HOD">HOD</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {(role === "TUTOR" || role === "YEAR_IN_CHARGE") && (
            <>
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch" />
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
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue(
                          "semester",
                          String(Number(val) * 2 - 1) as any
                        );
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a year" />
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
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val);
                          form.setValue(
                            "semester",
                            String(Number(val) * 2 - 1) as any
                          );
                        }}
                        min={5}
                        max={6}
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
                          <SelectValue placeholder="Select a semester" />
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
                        {(year === "5" || year === "6" || year === "other") && (
                          <>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
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
            </>
          )}

          {role === "TUTOR" && (
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
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
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit">Assign Role</Button>
        </form>
      </Form>
    </div>
  );
}
