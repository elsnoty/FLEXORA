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
          if (cookiesToSet.length > 0) { // Prevent setting empty cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          }
        },
      },
    }
  );

  // Ensure the user session is updated
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.log("Auth error, treating as unauthenticated:", userError);
  }

  const authRoutes = ["/login", "/signup", "/resetPassword", "/updatePassword"];
  const isAuthPage = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isSelectRolePage = request.nextUrl.pathname.startsWith("/select_role");

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, role, gender")
      .eq("user_id", user.id)
      .single();

    const hasCompleteProfile = profile && profile.name && profile.role && profile.gender && !profileError;

    if (!hasCompleteProfile && !isSelectRolePage) {
      return NextResponse.redirect(new URL("/select_role", request.url));
    }

    if (hasCompleteProfile) {
      // Define the user's allowed dashboard prefix based on their role
      const allowedPrefix = `/dashboard/${profile.role}`;
      const isAllowedRoute = request.nextUrl.pathname.startsWith(allowedPrefix);

      if (isAuthPage || isSelectRolePage) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }

      if (!isAllowedRoute) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }

      const isTrainerRoute = request.nextUrl.pathname.startsWith("/dashboard/trainer");
      const isTraineeRoute = request.nextUrl.pathname.startsWith("/dashboard/trainee");

      if (profile.role === "trainer" && isTraineeRoute) {
        return NextResponse.redirect(new URL("/dashboard/trainer", request.url));
      }
      if (profile.role === "trainee" && isTrainerRoute) {
        return NextResponse.redirect(new URL("/dashboard/trainee", request.url));
      }
    }
  }

  return response;
}