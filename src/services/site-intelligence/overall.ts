import type {
  OverallBreakdownRow,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { clampScore, confidence, worstConfidence } from "./score-utils";
import { OVERALL_COMPONENT_WEIGHTS } from "./weights";

type OverallPart = {
  id: keyof typeof OVERALL_COMPONENT_WEIGHTS;
  component: ScoredComponent;
};

/**
 * Overall Website Quality from A–E only.
 * Excludes Ranking Opportunity and Search Visibility.
 * Renormalizes when Competitive Strength is unavailable.
 */
export function scoreOverallWebsiteQuality(parts: {
  technical: ScoredComponent;
  content: ScoredComponent;
  experience: ScoredComponent;
  ecosystem: ScoredComponent;
  competitive: ScoredComponent;
}): {
  overall: ScoredComponent;
  breakdown: OverallBreakdownRow[];
} {
  const candidates: OverallPart[] = [
    { id: "technical-seo-health", component: parts.technical },
    { id: "content-quality", component: parts.content },
    { id: "website-experience", component: parts.experience },
    { id: "content-ecosystem-strength", component: parts.ecosystem },
    { id: "competitive-content-strength", component: parts.competitive },
  ];

  const available = candidates.filter(
    (c) => c.component.availability === "scored" && c.component.score != null,
  );

  if (available.length === 0) {
    return {
      overall: {
        id: "overall-website-quality",
        availability: "unavailable",
        score: null,
        band: null,
        dimensions: [],
        confidence: confidence("low", [
          "No scored components available for Overall Website Quality",
        ]),
        evidence: [],
        notes: [],
        strongerThan: [],
        weakerThan: [],
      },
      breakdown: [],
    };
  }

  const rawWeightSum = available.reduce(
    (s, c) => s + OVERALL_COMPONENT_WEIGHTS[c.id],
    0,
  );
  const breakdown: OverallBreakdownRow[] = available.map((c) => ({
    componentId: c.id,
    score: c.component.score!,
    weight: OVERALL_COMPONENT_WEIGHTS[c.id] / rawWeightSum,
    confidence: c.component.confidence.level,
  }));

  const score = clampScore(
    breakdown.reduce((s, row) => s + row.score * row.weight, 0),
  );

  const reasons: string[] = [
    `Weighted from ${available.length} component(s); Ranking Opportunity and Search Visibility excluded`,
  ];
  if (parts.competitive.availability !== "scored") {
    reasons.push(
      "Competitive Strength unavailable — weights renormalized across A–D",
    );
  }
  for (const row of breakdown) {
    reasons.push(
      `${row.componentId}: ${row.score} × weight ${row.weight.toFixed(2)}`,
    );
  }

  const level = worstConfidence(breakdown.map((b) => b.confidence));
  const adjustedLevel =
    parts.competitive.availability !== "scored" && level === "high"
      ? "medium"
      : level;

  return {
    overall: {
      id: "overall-website-quality",
      availability: "scored",
      score,
      band: siteBandForScore(score),
      dimensions: [],
      confidence: confidence(adjustedLevel, reasons),
      evidence: breakdown.map((b) => ({
        label: b.componentId,
        detail: `${b.score}/100 (weight ${b.weight.toFixed(2)})`,
      })),
      notes: [
        "Overall Website Quality is not a ranking prediction or chance-of-ranking percentage",
      ],
      strongerThan: [],
      weakerThan: [],
    },
    breakdown,
  };
}
