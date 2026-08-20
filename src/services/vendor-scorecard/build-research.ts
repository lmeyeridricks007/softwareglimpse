import { formatMoney, fromMajor, type CurrencyCode } from "@/domain";
import {
  getAllSoftwareUnfiltered,
} from "@/data";
import {
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { crmMethodology } from "@/data/seed/crm-methodology";
import { salesIntelligenceMethodology } from "@/data/seed/sales-intelligence-methodology";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { scoreToQualitativeLabel } from "./labels";
import type {
  ScorecardCriterionResearch,
  ScorecardProductResearch,
  ScorecardResearchCatalog,
} from "./engine";

function buildScorecardResearchCatalogForCategory(
  categorySlug: string,
  methodologyVersion: string,
  productSlugs?: string[],
): ScorecardResearchCatalog {
  const software = getAllSoftwareUnfiltered()
    .filter((s) => s.primaryCategorySlug === categorySlug)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const filtered =
    productSlugs && productSlugs.length > 0
      ? software.filter((s) => productSlugs.includes(s.slug))
      : software;

  const featureLabels = Object.fromEntries(
    canonicalFeaturesSeed.map((f) => [f.slug, f.name]),
  );

  const products: ScorecardProductResearch[] = filtered.map((item) => {
    const assessment = loadAssessment(item.slug);
    const review = loadReview(item.slug);
    const enrichment = loadEnrichment(item.slug);
    const assessmentApproved = assessment?.status === "approved";
    const reviewApproved =
      assessmentApproved && review?.editorialStatus === "approved";
    const overall =
      reviewApproved && typeof review?.overallScore === "number"
        ? review.overallScore
        : assessmentApproved && typeof assessment?.overallScore === "number"
          ? assessment.overallScore
          : null;

    const criteria: ScorecardCriterionResearch[] = (
      assessmentApproved ? assessment?.criterionAssessments ?? [] : []
    )
      .filter((c) => c.status === "approved" && typeof c.score === "number")
      .map((c) => ({
        criterionSlug: c.criterionSlug,
        score: c.score,
        qualitative: scoreToQualitativeLabel(c.score),
        rationale: c.rationale ?? null,
        confidence: c.confidence ?? null,
        supportingFactIds: c.supportingFactIds ?? [],
        assessmentUpdatedAt: c.reviewedAt ?? assessment?.updatedAt ?? null,
      }));

    const pricingRaw = enrichment?.pricing ?? item.pricing;
    const startingMonthly =
      pricingRaw &&
      typeof pricingRaw === "object" &&
      "startingPriceMonthly" in pricingRaw &&
      typeof (pricingRaw as { startingPriceMonthly?: unknown })
        .startingPriceMonthly === "number"
        ? (pricingRaw as { startingPriceMonthly: number; currency?: string })
        : null;
    let startingPriceLabel: string | null = null;
    if (startingMonthly?.currency) {
      try {
        startingPriceLabel = `From ${formatMoney(
          fromMajor(
            startingMonthly.startingPriceMonthly,
            startingMonthly.currency as CurrencyCode,
          ),
        )}/user/mo`;
      } catch {
        startingPriceLabel = null;
      }
    }

    return {
      slug: item.slug,
      name: item.name,
      logo: item.logo
        ? { src: item.logo.src, alt: item.logo.alt ?? item.name }
        : null,
      reviewScore: overall,
      reviewApproved: Boolean(reviewApproved && overall != null),
      startingPriceLabel,
      assessmentStatus: assessment?.status ?? null,
      assessmentUpdatedAt: assessment?.updatedAt ?? assessment?.reviewedAt ?? null,
      researchConfidence: assessmentApproved
        ? (assessment?.confidence ?? null)
        : null,
      strengths: assessmentApproved ? assessment?.strengths ?? [] : [],
      weaknesses: assessmentApproved ? assessment?.weaknesses ?? [] : [],
      tradeoffs: assessmentApproved ? assessment?.tradeoffs ?? [] : [],
      criteria,
      featureSupport:
        enrichment?.featureSupport.map((f) => ({
          featureSlug: f.featureSlug,
          availability: f.availability,
          notes: f.notes,
        })) ?? [],
    };
  });

  return {
    products,
    methodologyVersion,
    methodologyHref: COMPANY_ROUTES.methodology,
    generatedAt: new Date().toISOString(),
    featureLabels,
  };
}

/**
 * Build client-safe research catalog for the CRM vendor scorecard.
 * Consumes editorial assessments + enrichment feature support — no score invention.
 */
export function buildCrmScorecardResearchCatalog(
  productSlugs?: string[],
): ScorecardResearchCatalog {
  return buildScorecardResearchCatalogForCategory(
    "crm",
    crmMethodology.version,
    productSlugs,
  );
}

/**
 * Build client-safe research catalog for the Sales Intelligence vendor scorecard.
 */
export function buildSiScorecardResearchCatalog(
  productSlugs?: string[],
): ScorecardResearchCatalog {
  return buildScorecardResearchCatalogForCategory(
    "sales-intelligence",
    salesIntelligenceMethodology.version,
    productSlugs,
  );
}

export function buildCategoryScorecardResearchCatalog(
  categorySlug: string,
  methodologyVersion: string,
  productSlugs?: string[],
): ScorecardResearchCatalog {
  return buildScorecardResearchCatalogForCategory(
    categorySlug,
    methodologyVersion,
    productSlugs,
  );
}

export function listCategoryScorecardProductOptions(
  categorySlug: string,
  methodologyVersion: string,
): ScorecardProductOption[] {
  return toProductOptions(
    buildCategoryScorecardResearchCatalog(categorySlug, methodologyVersion),
  );
}

type ScorecardProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
  startingPriceLabel: string | null;
  reviewScore: number | null;
  reviewApproved: boolean;
};

function toProductOptions(
  catalog: ScorecardResearchCatalog,
): ScorecardProductOption[] {
  return catalog.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
    startingPriceLabel: p.startingPriceLabel,
    reviewScore: p.reviewScore,
    reviewApproved: p.reviewApproved,
  }));
}

export function listCrmScorecardProductOptions(): ScorecardProductOption[] {
  return toProductOptions(buildCrmScorecardResearchCatalog());
}

export function listSiScorecardProductOptions(): ScorecardProductOption[] {
  return toProductOptions(buildSiScorecardResearchCatalog());
}
