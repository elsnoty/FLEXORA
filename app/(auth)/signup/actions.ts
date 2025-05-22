"use server";

import { createClient } from "@/utils/supabase/server";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const validationResult = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = AuthSchema.safeParse(validationResult);

  if (!result.success) {      
    return { error: "Invalid email or password format." };
  }

  const { email, password } = result.data;

  // Check if email exists using Supabase's auth.admin API (requires proper permissions)
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({ 
    email, 
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes('User already registered')) {
      return { error: "User already exists. Please log in instead." };
    }
    return { error: signUpError.message };
  }

  if (user?.identities?.length === 0) {
    return { error: "User already exists. Please log in instead." };
  }

  revalidatePath("/", "layout");
  redirect("/login");
}