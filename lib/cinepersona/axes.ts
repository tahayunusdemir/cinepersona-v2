import type { AxisDefinition } from "./types";

export const axes: AxisDefinition[] = [
  {
    id: 1,
    name: "Connection",
    primary: {
      letter: "E",
      name: "Empathic",
      blurb:
        "Inhabits the characters. Cries, tenses, lingers for days. A film is the story of someone you walk beside.",
    },
    opposite: {
      letter: "D",
      name: "Detached",
      blurb:
        "Watches from the outside. Keeps a safe distance. Likes characters as objects of attention, not skin to step inside.",
    },
  },
  {
    id: 2,
    name: "Meaning",
    primary: {
      letter: "S",
      name: "Symbolic",
      blurb:
        "Reads subtext, motifs, metaphors. Open endings feel like an invitation, not a cheat.",
    },
    opposite: {
      letter: "L",
      name: "Literal",
      blurb:
        "Wants plot, coherence, realism. A scene should make sense; ambiguity reads as laziness, not depth.",
    },
  },
  {
    id: 3,
    name: "Evaluation",
    primary: {
      letter: "A",
      name: "Analytical",
      blurb:
        "Judges craft consciously. Spots plot holes. Reads reviews. Believes there is such a thing as objectively good.",
    },
    opposite: {
      letter: "I",
      name: "Immersive",
      blurb:
        "Asks whether it pulled them in. A bad film can still feel good. Critics come second, if at all.",
    },
  },
  {
    id: 4,
    name: "Discovery",
    primary: {
      letter: "C",
      name: "Curatorial",
      blurb:
        "Watchlists, retrospectives, ordered filmographies. Discovery is a project; finishing is a virtue.",
    },
    opposite: {
      letter: "W",
      name: "Wandering",
      blurb:
        "Picks by mood. Drops what bores them. The right film tends to find them when it should.",
    },
  },
];

