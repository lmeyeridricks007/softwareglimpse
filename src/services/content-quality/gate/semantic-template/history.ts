import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { SEMANTIC_TEMPLATE_VERSION } from "./types";
import type {
  FamilyQaSummary,
  SemanticHistorySnapshot,
  SemanticPromotionOutcome,
  SemanticTemplateAssessment,
} from "./types";

export type SemanticHistoryFile = {
  version: string;
  updatedAt: string;
  records: SemanticHistorySnapshot[];
};

function historyPath(cwd: string): string {
  return path.join(cwd, "data/seo/content-quality-gate-history.json");
}

function loadRaw(cwd: string): {
  version?: string;
  updatedAt?: string;
  records?: unknown[];
  semanticRecords?: SemanticHistorySnapshot[];
  familyQaRecords?: FamilyQaSummary[];
  snapshots?: unknown[];
  regressions?: unknown[];
  [key: string]: unknown;
} {
  const file = historyPath(cwd);
  if (!existsSync(file)) {
    return {
      version: SEMANTIC_TEMPLATE_VERSION,
      updatedAt: new Date().toISOString(),
      records: [],
      semanticRecords: [],
      familyQaRecords: [],
    };
  }
  try {
    return JSON.parse(readFileSync(file, "utf8")) as ReturnType<typeof loadRaw>;
  } catch {
    return {
      version: SEMANTIC_TEMPLATE_VERSION,
      updatedAt: new Date().toISOString(),
      records: [],
      semanticRecords: [],
      familyQaRecords: [],
    };
  }
}

function writeRaw(
  cwd: string,
  raw: ReturnType<typeof loadRaw>,
): void {
  const file = historyPath(cwd);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(raw, null, 2) + "\n", "utf8");
}

/**
 * Append semantic template fields onto the shared quality-gate history file
 * under `semanticRecords` (non-breaking additive key).
 */
export function recordSemanticTemplateHistory(
  assessment: SemanticTemplateAssessment,
  opts: {
    phase: SemanticHistorySnapshot["phase"];
    pageType: "guide" | "comparison";
    cwd?: string;
    persist?: boolean;
    beforeSimilarity?: number;
    afterSimilarity?: number;
    promotionOutcome?: SemanticPromotionOutcome;
  },
): SemanticHistorySnapshot {
  const snapshot: SemanticHistorySnapshot = {
    recordedAt: new Date().toISOString(),
    phase: opts.phase,
    path: assessment.path,
    slug: assessment.slug,
    pageType: opts.pageType,
    maxSemanticSimilarity: assessment.maxSemanticSimilarity,
    meanSemanticSimilarity: assessment.meanSemanticSimilarity,
    beforeSimilarity: opts.beforeSimilarity,
    afterSimilarity:
      opts.afterSimilarity ??
      (opts.phase === "after" || opts.phase === "promotion_block"
        ? assessment.maxSemanticSimilarity
        : undefined),
    riskLevel: assessment.riskLevel,
    siblingCluster: assessment.siblingCluster,
    uniqueAnalysisSignals: assessment.uniqueAnalysisSignals,
    riskSignals: assessment.riskSignals,
    blocksAutoPromotion: assessment.blocksAutoPromotion,
    promotionReason: assessment.promotionReason,
    promotionOutcome: opts.promotionOutcome,
    reasons: assessment.reasons,
  };

  if (opts.persist === false) return snapshot;

  const cwd = opts.cwd ?? process.cwd();
  const raw = loadRaw(cwd);
  // Append-only: never truncate historical semantic observations.
  const semanticRecords = [...(raw.semanticRecords ?? []), snapshot];
  writeRaw(cwd, {
    ...raw,
    version: raw.version ?? SEMANTIC_TEMPLATE_VERSION,
    updatedAt: snapshot.recordedAt,
    records: raw.records ?? [],
    semanticRecords,
  });
  return snapshot;
}

/**
 * Persist before → after enrichment similarity pair plus promotion outcome.
 */
export function recordSemanticEnrichmentPair(input: {
  before: SemanticTemplateAssessment;
  after: SemanticTemplateAssessment;
  pageType: "guide" | "comparison";
  promotionOutcome: SemanticPromotionOutcome;
  cwd?: string;
  persist?: boolean;
}): { before: SemanticHistorySnapshot; after: SemanticHistorySnapshot } {
  const before = recordSemanticTemplateHistory(input.before, {
    phase: "before",
    pageType: input.pageType,
    cwd: input.cwd,
    persist: input.persist,
    beforeSimilarity: input.before.maxSemanticSimilarity,
    promotionOutcome: "analyze_only",
  });
  const after = recordSemanticTemplateHistory(input.after, {
    phase: input.after.blocksAutoPromotion ? "promotion_block" : "after",
    pageType: input.pageType,
    cwd: input.cwd,
    persist: input.persist,
    beforeSimilarity: input.before.maxSemanticSimilarity,
    afterSimilarity: input.after.maxSemanticSimilarity,
    promotionOutcome: input.promotionOutcome,
  });
  return { before, after };
}

export function recordFamilyQaHistory(
  summary: FamilyQaSummary,
  opts?: { cwd?: string; persist?: boolean },
): FamilyQaSummary {
  if (opts?.persist === false) return summary;
  const cwd = opts?.cwd ?? process.cwd();
  const raw = loadRaw(cwd);
  // Append-only: never truncate family QA history.
  const familyQaRecords = [...(raw.familyQaRecords ?? []), summary];
  writeRaw(cwd, {
    ...raw,
    version: raw.version ?? SEMANTIC_TEMPLATE_VERSION,
    updatedAt: summary.generatedAt,
    familyQaRecords,
  });
  return summary;
}

export function loadSemanticHistory(
  cwd = process.cwd(),
): SemanticHistorySnapshot[] {
  return loadRaw(cwd).semanticRecords ?? [];
}

export function loadFamilyQaHistory(cwd = process.cwd()): FamilyQaSummary[] {
  return loadRaw(cwd).familyQaRecords ?? [];
}
