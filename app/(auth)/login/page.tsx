"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loginAction } from "./actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from 'framer-motion';
import signInWithGoogle from "./signWithGoogle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import StarryBackground from "@/components/StaryBg";

type LoginFormValues = z.infer<typeof AuthSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    const result = await loginAction(formData);
    if (result?.error) {
      setServerError(result.error);
    }
  }
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-3">
      <StarryBackground />
      <Card className="relative z-10 w-full max-w-md p-3 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700">
        <CardHeader className="text-center">
          <motion.div
            className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-200 shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <span className="text-3xl font-bold text-black">𝕃</span>
          </motion.div>
          <CardTitle className="text-3xl font-bold text-gray-100">Welcome Back 👋</CardTitle>
          <p className="text-gray-400">Sign in to continue</p>
        </CardHeader>
        
        <CardContent>
          <Button 
            type="button"
            className="w-full flex items-center justify-center border border-gray-600 rounded-lg py-2 hover:bg-gray-800 transition text-gray-300"
            onClick={signInWithGoogle}
          >
            <FcGoogle size={25} className="mr-2" /> Continue with Google
          </Button>

          <div className="relative flex items-center justify-center my-4">
            <span className="absolute bg-black px-2 text-gray-400">OR</span>
          </div>

          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" className="bg-gray-900 text-white" {...field} />
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
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-gray-900 text-white"
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
                )}
              />
                  <div className="flex justify-between text-sm text-gray-300">
                  <Link href="/resetPassword" className="hover:underline">Forgot Password?</Link>
                </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-600 hover:to-gray-400 transition text-black font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
