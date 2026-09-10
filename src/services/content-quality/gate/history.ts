import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  ContentQualityGateResult,
  GateHistoryFile,
  GateHistoryRecord,
} from "./types";
import { CONTENT_QUALITY_GATE_VERSION } from "./thresholds";
import { recordQualitySnapshot } from "./snapshots/record";
import type { QualitySnapshotSourceEvent } from "./snapshots/types";

const HISTORY_PATH = path.join(
  process.cwd(),
  "data/seo/content-quality-gate-history.json",
);

function emptyFile(): GateHistoryFile {
  return {
    version: CONTENT_QUALITY_GATE_VERSION,
    updatedAt: new Date().toISOString(),
    records: [],
  };
}

export function loadGateHistory(cwd = process.cwd()): GateHistoryFile {
  const file = path.join(cwd, "data/seo/content-quality-gate-history.json");
  if (!existsSync(file)) return emptyFile();
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as GateHistoryFile & {
      snapshots?: unknown[];
    };
    return {
      version: raw.version ?? CONTENT_QUALITY_GATE_VERSION,
      updatedAt: raw.updatedAt ?? new Date().toISOString(),
      records: Array.isArray(raw.records) ? raw.records : [],
    };
  } catch {
    return emptyFile();
  }
}

function phaseToSourceEvent(
  phase: GateHistoryRecord["phase"],
  note?: string,
): QualitySnapshotSourceEvent {
  const n = (note ?? "").toLowerCase();
  if (n.includes("promot")) return "promoted";
  if (n.includes("enrich")) return "enriched";
  if (n.includes("manual") || n.includes("edit")) return "manually_edited";
  if (n.includes("refresh")) return "materially_refreshed";
  if (phase === "before") return "improvement_before";
  if (phase === "after") return "improvement_after";
  return "analyzed";
}

export function recordGateResult(
  result: ContentQualityGateResult,
  phase: GateHistoryRecord["phase"],
  opts?: {
    note?: string;
    cwd?: string;
    persist?: boolean;
    semantic?: GateHistoryRecord["semantic"];
    evidenceLevel?: string | null;
    sourceEvent?: QualitySnapshotSourceEvent;
  },
): GateHistoryRecord {
  const cwd = opts?.cwd ?? process.cwd();
  const record: GateHistoryRecord = {
    path: result.path,
    pageType: result.pageType,
    slug: result.slug,
    phase,
    result,
    recordedAt: new Date().toISOString(),
    note: opts?.note,
    semantic: opts?.semantic,
  };

  if (opts?.persist !== false) {
    // Append-only: never truncate historical records.
    const filePath = path.join(cwd, "data/seo/content-quality-gate-history.json");
    let raw: Record<string, unknown> = {
      version: CONTENT_QUALITY_GATE_VERSION,
      updatedAt: record.recordedAt,
      records: [],
    };
    if (existsSync(filePath)) {
      try {
        raw = JSON.parse(readFileSync(filePath, "utf8")) as Record<
          string,
          unknown
        >;
      } catch {
        // start from empty shell but keep writing append-only going forward
      }
    }
    const records = Array.isArray(raw.records)
      ? [...(raw.records as GateHistoryRecord[])]
      : [];
    records.push(record);
    mkdirSync(path.dirname(filePath), { recursive: true });
    writeFileSync(
      filePath,
      `${JSON.stringify(
        {
          ...raw,
          version: CONTENT_QUALITY_GATE_VERSION,
          updatedAt: record.recordedAt,
          records,
        },
        null,
        2,
      )}\n`,
      "utf8",
    );

    // Measurable snapshot lane (append-only, separate from legacy records).
    recordQualitySnapshot({
      result: {
        ...result,
        evaluatedAt: record.recordedAt,
      },
      sourceEvent: opts?.sourceEvent ?? phaseToSourceEvent(phase, opts?.note),
      phase,
      note: opts?.note,
      semanticRisk: opts?.semantic?.riskLevel ?? null,
      evidenceLevel: opts?.evidenceLevel ?? null,
      cwd,
      persist: true,
      detectRegression: phase === "after" || phase === "analyze",
    });
  }

  return record;
}

/**
 * Improvement loop helper: analyze → (improve externally) → reanalyze.
 * Stores before/after quality state when persist is true.
 */
export function runGateImprovementLoop(input: {
  before: ContentQualityGateResult;
  after: ContentQualityGateResult;
  note?: string;
  cwd?: string;
  persist?: boolean;
  beforeSimilarity?: number;
  afterSimilarity?: number;
  siblingCluster?: NonNullable<GateHistoryRecord["semantic"]>["siblingCluster"];
  uniqueAnalysisSignals?: string[];
  promotionReason?: string;
}): {
  before: GateHistoryRecord;
  after: GateHistoryRecord;
  scoreDelta: number;
  becameIndexEligible: boolean;
} {
  const semanticBase = {
    siblingCluster: input.siblingCluster,
    uniqueAnalysisSignals: input.uniqueAnalysisSignals,
    promotionReason: input.promotionReason,
  };
  const before = recordGateResult(input.before, "before", {
    note: input.note,
    cwd: input.cwd,
    persist: input.persist,
    sourceEvent: "improvement_before",
    semantic: {
      ...semanticBase,
      beforeSimilarity: input.beforeSimilarity,
      maxSemanticSimilarity: input.beforeSimilarity,
    },
  });
  const after = recordGateResult(input.after, "after", {
    note: input.note,
    cwd: input.cwd,
    persist: input.persist,
    sourceEvent: "improvement_after",
    semantic: {
      ...semanticBase,
      beforeSimilarity: input.beforeSimilarity,
      afterSimilarity: input.afterSimilarity,
      maxSemanticSimilarity: input.afterSimilarity,
    },
  });
  return {
    before,
    after,
    scoreDelta: input.after.qualityScore - input.before.qualityScore,
    becameIndexEligible:
      !input.before.indexEligible && input.after.indexEligible,
  };
}

export function getGateHistoryPath(): string {
  return HISTORY_PATH;
}
