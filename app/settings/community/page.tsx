import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeftIcon, ShieldOffIcon } from "lucide-react";

import { UnblockButton } from "@/components/settings/unblock-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
    <main className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
      <header className="mb-8 flex flex-col gap-2">
        <Link
          href="/settings"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" />
          Settings
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Community
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          People you have blocked. Their threads and comments are hidden from
          you across CinePersona.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Blocked users</CardTitle>
          <CardDescription>
            {items.length === 0
              ? "You have not blocked anyone."
              : `${items.length} ${items.length === 1 ? "person" : "people"} blocked.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldOffIcon />
                </EmptyMedia>
                <EmptyTitle>No blocked users</EmptyTitle>
                <EmptyDescription>
                  Block someone from their profile to hide their content from
                  your feed.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y">
              {items.map(({ block, profile }) => {
                const label = profile.display_name?.trim() || `@${profile.username}`;
                return (
                  <li
                    key={block.blocked_id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <Link
                      href={`/${profile.username}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <Avatar className="size-9">
                        <AvatarImage
                          src={profile.avatar_url ?? "/user.png"}
                          alt=""
                        />
                        <AvatarFallback />
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{label}</p>
                        <p className="truncate text-xs text-muted-foreground">
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
        </CardContent>
      </Card>
    </main>
  );
}
