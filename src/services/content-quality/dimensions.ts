import type {
  ContentQualityDimensionId,
  QualityBand,
} from "@/domain/schemas/content-quality";

export const DIMENSION_LABELS: Record<ContentQualityDimensionId, string> = {
  "user-intent-fit": "User Intent Fit",
  "content-completeness": "Content Completeness",
  "subject-depth": "Subject Depth",
  "original-value": "Original Value",
  "evidence-source-quality": "Evidence / Source Quality",
  "research-freshness": "Research Freshness",
  "decision-support": "Decision Support",
  actionability: "Actionability",
  "structure-readability": "Structure / Readability",
  "visual-media-support": "Visual / Media Support",
  "internal-linking": "Internal Linking",
  "journey-next-step": "Journey / Next Step",
  "trust-transparency": "Trust / Transparency",
  "content-differentiation": "Content Differentiation",
  "page-type-specific": "Page-Type Specific Quality",
};

export const ALL_DIMENSION_IDS = Object.keys(
  DIMENSION_LABELS,
) as ContentQualityDimensionId[];

/** Quality bands for overall 0–100 score (integer). */
export const QUALITY_BAND_RANGES: {
  band: QualityBand;
  min: number;
  max: number;
  label: string;
}[] = [
  { band: "excellent", min: 90, max: 100, label: "EXCELLENT" },
  { band: "strong", min: 80, max: 89, label: "STRONG" },
  {
    band: "good-but-improvable",
    min: 70,
    max: 79,
    label: "GOOD BUT IMPROVABLE",
  },
  { band: "weak", min: 60, max: 69, label: "WEAK" },
  { band: "poor", min: 40, max: 59, label: "POOR" },
  { band: "critical-incomplete", min: 0, max: 39, label: "CRITICAL / INCOMPLETE" },
];

export function qualityBandForScore(score: number): QualityBand {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const row of QUALITY_BAND_RANGES) {
    if (clamped >= row.min && clamped <= row.max) return row.band;
  }
  return "critical-incomplete";
}

export function qualityBandLabel(band: QualityBand): string {
  return (
    QUALITY_BAND_RANGES.find((r) => r.band === band)?.label ?? band.toUpperCase()
  );
}

/**
 * Weighted overall score from dimension 0–5 scores.
 * Returns integer 0–100 — no fake decimal precision.
 */
export function computeOverallScore(
  dimensions: { score: number; weight: number }[],
): number {
  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
  if (totalWeight <= 0) return 0;
  const weighted =
    dimensions.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight;
  // Map 0–5 → 0–100
  return Math.round((weighted / 5) * 100);
}
