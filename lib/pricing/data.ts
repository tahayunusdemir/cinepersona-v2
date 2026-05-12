export type PlanId = "free" | "plus" | "pro" | "elite";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Start discovering your cinematic match.",
    description: "Everything you need to find your CineType.",
    features: [
      "Discover movies & people with similar taste",
      "Weekly limited matches (3 / week)",
      "Basic profile & preferences",
      "Join public discussions",
      "Limited filters",
    ],
    cta: "Sign up — free",
  },
  {
    id: "plus",
    name: "Plus",
    monthly: 4.99,
    yearly: 47.99,
    tagline: "Unlock the full Cinepersona experience.",
    description: "More matches, smarter filters, no ads.",
    features: [
      "Daily limited matches & recommendations",
      "See who liked your profile",
      "Advanced filters (genre, mood, era, vibe)",
      "Ad-free experience",
      "Priority in matching system",
    ],
    cta: "Upgrade to Plus",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 9.99,
    yearly: 95.99,
    tagline: "Go beyond matching. Build your film circle.",
    description: "Private groups, Movie Nights, AI picks.",
    features: [
      "Everything in Plus",
      "Unlimited matches & recommendations",
      "Create private movie groups",
      "Host Movie Night sessions",
      "Profile boost (get seen more)",
      "AI-powered recommendations",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "elite",
    name: "Elite",
    monthly: 19.99,
    yearly: 191.99,
    tagline: "For true cinema lovers.",
    description: "Curated communities, events, and perks.",
    features: [
      "Everything in Pro",
      "Access to exclusive communities",
      "Special curated events (online & offline)",
      "Elite badge & profile highlight",
      "Priority support",
      "Invitations to limited experiences",
    ],
    cta: "Join Elite",
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}

export const planNames = plans.map((p) => p.name) as [
  string,
  string,
  string,
  string,
];

export type MatrixCellValue = true | false | string;

export type MatrixRow = {
  feature: string;
  values: [MatrixCellValue, MatrixCellValue, MatrixCellValue, MatrixCellValue];
};

export const matrix: MatrixRow[] = [
  { feature: "Discover movies", values: [true, true, true, true] },
  {
    feature: "Match with users",
    values: ["Weekly (3)", "Daily limit", "Unlimited", "Unlimited"],
  },
  { feature: "See who liked you", values: [false, true, true, true] },
  {
    feature: "Advanced filters (mood / era / vibe)",
    values: [false, true, true, true],
  },
  { feature: "Ad-free experience", values: [false, true, true, true] },
  { feature: "Priority matching", values: [false, true, true, true] },
  { feature: "Create private groups", values: [false, false, true, true] },
  { feature: "Host Movie Night sessions", values: [false, false, true, true] },
  { feature: "Profile boost", values: [false, false, true, true] },
  { feature: "AI recommendations", values: [false, false, true, true] },
  { feature: "Early access features", values: [false, false, true, true] },
  { feature: "Exclusive communities", values: [false, false, false, true] },
  {
    feature: "Special events (online / offline)",
    values: [false, false, false, true],
  },
  { feature: "Elite badge & highlight", values: [false, false, false, true] },
  { feature: "Priority support", values: [false, false, false, true] },
  {
    feature: "Invitations to experiences",
    values: [false, false, false, true],
  },
];
