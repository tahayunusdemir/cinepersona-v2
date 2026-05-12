import { Skeleton } from "@/components/ui/skeleton";

export default function FilmDetailLoading() {
  return (
    <div>
      <div className="h-[220px] w-full bg-panel sm:h-[320px] md:h-[420px]" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <Skeleton className="mt-6 h-3 w-28 rounded-full" />
        <div className="relative -mt-24 flex flex-col gap-7 sm:-mt-32 sm:flex-row">
          <Skeleton className="aspect-[2/3] w-[200px] rounded-xl sm:w-[240px]" />
          <div className="flex min-w-0 flex-1 flex-col gap-4 pt-6 sm:pt-24">
            <Skeleton className="h-3 w-32 rounded-full" />
            <Skeleton className="h-12 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-10 w-40 rounded-full" />
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </div>
        </div>
        <div className="mt-14 max-w-3xl space-y-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>
    </div>
  );
}
