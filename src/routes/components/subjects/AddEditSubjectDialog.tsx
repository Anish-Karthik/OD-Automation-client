'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Subject, subjectSchema } from "./subject"
import { createSubject, updateSubject } from "@/lib/api/SubjectApi"

type AddEditSubjectDialogProps = {
  isOpen: boolean
  onClose: () => void
  editingSubject: Subject | null
}

export function AddEditSubjectDialog({ isOpen, onClose, editingSubject }: AddEditSubjectDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subjectCode: "",
      name: "",
      semester: "",
    },
  })

  useEffect(() => {
    if (editingSubject) {
      form.reset(editingSubject)
    } else {
      form.reset()
    }
  }, [editingSubject, form])

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof subjectSchema>) => 
      editingSubject 
        ? updateSubject({ ...data, id: editingSubject.id })
        : createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] })
      toast({ title: `Subject ${editingSubject ? "updated" : "created"} successfully` })
      onClose()
    },
    onError: () => {
      toast({ title: `Failed to ${editingSubject ? "update" : "create"} subject`, variant: "destructive" })
    },
  })

  const onSubmit = (data: z.infer<typeof subjectSchema>) => {
    mutation.mutate(data)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border border-gray-700 shadow-lg max-w-2xl">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <DialogTitle className="text-2xl font-bold text-yellow-400">
            {editingSubject ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
          <p className="text-gray-400 text-sm">
            {editingSubject ? "Update subject information" : "Enter subject details to create a new record"}
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="subjectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Subject Code</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter subject code" 
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter subject name" 
                      className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </FormControl>
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
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:ring-yellow-400 focus:ring-offset-0">
                        <SelectValue placeholder="Select semester" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((semester) => (
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
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {editingSubject ? "Update Subject" : "Add Subject"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
