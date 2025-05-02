"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        router.replace("/login");
        return;
      }

      const session = data?.session;
      if (!session) {
        router.replace("/login");
        return;
      }

      if (session.provider_token) {
        sessionStorage.setItem("googleAccessToken", session.provider_token);
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, name")
        .eq("user_id", session.user.id)
        .single();

      if (profileError || !profile?.role || !profile?.name) {
        router.replace("/select_role");
        return;
      }

      if (profile.role === "trainer") {
        router.replace("/dashboard/trainer");
      } else if (profile.role === "trainee") {
        router.replace("/dashboard/trainee");
      }
    };

    handleAuth();
  }, [router]);

  return null;
}