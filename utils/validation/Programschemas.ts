import * as z from "zod";

// Step 1: Basic Program Schema
export const programSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration_weeks: z.coerce.number().min(1, "Duration must be at least 1 week"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.enum(["weight_loss", "muscle_gain", "rehabilitation", "endurance"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  is_public: z.boolean().default(false),
  cover_image_url: z.string().optional(),
});

// Step 2: Module Schema
export const moduleSchema = z.object({
  modules: z.array(z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    order_index: z.number(),
  }))
});

// Step 3: Content Schema
export const contentSchema = z.object({
  moduleContents: z.array(z.object({
    module_id: z.string(),
    content_type: z.enum(["video", "document", "meal_plan", "workout"]),
    content_url: z.string().optional(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional().default(""),
    duration_minutes: z.coerce.number().optional().nullable(),
  }))
});

export type ProgramFormValues = z.infer<typeof programSchema>;
export type ModuleFormValues = z.infer<typeof moduleSchema>;
export type ContentFormValues = z.infer<typeof contentSchema>;