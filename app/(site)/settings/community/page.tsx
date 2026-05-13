import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon, ShieldOffIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { UnblockButton } from "@/components/settings/unblock-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Community settings" };

type BlockedRow = {
  blocked_id: string;
  created_at: string;
};

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export default async function SettingsCommunityPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect("/login?next=/settings/community");
  }

  const { data: blocks } = await supabase
    .from("blocks")
    .select("blocked_id, created_at")
    .eq("blocker_id", userData.user.id)
    .order("created_at", { ascending: false })
    .returns<BlockedRow[]>();

  // Profiles RLS hides deactivated rows from the public policy, but
  // profiles_read_own only matches `auth.uid() = id`. A blocked deactivated
  // user therefore won't appear here — that is acceptable for the MVP since
  // the user can no longer interact with you anyway.
  const blockedIds = (blocks ?? []).map((b) => b.blocked_id);
  const profilesById = new Map<string, Profile>();
  if (blockedIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", blockedIds)
      .returns<Profile[]>();

    for (const p of profiles ?? []) {
      profilesById.set(p.id, p);
    }
  }

  const items = (blocks ?? [])
    .map((b) => ({ block: b, profile: profilesById.get(b.blocked_id) }))
    .filter((it): it is { block: BlockedRow; profile: Profile } =>
      Boolean(it.profile),
    );

  return (
    <div className="relative isolate overflow-hidden">

      <main className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
        <header className="mb-10">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
          >
            <ChevronLeftIcon className="size-3" />
            Settings
          </Link>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
            Community
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            People you have blocked. Their threads and comments are hidden from
            you across CinePersona.
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
          <div className="border-b border-foreground/5 p-6">
            <FrameTag>Blocked users</FrameTag>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length === 0
                ? "You have not blocked anyone."
                : `${items.length} ${items.length === 1 ? "person" : "people"} blocked.`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
                <ShieldOffIcon className="size-5" />
              </div>
              <h2 className="mt-5 font-display text-xl tracking-tight">
                No blocked users.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Block someone from their profile to hide their content from
                your feed.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map(({ block, profile }) => {
                const label =
                  profile.display_name?.trim() || `@${profile.username}`;
                return (
                  <li
                    key={block.blocked_id}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <Link
                      href={`/${profile.username}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <Avatar className="size-10 border border-foreground/10">
                        <AvatarImage
                          src={profile.avatar_url ?? "/user.png"}
                          alt=""
                        />
                        <AvatarFallback />
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-display text-base tracking-tight">
                          {label}
                        </p>
                        <p className="truncate font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          @{profile.username}
                        </p>
                      </div>
                    </Link>
                    <UnblockButton
                      targetId={profile.id}
                      username={profile.username}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
