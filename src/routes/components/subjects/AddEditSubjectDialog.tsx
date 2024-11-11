'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingSubject ? "Edit Subject" : "Add New Subject"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subjectCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter subject code" />
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
                    <Input {...field} placeholder="Enter subject name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {editingSubject ? "Update Subject" : "Add Subject"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}