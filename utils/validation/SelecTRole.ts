import { z } from "zod";

export const SelectRoleSchema = z.object({
    name: z.string().min(4, "Name must be at least 4 characters long").trim(),
    role: z.enum(["trainer", "trainee"], { message: "Role must be either 'trainer' or 'trainee'" }),
    gender: z.enum(["male", "female"], { message: "Gender must be either 'male' or 'female'" }),
  });