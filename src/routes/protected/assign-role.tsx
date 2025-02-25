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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                    <SelectValue placeholder="Select a role" className="text-gray-400" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="TUTOR" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">Tutor</SelectItem>
                  <SelectItem value="YEAR_IN_CHARGE" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">Year In Charge</SelectItem>
                  <SelectItem value="HOD" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">HOD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departmentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-200">Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                    <SelectValue placeholder="Select a department" className="text-gray-400" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {departments.map((dept) => (
                    <SelectItem 
                      key={dept.id} 
                      value={dept.id}
                      className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400"
                    >
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        {(role === "TUTOR" || role === "YEAR_IN_CHARGE") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="batch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Batch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select a batch" className="text-gray-400" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {generateYearOptions().map((year) => (
                        <SelectItem 
                          key={year} 
                          value={year}
                          className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Year</FormLabel>
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
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select a year" className="text-gray-400" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
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
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Semester</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!year}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select a semester" className="text-gray-400" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
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
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
        )}

        {role === "TUTOR" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Section</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select a section" className="text-gray-400" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="A" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">A</SelectItem>
                      <SelectItem value="B" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">B</SelectItem>
                      <SelectItem value="C" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">C</SelectItem>
                      <SelectItem value="D" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">D</SelectItem>
                      <SelectItem value="other" className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.value === "other" && (
                    <Input
                      placeholder="Enter section"
                      onChange={(e) => field.onChange(e.target.value)}
                      className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  )}
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startRollNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Start Roll No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endRollNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">End Roll No</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
        >
          Assign Role
        </Button>
      </form>
    </Form>
  );
}
