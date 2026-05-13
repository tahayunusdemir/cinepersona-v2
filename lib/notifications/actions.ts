"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type NotificationActionResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "unknown"; message?: string };

async function requireUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// Mark a single notification as read. Idempotent — re-marking is a no-op.
export async function markNotificationRead(
  notificationId: string,
): Promise<NotificationActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", user.id)
    .is("read_at", null);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/notifications");
  return { ok: true };
}

// Mark every unread notification for the viewer as read.
export async function markAllNotificationsRead(): Promise<NotificationActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("read_at", null);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/notifications");
  return { ok: true };
}

// Remove a single notification from the viewer's feed.
export async function deleteNotification(
  notificationId: string,
): Promise<NotificationActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/notifications");
  return { ok: true };
}
