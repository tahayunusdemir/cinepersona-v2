import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // With Fluid compute, do not hoist this client into module scope —
  // always create a new one per request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // IMPORTANT: do not put any code between createServerClient and getClaims.
  // If you skip getClaims while using SSR, users may be randomly logged out.
  await supabase.auth.getClaims();

  // Auth-gated redirects can be added here once `/login` and `/auth/*` routes
  // exist. For now we only refresh the session and pass the response through.

  // IMPORTANT: return supabaseResponse as-is. If you build a new response,
  // copy its cookies over with `cookies.setAll(supabaseResponse.cookies.getAll())`.
  return supabaseResponse;
}
