/**
 * Lifecycle orphan / stale-promotion detector.
 *
 * An INDEXABLE or INDEXABLE_READY registry row must resolve to a real
 * catalogue entity that is publicly routable and isEntityIndexable-compatible
 * (or would be, once scheduled visibility arrives — still must exist).
 *
 * Registry alone must never create indexability for missing/404 entities.
 */

import {
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
} from "@/data";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getContentLifecycleStoreSnapshot,
  getLifecycleEntry,
  upsertLifecycleEntry,
} from "@/services/seo/content-lifecycle/store";
import { upsertAndPersistLifecycleEntry } from "@/services/seo/content-lifecycle/store-write";
import type {
  ContentLifecycleEntry,
  ContentLifecycleKind,
  ContentLifecycleState,
} from "@/services/seo/content-lifecycle/types";
import { guidePassesIndexGates } from "@/services/content-quality/gate/index-gates";
import { comparisonPassesIndexGates } from "@/services/content-quality/gate/index-gates";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness/relationship";
import { getSoftware } from "@/data";

export type LifecycleOrphanReason =
  | "missing_entity"
  | "route_not_public"
  | "not_isEntityIndexable"
  | "promotion_gates_fail";

export type LifecycleOrphanFinding = {
  code: "LIFECYCLE_ORPHAN";
  kind: ContentLifecycleKind;
  slug: string;
  path: string;
  lifecycle: ContentLifecycleState;
  reason: LifecycleOrphanReason;
  detail: string;
  /** Safe to demote to IMPROVE + indexable:false. */
  demoteSafe: boolean;
};

export type LifecycleOrphanReport = {
  version: string;
  generatedAt: string;
  scanned: number;
  orphanCount: number;
  findings: LifecycleOrphanFinding[];
  demoted: number;
};

export const LIFECYCLE_ORPHAN_VERSION = "1.0.0";

const PROMOTED_STATES = new Set<ContentLifecycleState>([
  "INDEXABLE",
  "INDEXABLE_READY",
]);

function guidePath(slug: string): string {
  return `/guides/${slug}/`;
}

function comparePath(slug: string): string {
  return `/compare/${slug}/`;
}

/**
 * Public compare/guide routes use publication-filtered catalogue lookups.
 * Researching / draft shells 404 even when unfiltered seed has a stub.
 */
function comparisonRouteResolves(slug: string): boolean {
  return Boolean(getComparisonBySlug(slug));
}

function guideRouteResolves(slug: string): boolean {
  return Boolean(getGuideBySlug(slug));
}

export function detectLifecycleOrphans(
  now: Date = new Date(),
): LifecycleOrphanFinding[] {
  const store = getContentLifecycleStoreSnapshot();
  const guides = new Map(
    getGuides({ includeUnpublished: true }).map((g) => [g.slug, g]),
  );
  const comps = new Map(
    getAllComparisonsUnfiltered().map((c) => [c.slug, c]),
  );
  const soft = buildSoftwareLookup(
    getSoftware({ includeUnpublished: true }),
  );
  const findings: LifecycleOrphanFinding[] = [];

  for (const entry of Object.values(store.entries ?? {})) {
    if (!PROMOTED_STATES.has(entry.lifecycle)) continue;
    if (entry.indexable === false && entry.lifecycle === "INDEXABLE_READY") {
      // Ready queue without index flag is allowed; still must resolve entity.
    }

    if (entry.kind === "guide") {
      const entity = guides.get(entry.slug);
      if (!entity) {
        findings.push({
          code: "LIFECYCLE_ORPHAN",
          kind: "guide",
          slug: entry.slug,
          path: guidePath(entry.slug),
          lifecycle: entry.lifecycle,
          reason: "missing_entity",
          detail: "Lifecycle INDEXABLE/READY but no guide catalogue entity",
          demoteSafe: true,
        });
        continue;
      }
      if (!guideRouteResolves(entry.slug)) {
        findings.push({
          code: "LIFECYCLE_ORPHAN",
          kind: "guide",
          slug: entry.slug,
          path: guidePath(entry.slug),
          lifecycle: entry.lifecycle,
          reason: "route_not_public",
          detail: `Guide exists but public route does not resolve (status=${entity.metadata.status})`,
          demoteSafe: true,
        });
        continue;
      }
      const gates = guidePassesIndexGates(entity);
      if (!gates.ok) {
        findings.push({
          code: "LIFECYCLE_ORPHAN",
          kind: "guide",
          slug: entry.slug,
          path: guidePath(entry.slug),
          lifecycle: entry.lifecycle,
          reason: "promotion_gates_fail",
          detail: `Promotion/index gates fail: ${gates.detail.join("; ")}`,
          demoteSafe: true,
        });
        continue;
      }
      if (
        entry.lifecycle === "INDEXABLE" &&
        !isEntityIndexable({ kind: "guide", entity }, now)
      ) {
        findings.push({
          code: "LIFECYCLE_ORPHAN",
          kind: "guide",
          slug: entry.slug,
          path: guidePath(entry.slug),
          lifecycle: entry.lifecycle,
          reason: "not_isEntityIndexable",
          detail:
            "Registry INDEXABLE but isEntityIndexable=false (visibility/quality)",
          demoteSafe: true,
        });
      }
      continue;
    }

    // comparison
    const entity = comps.get(entry.slug);
    if (!entity) {
      findings.push({
        code: "LIFECYCLE_ORPHAN",
        kind: "comparison",
        slug: entry.slug,
        path: comparePath(entry.slug),
        lifecycle: entry.lifecycle,
        reason: "missing_entity",
        detail:
          "Lifecycle INDEXABLE/READY but no comparison catalogue entity (404 risk)",
        demoteSafe: true,
      });
      continue;
    }
    if (!comparisonRouteResolves(entry.slug)) {
      findings.push({
        code: "LIFECYCLE_ORPHAN",
        kind: "comparison",
        slug: entry.slug,
        path: comparePath(entry.slug),
        lifecycle: entry.lifecycle,
        reason: "route_not_public",
        detail: `Comparison stub exists (status=${entity.metadata.status}) but public /compare route 404s`,
        demoteSafe: true,
      });
      continue;
    }
    const gates = comparisonPassesIndexGates(entity, soft);
    if (!gates.ok) {
      findings.push({
        code: "LIFECYCLE_ORPHAN",
        kind: "comparison",
        slug: entry.slug,
        path: comparePath(entry.slug),
        lifecycle: entry.lifecycle,
        reason: "promotion_gates_fail",
        detail: `Promotion/index gates fail: ${gates.detail.join("; ")}`,
        demoteSafe: true,
      });
      continue;
    }
    if (
      entry.lifecycle === "INDEXABLE" &&
      !isEntityIndexable({ kind: "comparison", entity }, now)
    ) {
      findings.push({
        code: "LIFECYCLE_ORPHAN",
        kind: "comparison",
        slug: entry.slug,
        path: comparePath(entry.slug),
        lifecycle: entry.lifecycle,
        reason: "not_isEntityIndexable",
        detail:
          "Registry INDEXABLE but isEntityIndexable=false (visibility/quality)",
        demoteSafe: true,
      });
    }
  }

  return findings;
}

export function demoteLifecycleOrphan(
  finding: LifecycleOrphanFinding,
  options: { persist?: boolean } = {},
): ContentLifecycleEntry {
  const previous = getLifecycleEntry(finding.kind, finding.slug);
  const next: ContentLifecycleEntry = {
    kind: finding.kind,
    slug: finding.slug,
    lifecycle: "IMPROVE",
    indexable: false,
    previousLifecycle: previous?.lifecycle ?? finding.lifecycle,
    notes: `Demoted LIFECYCLE_ORPHAN (${finding.reason}): ${finding.detail}`,
    updatedAt: new Date().toISOString(),
  };
  if (options.persist) {
    return upsertAndPersistLifecycleEntry(next);
  }
  return upsertLifecycleEntry(next);
}

export function runLifecycleOrphanReconcile(options: {
  apply?: boolean;
  persist?: boolean;
  now?: Date;
}): LifecycleOrphanReport {
  const findings = detectLifecycleOrphans(options.now);
  let demoted = 0;
  if (options.apply) {
    for (const finding of findings) {
      if (!finding.demoteSafe) continue;
      demoteLifecycleOrphan(finding, { persist: options.persist });
      demoted += 1;
    }
  }
  return {
    version: LIFECYCLE_ORPHAN_VERSION,
    generatedAt: new Date().toISOString(),
    scanned: Object.keys(getContentLifecycleStoreSnapshot().entries ?? {})
      .length,
    orphanCount: findings.length,
    findings,
    demoted,
  };
}
