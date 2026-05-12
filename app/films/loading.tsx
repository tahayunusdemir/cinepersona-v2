import { Skeleton } from "@/components/ui/skeleton";

export default function FilmsLoading() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton className="mt-3 h-10 w-32 rounded-md" />
            <Skeleton className="mt-2 h-4 w-64 rounded-md" />
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <Skeleton className="mb-6 h-12 w-full rounded-2xl" />
        <ul
          aria-hidden
          className="grid grid-cols-3 gap-3 md:grid-cols-6 xl:grid-cols-12"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
