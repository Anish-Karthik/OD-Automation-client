"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { auth } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const email = z.string().email();
const phone = z
  .string()
  .min(10)
  .max(15)
  .refine((value) => {
    return /^\d+$/.test(value);
  });

const formSchema = z
  .object({
    username: z.string().min(2).max(50),
    email: email.nullable(),
    phone: phone.nullable(),
    password: z.string(),
  })
  .refine(
    (data) => {
      if ((data.email && !data.phone) || (!data.email && data.phone)) {
        return true;
      }
      return false;
    },
    {
      message: "Either email is required",
      path: ["username"], // This can be used to show the error on both fields
    }
  );

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: null,
      phone: null,
      password: "",
    },
  });
  const {
    // register,
    // handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = form;
  const { loginCallback } = useAuth();
  const navigate = useNavigate();

  const username = watch("username");

  React.useEffect(() => {
    if (!form.formState.isDirty) return;
    if (username.includes("@")) {
      const parsed = email.safeParse(username);
      if (parsed.success && parsed.data !== undefined) {
        setValue("email", username);
        setValue("phone", null);
        form.clearErrors("username");
      }
    } else if (username.match(/^\d+$/)) {
      const parsed = phone.safeParse(username);
      if (parsed.success && parsed.data !== undefined) {
        setValue("phone", username);
        setValue("email", null);
        form.clearErrors("username");
      }
    } else {
      form.setError("username", {
        type: "invalid",
        message: "Invalid email",
      });
      setValue("email", null);
      setValue("phone", null);
    }
  }, [username, setValue]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const reqObj: {
        username: string;
        password: string;
      } = { password: data.password, username: data.phone || data.email! };
      if (data.email) {
        reqObj.username = data.email;
      } else {
        form.clearErrors("username");
        form.setError("username", {
          type: "invalid",
          message: "Invalid email",
        });
        toast.error("Invalid email");
      }
      const res = await auth.post("/login", reqObj);
      if (res.status) {
        toast.success("Logged in successfully");
        loginCallback(res.data.user);
        navigate("/dashboard");
        // window.location.href = "/dashboard";
      }
      console.log(res.data);
    } catch (error: any) {
      toast.error("Failed to login");
      toast.error(error.message);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    disabled={isSubmitting}
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
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} className="w-full">
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login with Email/Phone
          </Button>
        </form>
      </Form>
    </div>
  );
}
