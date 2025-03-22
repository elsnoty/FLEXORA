"use server";

import { createServerClient } from "@/utils/supabase/adminRole";

export async function checkUserExists(email: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching users:", error);
    return { error: "Failed to check existing users." };
  }

  const userExists = data.users.some((user) => user.email === email);

  if (userExists) {
    return { error: "User already exists. Please log in instead." };
  }

  return { success: true };
}
