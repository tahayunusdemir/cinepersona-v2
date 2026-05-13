import { CheckIcon, FilmIcon } from "lucide-react";

// Abstract diagram of the picks step — four poster slots, a couple "filled" —
// so it reads as an illustration of the flow, not a replica of the real screen.
const SLOTS = [
  { filled: true },
  { filled: true },
  { filled: false },
  { filled: false },
];

export function SamplePicks() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ul className="grid grid-cols-4 gap-2 sm:gap-3">
        {SLOTS.map((slot, idx) => (
          <li
            key={idx}
            className={
              slot.filled
                ? "relative flex aspect-[2/3] items-center justify-center rounded-md border bg-gradient-to-br from-[#ecb756]/25 to-[#ecb756]/5"
                : "relative flex aspect-[2/3] items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/20"
            }
          >
            {slot.filled ? (
              <CheckIcon
                aria-hidden
                className="size-5 text-[#ecb756]"
              />
            ) : (
              <FilmIcon
                aria-hidden
                className="size-4 text-muted-foreground/50"
              />
            )}
          </li>
        ))}
      </ul>
      <p className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        Four favourites · personalises matches only
      </p>
    </div>
  );
}
