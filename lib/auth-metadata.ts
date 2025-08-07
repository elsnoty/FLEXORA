import type { Metadata } from "next";

export const authMetadata: Record<string, Metadata> = {
    login: {
    title: "Sign In | Flexora",
    description: "Access your fitness account",
    robots: { index: false } // Prevent indexing
},
    signup: {
    title: "Create Account | Flexora",
    description: "Start your fitness journey",
    robots: { index: false }
},
    forgotPassword: {
    title: "Reset Password | Flexora",
    description: "Recover your account access",
    robots: { index: false },
    alternates: {
    canonical: "/forgot-password"
    }
}
};