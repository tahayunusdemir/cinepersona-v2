import type { Metadata } from "next";
import Link from "next/link";
import { LockIcon, MessageSquareIcon, UsersIcon } from "lucide-react";

import { BoardIcon } from "@/components/community/board-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// Render dynamically — viewer-specific data (vote state, blocks, follow
// edges) is woven into the listing, so a shared revalidate cache would
// leak one user's vote highlights to the next visitor.
export const dynamic = "force-dynamic";

export default async function CommunityHomePage() {
  const supabase = await createClient();
  const [boards, hot, viewerId] = await Promise.all([
    listBoards(supabase),
    listThreads(supabase, { sort: "hot", page: 1, pageSize: 5 }),
    getViewerId(supabase),
  ]);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Community
          </h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">
            Pick a board to dive in, or browse the directory of members.
          </p>
        </div>
        <Link
          href="/community/people"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <UsersIcon /> People
        </Link>
      </header>

      {hot.rows.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Hot today
          </h2>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-3">
            {hot.rows.map((t) => (
              <Link
                key={t.id}
                href={`/community/${t.board.slug}/${t.id}`}
                className="block min-w-[260px] snap-start rounded-lg border bg-card p-4 transition-colors hover:bg-card/80 sm:min-w-0"
              >
                <Badge variant="outline" className="mb-2 text-[10px]">
                  {t.board.name}
                </Badge>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                  {t.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  ▲ {t.score} · {t.comment_count}{" "}
                  {t.comment_count === 1 ? "comment" : "comments"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Boards
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((b) => {
            return (
              <Link key={b.id} href={`/community/${b.slug}`} className="group">
                <Card className="h-full transition-colors group-hover:bg-card/80">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
                        <BoardIcon slug={b.slug} className="size-4" />
                      </span>
                      {b.locked ? (
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <LockIcon className="size-3" /> Locked
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-base">{b.name}</CardTitle>
                    {b.description ? (
                      <CardDescription className="line-clamp-2">
                        {b.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquareIcon className="size-3.5" />
                    Open board →
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {viewerId ? null : (
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/login" className="underline-offset-4 hover:underline">
            Sign in
          </Link>{" "}
          to comment, vote, and follow other members.
        </p>
      )}
    </div>
  );
}
