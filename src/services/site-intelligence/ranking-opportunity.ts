import type {
  AuthorityLimitations,
  RankingOpportunityInput,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { opportunityBandForScore } from "./bands";
import { clampScore, confidence, dim, weightedMean } from "./score-utils";
import { RANKING_OPPORTUNITY_WEIGHTS } from "./weights";

const NEUTRAL = 50;

type FactorKey = keyof typeof RANKING_OPPORTUNITY_WEIGHTS;

function resolveFactors(
  input: RankingOpportunityInput,
  authority: AuthorityLimitations,
  visibilityAvailable: boolean,
): { id: FactorKey; score: number; reason: string; partial?: boolean }[] {
  if (input.factors && input.factors.length > 0) {
    return Object.keys(RANKING_OPPORTUNITY_WEIGHTS).map((id) => {
      const found = input.factors!.find((f) => f.id === id);
      return {
        id: id as FactorKey,
        score: found?.score ?? NEUTRAL,
        reason: found?.reason ?? `Neutral default for missing factor ${id}`,
        partial: !found,
      };
    });
  }

  const authorityScore =
    input.authorityGap ??
    (authority.impactOnOpportunity === "constraining"
      ? 25
      : authority.impactOnOpportunity === "supporting"
        ? 75
        : NEUTRAL);

  const visibilityScore =
    input.currentVisibility ??
    (visibilityAvailable ? NEUTRAL : NEUTRAL);

  return [
    {
      id: "intent-fit",
      score: input.intentFit ?? NEUTRAL,
      reason: input.intentFit != null ? "Provided intent fit" : "Neutral intent fit (unspecified)",
      partial: input.intentFit == null,
    },
    {
      id: "content-quality",
      score: input.contentQuality ?? NEUTRAL,
      reason:
        input.contentQuality != null
          ? "Provided content quality for target"
          : "Neutral content quality (unspecified)",
      partial: input.contentQuality == null,
    },
    {
      id: "serp-competitor-strength",
      score: input.serpCompetitorStrengthInverse ?? NEUTRAL,
      reason:
        input.serpCompetitorStrengthInverse != null
          ? "Inverse SERP competitor strength (higher = weaker SERP / better opportunity)"
          : "Neutral SERP competitor factor — competitor research may be missing",
      partial: input.serpCompetitorStrengthInverse == null,
    },
    {
      id: "topical-coverage",
      score: input.topicalCoverage ?? NEUTRAL,
      reason:
        input.topicalCoverage != null
          ? "Provided topical coverage"
          : "Neutral topical coverage",
      partial: input.topicalCoverage == null,
    },
    {
      id: "differentiation",
      score: input.differentiation ?? NEUTRAL,
      reason:
        input.differentiation != null
          ? "Provided differentiation"
          : "Neutral differentiation",
      partial: input.differentiation == null,
    },
    {
      id: "internal-link-support",
      score: input.internalLinkSupport ?? NEUTRAL,
      reason:
        input.internalLinkSupport != null
          ? "Provided internal-link support"
          : "Neutral internal-link support",
      partial: input.internalLinkSupport == null,
    },
    {
      id: "evidence-depth",
      score: input.evidenceDepth ?? NEUTRAL,
      reason:
        input.evidenceDepth != null
          ? "Provided evidence depth"
          : "Neutral evidence depth",
      partial: input.evidenceDepth == null,
    },
    {
      id: "freshness",
      score: input.freshness ?? NEUTRAL,
      reason:
        input.freshness != null ? "Provided freshness" : "Neutral freshness",
      partial: input.freshness == null,
    },
    {
      id: "current-visibility",
      score: visibilityScore,
      reason: visibilityAvailable
        ? input.currentVisibility != null
          ? "Current visibility from search performance"
          : "Visibility data exists but factor not specified — neutral"
        : "Visibility DATA NOT AVAILABLE — neutral factor (not fabricated)",
      partial: !visibilityAvailable || input.currentVisibility == null,
    },
    {
      id: "authority-gap",
      score: authorityScore,
      reason:
        authority.status === "unavailable"
          ? "Authority/off-site data unavailable — neutral (does not invent DA)"
          : `Authority impact: ${authority.impactOnOpportunity}`,
      partial: authority.status === "unavailable",
    },
  ];
}

/**
 * Ranking Opportunity — per query/topic/cluster.
 * Opportunity assessment only — never a ranking probability.
 */
export function scoreRankingOpportunity(input: {
  opportunity: RankingOpportunityInput;
  authority: AuthorityLimitations;
  visibilityAvailable: boolean;
}): ScoredComponent {
  const factors = resolveFactors(
    input.opportunity,
    input.authority,
    input.visibilityAvailable,
  );
  const dims = factors.map((f) =>
    dim(
      f.id,
      f.score,
      RANKING_OPPORTUNITY_WEIGHTS[f.id],
      f.reason,
      [],
      f.partial,
    ),
  );
  const score = weightedMean(dims);
  const partialCount = dims.filter((d) => d.partial).length;
  const level =
    partialCount >= 5
      ? "low"
      : partialCount >= 2 || input.authority.status === "unavailable"
        ? "medium"
        : "high";

  return {
    id: "ranking-opportunity",
    availability: "scored",
    score,
    band: null,
    opportunityBand: opportunityBandForScore(score),
    dimensions: dims,
    confidence: confidence(level, [
      `Scope: ${input.opportunity.scopeKind}:${input.opportunity.scopeId}`,
      "This is an opportunity assessment — not a ranking probability",
      `${partialCount} factor(s) used neutral/partial defaults`,
    ]),
    evidence: dims.map((d) => ({
      label: d.id,
      detail: `${d.score}/100 — ${d.reason}`,
    })),
    notes: [
      `Opportunity band for ${input.opportunity.scopeKind} "${input.opportunity.scopeId}"`,
    ],
    strongerThan: [],
    weakerThan: [],
  };
}

export function defaultAuthorityUnavailable(): AuthorityLimitations {
  return {
    status: "unavailable",
    confidence: "low",
    notes: ["Backlink / domain-authority data not integrated for this run"],
    knownGaps: [],
    impactOnOpportunity: "neutral-unknown",
  };
}

export function clampOpportunityScore(n: number): number {
  return clampScore(n);
}
