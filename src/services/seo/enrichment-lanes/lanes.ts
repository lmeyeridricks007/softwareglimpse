import {
  DEFAULT_LANE_ALLOCATION,
  LANE_A_MIN_IMPRESSIONS,
  type EnrichmentLane,
  type GscEvidenceInput,
  type LaneAllocation,
  type LaneAwareItem,
  type LaneClassification,
  type StrategicOverrideReason,
  type StrategicSignalsInput,
} from "./types";

/** Soft floors for Lane B strategic significance. */
const STRATEGIC_CATEGORY_FLOOR = 75;
const STRATEGIC_PRODUCT_FLOOR = 18;
const STRATEGIC_COMMERCIAL_FLOOR = 25;
const STRATEGIC_JOURNEY_FLOOR = 18;
const STRATEGIC_SCORE_LANE_B_FLOOR = 40;

/**
 * Score observed search / citation demand only. Never invents impressions.
 */
export function scoreGscEvidence(input: GscEvidenceInput): number {
  const impressions = Math.max(0, input.impressions || 0);
  const clicks = Math.max(0, input.clicks || 0);
  const position = input.position ?? null;
  const opportunity = Math.max(0, input.opportunityScore || 0);

  let score = 0;
  // Log-scaled demand — strong GSC pages dominate catalogue heuristics.
  if (impressions > 0) {
    score += Math.min(80, Math.log10(1 + impressions) * 28);
  }
  if (clicks > 0) {
    score += Math.min(25, Math.log10(1 + clicks) * 18 + 6);
  }
  if (position != null && impressions > 0) {
    if (position <= 10) score += 18;
    else if (position <= 20) score += 14;
    else if (position <= 35) score += 10;
    else if (position <= 50) score += 6;
  }
  score += Math.min(35, opportunity * 0.4);
  if (input.hasDirectQuery) score += 12;
  // Authority is reported separately; keep a light contribution to demand.
  if ((input.knownBacklinks ?? 0) > 0) {
    score += Math.min(10, 3 + (input.knownBacklinks ?? 0));
  }
  if ((input.realAiCitations ?? 0) > 0) {
    score += Math.min(8, 2 + (input.realAiCitations ?? 0) * 2);
  }
  return Number(score.toFixed(2));
}

/** External authority only — never invents citations or backlinks. */
export function scoreAuthorityEvidence(input: GscEvidenceInput): number {
  let score = 0;
  if ((input.knownBacklinks ?? 0) > 0) {
    score += Math.min(40, 8 + (input.knownBacklinks ?? 0) * 4);
  }
  if ((input.realAiCitations ?? 0) > 0) {
    score += Math.min(35, 6 + (input.realAiCitations ?? 0) * 5);
  }
  return Number(score.toFixed(2));
}

export function hasProvenSearchDemand(input: GscEvidenceInput): boolean {
  const impressions = input.impressions || 0;
  const clicks = input.clicks || 0;
  if (impressions >= LANE_A_MIN_IMPRESSIONS) return true;
  if (clicks > 0 && impressions > 0) return true;
  if (input.hasDirectQuery && impressions > 0) return true;
  if ((input.knownBacklinks ?? 0) > 0) return true;
  if ((input.realAiCitations ?? 0) > 0) return true;
  return false;
}

export function scoreStrategicSignals(
  input: StrategicSignalsInput,
): { score: number; reasons: StrategicOverrideReason[]; commercialScore: number } {
  const reasons: StrategicOverrideReason[] = [];
  let score = 0;

  const cat = Math.max(0, input.categoryImportance);
  score += cat * 0.35;
  if (cat >= STRATEGIC_CATEGORY_FLOOR) {
    reasons.push("IMPORTANT_CATEGORY");
  }

  const pop = Math.max(0, input.productPopularity);
  score += pop;
  if (pop >= STRATEGIC_PRODUCT_FLOOR) {
    reasons.push("POPULAR_PRODUCT");
  }

  const commercial = Math.max(0, input.commercialRelevance);
  score += commercial;
  if (commercial >= STRATEGIC_COMMERCIAL_FLOOR) {
    reasons.push("HIGH_COMMERCIAL_RELEVANCE");
  }

  const journey = Math.max(0, input.internalJourneyStrength);
  score += journey;
  if (journey >= STRATEGIC_JOURNEY_FLOOR) {
    reasons.push("STRONG_INTERNAL_JOURNEY");
  }

  if (input.competitorRelationship) {
    score += 28;
    reasons.push("KEY_COMPETITOR_RELATIONSHIP");
  }

  if (input.importantBuyerQuestion) {
    score += 16;
    reasons.push("IMPORTANT_BUYER_QUESTION");
  }

  return {
    score: Number(score.toFixed(2)),
    reasons: [...new Set(reasons)],
    commercialScore: Number(commercial.toFixed(2)),
  };
}

/**
 * Classify into Lane A / B / C and compute within-lane priority.
 *
 * Rule: a zero-impression page must not outrank a strong GSC opportunity
 * unless strategicOverride === true (Lane B only — never promoted to Lane A
 * by catalogue/commercial heuristics alone).
 */
export function classifyEnrichmentLane(input: {
  gsc: GscEvidenceInput;
  strategic: StrategicSignalsInput;
  qualityGap: number;
}): LaneClassification {
  const gscEvidenceScore = scoreGscEvidence(input.gsc);
  const authorityScore = scoreAuthorityEvidence(input.gsc);
  const {
    score: strategicScore,
    reasons,
    commercialScore,
  } = scoreStrategicSignals(input.strategic);
  const qualityGap = Math.max(0, input.qualityGap);
  const proven = hasProvenSearchDemand(input.gsc);

  let lane: EnrichmentLane;
  let orderingReason: string;

  if (proven) {
    lane = "A";
    orderingReason =
      "Lane A — proven search demand (GSC impressions/clicks/position" +
      (input.gsc.hasDirectQuery ? ", direct page×query" : "") +
      ((input.gsc.knownBacklinks ?? 0) > 0 ? ", known backlinks" : "") +
      ((input.gsc.realAiCitations ?? 0) > 0 ? ", REAL AI citations" : "") +
      ")";
  } else if (
    reasons.length > 0 &&
    strategicScore >= STRATEGIC_SCORE_LANE_B_FLOOR
  ) {
    lane = "B";
    orderingReason = `Lane B — strategic existing content (${reasons.join(", ")}); no meaningful GSC demand yet`;
  } else {
    lane = "C";
    orderingReason =
      "Lane C — long-tail improvement; preserve and enrich after A/B";
  }

  const strategicOverride = lane === "B" && reasons.length > 0;

  // Within-lane score: Lane A dominated by GSC evidence; B by strategy; C by gap.
  // Commercial/authority never alone invent Lane A rank over proven demand.
  const priorityScore =
    lane === "A"
      ? Number(
          (
            gscEvidenceScore * 1.6 +
            qualityGap * 0.45 +
            strategicScore * 0.15 +
            authorityScore * 0.2
          ).toFixed(2),
        )
      : lane === "B"
        ? Number(
            (
              strategicScore * 1.2 +
              qualityGap * 0.55 +
              commercialScore * 0.15 +
              gscEvidenceScore * 0.1
            ).toFixed(2),
          )
        : Number(
            (qualityGap * 0.9 + strategicScore * 0.25 + 5).toFixed(2),
          );

  return {
    lane,
    gscEvidenceScore,
    gscDemandScore: gscEvidenceScore,
    strategicScore,
    qualityGap: Number(qualityGap.toFixed(2)),
    qualityGapScore: Number(qualityGap.toFixed(2)),
    commercialScore,
    authorityScore,
    priorityScore,
    overallScore: priorityScore,
    strategicOverride,
    strategicOverrideReasons: strategicOverride ? reasons : [],
    orderingReason,
    reason: orderingReason,
    hasProvenDemand: proven,
  };
}

export function normalizeLaneAllocation(
  allocation: Partial<LaneAllocation> = {},
): LaneAllocation {
  const raw = {
    laneA: allocation.laneA ?? DEFAULT_LANE_ALLOCATION.laneA,
    laneB: allocation.laneB ?? DEFAULT_LANE_ALLOCATION.laneB,
    laneC: allocation.laneC ?? DEFAULT_LANE_ALLOCATION.laneC,
  };
  const sum = raw.laneA + raw.laneB + raw.laneC;
  if (sum <= 0) return { ...DEFAULT_LANE_ALLOCATION };
  return {
    laneA: raw.laneA / sum,
    laneB: raw.laneB / sum,
    laneC: raw.laneC / sum,
  };
}

/**
 * Build an execution batch with configurable A/B/C mix.
 * Exhausts preferred lanes first, then backfills from remaining lanes
 * so batch size is still met when a lane is thin.
 */
export function allocateEnrichmentBatch<T extends LaneAwareItem>(
  items: T[],
  batchSize: number,
  allocation: Partial<LaneAllocation> = {},
): T[] {
  if (batchSize <= 0) return [];
  const mix = normalizeLaneAllocation(allocation);

  const byLane: Record<EnrichmentLane, T[]> = {
    A: items
      .filter((i) => i.lane === "A")
      .sort((a, b) => b.priorityScore - a.priorityScore),
    B: items
      .filter((i) => i.lane === "B")
      .sort((a, b) => b.priorityScore - a.priorityScore),
    C: items
      .filter((i) => i.lane === "C")
      .sort((a, b) => b.priorityScore - a.priorityScore),
  };

  let slotsA = Math.round(batchSize * mix.laneA);
  let slotsB = Math.round(batchSize * mix.laneB);
  let slotsC = batchSize - slotsA - slotsB;
  if (slotsC < 0) {
    slotsA = Math.max(0, slotsA + slotsC);
    slotsC = 0;
  }
  // Prefer at least one B/C slot on larger batches when ratio allows.
  if (batchSize >= 10 && mix.laneC > 0 && slotsC === 0) {
    if (slotsA > slotsB) slotsA -= 1;
    else if (slotsB > 0) slotsB -= 1;
    slotsC = 1;
  }

  const take = (lane: EnrichmentLane, n: number): T[] =>
    byLane[lane].splice(0, Math.max(0, n));

  const selected: T[] = [
    ...take("A", slotsA),
    ...take("B", slotsB),
    ...take("C", slotsC),
  ];

  // Backfill shortage from A → B → C priority order.
  while (selected.length < batchSize) {
    const next =
      byLane.A.shift() ?? byLane.B.shift() ?? byLane.C.shift() ?? null;
    if (!next) break;
    selected.push(next);
  }

  // Stable presentation: Lane A first, then B, then C; score within lane.
  const laneOrder: Record<EnrichmentLane, number> = { A: 0, B: 1, C: 2 };
  return selected.sort(
    (a, b) =>
      laneOrder[a.lane] - laneOrder[b.lane] ||
      b.priorityScore - a.priorityScore,
  );
}

/**
 * Global sort key: Lane A before B before C; never let a Lane C/B
 * zero-demand page sort above Lane A purely on catalogue heuristics.
 */
export function compareByLaneThenScore(
  a: LaneAwareItem,
  b: LaneAwareItem,
): number {
  const laneOrder: Record<EnrichmentLane, number> = { A: 0, B: 1, C: 2 };
  return (
    laneOrder[a.lane] - laneOrder[b.lane] ||
    b.priorityScore - a.priorityScore
  );
}

/** Flat report fields shared by guide/compare/testing/refresh/link surfaces. */
export function laneReportFields(c: LaneClassification) {
  return {
    lane: c.lane,
    priorityScore: c.priorityScore,
    overallScore: c.overallScore,
    gscEvidenceScore: c.gscEvidenceScore,
    gscDemandScore: c.gscDemandScore,
    strategicScore: c.strategicScore,
    qualityGap: c.qualityGap,
    qualityGapScore: c.qualityGapScore,
    commercialScore: c.commercialScore,
    authorityScore: c.authorityScore,
    strategicOverride: c.strategicOverride,
    strategicOverrideReasons: c.strategicOverrideReasons,
    orderingReason: c.orderingReason,
    reason: c.reason,
    hasProvenDemand: c.hasProvenDemand,
  };
}
