import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BellIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { listNotifications } from "@/lib/notifications/queries";
import { NOTIFICATIONS_PAGE_SIZE } from "@/lib/notifications/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  // Reads the JWT from the auth cookie — no network round-trip, unlike
  // getUser(). Middleware (proxy.ts) is the source of truth for "must be
  // signed in to view /notifications"; this redirect is a defensive fallback.
  const { data: claims } = await supabase.auth.getClaims();
  const viewerId = claims?.claims.sub ?? null;
  if (!viewerId) redirect("/login?next=/notifications");

  const items = await listNotifications(
    supabase,
    viewerId,
    NOTIFICATIONS_PAGE_SIZE,
  );
  const unread = items.filter((n) => n.read_at == null).length;

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 [background:radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--color-brand-gold)_10%,transparent)_0%,transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight sm:text-6xl">
              Notifications
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Everything that happened while you were watching something else.
            </p>
          </div>
          <FrameTag>
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </FrameTag>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-10 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
              <BellIcon className="size-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl tracking-tight">
              Nothing here yet.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Follow people, join discussions, or take the CinePersona test —
              notifications will show up once activity starts.
            </p>
          </div>
        ) : (
          <NotificationsList initialItems={items} initialUnread={unread} />
        )}
      </div>
    </div>
  );
}
