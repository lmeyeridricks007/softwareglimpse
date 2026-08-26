import {
  getBestPages,
  getCapabilities,
  getCategories,
  getComparisons,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import {
  getPublicationContextSync,
  getSearchIndexPublicationContext,
  type PublicationContext,
} from "@/domain/publication-context";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getGuideSearchEntries } from "./guide-search-entries";
import {
  CRM_FEATURE_PILLAR_SLUGS,
  getFeatureDetailProfile,
  listFeatureDetailParams,
} from "@/data/feature-detail";
import {
  CRM_REQUIREMENT_PILLAR_SLUGS,
  getRequirementDetailProfile,
  listRequirementDetailParams,
} from "@/data/requirement-detail";
import { publicAlternativesHref } from "@/services/relationships/software-links";
import { getUseCaseHubProfile } from "@/data/use-case-hub";
import { getResourceHubProfile } from "@/data/resource-hub";
import { getCapabilityHubProfile } from "@/data/capability-hub";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import {
  buildSearchRuntimeIndex,
  type SearchRuntimeIndex,
} from "./runtime-index";
import type { SearchDocument, SearchResultType } from "./types";

const PRECOMPILED_INDEX_PATH = path.join(
  process.cwd(),
  "src/data/generated/search-index.json",
);

let cachedIndex: SearchDocument[] | null = null;
let cachedRuntime: SearchRuntimeIndex | null = null;

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function categoryLabel(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  if (slug === "crm") return "CRM";
  return humanize(slug);
}

function pricingTeaser(software: {
  pricingVerifiedAt?: string;
  pricing?: {
    startingPriceMonthly?: number;
    currency?: string;
  };
}): string | undefined {
  if (!software.pricingVerifiedAt || !software.pricing) return undefined;
  const starting = software.pricing.startingPriceMonthly;
  if (starting == null || Number.isNaN(starting)) return undefined;
  const currency = software.pricing.currency === "EUR" ? "€" : "$";
  return `From ${currency}${starting} per user/month`;
}

function pushUnique(
  docs: SearchDocument[],
  seen: Set<string>,
  doc: SearchDocument,
): void {
  const key = `${doc.type}:${doc.id}`;
  if (seen.has(key)) return;
  seen.add(key);
  docs.push(doc);
}

function typeImportance(type: SearchResultType): number {
  switch (type) {
    case "SOFTWARE":
      return 90;
    case "BEST_PAGE":
      return 88;
    case "TOOL":
      return 85;
    case "COMPARISON":
      return 72;
    case "RESOURCE":
      return 70;
    case "FEATURE":
      return 68;
    case "REQUIREMENT":
      return 66;
    case "GUIDE":
      return 64;
    case "CATEGORY":
      return 62;
    case "INDUSTRY":
      return 60;
    case "USE_CASE":
      return 58;
    case "CAPABILITY":
      return 56;
    default:
      return 50;
  }
}

function loadPrecompiledSearchIndex(): SearchDocument[] | null {
  if (!existsSync(PRECOMPILED_INDEX_PATH)) return null;
  try {
    const raw = JSON.parse(
      readFileSync(PRECOMPILED_INDEX_PATH, "utf8"),
    ) as { documents?: SearchDocument[] } | SearchDocument[];
    const documents = Array.isArray(raw) ? raw : raw.documents;
    if (!Array.isArray(documents) || documents.length < 10) return null;
    return documents;
  } catch {
    return null;
  }
}

function resourceFormatsFromProfile(
  downloadFiles: Array<{ format?: string }> | undefined,
): string[] {
  const formats = [
    ...new Set(
      (downloadFiles ?? [])
        .map((file) => file.format?.toUpperCase())
        .filter((format): format is string => Boolean(format)),
    ),
  ];
  return formats.length ? formats : ["XLSX", "PDF"];
}

/**
 * Build normalized searchable index from published (publicly available) entities.
 * Excludes drafts, empty shells, admin/redirect routes, and non-routable tools.
 */
export function buildSearchIndexFromSources(options?: {
  context?: PublicationContext;
  now?: Date;
}): SearchDocument[] {
  const context =
    options?.context ??
    (process.env.NODE_ENV === "production"
      ? getSearchIndexPublicationContext()
      : getPublicationContextSync());
  const listOptions = {
    context,
    now: options?.now,
  };
  const docs: SearchDocument[] = [];
  const seen = new Set<string>();
  const softwareBySlug = new Map(
    getSoftware(listOptions)
      .filter(
        (s) =>
          s.productLifecycle === "active" &&
          (s.entityType === "software" || s.entityType === "platform"),
      )
      .map((s) => [s.slug, s]),
  );

  for (const software of softwareBySlug.values()) {
    const cat = categoryLabel(software.primaryCategorySlug);
    const alternativesHref = publicAlternativesHref(software.slug);
    const quickLinks = [
      { label: "Overview", href: `/software/${software.slug}/` },
      { label: "Features", href: `/software/${software.slug}/features/` },
      { label: "Pricing", href: `/software/${software.slug}/pricing/` },
      { label: "Use Cases", href: `/software/${software.slug}/use-cases/` },
      ...(alternativesHref
        ? [{ label: "Alternatives", href: alternativesHref }]
        : []),
    ];

    pushUnique(docs, seen, {
      id: software.id,
      type: "SOFTWARE",
      title: software.name,
      slug: software.slug,
      canonicalUrl: `/software/${software.slug}/`,
      summary:
        software.shortDescription ||
        software.description ||
        `${software.name} software review on SoftwareGlimpse.`,
      badge: cat ? `SOFTWARE · ${cat}` : "SOFTWARE",
      categoryIds: [
        software.primaryCategorySlug,
        ...software.secondaryCategorySlugs,
      ],
      productIds: [software.slug],
      capabilityIds: [],
      requirementIds: [],
      featureIds: software.featureRatings.map((f) => f.featureSlug),
      useCaseIds: software.useCaseSlugs,
      industryIds: software.industrySlugs,
      aliases: [...software.aliases, ...software.formerlyKnownAs],
      searchTerms: [
        software.name,
        software.slug,
        software.company ?? "",
        software.primaryCategorySlug,
        ...software.useCaseSlugs,
        ...software.aliases,
      ].filter(Boolean),
      importance: typeImportance("SOFTWARE"),
      updatedAt: software.editorialReviewedAt ?? software.lastVerifiedAt,
      published: true,
      indexable: software.seo.indexable === true,
      logo: software.logo,
      bestFor: software.bestFor[0],
      pricingTeaser: pricingTeaser(software),
      quickLinks,
    });
  }

  for (const comparison of getComparisons(listOptions)) {
    const [aSlug, bSlug] = comparison.productSlugs;
    const a = aSlug ? softwareBySlug.get(aSlug) : undefined;
    const b = bSlug ? softwareBySlug.get(bSlug) : undefined;
    if (!a || !b) continue;

    pushUnique(docs, seen, {
      id: comparison.id,
      type: "COMPARISON",
      title: comparison.title,
      slug: comparison.slug,
      canonicalUrl: `/compare/${comparison.slug}/`,
      summary:
        comparison.summary ||
        `Compare ${a.name} and ${b.name} on pipeline, automation, reporting, pricing and trade-offs.`,
      badge: "COMPARISON",
      categoryIds: comparison.categorySlug ? [comparison.categorySlug] : [],
      productIds: comparison.productSlugs,
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [`${a.name} vs ${b.name}`, `${b.name} vs ${a.name}`],
      searchTerms: [
        comparison.title,
        comparison.slug,
        a.name,
        b.name,
        a.slug,
        b.slug,
        "vs",
        "versus",
        "compare",
      ],
      importance: typeImportance("COMPARISON"),
      published: true,
      indexable: comparison.seo.indexable === true,
      logo: a.logo,
      logoB: b.logo,
      verdict: comparison.verdict,
    });
  }

  for (const guide of getGuideSearchEntries(listOptions)) {
    pushUnique(docs, seen, {
      id: guide.id,
      type: "GUIDE",
      title: guide.title,
      slug: guide.slug,
      canonicalUrl: `/guides/${guide.slug}/`,
      summary: guide.summary || `Guide: ${guide.title}`,
      badge: guide.categorySlugs[0]
        ? `GUIDE · ${categoryLabel(guide.categorySlugs[0])}`
        : "GUIDE",
      categoryIds: guide.categorySlugs,
      productIds: guide.productSlugs,
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [],
      searchTerms: [
        guide.title,
        guide.slug,
        guide.topicType,
        guide.journeyStage,
        ...guide.categorySlugs,
        ...guide.productSlugs,
      ],
      importance: typeImportance("GUIDE"),
      updatedAt: guide.updatedAt ?? guide.publishedAt,
      published: true,
      indexable: guide.indexable,
      readingMinutes: guide.readingMinutes,
    });
  }

  for (const tool of TOOLS_REGISTRY) {
    if (tool.status !== "available" || !tool.href) continue;
    pushUnique(docs, seen, {
      id: tool.id,
      type: "TOOL",
      title: tool.name,
      slug: tool.slug,
      canonicalUrl: tool.href,
      summary: tool.shortDescription || tool.longDescription,
      badge: "TOOL",
      categoryIds: tool.categorySlugs,
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [tool.type],
      searchTerms: [
        tool.name,
        tool.slug,
        tool.type,
        ...tool.features,
        ...tool.categorySlugs,
        "tool",
        "free",
      ],
      importance: tool.featured || tool.popular ? 92 : typeImportance("TOOL"),
      published: true,
      indexable: true,
      toolMeta: {
        free: true,
        noSignup: true,
        ctaLabel: tool.primaryCta,
      },
    });
  }

  for (const resource of getResources(listOptions)) {
    const profile = getResourceHubProfile(resource.slug);
    const formats = resourceFormatsFromProfile(profile?.downloadFiles);

    pushUnique(docs, seen, {
      id: resource.id,
      type: "RESOURCE",
      title: resource.name,
      slug: resource.slug,
      canonicalUrl: `/resources/${resource.slug}/`,
      summary:
        resource.shortDescription ||
        resource.description ||
        `Downloadable ${resource.kind} resource.`,
      badge: `RESOURCE · ${resource.kind.toUpperCase()}`,
      categoryIds: resource.categorySlugs,
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [resource.shortTitle ?? ""].filter(Boolean),
      searchTerms: [
        resource.name,
        resource.slug,
        resource.kind,
        resource.resourceType ?? "",
        resource.buyingStage ?? "",
        "checklist",
        "download",
        ...resource.categorySlugs,
      ].filter(Boolean),
      importance: typeImportance("RESOURCE"),
      published: true,
      indexable: resource.seo.indexable === true,
      resourceFormats: formats.length ? formats : ["XLSX", "PDF"],
    });
  }

  for (const page of getBestPages(listOptions)) {
    pushUnique(docs, seen, {
      id: page.id,
      type: "BEST_PAGE",
      title: page.title,
      slug: page.slug,
      canonicalUrl: `/best/${page.slug}/`,
      summary: page.summary || page.heroSubtitle || `Best software: ${page.title}`,
      badge: "BEST SOFTWARE",
      categoryIds: page.categorySlug ? [page.categorySlug] : [],
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: ["best crm", "best software", `best ${page.categorySlug ?? ""}`],
      searchTerms: [
        page.title,
        page.slug,
        "best",
        page.categorySlug ?? "",
        page.heroSubtitle ?? "",
      ].filter(Boolean),
      importance: typeImportance("BEST_PAGE"),
      published: true,
      indexable: page.seo.indexable === true,
    });
  }

  for (const category of getCategories(listOptions)) {
    pushUnique(docs, seen, {
      id: category.id,
      type: "CATEGORY",
      title: category.name,
      slug: category.slug,
      canonicalUrl: `/categories/${category.path.join("/")}/`,
      summary:
        category.shortDescription ||
        category.description ||
        `Browse ${category.name} software.`,
      badge: "CATEGORY",
      categoryIds: [category.slug],
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [],
      searchTerms: [
        category.name,
        category.slug,
        ...category.path,
        category.shortDescription ?? "",
      ].filter(Boolean),
      importance: typeImportance("CATEGORY"),
      published: true,
      indexable: category.seo.indexable === true,
    });
  }

  for (const industry of getIndustries(listOptions)) {
    pushUnique(docs, seen, {
      id: industry.id,
      type: "INDUSTRY",
      title: industry.name,
      slug: industry.slug,
      canonicalUrl: `/industries/${industry.slug}/`,
      summary:
        industry.shortDescription ||
        industry.description ||
        `CRM for ${industry.name}.`,
      badge: "INDUSTRY",
      categoryIds: [],
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [industry.slug],
      aliases: [],
      searchTerms: [industry.name, industry.slug, "industry", "crm"],
      importance: typeImportance("INDUSTRY"),
      published: true,
      indexable: industry.seo.indexable === true,
    });
  }

  for (const useCase of getUseCases(listOptions)) {
    if (!getUseCaseHubProfile(useCase.slug)) continue;
    pushUnique(docs, seen, {
      id: useCase.id,
      type: "USE_CASE",
      title: useCase.name,
      slug: useCase.slug,
      canonicalUrl: `/use-cases/${useCase.slug}/`,
      summary:
        useCase.shortDescription ||
        useCase.description ||
        `Use case: ${useCase.name}`,
      badge: "USE CASE",
      categoryIds: useCase.categorySlugs,
      productIds: [],
      capabilityIds: [],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [useCase.slug],
      industryIds: [],
      aliases: [],
      searchTerms: [useCase.name, useCase.slug, ...useCase.categorySlugs],
      importance: typeImportance("USE_CASE"),
      published: true,
      indexable: useCase.seo.indexable === true,
    });
  }

  for (const capability of getCapabilities(listOptions)) {
    if (!getCapabilityHubProfile(capability.slug)) continue;
    pushUnique(docs, seen, {
      id: capability.id,
      type: "CAPABILITY",
      title: capability.name,
      slug: capability.slug,
      canonicalUrl: `/capabilities/${capability.slug}/`,
      summary:
        capability.shortDescription ||
        capability.description ||
        `Capability: ${capability.name}`,
      badge: "CAPABILITY",
      categoryIds: capability.categorySlugs,
      productIds: [],
      capabilityIds: [capability.slug],
      requirementIds: [],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [],
      searchTerms: [capability.name, capability.slug, ...capability.categorySlugs],
      importance: typeImportance("CAPABILITY"),
      published: true,
      indexable: capability.seo.indexable === true,
    });
  }

  for (const { slug } of listFeatureDetailParams()) {
    const profile = getFeatureDetailProfile(slug);
    if (!profile?.overview?.trim() || !profile.name?.trim()) continue;
    const isPillar = (CRM_FEATURE_PILLAR_SLUGS as readonly string[]).includes(
      profile.slug,
    );
    pushUnique(docs, seen, {
      id: `feature:${profile.slug}`,
      type: "FEATURE",
      title: profile.name,
      slug: profile.slug,
      canonicalUrl: `/features/${profile.slug}/`,
      summary:
        profile.tagline ||
        profile.overview.slice(0, 220) ||
        `Explore ${profile.name} across researched CRMs.`,
      badge: "FEATURE",
      categoryIds: ["crm"],
      productIds: [],
      capabilityIds: profile.primaryCapabilitySlug
        ? [profile.primaryCapabilitySlug]
        : [],
      requirementIds: [],
      featureIds: [profile.slug],
      useCaseIds: [],
      industryIds: [],
      aliases: [],
      searchTerms: [
        profile.name,
        profile.slug,
        profile.tagline ?? "",
        "feature",
        "crm",
      ].filter(Boolean),
      importance: isPillar ? 75 : typeImportance("FEATURE"),
      published: true,
      indexable: Boolean(profile.overview && profile.tagline),
    });
  }

  for (const { slug } of listRequirementDetailParams()) {
    const profile = getRequirementDetailProfile(slug);
    if (!profile) continue;
    const isPillar = (CRM_REQUIREMENT_PILLAR_SLUGS as readonly string[]).includes(
      profile.slug,
    );
    if (!isPillar || !profile.overview?.trim()) continue;

    pushUnique(docs, seen, {
      id: `requirement:${profile.slug}`,
      type: "REQUIREMENT",
      title: profile.name,
      slug: profile.slug,
      canonicalUrl: `/requirements/${profile.slug}/`,
      summary:
        profile.tagline ||
        profile.overview.slice(0, 220) ||
        `Requirement: ${profile.name}`,
      badge: "REQUIREMENT",
      categoryIds: ["crm"],
      productIds: [],
      capabilityIds: [],
      requirementIds: [profile.slug],
      featureIds: [],
      useCaseIds: [],
      industryIds: [],
      aliases: [],
      searchTerms: [
        profile.name,
        profile.slug,
        profile.tagline ?? "",
        "requirement",
        "need",
      ].filter(Boolean),
      importance: typeImportance("REQUIREMENT"),
      published: true,
      indexable: true,
    });
  }

  return docs;
}

/**
 * Resolve the search index — prefers the build-time artifact on disk, then
 * in-process cache, then a live compile from catalogue sources.
 */
export function buildSearchIndex(options?: {
  force?: boolean;
  context?: PublicationContext;
}): SearchDocument[] {
  const context =
    options?.context ??
    (process.env.NODE_ENV === "production"
      ? getSearchIndexPublicationContext()
      : getPublicationContextSync());

  const usePrecompiled =
    !options?.force &&
    !options?.context &&
    process.env.NODE_ENV === "production";

  if (cachedIndex && !options?.force && !options?.context) return cachedIndex;

  if (usePrecompiled) {
    const precompiled = loadPrecompiledSearchIndex();
    if (precompiled) {
      cachedIndex = precompiled;
      cachedRuntime = null;
      return cachedIndex;
    }
  }

  cachedIndex = buildSearchIndexFromSources({ context });
  cachedRuntime = null;
  return cachedIndex;
}

export function getSearchRuntime(options?: {
  force?: boolean;
  context?: PublicationContext;
}): SearchRuntimeIndex {
  const documents = buildSearchIndex(options);
  if (cachedRuntime && !options?.force && !options?.context) return cachedRuntime;
  cachedRuntime = buildSearchRuntimeIndex(documents);
  return cachedRuntime;
}

export function __resetSearchIndexCache(): void {
  cachedIndex = null;
  cachedRuntime = null;
}

export function getSearchIndexSize(): number {
  return buildSearchIndex().length;
}
