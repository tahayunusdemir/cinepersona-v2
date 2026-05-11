import type { Strategy } from "./types";

export const strategies: Strategy[] = [
  {
    slug: "devoted",
    name: "Devoted",
    axisCode: "E__C",
    tagline: "Bonded and systematic.",
    description:
      "Empathic and curatorial. Devoted viewers take cinema seriously and plan with affection. The watchlist matters as much as the characters because they want to give themselves the right film. Believers in timing.",
  },
  {
    slug: "free-spirit",
    name: "Free Spirit",
    axisCode: "E__W",
    tagline: "Bonded but loose.",
    description:
      "Empathic and wandering. Same depth of attachment, but spontaneous. Planning feels cold; \"which film do I deserve right now?\" is the better question. They cannot leave a film easily, but they refuse to spend an hour picking one.",
  },
  {
    slug: "archivist",
    name: "Archivist",
    axisCode: "D__C",
    tagline: "Cool and systematic.",
    description:
      "Detached and curatorial. Archivists treat cinema as a catalogue. Director filmographies, period movements, canonical lists. Cool but respectful — they put real labour into their viewing.",
  },
  {
    slug: "drifter",
    name: "Drifter",
    axisCode: "D__W",
    tagline: "Cool and loose.",
    description:
      "Detached and wandering. The freest viewer of them all — \"if there's time, I'll watch.\" No list, no commitment, no pressure. Also the type that loses the thread of cinema fastest if life gets busy.",
  },
];

export function getStrategy(slug: string) {
  return strategies.find((s) => s.slug === slug);
}
