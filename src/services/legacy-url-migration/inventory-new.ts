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
import { listFeatureDetailParams } from "@/data/feature-detail";
import { listRequirementDetailParams } from "@/data/requirement-detail";
import { isEntityIndexable } from "@/domain/quality-gates";
import { canonicalUrl } from "@/seo/canonical";
import { getSitemapEntries } from "@/seo/sitemap";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
  NEWSLETTER_ROUTES,
} from "@/services/site-foundation/config";
import type { NewUrlInventoryRow } from "./types";

/**
 * Inventory public (and soft-public) routes in the new SoftwareGlimpse app.
 * Excludes admin/draft/API/dev routes by construction (data + static hubs only).
 */
export function buildNewUrlInventory(now: Date = new Date()): NewUrlInventoryRow[] {
  const sitemap = new Set(getSitemapEntries(now).map((e) => e.url));
  const rows: NewUrlInventoryRow[] = [];

  function add(
    r: Omit<NewUrlInventoryRow, "url" | "canonical" | "inSitemap"> & {
      path: string;
    },
  ) {
    const canonical = canonicalUrl(r.path);
    rows.push({
      ...r,
      url: canonical,
      canonical,
      inSitemap: sitemap.has(canonical),
    });
  }

  add({
    path: "/",
    routeType: "static",
    pageType: "homepage",
    title: "Home",
    indexable: true,
    publicationState: "published",
    parentHub: "/",
  });

  const hubs: Array<[string, NewUrlInventoryRow["pageType"], boolean]> = [
    ["/software/", "software_hub", true],
    ["/categories/", "categories_hub", true],
    ["/tools/", "tools_hub", true],
    ["/pricing/", "pricing_hub", true],
    ["/compare/", "compare_hub", true],
    ["/compare/build/", "compare_builder", false],
    ["/guides/", "guides_hub", true],
    ["/use-cases/", "use_cases_hub", true],
    ["/capabilities/", "capabilities_hub", true],
    ["/requirements/", "requirements_hub", true],
    ["/features/", "features_hub", true],
    ["/resources/", "resources_hub", true],
    ["/for/", "audiences_hub", true],
    ["/industries/", "industries_hub", false],
    ["/best/", "best_hub", true],
    ["/alternatives/", "alternatives_hub", true],
    ["/search/", "search", false],
  ];
  for (const [path, pageType, indexable] of hubs) {
    add({
      path,
      routeType: "static",
      pageType,
      title: String(pageType),
      indexable,
      publicationState: "published",
      parentHub: path,
    });
  }

  for (const route of Object.values(COMPANY_ROUTES)) {
    add({
      path: route,
      routeType: "static",
      pageType: "company",
      title: route,
      indexable: true,
      publicationState: "published",
      parentHub: "/company/",
    });
  }
  for (const route of Object.values(LEGAL_ROUTES)) {
    add({
      path: route,
      routeType: "static",
      pageType: "legal",
      title: route,
      indexable: true,
      publicationState: "published",
      parentHub: "/legal/",
    });
  }
  for (const route of Object.values(NEWSLETTER_ROUTES)) {
    add({
      path: route,
      routeType: "static",
      pageType: "newsletter_utility",
      title: route,
      indexable: false,
      publicationState: "published",
      parentHub: "/newsletter/",
    });
  }
  add({
    path: "/privacy-request/",
    routeType: "static",
    pageType: "privacy_utility",
    title: "Privacy request",
    indexable: false,
    publicationState: "published",
    parentHub: "/legal/",
  });

  for (const tool of TOOLS_REGISTRY) {
    if (!tool.href) continue;
    const indexable =
      tool.status === "available" &&
      !["software-finder", "software-stack-builder"].includes(tool.slug);
    add({
      path: tool.href,
      routeType: "static",
      pageType: "tool",
      title: tool.name ?? tool.slug,
      indexable,
      publicationState: tool.status,
      entityId: tool.slug,
      parentHub: "/tools/",
    });
  }

  for (const c of getCategories()) {
    add({
      path: `/categories/${c.path.join("/")}/`,
      routeType: "dynamic",
      pageType: "category",
      title: c.name,
      indexable: isEntityIndexable({ kind: "category", entity: c }, now),
      publicationState: c.metadata.status,
      entityId: c.id,
      parentHub: "/categories/",
      lastModified: c.metadata.updatedAt || c.metadata.publishedAt,
    });
  }

  for (const s of getSoftware({ includeUnpublished: true })) {
    add({
      path: `/software/${s.slug}/`,
      routeType: "dynamic",
      pageType: "software",
      title: s.name,
      indexable: isEntityIndexable({ kind: "software", entity: s }, now),
      publicationState: s.metadata.status,
      entityId: s.id,
      parentHub: "/software/",
      lastModified: s.metadata.updatedAt || s.metadata.publishedAt,
    });
    add({
      path: `/pricing/${s.slug}/`,
      routeType: "dynamic",
      pageType: "pricing",
      title: `${s.name} pricing`,
      indexable: false,
      publicationState: s.metadata.status,
      entityId: s.id,
      parentHub: "/pricing/",
    });
  }

  for (const c of getAllComparisonsUnfiltered()) {
    add({
      path: `/compare/${c.slug}/`,
      routeType: "dynamic",
      pageType: "comparison",
      title: c.title || c.slug,
      indexable: isEntityIndexable({ kind: "comparison", entity: c }, now),
      publicationState: c.metadata.status,
      entityId: c.id,
      parentHub: "/compare/",
      lastModified: c.metadata.updatedAt || c.metadata.publishedAt,
    });
  }

  for (const p of getAllAlternativesUnfiltered()) {
    add({
      path: `/alternatives/${p.slug}/`,
      routeType: "dynamic",
      pageType: "alternatives",
      title: p.title || p.slug,
      indexable: isEntityIndexable({ kind: "alternatives", entity: p }, now),
      publicationState: p.metadata.status,
      entityId: p.id,
      parentHub: "/alternatives/",
      lastModified: p.metadata.updatedAt || p.metadata.publishedAt,
    });
  }

  for (const p of getAllBestPagesUnfiltered()) {
    add({
      path: `/best/${p.slug}/`,
      routeType: "dynamic",
      pageType: "best",
      title: p.title || p.slug,
      indexable: isEntityIndexable({ kind: "best", entity: p }, now),
      publicationState: p.metadata.status,
      entityId: p.id,
      parentHub: "/best/",
      lastModified: p.metadata.updatedAt || p.metadata.publishedAt,
    });
  }

  for (const g of getGuides({ includeUnpublished: true })) {
    add({
      path: g.seo.canonicalPath || `/guides/${g.slug}/`,
      routeType: "dynamic",
      pageType: "guide",
      title: g.title || g.slug,
      indexable: isEntityIndexable({ kind: "guide", entity: g }, now),
      publicationState: g.metadata.status,
      entityId: g.id,
      parentHub: "/guides/",
      lastModified: g.metadata.updatedAt || g.metadata.publishedAt,
    });
  }

  for (const u of getUseCases()) {
    add({
      path: u.seo.canonicalPath || `/use-cases/${u.slug}/`,
      routeType: "dynamic",
      pageType: "use_case",
      title: u.name || u.slug,
      indexable: u.seo.indexable === true && u.metadata.status === "published",
      publicationState: u.metadata.status,
      entityId: u.id,
      parentHub: "/use-cases/",
    });
  }

  for (const c of getCapabilities()) {
    add({
      path: c.seo.canonicalPath || `/capabilities/${c.slug}/`,
      routeType: "dynamic",
      pageType: "capability",
      title: c.name || c.slug,
      indexable: c.seo.indexable === true && c.metadata.status === "published",
      publicationState: c.metadata.status,
      entityId: c.id,
      parentHub: "/capabilities/",
    });
  }

  for (const r of getResources({ includeUnpublished: true })) {
    add({
      path: r.seo.canonicalPath || `/resources/${r.slug}/`,
      routeType: "dynamic",
      pageType: "resource",
      title: r.title || r.slug,
      indexable: r.seo.indexable === true && r.metadata.status === "published",
      publicationState: r.metadata.status,
      entityId: r.id,
      parentHub: "/resources/",
    });
  }

  for (const a of getAudiences()) {
    add({
      path: a.seo.canonicalPath || `/for/${a.slug}/`,
      routeType: "dynamic",
      pageType: "audience",
      title: a.name || a.slug,
      indexable: a.seo.indexable === true && a.metadata.status === "published",
      publicationState: a.metadata.status,
      entityId: a.id,
      parentHub: "/for/",
    });
  }

  for (const i of getIndustries({ includeUnpublished: true })) {
    add({
      path: i.seo.canonicalPath || `/industries/${i.slug}/`,
      routeType: "dynamic",
      pageType: "industry",
      title: i.name || i.slug,
      indexable: i.seo.indexable === true && i.metadata.status === "published",
      publicationState: i.metadata.status,
      entityId: i.id,
      parentHub: "/industries/",
    });
  }

  for (const { slug } of listRequirementDetailParams()) {
    const path = `/requirements/${slug}/`;
    add({
      path,
      routeType: "dynamic",
      pageType: "requirement",
      title: slug,
      indexable: sitemap.has(canonicalUrl(path)),
      publicationState: "published",
      entityId: slug,
      parentHub: "/requirements/",
    });
  }

  for (const { slug } of listFeatureDetailParams()) {
    const path = `/features/${slug}/`;
    add({
      path,
      routeType: "dynamic",
      pageType: "feature",
      title: slug,
      indexable: sitemap.has(canonicalUrl(path)),
      publicationState: "published",
      entityId: slug,
      parentHub: "/features/",
    });
  }

  return rows;
}
