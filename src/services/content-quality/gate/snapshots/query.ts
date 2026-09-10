import { identityPath } from "@/seo/canonical";
import { INDEX_QUALITY_SCORE_MIN } from "../thresholds";
import { appendQualityRegression, loadQualitySnapshotStore } from "./store";
import type {
  QualityDelta,
  QualityObservationSnapshot,
  QualityRegressionFlag,
} from "./types";

function byUrl(
  snapshots: QualityObservationSnapshot[],
  url: string,
): QualityObservationSnapshot[] {
  const u = identityPath(url);
  return snapshots
    .filter((s) => identityPath(s.url) === u)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function latestSnapshot(
  url: string,
  cwd = process.cwd(),
): QualityObservationSnapshot | null {
  const list = byUrl(loadQualitySnapshotStore(cwd).snapshots, url);
  return list.at(-1) ?? null;
}

export function previousSnapshot(
  url: string,
  cwd = process.cwd(),
): QualityObservationSnapshot | null {
  const list = byUrl(loadQualitySnapshotStore(cwd).snapshots, url);
  return list.length >= 2 ? list[list.length - 2]! : null;
}

export function snapshotsForUrl(
  url: string,
  cwd = process.cwd(),
): QualityObservationSnapshot[] {
  return byUrl(loadQualitySnapshotStore(cwd).snapshots, url);
}

export function qualityDelta(
  url: string,
  cwd = process.cwd(),
): QualityDelta | null {
  const prev = previousSnapshot(url, cwd);
  const latest = latestSnapshot(url, cwd);
  if (!prev || !latest) return null;
  return deltaBetween(prev, latest);
}

export function deltaBetween(
  before: QualityObservationSnapshot,
  after: QualityObservationSnapshot,
): QualityDelta {
  const beforeDims = new Map(before.dimensions.map((d) => [d.id, d.score]));
  const afterDims = new Map(after.dimensions.map((d) => [d.id, d.score]));
  const ids = new Set([...beforeDims.keys(), ...afterDims.keys()]);
  const dimensionDeltas = [...ids].map((id) => {
    const b = beforeDims.get(id) ?? 0;
    const a = afterDims.get(id) ?? 0;
    return { id, before: b, after: a, delta: a - b };
  });

  return {
    url: after.url,
    fromTimestamp: before.timestamp,
    toTimestamp: after.timestamp,
    scoreDelta: after.qualityScore - before.qualityScore,
    dimensionDeltas,
    becameIndexEligible: !before.indexEligible && after.indexEligible,
    lostIndexEligible: before.indexEligible && !after.indexEligible,
    lifecycleBefore: String(before.lifecycleState),
    lifecycleAfter: String(after.lifecycleState),
  };
}

export function promotionHistory(
  url: string,
  cwd = process.cwd(),
): QualityObservationSnapshot[] {
  return snapshotsForUrl(url, cwd).filter(
    (s) =>
      s.sourceEvent === "promoted" ||
      (s.indexEligible &&
        String(s.lifecycleState) === "INDEXABLE" &&
        s.sourceEvent !== "improvement_before"),
  );
}

/**
 * Detect QUALITY_REGRESSION when an indexable / previously strong page
 * falls below quality or eligibility. Never auto-deindexes.
 */
export function detectQualityRegression(
  current: QualityObservationSnapshot,
  previous: QualityObservationSnapshot | null,
  opts?: { cwd?: string; persist?: boolean; qualityFloor?: number },
): QualityRegressionFlag | null {
  if (!previous) return null;

  const floor = opts?.qualityFloor ?? INDEX_QUALITY_SCORE_MIN;
  const wasIndexable =
    previous.indexEligible ||
    String(previous.lifecycleState) === "INDEXABLE" ||
    String(previous.lifecycleState) === "INDEXABLE_READY";

  if (!wasIndexable) return null;

  const detail: string[] = [];
  const scoreDrop = previous.qualityScore - current.qualityScore;
  const belowFloor = current.qualityScore < floor;
  const lostEligible = previous.indexEligible && !current.indexEligible;
  const freshnessDrop = (() => {
    const prevF = previous.dimensions.find((d) => d.id === "freshness")?.score;
    const curF = current.dimensions.find((d) => d.id === "freshness")?.score;
    if (prevF == null || curF == null) return false;
    return prevF - curF >= 20 && curF < 60;
  })();

  if (scoreDrop >= 10 && belowFloor) {
    detail.push(
      `qualityScore ${previous.qualityScore} → ${current.qualityScore} (floor ${floor})`,
    );
  }
  if (lostEligible) {
    detail.push("indexEligible lost");
  }
  if (freshnessDrop) {
    detail.push("freshness dimension regression");
  }

  if (detail.length === 0) return null;

  const flag: QualityRegressionFlag = {
    code: "QUALITY_REGRESSION",
    url: current.url,
    detectedAt: current.timestamp,
    previousScore: previous.qualityScore,
    currentScore: current.qualityScore,
    previousIndexEligible: previous.indexEligible,
    currentIndexEligible: current.indexEligible,
    previousLifecycle: String(previous.lifecycleState),
    currentLifecycle: String(current.lifecycleState),
    detail,
    autoDeindex: false,
  };

  appendQualityRegression(flag, {
    cwd: opts?.cwd,
    persist: opts?.persist,
  });
  return flag;
}

export type WeeklyQualityVelocity = {
  windowStart: string;
  windowEnd: string;
  pagesImproved: number;
  pagesPromoted: number;
  averageQualityDelta: number | null;
  largestImprovements: Array<{
    url: string;
    scoreDelta: number;
    from: number;
    to: number;
  }>;
  qualityRegressions: number;
  promotionConversionRate: number | null;
  improvedUrls: string[];
  promotedUrls: string[];
  regressionUrls: string[];
};

/**
 * Aggregate measurable improvement for a rolling window (default 7 days).
 */
export function computeWeeklyQualityVelocity(
  opts?: { cwd?: string; windowMs?: number; now?: number },
): WeeklyQualityVelocity {
  const cwd = opts?.cwd ?? process.cwd();
  const windowMs = opts?.windowMs ?? 7 * 24 * 60 * 60 * 1000;
  const now = opts?.now ?? Date.now();
  const since = now - windowMs;
  const store = loadQualitySnapshotStore(cwd);

  const inWindow = store.snapshots.filter(
    (s) => Date.parse(s.timestamp) >= since,
  );

  const byUrl = new Map<string, QualityObservationSnapshot[]>();
  for (const s of store.snapshots) {
    const list = byUrl.get(s.url) ?? [];
    list.push(s);
    byUrl.set(s.url, list);
  }

  const improvedUrls: string[] = [];
  const deltas: Array<{ url: string; scoreDelta: number; from: number; to: number }> =
    [];

  for (const [url, list] of byUrl) {
    const sorted = [...list].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    );
    const windowSnaps = sorted.filter((s) => Date.parse(s.timestamp) >= since);
    if (windowSnaps.length === 0) continue;

    const firstInWindow = windowSnaps[0]!;
    const baseline =
      sorted.filter((s) => Date.parse(s.timestamp) < since).at(-1) ??
      (windowSnaps.length >= 2 ? windowSnaps[0]! : null);
    const latest = windowSnaps.at(-1)!;

    const compareFrom =
      baseline && baseline.id !== latest.id ? baseline : firstInWindow;
    if (compareFrom.id === latest.id && windowSnaps.length < 2) {
      // Single observation: count as improved only for enrich/refresh/promote events
      if (
        ["enriched", "materially_refreshed", "promoted", "improvement_after"].includes(
          latest.sourceEvent,
        )
      ) {
        improvedUrls.push(url);
      }
      continue;
    }

    const delta = latest.qualityScore - compareFrom.qualityScore;
    if (delta > 0) {
      improvedUrls.push(url);
      deltas.push({
        url,
        scoreDelta: delta,
        from: compareFrom.qualityScore,
        to: latest.qualityScore,
      });
    }
  }

  const promotedUrls = [
    ...new Set(
      inWindow
        .filter((s) => s.sourceEvent === "promoted")
        .map((s) => s.url),
    ),
  ];

  const regressionInWindow = store.regressions.filter(
    (r) => Date.parse(r.detectedAt) >= since,
  );

  const avg =
    deltas.length > 0
      ? deltas.reduce((sum, d) => sum + d.scoreDelta, 0) / deltas.length
      : null;

  const conversion =
    improvedUrls.length > 0 ? promotedUrls.length / improvedUrls.length : null;

  return {
    windowStart: new Date(since).toISOString(),
    windowEnd: new Date(now).toISOString(),
    pagesImproved: improvedUrls.length,
    pagesPromoted: promotedUrls.length,
    averageQualityDelta:
      avg == null ? null : Number(avg.toFixed(2)),
    largestImprovements: [...deltas]
      .sort((a, b) => b.scoreDelta - a.scoreDelta)
      .slice(0, 10),
    qualityRegressions: regressionInWindow.length,
    promotionConversionRate:
      conversion == null ? null : Number(conversion.toFixed(3)),
    improvedUrls,
    promotedUrls,
    regressionUrls: [...new Set(regressionInWindow.map((r) => r.url))],
  };
}
