import * as z from "zod";

export const programSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration_weeks: z.coerce.number().min(1, "Duration must be at least 1 week"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.enum(["weight_loss", "muscle_gain", "rehabilitation", "endurance"]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  is_public: z.boolean().default(false),
  cover_image_url: z.string().optional(),
});

export const moduleSchema = z.object({
  modules: z.array(z.object({
    id: z.string().optional(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    order_index: z.number(),
    content_type: z.enum(["video", "document", "meal_plan", "workout"]).optional(),
    content_url: z.string().optional(),
    content_title: z.string().optional(),
    content_description: z.string().optional(),
    duration_minutes: z.coerce.number().optional().nullable(),
  }))
});

export type ProgramFormValues = z.infer<typeof programSchema>;
export type ModuleFormValues = z.infer<typeof moduleSchema>;