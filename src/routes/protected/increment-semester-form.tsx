'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { api } from '@/lib/axios'

// Helper function to generate year options
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = 2000; year <= currentYear + 6; year++) {
    years.push(year.toString())
  }
  return years
}

const incrementSemesterSchema = z.object({
  batch: z.string().min(1, "Batch is required"),
  maxSemester: z.string().min(1, "Max semester is required"),
})

type IncrementSemesterFormProps = {
  onSuccess: () => void
}

export default function IncrementSemesterForm({ onSuccess }: IncrementSemesterFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof incrementSemesterSchema>>({
    resolver: zodResolver(incrementSemesterSchema),
    defaultValues: {
      batch: '',
      maxSemester: '8',
    },
  })

  const incrementSemesterMutation = useMutation({
    mutationFn: async (data: z.infer<typeof incrementSemesterSchema>) => {
      const response = await api.post('/user.student.incrementSemester', data)
      return response.data
    },
    onSuccess: () => {
      toast({ title: "Semester incremented successfully" })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      onSuccess()
    },
    onError: (error) => {
      console.error("Failed to increment semester:", error)
      toast({ title: "Failed to increment semester", variant: "destructive" })
    },
  })

  const onSubmit = (data: z.infer<typeof incrementSemesterSchema>) => {
    incrementSemesterMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
          name="maxSemester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select max semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((semester) => (
                    <SelectItem key={semester} value={semester.toString()}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={incrementSemesterMutation.isPending}>
          {incrementSemesterMutation.isPending ? "Incrementing..." : "Increment Semester"}
        </Button>
      </form>
    </Form>
  )
}