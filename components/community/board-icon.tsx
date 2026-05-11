import { createElement } from "react";

import { boardIcons } from "@/lib/community/board-icons";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
};

export function BoardIcon({ slug, className }: Props) {
  const Icon = boardIcons[slug] ?? boardIcons.meta;
  return createElement(Icon, { className: cn(className) });
}
