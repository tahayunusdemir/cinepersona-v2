export type Board = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  locked: boolean;
};

export type Author = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type Thread = {
  id: string;
  board_id: number;
  author_id: string;
  title: string;
  body: string;
  score: number;
  comment_count: number;
  pinned: boolean;
  locked: boolean;
  created_at: string;
  updated_at: string;
};

export type ThreadWithMeta = Thread & {
  board: Pick<Board, "slug" | "name">;
  author: Author | null;
  viewer_vote?: -1 | 0 | 1;
};

export type Comment = {
  id: string;
  thread_id: string;
  author_id: string;
  parent_comment_id: string | null;
  body: string;
  depth: number;
  score: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CommentWithAuthor = Comment & {
  author: Author | null;
  viewer_vote?: -1 | 0 | 1;
};

export type ThreadSort = "hot" | "new" | "top";
export type ThreadRange = "day" | "week" | "month" | "all";
export type CommentSort = "top" | "new";
export type PeopleSort = "popular" | "new" | "active";

export const PAGE_SIZE = 20;

// Next.js search params can arrive as `string | string[] | undefined` —
// repeat keys (e.g. `?sort=a&sort=b`) yield arrays. Page handlers want a
// single value, so collapse to the first element.
export type SearchValue = string | string[] | undefined;

export function firstParam(value: SearchValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
