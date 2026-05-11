import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serializeSearchParams } from "@/lib/films/search-params";
import type { FilmsSearchParams } from "@/lib/films/types";

type Props = {
  params: FilmsSearchParams;
};

export function FilmsEmptyState({ params }: Props) {
  const clearHref = `/films${serializeSearchParams({ view: params.view })}`;
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchXIcon className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-base font-medium">No films found</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Try adjusting your filters and search again.
        </p>
      </div>
      <Link
        href={clearHref}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Clear all
      </Link>
    </div>
  );
}
