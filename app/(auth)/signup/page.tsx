"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "./actions"; // ✅ Import the fixed signup function
import { SignupSchema } from "@/utils/validation/SignupValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type SignupFormValues = z.infer<typeof SignupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Handle signup errors

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setError(null); // Reset error
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden p-7">
      <div className="absolute inset-0 animate-breathe bg-gradient-to-r from-green-500 to-blue-600 opacity-50"></div>

      <Card className="relative z-10 w-full max-w-md shadow-2xl bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Create an Account 👋
          </CardTitle>
          <p className="text-center text-gray-500">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition">
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
