import path from "node:path";
import { getSoftware } from "@/data";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getSitemapEntries } from "@/seo/sitemap";
import { firstExisting, readJsonIfExists } from "./io";
import type {
  ContentEstateSection,
  LifecycleBucketCounts,
} from "./types";

type AuditLifecycle = {
  summary?: {
    total?: number;
    byLifecycle?: {
      INDEXABLE?: number;
      IMPROVE?: number;
      IMPROVING?: number;
      READY_FOR_REVIEW?: number;
      INDEXABLE_READY?: number;
      MANUAL_REVIEW?: number;
      RETIRED?: number;
    };
  };
};

function emptyBuckets(): LifecycleBucketCounts {
  return {
    total: 0,
    indexable: 0,
    improve: 0,
    improving: 0,
    readyForPromotion: 0,
    manualReview: 0,
    retired: 0,
  };
}

function fromLifecycle(
  total: number | undefined,
  life:
    | {
        INDEXABLE?: number;
        IMPROVE?: number;
        IMPROVING?: number;
        READY_FOR_REVIEW?: number;
        INDEXABLE_READY?: number;
        MANUAL_REVIEW?: number;
        RETIRED?: number;
      }
    | undefined,
): LifecycleBucketCounts {
  const b = emptyBuckets();
  if (!life) {
    b.total = total ?? 0;
    return b;
  }
  b.indexable = life.INDEXABLE ?? 0;
  b.improve = life.IMPROVE ?? 0;
  b.improving = life.IMPROVING ?? 0;
  b.readyForPromotion =
    (life.INDEXABLE_READY ?? 0) + (life.READY_FOR_REVIEW ?? 0);
  b.manualReview = life.MANUAL_REVIEW ?? 0;
  b.retired = life.RETIRED ?? 0;
  b.total =
    total ??
    b.indexable +
      b.improve +
      b.improving +
      b.readyForPromotion +
      b.manualReview +
      b.retired;
  return b;
}

function add(a: LifecycleBucketCounts, b: LifecycleBucketCounts): LifecycleBucketCounts {
  return {
    total: a.total + b.total,
    indexable: a.indexable + b.indexable,
    improve: a.improve + b.improve,
    improving: a.improving + b.improving,
    readyForPromotion: a.readyForPromotion + b.readyForPromotion,
    manualReview: a.manualReview + b.manualReview,
    retired: a.retired + b.retired,
  };
}

/**
 * Content estate lifecycle for PRESERVE → IMPROVE → PROMOTE.
 */
export function buildContentEstateSection(
  cwd = process.cwd(),
): ContentEstateSection {
  const guidesPath = firstExisting(path.join(cwd, "data/seo/guides-audit.json"));
  const comparePath = firstExisting(
    path.join(cwd, "data/seo/compare-audit.json"),
  );
  const guides = guidesPath
    ? readJsonIfExists<AuditLifecycle>(guidesPath)
    : null;
  const compare = comparePath
    ? readJsonIfExists<AuditLifecycle>(comparePath)
    : null;

  const guideBuckets = fromLifecycle(
    guides?.summary?.total,
    guides?.summary?.byLifecycle,
  );
  const compareBuckets = fromLifecycle(
    compare?.summary?.total,
    compare?.summary?.byLifecycle,
  );

  const softwareBuckets = emptyBuckets();
  try {
    const all = getSoftware({ includeUnpublished: true });
    softwareBuckets.total = all.length;
    for (const s of all) {
      if (isEntityIndexable({ kind: "software", entity: s })) {
        softwareBuckets.indexable += 1;
      } else {
        softwareBuckets.improve += 1;
      }
    }
  } catch {
    // leave zeros
  }

  const other = emptyBuckets();
  try {
    const entries = getSitemapEntries();
    const guideN = guideBuckets.total;
    const compareN = compareBuckets.total;
    const softN = softwareBuckets.total;
    const accounted = guideN + compareN + softN;
    // Approximate “other” as sitemap remainder (best/alternatives/tools/…);
    // lifecycle detail for those types is not fully audited yet.
    other.total = Math.max(0, entries.length - accounted);
    other.indexable = other.total; // sitemap URLs are submitted as indexable intent
  } catch {
    // leave zeros
  }

  const totals = add(
    add(add(guideBuckets, compareBuckets), softwareBuckets),
    other,
  );

  const notes: string[] = [
    "Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.",
    "Guides/comparisons lifecycle from seo audits; software from catalogue indexability; other ≈ sitemap remainder.",
  ];
  if (!guides) notes.push("guides-audit.json missing — guide estate incomplete.");
  if (!compare) notes.push("compare-audit.json missing — comparison estate incomplete.");

  return {
    status:
      guides || compare || softwareBuckets.total > 0 ? "connected" : "partial",
    strategyLabel: "PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC",
    totals,
    byType: {
      guides: guideBuckets,
      comparisons: compareBuckets,
      software: softwareBuckets,
      other,
    },
    notes,
  };
}
