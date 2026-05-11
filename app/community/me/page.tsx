import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronUpIcon, MessageSquareIcon } from "lucide-react";

import { RelativeTime } from "@/components/community/relative-time";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { plainTextExcerpt } from "@/lib/community/markdown";
import { getViewerProfile } from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My activity",
  robots: { index: false },
};

type CommentRow = {
  id: string;
  thread_id: string;
  body: string;
  created_at: string;
  thread: { id: string; title: string; board: { slug: string; name: string } };
};

type ThreadRow = {
  id: string;
  title: string;
  board: { slug: string; name: string };
};

type VoteRow = {
  target_id: string;
  value: number;
  created_at: string;
};

export default async function MeActivityPage() {
  const supabase = await createClient();
  const viewer = await getViewerProfile(supabase);
  if (!viewer) redirect("/login?next=/community/me");

  const { data: comments } = await supabase
    .from("comments")
    .select(
      "id, thread_id, body, created_at, thread:threads!inner(id, title, board:boards!inner(slug, name))",
    )
    .eq("author_id", viewer.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(40)
    .returns<CommentRow[]>();

  const { data: votes } = await supabase
    .from("votes")
    .select("target_id, value, created_at")
    .eq("user_id", viewer.id)
    .eq("target_type", "thread")
    .eq("value", 1)
    .order("created_at", { ascending: false })
    .limit(40)
    .returns<VoteRow[]>();

  let upvotedThreads: (ThreadRow & { voted_at: string })[] = [];
  if (votes && votes.length > 0) {
    const ids = votes.map((v) => v.target_id);
    const { data: threads } = await supabase
      .from("threads")
      .select("id, title, board:boards!inner(slug, name)")
      .in("id", ids)
      .is("deleted_at", null)
      .returns<ThreadRow[]>();
    const byId = new Map<string, ThreadRow>(
      (threads ?? []).map((t) => [t.id, t]),
    );
    upvotedThreads = votes
      .map((v) => {
        const t = byId.get(v.target_id);
        return t ? { ...t, voted_at: v.created_at } : null;
      })
      .filter((x): x is ThreadRow & { voted_at: string } => x !== null);
  }

  return (
    <div>
      <header className="mb-6">
        <Link
          href="/community"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Community
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          My activity
        </h1>
        <p className="mt-2 text-base text-muted-foreground sm:text-lg">
          Your latest comments and upvotes.
        </p>
      </header>

      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="comments">
            <MessageSquareIcon /> Comments
          </TabsTrigger>
          <TabsTrigger value="upvotes">
            <ChevronUpIcon /> Upvotes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="mt-4">
          {!comments || comments.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquareIcon />
                </EmptyMedia>
                <EmptyTitle>No comments yet</EmptyTitle>
                <EmptyDescription>
                  Join a thread to start the conversation.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-lg border bg-card p-4 transition-colors hover:bg-card/80"
                >
                  <p className="text-xs text-muted-foreground">
                    On{" "}
                    <Link
                      href={`/community/${c.thread.board.slug}/${c.thread.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {c.thread.title}
                    </Link>{" "}
                    in{" "}
                    <Link
                      href={`/community/${c.thread.board.slug}`}
                      className="hover:text-foreground"
                    >
                      {c.thread.board.name}
                    </Link>{" "}
                    · <RelativeTime date={c.created_at} />
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm">
                    <Link
                      href={`/community/${c.thread.board.slug}/${c.thread.id}#comment-${c.id}`}
                      className="hover:underline"
                    >
                      {plainTextExcerpt(c.body, 200)}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="upvotes" className="mt-4">
          {upvotedThreads.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ChevronUpIcon />
                </EmptyMedia>
                <EmptyTitle>No upvotes yet</EmptyTitle>
                <EmptyDescription>
                  Upvote threads you find interesting to track them here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="space-y-3">
              {upvotedThreads.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border bg-card p-4 transition-colors hover:bg-card/80"
                >
                  <Link
                    href={`/community/${t.board.slug}/${t.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {t.title}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.board.name} · upvoted <RelativeTime date={t.voted_at} />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
