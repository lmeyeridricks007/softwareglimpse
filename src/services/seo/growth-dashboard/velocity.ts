import path from "node:path";
import { firstExisting, notConnected, num, readJsonIfExists } from "./io";
import { computeWeeklyQualityVelocity } from "@/services/content-quality/gate/snapshots";
import type { ImprovementVelocitySection } from "./types";

/**
 * Improvement velocity for the preserve→improve→promote loop.
 * Driven by append-only quality snapshots — never invent weekly wins.
 */
export function buildImprovementVelocitySection(
  cwd = process.cwd(),
): ImprovementVelocitySection {
  const notes: string[] = [];

  const lifePath = firstExisting(
    path.join(cwd, "data/seo/content-lifecycle.json"),
  );
  const life = lifePath
    ? readJsonIfExists<{
        entries?: Record<
          string,
          { lifecycle?: string; promotedAt?: string; indexable?: boolean }
        >;
      }>(lifePath)
    : null;

  let lifecyclePromoted = 0;
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  if (life?.entries) {
    for (const e of Object.values(life.entries)) {
      const at = e.promotedAt ? Date.parse(e.promotedAt) : NaN;
      if (
        !Number.isNaN(at) &&
        at >= since &&
        (e.lifecycle === "INDEXABLE" || e.indexable === true)
      ) {
        lifecyclePromoted += 1;
      }
    }
  } else {
    notes.push("content-lifecycle.json has no promotion history yet.");
  }

  let velocity;
  try {
    velocity = computeWeeklyQualityVelocity({ cwd });
  } catch {
    velocity = null;
  }

  const histPath = firstExisting(
    path.join(cwd, "data/seo/content-quality-gate-history.json"),
  );
  const hist = histPath
    ? readJsonIfExists<{
        snapshots?: unknown[];
        records?: unknown[];
      }>(histPath)
    : null;

  const hasSnapshots = Boolean(hist?.snapshots && hist.snapshots.length > 0);
  const hasLegacyRecords = Boolean(hist?.records && hist.records.length > 0);
  const hasHistory = hasSnapshots || hasLegacyRecords;

  if (!hasHistory) {
    notes.push(
      "content-quality-gate-history.json missing/incomplete — quality velocity not connected.",
    );
  } else if (!hasSnapshots && hasLegacyRecords) {
    notes.push(
      "Legacy gate records present — snapshots backfill on next persist/load.",
    );
  }

  const promoted = Math.max(
    lifecyclePromoted,
    velocity?.pagesPromoted ?? 0,
  );
  const improved = velocity?.pagesImproved ?? 0;
  const conversion =
    improved > 0 ? Number((promoted / improved).toFixed(3)) : null;

  // Ranking-after-upgrade needs paired pre/post GSC — not inventable.
  const rankingsImproved = notConnected(
    "Requires paired pre/post GSC for upgraded URLs — not connected",
  );

  if (velocity?.largestImprovements?.length) {
    notes.push(
      `Largest improvements: ${velocity.largestImprovements
        .slice(0, 3)
        .map((i) => `${i.url} (+${i.scoreDelta})`)
        .join("; ")}`,
    );
  }
  if ((velocity?.qualityRegressions ?? 0) > 0) {
    notes.push(
      `QUALITY_REGRESSION flags this week: ${velocity!.qualityRegressions} (no auto-deindex).`,
    );
  }

  notes.push(
    "Do not treat empty velocity as zero wins when history is not connected.",
  );
  notes.push(
    "Snapshots are append-only (sourceEvent: first_analyzed/enriched/promoted/…). Historical observations are never rewritten.",
  );

  return {
    status:
      hasHistory || lifePath
        ? hasSnapshots || (velocity && velocity.pagesImproved > 0)
          ? "connected"
          : "partial"
        : "not_connected",
    windowLabel: "Last 7 days",
    pagesImprovedThisWeek: hasHistory
      ? num(improved, "URLs with positive quality delta in window")
      : notConnected("No quality-gate history"),
    pagesPromotedToIndexable:
      lifePath || hasHistory
        ? num(promoted, "Lifecycle promotedAt and/or snapshot sourceEvent=promoted")
        : notConnected("No content-lifecycle store"),
    pagesQualityScoreImproved: hasHistory
      ? num(improved, "before→after qualityScore increases")
      : notConnected("No before/after snapshot pairs"),
    averageQualityDelta: hasHistory
      ? velocity?.averageQualityDelta != null
        ? num(velocity.averageQualityDelta, "Mean score delta for improved URLs")
        : notConnected("No paired deltas in window")
      : notConnected("No quality snapshots"),
    largestImprovements: velocity?.largestImprovements ?? [],
    qualityRegressions: hasHistory
      ? num(
          velocity?.qualityRegressions ?? 0,
          "QUALITY_REGRESSION flags (policy guard — no auto-deindex)",
        )
      : notConnected("No quality snapshots"),
    promotionConversionRate: hasHistory
      ? conversion != null
        ? num(conversion, "promoted ÷ improved in window")
        : notConnected("No improved pages to convert")
      : notConnected("No quality snapshots"),
    pagesRankingsImprovedAfterUpgrade: rankingsImproved,
    notes,
  };
}
