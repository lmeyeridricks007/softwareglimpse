import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getCategories,
  getIndustries,
  getSoftware,
  getUseCases,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { parseCategoryToolSlug } from "@/data/config/tools/category-tool-meta";
import { categoryHasPublishedPillar } from "@/services/category-tools/pillar-gate";
import { isEntityIndexable } from "@/domain/quality-gates";
import { indexabilityFromSeoFlag } from "@/seo/indexability";
import {
  CANONICAL_PRODUCTION_ORIGIN,
  sitemapUrlHasProhibitedLegacyPath,
} from "@/seo/english-only-cutover";
import {
  getSitemapEntries,
  type SitemapContentType,
  type SitemapEntry,
} from "@/seo/sitemap";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import {
  getLifecycleOverrideState,
  isLifecyclePromotedIndexable,
} from "@/services/seo/content-lifecycle/store";
import { detectLifecycleOrphans } from "@/services/seo/content-lifecycle/lifecycle-orphans";
import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";
import {
  bumpLifecycle,
  EMPTY_LIFECYCLE_COUNTS,
  type LifecycleCountRow,
  type PageTypeReconcileResult,
  type SitemapDiscrepancy,
  type SitemapEstateReconcileReport,
  type SitemapReconcilePageType,
} from "./types";

export const SITEMAP_RECONCILE_VERSION = "1.0.0";

function pathFromUrl(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function slugFromPath(pathname: string, prefix: string): string | null {
  const re = new RegExp(`^${prefix}/([^/]+)/?$`);
  const m = pathname.match(re);
  return m?.[1] ?? null;
}

function sitemapSlugs(
  entries: SitemapEntry[],
  contentType: SitemapContentType,
  prefix: string,
): Set<string> {
  const out = new Set<string>();
  for (const e of entries) {
    if (e.contentType !== contentType) continue;
    const slug = slugFromPath(pathFromUrl(e.url), prefix);
    if (slug) out.add(slug);
  }
  return out;
}

function deriveFlagState(indexable: boolean): ContentLifecycleState | "UNTRACKED" {
  return indexable ? "INDEXABLE" : "IMPROVE";
}

function finalizeCounts(
  counts: LifecycleCountRow,
  inSitemap: number,
): LifecycleCountRow {
  counts.inSitemap = inSitemap;
  counts.notInSitemap = Math.max(0, counts.totalExisting - inSitemap);
  return counts;
}

function reconcileGuides(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const notes: string[] = [
    "Lifecycle registry + seed seo.indexable; sitemap via isEntityIndexable.",
    "Future-scheduled INDEXABLE guides correctly absent until scheduledAt.",
  ];
  const sm = sitemapSlugs(entries, "guides", "/guides");
  const guides = getGuides({ includeUnpublished: true });
  counts.totalExisting = guides.length;

  let expected = 0;
  for (const g of guides) {
    const registry = getLifecycleOverrideState("guide", g.slug);
    const state: ContentLifecycleState | "UNTRACKED" =
      registry ??
      (g.seo?.indexable === true || isLifecyclePromotedIndexable("guide", g.slug)
        ? "INDEXABLE"
        : "UNTRACKED");
    if (registry) bumpLifecycle(counts, registry);
    else if (state === "INDEXABLE") bumpLifecycle(counts, "INDEXABLE");
    else bumpLifecycle(counts, "UNTRACKED");

    const entityOk = isEntityIndexable({ kind: "guide", entity: g }, now);
    if (entityOk) expected += 1;

    const inSm = sm.has(g.slug);
    if (entityOk && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "guides",
        slug: g.slug,
        path: `/guides/${g.slug}/`,
        detail: `isEntityIndexable=true but absent from sitemap-guides (lifecycle=${registry ?? "none"}; seed=${g.seo?.indexable}; status=${g.metadata.status})`,
        fixable: false,
      });
    }
    if (!entityOk && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "guides",
        slug: g.slug,
        path: `/guides/${g.slug}/`,
        detail: `Not indexable (lifecycle=${registry ?? "none"}) but present in sitemap`,
        fixable: false,
      });
    }
    if (
      registry &&
      registry !== "INDEXABLE" &&
      inSm
    ) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "guides",
        slug: g.slug,
        path: `/guides/${g.slug}/`,
        detail: `Registry ${registry} page present in sitemap`,
        fixable: false,
      });
    }
  }

  // Sitemap orphans (URL not matching any guide entity)
  for (const slug of sm) {
    if (!guides.some((g) => g.slug === slug)) {
      discrepancies.push({
        kind: "sitemap_url_not_indexable",
        pageType: "guides",
        slug,
        path: `/guides/${slug}/`,
        detail: "Sitemap URL has no matching guide entity",
        fixable: false,
      });
    }
  }

  finalizeCounts(counts, sm.size);
  return {
    pageType: "guides",
    sitemapContentType: "guides",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes,
  };
}

function reconcileComparisons(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const sm = sitemapSlugs(entries, "comparisons", "/compare");
  const comps = getAllComparisonsUnfiltered();
  counts.totalExisting = comps.length;
  let expected = 0;

  for (const c of comps) {
    const registry = getLifecycleOverrideState("comparison", c.slug);
    if (registry) bumpLifecycle(counts, registry);
    else if (
      c.seo?.indexable === true ||
      isLifecyclePromotedIndexable("comparison", c.slug)
    ) {
      bumpLifecycle(counts, "INDEXABLE");
    } else {
      bumpLifecycle(counts, "UNTRACKED");
    }

    const entityOk = isEntityIndexable({ kind: "comparison", entity: c }, now);
    if (entityOk) expected += 1;
    const inSm = sm.has(c.slug);
    if (entityOk && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "comparisons",
        slug: c.slug,
        path: `/compare/${c.slug}/`,
        detail: `isEntityIndexable=true but absent from sitemap-comparisons (lifecycle=${registry ?? "none"})`,
        fixable: false,
      });
    }
    if (!entityOk && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "comparisons",
        slug: c.slug,
        path: `/compare/${c.slug}/`,
        detail: `Not indexable but present in sitemap (lifecycle=${registry ?? "none"})`,
        fixable: false,
      });
    }
  }

  finalizeCounts(counts, sm.size);
  return {
    pageType: "comparisons",
    sitemapContentType: "comparisons",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: [
      "Lifecycle registry + seed; reviews are not a separate compare surface.",
    ],
  };
}

function reconcileSoftwareLike(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const sm = sitemapSlugs(entries, "software", "/software");
  const products = getSoftware({ includeUnpublished: true });
  counts.totalExisting = products.length;
  let expected = 0;

  for (const s of products) {
    const ok = isEntityIndexable({ kind: "software", entity: s }, now);
    bumpLifecycle(counts, deriveFlagState(ok));
    if (ok) expected += 1;
    const inSm = sm.has(s.slug);
    if (ok && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "software",
        slug: s.slug,
        path: `/software/${s.slug}/`,
        detail: "Indexable software hub missing from sitemap-software",
        fixable: false,
      });
    }
    if (!ok && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "software",
        slug: s.slug,
        path: `/software/${s.slug}/`,
        detail: "Non-indexable software present in sitemap",
        fixable: false,
      });
    }
  }

  finalizeCounts(counts, sm.size);
  return {
    pageType: "software",
    sitemapContentType: "software",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: [
      "No content-lifecycle registry — state derived from isEntityIndexable.",
      "Editorial reviews live on /software/{slug}/ (not a separate sitemap).",
    ],
  };
}

function reconcileReviews(softwareResult: PageTypeReconcileResult): PageTypeReconcileResult {
  return {
    pageType: "reviews",
    sitemapContentType: "software",
    counts: { ...softwareResult.counts },
    expectedInSitemap: softwareResult.expectedInSitemap,
    discrepancies: [],
    notes: [
      "Reviews are not a separate public URL — counted with software hubs.",
      "No /sitemap-reviews.xml by design (SITEMAP-ARCHITECTURE).",
    ],
  };
}

function reconcileBest(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const sm = sitemapSlugs(entries, "best", "/best");
  // Hub /best/ also in partition — count entity pages only for slug set
  const pages = getAllBestPagesUnfiltered();
  counts.totalExisting = pages.length;
  let expected = 0;
  for (const p of pages) {
    const ok = isEntityIndexable({ kind: "best", entity: p }, now);
    bumpLifecycle(counts, deriveFlagState(ok));
    if (ok) expected += 1;
    const inSm = sm.has(p.slug);
    if (ok && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "best",
        slug: p.slug,
        path: `/best/${p.slug}/`,
        detail: "Indexable best page missing from sitemap-best",
        fixable: false,
      });
    }
    if (!ok && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "best",
        slug: p.slug,
        path: `/best/${p.slug}/`,
        detail: "Non-indexable best page in sitemap",
        fixable: false,
      });
    }
  }
  const hubInSitemap = entries.some(
    (e) => e.contentType === "best" && pathFromUrl(e.url) === "/best/",
  );
  finalizeCounts(counts, sm.size);
  return {
    pageType: "best",
    sitemapContentType: "best",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: [
      `Best hub /best/ in sitemap: ${hubInSitemap}`,
      "No lifecycle registry — flag + quality gate.",
    ],
  };
}

function reconcileAlternatives(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const sm = sitemapSlugs(entries, "alternatives", "/alternatives");
  const pages = getAllAlternativesUnfiltered();
  counts.totalExisting = pages.length;
  let expected = 0;
  for (const p of pages) {
    const ok = isEntityIndexable({ kind: "alternatives", entity: p }, now);
    bumpLifecycle(counts, deriveFlagState(ok));
    if (ok) expected += 1;
    const inSm = sm.has(p.slug);
    if (ok && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "alternatives",
        slug: p.slug,
        path: `/alternatives/${p.slug}/`,
        detail: "Indexable alternatives page missing from sitemap",
        fixable: false,
      });
    }
    if (!ok && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "alternatives",
        slug: p.slug,
        path: `/alternatives/${p.slug}/`,
        detail: "Non-indexable alternatives page in sitemap",
        fixable: false,
      });
    }
  }
  finalizeCounts(counts, sm.size);
  return {
    pageType: "alternatives",
    sitemapContentType: "alternatives",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: ["No lifecycle registry — isEntityIndexable."],
  };
}

function reconcileCategories(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const catEntries = entries.filter((e) => e.contentType === "categories");
  const smPaths = new Set(catEntries.map((e) => pathFromUrl(e.url)));
  const cats = getCategories({ includeUnpublished: true });
  counts.totalExisting = cats.length;
  let expected = 0;
  for (const c of cats) {
    const ok = isEntityIndexable({ kind: "category", entity: c }, now);
    bumpLifecycle(counts, deriveFlagState(ok));
    if (ok) expected += 1;
    const canonical =
      c.seo.canonicalPath || `/categories/${c.path.join("/")}/`;
    const inSm = smPaths.has(canonical);
    if (ok && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "categories",
        slug: c.slug,
        path: canonical,
        detail: "Indexable category missing from sitemap",
        fixable: false,
      });
    }
    if (!ok && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "categories",
        slug: c.slug,
        path: canonical,
        detail: "Non-indexable category in sitemap",
        fixable: false,
      });
    }
    if (ok && inSm && c.seo.canonicalPath && c.seo.canonicalPath !== canonical) {
      discrepancies.push({
        kind: "sitemap_noncanonical",
        pageType: "categories",
        slug: c.slug,
        path: canonical,
        detail: "Sitemap path does not match seo.canonicalPath",
        fixable: true,
      });
    }
  }
  finalizeCounts(counts, catEntries.length);
  return {
    pageType: "categories",
    sitemapContentType: "categories",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: [
      "Category URLs use seo.canonicalPath or /categories/{path.join}/.",
      "No lifecycle registry — isEntityIndexable.",
    ],
  };
}

function reconcileTaxonomy(
  pageType: "use-cases" | "industries",
  entries: SitemapEntry[],
  prefix: string,
  contentType: SitemapContentType,
  list: Array<{
    slug: string;
    seo: { indexable?: boolean; canonicalPath?: string };
    metadata: {
      status: string;
      publishedAt?: string;
      scheduledAt?: string;
      updatedAt?: string;
    };
  }>,
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const sm = sitemapSlugs(entries, contentType, prefix);
  counts.totalExisting = list.length;
  let expected = 0;
  for (const item of list) {
    const ok = indexabilityFromSeoFlag({
      seoIndexable: item.seo.indexable === true,
      metadata: item.metadata as never,
      now,
    }).indexable;
    bumpLifecycle(counts, deriveFlagState(ok));
    if (ok) expected += 1;
    const inSm = sm.has(item.slug);
    if (ok && !inSm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType,
        slug: item.slug,
        path: `${prefix}/${item.slug}/`,
        detail: `seo.indexable entity missing from sitemap-${contentType}`,
        fixable: false,
      });
    }
    if (!ok && inSm) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType,
        slug: item.slug,
        path: `${prefix}/${item.slug}/`,
        detail: "Non-indexable taxonomy page in sitemap",
        fixable: false,
      });
    }
  }
  finalizeCounts(counts, sm.size);
  return {
    pageType,
    sitemapContentType: contentType,
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: ["No lifecycle registry — indexabilityFromSeoFlag."],
  };
}

function reconcileTools(
  entries: SitemapEntry[],
  now: Date,
): PageTypeReconcileResult {
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  const toolEntries = entries.filter((e) => e.contentType === "tools");
  const smPaths = new Set(toolEntries.map((e) => pathFromUrl(e.url)));
  const tools = TOOLS_REGISTRY;
  counts.totalExisting = tools.length;
  let expected = 0;

  for (const tool of tools) {
    const available = tool.status === "available" && Boolean(tool.href);
    const utility =
      tool.slug === "software-stack-builder" || tool.slug === "software-finder";
    const parsed = parseCategoryToolSlug(tool.slug);
    const gated =
      Boolean(parsed) &&
      !categoryHasPublishedPillar(parsed!.categorySlug, now);
    const shouldIndex = available && !utility && !gated;
    bumpLifecycle(counts, deriveFlagState(shouldIndex));
    if (shouldIndex) expected += 1;
    const href = tool.href ?? "";
    const inSm = href ? smPaths.has(href) || smPaths.has(href.replace(/\/?$/, "/")) : false;
    // Normalize trailing slash compare
    const inSmNorm = [...smPaths].some(
      (p) => p.replace(/\/$/, "") === href.replace(/\/$/, ""),
    );
    if (shouldIndex && !inSmNorm) {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "tools",
        slug: tool.slug,
        path: href,
        detail: "Available decision tool missing from sitemap-tools",
        fixable: false,
      });
    }
    if (!shouldIndex && inSmNorm && available) {
      discrepancies.push({
        kind: "improve_or_noindex_in_sitemap",
        pageType: "tools",
        slug: tool.slug,
        path: href,
        detail: utility
          ? "Utility/finder shell incorrectly in sitemap"
          : "Gated/unavailable tool in sitemap",
        fixable: false,
      });
    }
    void inSm;
  }

  finalizeCounts(counts, toolEntries.length);
  return {
    pageType: "tools",
    sitemapContentType: "tools",
    counts,
    expectedInSitemap: expected,
    discrepancies,
    notes: [
      "Tools use registry status + pillar gate — not content-lifecycle.json.",
    ],
  };
}

function reconcileResearch(entries: SitemapEntry[]): PageTypeReconcileResult {
  const researchPaths = [
    "/research/",
    "/research/crm-pricing/",
    "/research/crm-pricing-history/",
  ];
  const counts = EMPTY_LIFECYCLE_COUNTS();
  const discrepancies: SitemapDiscrepancy[] = [];
  counts.totalExisting = researchPaths.length;
  const pageEntries = entries.filter((e) => e.contentType === "pages");
  const paths = new Set(pageEntries.map((e) => pathFromUrl(e.url)));
  let inSm = 0;
  for (const p of researchPaths) {
    bumpLifecycle(counts, "INDEXABLE");
    if (paths.has(p)) inSm += 1;
    else {
      discrepancies.push({
        kind: "indexable_missing_from_sitemap",
        pageType: "research",
        slug: p,
        path: p,
        detail: "Research hub missing from sitemap-pages",
        fixable: false,
      });
    }
  }
  finalizeCounts(counts, inSm);
  return {
    pageType: "research",
    sitemapContentType: "pages",
    counts,
    expectedInSitemap: researchPaths.length,
    discrepancies,
    notes: [
      "Research hubs ship under sitemap-pages (not a separate child sitemap).",
    ],
  };
}

function scanProhibited(entries: SitemapEntry[]): SitemapDiscrepancy[] {
  const out: SitemapDiscrepancy[] = [];
  for (const e of entries) {
    const path = pathFromUrl(e.url);
    if (sitemapUrlHasProhibitedLegacyPath(e.url) || sitemapUrlHasProhibitedLegacyPath(path)) {
      out.push({
        kind: "sitemap_prohibited_class",
        pageType: "guides",
        slug: path,
        path,
        detail: "Locale/taxonomy/parameterized/prohibited path in sitemap",
        fixable: false,
      });
    }
    try {
      const u = new URL(e.url);
      if (`${u.protocol}//${u.host}` !== CANONICAL_PRODUCTION_ORIGIN) {
        out.push({
          kind: "sitemap_noncanonical",
          pageType: "guides",
          slug: path,
          path,
          detail: `Non-canonical host: ${u.host}`,
          fixable: false,
        });
      }
    } catch {
      out.push({
        kind: "sitemap_noncanonical",
        pageType: "guides",
        slug: path,
        path,
        detail: "Unparseable sitemap URL",
        fixable: false,
      });
    }
  }
  return out;
}

export type RunSitemapReconcileOptions = {
  liveBaseUrl?: string | null;
  skipLive?: boolean;
};

/**
 * Estate-wide lifecycle ↔ sitemap reconciliation.
 * Does not mutate lifecycle states to force count matches.
 */
export function runSitemapEstateReconcile(
  options: RunSitemapReconcileOptions = {},
): SitemapEstateReconcileReport {
  loadContentLifecycleStoreFromDisk();
  const now = new Date();
  const entries = getSitemapEntries(now);

  const software = reconcileSoftwareLike(entries, now);
  const pageTypes: PageTypeReconcileResult[] = [
    reconcileGuides(entries, now),
    reconcileComparisons(entries, now),
    software,
    reconcileReviews(software),
    reconcileBest(entries, now),
    reconcileAlternatives(entries, now),
    reconcileCategories(entries, now),
    reconcileTaxonomy(
      "use-cases",
      entries,
      "/use-cases",
      "use-cases",
      getUseCases(),
      now,
    ),
    reconcileTaxonomy(
      "industries",
      entries,
      "/industries",
      "industries",
      getIndustries({ includeUnpublished: true }),
      now,
    ),
    reconcileTools(entries, now),
    reconcileResearch(entries),
  ];

  const prohibited = scanProhibited(entries);
  const lifecycleOrphans: SitemapDiscrepancy[] = detectLifecycleOrphans(now).map(
    (f) => ({
      kind: "lifecycle_orphan" as const,
      pageType: f.kind === "guide" ? ("guides" as const) : ("comparisons" as const),
      slug: f.slug,
      path: f.path,
      detail: `${f.reason}: ${f.detail}`,
      fixable: f.demoteSafe,
    }),
  );
  const discrepancies = [
    ...pageTypes.flatMap((p) => p.discrepancies),
    ...prohibited,
    ...lifecycleOrphans,
  ];

  const totals = EMPTY_LIFECYCLE_COUNTS();
  for (const p of pageTypes) {
    // Avoid double-counting reviews (same as software)
    if (p.pageType === "reviews") continue;
    totals.totalExisting += p.counts.totalExisting;
    totals.INDEXABLE += p.counts.INDEXABLE;
    totals.IMPROVE += p.counts.IMPROVE;
    totals.IMPROVING += p.counts.IMPROVING;
    totals.INDEXABLE_READY += p.counts.INDEXABLE_READY;
    totals.READY_FOR_REVIEW += p.counts.READY_FOR_REVIEW;
    totals.MANUAL_REVIEW += p.counts.MANUAL_REVIEW;
    totals.RETIRED += p.counts.RETIRED;
    totals.UNTRACKED += p.counts.UNTRACKED;
    totals.inSitemap += p.counts.inSitemap;
    totals.notInSitemap += p.counts.notInSitemap;
  }

  return {
    version: SITEMAP_RECONCILE_VERSION,
    generatedAt: now.toISOString(),
    canonicalOrigin: CANONICAL_PRODUCTION_ORIGIN,
    pageTypes,
    totals: {
      ...totals,
      discrepancyCount: discrepancies.length,
      fixableCount: discrepancies.filter((d) => d.fixable).length,
    },
    discrepancies,
    liveValidation: {
      attempted: false,
      baseUrl: options.liveBaseUrl ?? null,
      ok: true,
      notes: ["Live validation runs from CLI after build."],
      childChecks: [],
    },
    schemaNotes: [
      "Hydration: content-lifecycle.json is bundled into the lifecycle store and reloaded from disk in Node sitemap builds.",
      "Do not change lifecycle states merely to make counts match.",
      "Reviews share software sitemap partition by design.",
      "INDEXABLE registry counts can exceed sitemap counts when pages are future-scheduled — those exclusions are correct.",
      "Deploy required: www.softwareglimpse.com may still serve a legacy monolithic urlset until this build is live.",
    ],
  };
}

export async function validateLiveSitemaps(
  baseUrl: string,
): Promise<SitemapEstateReconcileReport["liveValidation"]> {
  const notes: string[] = [];
  const childChecks: SitemapEstateReconcileReport["liveValidation"]["childChecks"] =
    [];
  const origin = baseUrl.replace(/\/$/, "");

  async function fetchXml(path: string): Promise<{
    status: number | null;
    urlCount: number | null;
    error: string | null;
    body: string;
  }> {
    try {
      const res = await fetch(`${origin}${path}`, {
        headers: { accept: "application/xml,text/xml,*/*" },
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
      if (res.status >= 300 && res.status < 400) {
        return {
          status: res.status,
          urlCount: null,
          error: `redirect:${res.headers.get("location") ?? "?"}`,
          body: "",
        };
      }
      const body = await res.text();
      const locs = body.match(/<loc>/g)?.length ?? 0;
      return {
        status: res.status,
        urlCount: locs,
        error: res.status === 200 ? null : `http_${res.status}`,
        body,
      };
    } catch (error) {
      return {
        status: null,
        urlCount: null,
        error: error instanceof Error ? error.message : String(error),
        body: "",
      };
    }
  }

  const index = await fetchXml("/sitemap.xml");
  childChecks.push({
    path: "/sitemap.xml",
    status: index.status,
    urlCount: index.urlCount,
    error: index.error,
  });

  if (index.status !== 200 || index.error) {
    notes.push(`Sitemap index failed: ${index.error ?? index.status}`);
    return {
      attempted: true,
      baseUrl: origin,
      ok: false,
      notes,
      childChecks,
    };
  }

  const isIndex = index.body.includes("<sitemapindex");
  const isLegacyUrlset =
    index.body.includes("<urlset") && !isIndex;

  if (isLegacyUrlset) {
    notes.push(
      "Legacy monolithic <urlset> at /sitemap.xml — named child sitemaps not deployed yet. Local/production build serves sitemapindex.",
    );
    return {
      attempted: true,
      baseUrl: origin,
      ok: false,
      notes,
      childChecks,
    };
  }

  if (!isIndex) {
    notes.push("Index response is not a sitemapindex");
    return {
      attempted: true,
      baseUrl: origin,
      ok: false,
      notes,
      childChecks,
    };
  }

  const childHrefs = [
    ...index.body.matchAll(/<loc>([^<]+)<\/loc>/g),
  ]
    .map((m) => {
      try {
        return new URL(m[1]!).pathname;
      } catch {
        return null;
      }
    })
    .filter((p): p is string => Boolean(p));

  let ok = true;
  for (const child of childHrefs.slice(0, 20)) {
    const result = await fetchXml(child);
    childChecks.push({
      path: child,
      status: result.status,
      urlCount: result.urlCount,
      error: result.error,
    });
    if (result.status !== 200 || result.error) {
      ok = false;
      notes.push(`${child}: ${result.error ?? result.status}`);
    }
    if (result.status === 200 && result.body && !result.body.includes("<urlset")) {
      ok = false;
      notes.push(`${child}: expected urlset XML`);
    }
    if (result.body) {
      for (const loc of [...result.body.matchAll(/<loc>([^<]+)<\/loc>/g)].slice(
        0,
        50,
      )) {
        const locUrl = loc[1]!;
        if (sitemapUrlHasProhibitedLegacyPath(locUrl)) {
          ok = false;
          notes.push(`Prohibited URL in ${child}: ${locUrl}`);
        }
      }
    }
  }

  if (ok) {
    notes.push(`Live sitemap OK — ${childHrefs.length} child sitemaps probed`);
  }
  return {
    attempted: true,
    baseUrl: origin,
    ok,
    notes,
    childChecks,
  };
}
