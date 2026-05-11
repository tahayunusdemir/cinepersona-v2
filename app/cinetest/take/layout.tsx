import type { Metadata } from "next";
import type { ReactNode } from "react";

import { TakeShell } from "@/components/cinetest/take-shell";

export const metadata: Metadata = {
  title: "Take the CineTest",
  description:
    "12 film-pick prompts plus 48 Likert statements. Picks shape your CineMatch; answers map your CineType.",
};

export default function TakeLayout({ children }: { children: ReactNode }) {
  return <TakeShell>{children}</TakeShell>;
}
