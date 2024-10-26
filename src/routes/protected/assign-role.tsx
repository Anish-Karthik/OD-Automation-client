"use client";

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

// Types
type Teacher = {
  id: string;
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
export const assignRoleSchema = z
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
      startRollNo: z.number().min(1, "Start Roll No is required"),
      endRollNo: z.number().min(1, "End Roll No is required"),
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
        const year = Number.parseInt(data.year);
        const semester = Number.parseInt(data.semester);
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

type AssignRoleFormProps = {
  teacher: Teacher;
  departments: Department[];
  onSubmit: (data: z.infer<typeof assignRoleSchema>) => void;
};

export default function AssignRoleForm({
  teacher,
  departments,
  onSubmit,
}: AssignRoleFormProps) {
  const form = useForm<z.infer<typeof assignRoleSchema>>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
      role: "TUTOR",
      teacherId: teacher.id,
      departmentId: "",
      batch: "",
      year: "1",
      semester: "1",
      section: "A",
      startRollNo: 1,
      endRollNo: 30,
    },
  });

  const role = form.watch("role");
  const year = form.watch("year");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <SelectItem value="YEAR_IN_CHARGE">Year In Charge</SelectItem>
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
          <>
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
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="startRollNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Roll No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
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
                name="endRollNo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Roll No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        <Button type="submit">Assign Role</Button>
      </form>
    </Form>
  );
}
