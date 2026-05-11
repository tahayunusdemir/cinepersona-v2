"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGridIcon, RowsIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { GENRES } from "@/lib/films/genres";
import {
  DECADES,
  LANGUAGES,
  RATING_FLOORS,
  RATING_LABELS,
  SORT_KEYS,
  SORT_LABELS,
  VOTE_FLOORS,
  VOTE_LABELS,
  type FilmsSearchParams,
  type RatingFloor,
  type SortKey,
  type VoteFloor,
} from "@/lib/films/types";
import { serializeSearchParams } from "@/lib/films/search-params";

type Props = {
  params: FilmsSearchParams;
};

export function FilterBar({ params }: Props) {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(patch: Partial<FilmsSearchParams>) {
    const next = serializeSearchParams({ ...params, ...patch, page: 1 });
    router.replace(`/films${next}`, { scroll: false });
  }

  function onSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigate({ q: value });
    }, 300);
  }

  return (
    <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 rounded-md border bg-background/80 p-2 backdrop-blur">
      <SearchField value={params.q} onChange={onSearchChange} />

      <NativeSelect
        aria-label="Sort by"
        value={params.sort}
        onChange={(e) => navigate({ sort: e.target.value as SortKey })}
      >
        {SORT_KEYS.map((key) => (
          <NativeSelectOption key={key} value={key}>
            {SORT_LABELS[key]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <GenrePopover
        selected={params.genre}
        onChange={(ids) => navigate({ genre: ids })}
      />

      <NativeSelect
        aria-label="Decade"
        value={params.decade ?? ""}
        onChange={(e) =>
          navigate({
            decade: e.target.value ? Number(e.target.value) : null,
          })
        }
      >
        <NativeSelectOption value="">All decades</NativeSelectOption>
        {DECADES.map((d) => (
          <NativeSelectOption key={d} value={d}>
            {d}s
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Language"
        value={params.lang ?? ""}
        onChange={(e) => navigate({ lang: e.target.value || null })}
      >
        <NativeSelectOption value="">All languages</NativeSelectOption>
        {LANGUAGES.map((l) => (
          <NativeSelectOption key={l.code} value={l.code}>
            {l.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Minimum rating"
        value={params.rating ?? ""}
        onChange={(e) =>
          navigate({
            rating: e.target.value
              ? (Number(e.target.value) as RatingFloor)
              : null,
          })
        }
      >
        <NativeSelectOption value="">Any rating</NativeSelectOption>
        {RATING_FLOORS.map((r) => (
          <NativeSelectOption key={r} value={r}>
            {RATING_LABELS[r]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Minimum vote count"
        value={params.votes ?? ""}
        onChange={(e) =>
          navigate({
            votes: e.target.value
              ? (Number(e.target.value) as VoteFloor)
              : null,
          })
        }
      >
        <NativeSelectOption value="">Any votes</NativeSelectOption>
        {VOTE_FLOORS.map((v) => (
          <NativeSelectOption key={v} value={v}>
            {VOTE_LABELS[v]}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <div className="ml-auto flex items-center gap-1 rounded-md border p-0.5">
        <ViewButton
          active={params.view === "dense"}
          onClick={() => navigate({ view: "dense" })}
          label="Dense"
          icon={<LayoutGridIcon className="size-4" />}
        />
        <ViewButton
          active={params.view === "large"}
          onClick={() => navigate({ view: "large" })}
          label="Large"
          icon={<RowsIcon className="size-4" />}
        />
      </div>
    </div>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  // Freeze defaultValue to the first render — Base UI warns if it changes.
  const initialValue = useRef(value).current;
  // Sync external resets (Clear all) without clobbering active typing.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.value !== value) {
      el.value = value;
    }
  }, [value]);
  return (
    <div className="relative min-w-0 flex-1 sm:max-w-xs">
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={ref}
        type="search"
        defaultValue={initialValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search films..."
        aria-label="Search films"
        className="h-8 pl-8"
      />
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={
        "inline-flex size-7 items-center justify-center rounded-md transition-colors " +
        (active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground")
      }
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function GenrePopover({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (ids: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedSet = new Set(selected);
  const buttonLabel =
    selected.length === 0
      ? "Genre"
      : selected.length === 1
        ? GENRES.find((g) => g.id === selected[0])?.name ?? "Genre"
        : `${selected.length} genres`;

  function toggle(id: number) {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8">
            {buttonLabel}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-2">
        <div className="flex max-h-72 flex-col gap-1 overflow-auto">
          {GENRES.map((g) => {
            const checked = selectedSet.has(g.id);
            return (
              <label
                key={g.id}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(g.id)}
                />
                <span>{g.name}</span>
              </label>
            );
          })}
        </div>
        {selected.length > 0 ? (
          <div className="mt-2 border-t pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-full justify-center text-xs"
              onClick={() => onChange([])}
            >
              Clear genres
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
