import type {
  PageFlag,
  PageQualityInput,
  ScoredComponent,
} from "@/domain/schemas/site-intelligence";
import { siteBandForScore } from "./bands";
import { clampScore, confidence } from "./score-utils";
import { IMPORTANCE_WEIGHTS } from "./weights";

export function importanceWeight(
  importance: PageQualityInput["importance"],
): number {
  return IMPORTANCE_WEIGHTS[importance];
}

export function weightedContentScore(pages: PageQualityInput[]): number {
  if (pages.length === 0) return 0;
  let num = 0;
  let den = 0;
  for (const p of pages) {
    const w = importanceWeight(p.importance);
    num += p.overallScore * w;
    den += w;
  }
  return clampScore(num / den);
}

export function rollupByKey(
  pages: PageQualityInput[],
  keyFn: (p: PageQualityInput) => string | undefined,
): Array<{ key: string; pageCount: number; weightedScore: number }> {
  const buckets = new Map<string, PageQualityInput[]>();
  for (const p of pages) {
    const key = keyFn(p);
    if (!key) continue;
    const list = buckets.get(key) ?? [];
    list.push(p);
    buckets.set(key, list);
  }
  return [...buckets.entries()]
    .map(([key, list]) => ({
      key,
      pageCount: list.length,
      weightedScore: weightedContentScore(list),
    }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function flagUnlikelyPages(
  pages: PageQualityInput[],
  technicalP0Routes: Set<string>,
): PageFlag[] {
  const flags: PageFlag[] = [];
  for (const p of pages) {
    const reasons: string[] = [];
    if (
      p.overallScore < 50 &&
      (p.importance === "pillar" || p.importance === "high-commercial")
    ) {
      reasons.push(
        `Content score ${p.overallScore} < 50 on ${p.importance} page`,
      );
    }
    if (p.overallScore < 40) {
      reasons.push(`Content score ${p.overallScore} < 40`);
    }
    if (p.criticalIntegrityFailure) {
      reasons.push("Critical integrity / evidence failure");
    }
    if (technicalP0Routes.has(p.route)) {
      reasons.push("Technical P0 finding on this URL");
    }
    if (reasons.length > 0) {
      flags.push({
        route: p.route,
        flag: "unlikely-to-rank-without-substantial-improvement",
        reasons,
        contentScore: p.overallScore,
        importance: p.importance,
      });
    }
  }
  return flags;
}

/**
 * Aggregates existing Content Quality page scores with importance weighting.
 * Does not re-score CQ dimensions.
 */
export function scoreContentQuality(input: {
  pages: PageQualityInput[];
}): ScoredComponent {
  if (input.pages.length === 0) {
    return {
      id: "content-quality",
      availability: "unavailable",
      score: null,
      band: null,
      dimensions: [],
      confidence: confidence("low", [
        "No Content Quality page scores supplied",
      ]),
      evidence: [],
      notes: ["Content Quality unavailable — Overall cannot include B"],
      strongerThan: [],
      weakerThan: [],
    };
  }

  const score = weightedContentScore(input.pages);
  const pillars = input.pages.filter((p) => p.importance === "pillar");
  const longTail = input.pages.filter((p) => p.importance === "long-tail");
  const simpleAvg =
    input.pages.reduce((s, p) => s + p.overallScore, 0) / input.pages.length;

  return {
    id: "content-quality",
    availability: "scored",
    score,
    band: siteBandForScore(score),
    dimensions: [],
    confidence: confidence(
      pillars.length > 0 ? "high" : "medium",
      [
        `Importance-weighted aggregate across ${input.pages.length} page(s)`,
        `Pillars: ${pillars.length}; long-tail: ${longTail.length}`,
        `Simple mean ${clampScore(simpleAvg)} vs weighted ${score} (pillars must outweigh long-tail volume)`,
      ],
    ),
    evidence: input.pages.slice(0, 8).map((p) => ({
      label: `${p.route} (${p.importance})`,
      detail: `CQ ${p.overallScore}`,
      sourceSystem: "content-quality",
    })),
    notes: [],
    strongerThan: [],
    weakerThan: [],
  };
}
