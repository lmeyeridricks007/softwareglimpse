/**
 * Select 200 existing weak pages: GSC 8–30 → 31–50 demand → Lane A
 * → commercial software → factory guides → comparisons.
 * Never creates URLs.
 */
import { getComparisonBySlug, getSoftwareBySlug } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { isFactoryProductPackGuide } from "@/services/seo/guides-index-worthiness/classify";
import { peekCompareEnrichmentBatch } from "@/services/seo/compare-enrichment/queue";
import { peekEnrichmentBatch } from "@/services/seo/guide-enrichment/queue";
import { buildSoftwareEnrichmentQueue } from "@/services/seo/software-enrichment/queue";
import {
  selectLaneAGscImprovePages,
  type LaneAPageKind,
  type LaneASelectedPage,
} from "@/services/seo/lane-a-gsc-improve/select";

export type HighValuePage = {
  kind: LaneAPageKind;
  slug: string;
  path: string;
  priority: number;
  bucket:
    | "gsc-8-30"
    | "gsc-31-50"
    | "lane-a"
    | "software"
    | "factory-guide"
    | "comparison";
  impressions: number;
  avgPosition: number | null;
  reason: string;
};

function exists(kind: LaneAPageKind, slug: string): boolean {
  if (kind === "guide") return Boolean(getGuideBySlug(slug, { includeUnpublished: true }));
  if (kind === "comparison") return Boolean(getComparisonBySlug(slug));
  if (kind === "software") return Boolean(getSoftwareBySlug(slug));
  if (kind === "best" || kind === "category") return true;
  return false;
}

function bucketFor(page: LaneASelectedPage): HighValuePage["bucket"] {
  if (page.band === "8-20" || page.band === "21-30") return "gsc-8-30";
  if (page.band === "31-50") return "gsc-31-50";
  return "lane-a";
}

export function selectHighValueWeakPages(limit = 200): {
  selected: HighValuePage[];
  bandCounts: Record<string, number>;
} {
  const used = new Set<string>();
  const selected: HighValuePage[] = [];

  const push = (p: HighValuePage) => {
    if (selected.length >= limit) return;
    if (used.has(p.path)) return;
    if (!exists(p.kind, p.slug)) return;
    used.add(p.path);
    selected.push(p);
  };

  const gsc = selectLaneAGscImprovePages(limit);
  const gscOrdered = [...gsc.selected].sort((a, b) => {
    const order = (x: LaneASelectedPage) =>
      x.band === "8-20" || x.band === "21-30"
        ? 0
        : x.band === "31-50"
          ? 1
          : 2;
    const d = order(a) - order(b);
    if (d !== 0) return d;
    return b.impressions - a.impressions;
  });
  for (const p of gscOrdered) {
    push({
      kind: p.kind,
      slug: p.slug,
      path: p.path,
      priority: selected.length + 1,
      bucket: bucketFor(p),
      impressions: p.impressions,
      avgPosition: p.avgPosition,
      reason: p.reason,
    });
  }

  if (selected.length < limit) {
    for (const s of buildSoftwareEnrichmentQueue({ limit: 80 })) {
      push({
        kind: "software",
        slug: s.slug,
        path: `/software/${s.slug}/`,
        priority: selected.length + 1,
        bucket: "software",
        impressions: 0,
        avgPosition: null,
        reason: s.orderingReason ?? "commercially important software queue",
      });
    }
  }

  if (selected.length < limit) {
    for (const g of peekEnrichmentBatch(120, { allocateByLane: false })) {
      const guide = getGuideBySlug(g.slug, { includeUnpublished: true });
      if (!guide || !isFactoryProductPackGuide(guide)) continue;
      push({
        kind: "guide",
        slug: g.slug,
        path: `/guides/${g.slug}/`,
        priority: selected.length + 1,
        bucket: "factory-guide",
        impressions: g.prioritySignals.gscImpressions ?? 0,
        avgPosition: g.prioritySignals.gscPosition ?? null,
        reason: g.orderingReason ?? "high-value factory IMPROVE queue",
      });
    }
  }

  if (selected.length < limit) {
    for (const c of peekCompareEnrichmentBatch(80)) {
      push({
        kind: "comparison",
        slug: c.slug,
        path: `/compare/${c.slug}/`,
        priority: selected.length + 1,
        bucket: "comparison",
        impressions: c.prioritySignals.gscImpressions ?? 0,
        avgPosition: c.prioritySignals.gscPosition ?? null,
        reason: c.orderingReason ?? "high-value comparison IMPROVE queue",
      });
    }
  }

  const bandCounts: Record<string, number> = {};
  for (const p of selected) {
    bandCounts[p.bucket] = (bandCounts[p.bucket] ?? 0) + 1;
  }
  return { selected: selected.slice(0, limit), bandCounts };
}
