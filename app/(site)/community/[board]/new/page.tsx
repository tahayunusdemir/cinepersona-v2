import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { ThreadForm } from "@/components/community/thread-form";
import {
  getBoardBySlug,
  getViewerProfile,
} from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New thread",
  robots: { index: false },
};

type Params = { board: string };

export default async function NewThreadPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { board: slug } = await params;
  const supabase = await createClient();
  const board = await getBoardBySlug(supabase, slug);
  if (!board) notFound();

  const viewer = await getViewerProfile(supabase);
  if (!viewer) {
    redirect(`/login?next=${encodeURIComponent(`/community/${slug}/new`)}`);
  }
  if (board.locked) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <Link
          href={`/community/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {board.name}
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          New thread
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Posting in <span className="font-medium">{board.name}</span>.
        </p>
      </div>
      <ThreadForm mode="create" boardSlug={slug} />
    </div>
  );
}
