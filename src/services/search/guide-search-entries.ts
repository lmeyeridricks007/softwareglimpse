import {
  isContentVisible,
  type PublicationListOptions,
  resolvePublicationListOptions,
} from "@/domain/publication-context";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { getEducationalGuides } from "@/data/repositories/guides-educational";
import {
  CRM_PRODUCT_GUIDE_KINDS,
  productGuideKindConfig,
  productGuideSlug,
  type CrmProductGuideKind,
} from "@/services/product-guides/kinds";
import {
  listAiProductGuideSlugs,
  listBcProductGuideSlugs,
  listCrmProductGuideSlugs,
  listEcommerceProductGuideSlugs,
  listEmProductGuideSlugs,
  listHrProductGuideSlugs,
  listItProductGuideSlugs,
  listMarketingProductGuideSlugs,
  listPmProductGuideSlugs,
  listSiProductGuideSlugs,
} from "@/services/product-guides/context";

/** Slim guide metadata for search indexing — avoids materializing full guide packs. */
export type GuideSearchEntry = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  categorySlugs: string[];
  productSlugs: string[];
  topicType: string;
  journeyStage: string;
  updatedAt?: string;
  publishedAt: string;
  indexable: boolean;
  readingMinutes: number;
};

const CATEGORY_PUBLISHED_AT: Record<string, string> = {
  crm: "2026-08-14T12:00:00.000Z",
  "sales-intelligence": "2026-08-17T06:00:00.000Z",
  "email-marketing": "2026-08-17T12:00:00.000Z",
  marketing: "2026-08-17T15:00:00.000Z",
  "business-communications": "2026-08-17T18:00:00.000Z",
  hr: "2026-08-18T00:00:00.000Z",
  ecommerce: "2026-08-18T00:00:00.000Z",
  "project-management": "2026-08-18T05:30:00.000Z",
  ai: "2026-08-18T12:00:00.000Z",
  "it-development": "2026-08-18T12:00:00.000Z",
};

const PRODUCT_GUIDE_CATALOGS: Array<{
  categorySlug: string;
  listSlugs: () => string[];
}> = [
  { categorySlug: "crm", listSlugs: listCrmProductGuideSlugs },
  { categorySlug: "sales-intelligence", listSlugs: listSiProductGuideSlugs },
  { categorySlug: "email-marketing", listSlugs: listEmProductGuideSlugs },
  { categorySlug: "marketing", listSlugs: listMarketingProductGuideSlugs },
  {
    categorySlug: "business-communications",
    listSlugs: listBcProductGuideSlugs,
  },
  { categorySlug: "hr", listSlugs: listHrProductGuideSlugs },
  { categorySlug: "ecommerce", listSlugs: listEcommerceProductGuideSlugs },
  { categorySlug: "project-management", listSlugs: listPmProductGuideSlugs },
  { categorySlug: "ai", listSlugs: listAiProductGuideSlugs },
  { categorySlug: "it-development", listSlugs: listItProductGuideSlugs },
];

function buildProductGuideSearchEntries(
  options: PublicationListOptions = {},
): GuideSearchEntry[] {
  const resolved = resolvePublicationListOptions(options);
  const entries: GuideSearchEntry[] = [];
  const seen = new Set<string>();

  for (const { categorySlug, listSlugs } of PRODUCT_GUIDE_CATALOGS) {
    const publishedAt =
      CATEGORY_PUBLISHED_AT[categorySlug] ?? CATEGORY_PUBLISHED_AT.crm;
    if (
      !isContentVisible(
        { status: "published", publishedAt },
        resolved.context,
        resolved.now,
      )
    ) {
      continue;
    }

    for (const productSlug of listSlugs()) {
      const software = getSoftwareBySlug(productSlug, resolved);
      if (!software || software.primaryCategorySlug !== categorySlug) continue;

      const productName = software.name;

      for (const kind of CRM_PRODUCT_GUIDE_KINDS) {
        const cfg = productGuideKindConfig(categorySlug, kind);
        const slug = productGuideSlug(productSlug, kind);
        if (seen.has(slug)) continue;
        seen.add(slug);

        entries.push({
          id: `guide-${slug}`,
          title: cfg.pageTitle(productName),
          slug,
          summary: cfg.summary(productName),
          categorySlugs: [categorySlug],
          productSlugs: [productSlug],
          topicType: cfg.topicType,
          journeyStage: cfg.journeyStage,
          updatedAt: publishedAt,
          publishedAt,
          indexable: true,
          readingMinutes: 5,
        });
      }
    }
  }

  return entries;
}

function educationalGuideEntries(
  options: PublicationListOptions = {},
): GuideSearchEntry[] {
  return getEducationalGuides(options).map((guide) => {
    const bodyLen =
      guide.sections.reduce((n, s) => n + s.body.length, 0) +
      (guide.summary?.length ?? 0);

    return {
      id: guide.id,
      title: guide.title,
      slug: guide.slug,
      summary: guide.summary || `Guide: ${guide.title}`,
      categorySlugs: guide.categorySlugs,
      productSlugs: guide.productSlugs,
      topicType: guide.topicType,
      journeyStage: guide.journeyStage,
      updatedAt: guide.metadata.updatedAt ?? guide.metadata.publishedAt,
      publishedAt: guide.metadata.publishedAt,
      indexable: guide.seo.indexable === true,
      readingMinutes: Math.max(3, Math.round(bodyLen / 900)),
    };
  });
}

/** Published guides for search — educational seeds + lightweight product-guide metadata. */
export function getGuideSearchEntries(
  options: PublicationListOptions = {},
): GuideSearchEntry[] {
  return [
    ...educationalGuideEntries(options),
    ...buildProductGuideSearchEntries(options),
  ];
}
