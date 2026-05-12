import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockIcon, UsersIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { BoardIcon } from "@/components/community/board-icon";
import { buttonVariants } from "@/components/ui/button";
import {
  getViewerId,
  listBoards,
  listThreads,
} from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Discuss films, TV, and franchises with the CinePersona community.",
};

export const dynamic = "force-dynamic";

export default async function CommunityHomePage() {
  const supabase = await createClient();
  const [boards, hot, viewerId] = await Promise.all([
    listBoards(supabase),
    listThreads(supabase, { sort: "hot", page: 1, pageSize: 5 }),
    getViewerId(supabase),
  ]);

  return (
    <div className="relative isolate">

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
            Community.
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Pick a board to dive in, or browse the directory of members.
          </p>
        </div>
        <Link
          href="/community/people"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 rounded-full border-foreground/15 bg-foreground/[0.02] hover:bg-foreground/[0.06]",
          )}
        >
          <UsersIcon /> People
        </Link>
      </header>

      {hot.rows.length > 0 ? (
        <section className="mb-12">
          <div className="mb-4 flex items-baseline gap-3">
            <FrameTag>Hot today</FrameTag>
            <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
          </div>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-3">
            {hot.rows.map((t, i) => (
              <Link
                key={t.id}
                href={`/community/${t.board.slug}/${t.id}`}
                className="group relative block min-w-[260px] snap-start overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-5 transition-all hover:border-[#ecb756]/40 sm:min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.board.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 line-clamp-2 font-display text-base leading-snug">
                  {t.title}
                </h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  ▲ {t.score} · {t.comment_count}{" "}
                  {t.comment_count === 1 ? "comment" : "comments"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-baseline gap-3">
          <FrameTag>Boards</FrameTag>
          <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => (
            <Link
              key={b.id}
              href={`/community/${b.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-5 transition-all hover:border-[#ecb756]/40"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="grid size-10 place-items-center rounded-xl border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
                  <BoardIcon slug={b.slug} className="size-4" />
                </span>
                {b.locked ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <LockIcon className="size-3" /> Locked
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 font-display text-lg leading-tight tracking-tight">
                {b.name}
              </h3>
              {b.description ? (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {b.description}
                </p>
              ) : null}
              <p className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-[#ecb756]">
                Open board
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {viewerId ? null : (
        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link href="/login" className="underline-offset-4 hover:text-[#ecb756] hover:underline">
            Sign in
          </Link>{" "}
          to comment, vote, and follow other members
        </p>
      )}
    </div>
  );
}
