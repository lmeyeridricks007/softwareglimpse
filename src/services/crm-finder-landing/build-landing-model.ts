/**
 * Server-side model for CRM Finder landing sections (indexable content).
 */

import {
  getAllComparisonsUnfiltered,
  getSoftwareByCategory,
  getSoftwareBySlug,
} from "@/data";
import { isPubliclyAvailable } from "@/domain/publishing";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { firstPublicCopy } from "@/services/category-hub/public-copy";

export type CrmFinderLandingProduct = {
  slug: string;
  name: string;
  href: string;
  tagline: string | null;
  logo: { src: string; alt: string } | null;
};

export type CrmFinderLandingComparison = {
  slug: string;
  href: string;
  title: string;
  leftName: string;
  rightName: string;
  leftLogo: { src: string; alt: string } | null;
  rightLogo: { src: string; alt: string } | null;
};

export type CrmFinderLandingGuide = {
  href: string;
  title: string;
  description?: string;
};

export type CrmFinderLandingModel = {
  products: CrmFinderLandingProduct[];
  comparisons: CrmFinderLandingComparison[];
  guides: CrmFinderLandingGuide[];
  methodologyHref: string;
  affiliateDisclosureHref: string;
  howWeReviewHref: string;
  calculatorHref: string;
  bestCrmHref: string;
  categoryHref: string;
};

export function buildCrmFinderLandingModel(): CrmFinderLandingModel {
  const products = getSoftwareByCategory("crm")
    .filter((s) => s.primaryCategorySlug === "crm")
    .filter((s) => isPubliclyAvailable(s.metadata))
    .slice(0, 4)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      href: `/software/${s.slug}/`,
      tagline:
        firstPublicCopy([
          s.shortDescription,
          s.verdict,
          s.bestFor[0],
          s.description,
        ]) ?? null,
      logo: s.logo
        ? { src: s.logo.src, alt: s.logo.alt ?? s.name }
        : null,
    }));

  const comparisons = getAllComparisonsUnfiltered()
    .filter(
      (c) =>
        c.categorySlug === "crm" && isPubliclyAvailable(c.metadata),
    )
    .slice(0, 4)
    .map((c) => {
      const left = getSoftwareBySlug(c.productSlugs[0] ?? "");
      const right = getSoftwareBySlug(c.productSlugs[1] ?? "");
      return {
        slug: c.slug,
        href: `/compare/${c.slug}/`,
        title: c.title,
        leftName: left?.name ?? c.productSlugs[0] ?? "Product A",
        rightName: right?.name ?? c.productSlugs[1] ?? "Product B",
        leftLogo: left?.logo
          ? { src: left.logo.src, alt: left.logo.alt ?? left.name }
          : null,
        rightLogo: right?.logo
          ? { src: right.logo.src, alt: right.logo.alt ?? right.name }
          : null,
      };
    });

  const guides: CrmFinderLandingGuide[] = [
    ...listPublishedLearningGuides("crm").slice(0, 3).map((g) => ({
      href: g.path,
      title: g.title,
    })),
    {
      href: "/best/crm-software/",
      title: "Best CRM Software",
    },
    {
      href: "/tools/crm-cost-calculator/",
      title: "CRM Pricing & Cost Calculator",
    },
  ];

  return {
    products,
    comparisons,
    guides,
    methodologyHref: COMPANY_ROUTES.methodology,
    affiliateDisclosureHref: LEGAL_ROUTES.affiliateDisclosure,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
    calculatorHref: "/tools/crm-cost-calculator/",
    bestCrmHref: "/best/crm-software/",
    categoryHref: "/categories/crm/",
  };
}
