import type { QueryIntent } from "@/domain";

/**
 * Deterministic intent rules — first match wins (ordered by specificity).
 */
export type QueryPatternRule = {
  intent: QueryIntent;
  /** Tested against normalized query. */
  pattern: RegExp;
};

export const brandNames = ["softwareglimpse", "software glimpse"] as const;

export const queryIntentRules: QueryPatternRule[] = [
  { intent: "pricing", pattern: /\b(pricing|price|cost|plans?|subscription|how much)\b/ },
  { intent: "comparison", pattern: /\bvs\.?\b|\bversus\b|\bcompare\b|\bcomparison\b/ },
  { intent: "alternatives", pattern: /\b(alternatives?|competitor|competitors|instead of|like)\b/ },
  { intent: "best", pattern: /\b(best|top|recommended)\b/ },
  { intent: "review", pattern: /\b(review|reviews|rating|ratings)\b/ },
  { intent: "tool", pattern: /\b(finder|calculator|tool|quiz)\b/ },
  { intent: "category", pattern: /\b(crm|software|platform|tools?)\b/ },
  { intent: "problem", pattern: /\b(how to|fix|improve|automate|manage)\b/ },
  { intent: "transactional", pattern: /\b(buy|purchase|sign up|trial|demo|discount)\b/ },
  { intent: "informational", pattern: /\b(what is|what are|meaning|definition|guide)\b/ },
];

/** Synonym groups for query clustering (normalized forms). */
export const queryClusterSynonyms: Record<string, readonly string[]> = {
  pricing: ["pricing", "price", "cost", "plans", "plan", "subscription", "how much"],
  alternatives: [
    "alternatives",
    "alternative",
    "competitors",
    "competitor",
    "instead of",
  ],
  comparison: ["vs", "versus", "compare", "comparison"],
  best: ["best", "top", "recommended"],
};
