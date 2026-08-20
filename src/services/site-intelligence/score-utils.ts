import type {
  ConfidenceBlock,
  ConfidenceLevel,
  DimensionScore,
  EvidenceItem,
} from "@/domain/schemas/site-intelligence";

export function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function weightedMean(
  items: { score: number; weight: number }[],
): number {
  const total = items.reduce((s, i) => s + i.weight, 0);
  if (total <= 0) return 0;
  return clampScore(
    items.reduce((s, i) => s + i.score * i.weight, 0) / total,
  );
}

export function equalMean(scores: number[]): number {
  if (scores.length === 0) return 0;
  return clampScore(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function worstConfidence(
  levels: ConfidenceLevel[],
): ConfidenceLevel {
  if (levels.includes("low")) return "low";
  if (levels.includes("medium")) return "medium";
  return "high";
}

export function confidence(
  level: ConfidenceLevel,
  reasons: string[],
): ConfidenceBlock {
  return {
    level,
    reasons: reasons.length > 0 ? reasons : ["No confidence reasons supplied"],
  };
}

export function dim(
  id: string,
  score: number,
  weight: number,
  reason: string,
  evidence: EvidenceItem[] = [],
  partial?: boolean,
): DimensionScore {
  return {
    id,
    score: clampScore(score),
    weight,
    reason,
    evidence,
    partial,
  };
}
