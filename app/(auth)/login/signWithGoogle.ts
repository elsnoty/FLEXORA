"use client";

import { createClient } from "@/utils/supabase/client";


export default async function signInWithGoogle() {
  const supabase = createClient()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, 
        // scopes: "https://www.googleapis.com/auth/calendar.events", 
      },
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };