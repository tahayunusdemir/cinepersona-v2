import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ONLY_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
];

const PROTECTED_PREFIXES = ["/settings"];
const PROTECTED_EXACT = new Set<string>(["/community/me"]);

function needsAuth(pathname: string): boolean {
  if (PROTECTED_EXACT.has(pathname)) return true;
  if (PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  // /community/<board>/new
  if (/^\/community\/[^/]+\/new\/?$/.test(pathname)) return true;
  return false;
}

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
  const { data } = await supabase.auth.getClaims();
  const authed = Boolean(data);

  const { pathname, search } = request.nextUrl;

  // Logged-out → /settings, /community/me, /community/*/new bounce to login.
  if (!authed && needsAuth(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Logged-in → auth-only pages bounce home.
  if (authed && AUTH_ONLY_ROUTES.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: return supabaseResponse as-is. If you build a new response,
  // copy its cookies over with `cookies.setAll(supabaseResponse.cookies.getAll())`.
  return supabaseResponse;
}
