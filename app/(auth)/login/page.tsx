"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "./actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative overflow-hidden p-7">
      <div className="absolute inset-0 animate-breathe bg-gradient-to-r from-blue-500 to-purple-600 opacity-50"></div>

      <Card className="relative z-10 w-full max-w-md p-0 shadow-2xl bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </CardTitle>
          <p className="text-center text-gray-500">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Link href={'/resetPassword'} 
              className="absolute right-0 hover:underline">Rest Password ?</Link>
            </div>

            <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700 transition !mt-7">
              Log In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
