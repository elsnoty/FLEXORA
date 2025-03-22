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
      if (session?.provider_token) {
        sessionStorage.setItem("googleAccessToken", session.provider_token); // 👈 استخدام Session Storage
      }

      router.replace(session ? "/" : "/login");
    };

    handleAuth();
  }, [router]);

  return null;
}
