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
import { loginAction } from "./actions";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import signInWithGoogle from "./signWithGoogle";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
Form,
FormControl,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import StarryBackground from "@/components/StaryBg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
useShowPassword,
useLoadingState,
} from "@/hooks/ShowPassword";
import Image from "next/image";
import FlexoraLogo from '../../../public/Flexora-LogoV3.png'
type LoginFormValues = z.infer<typeof AuthSchema>;

export default function Login(){
const { showPassword, setShowPassword } = useShowPassword();
const { isSubmitting, setIsSubmitting } = useLoadingState();
const [serverError, setServerError] = useState<string | null>(null);

const form = useForm<LoginFormValues>({
resolver: zodResolver(AuthSchema),
defaultValues: {
    email: "",
    password: "",
},
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
    setIsSubmitting(false);
    return;
}
};

return (
<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
    <StarryBackground />

    <motion.div
    className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500 rounded-full blur-3xl opacity-30"
    animate={{ x: [0, 100, 0], y: [0, 100, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.div
    className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500 rounded-full blur-3xl opacity-30"
    animate={{ x: [0, -100, 0], y: [0, -100, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    <Card className="relative z-10 w-full max-w-md bg-opacity-80 bg-gray-900 border border-gray-700 rounded-2xl shadow-[0_0_60px_-15px_rgba(255,255,255,0.2)] backdrop-blur-xl p-6">
    <CardHeader className="text-center">
    <motion.div
        className="mb-3 flex items-center justify-center"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        >
        <Image 
            src={FlexoraLogo} 
            alt="Flexora Logo" 
            width={200}  // Adjust this value as needed
            height={60}  // Adjust this value to maintain aspect ratio (1400/450 ≈ 3.11, so 200/3.11 ≈ 64)
            className="object-contain"  // This ensures the image maintains its aspect ratio
            style={{
            width: 'auto',  // Let the width be determined by the aspect ratio
            height: 'auto', // Let the height be determined by the aspect ratio
            maxWidth: '200px' // Set your desired maximum width
            }}
        />
        </motion.div>
        <p className="text-gray-400">Sign in to continue</p>
    </CardHeader>

    <CardContent>
        <Button
        type="button"
        className="w-full flex items-center justify-center bg-gray-800 border border-gray-600 rounded-lg py-2 hover:bg-black transition text-gray-300"
        onClick={signInWithGoogle}
        >
        <FcGoogle size={24} className="mr-2" />
        Continue with Google
        </Button>

        <div className="relative flex items-center justify-center my-4">
        <div className="h-px w-full bg-gray-700" />
        <span className="absolute bg-gray-900 px-3 text-gray-500 text-sm">
            OR
        </span>
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

            <div className="flex justify-between text-sm text-gray-400">
            <Link href="/resetPassword" className="hover:underline">
                Forgot Password?
            </Link>
            </div>

            <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition text-white font-semibold"
            disabled={isSubmitting}
            >
            {isSubmitting ? (
                <span className="flex items-center gap-2">
                Logging in...
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                </span>
            ) : (
                "Log In"
            )}
            </Button>
        </form>
        </Form>

        <p className="mt-4 text-center text-sm text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-400 hover:underline">
            Sign Up
        </Link>
        </p>
    </CardContent>
    </Card>
</div>
);
}

