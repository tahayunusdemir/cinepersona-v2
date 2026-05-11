// Friends — domain types.
//
// Symmetric pair (user_a < user_b) with a requester. Status flows
// pending → accepted; either party can delete to remove/decline at any time.
// Messaging unlocks the moment status = 'accepted' (no consent step, unlike
// CineMatch).

export type FriendshipStatus = "pending" | "accepted";

export type FriendshipRow = {
  id: string;
  user_a: string;
  user_b: string;
  requester_id: string;
  status: FriendshipStatus;
  created_at: string;
  accepted_at: string | null;
};

export type FriendPartner = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

// Viewer-relative view of a friendship row.
export type FriendshipView = {
  id: string;
  status: FriendshipStatus;
  created_at: string;
  accepted_at: string | null;
  partner: FriendPartner;
  // Direction relative to the viewer.
  viewer_is_requester: boolean;
};

export type FriendshipState =
  | { kind: "none" }
  | { kind: "pending_outgoing"; id: string }
  | { kind: "pending_incoming"; id: string }
  | { kind: "accepted"; id: string };

export type FriendMessage = {
  id: string;
  friendship_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export const FRIEND_MESSAGE_MAX_LEN = 2000;
export const FRIEND_MESSAGE_RATE_PER_MIN = 30;
