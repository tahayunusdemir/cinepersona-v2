// Static diagram of the 7-point scale. Circle sizes grow toward the poles so
// the scale shape is legible without showing a real prompt — this is meant to
// read as an illustration, not the real test screen.
const SCALE = [
  { size: 14, strong: true },
  { size: 11, strong: false },
  { size: 8, strong: false },
  { size: 6, strong: false },
  { size: 8, strong: false },
  { size: 11, strong: false, selected: true },
  { size: 14, strong: true },
];

export function SampleLikert() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full max-w-xs items-center justify-between gap-2">
        {SCALE.map((dot, i) => (
          <span
            key={i}
            aria-hidden
            style={{ width: dot.size, height: dot.size }}
            className={
              dot.selected
                ? "rounded-full bg-[#ecb756] ring-2 ring-[#ecb756]/30 ring-offset-2 ring-offset-background"
                : dot.strong
                ? "rounded-full border border-foreground/40 bg-foreground/10"
                : "rounded-full border border-foreground/25 bg-foreground/5"
            }
          />
        ))}
      </div>
      <div className="flex w-full max-w-xs justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Disagree</span>
        <span>Neutral</span>
        <span>Agree</span>
      </div>
      <p className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        Bigger circles · stronger conviction
      </p>
    </div>
  );
}
