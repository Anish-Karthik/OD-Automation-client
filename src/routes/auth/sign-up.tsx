"use client";

import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import classImage from './class.jpg';

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("Sign-up attempted with:", { email, password, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-gray-800 p-8 rounded-lg border border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-400">Create Account</h2>
          <p className="mt-2 text-gray-300">Sign up for a new account</p>
        </div>
        <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
            <div className="absolute inset-0 bg-gray-900" />
            <div className="relative z-20 flex items-center text-lg font-medium mb-8">
              <div className="bg-white p-2 rounded-full mr-2">
                <FileText className="h-6 w-6 text-gray-900" />
              </div>
              OD Automation
            </div>
            <div className="relative z-20 flex-1 flex items-center justify-center">
              <img
                src={classImage}
                alt="OD Automation Project"
                width={350}
                height={400}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-yellow-400">
                  Create an account
                </h1>
                <p className="text-sm text-gray-400">
                  Enter your details to create your OD Automation account
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
                >
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
              <p className="px-8 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="underline underline-offset-4 hover:text-yellow-400 transition-colors duration-300"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}