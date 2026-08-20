import type {
  EcosystemDimensionInput,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { confidence, dim, weightedMean } from "./score-utils";
import { ECOSYSTEM_DIMENSION_WEIGHTS } from "./weights";

/**
 * Content Ecosystem Strength from map / cluster / linking inputs.
 */
export function scoreContentEcosystem(input: {
  dimensions: EcosystemDimensionInput[];
}): ScoredComponent {
  if (input.dimensions.length === 0) {
    return {
      id: "content-ecosystem-strength",
      availability: "unavailable",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "No ecosystem dimension inputs supplied",
      ]),
      evidence: [],
      notes: [],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const byId = new Map(input.dimensions.map((d) => [d.id, d]));
  const dims = Object.entries(ECOSYSTEM_DIMENSION_WEIGHTS)
    .filter(([id]) => byId.has(id))
    .map(([id, weight]) => {
      const d = byId.get(id)!;
      return dim(id, d.score, weight, d.reason, d.evidence);
    });

  // Unlisted extras share residual equal weight among themselves only if none of canonical present — skip; require canonical IDs.
  for (const d of input.dimensions) {
    if (!(d.id in ECOSYSTEM_DIMENSION_WEIGHTS)) {
      dims.push(dim(d.id, d.score, 0.01, d.reason, d.evidence));
    }
  }

  if (dims.length === 0) {
    return {
      id: "content-ecosystem-strength",
      availability: "unavailable",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "Ecosystem inputs did not match known dimension IDs",
      ]),
      evidence: [],
      notes: [],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const score = weightedMean(dims);
  const coverage =
    Object.keys(ECOSYSTEM_DIMENSION_WEIGHTS).filter((id) => byId.has(id))
      .length / Object.keys(ECOSYSTEM_DIMENSION_WEIGHTS).length;

  return {
    id: "content-ecosystem-strength",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions: dims,
    confidence: confidence(
      coverage >= 0.7 ? "high" : coverage >= 0.4 ? "medium" : "low",
      [
        `${Math.round(coverage * 100)}% of ecosystem dimensions supplied`,
        "Reuse master map / clusters / internal-linking — do not invent coverage",
      ],
    ),
    evidence: dims.slice(0, 8).map((d) => ({
      label: d.id,
      detail: `${d.score}/100 — ${d.reason}`,
      sourceSystem: "content-ecosystem",
    })),
    notes: [],
    strongerThan: [],
    weakerThan: [],
  };
}
