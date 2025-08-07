import { z } from "zod";

export const billingSchema = z.object({
    first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, apostrophes, and hyphens allowed"),

    last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50)
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters, spaces, apostrophes, and hyphens allowed"),

    email: z
    .string()
    .email("Invalid email")
    .max(100),

    phone_number: z
    .string()
    .regex(/^[+]?[\d\s\-]{6,15}$/, "Invalid phone number format")
    .optional(),

    country: z
    .string()
    .min(2, "Country is required")
    .max(56)
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters and spaces allowed"),

    city: z
    .string()
    .min(2, "City is required")
    .max(85)
    .regex(/^[a-zA-Z\s'-]+$/, "Only letters and spaces allowed"),
});

export type BillingFormData = z.infer<typeof billingSchema>;
