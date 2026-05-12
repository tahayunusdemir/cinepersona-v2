import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-2 h-3 w-28 rounded-full" />
      <Skeleton className="mb-2 h-10 w-48 rounded-md" />
      <Skeleton className="mb-8 h-4 w-72 rounded-md" />
      <Skeleton className="mb-4 h-3 w-24 rounded-full" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
