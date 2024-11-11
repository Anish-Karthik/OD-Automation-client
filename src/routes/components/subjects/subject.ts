export type Subject = {
  id: string
  subjectCode: string
  name: string
}

import * as z from "zod"

export const subjectSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Subject name is required"),
})

export type SubjectSchema = z.infer<typeof subjectSchema>