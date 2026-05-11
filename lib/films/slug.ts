export function filmSlug(tmdbId: number, title: string): string {
  const kebab = title
    .toLowerCase()
    .normalize("NFKD")
    // Strip combining diacritical marks (U+0300–U+036F).
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return kebab ? `${tmdbId}-${kebab}` : String(tmdbId);
}
