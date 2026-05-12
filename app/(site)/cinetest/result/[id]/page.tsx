import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { DisplayPick } from "@/components/cinepersona/picks-display";
import { ResultView } from "@/components/cinepersona/result-view";
import { Badge } from "@/components/ui/badge";
import { questions, type LikertValue } from "@/lib/cinepersona";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

type PageParams = { params: Promise<{ id: string }> };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type StoredResult = {
  id: string;
  type_code: string;
  answers_json: Record<string, number>;
  created_at: string;
};

type StoredPickRow = {
  result_id: string;
  question_id: number;
  question_slug: string;
  kind: "film" | "person";
  movie_id: number | null;
  tmdb_person_id: number | null;
  title_snapshot: string;
  poster_path_snapshot: string | null;
  sort_order: number;
  movies?: { tmdb_id: number } | { tmdb_id: number }[] | null;
};

function pickTmdbId(row: StoredPickRow): number {
  if (row.kind === "person") return row.tmdb_person_id ?? 0;
  const m = row.movies;
  if (Array.isArray(m)) return m[0]?.tmdb_id ?? row.movie_id ?? 0;
  if (m && typeof m === "object") return m.tmdb_id ?? row.movie_id ?? 0;
  return row.movie_id ?? 0;
}

async function loadResult(id: string): Promise<StoredResult | null> {
  if (!UUID_RE.test(id)) return null;
  if (!hasServiceRole()) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cp_results")
    .select("id, type_code, answers_json, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as StoredResult;
}

async function loadPicks(resultId: string): Promise<DisplayPick[]> {
  if (!hasServiceRole()) return [];
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cp_result_picks")
    .select(
      "result_id, question_id, question_slug, kind, movie_id, tmdb_person_id, title_snapshot, poster_path_snapshot, sort_order, movies (tmdb_id)",
    )
    .eq("result_id", resultId)
    .order("question_id", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error || !data) return [];

  return (data as unknown as StoredPickRow[]).map((row) => ({
    questionId: row.question_id,
    kind: row.kind,
    tmdbId: pickTmdbId(row),
    title: row.title_snapshot,
    posterPath: row.poster_path_snapshot,
    sortOrder: row.sort_order,
  }));
}

function answersFromJson(
  raw: Record<string, number> | null | undefined,
): Record<number, LikertValue> | null {
  if (!raw) return null;
  const answers: Record<number, LikertValue> = {};
  for (const q of questions) {
    const v = raw[String(q.id)];
    if (typeof v !== "number" || v < -3 || v > 3) return null;
    answers[q.id] = v as LikertValue;
  }
  return answers;
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { id } = await params;
  const result = await loadResult(id);
  if (!result) return { title: "Result not found" };
  return {
    title: `${result.type_code} — Your CineType`,
    description: "A saved CineType result.",
  };
}

export default async function SavedResultPage({ params }: PageParams) {
  const { id } = await params;
  const stored = await loadResult(id);
  if (!stored) notFound();

  const answers = answersFromJson(stored.answers_json);
  if (!answers) notFound();

  const picks = await loadPicks(stored.id);

  return (
    <ResultView
      answers={answers}
      picks={picks}
      picksHint="Picks were not attached when this result was saved."
      saveSlot={
        <div className="mt-8 flex items-center justify-center">
          <Badge variant="outline">Saved · share this link</Badge>
        </div>
      }
    />
  );
}
