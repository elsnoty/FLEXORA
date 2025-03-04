'use server'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signout() {
  const supabase = await createClient();

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign-out error:', error.message); // Log error for debugging
    redirect('/error'); // Redirect to an error page
  }

  // Redirect to home page after successful sign-out
  redirect('/login');
}
