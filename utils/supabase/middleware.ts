import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  // Allow Supabase OAuth callback to pass through
  if (request.nextUrl.pathname.startsWith("/auth/callback")) {
    return response; // Don't block Supabase callback
  }

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Ensure the user session is updated
  const { data: { user } } = await supabase.auth.getUser();

  const authRoutes = ["/login", "/signup", "/resetPassword", "/updatePassword"];
  const isAuthPage = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!user && !isAuthPage) {
    // Redirect non-authenticated users trying to access protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthPage) {
    // Redirect authenticated users away from auth pages
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/:path*"],
};
