import { ensureContentLifecycleHydratedFromDisk } from "@/services/seo/content-lifecycle/store-write";
import type { MetadataRoute } from "next";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAudiences,
  getCapabilities,
  getCategories,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { parseCategoryToolSlug } from "@/data/config/tools/category-tool-meta";
import { categoryHasPublishedPillar } from "@/services/category-tools/pillar-gate";
import { buildBestHubModel } from "@/services/best-hub";
import {
  getFeatureDetailProfile,
  listFeatureDetailParams,
} from "@/data/feature-detail";
import {
  CRM_REQUIREMENT_PILLAR_SLUGS,
  getRequirementDetailProfile,
  listRequirementDetailParams,
} from "@/data/requirement-detail";
import { isEntityIndexable } from "@/domain/quality-gates";
import { isMergedFeatureSlug } from "@/data/config/hub-page-twins";
import {
  COMPANY_ROUTES,
  getLegalDocumentByPath,
  LEGAL_ROUTES,
} from "@/services/site-foundation";
import { canonicalUrl } from "@/seo/canonical";
import {
  CANONICAL_PRODUCTION_ORIGIN,
  sitemapUrlHasProhibitedLegacyPath,
} from "@/seo/english-only-cutover";
import {
  indexabilityForFeaturePage,
  indexabilityForRequirementPage,
  indexabilityFromSeoFlag,
} from "@/seo/indexability";
import { getSiteUrl } from "@/lib/site";

/**
 * Logical sitemap partitions for Search Console diagnostics.
 *
 * Reviews are intentionally omitted as a separate child sitemap: editorial
 * reviews live on `/software/{slug}/` and ship inside `software`.
 */
export const SITEMAP_CONTENT_TYPES = [
  "pages",
  "software",
  "comparisons",
  "guides",
  "alternatives",
  "categories",
  "tools",
  "best",
  "use-cases",
  "capabilities",
  "features",
  "requirements",
  "resources",
  "audiences",
  "industries",
] as const;

export type SitemapContentType = (typeof SITEMAP_CONTENT_TYPES)[number];

export type SitemapEntry = {
  url: string;
  /** Present only when backed by entity/document metadata — never build-time "now". */
  lastModified?: string | Date;
  contentType: SitemapContentType;
};

type MutableEntry = SitemapEntry & { path: string };

export type SitemapPartition = {
  contentType: SitemapContentType;
  /** Filename stem: `software` → `/sitemap-software.xml`. */
  slug: string;
  label: string;
  entries: SitemapEntry[];
};

export type SitemapChildFile = {
  /** Route param for `/sitemaps/[id]` — e.g. `software.xml`, `comparisons-2.xml`. */
  id: string;
  /** Public discovery URL path — e.g. `/sitemap-software.xml`. */
  publicPath: string;
  contentType: SitemapContentType;
  chunkIndex: number | null;
  entries: SitemapEntry[];
};

export type SitemapExclusionCounts = {
  noindexGuides: number;
  ineligibleComparisons: number;
  noindexAlternatives: number;
  noindexSoftware: number;
  noindexCategories: number;
  noindexBest: number;
  utilityTools: number;
  gatedCategoryTools: number;
  noindexUseCases: number;
  noindexCapabilities: number;
  noindexResources: number;
  noindexAudiences: number;
  noindexIndustries: number;
  ineligibleFeatures: number;
  ineligibleRequirements: number;
  mergedFeatures: number;
};

export type SitemapDiagnostics = {
  generatedAt: string;
  canonicalOrigin: string;
  totalUrls: number;
  byContentType: Record<SitemapContentType, number>;
  childSitemaps: Array<{
    id: string;
    publicPath: string;
    contentType: SitemapContentType;
    urlCount: number;
  }>;
  exclusions: SitemapExclusionCounts;
  duplicateUrls: string[];
  prohibitedUrls: string[];
  nonCanonicalHostUrls: string[];
};

/** Soft per-file cap — well under Google's 50k / 50MB limits. */
export const SITEMAP_CHUNK_SIZE = 10_000;

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control":
    "public, max-age=3600, stale-while-revalidate=86400, s-maxage=86400",
} as const;

const PARTITION_META: Record<
  SitemapContentType,
  { slug: string; label: string }
> = {
  pages: { slug: "pages", label: "Core pages & hubs" },
  software: { slug: "software", label: "Software / reviews" },
  comparisons: { slug: "comparisons", label: "Comparisons" },
  guides: { slug: "guides", label: "Guides" },
  alternatives: { slug: "alternatives", label: "Alternatives" },
  categories: { slug: "categories", label: "Categories" },
  tools: { slug: "tools", label: "Tools" },
  best: { slug: "best", label: "Best-of buying guides" },
  "use-cases": { slug: "use-cases", label: "Use cases" },
  capabilities: { slug: "capabilities", label: "Capabilities" },
  features: { slug: "features", label: "Features" },
  requirements: { slug: "requirements", label: "Requirements" },
  resources: { slug: "resources", label: "Resources" },
  audiences: { slug: "audiences", label: "Audience (for/)" },
  industries: { slug: "industries", label: "Industries" },
};

function resolveLastModified(
  primary: string | Date | undefined,
): Date | undefined {
  if (!primary) return undefined;
  const parsed = new Date(primary);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function pushUnique(
  map: Map<string, MutableEntry>,
  entry: Omit<MutableEntry, "url"> & { path: string },
) {
  const path = entry.path;
  const url = canonicalUrl(path);
  if (map.has(url)) return;
  map.set(url, { ...entry, url });
}

function emptyMaps(): Record<SitemapContentType, Map<string, MutableEntry>> {
  return Object.fromEntries(
    SITEMAP_CONTENT_TYPES.map((t) => [t, new Map<string, MutableEntry>()]),
  ) as Record<SitemapContentType, Map<string, MutableEntry>>;
}

function toEntries(map: Map<string, MutableEntry>): SitemapEntry[] {
  return [...map.values()]
    .map((entry) => ({
      url: entry.url,
      contentType: entry.contentType,
      ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * Build indexable URL inventory partitioned by content type.
 * Eligibility = production canonical ∩ index-worthy ∩ publishable.
 */
export function buildSitemapPartitions(
  now: Date = new Date(),
): SitemapPartition[] {
  // Prefer on-disk lifecycle when running in Node (CLI / route handlers) so
  // promotions in data/seo/content-lifecycle.json are sitemap-visible.
  // Hydrate once — re-reading every call would wipe in-memory upserts.
  try {
    ensureContentLifecycleHydratedFromDisk();
  } catch {
    // Bundled lifecycle JSON in store.ts still hydrates on first read.
  }

  const maps = emptyMaps();

  const staticHubs: Array<{ path: string }> = [
    { path: "/" },
    { path: "/software/" },
    { path: "/categories/" },
    { path: "/tools/" },
    { path: "/pricing/" },
    { path: "/compare/" },
    { path: "/guides/" },
    { path: "/use-cases/" },
    { path: "/capabilities/" },
    { path: "/requirements/" },
    { path: "/features/" },
    { path: "/resources/" },
    { path: "/for/" },
    { path: "/industries/" },
    { path: "/research/" },
    { path: "/research/crm-pricing/" },
    { path: "/research/crm-pricing-history/" },
  ];
  for (const hub of staticHubs) {
    // No manufactured lastmod for static hubs.
    pushUnique(maps.pages, { path: hub.path, contentType: "pages" });
  }

  const bestHub = buildBestHubModel();
  if (bestHub.indexable) {
    pushUnique(maps.best, { path: "/best/", contentType: "best" });
  }

  const hasIndexableAlternativesHub = getAllAlternativesUnfiltered().some(
    (page) => isEntityIndexable({ kind: "alternatives", entity: page }, now),
  );
  if (hasIndexableAlternativesHub) {
    pushUnique(maps.alternatives, {
      path: "/alternatives/",
      contentType: "alternatives",
    });
  }

  for (const route of Object.values(COMPANY_ROUTES)) {
    pushUnique(maps.pages, { path: route, contentType: "pages" });
  }
  for (const route of Object.values(LEGAL_ROUTES)) {
    const doc = getLegalDocumentByPath(route);
    pushUnique(maps.pages, {
      path: route,
      contentType: "pages",
      lastModified: resolveLastModified(doc?.lastUpdatedAt),
    });
  }

  for (const tool of TOOLS_REGISTRY) {
    if (tool.status !== "available" || !tool.href) continue;
    // Category-router shells — reachable, not sitemap-eligible.
    if (
      tool.slug === "software-stack-builder" ||
      tool.slug === "software-finder"
    ) {
      continue;
    }
    const parsed = parseCategoryToolSlug(tool.slug);
    if (parsed && !categoryHasPublishedPillar(parsed.categorySlug, now)) {
      continue;
    }
    pushUnique(maps.tools, { path: tool.href, contentType: "tools" });
  }

  for (const category of getCategories()) {
    if (!isEntityIndexable({ kind: "category", entity: category }, now)) {
      continue;
    }
    pushUnique(maps.categories, {
      path:
        category.seo.canonicalPath ||
        `/categories/${category.path.join("/")}/`,
      contentType: "categories",
      lastModified: resolveLastModified(
        category.metadata.updatedAt || category.metadata.publishedAt,
      ),
    });
  }

  for (const software of getSoftware()) {
    if (!isEntityIndexable({ kind: "software", entity: software }, now)) {
      continue;
    }
    pushUnique(maps.software, {
      path: `/software/${software.slug}/`,
      contentType: "software",
      lastModified: resolveLastModified(
        software.metadata.updatedAt || software.metadata.publishedAt,
      ),
    });
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison }, now)) {
      continue;
    }
    pushUnique(maps.comparisons, {
      path: `/compare/${comparison.slug}/`,
      contentType: "comparisons",
      lastModified: resolveLastModified(
        comparison.metadata.updatedAt || comparison.metadata.publishedAt,
      ),
    });
  }

  for (const page of getAllAlternativesUnfiltered()) {
    if (!isEntityIndexable({ kind: "alternatives", entity: page }, now)) {
      continue;
    }
    pushUnique(maps.alternatives, {
      path: `/alternatives/${page.slug}/`,
      contentType: "alternatives",
      lastModified: resolveLastModified(
        page.metadata.updatedAt || page.metadata.publishedAt,
      ),
    });
  }

  for (const page of getAllBestPagesUnfiltered()) {
    if (!isEntityIndexable({ kind: "best", entity: page }, now)) continue;
    pushUnique(maps.best, {
      path: `/best/${page.slug}/`,
      contentType: "best",
      lastModified: resolveLastModified(
        page.metadata.updatedAt || page.metadata.publishedAt,
      ),
    });
  }

  for (const guide of getGuides()) {
    if (!isEntityIndexable({ kind: "guide", entity: guide }, now)) continue;
    pushUnique(maps.guides, {
      path: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
      contentType: "guides",
      lastModified: resolveLastModified(
        guide.metadata.updatedAt || guide.metadata.publishedAt,
      ),
    });
  }

  for (const useCase of getUseCases()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: useCase.seo.indexable === true,
      metadata: useCase.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(maps["use-cases"], {
      path: useCase.seo.canonicalPath || `/use-cases/${useCase.slug}/`,
      contentType: "use-cases",
      lastModified: resolveLastModified(
        useCase.metadata.updatedAt || useCase.metadata.publishedAt,
      ),
    });
  }

  for (const capability of getCapabilities()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: capability.seo.indexable === true,
      metadata: capability.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(maps.capabilities, {
      path: capability.seo.canonicalPath || `/capabilities/${capability.slug}/`,
      contentType: "capabilities",
      lastModified: resolveLastModified(
        capability.metadata.updatedAt || capability.metadata.publishedAt,
      ),
    });
  }

  for (const resource of getResources()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: resource.seo.indexable === true,
      metadata: resource.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(maps.resources, {
      path: resource.seo.canonicalPath || `/resources/${resource.slug}/`,
      contentType: "resources",
      lastModified: resolveLastModified(
        resource.metadata.updatedAt || resource.metadata.publishedAt,
      ),
    });
  }

  for (const audience of getAudiences()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: audience.seo.indexable === true,
      metadata: audience.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(maps.audiences, {
      path: audience.seo.canonicalPath || `/for/${audience.slug}/`,
      contentType: "audiences",
      lastModified: resolveLastModified(
        audience.metadata.updatedAt || audience.metadata.publishedAt,
      ),
    });
  }

  for (const industry of getIndustries()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: industry.seo.indexable === true,
      metadata: industry.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(maps.industries, {
      path: industry.seo.canonicalPath || `/industries/${industry.slug}/`,
      contentType: "industries",
      lastModified: resolveLastModified(
        industry.metadata.updatedAt || industry.metadata.publishedAt,
      ),
    });
  }

  const pillar = new Set<string>(CRM_REQUIREMENT_PILLAR_SLUGS);
  for (const { slug } of listRequirementDetailParams()) {
    const profile = getRequirementDetailProfile(slug);
    if (!profile) continue;
    const decision = indexabilityForRequirementPage({
      isPillar: pillar.has(slug),
      hasOverview: Boolean(profile.overview),
      hasHero: Boolean(profile.heroVisual?.src),
    });
    if (!decision.indexable) continue;
    pushUnique(maps.requirements, {
      path: `/requirements/${slug}/`,
      contentType: "requirements",
    });
  }

  for (const { slug } of listFeatureDetailParams()) {
    if (isMergedFeatureSlug(slug)) continue;
    const profile = getFeatureDetailProfile(slug);
    if (!profile) continue;
    const decision = indexabilityForFeaturePage({
      hasModel: true,
      hasOverview: Boolean(profile.overview),
      hasTagline: Boolean(profile.tagline?.trim()),
    });
    if (!decision.indexable) continue;
    pushUnique(maps.features, {
      path: `/features/${slug}/`,
      contentType: "features",
    });
  }

  return SITEMAP_CONTENT_TYPES.map((contentType) => {
    const meta = PARTITION_META[contentType];
    return {
      contentType,
      slug: meta.slug,
      label: meta.label,
      entries: toEntries(maps[contentType]),
    };
  }).filter((p) => p.entries.length > 0);
}

/** Flat list of all sitemap URLs (order: partition order, then URL). */
export function getSitemapEntries(now: Date = new Date()): SitemapEntry[] {
  return buildSitemapPartitions(now).flatMap((p) => p.entries);
}

function chunkEntries<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];
  if (items.length <= size) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Deterministic child sitemap files. Empty partitions are omitted.
 * Pagination only when a partition exceeds `SITEMAP_CHUNK_SIZE`.
 */
export function buildSitemapChildFiles(
  partitions: SitemapPartition[] = buildSitemapPartitions(),
): SitemapChildFile[] {
  const files: SitemapChildFile[] = [];
  for (const partition of partitions) {
    const chunks = chunkEntries(partition.entries, SITEMAP_CHUNK_SIZE);
    const paginate = chunks.length > 1;
    chunks.forEach((entries, index) => {
      const n = index + 1;
      const stem = paginate
        ? `${partition.slug}-${n}`
        : partition.slug;
      files.push({
        id: `${stem}.xml`,
        publicPath: `/sitemap-${stem}.xml`,
        contentType: partition.contentType,
        chunkIndex: paginate ? n : null,
        entries,
      });
    });
  }
  return files;
}

export function getSitemapChildFile(
  id: string,
  files: SitemapChildFile[] = buildSitemapChildFiles(),
): SitemapChildFile | null {
  const normalized = id.trim().replace(/\/$/, "");
  const withExt = normalized.endsWith(".xml")
    ? normalized
    : `${normalized}.xml`;
  return files.find((f) => f.id === withExt) ?? null;
}

/** Parse `/sitemaps/software.xml` style ids (named children only). */
export function parseSitemapChildId(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/$/, "");
  const withoutExt = trimmed.endsWith(".xml")
    ? trimmed.slice(0, -4)
    : trimmed;
  if (!withoutExt || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(withoutExt)) {
    return null;
  }
  return `${withoutExt.toLowerCase()}.xml`;
}

export function escapeXmlText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatLastmod(value: string | Date | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function buildUrlsetXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const lines = [`<url>`, `<loc>${escapeXmlText(entry.url)}</loc>`];
      const lastmod = formatLastmod(entry.lastModified);
      if (lastmod) lines.push(`<lastmod>${lastmod}</lastmod>`);
      lines.push(`</url>`);
      return lines.join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`;
}

function maxLastmod(entries: SitemapEntry[]): string | undefined {
  let maxMs = 0;
  for (const entry of entries) {
    const formatted = formatLastmod(entry.lastModified);
    if (!formatted) continue;
    const ms = Date.parse(formatted);
    if (ms > maxMs) maxMs = ms;
  }
  return maxMs > 0 ? new Date(maxMs).toISOString() : undefined;
}

export function buildSitemapIndexXml(options: {
  siteUrl?: string;
  children?: SitemapChildFile[];
}): string {
  const base = (options.siteUrl ?? getSiteUrl()).replace(/\/$/, "");
  const children = options.children ?? buildSitemapChildFiles();
  const body = children
    .map((child) => {
      const loc = `${base}${child.publicPath}`;
      const lines = [`<sitemap>`, `<loc>${escapeXmlText(loc)}</loc>`];
      const lastmod = maxLastmod(child.entries);
      if (lastmod) lines.push(`<lastmod>${lastmod}</lastmod>`);
      lines.push(`</sitemap>`);
      return lines.join("");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>\n`;
}

export function computeSitemapExclusions(
  now: Date = new Date(),
): SitemapExclusionCounts {
  let noindexGuides = 0;
  for (const guide of getGuides()) {
    if (!isEntityIndexable({ kind: "guide", entity: guide }, now)) {
      noindexGuides += 1;
    }
  }

  let ineligibleComparisons = 0;
  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison }, now)) {
      ineligibleComparisons += 1;
    }
  }

  let noindexAlternatives = 0;
  for (const page of getAllAlternativesUnfiltered()) {
    if (!isEntityIndexable({ kind: "alternatives", entity: page }, now)) {
      noindexAlternatives += 1;
    }
  }

  let noindexSoftware = 0;
  for (const software of getSoftware()) {
    if (!isEntityIndexable({ kind: "software", entity: software }, now)) {
      noindexSoftware += 1;
    }
  }

  let noindexCategories = 0;
  for (const category of getCategories()) {
    if (!isEntityIndexable({ kind: "category", entity: category }, now)) {
      noindexCategories += 1;
    }
  }

  let noindexBest = 0;
  for (const page of getAllBestPagesUnfiltered()) {
    if (!isEntityIndexable({ kind: "best", entity: page }, now)) {
      noindexBest += 1;
    }
  }

  let utilityTools = 0;
  let gatedCategoryTools = 0;
  for (const tool of TOOLS_REGISTRY) {
    if (tool.status !== "available" || !tool.href) continue;
    if (tool.slug === "software-stack-builder") {
      utilityTools += 1;
      continue;
    }
    const parsed = parseCategoryToolSlug(tool.slug);
    if (parsed && !categoryHasPublishedPillar(parsed.categorySlug, now)) {
      gatedCategoryTools += 1;
    }
  }

  let noindexUseCases = 0;
  for (const useCase of getUseCases()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: useCase.seo.indexable === true,
        metadata: useCase.metadata,
        now,
      }).indexable
    ) {
      noindexUseCases += 1;
    }
  }

  let noindexCapabilities = 0;
  for (const capability of getCapabilities()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: capability.seo.indexable === true,
        metadata: capability.metadata,
        now,
      }).indexable
    ) {
      noindexCapabilities += 1;
    }
  }

  let noindexResources = 0;
  for (const resource of getResources()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: resource.seo.indexable === true,
        metadata: resource.metadata,
        now,
      }).indexable
    ) {
      noindexResources += 1;
    }
  }

  let noindexAudiences = 0;
  for (const audience of getAudiences()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: audience.seo.indexable === true,
        metadata: audience.metadata,
        now,
      }).indexable
    ) {
      noindexAudiences += 1;
    }
  }

  let noindexIndustries = 0;
  for (const industry of getIndustries()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: industry.seo.indexable === true,
        metadata: industry.metadata,
        now,
      }).indexable
    ) {
      noindexIndustries += 1;
    }
  }

  let ineligibleFeatures = 0;
  let mergedFeatures = 0;
  for (const { slug } of listFeatureDetailParams()) {
    if (isMergedFeatureSlug(slug)) {
      mergedFeatures += 1;
      continue;
    }
    const profile = getFeatureDetailProfile(slug);
    if (!profile) {
      ineligibleFeatures += 1;
      continue;
    }
    if (
      !indexabilityForFeaturePage({
        hasModel: true,
        hasOverview: Boolean(profile.overview),
        hasTagline: Boolean(profile.tagline?.trim()),
      }).indexable
    ) {
      ineligibleFeatures += 1;
    }
  }

  let ineligibleRequirements = 0;
  const pillar = new Set<string>(CRM_REQUIREMENT_PILLAR_SLUGS);
  for (const { slug } of listRequirementDetailParams()) {
    const profile = getRequirementDetailProfile(slug);
    if (!profile) {
      ineligibleRequirements += 1;
      continue;
    }
    if (
      !indexabilityForRequirementPage({
        isPillar: pillar.has(slug),
        hasOverview: Boolean(profile.overview),
        hasHero: Boolean(profile.heroVisual?.src),
      }).indexable
    ) {
      ineligibleRequirements += 1;
    }
  }

  return {
    noindexGuides,
    ineligibleComparisons,
    noindexAlternatives,
    noindexSoftware,
    noindexCategories,
    noindexBest,
    utilityTools,
    gatedCategoryTools,
    noindexUseCases,
    noindexCapabilities,
    noindexResources,
    noindexAudiences,
    noindexIndustries,
    ineligibleFeatures,
    ineligibleRequirements,
    mergedFeatures,
  };
}

export function getSitemapDiagnostics(
  now: Date = new Date(),
): SitemapDiagnostics {
  const partitions = buildSitemapPartitions(now);
  const children = buildSitemapChildFiles(partitions);
  const entries = partitions.flatMap((p) => p.entries);

  const byContentType = Object.fromEntries(
    SITEMAP_CONTENT_TYPES.map((t) => [t, 0]),
  ) as Record<SitemapContentType, number>;
  for (const p of partitions) {
    byContentType[p.contentType] = p.entries.length;
  }

  const seen = new Map<string, number>();
  for (const entry of entries) {
    seen.set(entry.url, (seen.get(entry.url) ?? 0) + 1);
  }
  const duplicateUrls = [...seen.entries()]
    .filter(([, n]) => n > 1)
    .map(([url]) => url)
    .sort();

  const siteOrigin = getSiteUrl().replace(/\/$/, "");
  const prohibitedUrls: string[] = [];
  const nonCanonicalHostUrls: string[] = [];
  for (const entry of entries) {
    if (sitemapUrlHasProhibitedLegacyPath(entry.url)) {
      prohibitedUrls.push(entry.url);
    }
    if (
      !entry.url.startsWith(`${siteOrigin}/`) &&
      entry.url !== `${siteOrigin}/`
    ) {
      nonCanonicalHostUrls.push(entry.url);
    }
  }

  return {
    generatedAt: now.toISOString(),
    canonicalOrigin: CANONICAL_PRODUCTION_ORIGIN,
    totalUrls: entries.length,
    byContentType,
    childSitemaps: children.map((c) => ({
      id: c.id,
      publicPath: c.publicPath,
      contentType: c.contentType,
      urlCount: c.entries.length,
    })),
    exclusions: computeSitemapExclusions(now),
    duplicateUrls,
    prohibitedUrls,
    nonCanonicalHostUrls,
  };
}

/** Next.js MetadataRoute adapter (legacy; prefer route-handler XML builders). */
export function toMetadataRouteSitemap(
  entries: SitemapEntry[] = getSitemapEntries(),
): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
  }));
}

// --- Backward-compatible aliases (numeric chunk API → named children) ---

/** @deprecated Prefer buildSitemapChildFiles(). */
export function getSitemapChunkCount(
  entryCount: number = getSitemapEntries().length,
): number {
  return Math.max(1, Math.ceil(entryCount / SITEMAP_CHUNK_SIZE));
}

/** @deprecated Prefer getSitemapChildFile(). */
export function getSitemapChunk(
  chunkId: number,
  entries: SitemapEntry[] = getSitemapEntries(),
): SitemapEntry[] {
  const start = chunkId * SITEMAP_CHUNK_SIZE;
  return entries.slice(start, start + SITEMAP_CHUNK_SIZE);
}

/** @deprecated Prefer parseSitemapChildId(). */
export function parseSitemapChunkId(raw: string): number | null {
  const trimmed = raw.trim().replace(/\/$/, "");
  const withoutExt = trimmed.endsWith(".xml")
    ? trimmed.slice(0, -4)
    : trimmed;
  if (!/^\d+$/.test(withoutExt)) return null;
  return Number(withoutExt);
}
