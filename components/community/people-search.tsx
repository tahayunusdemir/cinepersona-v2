"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export function PeopleSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  // Re-key the input on URL change so the value reflects ?q= without an
  // effect-driven setState.
  return <SearchInput key={initial} initial={initial} router={router} params={params} />;
}

type InnerProps = {
  initial: string;
  router: ReturnType<typeof useRouter>;
  params: ReturnType<typeof useSearchParams>;
};

function SearchInput({ initial, router, params }: InnerProps) {
  const [value, setValue] = useState(initial);

  const submit = (next: string) => {
    const usp = new URLSearchParams(params.toString());
    if (next.trim().length >= 2) usp.set("q", next.trim());
    else usp.delete("q");
    usp.delete("page");
    const qs = usp.toString();
    router.push(qs ? `/community/people?${qs}` : "/community/people");
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className="relative w-full max-w-sm"
    >
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by username or name…"
        aria-label="Search users"
        className="pl-9"
      />
    </form>
  );
}
