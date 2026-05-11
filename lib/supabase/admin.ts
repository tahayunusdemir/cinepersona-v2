/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import {
  createClient as createSupabase,
  type SupabaseClient,
} from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Use exclusively for trusted
// server-side write-back (lazy TMDB cache hydration). Never expose to
// the browser. The cookies adapter is intentionally absent: this client
// must NOT inherit the visitor's session.
//
// We don't generate Database types from Supabase, so the admin client
// is intentionally typed permissively. Each call site knows the shape
// it's writing; the schema constraints live in supabase/films.sql.

export type AdminClient = SupabaseClient<any, "public", any>;

let cached: AdminClient | null = null;

export function createAdminClient(): AdminClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  cached = createSupabase<any, "public", any>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function hasServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
