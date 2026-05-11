import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilmIcon } from "lucide-react";

import { ProfileFilmsGrid } from "@/components/profile/profile-films-grid";
import { getProfileFilms } from "@/lib/profile/films-queries";
import { getProfileByUsername } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PAGE_SIZE = 48;

export async function generateMetadata({
  params,
}: PageProps<"/[username]/films">): Promise<Metadata> {
  const { username } = await params;
  return { title: `Films · @${username}` };
}

export default async function FilmsPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: SearchParams;
}) {
  const [{ username }, raw] = await Promise.all([params, searchParams]);
  const result = await getProfileByUsername(username);
  if (result.kind !== "ok") notFound();

  const pageParam = Number(Array.isArray(raw.page) ? raw.page[0] : raw.page);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const { rows, total, pageCount } = await getProfileFilms({
    ownerId: result.profile.id,
    status: "watched",
    page,
    pageSize: PAGE_SIZE,
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = Boolean(user);
  const basePath = `/${result.profile.username}/films`;
  const loginHref = `/login?next=${encodeURIComponent(basePath)}`;

  return (
    <ProfileFilmsGrid
      rows={rows}
      total={total}
      page={page}
      pageCount={pageCount}
      basePath={basePath}
      isAuthed={isAuthed}
      loginHref={loginHref}
      emptyIcon={FilmIcon}
      emptyTitle="No watched films yet"
      emptyDescription={
        result.profile.isSelf
          ? "Films you mark as watched will appear here. Head to Films to start tracking."
          : `@${result.profile.username} hasn't logged any watched films yet.`
      }
    />
  );
}
