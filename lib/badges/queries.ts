import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  CATEGORY_TITLES,
  TIER_ORDER,
  type Achievement,
  type AchievementCategory,
  type AchievementWithStatus,
  type CategorySection,
} from "./types";

type Supabase = SupabaseClient;

export async function listAchievements(
  supabase: Supabase,
): Promise<Achievement[]> {
  const { data } = await supabase
    .from("achievements")
    .select(
      "id, code, category, tier, name, requirement, requirement_label, secret, sort_order",
    )
    .order("sort_order", { ascending: true });
  return (data ?? []) as Achievement[];
}

export async function getUnlockedSet(
  supabase: Supabase,
  userId: string,
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  const { data } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", userId);
  for (const r of (data ?? []) as {
    achievement_id: number;
    unlocked_at: string;
  }[]) {
    result.set(r.achievement_id, r.unlocked_at);
  }
  return result;
}

export async function getAchievementsForUser(
  supabase: Supabase,
  userId: string | null,
  options: { includeSecret?: boolean } = {},
): Promise<{
  sections: CategorySection[];
  unlockedCount: number;
  totalVisible: number;
}> {
  const all = await listAchievements(supabase);
  const unlocked = userId
    ? await getUnlockedSet(supabase, userId)
    : new Map<number, string>();

  const includeSecret = options.includeSecret ?? false;
  const visibleAll = all.filter((a) => {
    if (!a.secret) return true;
    if (includeSecret) return true;
    // For other users / public showcase, show secret rows only when unlocked
    return unlocked.has(a.id);
  });

  const grouped = new Map<AchievementCategory, AchievementWithStatus[]>();
  for (const a of visibleAll) {
    const row: AchievementWithStatus = {
      ...a,
      unlocked: unlocked.has(a.id),
      unlocked_at: unlocked.get(a.id) ?? null,
    };
    if (!grouped.has(a.category)) grouped.set(a.category, []);
    grouped.get(a.category)!.push(row);
  }

  const sections: CategorySection[] = [];
  for (const [category, rows] of grouped.entries()) {
    rows.sort((a, b) => {
      const tierDiff = TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier);
      if (tierDiff !== 0) return tierDiff;
      return a.sort_order - b.sort_order;
    });
    sections.push({
      category,
      title: CATEGORY_TITLES[category],
      rows,
    });
  }
  // Stable category order matches the spec ordering (sort_order on rows
  // was used to seed by category).
  sections.sort((a, b) => {
    const aFirst = a.rows[0]?.sort_order ?? 9999;
    const bFirst = b.rows[0]?.sort_order ?? 9999;
    return aFirst - bFirst;
  });

  const unlockedCount = visibleAll.filter((a) => unlocked.has(a.id)).length;
  return { sections, unlockedCount, totalVisible: visibleAll.length };
}
