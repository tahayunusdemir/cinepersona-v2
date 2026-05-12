import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ThreadForm } from "@/components/community/thread-form";
import {
  getBoardBySlug,
  getThread,
  getViewerProfile,
} from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit thread",
  robots: { index: false },
};

type Params = { board: string; threadId: string };

export default async function EditThreadPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { board: slug, threadId } = await params;
  const supabase = await createClient();

  const [board, thread, viewer] = await Promise.all([
    getBoardBySlug(supabase, slug),
    getThread(supabase, threadId),
    getViewerProfile(supabase),
  ]);

  if (!board || !thread || thread.board.slug !== slug) notFound();
  if (!viewer)
    redirect(
      `/login?next=${encodeURIComponent(`/community/${slug}/${threadId}/edit`)}`,
    );
  if (viewer.id !== thread.author_id) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Link
          href={`/community/${slug}/${threadId}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to thread
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          Edit thread
        </h1>
      </div>
      <ThreadForm
        mode="edit"
        boardSlug={slug}
        threadId={thread.id}
        defaultTitle={thread.title}
        defaultBody={thread.body}
      />
    </div>
  );
}
