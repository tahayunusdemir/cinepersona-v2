import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteLogo } from "@/components/site-logo";
import { SiteNav } from "@/components/site-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { createClient } from "@/lib/supabase/server";
import { ctaPrimarySm } from "@/lib/ui-tokens";

async function getViewer() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) return null;

  const userId = claims.claims.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) return null;
  return profile as {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export async function SiteHeader() {
  const viewer = await getViewer();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="border-b border-foreground/10 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
          <MobileNav />

          <SiteLogo size="sm" priority />

          <SiteNav />

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 md:ml-0">
            <ModeToggle />
            {viewer ? (
              <UserMenu
                username={viewer.username}
                displayName={viewer.display_name}
                avatarUrl={viewer.avatar_url}
              />
            ) : (
              <Link href="/login" className={ctaPrimarySm}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
