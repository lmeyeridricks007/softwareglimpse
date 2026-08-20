import type {
  OpportunityScoreBand,
  ValueBand,
} from "@/domain/schemas/authority-intelligence";
import type { DigitalPrIdea, LinkabilityDimensions } from "./types";

type Band = ValueBand;

const BAND_POINTS: Record<Band, number> = {
  excellent: 12,
  strong: 10,
  good: 7,
  low: 3,
  unknown: 4,
  none: 0,
};

export function scoreLinkability(dims: LinkabilityDimensions): number {
  const keys = Object.keys(dims) as Array<keyof LinkabilityDimensions>;
  let sum = 0;
  for (const k of keys) {
    sum += BAND_POINTS[dims[k] as Band] ?? 4;
  }
  // 8 dimensions × max 12 = 96 → normalize to 0–100
  return Math.min(100, Math.round((sum / (keys.length * 12)) * 100));
}

export function bandFromScore(score: number): OpportunityScoreBand {
  if (score >= 85) return "EXCELLENT";
  if (score >= 70) return "STRONG";
  if (score >= 55) return "GOOD";
  if (score >= 40) return "LOW";
  return "AVOID";
}

const STATUS_RANK: Record<DigitalPrIdea["status"], number> = {
  ready: 0,
  "near-ready": 1,
  "needs-new-research": 2,
  deferred: 3,
};

export function rankPrIdeas(ideas: DigitalPrIdea[]): DigitalPrIdea[] {
  const sorted = [...ideas].sort((a, b) => {
    const sr = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (sr !== 0) return sr;
    if (b.scoreNormalized !== a.scoreNormalized) {
      return b.scoreNormalized - a.scoreNormalized;
    }
    return a.title.localeCompare(b.title);
  });
  return sorted.map((idea, i) => ({
    ...idea,
    priority: i + 1,
    scoreBand: bandFromScore(idea.scoreNormalized),
  }));
}

/** Reject ideas that claim invented stats (guardrail). */
export function assertNoInventedStats(ideas: DigitalPrIdea[]): void {
  for (const idea of ideas) {
    if (idea.inventsStatistics !== false) {
      throw new Error(`PR idea ${idea.id} must set inventsStatistics: false`);
    }
    if (
      idea.status === "ready" &&
      idea.newResearchNeeded.some((n) =>
        /survey of buyers|panel data|empirical timeline/i.test(n),
      )
    ) {
      throw new Error(
        `PR idea ${idea.id} marked ready but requires primary survey/empirical research`,
      );
    }
  }
}

export function valueBandLabel(band: ValueBand | Band): string {
  return String(band);
}
