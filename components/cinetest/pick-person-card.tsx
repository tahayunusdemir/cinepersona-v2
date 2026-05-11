"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckIcon, UserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PickPersonRow } from "@/lib/cinepersona/film-picks-search";

type Props = {
  person: PickPersonRow;
  selected: boolean;
  onSelect: () => void;
  lockedReason?: string;
};

export function PickPersonCard({
  person,
  selected,
  onSelect,
  lockedReason,
}: Props) {
  const locked = Boolean(lockedReason);
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-disabled={locked}
      disabled={locked}
      title={lockedReason}
      aria-label={
        locked
          ? `${person.name} — ${lockedReason}`
          : `${selected ? "Deselect" : "Select"} ${person.name}`
      }
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md bg-muted text-left transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "ring-2 ring-primary"
          : locked
            ? "ring-1 ring-border/40 cursor-not-allowed opacity-50"
            : "ring-1 ring-border/40 hover:ring-foreground/50",
      )}
    >
      <div className="relative aspect-[2/3] w-full">
        {person.profile_path ? (
          <>
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/10 to-muted transition-opacity duration-500",
                imgLoaded ? "opacity-0" : "opacity-100",
              )}
            />
            <Image
              src={`https://image.tmdb.org/t/p/w342${person.profile_path}`}
              alt={`${person.name} portrait`}
              width={220}
              height={330}
              loading="lazy"
              sizes="(max-width: 768px) 33vw, (max-width: 1280px) 18vw, 12vw"
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                imgLoaded ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <UserIcon className="size-7" />
          </div>
        )}
        {selected ? (
          <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <CheckIcon className="size-4" />
          </span>
        ) : null}
        {locked ? (
          <span className="absolute inset-x-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-center text-[10px] font-medium uppercase tracking-wider text-white">
            {lockedReason}
          </span>
        ) : null}
      </div>
      <div className="space-y-0.5 px-2 py-2">
        <p className="line-clamp-1 text-xs font-medium">{person.name}</p>
        {person.known_for_department ? (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {person.known_for_department}
          </p>
        ) : null}
        {person.known_for.length > 0 ? (
          <p className="line-clamp-1 text-[11px] text-muted-foreground">
            {person.known_for.join(" · ")}
          </p>
        ) : null}
      </div>
    </button>
  );
}
