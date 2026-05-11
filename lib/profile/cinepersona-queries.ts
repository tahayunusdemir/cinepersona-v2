import { cache } from "react";

import type { DisplayPick } from "@/components/cinepersona/picks-display";
import { createClient } from "@/lib/supabase/server";

export type ProfileCinePersona = {
  resultId: string;
  typeCode: string;
  axisPercents: [number, number, number, number]; // axis 1..4 primary share
  createdAt: string;
  picks: DisplayPick[];
  picksVisible: boolean;
};

export const getCinePersonaForUser = cache(_getCinePersonaForUser);

async function _getCinePersonaForUser(
  userId: string,
  viewerId: string | null,
): Promise<ProfileCinePersona | null> {
  const supabase = await createClient();

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("cinepersona_picks_visible")
    .eq("id", userId)
    .maybeSingle();
  const picksVisible: boolean =
    profileRow?.cinepersona_picks_visible !== false; // default true

  const { data: result, error } = await supabase
    .from("cp_results")
    .select(
      "id, type_code, axis_1_pct, axis_2_pct, axis_3_pct, axis_4_pct, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !result) return null;

  const isSelf = viewerId === userId;
  const canSeePicks = isSelf || picksVisible;

  let picks: DisplayPick[] = [];
  if (canSeePicks) {
    const { data: pickRows } = await supabase
      .from("cp_result_picks")
      .select(
        "question_id, kind, movie_id, tmdb_person_id, title_snapshot, poster_path_snapshot, sort_order, movies (tmdb_id)",
      )
      .eq("result_id", result.id)
      .order("question_id", { ascending: true })
      .order("sort_order", { ascending: true });

    picks = (pickRows ?? []).map((row) => {
      const r = row as unknown as {
        question_id: number;
        kind: "film" | "person";
        movie_id: number | null;
        tmdb_person_id: number | null;
        title_snapshot: string;
        poster_path_snapshot: string | null;
        sort_order: number;
        movies?: { tmdb_id: number } | null;
      };
      return {
        questionId: r.question_id,
        kind: r.kind,
        tmdbId:
          r.kind === "film"
            ? r.movies?.tmdb_id ?? r.movie_id ?? 0
            : r.tmdb_person_id ?? 0,
        title: r.title_snapshot,
        posterPath: r.poster_path_snapshot,
        sortOrder: r.sort_order,
      };
    });
  }

  return {
    resultId: result.id as string,
    typeCode: result.type_code as string,
    axisPercents: [
      result.axis_1_pct as number,
      result.axis_2_pct as number,
      result.axis_3_pct as number,
      result.axis_4_pct as number,
    ],
    createdAt: result.created_at as string,
    picks,
    picksVisible,
  };
}
