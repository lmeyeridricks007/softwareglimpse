/**
 * Transparent opportunity scoring.
 * Bands are primary; 0–100 is optional normalized context — not fake precision.
 */

import type {
  EffortBand,
  LikelihoodBand,
  OpportunityScoreBand,
  ScoreBreakdown,
  SpamRisk,
  ValueBand,
} from "@/domain/schemas/authority-intelligence";
import {
  evaluateLinkSpamCompliance,
  type ComplianceVerdict,
} from "./compliance";

const VALUE_SCORE: Record<ValueBand, number> = {
  excellent: 95,
  strong: 80,
  good: 65,
  low: 35,
  none: 5,
  unknown: 50,
};

const LIKELIHOOD_SCORE: Record<LikelihoodBand, number> = {
  high: 90,
  medium: 65,
  low: 35,
  "very-low": 15,
  unknown: 45,
};

const EFFORT_PENALTY: Record<EffortBand, number> = {
  trivial: 0,
  small: 4,
  medium: 10,
  large: 18,
  unknown: 8,
};

const SPAM_PENALTY: Record<SpamRisk, number> = {
  none: 0,
  low: 5,
  medium: 20,
  high: 45,
  "link-spam-avoid": 100,
};

export type ScoreInput = {
  relevance: ValueBand;
  editorialLegitimacy: ValueBand;
  audienceOverlap: ValueBand;
  referralValue: ValueBand;
  seoValue: ValueBand;
  targetPageFit: ValueBand;
  likelihood: LikelihoodBand;
  effort: EffortBand;
  /** 0 = free / unknown, higher = more expensive relative to value */
  costBurden?: "none" | "low" | "medium" | "high";
  spamRisk: SpamRisk;
  compliance?: ComplianceVerdict;
  notes?: string[];
};

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function bandFromNormalized(score: number): OpportunityScoreBand {
  if (score <= 0) return "AVOID";
  if (score >= 85) return "EXCELLENT";
  if (score >= 70) return "STRONG";
  if (score >= 50) return "GOOD";
  return "LOW";
}

/**
 * Weighted composite. SEO value is one factor — never the only one.
 * Spam / compliance rejection forces AVOID regardless of other scores.
 */
export function scoreOpportunity(input: ScoreInput): {
  band: OpportunityScoreBand;
  normalized: number;
  breakdown: ScoreBreakdown;
} {
  const compliance =
    input.compliance ??
    ({ reject: false, spamRisk: input.spamRisk, flags: [] } as ComplianceVerdict);

  if (compliance.reject || input.spamRisk === "link-spam-avoid") {
    return {
      band: "AVOID",
      normalized: 0,
      breakdown: {
        relevance: VALUE_SCORE[input.relevance],
        editorialLegitimacy: VALUE_SCORE[input.editorialLegitimacy],
        audienceOverlap: VALUE_SCORE[input.audienceOverlap],
        referralValue: VALUE_SCORE[input.referralValue],
        seoValue: VALUE_SCORE[input.seoValue],
        targetPageFit: VALUE_SCORE[input.targetPageFit],
        likelihood: LIKELIHOOD_SCORE[input.likelihood],
        effortPenalty: EFFORT_PENALTY[input.effort],
        costPenalty: 0,
        spamRiskPenalty: 100,
        notes: [
          ...(input.notes ?? []),
          compliance.reason ?? "Rejected by link-spam compliance policy",
        ],
      },
    };
  }

  const costPenalty =
    input.costBurden === "high"
      ? 22
      : input.costBurden === "medium"
        ? 12
        : input.costBurden === "low"
          ? 5
          : 0;

  const relevance = VALUE_SCORE[input.relevance];
  const editorialLegitimacy = VALUE_SCORE[input.editorialLegitimacy];
  const audienceOverlap = VALUE_SCORE[input.audienceOverlap];
  const referralValue = VALUE_SCORE[input.referralValue];
  const seoValue = VALUE_SCORE[input.seoValue];
  const targetPageFit = VALUE_SCORE[input.targetPageFit];
  const likelihood = LIKELIHOOD_SCORE[input.likelihood];
  const effortPenalty = EFFORT_PENALTY[input.effort];
  const spamRiskPenalty = SPAM_PENALTY[input.spamRisk];

  // Weights: relevance + legitimacy + audience dominate; SEO is meaningful but not DA-proxy.
  const positive =
    relevance * 0.18 +
    editorialLegitimacy * 0.16 +
    audienceOverlap * 0.14 +
    referralValue * 0.14 +
    seoValue * 0.12 +
    targetPageFit * 0.12 +
    likelihood * 0.14;

  const normalized = clamp(
    positive - effortPenalty - costPenalty - spamRiskPenalty,
  );

  return {
    band: bandFromNormalized(normalized),
    normalized,
    breakdown: {
      relevance,
      editorialLegitimacy,
      audienceOverlap,
      referralValue,
      seoValue,
      targetPageFit,
      likelihood,
      effortPenalty,
      costPenalty,
      spamRiskPenalty,
      notes: input.notes ?? [],
    },
  };
}

/** Re-export helper so agents can run compliance then score in one place. */
export function scoreWithCompliance(
  input: ScoreInput &
    Parameters<typeof evaluateLinkSpamCompliance>[0],
): ReturnType<typeof scoreOpportunity> & { compliance: ComplianceVerdict } {
  const compliance = evaluateLinkSpamCompliance(input);
  const scored = scoreOpportunity({
    ...input,
    spamRisk: compliance.reject ? "link-spam-avoid" : input.spamRisk,
    compliance,
  });
  return { ...scored, compliance };
}
