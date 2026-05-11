import { cn } from "@/lib/utils";

type Props = {
  count?: number;
  variant?: "film" | "person";
};

// Matches the grid layout used in <PicksStep />:
//   grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6
// Each cell is a 2:3 poster (film) or a 2:3 portrait + name strip (person).
export function PickGridSkeleton({ count = 18, variant = "film" }: Props) {
  return (
    <ul
      aria-hidden
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <li key={idx}>
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-md bg-muted ring-1 ring-border/40",
            )}
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden">
              <span
                className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/10 to-muted"
                style={{ animationDelay: `${(idx % 6) * 80}ms` }}
              />
            </div>
            {variant === "person" ? (
              <div className="space-y-1 px-2 py-2">
                <span className="block h-3 w-3/4 animate-pulse rounded bg-muted-foreground/20" />
                <span className="block h-2 w-1/2 animate-pulse rounded bg-muted-foreground/15" />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
