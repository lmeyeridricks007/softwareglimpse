import type {
  CurrencyCode,
  FeatureAvailability,
  Industry,
  IndustryCapabilityProfile,
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
import { getIndustryUseCaseProfile } from "@/data/industry-use-case";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import { loadEnrichment } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import type { EvidenceCell } from "@/services/industry-hub";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { resolveVisitCta } from "@/services/affiliate/resolve-visit-cta";
import type { ProductMedia } from "@/domain";
import {
  capabilityMediaAliases,
  selectCapabilityApproachPairs,
  selectCapabilityDeepDiveVideo,
  selectCapabilityPageVideos,
  selectCapabilitySeeInActionCards,
} from "@/services/product-media/capability-page-media";
import { isOfficialVendorMedia } from "@/domain";
import { buildCapabilityWorkflowComparison } from "@/services/capability-workflow-comparison";
import type { CapabilityWorkflowComparisonModel } from "@/services/capability-workflow-comparison";
import { getCapabilityHubProfile } from "@/data/capability-hub";
import {
  buildCapabilityRequirementEvidence,
  type CapabilityRequirementEvidenceModel,
} from "@/services/capability-requirement-evidence";

export type CapabilityFitLabel = "Strong" | "Good" | "Limited" | "Unknown";

export type CapabilityEvidenceConfidence = "High" | "Medium" | "Low" | "Unknown";

export type IndustryCapabilityNavItem = {
  id: string;
  label: string;
  icon?: string;
};

export type IndustryCapabilityProductRow = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  fitLabel: CapabilityFitLabel;
  fitScore: number | null;
  fitRationale: string | null;
  cells: Record<string, EvidenceCell>;
  positioning: string | null;
  pricingTeaser: string | null;
  evidenceConfidence: CapabilityEvidenceConfidence;
  evidenceCount: number;
  /** Enrichment screenshot count — display only; never used in fit scoring. */
  screenshotCount: number;
  /** Official video count for this capability — display only. */
  officialVideoCount: number;
  strengths: string[];
  limitations: string[];
  bestFor: string | null;
  reviewHref: string;
  compareHref: string;
  visitHref: string;
  /** Best workflow demo for deep-dive — null when none. */
  deepDiveVideo: import("@/domain").ProductMedia | null;
};

export type IndustryCapabilityScreenshot = {
  productSlug: string;
  productName: string;
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
};

export type IndustryCapabilityModel = {
  industry: Industry;
  capabilitySlug: string;
  capabilityName: string;
  profile: IndustryCapabilityProfile;
  displayTitle: string;
  eyebrow: string;
  tagline: string;
  industryHref: string;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  methodologyHref: string;
  catalogueHref: string;
  whyItMatters: string[];
  weakProcessRisks: string[];
  glance: {
    importanceLabel: string | null;
    coreObjective: string | null;
    importantRequirementLabels: string[];
    relatedCapabilityLabels: string[];
    researchedProductCount: number;
    lastReviewedAt: string | null;
  };
  evaluationDimensions: string[];
  requirements: IndustryCapabilityProfile["requirements"];
  essentialRequirements: IndustryCapabilityProfile["requirements"];
  advancedRequirements: IndustryCapabilityProfile["requirements"];
  matrixFeatureSlugs: Array<{ slug: string; name: string }>;
  productRows: IndustryCapabilityProductRow[];
  productCards: IndustryCapabilityProductRow[];
  screenshots: IndustryCapabilityScreenshot[];
  /** Official vendor workflow demos — ResearchMedia, not a CapabilityVideo entity. */
  seeInAction: import("@/services/product-media").CapabilitySeeInActionCard[];
  approachPairs: import("@/services/product-media").CapabilitySeeInActionCard[];
  videos: import("@/domain").ProductMedia[];
  approachInterpretation: string | null;
  workflowComparison: CapabilityWorkflowComparisonModel | null;
  requirementEvidence: CapabilityRequirementEvidenceModel | null;
  outcomes: IndustryCapabilityProfile["outcomes"];
  tradeoffs: IndustryCapabilityProfile["tradeoffs"];
  useCaseFits: IndustryCapabilityProfile["useCaseFits"];
  vendorQuestions: string[];
  implementation: IndustryCapabilityProfile["implementation"];
  relatedCapabilities: Array<{
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
  faq: IndustryCapabilityProfile["faq"];
  research: {
    productCount: number;
    evidenceItemCount: number;
    screenshotCount: number;
    officialVideoCount: number;
    lastUpdated: string | null;
  };
  navItems: IndustryCapabilityNavItem[];
  stats: Array<{
    label: string;
    href?: string;
    icon?: "products" | "updated" | "independent" | "methodology";
  }>;
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

function scoreToFitLabel(score: number): CapabilityFitLabel {
  if (score >= 8) return "Strong";
  if (score >= 6.5) return "Good";
  if (score >= 4) return "Limited";
  return "Limited";
}

function confidenceLabel(
  value: string | undefined,
): CapabilityEvidenceConfidence {
  if (value === "high") return "High";
  if (value === "medium") return "Medium";
  if (value === "low") return "Low";
  return "Unknown";
}

function evidenceCoverageFit(
  cells: EvidenceCell[],
): CapabilityFitLabel {
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

/**
 * Build Industry × Capability page model.
 * Fit labels prefer approved criterion assessments; otherwise evidence coverage.
 */
export function buildIndustryCapabilityModel(input: {
  industry: Industry;
  capabilitySlug: string;
}): IndustryCapabilityModel | null {
  const { industry, capabilitySlug } = input;
  const profile = getIndustryCapabilityProfile(industry.slug, capabilitySlug);
  if (!profile) return null;

  const capabilityName =
    profile.displayName ?? featureName(capabilitySlug);
  const categorySlug = profile.categorySlug ?? "crm";
  const criterionSlug = profile.criterionSlug ?? capabilitySlug;

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
      : [capabilitySlug];

  const scorecardKeys = [
    capabilitySlug,
    ...profile.requirements
      .map((r) => r.featureSlug)
      .filter((s): s is string => Boolean(s)),
  ].filter((s, i, arr) => arr.indexOf(s) === i);

  let evidenceItemCount = 0;
  let screenshotCount = 0;
  const screenshots: IndustryCapabilityScreenshot[] = [];
  const mediaPool: ProductMedia[] = [];

  const requirementIds = profile.requirements
    .map((r) => r.requirementSlug)
    .filter((s): s is string => Boolean(s));
  const featureIdsForMedia = [
    ...matrixSlugs,
    ...profile.requirements
      .map((r) => r.featureSlug)
      .filter((s): s is string => Boolean(s)),
  ].filter((s, i, arr) => arr.indexOf(s) === i);
  const useCaseIds = (profile.useCaseFits ?? [])
    .map((u) => u.useCaseSlug)
    .filter((s): s is string => Boolean(s));
  const mediaCtxBase = {
    capabilitySlug,
    industrySlug: industry.slug,
    capabilityAliases: capabilityMediaAliases(capabilitySlug),
    requirementIds,
    featureIds: featureIdsForMedia,
    useCaseIds,
  };

  const productEntries = primaryProducts.map(
    (product) => {
      const enrichment = loadEnrichment(product.slug);
      const assessment = loadAssessment(product.slug);
      const review = loadReview(product.slug);

      if (enrichment?.media?.length) {
        mediaPool.push(...enrichment.media);
      }

      const cells: Record<string, EvidenceCell> = {};
      for (const slug of matrixSlugs) {
        cells[slug] = featureCell(product.slug, slug);
      }

      const criterion = assessment?.criterionAssessments.find(
        (c) => c.criterionSlug === criterionSlug,
      );
      const criterionApproved =
        assessment?.status === "approved" &&
        criterion?.status === "approved" &&
        typeof criterion.score === "number";

      const coverageCells = scorecardKeys.map(
        (slug) => cells[slug] ?? featureCell(product.slug, slug),
      );

      const fitLabel: CapabilityFitLabel = criterionApproved
        ? scoreToFitLabel(criterion!.score)
        : evidenceCoverageFit(coverageCells);

      const fitScore = criterionApproved ? criterion!.score : null;
      const fitRationale = criterionApproved
        ? publicCopy(criterion!.rationale)
        : null;

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

      const productMedia = enrichment?.media ?? [];
      const officialVideoCount = selectCapabilityPageVideos(
        productMedia,
        { ...mediaCtxBase, productSlug: product.slug },
        { limit: 10, allowBrandPromoFallback: false },
      ).length;
      const deepDiveVideo = selectCapabilityDeepDiveVideo(productMedia, {
        ...mediaCtxBase,
        productSlug: product.slug,
      });

      const strengths = (
        criterionApproved
          ? relatedEvidence
              .filter((f) => f.availability === "supported")
              .map((f) => featureName(f.featureSlug))
          : (assessment?.strengths ?? [])
              .map((s) => publicCopy(s))
              .filter(Boolean)
      ).slice(0, 3) as string[];

      const limitations = (
        criterionApproved
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

      const evidenceConfidence = criterionApproved
        ? confidenceLabel(criterion!.confidence)
        : relatedEvidence.length >= 4
          ? "High"
          : relatedEvidence.length >= 2
            ? "Medium"
            : relatedEvidence.length >= 1
              ? "Low"
              : "Unknown";

      const sortKey =
        (fitScore ?? 0) * 10 +
        relatedEvidence.filter((f) => f.availability === "supported").length +
        (review?.editorialStatus === "approved" ? 0.1 : 0);

      return {
        row: {
          slug: product.slug,
          name: product.name,
          logo: product.logo,
          fitLabel,
          fitScore,
          fitRationale,
          cells,
          positioning: productBestFor(product),
          pricingTeaser: pricingTeaser(product),
          evidenceConfidence,
          evidenceCount: relatedEvidence.length,
          screenshotCount: productShots.length,
          officialVideoCount,
          strengths,
          limitations,
          bestFor: productBestFor(product),
          reviewHref: `/software/${product.slug}/`,
          compareHref: compareHrefForProduct(
            product.slug,
            allCategoryComparisons,
          ),
          visitHref:
            resolveVisitCta(product.slug, "other")?.href ??
            product.website ??
            `/software/${product.slug}/`,
          deepDiveVideo,
        } satisfies IndustryCapabilityProductRow,
        sortKey,
        documentationByFeature: Object.fromEntries(
          supportRows.map((f) => [
            f.featureSlug,
            f.sourceIds?.length ?? (f.notes ? 1 : 0),
          ]),
        ) as Record<string, number>,
      };
    },
  );

  const ranked = [...productEntries]
    .sort((a, b) => {
      if (b.sortKey !== a.sortKey) return b.sortKey - a.sortKey;
      return a.row.name.localeCompare(b.row.name);
    })
    .map((item) => item.row);

  const documentationByProduct = new Map(
    productEntries.map((e) => [e.row.slug, e.documentationByFeature]),
  );

  // Prefer products with known evidence for the primary capability.
  const withEvidence = ranked.filter(
    (p) => (p.cells[capabilitySlug] ?? "unknown") !== "unknown" || p.fitScore != null,
  );
  const scorecardSource = withEvidence.length >= 4 ? withEvidence : ranked;
  const scorecardRows = scorecardSource.slice(0, 8);
  const productCards = scorecardSource
    .filter((p) => p.fitLabel === "Strong" || p.fitLabel === "Good" || p.fitScore != null)
    .slice(0, 3);
  const cards =
    productCards.length >= 2
      ? productCards
      : scorecardRows.slice(0, 3);

  const relatedCapabilities = (profile.relatedCapabilitySlugs ?? [])
    .map((slug) => {
      const relatedProfile = getIndustryCapabilityProfile(
        industry.slug,
        slug,
      );
      if (!relatedProfile) return null;
      const name = relatedProfile.displayName ?? featureName(slug);
      return {
        slug,
        name,
        href: `/industries/${industry.slug}/capabilities/${slug}/`,
        description:
          relatedProfile.tagline ??
          `Explore ${name.toLowerCase()} in a CRM context.`,
      };
    })
    .filter(Boolean)
    .slice(0, 6) as Array<{
    slug: string;
    name: string;
    href: string;
    description: string;
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
      // Prefer buyer-requirement pages over feature pages when both exist.
      href: requirementHref ?? item.href ?? featureHref ?? undefined,
    };
  });
  const essentialRequirements = requirements.filter(
    (r) => r.priority === "core",
  );
  const advancedRequirements = requirements.filter(
    (r) => r.priority === "advanced" || r.priority === "optional",
  );

  const displayTitle =
    profile.displayTitle ??
    `${capabilityName} for ${industry.name}`;
  const eyebrow =
    profile.eyebrow ?? `${industry.name} CRM capability`;
  const tagline =
    profile.tagline ??
    `Evaluate CRM platforms based on how well they support ${capabilityName.toLowerCase()} for ${industry.name.toLowerCase()} teams.`;

  const seeInAction = selectCapabilitySeeInActionCards({
    mediaPool,
    products: scorecardRows.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    ctx: mediaCtxBase,
    limit: 4,
  });
  const approachPairs = selectCapabilityApproachPairs(seeInAction);
  const videos = selectCapabilityPageVideos(mediaPool, mediaCtxBase, {
    limit: 12,
    allowBrandPromoFallback: false,
  });
  const officialVideoCount = videos.filter((m) => isOfficialVendorMedia(m))
    .length;

  const approachInterpretation =
    approachPairs.length >= 2
      ? `${approachPairs[0]!.productName} and ${approachPairs[1]!.productName} demonstrate different emphases for ${capabilityName.toLowerCase()} in their official workflows — compare surfaces shown, not marketing claims. Video availability never changes fit labels.`
      : null;

  const hubProfile =
    getCapabilityHubProfile(
      capabilitySlug === "security-administration" ? "security" : capabilitySlug,
    ) ??
    (capabilitySlug === "security-administration"
      ? getCapabilityHubProfile("administration")
      : null);
  const workflowSteps =
    hubProfile?.workflowSteps?.map((s) => ({
      id: s.id,
      label: s.label,
      detail: s.detail,
    })) ??
    profile.evaluationDimensions.slice(0, 6).map((label, i) => ({
      id: `dim-${i}`,
      label,
      detail: undefined,
    }));

  const workflowComparison = buildCapabilityWorkflowComparison({
    capabilityId: capabilitySlug,
    capabilityName,
    productIds: [
      ...seeInAction.map((c) => c.productSlug),
      ...scorecardRows.map((p) => p.slug),
    ].filter((s, i, arr) => arr.indexOf(s) === i),
    workflowSteps,
    mediaPool,
    screenshots: screenshots.map((s) => ({
      productSlug: s.productSlug,
      src: s.src,
      alt: s.alt,
      caption: s.caption,
      source: s.source,
    })),
    assessments: scorecardRows.map((p) => ({
      productSlug: p.slug,
      fitLabel: p.fitLabel,
    })),
    mediaCtx: mediaCtxBase,
    relatedFeatureSlugs: matrixSlugs.slice(0, 4),
    relatedCapabilityHrefs:
      capabilitySlug === "pipeline-management"
        ? [
            {
              href: "/capabilities/workflow-automation/",
              label: "Explore Workflow Automation →",
            },
          ]
        : capabilitySlug === "workflow-automation"
          ? [
              {
                href: "/capabilities/pipeline-management/",
                label: "Explore Pipeline Management →",
              },
            ]
          : [],
    evidenceHref: "#capability-evidence",
    limitProducts: 2,
  });

  const requirementEvidence = buildCapabilityRequirementEvidence({
    capabilityId: capabilitySlug,
    capabilityName,
    requirements: requirements.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      priority: r.priority,
      featureSlug: r.featureSlug,
      requirementSlug: r.requirementSlug,
      href: r.href,
    })),
    products: scorecardRows.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
      cells: p.cells,
      reviewHref: p.reviewHref,
      fitLabel: p.fitLabel,
      documentationByFeature: documentationByProduct.get(p.slug) ?? {},
    })),
    mediaPool,
    screenshots: screenshots.map((s) => ({
      id: s.id,
      productSlug: s.productSlug,
      src: s.src,
      alt: s.alt,
      caption: s.caption,
      source: s.source,
      checkedAt: s.checkedAt,
    })),
  });

  const navItems: IndustryCapabilityNavItem[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    { id: "why", label: "Why it matters", icon: "features" },
    { id: "requirements", label: "Requirements", icon: "puzzle" },
    ...(requirementEvidence.rows.some((r) =>
      r.products.some(
        (p) =>
          p.officialVideoCount > 0 ||
          p.screenshotCount > 0 ||
          p.documentationCount > 0,
      ),
    )
      ? [
          {
            id: "requirement-evidence",
            label: "Req. evidence",
            icon: "methodology" as const,
          },
        ]
      : []),
    { id: "products", label: "Products", icon: "star" },
    { id: "matrix", label: "Feature matrix", icon: "comparisons" },
    ...(seeInAction.length > 0
      ? [{ id: "see-in-action", label: "See in action", icon: "explore" as const }]
      : []),
    ...(workflowComparison
      ? [
          {
            id: "approach-differences",
            label: "Approaches",
            icon: "comparisons" as const,
          },
        ]
      : []),
    ...(screenshots.length > 0
      ? [{ id: "screenshots", label: "Screenshots", icon: "explore" as const }]
      : []),
    ...(seeInAction.length > 0 || screenshots.length > 0
      ? [
          {
            id: "capability-evidence",
            label: "Evidence",
            icon: "methodology" as const,
          },
        ]
      : []),
    { id: "tradeoffs", label: "Trade-offs", icon: "choose" },
    { id: "use-cases", label: "Use cases", icon: "use-cases" },
    { id: "questions", label: "Vendor questions", icon: "faq" },
    { id: "methodology", label: "Methodology", icon: "methodology" },
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  return {
    industry,
    capabilitySlug,
    capabilityName,
    profile,
    displayTitle,
    eyebrow,
    tagline,
    industryHref: `/industries/${industry.slug}/`,
    finderHref: profile.finderHref ?? "/tools/crm-finder/",
    calculatorHref:
      profile.calculatorHref ?? "/tools/crm-cost-calculator/",
    compareHref: profile.compareHref ?? "/compare/",
    methodologyHref: profile.methodologyHref ?? COMPANY_ROUTES.methodology,
    catalogueHref: `/categories/${categorySlug}/`,
    whyItMatters: profile.whyItMatters,
    weakProcessRisks: profile.weakProcessRisks,
    glance: {
      importanceLabel: profile.glance?.importanceLabel ?? null,
      coreObjective: profile.glance?.coreObjective ?? null,
      importantRequirementLabels:
        profile.glance?.importantRequirementLabels ?? [],
      relatedCapabilityLabels: relatedCapabilities.map((c) => c.name),
      researchedProductCount: primaryProducts.length,
      lastReviewedAt,
    },
    evaluationDimensions: profile.evaluationDimensions,
    requirements,
    essentialRequirements,
    advancedRequirements,
    matrixFeatureSlugs: matrixSlugs.map((slug) => ({
      slug,
      name: featureName(slug),
    })),
    productRows: scorecardRows,
    productCards: cards,
    screenshots: screenshots.slice(0, 6),
    seeInAction,
    approachPairs,
    videos,
    approachInterpretation,
    workflowComparison,
    requirementEvidence,
    outcomes: profile.outcomes,
    tradeoffs: profile.tradeoffs,
    useCaseFits: profile.useCaseFits.map((item) => {
      const detailHref =
        item.useCaseSlug &&
        getIndustryUseCaseProfile(industry.slug, item.useCaseSlug)
          ? `/industries/${industry.slug}/use-cases/${item.useCaseSlug}/`
          : null;
      return {
        ...item,
        href: detailHref ?? item.href,
      };
    }),
    vendorQuestions: profile.vendorQuestions,
    implementation: profile.implementation,
    relatedCapabilities,
    comparisons,
    faq: profile.faq,
    research: {
      productCount: primaryProducts.length,
      evidenceItemCount,
      screenshotCount,
      officialVideoCount,
      lastUpdated: lastReviewedAt,
    },
    navItems,
    stats: [
      {
        label: `${primaryProducts.length} CRM products researched`,
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
  };
}

export function getIndustryCapabilityPage(
  industrySlug: string,
  capabilitySlug: string,
): IndustryCapabilityModel | null {
  const industry = getIndustryBySlug(industrySlug, {
    includeUnpublished: true,
  });
  if (!industry) return null;
  return buildIndustryCapabilityModel({ industry, capabilitySlug });
}
