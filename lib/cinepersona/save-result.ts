"use server";

import { z } from "zod";

import { filmPicksQuestions } from "./film-picks-questions";
import { questions } from "./questions";
import { scoreTest } from "./scoring";
import type { LikertValue } from "./types";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const answerSchema = z
  .object({})
  .catchall(z.number().int().gte(-3).lte(3))
  .refine((obj) => Object.keys(obj).length === questions.length, {
    message: "Answers must cover all questions.",
  });

export type SaveResultState =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function saveResultAction(
  raw: Record<string, number>,
): Promise<SaveResultState> {
  const parsed = answerSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "invalid_answers" };
  }

  const answers: Record<number, LikertValue> = {};
  for (const q of questions) {
    const value = parsed.data[String(q.id)];
    if (value === undefined) {
      return { ok: false, error: "invalid_answers" };
    }
    answers[q.id] = value as LikertValue;
  }

  const result = scoreTest(answers);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("cp_results")
    .insert({
      user_id: user?.id ?? null,
      type_code: result.code,
      axis_1_pct: result.axes[0].primaryPct,
      axis_2_pct: result.axes[1].primaryPct,
      axis_3_pct: result.axes[2].primaryPct,
      axis_4_pct: result.axes[3].primaryPct,
      answers_json: answers,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: "save_failed" };
  }
  return { ok: true, id: data.id as string };
}

// -------------------- Picks --------------------

const pickInputSchema = z.object({
  questionId: z.number().int().min(1).max(12),
  questionSlug: z.string().min(1).max(64),
  kind: z.enum(["film", "person"]),
  tmdbId: z.number().int().positive(),
  title: z.string().min(1).max(255),
  posterPath: z.string().nullable(),
  sortOrder: z.number().int().min(0).max(20),
});

const picksPayloadSchema = z.array(pickInputSchema).max(48);

export type SavePicksState = { ok: true } | { ok: false; error: string };

const SLUG_BY_ID = new Map(filmPicksQuestions.map((q) => [q.id, q.slug]));

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function savePicksAction(
  resultId: string,
  picks: unknown,
): Promise<SavePicksState> {
  if (!UUID_RE.test(resultId)) {
    return { ok: false, error: "invalid_result" };
  }
  const parsed = picksPayloadSchema.safeParse(picks);
  if (!parsed.success) {
    return { ok: false, error: "invalid_picks" };
  }

  // Enforce min/max per question.
  const grouped = new Map<number, typeof parsed.data>();
  // Track (kind, tmdbId) across all picks — must be unique across questions.
  const seen = new Map<string, number>(); // "kind:tmdbId" → questionId
  for (const pick of parsed.data) {
    const slug = SLUG_BY_ID.get(pick.questionId);
    if (!slug || slug !== pick.questionSlug) {
      return { ok: false, error: "invalid_picks" };
    }
    const key = `${pick.kind}:${pick.tmdbId}`;
    const prev = seen.get(key);
    if (prev !== undefined && prev !== pick.questionId) {
      return { ok: false, error: "duplicate_pick" };
    }
    seen.set(key, pick.questionId);
    const arr = grouped.get(pick.questionId) ?? [];
    arr.push(pick);
    grouped.set(pick.questionId, arr);
  }
  for (const q of filmPicksQuestions) {
    const list = grouped.get(q.id) ?? [];
    if (list.length < q.minSelections || list.length > q.maxSelections) {
      return { ok: false, error: "invalid_picks" };
    }
    // Disallow mixed kinds within a question.
    if (list.some((p) => p.kind !== q.kind)) {
      return { ok: false, error: "invalid_picks" };
    }
  }

  if (!hasServiceRole()) {
    return { ok: false, error: "no_service_role" };
  }
  const admin = createAdminClient();

  // Resolve tmdb_id → movies.id for film picks. People are stored as raw
  // tmdb_person_id; no local mirror yet.
  const filmTmdbIds = Array.from(
    new Set(
      parsed.data.filter((p) => p.kind === "film").map((p) => p.tmdbId),
    ),
  );
  const movieIdMap = new Map<number, number>();
  if (filmTmdbIds.length > 0) {
    const { data: rows, error } = await admin
      .from("movies")
      .select("id, tmdb_id")
      .in("tmdb_id", filmTmdbIds);
    if (error) {
      return { ok: false, error: "save_failed" };
    }
    for (const row of rows ?? []) {
      movieIdMap.set(row.tmdb_id as number, row.id as number);
    }
  }

  // Any film picks not yet cached? Skip those (the lazy-cache should
  // already have inserted them during search). If anything is still
  // missing, fail loudly rather than write an inconsistent row.
  for (const pick of parsed.data) {
    if (pick.kind !== "film") continue;
    if (!movieIdMap.has(pick.tmdbId)) {
      return { ok: false, error: "movie_not_cached" };
    }
  }

  const rows = parsed.data.map((p) => ({
    result_id: resultId,
    question_id: p.questionId,
    question_slug: p.questionSlug,
    kind: p.kind,
    movie_id: p.kind === "film" ? movieIdMap.get(p.tmdbId) ?? null : null,
    tmdb_person_id: p.kind === "person" ? p.tmdbId : null,
    title_snapshot: p.title,
    poster_path_snapshot: p.posterPath,
    sort_order: p.sortOrder,
  }));

  // Replace any prior picks for this result (idempotent re-submit).
  const { error: delErr } = await admin
    .from("cp_result_picks")
    .delete()
    .eq("result_id", resultId);
  if (delErr) {
    console.error("savePicksAction delete failed", delErr);
    return { ok: false, error: "save_failed" };
  }

  const { error: insErr } = await admin.from("cp_result_picks").insert(rows);
  if (insErr) {
    console.error(
      "savePicksAction insert failed",
      { message: insErr.message, code: insErr.code, details: insErr.details, hint: insErr.hint },
      { sampleRow: rows[0], rowCount: rows.length },
    );
    return { ok: false, error: "save_failed" };
  }
  return { ok: true };
}
