import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";

export type SitemapReconcilePageType =
  | "guides"
  | "comparisons"
  | "software"
  | "reviews"
  | "best"
  | "alternatives"
  | "categories"
  | "use-cases"
  | "industries"
  | "tools"
  | "research";

export type LifecycleCountRow = {
  totalExisting: number;
  INDEXABLE: number;
  IMPROVE: number;
  IMPROVING: number;
  INDEXABLE_READY: number;
  READY_FOR_REVIEW: number;
  MANUAL_REVIEW: number;
  RETIRED: number;
  /** Entities with no lifecycle registry row (seed/flag derived). */
  UNTRACKED: number;
  inSitemap: number;
  notInSitemap: number;
};

export type SitemapDiscrepancyKind =
  | "indexable_missing_from_sitemap"
  | "improve_or_noindex_in_sitemap"
  | "sitemap_url_not_indexable"
  | "sitemap_prohibited_class"
  | "sitemap_noncanonical"
  | "promoted_missing_from_sitemap"
  | "wrong_sitemap_partition"
  | "lifecycle_orphan";

export type SitemapDiscrepancy = {
  kind: SitemapDiscrepancyKind;
  pageType: SitemapReconcilePageType;
  slug: string;
  path: string;
  detail: string;
  /** When true, auto-fixable without changing lifecycle state. */
  fixable: boolean;
};

export type PageTypeReconcileResult = {
  pageType: SitemapReconcilePageType;
  sitemapContentType: string;
  counts: LifecycleCountRow;
  /** INDEXABLE (or flag-indexable) entities that should be in sitemap. */
  expectedInSitemap: number;
  discrepancies: SitemapDiscrepancy[];
  notes: string[];
};

export type SitemapEstateReconcileReport = {
  version: string;
  generatedAt: string;
  canonicalOrigin: string;
  pageTypes: PageTypeReconcileResult[];
  totals: LifecycleCountRow & {
    discrepancyCount: number;
    fixableCount: number;
  };
  discrepancies: SitemapDiscrepancy[];
  liveValidation: {
    attempted: boolean;
    baseUrl: string | null;
    ok: boolean;
    notes: string[];
    childChecks: Array<{
      path: string;
      status: number | null;
      urlCount: number | null;
      error: string | null;
    }>;
  };
  schemaNotes: string[];
};

export const EMPTY_LIFECYCLE_COUNTS = (): LifecycleCountRow => ({
  totalExisting: 0,
  INDEXABLE: 0,
  IMPROVE: 0,
  IMPROVING: 0,
  INDEXABLE_READY: 0,
  READY_FOR_REVIEW: 0,
  MANUAL_REVIEW: 0,
  RETIRED: 0,
  UNTRACKED: 0,
  inSitemap: 0,
  notInSitemap: 0,
});

export function bumpLifecycle(
  counts: LifecycleCountRow,
  state: ContentLifecycleState | "UNTRACKED",
): void {
  if (state === "UNTRACKED") counts.UNTRACKED += 1;
  else counts[state] += 1;
}
