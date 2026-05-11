"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { filmPicksQuestions } from "@/lib/cinepersona/film-picks-questions";
import type {
  LikertValue,
  PickSelection,
  TestStateV2,
} from "@/lib/cinepersona/types";

const STORAGE_KEY_V2 = "cinepersona:test:v2";
const STORAGE_KEY_V1 = "cinepersona:test-answers:v1";

function emptyState(): TestStateV2 {
  return { picks: {}, answers: {} };
}

function sanitizeAnswers(raw: unknown): Record<number, LikertValue> {
  const out: Record<number, LikertValue> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number.parseInt(k, 10);
    if (!Number.isFinite(id) || id < 1 || id > 48) continue;
    if (typeof v !== "number" || v < -3 || v > 3 || !Number.isInteger(v))
      continue;
    out[id] = v as LikertValue;
  }
  return out;
}

function sanitizePicks(raw: unknown): Record<number, PickSelection[]> {
  const out: Record<number, PickSelection[]> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const q of filmPicksQuestions) {
    const list = (raw as Record<string, unknown>)[String(q.id)];
    if (!Array.isArray(list)) continue;
    const clean: PickSelection[] = [];
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const sel = item as Partial<PickSelection>;
      if (
        typeof sel.tmdbId !== "number" ||
        typeof sel.title !== "string" ||
        (sel.kind !== "film" && sel.kind !== "person")
      ) {
        continue;
      }
      clean.push({
        questionId: q.id,
        kind: sel.kind,
        tmdbId: sel.tmdbId,
        title: sel.title,
        posterPath:
          typeof sel.posterPath === "string" ? sel.posterPath : null,
      });
      if (clean.length >= q.maxSelections) break;
    }
    if (clean.length > 0) out[q.id] = clean;
  }
  return out;
}

function readStorage(): TestStateV2 {
  try {
    const v2 = localStorage.getItem(STORAGE_KEY_V2);
    if (v2) {
      const parsed = JSON.parse(v2) as Partial<TestStateV2>;
      return {
        picks: sanitizePicks(parsed.picks),
        answers: sanitizeAnswers(parsed.answers),
      };
    }
    // Migrate v1 (answers-only).
    const v1 = localStorage.getItem(STORAGE_KEY_V1);
    if (v1) {
      const parsed = JSON.parse(v1);
      const migrated: TestStateV2 = {
        picks: {},
        answers: sanitizeAnswers(parsed),
      };
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      localStorage.removeItem(STORAGE_KEY_V1);
      return migrated;
    }
  } catch {
    // Unreadable storage — fall through to empty state.
  }
  return emptyState();
}

export function useCineTestState() {
  const [state, setState] = useState<TestStateV2>(emptyState);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readStorage());
    setHydrated(true);
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
    } catch {
      // Quota / private mode — stay in memory.
    }
  }, [state]);

  const setAnswer = useCallback((id: number, value: LikertValue) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [id]: value },
    }));
  }, []);

  const togglePick = useCallback(
    (questionId: number, selection: PickSelection, max: number) => {
      setState((prev) => {
        const list = prev.picks[questionId] ?? [];
        const idx = list.findIndex((p) => p.tmdbId === selection.tmdbId);

        if (idx < 0) {
          // Reject if this item is already used in *another* question of
          // the same kind — picks must be unique across questions.
          for (const [qid, others] of Object.entries(prev.picks)) {
            if (Number.parseInt(qid, 10) === questionId) continue;
            if (
              others.some(
                (p) =>
                  p.kind === selection.kind && p.tmdbId === selection.tmdbId,
              )
            ) {
              return prev;
            }
          }
        }

        let next: PickSelection[];
        if (idx >= 0) {
          next = list.filter((_, i) => i !== idx);
        } else if (max === 1) {
          next = [selection];
        } else if (list.length >= max) {
          // At cap — replace the oldest selection.
          next = [...list.slice(1), selection];
        } else {
          next = [...list, selection];
        }
        return {
          ...prev,
          picks: { ...prev.picks, [questionId]: next },
        };
      });
    },
    [],
  );

  const setPicks = useCallback(
    (questionId: number, picks: PickSelection[]) => {
      setState((prev) => ({
        ...prev,
        picks: { ...prev.picks, [questionId]: picks },
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState(emptyState());
    try {
      localStorage.removeItem(STORAGE_KEY_V2);
    } catch {
      // ignore
    }
  }, []);

  return {
    state,
    hydrated,
    setAnswer,
    togglePick,
    setPicks,
    reset,
  };
}

export { STORAGE_KEY_V2 };
