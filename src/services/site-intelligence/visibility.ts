import type {
  ScoredComponent,
  SearchVisibilityMetricsInput,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { clampScore, confidence, dim } from "./score-utils";
import { VISIBILITY_FACTOR_WEIGHTS } from "./weights";

/**
 * Search Visibility — ONLY when performance data exists.
 * Never fabricated from page quality.
 */
export function scoreSearchVisibility(input: {
  metrics: SearchVisibilityMetricsInput | null | undefined;
}): ScoredComponent {
  if (!input.metrics) {
    return {
      id: "search-visibility",
      availability: "data-not-available",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "DATA NOT AVAILABLE — no search-performance snapshot",
      ]),
      evidence: [],
      notes: [
        "Visibility not fabricated from page quality or technical scores",
      ],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const m = input.metrics;
  const dims = [
    dim(
      "indexed-performing-coverage",
      m.indexedPerformingCoverage,
      VISIBILITY_FACTOR_WEIGHTS.indexedPerformingCoverage,
      "Share of indexable pages with measured impressions",
    ),
    dim(
      "impressions",
      m.impressionsNorm,
      VISIBILITY_FACTOR_WEIGHTS.impressionsNorm,
      "Normalized impressions volume",
    ),
    dim(
      "clicks",
      m.clicksNorm,
      VISIBILITY_FACTOR_WEIGHTS.clicksNorm,
      "Normalized clicks volume",
    ),
    dim(
      "ctr",
      m.ctrNorm,
      VISIBILITY_FACTOR_WEIGHTS.ctrNorm,
      "CTR vs expected band (sample-guarded upstream)",
    ),
    dim(
      "position-distribution",
      m.positionDistributionNorm,
      VISIBILITY_FACTOR_WEIGHTS.positionDistributionNorm,
      "Ranking distribution quality",
    ),
    dim(
      "query-coverage",
      m.queryCoverageNorm,
      VISIBILITY_FACTOR_WEIGHTS.queryCoverageNorm,
      "Non-brand query coverage",
    ),
    dim(
      "non-brand-click-share",
      m.nonBrandClickShareNorm,
      VISIBILITY_FACTOR_WEIGHTS.nonBrandClickShareNorm,
      "Non-brand click share",
    ),
  ];

  const score = clampScore(
    dims.reduce((s, d) => s + d.score * d.weight, 0) /
      dims.reduce((s, d) => s + d.weight, 0),
  );

  const reasons = [
    ...(m.synthetic
      ? [
          "SYNTHETIC search-performance data — not live SoftwareGlimpse GSC; do not claim live visibility",
        ]
      : ["Search-performance metrics present"]),
    ...m.notes,
  ];

  return {
    id: "search-visibility",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions: dims,
    confidence: confidence(m.synthetic ? "medium" : "high", reasons),
    evidence: dims.map((d) => ({
      label: d.id,
      detail: `${d.score}/100`,
      sourceSystem: m.synthetic ? "seo-fixtures" : "search-performance",
    })),
    notes: m.notes,
    strongerThan: [],
    weakerThan: [],
  };
}
