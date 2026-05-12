import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-6 flex items-start gap-4">
        <Skeleton className="size-11 rounded-md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-9 w-56 sm:h-10 sm:w-64" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <Skeleton className="mb-4 h-9 w-48" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </div>
  );
}
