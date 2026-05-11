import Image from "next/image";
import Link from "next/link";

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label={`${siteConfig.name} home`}
        >
          <Image
            src="/logo.png"
            alt=""
            width={28}
            height={28}
            priority
            className="size-7 rounded-md"
          />
          <span className="text-sm sm:text-base">{siteConfig.name}</span>
        </Link>

        <SiteNav />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
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
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
