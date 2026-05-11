import { Skeleton } from "@/components/ui/skeleton";

export default function FilmsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-end justify-between gap-4 pb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="mb-4 h-12 w-full rounded-md" />
      <ul
        aria-hidden
        className="grid grid-cols-3 gap-3 md:grid-cols-6 xl:grid-cols-12"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="aspect-[2/3] w-full rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}
