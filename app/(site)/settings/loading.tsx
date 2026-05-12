import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsLoading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-9 w-40 sm:h-10 sm:w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="flex flex-col gap-6">
        <CardSkeleton rows={2} />
        <CardSkeleton rows={3} />
        <CardSkeleton rows={1} />
        <CardSkeleton rows={2} />
      </div>
    </main>
  );
}
