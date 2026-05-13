// Abstract result preview — a placeholder 4-letter code and four mini axis
// bars. No quote, no name, no badges; meant to evoke the shape of the result
// page rather than mimic it.
const BARS = [
  { left: "E", right: "D", pct: 72 },
  { left: "S", right: "L", pct: 65 },
  { left: "A", right: "I", pct: 58 },
  { left: "C", right: "W", pct: 80 },
];

export function SampleResult() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-4xl font-semibold tracking-tight sm:text-5xl">
          ????
        </span>
      </div>
      <ul className="w-full max-w-xs space-y-2">
        {BARS.map((bar, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {bar.left}
            </span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 rounded-full bg-[#ecb756]/70"
                style={{ width: `${bar.pct}%` }}
              />
            </span>
            <span className="w-3 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
              {bar.right}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        4 letters · 4 axes · 1 of 16 types
      </p>
    </div>
  );
}
