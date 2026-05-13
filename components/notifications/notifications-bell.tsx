import { createClient } from "@/lib/supabase/server";
import {
  countUnreadNotifications,
  listNotifications,
} from "@/lib/notifications/queries";

import { NotificationsBellClient } from "./notifications-bell-client";

export async function NotificationsBell() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return null;

  // Top-10 preview for the popover; the "view all" link routes to a full page.
  const [items, unread] = await Promise.all([
    listNotifications(supabase, userId, 10),
    countUnreadNotifications(supabase, userId),
  ]);

  return <NotificationsBellClient initialItems={items} initialUnread={unread} />;
}
