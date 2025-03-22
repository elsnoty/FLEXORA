import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  // Allow Supabase OAuth callback to pass through
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return response;
  }

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          if (cookiesToSet.length > 0) { // ✅ Prevent setting empty cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          }
        },
      },
    }
  );

  // Ensure the user session is updated
  const { data: { user } } = await supabase.auth.getUser();

  const authRoutes = ["/login", "/signup", "/resetPassword", "/updatePassword"];
  const isAuthPage = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
