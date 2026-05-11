import { BadgeCard } from "./badge-card";
import type { CategorySection } from "@/lib/badges/types";

type Props = {
  sections: CategorySection[];
  hideSecret?: boolean;
};

export function BadgeGrid({ sections, hideSecret }: Props) {
  if (sections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No badges available.</p>
    );
  }
  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const unlockedCount = section.rows.filter((r) => r.unlocked).length;
        return (
          <section key={section.category} aria-labelledby={`cat-${section.category}`}>
            <header className="mb-3 flex items-baseline justify-between">
              <h2
                id={`cat-${section.category}`}
                className="text-lg font-semibold tracking-tight"
              >
                {section.title}
              </h2>
              <span className="text-xs text-muted-foreground">
                {unlockedCount} / {section.rows.length}
              </span>
            </header>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.rows.map((row) => (
                <BadgeCard
                  key={row.id}
                  achievement={row}
                  hideSecret={hideSecret}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
