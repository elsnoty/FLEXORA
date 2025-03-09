"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "./actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {motion} from 'framer-motion'
import signInWithGoogle from "./signWithGoogle";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid [background-size:80px_80px] bg-slate-800 relative overflow-hidden p-7">

      <Card className="relative z-10 w-full max-w-md p-0 shadow-2xl bg-white rounded-2xl">
        <CardHeader className="relative flex flex-col items-center text-center overflow-hidden">
            <motion.div
              className="z-10 mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <span className="text-3xl font-bold text-white">𝕃</span>
            </motion.div>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </CardTitle>
          <p className="text-center text-gray-500">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          {/* Google Sign-in Button */}
          <button className="w-full flex items-center justify-center border rounded-lg py-2 hover:bg-gray-100 transition" onClick={signInWithGoogle}>
            <FcGoogle size={25} className="mr-2" /> Continue with Google
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="w-full border-t border-gray-300"></div>
            <span className="absolute bg-white px-2 text-gray-500">OR</span>
          </div>

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
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-between text-sm text-gray-600">
              <Link href="/resetPassword" className="hover:underline">Forgot Password?</Link>
            </div>

            {/* Login Button */}
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
