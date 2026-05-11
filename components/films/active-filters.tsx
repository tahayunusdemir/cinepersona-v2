"use client";

import Link from "next/link";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GENRES } from "@/lib/films/genres";
import {
  LANGUAGES,
  RATING_LABELS,
  SORT_LABELS,
  VOTE_LABELS,
} from "@/lib/films/types";
import {
  isFiltered,
  serializeSearchParams,
} from "@/lib/films/search-params";
import type { FilmsSearchParams } from "@/lib/films/types";

type Props = {
  params: FilmsSearchParams;
};

export function ActiveFilters({ params }: Props) {
  if (!isFiltered(params)) return null;

  const chips: { key: string; label: string; href: string }[] = [];

  if (params.q) {
    chips.push({
      key: "q",
      label: `“${params.q}”`,
      href: `/films${serializeSearchParams({ ...params, q: "", page: 1 })}`,
    });
  }

  if (params.sort !== "popular") {
    chips.push({
      key: "sort",
      label: `Sort: ${SORT_LABELS[params.sort]}`,
      href: `/films${serializeSearchParams({ ...params, sort: "popular", page: 1 })}`,
    });
  }

  for (const id of params.genre) {
    const name = GENRES.find((g) => g.id === id)?.name ?? `Genre ${id}`;
    chips.push({
      key: `genre-${id}`,
      label: name,
      href: `/films${serializeSearchParams({
        ...params,
        genre: params.genre.filter((g) => g !== id),
        page: 1,
      })}`,
    });
  }

  if (params.decade) {
    chips.push({
      key: "decade",
      label: `${params.decade}s`,
      href: `/films${serializeSearchParams({ ...params, decade: null, page: 1 })}`,
    });
  }

  if (params.lang) {
    const name = LANGUAGES.find((l) => l.code === params.lang)?.label ?? params.lang;
    chips.push({
      key: "lang",
      label: name,
      href: `/films${serializeSearchParams({ ...params, lang: null, page: 1 })}`,
    });
  }

  if (params.rating) {
    chips.push({
      key: "rating",
      label: `Rating ${RATING_LABELS[params.rating]}`,
      href: `/films${serializeSearchParams({ ...params, rating: null, page: 1 })}`,
    });
  }

  if (params.votes) {
    chips.push({
      key: "votes",
      label: VOTE_LABELS[params.votes],
      href: `/films${serializeSearchParams({ ...params, votes: null, page: 1 })}`,
    });
  }

  const clearAllHref = `/films${serializeSearchParams({ view: params.view })}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex"
        >
          <Badge
            variant="secondary"
            className="gap-1 hover:bg-secondary/80"
          >
            <span>{chip.label}</span>
            <XIcon className="size-3" aria-hidden />
          </Badge>
        </Link>
      ))}
      <Link
        href={clearAllHref}
        className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}
