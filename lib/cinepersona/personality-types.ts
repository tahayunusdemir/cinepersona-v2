import type { PersonalityType } from "./types";

export const personalityTypes: PersonalityType[] = [
  // Auteurs (_SA_)
  {
    code: "ESAC",
    slug: "esac",
    name: "The Interpreter",
    tagline: "Searches every frame for hidden meaning. Once they find it, they need to share it.",
    quote:
      "A good film gives me two things: it makes me feel what I had to feel, then it tells me why I felt it.",
    group: "auteurs",
    strategy: "devoted",
    axes: { a1: "E", a2: "S", a3: "A", a4: "C" },
  },
  {
    code: "ESAW",
    slug: "esaw",
    name: "The Essayist",
    tagline: "Catches the moment, then goes deep. No list, but plenty of depth.",
    quote: "The best films are the ones I didn't expect. That's why decoding them is sweet.",
    group: "auteurs",
    strategy: "free-spirit",
    axes: { a1: "E", a2: "S", a3: "A", a4: "W" },
  },
  {
    code: "DSAC",
    slug: "dsac",
    name: "The Scholar",
    tagline: "Treats cinema like an archive. Meaning before feeling.",
    quote: "Character is a tool of the camera. The real subject is the camera itself.",
    group: "auteurs",
    strategy: "archivist",
    axes: { a1: "D", a2: "S", a3: "A", a4: "C" },
  },
  {
    code: "DSAW",
    slug: "dsaw",
    name: "The Critic",
    tagline: "Observes, judges, moves on. Distant but sharp.",
    quote: "Good films find me. I don't chase them.",
    group: "auteurs",
    strategy: "drifter",
    axes: { a1: "D", a2: "S", a3: "A", a4: "W" },
  },

  // Visionaries (_SI_)
  {
    code: "ESIC",
    slug: "esic",
    name: "The Dreamer",
    tagline: "A film changes them, and they change the film in return.",
    quote:
      "The right film comes at the right time and changes you a little. My job is to be ready for it.",
    group: "visionaries",
    strategy: "devoted",
    axes: { a1: "E", a2: "S", a3: "I", a4: "C" },
  },
  {
    code: "ESIW",
    slug: "esiw",
    name: "The Mystic",
    tagline: "Hunts for meaning by feeling first. No system, only depth.",
    quote: "Don't ask me which film I love. Ask me which film caught me at the right moment.",
    group: "visionaries",
    strategy: "free-spirit",
    axes: { a1: "E", a2: "S", a3: "I", a4: "W" },
  },
  {
    code: "DSIC",
    slug: "dsic",
    name: "The Curator",
    tagline: "Builds their collection with care. Every film leaves a trace.",
    quote: "A collection isn't measured by what you own — it's measured by what you chose.",
    group: "visionaries",
    strategy: "archivist",
    axes: { a1: "D", a2: "S", a3: "I", a4: "C" },
  },
  {
    code: "DSIW",
    slug: "dsiw",
    name: "The Wanderer",
    tagline: "Loses themselves in films. Doesn't expect to be found.",
    quote: "A good film neither asks nor answers. It just happens.",
    group: "visionaries",
    strategy: "drifter",
    axes: { a1: "D", a2: "S", a3: "I", a4: "W" },
  },

  // Connoisseurs (_LA_)
  {
    code: "ELAC",
    slug: "elac",
    name: "The Enthusiast",
    tagline: "Defends what they love with conviction. Lists and arguments at the ready.",
    quote: "Good films are well written, well acted, well shot. You don't need more than that to love them.",
    group: "connoisseurs",
    strategy: "devoted",
    axes: { a1: "E", a2: "L", a3: "A", a4: "C" },
  },
  {
    code: "ELAW",
    slug: "elaw",
    name: "The Explorer",
    tagline: "Tries something from every genre and finds what they like.",
    quote: "There are more good films I haven't opened than I'll ever see. Why limit myself to a list?",
    group: "connoisseurs",
    strategy: "free-spirit",
    axes: { a1: "E", a2: "L", a3: "A", a4: "W" },
  },
  {
    code: "DLAC",
    slug: "dlac",
    name: "The Analyst",
    tagline: "Scores, compares, catalogues. Not unfeeling — methodical.",
    quote: "A film is an argument. A good argument is consistent, supported, and lands.",
    group: "connoisseurs",
    strategy: "archivist",
    axes: { a1: "D", a2: "L", a3: "A", a4: "C" },
  },
  {
    code: "DLAW",
    slug: "dlaw",
    name: "The Pragmatist",
    tagline: "Good entertainment is enough. Anything more is unnecessary.",
    quote: "If I had a good time, it was a good film. If I didn't, it wasn't. Doesn't have to be more than that.",
    group: "connoisseurs",
    strategy: "drifter",
    axes: { a1: "D", a2: "L", a3: "A", a4: "W" },
  },

  // Escapists (_LI_)
  {
    code: "ELIC",
    slug: "elic",
    name: "The Loyalist",
    tagline: "Doesn't want to leave the worlds they love. The patron saint of the binge.",
    quote: "I'd rather walk back into a world I love than keep finding new ones.",
    group: "escapists",
    strategy: "devoted",
    axes: { a1: "E", a2: "L", a3: "I", a4: "C" },
  },
  {
    code: "ELIW",
    slug: "eliw",
    name: "The Romantic",
    tagline: "Can't quite leave a film once it ends. Picks by feeling, not by list.",
    quote:
      "If a film took me in, I come out a slightly different person. The list doesn't know that.",
    group: "escapists",
    strategy: "free-spirit",
    axes: { a1: "E", a2: "L", a3: "I", a4: "W" },
  },
  {
    code: "DLIC",
    slug: "dlic",
    name: "The Completionist",
    tagline: "Finishes what they start, leaves a rating. Systematic but warm.",
    quote: "I finish what I start. Half-done isn't mine.",
    group: "escapists",
    strategy: "archivist",
    axes: { a1: "D", a2: "L", a3: "I", a4: "C" },
  },
  {
    code: "DLIW",
    slug: "dliw",
    name: "The Casual",
    tagline: "Doesn't need an excuse to watch. Doesn't need one to stop, either.",
    quote: "A good film saves the evening. Other things can do the rest.",
    group: "escapists",
    strategy: "drifter",
    axes: { a1: "D", a2: "L", a3: "I", a4: "W" },
  },
];

export const personalityTypeByCode = new Map(
  personalityTypes.map((t) => [t.code, t]),
);

export function getType(code: string) {
  return personalityTypeByCode.get(code.toUpperCase());
}

export function typesInGroup(slug: string) {
  return personalityTypes.filter((t) => t.group === slug);
}

export function typesWithStrategy(slug: string) {
  return personalityTypes.filter((t) => t.strategy === slug);
}
