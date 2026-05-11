import type { Group } from "./types";

export const groups: Group[] = [
  {
    slug: "auteurs",
    name: "Auteurs",
    axisCode: "_SA_",
    tagline: "They analyse the art.",
    description:
      "Symbolic and analytical. Auteurs see cinema as an art form and follow subtext and craft together. Director filmographies, film theory, criticism — their natural territory. Open endings are pleasure, not irritation.",
  },
  {
    slug: "visionaries",
    name: "Visionaries",
    axisCode: "_SI_",
    tagline: "They feel the art.",
    description:
      "Symbolic and immersive. Visionaries hunt for meaning by feeling first. They cannot always say why a film moved them, but they know in their bones that it did. The natural audience for poetic, slow, experimental cinema.",
  },
  {
    slug: "connoisseurs",
    name: "Connoisseurs",
    axisCode: "_LA_",
    tagline: "They judge the craft.",
    description:
      "Literal and analytical. Connoisseurs prize realism and quality. Script consistency, performance, direction — everything is measurable. They have a definition of a good film and they can defend it.",
  },
  {
    slug: "escapists",
    name: "Escapists",
    axisCode: "_LI_",
    tagline: "They live the story.",
    description:
      "Literal and immersive. Escapists prioritise story and emotional experience. Whether a film is well made matters less than whether it carries them. The mainstream audience, in the best sense.",
  },
];

export function getGroup(slug: string) {
  return groups.find((g) => g.slug === slug);
}
