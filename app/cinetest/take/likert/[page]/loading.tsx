export default function LikertLoading() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex gap-2">
          <span className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <span className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        <span className="block h-8 w-2/3 animate-pulse rounded bg-muted" />
        <span className="block h-4 w-5/6 animate-pulse rounded bg-muted/70" />
      </header>

      <ol className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="space-y-4 rounded-lg border border-border/60 p-4 sm:p-5"
          >
            <span className="block h-3 w-20 animate-pulse rounded bg-muted" />
            <span className="block h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((__, j) => (
                <span
                  key={j}
                  className="h-9 animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
