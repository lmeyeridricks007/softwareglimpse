import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { identityPath } from "@/seo/canonical";
import type { ContentQualityGateResult } from "../types";
import {
  QUALITY_SNAPSHOT_VERSION,
  type QualityObservationSnapshot,
  type QualityRegressionFlag,
  type QualitySnapshotSourceEvent,
  type QualitySnapshotStoreFile,
} from "./types";

function storePath(cwd: string): string {
  return path.join(cwd, "data/seo/content-quality-gate-history.json");
}

type RawHistoryFile = {
  version?: string;
  updatedAt?: string;
  records?: unknown[];
  semanticRecords?: unknown[];
  familyQaRecords?: unknown[];
  snapshots?: QualityObservationSnapshot[];
  regressions?: QualityRegressionFlag[];
};

function emptyStore(): QualitySnapshotStoreFile {
  return {
    version: QUALITY_SNAPSHOT_VERSION,
    updatedAt: new Date(0).toISOString(),
    snapshots: [],
    regressions: [],
  };
}

function readRaw(cwd: string): RawHistoryFile {
  const file = storePath(cwd);
  if (!existsSync(file)) {
    return {
      version: QUALITY_SNAPSHOT_VERSION,
      updatedAt: new Date(0).toISOString(),
      records: [],
      semanticRecords: [],
      familyQaRecords: [],
      snapshots: [],
      regressions: [],
    };
  }
  try {
    return JSON.parse(readFileSync(file, "utf8")) as RawHistoryFile;
  } catch {
    return {
      version: QUALITY_SNAPSHOT_VERSION,
      updatedAt: new Date(0).toISOString(),
      records: [],
      semanticRecords: [],
      familyQaRecords: [],
      snapshots: [],
      regressions: [],
    };
  }
}

/**
 * Load snapshot store. Backfills from legacy `records` once when snapshots
 * are empty — backfill only appends; never rewrites existing snapshots.
 */
export function loadQualitySnapshotStore(
  cwd = process.cwd(),
): QualitySnapshotStoreFile {
  const raw = readRaw(cwd);
  const existing = Array.isArray(raw.snapshots) ? raw.snapshots : [];
  if (existing.length > 0) {
    return {
      version: raw.version ?? QUALITY_SNAPSHOT_VERSION,
      updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
      snapshots: existing,
      regressions: Array.isArray(raw.regressions) ? raw.regressions : [],
    };
  }

  // One-time backfill from legacy gate records (additive only).
  const backfilled = backfillFromLegacyRecords(raw.records ?? []);
  if (backfilled.length === 0) {
    return emptyStore();
  }

  const next: QualitySnapshotStoreFile = {
    version: QUALITY_SNAPSHOT_VERSION,
    updatedAt: new Date().toISOString(),
    snapshots: backfilled,
    regressions: [],
  };
  persistStoreMerge(cwd, next);
  return next;
}

function backfillFromLegacyRecords(
  records: unknown[],
): QualityObservationSnapshot[] {
  const out: QualityObservationSnapshot[] = [];
  for (const raw of records) {
    const r = raw as {
      path?: string;
      pageType?: string;
      slug?: string;
      phase?: string;
      recordedAt?: string;
      note?: string;
      result?: ContentQualityGateResult;
      semantic?: { riskLevel?: string; blocksAutoPromotion?: boolean };
    };
    if (!r?.result?.path || !r.recordedAt) continue;
    const sourceEvent = mapLegacyPhaseToSourceEvent(r.phase, r.note);
    out.push(
      snapshotFromGateResult(r.result, {
        sourceEvent,
        timestamp: r.recordedAt,
        semanticRisk: r.semantic?.riskLevel ?? null,
        note: r.note,
        legacyPhase:
          r.phase === "before" || r.phase === "after" || r.phase === "analyze"
            ? r.phase
            : undefined,
      }),
    );
  }
  return out;
}

export function mapLegacyPhaseToSourceEvent(
  phase?: string,
  note?: string,
): QualitySnapshotSourceEvent {
  const n = (note ?? "").toLowerCase();
  if (n.includes("promot")) return "promoted";
  if (n.includes("enrich")) return "enriched";
  if (n.includes("manual") || n.includes("edit")) return "manually_edited";
  if (n.includes("refresh")) return "materially_refreshed";
  if (phase === "before") return "improvement_before";
  if (phase === "after") return "improvement_after";
  if (phase === "analyze") return "analyzed";
  return "analyzed";
}

function snapshotId(url: string, timestamp: string, sourceEvent: string): string {
  return createHash("sha1")
    .update(`${url}|${timestamp}|${sourceEvent}`)
    .digest("hex")
    .slice(0, 16);
}

export function snapshotFromGateResult(
  result: ContentQualityGateResult,
  opts: {
    sourceEvent: QualitySnapshotSourceEvent;
    timestamp?: string;
    semanticRisk?: string | null;
    evidenceLevel?: string | null;
    note?: string;
    legacyPhase?: "before" | "after" | "analyze";
  },
): QualityObservationSnapshot {
  const timestamp = opts.timestamp ?? result.evaluatedAt ?? new Date().toISOString();
  const url = identityPath(result.path);
  return {
    id: snapshotId(url, timestamp, opts.sourceEvent),
    url,
    pageType: result.pageType,
    timestamp,
    lifecycleState: result.lifecycleState,
    qualityScore: result.qualityScore,
    dimensions: (result.dimensions ?? []).map((d) => ({
      id: d.id,
      score: d.score,
      weight: d.weight,
    })),
    failures: (result.failures ?? []).map((f) => f.code || f.message),
    warnings: (result.warnings ?? []).map((w) => w.code || w.message),
    semanticRisk: opts.semanticRisk ?? null,
    evidenceLevel: opts.evidenceLevel ?? null,
    indexEligible: Boolean(result.indexEligible),
    sourceEvent: opts.sourceEvent,
    legacyPhase: opts.legacyPhase,
    slug: result.slug,
    note: opts.note,
  };
}

/**
 * Append one snapshot. Never mutates prior observations.
 * Dedupes exact id collisions (same url+timestamp+event) to keep re-runs safe.
 */
export function appendQualitySnapshot(
  snapshot: QualityObservationSnapshot,
  opts?: { cwd?: string; persist?: boolean },
): QualityObservationSnapshot {
  const cwd = opts?.cwd ?? process.cwd();
  if (opts?.persist === false) return snapshot;

  // loadQualitySnapshotStore backfills legacy records before append so we
  // never orphan history by writing a fresh snapshots[] over an empty key.
  const store = loadQualitySnapshotStore(cwd);
  const snapshots = [...store.snapshots];
  if (snapshots.some((s) => s.id === snapshot.id)) {
    return snapshot;
  }
  snapshots.push(snapshot);
  persistStoreMerge(cwd, {
    version: QUALITY_SNAPSHOT_VERSION,
    updatedAt: snapshot.timestamp,
    snapshots,
    regressions: store.regressions,
  });
  return snapshot;
}

export function appendQualityRegression(
  flag: QualityRegressionFlag,
  opts?: { cwd?: string; persist?: boolean },
): QualityRegressionFlag {
  const cwd = opts?.cwd ?? process.cwd();
  if (opts?.persist === false) return flag;

  const store = loadQualitySnapshotStore(cwd);
  const regressions = [...store.regressions];
  const key = `${flag.url}|${flag.detectedAt}|${flag.currentScore}`;
  if (
    regressions.some(
      (r) => `${r.url}|${r.detectedAt}|${r.currentScore}` === key,
    )
  ) {
    return flag;
  }
  regressions.push(flag);
  persistStoreMerge(cwd, {
    version: QUALITY_SNAPSHOT_VERSION,
    updatedAt: flag.detectedAt,
    snapshots: store.snapshots,
    regressions,
  });
  return flag;
}

/** Merge snapshot fields into shared history file without dropping other keys. */
function persistStoreMerge(
  cwd: string,
  store: QualitySnapshotStoreFile,
): void {
  const raw = readRaw(cwd);
  const file = storePath(cwd);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(
    file,
    `${JSON.stringify(
      {
        ...raw,
        version: store.version || raw.version || QUALITY_SNAPSHOT_VERSION,
        updatedAt: store.updatedAt,
        // Preserve legacy arrays as-is (do not truncate here).
        records: raw.records ?? [],
        semanticRecords: raw.semanticRecords ?? [],
        familyQaRecords: raw.familyQaRecords ?? [],
        snapshots: store.snapshots,
        regressions: store.regressions,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

export function getQualitySnapshotStorePath(cwd = process.cwd()): string {
  return storePath(cwd);
}
