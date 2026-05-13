// Notifications — domain types.
//
// One row per actionable event for a single recipient. Triggers fan in from
// follows / friendships / friend_messages / matches / match_messages / votes
// and dedup on (user_id, type, entity_type, entity_id, actor_id). See
// supabase/11_notifications.sql for the source of truth.

export type NotificationType =
  | "follow"
  | "friend_request"
  | "friend_accept"
  | "friend_message"
  | "match_created"
  | "match_message"
  | "thread_upvote"
  | "comment_upvote";

export type NotificationActor = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: NotificationType;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export type NotificationView = NotificationRow & {
  actor: NotificationActor | null;
  /** Where the bell row should link when clicked. May be null for orphan rows. */
  href: string | null;
  /** Plain-language summary, English; renders inline in the bell list. */
  summary: string;
};

export const NOTIFICATIONS_PAGE_SIZE = 30;
