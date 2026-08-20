import type {
  ExperienceDimensionInput,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { confidence, dim, equalMean } from "./score-utils";

const EXPECTED_EXPERIENCE_IDS = [
  "navigation",
  "search",
  "information-architecture",
  "visual-hierarchy",
  "mobile-usability",
  "page-readability",
  "decision-workflow",
  "tool-integration",
  "downloads-resources",
  "comparison-experience",
  "accessibility",
  "performance",
  "dead-ends",
  "consistency",
] as const;

/**
 * Website Experience — broader than SEO; structural inventory + UX signals.
 */
export function scoreWebsiteExperience(input: {
  dimensions: ExperienceDimensionInput[];
}): ScoredComponent {
  if (input.dimensions.length === 0) {
    return {
      id: "website-experience",
      availability: "unavailable",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "No experience dimension inputs supplied",
      ]),
      evidence: [],
      notes: [],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const byId = new Map(input.dimensions.map((d) => [d.id, d]));
  const dims = EXPECTED_EXPERIENCE_IDS.filter((id) => byId.has(id)).map(
    (id) => {
      const d = byId.get(id)!;
      return dim(id, d.score, 1, d.reason, d.evidence);
    },
  );
  // Include any extra provided dimensions
  for (const d of input.dimensions) {
    if (!EXPECTED_EXPERIENCE_IDS.includes(d.id as (typeof EXPECTED_EXPERIENCE_IDS)[number])) {
      dims.push(dim(d.id, d.score, 1, d.reason, d.evidence));
    }
  }

  const score = equalMean(dims.map((d) => d.score));
  const coverage = dims.length / EXPECTED_EXPERIENCE_IDS.length;
  const level =
    coverage >= 0.85 ? "high" : coverage >= 0.5 ? "medium" : "low";

  return {
    id: "website-experience",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions: dims,
    confidence: confidence(level, [
      `${dims.length}/${EXPECTED_EXPERIENCE_IDS.length} expected experience dimensions provided`,
      "Experience score is structural/product UX — not an SEO ranking signal",
    ]),
    evidence: dims.slice(0, 6).map((d) => ({
      label: d.id,
      detail: d.reason,
    })),
    notes: [],
    strongerThan: [],
    weakerThan: [],
  };
}
