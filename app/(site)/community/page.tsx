import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { BoardIcon } from "@/components/community/board-icon";
import {
  getViewerId,
  listBoards,
  listThreads,
} from "@/lib/community/queries";
import { createClient } from "@/lib/supabase/server";
import { familyAt } from "@/lib/ui-tokens";

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

      <header className="mb-10">
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
          Community
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Pick a board to dive in, or browse the directory of members.
        </p>
      </header>

      {hot.rows.length > 0 ? (
        <section className="mb-12">
          <div className="mb-4 flex items-baseline gap-3">
            <FrameTag>Hot today</FrameTag>
            <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
          </div>
          <ul className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
            {hot.rows.map((t, i) => {
              const hue = familyAt(i);
              return (
                <li
                  key={t.id}
                  className="border-b border-foreground/5 last:border-b-0"
                >
                  <Link
                    href={`/community/${t.board.slug}/${t.id}`}
                    className="group relative flex items-center gap-4 px-4 py-4 transition-colors hover:bg-foreground/[0.03] sm:px-5"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full"
                      style={{ background: hue }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          {t.board.name}
                        </span>
                      </div>
                      <h3 className="mt-1.5 line-clamp-1 font-display text-base leading-snug">
                        {t.title}
                      </h3>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        ▲ {t.score} · {t.comment_count}{" "}
                        {t.comment_count === 1 ? "comment" : "comments"}
                      </p>
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex items-baseline gap-3">
          <FrameTag>Boards</FrameTag>
          <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
        </div>
        <ul className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
          {boards.map((b, i) => {
            const hue = familyAt(i);
            return (
              <li
                key={b.id}
                className="border-b border-foreground/5 last:border-b-0"
              >
                <Link
                  href={`/community/${b.slug}`}
                  className="group relative flex items-center gap-4 px-4 py-4 transition-colors hover:bg-foreground/[0.03] sm:px-5 sm:py-5"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full"
                    style={{ background: hue }}
                  />
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl border"
                    style={{
                      borderColor: `${hue}40`,
                      background: `${hue}1a`,
                      color: hue,
                    }}
                  >
                    <BoardIcon slug={b.slug} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg leading-tight tracking-tight">
                        {b.name}
                      </h3>
                      {b.locked ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                          <LockIcon className="size-3" /> Locked
                        </span>
                      ) : null}
                    </div>
                    {b.description ? (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {b.description}
                      </p>
                    ) : null}
                  </div>
                  <ArrowRight
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    style={{ color: hue }}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
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
