import type {
  CompetitorPackInput,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { confidence, dim, weightedMean } from "./score-utils";
import { COMPETITIVE_DIMENSION_WEIGHTS } from "./weights";

/**
 * Competitive Content Strength — requires competitor research pack.
 * Never inferred from on-site quality alone.
 */
export function scoreCompetitiveStrength(input: {
  pack: CompetitorPackInput | null | undefined;
}): ScoredComponent {
  if (!input.pack || input.pack.dimensions.length === 0) {
    return {
      id: "competitive-content-strength",
      availability: "unavailable",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "No competitor research pack supplied — competitive strength not inferred from on-site quality",
      ]),
      evidence: [],
      notes: [
        "Questions 5–7 (vs competitors) deferred until competitor research exists",
      ],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const pack = input.pack;
  const byId = new Map(pack.dimensions.map((d) => [d.id, d]));
  const dims = Object.entries(COMPETITIVE_DIMENSION_WEIGHTS)
    .filter(([id]) => byId.has(id))
    .map(([id, weight]) => {
      const d = byId.get(id)!;
      return dim(id, d.score, weight, d.reason, d.evidence);
    });

  for (const d of pack.dimensions) {
    if (!(d.id in COMPETITIVE_DIMENSION_WEIGHTS)) {
      dims.push(dim(d.id, d.score, 0.02, d.reason, d.evidence));
    }
  }

  const score = weightedMean(dims);
  const sample = pack.competitorsSampled;
  const reasons = [
    `${sample} competitor(s) sampled`,
    pack.backlinkDataAvailable
      ? "Backlink data included in pack"
      : "Backlink data unavailable in pack",
    ...pack.notes,
  ];
  const level =
    sample >= 5 && pack.backlinkDataAvailable
      ? "high"
      : sample >= 5
        ? "medium"
        : sample >= 2
          ? "medium"
          : "low";

  return {
    id: "competitive-content-strength",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions: dims,
    confidence: confidence(level, reasons),
    evidence: dims.slice(0, 8).map((d) => ({
      label: d.id,
      detail: d.reason,
      sourceSystem: "competitor-research",
    })),
    notes: pack.notes,
    strongerThan: pack.strongerThan,
    weakerThan: pack.weakerThan,
  };
}
