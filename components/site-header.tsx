import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteNav } from "@/components/site-nav";
import { UserMenu } from "@/components/auth/user-menu";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

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
  const brandLead = siteConfig.name.replace("Persona", "");

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility strip — hidden below sm */}
      <div className="hidden border-b border-foreground/5 bg-panel/80 backdrop-blur supports-[backdrop-filter]:bg-panel/60 dark:bg-[#070514]/80 dark:supports-[backdrop-filter]:bg-[#070514]/60 sm:block">
        <div className="mx-auto flex h-7 w-full max-w-6xl items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">
              Tonight&apos;s feature{" "}
              <span className="text-foreground/70">In the Mood for Love</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline">No ratings · No noise</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative border-b border-foreground/10 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
        {/* Hair-thin gold reveal under the bar */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#ecb756]/40 to-transparent"
        />

        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
          <MobileNav />

          <Link
            href="/"
            className="group flex items-center gap-2.5 font-semibold tracking-tight"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="relative grid size-9 place-items-center rounded-lg border border-foreground/10 bg-panel">
              <Image
                src="/logo.png"
                alt=""
                width={22}
                height={22}
                priority
                className="size-[22px]"
              />
              <span
                aria-hidden
                className="absolute inset-0 rounded-lg ring-1 ring-inset ring-[#ecb756]/0 transition-all duration-500 group-hover:ring-[#ecb756]/40"
              />
            </span>
            <span className="hidden font-display text-[19px] leading-none tracking-tight sm:inline">
              {brandLead}
              <span className="text-[#ecb756]">Persona</span>
            </span>
            <span className="font-display text-[19px] text-[#ecb756] sm:hidden">
              CP
            </span>
          </Link>

          {/* Decorative divider */}
          <span
            aria-hidden
            className="hidden h-6 w-px bg-gradient-to-b from-transparent via-foreground/15 to-transparent md:inline-block"
          />

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
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "group h-9 rounded-full bg-[#ecb756] px-4 text-[13px] font-medium text-[#1a1840] shadow-[0_6px_22px_-12px_#ecb75699] hover:bg-[#f3cd84] hover:text-[#1a1840]",
                )}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
