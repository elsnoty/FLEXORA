"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "./actions";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import StarryBackground from "@/components/StaryBg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useShowPassword,
  useLoadingState,
} from "@/hooks/ShowPassword";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { motion } from "framer-motion";

type SignupFormValues = z.infer<typeof AuthSchema>;

export default function Signup() {
  const { showPassword, setShowPassword } = useShowPassword();
  const { isSubmitting, setIsSubmitting } = useLoadingState();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-black px-4">
      <StarryBackground />

      {/* floating animated blobs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-pink-500 rounded-full blur-3xl opacity-30"
        animate={{ x: [0, 100, 0], y: [0, 100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full blur-3xl opacity-30"
        animate={{ x: [0, -100, 0], y: [0, -100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <Card className="relative z-10 w-full max-w-md shadow-[0_0_60px_-15px_rgba(255,255,255,0.2)] bg-opacity-80 bg-gray-900 text-white rounded-2xl border border-gray-700 backdrop-blur-xl p-6">
        <CardHeader>
          <motion.div
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-400 to-gray-200 shadow-lg mx-auto"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-4xl font-extrabold text-black">𝕊</span>
          </motion.div>
          <CardTitle className="text-center text-3xl font-bold text-white">
            Create an Account 👋
          </CardTitle>
          <p className="text-center text-gray-400">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
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
                      <Input
                        placeholder="Enter your email"
                        className="bg-gray-800 text-white border-gray-600"
                        {...field}
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
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-gray-800 text-white border-gray-600 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 transition text-white font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    Signing up...
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
