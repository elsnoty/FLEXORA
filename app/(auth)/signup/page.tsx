"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "./actions";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StarryBackground from "@/components/StaryBg";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {useShowPassword, useLoadingState} from "@/hooks/ShowPassword";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


type SignupFormValues = z.infer<typeof AuthSchema>;

export default function Signup() {
  const {showPassword, setShowPassword} = useShowPassword() 
  const {isSubmitting, setIsSubmitting} = useLoadingState();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    setError(null)
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)
  
    const result = await signup(formData)
  
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden p-7 ">
      <StarryBackground />

      <Card className="relative z-10 w-full max-w-md shadow-2xl bg-gray-900 text-white rounded-2xl border border-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Create an Account 👋
          </CardTitle>
          <p className="text-center text-gray-400">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" className="bg-gray-800 text-white border-gray-700" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-gray-800 text-white border-gray-700"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 transition">
              {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        Sign Up...
                        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                      </span>
                    ) : (
                      "Sign Up"
                    )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account? {" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
