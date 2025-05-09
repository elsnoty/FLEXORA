import { z } from "zod";

export const ProfileSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long").trim(),
    bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
    height: z
    .number()
    .min(30, "Height must be at least 30 cm")
    .max(300, "Height must be less than 300 cm")
    .optional()
    .nullable(),
    weight: z
    .number()
    .min(25, "Weight must be at least 25 kg")
    .max(450, "Weight must be less than 450 kg")
    .optional()
    .nullable(),
    location: z.string().optional(),
    phone_number: z.string()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{3,6}$/, "Invalid phone number")
    .optional()
    .nullable()
});