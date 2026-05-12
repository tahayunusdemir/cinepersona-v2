/**
 * Cinematic loading primitives — film-reel spinner, sprocketed strips,
 * projector beam, and full-page screening loaders.
 *
 * Pure CSS / SVG — no client JS. Used inside route loading.tsx files.
 */

import { cn } from "@/lib/utils";

const FAMILY = ["#ecb756", "#c8a4ff", "#ff9a76", "#7fd1ff"] as const;

/* ------------------------------------------------------------------ */
/*  FilmReel — two concentric spinning reels, gold tape unspooling.    */
/* ------------------------------------------------------------------ */

export function FilmReel({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const stroke = "#ecb756";
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* outer breath glow */}
      <span
        className="absolute -inset-3 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(circle, ${stroke}55, transparent 70%)` }}
      />
      {/* outer reel */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 animate-[spin_3.6s_linear_infinite]"
      >
        <circle cx="50" cy="50" r="46" fill="none" stroke={stroke} strokeOpacity="0.18" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="46" fill="none" stroke={stroke} strokeWidth="1.4" strokeDasharray="6 14" strokeLinecap="round" />
        {/* sprocket holes around the rim */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = 50 + Math.cos(a) * 38;
          const y = 50 + Math.sin(a) * 38;
          return <circle key={i} cx={x} cy={y} r="2.4" fill="currentColor" opacity="0.35" />;
        })}
        <circle cx="50" cy="50" r="6" fill={stroke} />
        <circle cx="50" cy="50" r="2" fill="#1a1840" />
      </svg>
      {/* counter-spinning inner reel */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-3 animate-[spin_2.2s_linear_infinite_reverse]"
      >
        <circle cx="50" cy="50" r="36" fill="none" stroke={stroke} strokeOpacity="0.22" strokeWidth="1" />
        <path d="M50 14 A36 36 0 0 1 86 50" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SprocketStrip — perforated film edge that scrolls horizontally.    */
/* ------------------------------------------------------------------ */

export function SprocketStrip({
  className,
  height = 16,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden border-y border-foreground/10 bg-foreground/[0.04]",
        className,
      )}
      style={{ height }}
    >
      <div
        className="absolute inset-0 animate-[cinepersona-strip_5.5s_linear_infinite]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8px 50%, rgba(0,0,0,0.55) 0 3px, transparent 3.5px)",
          backgroundSize: "16px 100%",
          backgroundRepeat: "repeat-x",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shimmer — accessible content placeholder used inside skeletons.    */
/*  Drop-in replacement for shadcn <Skeleton>; we keep our own for     */
/*  consistent treatment in cinematic loaders.                          */
/* ------------------------------------------------------------------ */

export function Shimmer({
  className,
  rounded = "rounded-md",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "block bg-foreground/[0.06]",
        rounded,
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-foreground/[0.07] before:to-transparent",
        "before:animate-[cinepersona-shimmer_1.6s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  ScreeningLoader — full-screen "now showing" projector load state.  */
/* ------------------------------------------------------------------ */

export function ScreeningLoader({
  label = "Loading reel",
  caption,
  minHeight = "70dvh",
}: {
  label?: string;
  caption?: string;
  minHeight?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative isolate flex w-full items-center justify-center overflow-hidden bg-background"
      style={{ minHeight }}
    >
      <span className="sr-only">Loading…</span>

      {/* projector beam — soft animated cone behind the reel */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% 50%, #ecb75644 0%, #ecb75618 35%, transparent 70%)",
          animation: "cinepersona-bloom 6s ease-in-out infinite",
        }}
      />

      {/* sprocket strips top + bottom — frame the screen */}
      <SprocketStrip className="absolute inset-x-0 top-0" />
      <SprocketStrip className="absolute inset-x-0 bottom-0" />

      {/* corner family-color marks (AUT/VIS/CON/ESC) */}
      <div className="pointer-events-none absolute inset-6 flex flex-wrap content-between justify-between text-foreground/40">
        {FAMILY.map((c, i) => (
          <span
            key={i}
            className="font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: `${c}` }}
          >
            <span className="mr-2 inline-block size-1.5 -translate-y-[2px] rounded-full" style={{ background: c }} />
            {["AUT", "VIS", "CON", "ESC"][i]}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7 text-center">
        <FilmReel size={104} className="text-[#ecb756]" />
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-[22px] tracking-tight text-foreground/90">
            {label}
          </span>
          {caption && (
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              {caption}
            </span>
          )}
        </div>

        {/* progress bar — indeterminate gold tape */}
        <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-foreground/10">
          <span
            className="absolute inset-y-0 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-[#ecb756] to-transparent"
            style={{ animation: "cinepersona-tape 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>
    </div>
  );
}
