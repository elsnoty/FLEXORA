import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/cron/reminders")) {
    const cronSecret = request.headers.get('x-cron-secret');
    if (cronSecret !== process.env.CRON_SECRET) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    return response;
  }

  const publicRoutes = [
    "/auth/callback",
    "/api/logout",
    "/api/trainers/search",
    "/api/trainer/programs",
    "/api/sessions",
    "/api/payment",
    "/api/webhook",
  ];

  if (publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    return response;
  }

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

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  const authRoutes = ["/login", "/signup", "/resetPassword", "/updatePassword"];
  const isAuthPage = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isSelectRolePage = request.nextUrl.pathname.startsWith("/select_role");

  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    if (!user.id) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Skip profile check for delete-account route
    if (request.nextUrl.pathname.startsWith("/api/delete-account")) {
      return response;
    }

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
      const allowedPrefix = `/${profile.role}`;
      const isAllowedRoute = request.nextUrl.pathname.startsWith(allowedPrefix);

      if (isAuthPage || isSelectRolePage) {
        return NextResponse.redirect(new URL(allowedPrefix, request.url));
      }

      if (!isAllowedRoute) {
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