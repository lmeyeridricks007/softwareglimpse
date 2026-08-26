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
import {
  getGuides,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
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
  indexabilityForFeaturePage,
  indexabilityForRequirementPage,
  indexabilityFromSeoFlag,
} from "@/seo/indexability";

export type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

type MutableEntry = SitemapEntry & { path: string };

function resolveLastModified(
  primary: string | Date | undefined,
  fallback: Date,
): Date {
  if (!primary) return fallback;
  const parsed = new Date(primary);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
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

/**
 * Sitemap = canonical ∩ indexable ∩ publishable URLs only.
 * Soft-published / noindex / redirects / utilities are excluded.
 */
export function getSitemapEntries(now: Date = new Date()): SitemapEntry[] {
  const map = new Map<string, MutableEntry>();
  const generatedAt = now;

  const staticHubs: Array<Omit<MutableEntry, "url">> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/software/", changeFrequency: "weekly", priority: 0.8 },
    { path: "/categories/", changeFrequency: "weekly", priority: 0.8 },
    { path: "/tools/", changeFrequency: "weekly", priority: 0.6 },
    { path: "/pricing/", changeFrequency: "weekly", priority: 0.7 },
    { path: "/compare/", changeFrequency: "weekly", priority: 0.7 },
    { path: "/guides/", changeFrequency: "weekly", priority: 0.7 },
    { path: "/use-cases/", changeFrequency: "weekly", priority: 0.65 },
    { path: "/capabilities/", changeFrequency: "weekly", priority: 0.65 },
    { path: "/requirements/", changeFrequency: "weekly", priority: 0.65 },
    { path: "/features/", changeFrequency: "weekly", priority: 0.65 },
    { path: "/resources/", changeFrequency: "weekly", priority: 0.65 },
    { path: "/for/", changeFrequency: "monthly", priority: 0.6 },
    { path: "/industries/", changeFrequency: "weekly", priority: 0.65 },
  ];
  for (const hub of staticHubs) {
    pushUnique(map, { ...hub, lastModified: generatedAt });
  }

  const bestHub = buildBestHubModel();
  if (bestHub.indexable) {
    pushUnique(map, {
      path: "/best/",
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  const hasIndexableAlternativesHub = getAllAlternativesUnfiltered().some(
    (page) => isEntityIndexable({ kind: "alternatives", entity: page }, now),
  );
  if (hasIndexableAlternativesHub) {
    pushUnique(map, {
      path: "/alternatives/",
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.65,
    });
  }

  pushUnique(map, {
    path: "/research/crm-pricing-history/",
    lastModified: generatedAt,
    changeFrequency: "weekly",
    priority: 0.45,
  });

  for (const route of Object.values(COMPANY_ROUTES)) {
    pushUnique(map, {
      path: route,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.4,
    });
  }
  for (const route of Object.values(LEGAL_ROUTES)) {
    const doc = getLegalDocumentByPath(route);
    pushUnique(map, {
      path: route,
      lastModified: resolveLastModified(doc?.lastUpdatedAt, generatedAt),
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }

  for (const tool of TOOLS_REGISTRY) {
    if (tool.status !== "available" || !tool.href) continue;
    // stack-builder is a noindex landing
    if (tool.slug === "software-stack-builder") {
      continue;
    }
    pushUnique(map, {
      path: tool.href,
      lastModified: generatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const category of getCategories()) {
    if (!isEntityIndexable({ kind: "category", entity: category }, now)) {
      continue;
    }
    pushUnique(map, {
      path: `/categories/${category.path.join("/")}/`,
      lastModified: category.metadata.updatedAt || category.metadata.publishedAt,
      changeFrequency: "weekly",
      priority: category.parentSlug ? 0.6 : 0.7,
    });
  }

  for (const software of getSoftware()) {
    if (!isEntityIndexable({ kind: "software", entity: software }, now)) {
      continue;
    }
    pushUnique(map, {
      path: `/software/${software.slug}/`,
      lastModified: software.metadata.updatedAt || software.metadata.publishedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison }, now)) {
      continue;
    }
    pushUnique(map, {
      path: `/compare/${comparison.slug}/`,
      lastModified:
        comparison.metadata.updatedAt || comparison.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const page of getAllAlternativesUnfiltered()) {
    if (!isEntityIndexable({ kind: "alternatives", entity: page }, now)) {
      continue;
    }
    pushUnique(map, {
      path: `/alternatives/${page.slug}/`,
      lastModified: page.metadata.updatedAt || page.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const page of getAllBestPagesUnfiltered()) {
    if (!isEntityIndexable({ kind: "best", entity: page }, now)) continue;
    pushUnique(map, {
      path: `/best/${page.slug}/`,
      lastModified: page.metadata.updatedAt || page.metadata.publishedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const guide of getGuides()) {
    if (!isEntityIndexable({ kind: "guide", entity: guide }, now)) continue;
    pushUnique(map, {
      path: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
      lastModified: guide.metadata.updatedAt || guide.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  for (const useCase of getUseCases()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: useCase.seo.indexable === true,
      metadata: useCase.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(map, {
      path: useCase.seo.canonicalPath || `/use-cases/${useCase.slug}/`,
      lastModified: useCase.metadata.updatedAt || useCase.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const capability of getCapabilities()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: capability.seo.indexable === true,
      metadata: capability.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(map, {
      path: capability.seo.canonicalPath || `/capabilities/${capability.slug}/`,
      lastModified:
        capability.metadata.updatedAt || capability.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const resource of getResources()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: resource.seo.indexable === true,
      metadata: resource.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(map, {
      path: resource.seo.canonicalPath || `/resources/${resource.slug}/`,
      lastModified: resource.metadata.updatedAt || resource.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  for (const audience of getAudiences()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: audience.seo.indexable === true,
      metadata: audience.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(map, {
      path: audience.seo.canonicalPath || `/for/${audience.slug}/`,
      lastModified: audience.metadata.updatedAt || audience.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.55,
    });
  }

  // Industry detail pages when explicitly indexable in seed.
  for (const industry of getIndustries()) {
    const decision = indexabilityFromSeoFlag({
      seoIndexable: industry.seo.indexable === true,
      metadata: industry.metadata,
      now,
    });
    if (!decision.indexable) continue;
    pushUnique(map, {
      path: industry.seo.canonicalPath || `/industries/${industry.slug}/`,
      lastModified: industry.metadata.updatedAt || industry.metadata.publishedAt,
      changeFrequency: "monthly",
      priority: 0.6,
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
    pushUnique(map, {
      path: `/requirements/${slug}/`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
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
    pushUnique(map, {
      path: `/features/${slug}/`,
      lastModified: generatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return [...map.values()].map(({ path: _path, ...entry }) => entry);
}

/** Next.js MetadataRoute adapter. */
export function toMetadataRouteSitemap(
  entries: SitemapEntry[] = getSitemapEntries(),
): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
