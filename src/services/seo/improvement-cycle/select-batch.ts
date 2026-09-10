import { peekEnrichmentBatch } from "@/services/seo/guide-enrichment/queue";
import { peekCompareEnrichmentBatch } from "@/services/seo/compare-enrichment/queue";
import { buildSoftwareEnrichmentQueue } from "@/services/seo/software-enrichment/queue";
import { loadGscOpportunityReport } from "@/services/seo/gsc-opportunity/load-report";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import type { CycleQueueItem } from "./types";

export type SelectBatchOptions = {
  batchSize?: number;
  /** Soft caps within the batch. */
  maxGuides?: number;
  maxComparisons?: number;
  maxSoftware?: number;
};

function pathFor(kind: CycleQueueItem["kind"], slug: string): string {
  if (kind === "guide") return `/guides/${slug}/`;
  if (kind === "comparison") return `/compare/${slug}/`;
  return `/software/${slug}/`;
}

/**
 * Rank existing IMPROVE pages (enrichment queues) + INDEXABLE refresh
 * candidates from GSC opportunity feeds. Never creates new URLs.
 */
export function selectRecommendedBatch(
  opts: SelectBatchOptions = {},
): {
  enrich: CycleQueueItem[];
  refresh: CycleQueueItem[];
  selected: CycleQueueItem[];
} {
  const batchSize = opts.batchSize ?? 25;
  const maxGuides = opts.maxGuides ?? 12;
  const maxComparisons = opts.maxComparisons ?? 10;
  const maxSoftware = opts.maxSoftware ?? 5;

  const guideQ = peekEnrichmentBatch(Math.max(maxGuides * 2, 30));
  const compareQ = peekCompareEnrichmentBatch(Math.max(maxComparisons * 2, 30));
  const softwareQ = buildSoftwareEnrichmentQueue({ limit: maxSoftware * 2 });

  const enrich: CycleQueueItem[] = [];

  for (const g of guideQ.slice(0, maxGuides)) {
    enrich.push({
      kind: "guide",
      slug: g.slug,
      path: pathFor("guide", g.slug),
      lane: g.lane ?? null,
      score: g.overallScore ?? g.priorityScore ?? 0,
      reason: g.orderingReason ?? "IMPROVE guide enrichment queue",
      action: "enrich",
      lifecycle: getLifecycleOverrideState("guide", g.slug),
      blockedReasons: [],
    });
  }

  for (const c of compareQ.slice(0, maxComparisons)) {
    enrich.push({
      kind: "comparison",
      slug: c.slug,
      path: pathFor("comparison", c.slug),
      lane: c.lane ?? null,
      score: c.overallScore ?? c.priorityScore ?? 0,
      reason: c.orderingReason ?? "IMPROVE comparison enrichment queue",
      action: "enrich",
      lifecycle: getLifecycleOverrideState("comparison", c.slug),
      blockedReasons: [],
    });
  }

  for (const s of softwareQ.slice(0, maxSoftware)) {
    enrich.push({
      kind: "software",
      slug: s.slug,
      path: pathFor("software", s.slug),
      lane: s.lane ?? null,
      score: s.priorityScore ?? 0,
      reason: s.orderingReason ?? "Software hub enrichment queue",
      action: "enrich",
      lifecycle: null,
      blockedReasons: [],
    });
  }

  enrich.sort((a, b) => b.score - a.score);

  const refresh: CycleQueueItem[] = [];
  const report = loadGscOpportunityReport();
  const refreshRows = [
    ...(report?.indexedImprovementQueue ?? []),
    ...(report?.allRanked ?? []).filter(
      (r) =>
        r.primaryAction === "REFRESH_CONTENT" ||
        r.rootCauses?.includes("OUTDATED"),
    ),
  ];

  const seen = new Set<string>();
  for (const row of refreshRows) {
    if (seen.has(row.path)) continue;
    seen.add(row.path);
    const kind = pathKind(row.path);
    if (!kind) continue;
    const slug = slugFromPath(row.path, kind);
    if (!slug) continue;
    // Skip pages already in enrich list
    if (enrich.some((e) => e.path === normalizePath(row.path))) continue;
    refresh.push({
      kind,
      slug,
      path: normalizePath(row.path),
      lane: null,
      score: row.opportunityScore,
      reason: `${row.primaryAction}${row.rootCauses?.length ? ` · ${row.rootCauses.join(",")}` : ""}`,
      action: "refresh",
      lifecycle:
        kind === "guide" || kind === "comparison"
          ? getLifecycleOverrideState(kind, slug)
          : null,
      blockedReasons: [],
    });
    if (refresh.length >= batchSize) break;
  }

  // Selected batch: Lane-ordered enrich first, then high-score refresh fillers
  const selected: CycleQueueItem[] = [];
  for (const item of enrich) {
    if (selected.length >= batchSize) break;
    selected.push(item);
  }
  for (const item of refresh) {
    if (selected.length >= batchSize) break;
    if (selected.some((s) => s.path === item.path)) continue;
    selected.push({ ...item, action: "refresh" });
  }

  return { enrich, refresh, selected };
}

function normalizePath(p: string): string {
  if (!p.startsWith("/")) p = `/${p}`;
  return p.endsWith("/") ? p : `${p}/`;
}

function pathKind(p: string): CycleQueueItem["kind"] | null {
  const n = normalizePath(p);
  if (n.startsWith("/guides/")) return "guide";
  if (n.startsWith("/compare/")) return "comparison";
  if (n.startsWith("/software/")) return "software";
  return null;
}

function slugFromPath(p: string, kind: CycleQueueItem["kind"]): string | null {
  const n = normalizePath(p);
  const parts = n.split("/").filter(Boolean);
  if (kind === "guide" && parts[0] === "guides") return parts[1] ?? null;
  if (kind === "comparison" && parts[0] === "compare") return parts[1] ?? null;
  if (kind === "software" && parts[0] === "software") return parts[1] ?? null;
  return null;
}
