import * as z from "zod"

export const studentSchema = z
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
          const currentYear = new Date().getFullYear()
          const year = parseInt(value, 10)
          return year >= 2000 && year <= currentYear + 6
        },
        {
          message: "Invalid batch year",
        }
      ),
    email: z.string().email().nullable(),
    departmentId: z.string().nullable(),
  })
  .refine(
    (data) => {
      const year = Number.parseInt(data.year)
      const semester = Number.parseInt(data.semester)
      return (
        (year === 1 && (semester === 1 || semester === 2)) ||
        (year === 2 && (semester === 3 || semester === 4)) ||
        (year === 3 && (semester === 5 || semester === 6)) ||
        (year === 4 && (semester === 7 || semester === 8)) ||
        (year >= 5 && semester >= 1 && semester <= 8)
      )
    },
    {
      message: "Invalid year and semester combination",
      path: ["semester"],
    }
  )

export type StudentSchema = z.infer<typeof studentSchema>