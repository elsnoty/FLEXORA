"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthSchema } from "@/utils/validation/SignupValidation";

type ActionResponse = { error: string | null };

export async function loginAction(formData: FormData): Promise<ActionResponse | never> {
  const validationResult = AuthSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validationResult.success) {
    return { error: "Invalid form data" };
  }

  const data = validationResult.data;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message || "Failed to log in." };
  }

  revalidatePath("/", "layout");
  redirect("/"); 

  // The function never reaches here after `redirect()`, but TypeScript requires a return type
  return { error: null };
}
