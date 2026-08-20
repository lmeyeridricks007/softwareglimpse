import type {
  CurrencyCode,
  FeatureAvailability,
  Industry,
  IndustryUseCaseProfile,
  Pricing,
  Software,
} from "@/domain";
import { formatMoney, fromMajor, PricingSchema } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  getAllComparisonsUnfiltered,
  getIndustryBySlug,
  getPrimarySoftwareByCategory,
  getSoftwareBySlug,
} from "@/data";
import {
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import { getIndustryCapabilityProfile } from "@/data/industry-capability";
import {
  getIndustryUseCaseProfile,
} from "@/data/industry-use-case";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import { loadEnrichment } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import type { ProductMedia } from "@/domain";
import {
  selectUseCaseSeeInActionCards,
  useCaseMediaAliases,
  type UseCaseSeeInActionCard,
} from "@/services/product-media/use-case-page-media";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import type { EvidenceCell } from "@/services/industry-hub";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { resolveVisitCta } from "@/services/affiliate/resolve-visit-cta";

export type UseCaseFitLabel = "Strong" | "Good" | "Limited" | "Unknown";
export type UseCaseEvidenceConfidence = "High" | "Medium" | "Low" | "Unknown";

export type IndustryUseCaseNavItem = {
  id: string;
  label: string;
  icon?: string;
};

export type UseCaseScoreContribution = {
  capabilitySlug: string;
  capabilityName: string;
  criterionSlug: string;
  score: number;
  weight: number;
  weightedContribution: number;
};

export type IndustryUseCaseProductRow = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  fitLabel: UseCaseFitLabel;
  /** Weighted use-case fit 0–10 when approved criterion scores exist. */
  fitScore: number | null;
  fitBreakdown: UseCaseScoreContribution[];
  cells: Record<string, EvidenceCell>;
  capabilityCells: Record<string, UseCaseFitLabel>;
  positioning: string | null;
  pricingTeaser: string | null;
  evidenceConfidence: UseCaseEvidenceConfidence;
  evidenceCount: number;
  strengths: string[];
  limitations: string[];
  bestFor: string | null;
  catalogueUseCaseMatch: boolean;
  reviewHref: string;
  compareHref: string;
  pricingHref: string;
  visitHref: string;
};

export type IndustryUseCaseScreenshot = {
  productSlug: string;
  productName: string;
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
};

export type IndustryUseCaseSummaryPick = {
  id: string;
  label: string;
  product: IndustryUseCaseProductRow | null;
  rationale: string | null;
};

export type IndustryUseCaseScenarioPick = {
  id: string;
  title: string;
  description: string;
  priorities: string[];
  icon?: string;
  product: IndustryUseCaseProductRow | null;
};

export type IndustryUseCaseModel = {
  industry: Industry;
  useCaseSlug: string;
  useCaseName: string;
  profile: IndustryUseCaseProfile;
  displayTitle: string;
  eyebrow: string;
  tagline: string;
  decisionNuance: string | null;
  industryHref: string;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  methodologyHref: string;
  catalogueHref: string;
  capabilities: IndustryUseCaseProfile["capabilities"];
  requirements: IndustryUseCaseProfile["requirements"];
  mustHaveRequirements: IndustryUseCaseProfile["requirements"];
  niceToHaveRequirements: IndustryUseCaseProfile["requirements"];
  requirementsByCapability: Array<{
    capabilitySlug: string;
    capabilityName: string;
    importance: string;
    requirements: IndustryUseCaseProfile["requirements"];
  }>;
  glance: {
    typicalObjective: string | null;
    teamTypes: string[];
    topPriorityLabels: string[];
    highestPriorityCapability: string | null;
    researchedProductCount: number;
    requirementCount: number;
    researchConfidence: UseCaseEvidenceConfidence;
    lastReviewedAt: string | null;
  };
  summaryPicks: IndustryUseCaseSummaryPick[];
  scenarios: IndustryUseCaseScenarioPick[];
  whyDiffer: Array<{
    id: string;
    title: string;
    description: string;
    product: IndustryUseCaseProductRow | null;
  }>;
  matrixFeatureSlugs: Array<{ slug: string; name: string; href?: string | null }>;
  scorecardColumns: Array<{ key: string; label: string }>;
  productRows: IndustryUseCaseProductRow[];
  productCards: IndustryUseCaseProductRow[];
  deepDives: IndustryUseCaseProductRow[];
  screenshots: IndustryUseCaseScreenshot[];
  /** Official workflow demos — display only; never ranking. */
  seeInAction: UseCaseSeeInActionCard[];
  tradeoffs: IndustryUseCaseProfile["tradeoffs"];
  implementation: IndustryUseCaseProfile["implementation"];
  vendorQuestions: IndustryUseCaseProfile["vendorQuestions"];
  relatedCapabilities: Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
    importance: string | null;
  }>;
  relatedUseCases: Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;
  comparisons: Array<{
    href: string;
    title: string;
    products: Array<{
      name: string;
      slug: string;
      logo?: { src: string; alt: string } | null;
    }>;
  }>;
  faq: IndustryUseCaseProfile["faq"];
  research: {
    productCount: number;
    capabilityCount: number;
    requirementCount: number;
    evidenceItemCount: number;
    screenshotCount: number;
    pricingRecordCount: number;
    lastUpdated: string | null;
  };
  decisionFlow: Array<{ label: string; value: string }>;
  navItems: IndustryUseCaseNavItem[];
  stats: Array<{
    label: string;
    href?: string;
    icon?: "products" | "updated" | "independent" | "methodology";
  }>;
  hasNumericWeights: boolean;
  hasNumericScores: boolean;
};

function mapAvailability(value: FeatureAvailability | undefined): EvidenceCell {
  switch (value) {
    case "supported":
      return "supported";
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return "partial";
    case "not-supported":
      return "not-supported";
    default:
      return "unknown";
  }
}

function featureCell(productSlug: string, featureSlug: string): EvidenceCell {
  const enrichment = loadEnrichment(productSlug);
  const fromEnrichment = enrichment?.featureSupport.find(
    (f) => f.featureSlug === featureSlug,
  );
  if (fromEnrichment) return mapAvailability(fromEnrichment.availability);

  const software = getSoftwareBySlug(productSlug);
  const rating = software?.featureRatings.find(
    (r) => r.featureSlug === featureSlug,
  );
  if (!rating || rating.available == null) return "unknown";
  return rating.available ? "supported" : "not-supported";
}

function featureName(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

function importanceLabel(
  value: IndustryUseCaseProfile["capabilities"][number]["importance"],
): string {
  if (value === "critical") return "Critical";
  if (value === "high") return "High";
  if (value === "optional") return "Optional";
  return "Important";
}

function resolveProductPricing(software: Software): {
  pricing: Pricing | null;
  verifiedAt: string | null;
} {
  const enrichment = loadEnrichment(software.slug);
  const candidates = [enrichment?.pricing, software.pricing];
  for (const raw of candidates) {
    if (raw == null) continue;
    const parsed = PricingSchema.safeParse(raw);
    if (!parsed.success) continue;
    const verifiedAt =
      parsed.data.verifiedAt ??
      enrichment?.domainCheckedAt?.pricing ??
      software.pricingVerifiedAt ??
      null;
    return { pricing: parsed.data, verifiedAt };
  }
  return {
    pricing: null,
    verifiedAt:
      enrichment?.domainCheckedAt?.pricing ??
      software.pricingVerifiedAt ??
      null,
  };
}

function pricingTeaser(software: Software): string | null {
  const { pricing, verifiedAt } = resolveProductPricing(software);
  if (!pricing || pricing.startingPriceMonthly == null || !verifiedAt) {
    return null;
  }
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/month`;
}

function productBestFor(software: Software): string | null {
  return firstPublicCopy([
    software.bestFor[0],
    loadAssessment(software.slug)?.bestFor?.[0],
    software.shortDescription,
  ]);
}

function scoreToFitLabel(score: number): UseCaseFitLabel {
  if (score >= 8) return "Strong";
  if (score >= 6.5) return "Good";
  if (score >= 4) return "Limited";
  return "Limited";
}

function confidenceLabel(
  value: string | undefined,
): UseCaseEvidenceConfidence {
  if (value === "high") return "High";
  if (value === "medium") return "Medium";
  if (value === "low") return "Low";
  return "Unknown";
}

function evidenceCoverageFit(cells: EvidenceCell[]): UseCaseFitLabel {
  const known = cells.filter((c) => c !== "unknown");
  if (known.length < 2) return "Unknown";
  const supported = known.filter((c) => c === "supported").length;
  const ratio = supported / known.length;
  if (ratio >= 0.7) return "Strong";
  if (ratio >= 0.4) return "Good";
  return "Limited";
}

function compareHrefForProduct(
  productSlug: string,
  comparisons: Array<{ slug: string; productSlugs: string[] }>,
): string {
  const match = comparisons.find((c) => c.productSlugs.includes(productSlug));
  if (match) return `/compare/${match.slug}/`;
  return `/compare/build/?a=${encodeURIComponent(productSlug)}`;
}

function screenshotMatches(
  shot: { id: string; caption?: string; annotation?: string; alt?: string },
  terms: string[],
): boolean {
  if (terms.length === 0) return false;
  const hay = [shot.id, shot.caption, shot.annotation, shot.alt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return terms.some((t) => hay.includes(t.toLowerCase()));
}

function approvedCriterionScore(
  productSlug: string,
  criterionSlug: string,
): { score: number; confidence?: string; rationale?: string } | null {
  const assessment = loadAssessment(productSlug);
  if (!assessment || assessment.status !== "approved") return null;
  const criterion = assessment.criterionAssessments.find(
    (c) => c.criterionSlug === criterionSlug,
  );
  if (
    !criterion ||
    criterion.status !== "approved" ||
    typeof criterion.score !== "number"
  ) {
    return null;
  }
  return {
    score: criterion.score,
    confidence: criterion.confidence,
    rationale: publicCopy(criterion.rationale) ?? undefined,
  };
}

function buildWeightedFit(
  productSlug: string,
  capabilities: IndustryUseCaseProfile["capabilities"],
): { score: number | null; breakdown: UseCaseScoreContribution[] } {
  const breakdown: UseCaseScoreContribution[] = [];
  for (const cap of capabilities) {
    if (!cap.criterionSlug || cap.weight == null) continue;
    const approved = approvedCriterionScore(productSlug, cap.criterionSlug);
    if (!approved) continue;
    breakdown.push({
      capabilitySlug: cap.capabilitySlug,
      capabilityName: cap.name,
      criterionSlug: cap.criterionSlug,
      score: approved.score,
      weight: cap.weight,
      weightedContribution: approved.score * cap.weight,
    });
  }
  if (breakdown.length < 2) return { score: null, breakdown: [] };
  const weightSum = breakdown.reduce((sum, row) => sum + row.weight, 0);
  if (weightSum <= 0) return { score: null, breakdown: [] };
  const score =
    Math.round(
      (breakdown.reduce((sum, row) => sum + row.weightedContribution, 0) /
        weightSum) *
        10,
    ) / 10;
  return { score, breakdown };
}

function buildFinderHref(profile: IndustryUseCaseProfile): string {
  const base = profile.finderHref ?? "/tools/crm-finder/";
  const params = new URLSearchParams();
  if (profile.industrySlug) params.set("industry", profile.industrySlug);
  if (profile.finderUseCaseSlug) {
    params.set("useCase", profile.finderUseCaseSlug);
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function pickDistinct(
  candidates: IndustryUseCaseProductRow[],
  used: Set<string>,
): IndustryUseCaseProductRow | null {
  for (const row of candidates) {
    if (!used.has(row.slug)) {
      used.add(row.slug);
      return row;
    }
  }
  return candidates[0] ?? null;
}

function rankByCriterion(
  rows: IndustryUseCaseProductRow[],
  criterionSlug: string,
): IndustryUseCaseProductRow[] {
  return [...rows].sort((a, b) => {
    const aScore = approvedCriterionScore(a.slug, criterionSlug)?.score ?? -1;
    const bScore = approvedCriterionScore(b.slug, criterionSlug)?.score ?? -1;
    if (bScore !== aScore) return bScore - aScore;
    return (b.fitScore ?? 0) - (a.fitScore ?? 0);
  });
}

/**
 * Build Industry × Use Case decision page model.
 * Fit prefers weighted approved criterion scores × use-case weights;
 * otherwise evidence coverage. Never invent scores or prices.
 */
export function buildIndustryUseCaseModel(input: {
  industry: Industry;
  useCaseSlug: string;
}): IndustryUseCaseModel | null {
  const { industry, useCaseSlug } = input;
  const profile = getIndustryUseCaseProfile(industry.slug, useCaseSlug);
  if (!profile) return null;

  const useCaseName = profile.displayName;
  const categorySlug = profile.categorySlug ?? "crm";

  const primaryProducts = [...getPrimarySoftwareByCategory(categorySlug)].sort(
    (a, b) => a.name.localeCompare(b.name),
  );

  const allCategoryComparisons = getAllComparisonsUnfiltered().filter(
    (item) =>
      item.categorySlug === categorySlug &&
      (isPubliclyAvailable(item.metadata) ||
        item.outcomes.length > 0 ||
        item.metadata.researchStatus !== "none"),
  );

  const matrixSlugs =
    profile.matrixFeatureSlugs.length > 0
      ? profile.matrixFeatureSlugs
      : profile.requirements
          .map((r) => r.featureSlug)
          .filter((s): s is string => Boolean(s));

  const mustHaveFeatureSlugs = profile.requirements
    .filter((r) => r.priority === "must-have" && r.featureSlug)
    .map((r) => r.featureSlug!)
    .filter((s, i, arr) => arr.indexOf(s) === i);

  let evidenceItemCount = 0;
  let screenshotCount = 0;
  let pricingRecordCount = 0;
  const screenshots: IndustryUseCaseScreenshot[] = [];
  const mediaPool: ProductMedia[] = [];

  const productEntries = primaryProducts.map((product) => {
    const enrichment = loadEnrichment(product.slug);
    if (enrichment?.media?.length) mediaPool.push(...enrichment.media);
    const assessment = loadAssessment(product.slug);
    const review = loadReview(product.slug);

    const cells: Record<string, EvidenceCell> = {};
    for (const slug of matrixSlugs) {
      cells[slug] = featureCell(product.slug, slug);
    }

    const { score: weightedScore, breakdown } = buildWeightedFit(
      product.slug,
      profile.capabilities,
    );

    const coverageCells = (
      mustHaveFeatureSlugs.length > 0 ? mustHaveFeatureSlugs : matrixSlugs
    ).map((slug) => cells[slug] ?? featureCell(product.slug, slug));

    const fitLabel: UseCaseFitLabel =
      weightedScore != null
        ? scoreToFitLabel(weightedScore)
        : evidenceCoverageFit(coverageCells);

    const capabilityCells: Record<string, UseCaseFitLabel> = {};
    for (const cap of profile.capabilities) {
      if (cap.criterionSlug) {
        const approved = approvedCriterionScore(
          product.slug,
          cap.criterionSlug,
        );
        if (approved) {
          capabilityCells[cap.capabilitySlug] = scoreToFitLabel(approved.score);
          continue;
        }
      }
      const featureSlug = cap.capabilitySlug;
      capabilityCells[featureSlug] = evidenceCoverageFit([
        cells[featureSlug] ?? featureCell(product.slug, featureSlug),
      ]);
    }

    const catalogueUseCaseMatch =
      profile.catalogueUseCaseSlugs.length === 0 ||
      product.useCaseSlugs.some((s) =>
        profile.catalogueUseCaseSlugs.includes(s),
      );

    const supportRows = enrichment?.featureSupport ?? [];
    evidenceItemCount += supportRows.length;
    const relatedEvidence = supportRows.filter((f) =>
      matrixSlugs.includes(f.featureSlug),
    );

    const productShots = (enrichment?.screenshots ?? []).filter((s) =>
      screenshotMatches(s, profile.screenshotMatchTerms),
    );
    screenshotCount += enrichment?.screenshots?.length ?? 0;
    for (const shot of productShots.slice(0, 2)) {
      screenshots.push({
        productSlug: product.slug,
        productName: product.name,
        id: shot.id,
        src: shot.src,
        alt: shot.alt,
        caption: shot.caption,
        source: shot.source,
        checkedAt: shot.checkedAt,
      });
    }

    const { pricing, verifiedAt } = resolveProductPricing(product);
    if (pricing && verifiedAt) pricingRecordCount += 1;

    const strengths = (
      relatedEvidence
        .filter((f) => f.availability === "supported")
        .map((f) => featureName(f.featureSlug))
        .length > 0
        ? relatedEvidence
            .filter((f) => f.availability === "supported")
            .map((f) => featureName(f.featureSlug))
        : (assessment?.strengths ?? [])
            .map((s) => publicCopy(s))
            .filter(Boolean)
    ).slice(0, 3) as string[];

    const limitations = (
      relatedEvidence.some(
        (f) =>
          f.availability === "limited" ||
          f.availability === "higher-plan-only" ||
          f.availability === "add-on" ||
          f.availability === "not-supported",
      )
        ? relatedEvidence
            .filter(
              (f) =>
                f.availability === "limited" ||
                f.availability === "higher-plan-only" ||
                f.availability === "add-on" ||
                f.availability === "not-supported",
            )
            .map((f) => {
              const name = featureName(f.featureSlug);
              if (f.availability === "higher-plan-only") {
                return `${name} may require a higher plan`;
              }
              if (f.availability === "add-on") {
                return `${name} may be an add-on`;
              }
              if (f.availability === "limited") {
                return `${name} support is limited / plan-dependent`;
              }
              return `${name} not evidenced as supported`;
            })
        : (assessment?.weaknesses ?? [])
            .map((s) => publicCopy(s))
            .filter(Boolean)
    ).slice(0, 3) as string[];

    const evidenceConfidence =
      weightedScore != null
        ? breakdown.length >= 4
          ? "High"
          : breakdown.length >= 2
            ? "Medium"
            : "Low"
        : relatedEvidence.length >= 4
          ? "High"
          : relatedEvidence.length >= 2
            ? "Medium"
            : relatedEvidence.length >= 1
              ? "Low"
              : "Unknown";

    const membershipBoost = catalogueUseCaseMatch ? 1.5 : 0;
    const sortKey =
      (weightedScore ?? 0) * 10 +
      membershipBoost +
      relatedEvidence.filter((f) => f.availability === "supported").length +
      (review?.editorialStatus === "approved" ? 0.1 : 0);

    return {
      row: {
        slug: product.slug,
        name: product.name,
        logo: product.logo,
        fitLabel,
        fitScore: weightedScore,
        fitBreakdown: breakdown,
        cells,
        capabilityCells,
        positioning: productBestFor(product),
        pricingTeaser: pricingTeaser(product),
        evidenceConfidence,
        evidenceCount: relatedEvidence.length,
        strengths,
        limitations,
        bestFor: productBestFor(product),
        catalogueUseCaseMatch,
        reviewHref: `/software/${product.slug}/`,
        compareHref: compareHrefForProduct(
          product.slug,
          allCategoryComparisons,
        ),
        pricingHref: `/software/${product.slug}/#pricing`,
        visitHref:
          resolveVisitCta(product.slug, "other")?.href ??
          product.website ??
          `/software/${product.slug}/`,
      } satisfies IndustryUseCaseProductRow,
      sortKey,
    };
  });

  const ranked = [...productEntries]
    .sort((a, b) => {
      if (b.sortKey !== a.sortKey) return b.sortKey - a.sortKey;
      return a.row.name.localeCompare(b.row.name);
    })
    .map((item) => item.row);

  const preferred = ranked.filter((p) => p.catalogueUseCaseMatch);
  const scorecardSource =
    preferred.length >= 4
      ? preferred
      : ranked.filter(
          (p) =>
            p.fitScore != null ||
            Object.values(p.cells).some((c) => c !== "unknown"),
        );
  const scorecardRows: IndustryUseCaseProductRow[] = (scorecardSource.length >= 4
    ? scorecardSource
    : ranked
  ).slice(0, 8);

  const productCards = scorecardRows
    .filter(
      (p) =>
        p.fitLabel === "Strong" ||
        p.fitLabel === "Good" ||
        p.fitScore != null,
    )
    .slice(0, 5);
  const cards =
    productCards.length >= 2 ? productCards : scorecardRows.slice(0, 4);

  const usedSummary = new Set<string>();
  const eligible = scorecardRows.filter(
    (p) => p.fitLabel !== "Unknown" || p.fitScore != null,
  );
  const summaryPicks: IndustryUseCaseSummaryPick[] = profile.summarySlots.map(
    (slot) => {
      let pool = eligible;
      if (slot.selection === "best-simplicity") {
        pool = rankByCriterion(eligible, "ease-of-use");
      } else if (slot.selection === "best-complex") {
        pool = rankByCriterion(eligible, "customization");
      } else if (slot.selection === "best-small-team") {
        pool = rankByCriterion(eligible, "administration-overhead");
      } else if (slot.selection === "best-value") {
        pool = rankByCriterion(eligible, "value-for-money");
      } else {
        pool = [...eligible].sort(
          (a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0),
        );
      }
      const product = pickDistinct(pool, usedSummary);
      return {
        id: slot.id,
        label: slot.label,
        product,
        rationale: product?.bestFor ?? product?.positioning ?? null,
      };
    },
  );

  const scenarios: IndustryUseCaseScenarioPick[] = profile.scenarios.map(
    (scenario) => {
      const focusCriteria = profile.capabilities
        .filter((c) =>
          scenario.focusCapabilitySlugs.includes(c.capabilitySlug),
        )
        .map((c) => c.criterionSlug)
        .filter((s): s is string => Boolean(s));
      let pool = [...scorecardRows];
      if (focusCriteria[0]) {
        pool = rankByCriterion(pool, focusCriteria[0]);
      } else {
        pool.sort((a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0));
      }
      return {
        id: scenario.id,
        title: scenario.title,
        description: scenario.description,
        priorities: scenario.priorities,
        icon: scenario.icon,
        product: pool[0] ?? null,
      };
    },
  );

  const whyDiffer = scenarios.slice(0, 4).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    product: s.product,
  }));

  const relatedCapabilities = profile.capabilities
    .map((cap) => {
      const relatedProfile = getIndustryCapabilityProfile(
        industry.slug,
        cap.capabilitySlug,
      );
      const detailHref = relatedProfile
        ? `/industries/${industry.slug}/capabilities/${cap.capabilitySlug}/`
        : null;
      const href =
        detailHref ??
        (cap.href && !cap.href.includes("#") ? cap.href : null);
      if (!href) return null;
      return {
        slug: cap.capabilitySlug,
        name: cap.name,
        href,
        description: cap.description,
        importance: importanceLabel(cap.importance),
      };
    })
    .filter(Boolean)
    .slice(0, 8) as Array<{
    slug: string;
    name: string;
    href: string;
    description: string;
    importance: string;
  }>;

  const relatedUseCases = profile.relatedUseCaseSlugs
    .map((slug) => {
      const related = getIndustryUseCaseProfile(industry.slug, slug);
      if (related) {
        return {
          slug,
          name: related.displayName,
          href: `/industries/${industry.slug}/use-cases/${slug}/`,
          description: related.tagline ?? related.glance?.typicalObjective ?? null,
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 6) as Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;

  const comparisons = allCategoryComparisons
    .filter((c) =>
      c.productSlugs.some((slug) =>
        scorecardRows.some((p) => p.slug === slug),
      ),
    )
    .slice(0, 6)
    .map((comparison) => ({
      href: `/compare/${comparison.slug}/`,
      title: comparison.title,
      products: comparison.productSlugs.map((slug) => {
        const product = getSoftwareBySlug(slug);
        return {
          name: product?.name ?? slug,
          slug,
          logo: product?.logo,
        };
      }),
    }));

  const lastReviewedCandidates = [
    profile.lastReviewedAt,
    industry.metadata.updatedAt,
    industry.metadata.reviewedAt,
    ...primaryProducts.map((s) => s.lastVerifiedAt),
  ].filter(Boolean) as string[];
  const lastReviewedAt = lastReviewedCandidates.sort().at(-1) ?? null;

  const requirements = profile.requirements.map((item) => {
    const requirementHref = item.requirementSlug
      ? resolveRequirementDetailHref(item.requirementSlug)
      : null;
    const featureHref = item.featureSlug
      ? resolveFeatureDetailHref(item.featureSlug)
      : null;
    return {
      ...item,
      href: requirementHref ?? item.href ?? featureHref ?? undefined,
    };
  });
  const mustHaveRequirements = requirements.filter(
    (r) => r.priority === "must-have",
  );
  const niceToHaveRequirements = requirements.filter(
    (r) => r.priority === "important" || r.priority === "advanced",
  );

  const requirementsByCapability = profile.capabilities
    .map((cap) => ({
      capabilitySlug: cap.capabilitySlug,
      capabilityName: cap.name,
      importance: importanceLabel(cap.importance),
      requirements: requirements.filter(
        (r) => r.capabilitySlug === cap.capabilitySlug,
      ),
    }))
    .filter((group) => group.requirements.length > 0);

  const hasNumericWeights = profile.capabilities.some((c) => c.weight != null);
  const hasNumericScores = scorecardRows.some((r) => r.fitScore != null);

  const scoredCount = scorecardRows.filter((r) => r.fitScore != null).length;
  const researchConfidence: UseCaseEvidenceConfidence =
    scoredCount >= 4
      ? "High"
      : scoredCount >= 2
        ? "Medium"
        : scorecardRows.some((r) => r.evidenceCount > 0)
          ? "Low"
          : "Unknown";

  const highestPriorityCapability =
    [...profile.capabilities].sort((a, b) => {
      const order = { critical: 0, high: 1, important: 2, optional: 3 };
      return order[a.importance] - order[b.importance];
    })[0]?.name ?? null;

  const displayTitle =
    profile.displayTitle ?? `${useCaseName} CRM for ${industry.name}`;
  const eyebrow =
    profile.eyebrow ?? `${industry.name} CRM use case`;
  const tagline =
    profile.tagline ??
    `Compare CRM platforms for ${useCaseName.toLowerCase()} based on researched capabilities and requirements.`;

  const scorecardColumns = profile.capabilities.slice(0, 6).map((c) => ({
    key: c.capabilitySlug,
    label: c.name,
  }));

  const seeInAction = selectUseCaseSeeInActionCards({
    mediaPool,
    products: scorecardRows.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    workflowSteps: [],
    ctx: {
      useCaseSlug,
      industrySlug: industry.slug,
      useCaseAliases: useCaseMediaAliases(useCaseSlug),
      capabilityIds: profile.capabilities.map((c) => c.capabilitySlug),
      requirementIds: profile.requirements
        .map((r) => r.requirementSlug)
        .filter((s): s is string => Boolean(s)),
      featureIds: matrixSlugs,
    },
    limit: 3,
  });

  const navItems: IndustryUseCaseNavItem[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    { id: "short-answer", label: "The short answer", icon: "star" },
    { id: "how-it-works", label: "How it works", icon: "puzzle" },
    { id: "needs", label: "What you need", icon: "features" },
    { id: "requirements", label: "Requirements", icon: "puzzle" },
    { id: "recommendations", label: "Recommendations", icon: "star" },
    { id: "scorecard", label: "Product comparison", icon: "comparisons" },
    { id: "matrix", label: "Requirement matrix", icon: "comparisons" },
    ...(seeInAction.length > 0
      ? [{ id: "see-in-action", label: "See in action", icon: "explore" as const }]
      : []),
    ...(screenshots.length > 0
      ? [{ id: "screenshots", label: "Screenshots", icon: "explore" as const }]
      : []),
    { id: "scenarios", label: "Worked examples", icon: "use-cases" },
    { id: "pricing", label: "Pricing", icon: "choose" },
    { id: "tradeoffs", label: "Trade-offs", icon: "choose" },
    { id: "questions", label: "Vendor questions", icon: "faq" },
    { id: "methodology", label: "Methodology", icon: "methodology" },
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  const finderHref = buildFinderHref(profile);

  const capabilities = profile.capabilities.map((cap) => {
    const relatedProfile = getIndustryCapabilityProfile(
      industry.slug,
      cap.capabilitySlug,
    );
    const detailHref = relatedProfile
      ? `/industries/${industry.slug}/capabilities/${cap.capabilitySlug}/`
      : null;
    return {
      ...cap,
      href: detailHref ?? cap.href,
    };
  });

  return {
    industry,
    useCaseSlug,
    useCaseName,
    profile,
    displayTitle,
    eyebrow,
    tagline,
    decisionNuance: profile.decisionNuance ?? null,
    industryHref: `/industries/${industry.slug}/`,
    finderHref,
    calculatorHref:
      profile.calculatorHref ?? "/tools/crm-cost-calculator/",
    compareHref: profile.compareHref ?? "/compare/",
    methodologyHref: profile.methodologyHref ?? COMPANY_ROUTES.methodology,
    catalogueHref: `/categories/${categorySlug}/`,
    capabilities,
    requirements,
    mustHaveRequirements,
    niceToHaveRequirements,
    requirementsByCapability,
    glance: {
      typicalObjective: profile.glance?.typicalObjective ?? null,
      teamTypes: profile.glance?.teamTypes ?? [],
      topPriorityLabels: profile.glance?.topPriorityLabels ?? [],
      highestPriorityCapability,
      researchedProductCount: scorecardRows.length,
      requirementCount: profile.requirements.length,
      researchConfidence,
      lastReviewedAt,
    },
    summaryPicks: summaryPicks.filter((p) => p.product != null),
    scenarios,
    whyDiffer,
    matrixFeatureSlugs: matrixSlugs.map((slug) => ({
      slug,
      name: featureName(slug),
      href: resolveFeatureDetailHref(slug),
    })),
    scorecardColumns,
    productRows: scorecardRows,
    productCards: cards,
    deepDives: cards.slice(0, 4),
    screenshots: screenshots.slice(0, 9),
    seeInAction,
    tradeoffs: profile.tradeoffs,
    implementation: profile.implementation,
    vendorQuestions: profile.vendorQuestions,
    relatedCapabilities,
    relatedUseCases,
    comparisons,
    faq: profile.faq,
    research: {
      productCount: scorecardRows.length,
      capabilityCount: profile.capabilities.length,
      requirementCount: profile.requirements.length,
      evidenceItemCount,
      screenshotCount,
      pricingRecordCount,
      lastUpdated: lastReviewedAt,
    },
    decisionFlow: [
      { label: "Use case", value: useCaseName },
      {
        label: "Capabilities",
        value: `${profile.capabilities.length} prioritized`,
      },
      {
        label: "Requirements",
        value: `${profile.requirements.length} evaluated`,
      },
      {
        label: "Products",
        value: `${scorecardRows.length} researched`,
      },
      {
        label: "Evidence",
        value: `${evidenceItemCount} records`,
      },
      { label: "Outcome", value: "Scenario-specific fit" },
    ],
    navItems,
    stats: [
      {
        label: `${scorecardRows.length} CRM products researched`,
        icon: "products",
      },
      ...(lastReviewedAt
        ? [
            {
              label: `Updated ${lastReviewedAt.slice(0, 10)}`,
              icon: "updated" as const,
            },
          ]
        : []),
      {
        label: "Independent editorial process",
        icon: "independent",
        href: LEGAL_ROUTES.editorialIndependence,
      },
    ],
    hasNumericWeights,
    hasNumericScores,
  };
}

export function getIndustryUseCasePage(
  industrySlug: string,
  useCaseSlug: string,
): IndustryUseCaseModel | null {
  const industry = getIndustryBySlug(industrySlug, {
    includeUnpublished: true,
  });
  if (!industry) return null;
  return buildIndustryUseCaseModel({ industry, useCaseSlug });
}
