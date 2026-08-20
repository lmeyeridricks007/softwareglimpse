import { opportunityWeights } from "@/data/config/seo/opportunity-weights";
import type {
  QueryIntent,
  SeoOpportunity,
  SeoOpportunityType,
} from "@/domain";

export type ScoreOpportunityInput = {
  type: SeoOpportunityType;
  impressions?: number;
  position?: number;
  intent?: QueryIntent;
  /** 0–1 research readiness (facts/assessments available). */
  researchReadiness?: number;
  /** 0–1 topical authority heuristic. */
  topicalAuthority?: number;
  /**
   * Optional 0–1 commercial/affiliate planning boost.
   * Affects content priority only — never product recommendation ranks.
   */
  commercialBoost?: number;
  effort?: "small" | "medium" | "large";
  reasons?: string[];
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function demandScore(impressions: number): number {
  // Soft saturate around ~2000 impressions.
  return clamp01(Math.log10(1 + impressions) / Math.log10(2001));
}

function strikingDistanceScore(position: number | undefined): number {
  if (position == null) return 0.3;
  if (position >= 4 && position <= 20) {
    // Closer to 4 is better opportunity.
    return clamp01(1 - (position - 4) / 16);
  }
  if (position < 4) return 0.35;
  return 0.1;
}

function purchaseIntentScore(intent: QueryIntent | undefined): number {
  switch (intent) {
    case "pricing":
    case "transactional":
      return 1;
    case "comparison":
    case "alternatives":
    case "best":
      return 0.85;
    case "review":
      return 0.7;
    case "tool":
      return 0.65;
    case "category":
    case "problem":
      return 0.45;
    case "informational":
      return 0.3;
    case "brand":
      return 0.2;
    default:
      return 0.25;
  }
}

function effortInverseScore(effort: "small" | "medium" | "large"): number {
  switch (effort) {
    case "small":
      return 1;
    case "medium":
      return 0.6;
    case "large":
      return 0.3;
  }
}

/**
 * Deterministic 0–100 priority with breakdown + reasons.
 * commercialBoost is planning-only and optional.
 */
export function scoreOpportunity(input: ScoreOpportunityInput): Pick<
  SeoOpportunity,
  "priorityScore" | "scoreBreakdown" | "reasons" | "confidence"
> {
  const demand = demandScore(input.impressions ?? 0);
  const striking = strikingDistanceScore(input.position);
  const purchase = purchaseIntentScore(input.intent);
  const research = clamp01(input.researchReadiness ?? 0.4);
  const authority = clamp01(input.topicalAuthority ?? 0.5);
  const commercial = clamp01(input.commercialBoost ?? 0);
  const effortInv = effortInverseScore(input.effort ?? "medium");

  const breakdown: Record<string, number> = {
    demand: demand * opportunityWeights.demand * 100,
    strikingDistance: striking * opportunityWeights.strikingDistance * 100,
    purchaseIntent: purchase * opportunityWeights.purchaseIntent * 100,
    researchReadiness: research * opportunityWeights.researchReadiness * 100,
    topicalAuthority: authority * opportunityWeights.topicalAuthority * 100,
    commercialOpportunity:
      commercial * opportunityWeights.commercialOpportunity * 100,
    effortInverse: effortInv * opportunityWeights.effortInverse * 100,
  };

  const priorityScore = Math.round(
    Object.values(breakdown).reduce((a, b) => a + b, 0),
  );

  const reasons = [...(input.reasons ?? [])];
  if (commercial > 0) {
    reasons.push(
      "Commercial boost applied for content planning only — does not affect product recommendation rankings",
    );
  }

  const confidence: SeoOpportunity["confidence"] =
    (input.impressions ?? 0) >= 500
      ? "high"
      : (input.impressions ?? 0) >= 100
        ? "medium"
        : "low";

  return {
    priorityScore: Math.max(0, Math.min(100, priorityScore)),
    scoreBreakdown: breakdown,
    reasons,
    confidence,
  };
}
