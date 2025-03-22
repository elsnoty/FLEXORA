"use server";

import { createServerClient } from "@/utils/supabase/adminRole";
import { AuthSchema } from "@/utils/validation/SignupValidation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = createServerClient();

  const validationResult = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = AuthSchema.safeParse(validationResult);

  if (!result.success) {      
    return { error: "Invalid email or password format." };
  }

  const { email, password } = result.data;

  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    return { error: "Failed to check existing users." };
  }

  const existingUser = users.users.find((user) => user.email === email);

  if (existingUser) {
    if (!existingUser.email_confirmed_at) {
      await supabase.auth.resend({ type: "signup", email });
      return { success: "A new confirmation email has been sent." };
    }

    return { error: "User already exists. Please log in instead." };
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login");

  // ⚠️ TypeScript requires a return statement, but this is unreachable
  return null; 
}
