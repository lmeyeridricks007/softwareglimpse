import type {
  RankingOpportunityBand,
  SiteIntelligenceBand,
} from "@/domain/schemas/site-intelligence";

export const SITE_BAND_RANGES: {
  band: SiteIntelligenceBand;
  min: number;
  max: number;
  label: string;
}[] = [
  { band: "excellent", min: 90, max: 100, label: "Excellent" },
  { band: "strong", min: 80, max: 89, label: "Strong" },
  { band: "good", min: 70, max: 79, label: "Good" },
  { band: "fair", min: 60, max: 69, label: "Fair" },
  { band: "weak", min: 40, max: 59, label: "Weak" },
  { band: "critical", min: 0, max: 39, label: "Critical" },
];

export const OPPORTUNITY_BAND_RANGES: {
  band: RankingOpportunityBand;
  min: number;
  max: number;
  label: string;
}[] = [
  { band: "strong", min: 80, max: 100, label: "STRONG" },
  { band: "good", min: 60, max: 79, label: "GOOD" },
  { band: "moderate", min: 40, max: 59, label: "MODERATE" },
  { band: "low", min: 20, max: 39, label: "LOW" },
  { band: "very-low", min: 0, max: 19, label: "VERY LOW" },
];

export function siteBandForScore(score: number): SiteIntelligenceBand {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const row of SITE_BAND_RANGES) {
    if (clamped >= row.min && clamped <= row.max) return row.band;
  }
  return "critical";
}

export function siteBandLabel(band: SiteIntelligenceBand): string {
  return SITE_BAND_RANGES.find((r) => r.band === band)?.label ?? band;
}

export function opportunityBandForScore(
  score: number,
): RankingOpportunityBand {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const row of OPPORTUNITY_BAND_RANGES) {
    if (clamped >= row.min && clamped <= row.max) return row.band;
  }
  return "very-low";
}

export function opportunityBandLabel(band: RankingOpportunityBand): string {
  return (
    OPPORTUNITY_BAND_RANGES.find((r) => r.band === band)?.label ??
    band.toUpperCase()
  );
}
