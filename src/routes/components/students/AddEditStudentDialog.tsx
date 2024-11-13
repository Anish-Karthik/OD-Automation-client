'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { Department, Student } from "./student"
import { studentSchema } from "@/lib/schemas/studentSchema"
import { createStudent, fetchDepartments, updateStudent } from "@/lib/api/StudentApi"
import { z } from "zod"
import { Loader2 } from "lucide-react"

type AddEditStudentDialogProps = {
  isOpen: boolean
  onClose: () => void
  editingStudent: Student | null
}

export function AddEditStudentDialog({ isOpen, onClose, editingStudent }: AddEditStudentDialogProps) {
  const queryClient = useQueryClient()

  const { data: departments = [] } = useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  })

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast({ title: "Student created successfully" })
      onClose()
    },
    onError: () => {
      toast({ title: "Failed to create student", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
      toast({ title: "Student updated successfully" })
      onClose()
    },
    onError: () => {
      toast({ title: "Failed to update student", variant: "destructive" })
    },
  })

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
      departmentId: "",
    },
  })

  useEffect(() => {
    if (editingStudent) {
      form.reset({
        ...editingStudent,
        year: editingStudent.year.toString(),
        semester: editingStudent.semester.toString() as "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8",
      })
    } else {
      form.reset()
    }
  }, [editingStudent, form])

  const onSubmit = (data: z.infer<typeof studentSchema>) => {
    if (editingStudent) {
      updateMutation.mutate({ ...editingStudent, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 7 }, (_, i) => (currentYear - 3 + i).toString())
  }

  const getSemesterOptions = (year: string): Array<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"> => {
    switch (year) {
      case "1":
        return ["1", "2"];
      case "2":
        return ["3", "4"];
      case "3":
        return ["5", "6"];
      case "4":
        return ["7", "8"];
      default:
        return ["1"];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700 shadow-lg max-w-2xl">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {editingStudent ? "Update student information" : "Enter student details to create a new record"}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="regNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Registration Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter registration number" 
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rollno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Roll Number</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        placeholder="Enter roll number" 
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter student name" 
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Batch</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                          <SelectValue placeholder="Select batch" className="text-gray-400" />
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
                      onValueChange={(value) => {
                        field.onChange(value);
                        const semesterOptions = getSemesterOptions(value);
                        form.setValue("semester", semesterOptions[0]);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                          <SelectValue placeholder="Select year" className="text-gray-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {["1", "2", "3", "4"].map((year) => (
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Semester</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={!form.watch("year")}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                          <SelectValue 
                            placeholder={form.watch("year") ? "Select semester" : "Select year first"} 
                            className="text-gray-400" 
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {getSemesterOptions(form.watch("year")).map((semester) => (
                          <SelectItem 
                            key={semester} 
                            value={semester}
                            className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400"
                          >
                            {semester}
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
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Section</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                          <SelectValue placeholder="Select section" className="text-gray-400" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {["A", "B", "C", "D", "Other"].map((section) => (
                          <SelectItem 
                            key={section} 
                            value={section}
                            className="text-gray-300 focus:bg-gray-700 focus:text-yellow-400 hover:bg-gray-700 hover:text-yellow-400"
                          >
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value === "Other" && (
                      <Input
                        placeholder="Enter custom section"
                        onChange={(e) => field.onChange(e.target.value)}
                        className="mt-2 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                    )}
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Enter email"
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select department" className="text-gray-400" />
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
            <div className="flex justify-end space-x-4 pt-4 mt-2 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-yellow-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingStudent ? "Update Student" : "Add Student"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}