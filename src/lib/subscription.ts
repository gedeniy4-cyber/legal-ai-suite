// Client-safe tier definitions and helpers.

export type Tier = "basic" | "pro" | "premium_single" | "premium_family" | "premium_business";

export const TIER_LABELS: Record<Tier, string> = {
  basic: "Basic",
  pro: "Pro",
  premium_single: "Premium (Single)",
  premium_family: "Premium (Family)",
  premium_business: "Premium (Business)",
};

export const TIER_PRICE_ZAR: Record<Tier, number> = {
  basic: 0,
  pro: 299,
  premium_single: 699,
  premium_family: 1499,
  premium_business: 4999,
};

export const DAILY_LIMITS: Record<Tier, number> = {
  basic: 10,
  pro: 50,
  premium_single: Number.POSITIVE_INFINITY,
  premium_family: Number.POSITIVE_INFINITY,
  premium_business: Number.POSITIVE_INFINITY,
};

export const FEATURES = {
  email: { label: "Legal Email Generator", minTier: "basic" as Tier },
  summarizer: { label: "Meeting Summarizer", minTier: "basic" as Tier },
  chat: { label: "AI Legal Chat", minTier: "basic" as Tier },
  planner: { label: "Task Planner", minTier: "pro" as Tier },
  research: { label: "Legal Research Assistant", minTier: "pro" as Tier },
  contract_review: { label: "Contract Review", minTier: "premium_single" as Tier },
  doc_explainer: { label: "Document Explainer", minTier: "premium_single" as Tier },
  case_timeline: { label: "Case Timeline Generator", minTier: "premium_single" as Tier },
  court_prep: { label: "Court Preparation Assistant", minTier: "premium_single" as Tier },
  citation: { label: "Citation Formatter", minTier: "premium_single" as Tier },
  argument: { label: "Argument Builder", minTier: "premium_single" as Tier },
  writing_coach: { label: "Legal Writing Coach", minTier: "premium_single" as Tier },
} as const;

export type FeatureKey = keyof typeof FEATURES;

const TIER_ORDER: Tier[] = ["basic", "pro", "premium_single", "premium_family", "premium_business"];

export function tierRank(t: Tier): number {
  return TIER_ORDER.indexOf(t);
}

export function canAccess(userTier: Tier, feature: FeatureKey): boolean {
  return tierRank(userTier) >= tierRank(FEATURES[feature].minTier);
}

export function formatZAR(cents: number): string {
  return `R${cents.toLocaleString("en-ZA")}`;
}
