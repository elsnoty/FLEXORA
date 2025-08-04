import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  // Allow these routes to pass through without authentication
  const publicRoutes = [
    "/auth/callback",
    "/api/logout",
    "/api/trainers/search",
    "/api/trainer/programs",
    "/api/sessions",
    "/api/payment",
    "/api/webhook",
    "/trainee/payment/processing",
    "/trainee/payment/processing/*"
  ];

  // Check if this is a public route - if so, return early
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log("Public route accessed:", request.nextUrl.pathname);
    return response;
  }

  // Initialize Supabase client only for non-public routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          if (cookiesToSet.length > 0) {
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
    console.log("No user found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // Only try to get profile if user exists and has an ID
    if (!user.id) {
      console.log("User exists but has no ID, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name, role, gender")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.log("Profile fetch error:", profileError);
    }

    const hasCompleteProfile = profile && profile.name && profile.role && profile.gender && !profileError;

    if (!hasCompleteProfile && !isSelectRolePage) {
      console.log("Incomplete profile, redirecting to select role");
      return NextResponse.redirect(new URL("/select_role", request.url));
    }

    if (hasCompleteProfile) {
      // Define the user's allowed dashboard prefix based on their role
      const allowedPrefix = `/${profile.role}`;
      const isAllowedRoute = request.nextUrl.pathname.startsWith(allowedPrefix);

      if (isAuthPage || isSelectRolePage) {
        console.log("User authenticated, redirecting to dashboard");
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }

      if (!isAllowedRoute) {
        console.log("User not on allowed route, redirecting to dashboard");
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }

      const isTrainerRoute = request.nextUrl.pathname.startsWith("/trainer");
      const isTraineeRoute = request.nextUrl.pathname.startsWith("/trainee");

      if (profile.role === "trainer" && isTraineeRoute) {
        return NextResponse.redirect(new URL("/trainer", request.url));
      }
      if (profile.role === "trainee" && isTrainerRoute) {
        return NextResponse.redirect(new URL("/trainee", request.url));
      }
    }
  }

  return response;
}