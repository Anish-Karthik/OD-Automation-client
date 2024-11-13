'use client'

import * as React from "react"
import { Helmet } from "react-helmet"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, FileText } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { auth } from "@/lib/axios"
import { useAuth } from "@/components/AuthProvider"
import classImage from './class.jpg'

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(3, {
    message: "Password must be at least 6 characters.",
  }),
})

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const { loginCallback } = useAuth()
  const navigate = useNavigate()

  const { watch, setValue, formState: { isSubmitting } } = form

  const username = watch("username")

  React.useEffect(() => {
    if (!form.formState.isDirty) return
    if (username.includes("@")) {
      const emailSchema = z.string().email()
      const parsed = emailSchema.safeParse(username)
      if (parsed.success) {
        form.clearErrors("username")
      } else {
        form.setError("username", {
          type: "invalid",
          message: "Invalid email format",
        })
      }
    } else if (username.match(/^\d+$/)) {
      const phoneSchema = z.string().min(10).max(15)
      const parsed = phoneSchema.safeParse(username)
      if (parsed.success) {
        form.clearErrors("username")
      } else {
        form.setError("username", {
          type: "invalid",
          message: "Invalid phone number format",
        })
      }
    } else {
      form.setError("username", {
        type: "invalid",
        message: "Enter a valid email or phone number",
      })
    }
  }, [username, form])

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await auth.post("/login", {
        username: data.username,
        password: data.password,
      })
      if (res.status) {
        toast.success("Logged in successfully");
        loginCallback(res.data.user);
        navigate("/dashboard");
        // window.location.href = "/dashboard";
      }
    } catch (error: any) {
      toast.error("Failed to login")
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400">Welcome back</h2>
          <p className="mt-2 text-gray-300">Sign in to your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username" className="text-gray-300">
                    Email or Phone
                  </Label>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder="Email or Phone"
                      {...field}
                      disabled={isSubmitting}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      {...field}
                      disabled={isSubmitting}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
            >
              {isSubmitting ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-gray-400">
          New User?{" "}
          <Link
            to="/auth/signup"
            className="underline underline-offset-4 hover:text-yellow-400 transition-colors duration-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}