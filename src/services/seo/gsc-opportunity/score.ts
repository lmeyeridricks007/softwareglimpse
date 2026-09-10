import { expectedCtrForPosition } from "@/data/config/seo/ctr-baselines";
import type {
  GscCommercialIntent,
  ScoreBreakdown,
} from "./types";

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Soft-saturate demand; one-off impressions stay near zero. */
export function impressionDemandScore(impressions: number): number {
  if (impressions < 5) return 0;
  if (impressions < 20) return 0.15 * (impressions / 20);
  // Soft saturate ~2000 impressions.
  return clamp01(Math.log10(1 + impressions) / Math.log10(2001));
}

/**
 * Ranking proximity bands (user spec):
 * 8–20 very high, 21–35 high, 36–50 medium, 51–70 selective, >70 low
 * unless impressions are unusually high.
 */
export function positionProximityScore(
  position: number,
  impressions: number,
): number {
  if (!Number.isFinite(position) || position <= 0) return 0.2;
  if (position < 8) {
    // Already strong — modest opportunity (CTR / defend).
    return 0.45;
  }
  if (position <= 20) return 1;
  if (position <= 35) return 0.8;
  if (position <= 50) return 0.55;
  if (position <= 70) return 0.3;
  // Deep pages only if demand is large.
  if (impressions >= 500) return 0.22;
  if (impressions >= 200) return 0.12;
  return 0.05;
}

/** Distance-to-page-one factor (stronger near 11–20 than 40+). */
export function pageOneProximityScore(position: number): number {
  if (position <= 10) return 0.55;
  if (position <= 20) return 1;
  if (position <= 35) return 0.7;
  if (position <= 50) return 0.4;
  if (position <= 70) return 0.2;
  return 0.08;
}

export function expectedCtrExtended(position: number): number {
  const base = expectedCtrForPosition(position);
  if (base != null) return base;
  if (position <= 35) return 0.005;
  if (position <= 50) return 0.002;
  if (position <= 70) return 0.001;
  return 0.0005;
}

export function ctrGapScore(ctr: number, position: number): number {
  const expected = expectedCtrExtended(position);
  if (expected <= 0) return 0.3;
  const ratio = ctr / expected;
  // Large gap (underperforming CTR) → higher opportunity.
  if (ratio >= 1.2) return 0.15; // already beating baseline
  if (ratio >= 0.8) return 0.35;
  if (ratio >= 0.4) return 0.7;
  return 1;
}

export function commercialIntentScore(intent: GscCommercialIntent): number {
  switch (intent) {
    case "transactional":
    case "pricing":
      return 1;
    case "commercial_investigation":
    case "comparison":
    case "alternatives":
    case "buying_guide":
      return 0.85;
    case "review":
      return 0.75;
    case "informational":
      return 0.45;
    case "navigational_brand":
      return 0.2;
    case "low_value":
      return 0.05;
  }
}

export function contentTypeScore(pageType: string): number {
  const t = pageType.toLowerCase();
  if (
    t.includes("review") ||
    t.includes("software") ||
    t.includes("product")
  ) {
    return 0.9;
  }
  if (
    t.includes("comparison") ||
    t.includes("alternatives") ||
    t.includes("best")
  ) {
    return 0.95;
  }
  if (t.includes("pricing")) return 0.9;
  if (t.includes("guide") || t.includes("industry") || t.includes("use-case")) {
    return 0.7;
  }
  if (t.includes("tool") || t.includes("category") || t.includes("hub")) {
    return 0.65;
  }
  if (t.includes("unknown") || t.includes("legacy")) return 0.35;
  return 0.5;
}

/**
 * Quality-gap opportunity: incomplete pages are more actionable to improve,
 * but hollow shells with no foundation score lower on likelihood separately.
 */
export function pageQualityGapScore(
  qualityScore: number | null,
  completenessSignals: number,
): number {
  if (qualityScore == null) {
    return clamp01(0.4 + completenessSignals * 0.1);
  }
  // Mid quality (55–80) = sweet spot to improve; very low = hard; excellent = defend.
  if (qualityScore >= 90) return 0.2;
  if (qualityScore >= 80) return 0.4;
  if (qualityScore >= 60) return 0.85;
  if (qualityScore >= 40) return 0.7;
  return 0.45;
}

export function internalLinkScore(
  inbound: number | null,
  outbound: number | null,
): number {
  const inN = inbound ?? 0;
  const outN = outbound ?? 0;
  // Weak inbound → higher opportunity (fixable with links).
  let inboundOpp = 1;
  if (inN >= 8) inboundOpp = 0.25;
  else if (inN >= 3) inboundOpp = 0.5;
  else if (inN >= 1) inboundOpp = 0.75;

  const outboundOk = outN >= 3 ? 0.3 : outN >= 1 ? 0.6 : 1;
  return clamp01(inboundOpp * 0.7 + outboundOk * 0.3);
}

export function freshnessScore(
  lastUpdated: string | null,
  nowMs: number = Date.now(),
): number {
  if (!lastUpdated) return 0.7; // unknown → treat as likely refresh candidate
  const t = Date.parse(lastUpdated);
  if (!Number.isFinite(t)) return 0.7;
  const ageDays = (nowMs - t) / (1000 * 60 * 60 * 24);
  if (ageDays <= 90) return 0.25;
  if (ageDays <= 180) return 0.5;
  if (ageDays <= 365) return 0.75;
  return 1;
}

export function queryCoverageScore(queryCount: number): number {
  if (queryCount <= 0) return 0.15;
  if (queryCount === 1) return 0.45;
  if (queryCount <= 3) return 0.7;
  if (queryCount <= 8) return 0.9;
  return 1;
}

export function topicalRelevanceScore(matchStrength: number): number {
  return clamp01(matchStrength);
}

export function cannibalizationPenalty(risk: number): number {
  // Returns contribution to score (high risk lowers opportunity clarity).
  return clamp01(1 - risk);
}

export function improvementLikelihoodScore(input: {
  position: number;
  impressions: number;
  qualityGap: number;
  rootCauseCount: number;
  indexable: boolean;
  /** IMPROVE / temporary noindex with real demand — promotion opportunity. */
  improvePromotion?: boolean;
}): number {
  let s = 0.4;
  if (input.position >= 8 && input.position <= 35) s += 0.35;
  else if (input.position <= 50) s += 0.2;
  if (input.impressions >= 50) s += 0.1;
  if (input.impressions >= 200) s += 0.05;
  s += clamp01(input.qualityGap) * 0.15;
  s += Math.min(0.15, input.rootCauseCount * 0.03);

  if (input.improvePromotion) {
    // Historical GSC demand on IMPROVE/noindex pages is a high-priority promotion signal.
    if (input.impressions >= 25 && input.position <= 50) s += 0.3;
    else if (input.impressions >= 10) s += 0.15;
  } else if (!input.indexable) {
    // Unknown non-indexable without IMPROVE lifecycle — slight caution, not a kill.
    s *= 0.85;
  }
  return clamp01(s);
}

/** Explicit boost term for Queue B (IMPROVE / promote). */
export function improvePromotionBoostScore(input: {
  improvePromotion: boolean;
  impressions: number;
  position: number;
}): number {
  if (!input.improvePromotion) return 0;
  if (input.impressions >= 100 && input.position <= 35) return 1;
  if (input.impressions >= 40 && input.position <= 50) return 0.75;
  if (input.impressions >= 15) return 0.5;
  return 0.25;
}

/** Weights sum to 1.0 — documented in reports for reproducibility. */
export const GSC_OPPORTUNITY_WEIGHTS = {
  impressions: 0.15,
  positionProximity: 0.15,
  rankingProximityToPageOne: 0.09,
  ctrGap: 0.09,
  queryCoverage: 0.05,
  commercialIntent: 0.08,
  contentType: 0.05,
  pageQualityGap: 0.07,
  internalLinkStrength: 0.05,
  topicalRelevance: 0.05,
  freshness: 0.04,
  cannibalizationRisk: 0.03,
  improvementLikelihood: 0.05,
  improvePromotionBoost: 0.05,
} as const;

export type ScorePageOpportunityInput = {
  impressions: number;
  position: number;
  ctr: number;
  queryCount: number;
  commercialIntent: GscCommercialIntent;
  pageType: string;
  qualityScore: number | null;
  completenessSignals: number;
  inboundLinks: number | null;
  outboundLinks: number | null;
  lastUpdated: string | null;
  topicalMatch: number;
  cannibalizationRisk: number;
  rootCauseCount: number;
  indexable: boolean;
  improvePromotion?: boolean;
};

export function scorePageOpportunity(input: ScorePageOpportunityInput): {
  opportunityScore: number;
  scoreBreakdown: ScoreBreakdown;
} {
  const improvePromotion = Boolean(input.improvePromotion);
  const impressions = impressionDemandScore(input.impressions);
  const positionProximity = positionProximityScore(
    input.position,
    input.impressions,
  );
  const rankingProximityToPageOne = pageOneProximityScore(input.position);
  const ctrGap = ctrGapScore(input.ctr, input.position);
  const queryCoverage = queryCoverageScore(input.queryCount);
  const commercialIntent = commercialIntentScore(input.commercialIntent);
  const contentType = contentTypeScore(input.pageType);
  const pageQualityGap = pageQualityGapScore(
    input.qualityScore,
    input.completenessSignals,
  );
  const internalLinkStrength = internalLinkScore(
    input.inboundLinks,
    input.outboundLinks,
  );
  const topicalRelevance = topicalRelevanceScore(input.topicalMatch);
  const freshness = freshnessScore(input.lastUpdated);
  const cannibalizationRisk = cannibalizationPenalty(input.cannibalizationRisk);
  const improvementLikelihood = improvementLikelihoodScore({
    position: input.position,
    impressions: input.impressions,
    qualityGap: pageQualityGap,
    rootCauseCount: input.rootCauseCount,
    indexable: input.indexable,
    improvePromotion,
  });
  const improvePromotionBoost = improvePromotionBoostScore({
    improvePromotion,
    impressions: input.impressions,
    position: input.position,
  });

  const parts: ScoreBreakdown = {
    impressions: impressions * GSC_OPPORTUNITY_WEIGHTS.impressions * 100,
    positionProximity:
      positionProximity * GSC_OPPORTUNITY_WEIGHTS.positionProximity * 100,
    rankingProximityToPageOne:
      rankingProximityToPageOne *
      GSC_OPPORTUNITY_WEIGHTS.rankingProximityToPageOne *
      100,
    ctrGap: ctrGap * GSC_OPPORTUNITY_WEIGHTS.ctrGap * 100,
    queryCoverage: queryCoverage * GSC_OPPORTUNITY_WEIGHTS.queryCoverage * 100,
    commercialIntent:
      commercialIntent * GSC_OPPORTUNITY_WEIGHTS.commercialIntent * 100,
    contentType: contentType * GSC_OPPORTUNITY_WEIGHTS.contentType * 100,
    pageQualityGap:
      pageQualityGap * GSC_OPPORTUNITY_WEIGHTS.pageQualityGap * 100,
    internalLinkStrength:
      internalLinkStrength * GSC_OPPORTUNITY_WEIGHTS.internalLinkStrength * 100,
    topicalRelevance:
      topicalRelevance * GSC_OPPORTUNITY_WEIGHTS.topicalRelevance * 100,
    freshness: freshness * GSC_OPPORTUNITY_WEIGHTS.freshness * 100,
    cannibalizationRisk:
      cannibalizationRisk * GSC_OPPORTUNITY_WEIGHTS.cannibalizationRisk * 100,
    improvementLikelihood:
      improvementLikelihood *
      GSC_OPPORTUNITY_WEIGHTS.improvementLikelihood *
      100,
    improvePromotionBoost:
      improvePromotionBoost *
      GSC_OPPORTUNITY_WEIGHTS.improvePromotionBoost *
      100,
  };

  // Hard floor: do not over-prioritize one random impression.
  let opportunityScore = Object.values(parts).reduce((a, b) => a + b, 0);
  if (input.impressions < 10) {
    opportunityScore *= 0.35;
  } else if (input.impressions < 25) {
    opportunityScore *= 0.6;
  }

  return {
    opportunityScore: Math.round(Math.max(0, Math.min(100, opportunityScore))),
    scoreBreakdown: parts,
  };
}
