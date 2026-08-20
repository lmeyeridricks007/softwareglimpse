import type {
  CurrencyCode,
  FeatureAvailability,
  FeatureDetailProfile,
  Industry,
  Pricing,
  ProductMedia,
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
} from "@/data/editorial/store";
import { getIndustryCapabilityProfile } from "@/data/industry-capability";
import { getFeatureDetailProfile } from "@/data/feature-detail";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { resolveVisitCta } from "@/services/affiliate/resolve-visit-cta";
import {
  featureHowItWorksCaption,
  featureVisualKindForSlug,
  type FeatureVisualKind,
} from "@/services/feature-detail/visual-kind";
import { workedExamplesForFeature } from "@/services/feature-detail/worked-examples";
import {
  selectFeatureDeepDiveVideo,
  selectFeaturePageVideos,
  selectFeatureSeeInActionCards,
  type FeatureSeeInActionCard,
} from "@/services/product-media/feature-page-media";
import { buildMatrixCellEvidence } from "@/services/feature-detail/matrix-cell-evidence";

export type FeatureSupportStatus =
  | "supported"
  | "partially-supported"
  | "plan-dependent"
  | "limited"
  | "not-supported"
  | "not-evidenced";

export type FeatureDepthLabel = "Strong" | "Good" | "Limited" | "Unknown";
export type FeatureConfidence = "High" | "Medium" | "Low" | "Unknown";

export type FeatureDimensionCellEvidence = {
  totalCount: number;
  documentationCount: number;
  screenshotCount: number;
  videoCount: number;
  documentation: Array<{
    title: string;
    url: string;
    kindLabel?: string | null;
  }>;
  screenshots: Array<{
    id: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
    checkedAt?: string;
  }>;
  videos: ProductMedia[];
  videoDemonstrates: string[];
};

export type FeatureDimensionCell = {
  display: string;
  status: FeatureSupportStatus | "text";
  evidenceNote: string | null;
  /** Dimension-scoped evidence for matrix drawer — never alters display/status. */
  evidence: FeatureDimensionCellEvidence | null;
};

export type FeatureProductRow = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  supportStatus: FeatureSupportStatus;
  depthLabel: FeatureDepthLabel;
  depthSegments: number;
  minimumPlan: string | null;
  knownLimit: string | null;
  evidenceConfidence: FeatureConfidence;
  evidenceCount: number;
  /** Research sources counted for this feature (not video-weighted for scoring). */
  sourceCount: number;
  screenshotCount: number;
  videoCount: number;
  /** Best official feature demo for deep dive — null when none. */
  featureVideo: ProductMedia | null;
  strengths: string[];
  limitations: string[];
  bestFor: string | null;
  howItWorks: string | null;
  pricingTeaser: string | null;
  dimensionCells: Record<string, FeatureDimensionCell>;
  reviewHref: string;
  compareHref: string;
  pricingHref: string;
  visitHref: string;
};

export type FeatureScreenshot = {
  productSlug: string;
  productName: string;
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
  tabIds: string[];
};

export type FeatureDetailModel = {
  profile: FeatureDetailProfile;
  featureSlug: string;
  featureName: string;
  canonicalFeatureSlug: string;
  displayTitle: string;
  eyebrow: string;
  tagline: string;
  industry: Industry | null;
  industryContext: FeatureDetailProfile["industryContexts"][number] | null;
  categoryHref: string;
  capabilityHref: string | null;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  methodologyHref: string;
  glance: {
    featureTypeLabel: string | null;
    primaryCapabilityName: string | null;
    typicalBuyerNeed: string | null;
    commonLimitation: string | null;
    researchedProductCount: number;
    evidenceItemCount: number;
    lastReviewedAt: string | null;
  };
  productRows: FeatureProductRow[];
  productCards: FeatureProductRow[];
  planRows: Array<{
    productSlug: string;
    productName: string;
    logo?: { src: string; alt: string } | null;
    entryPlan: string | null;
    featureStartsAt: string | null;
    notes: string | null;
  }>;
  screenshots: FeatureScreenshot[];
  videos: ProductMedia[];
  /** Comparative official demos — products without video are omitted (no blank cards). */
  seeInAction: FeatureSeeInActionCard[];
  relatedFeatures: Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;
  relatedCapabilities: Array<{
    slug: string;
    name: string;
    href: string;
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
  useCaseRelevance: FeatureDetailProfile["useCaseRelevance"];
  industryRelevance: FeatureDetailProfile["industryRelevance"];
  research: {
    productCount: number;
    evidenceItemCount: number;
    screenshotCount: number;
    planRecordCount: number;
    officialVideoCount: number;
    lastUpdated: string | null;
  };
  decisionFlow: Array<{ label: string; value: string }>;
  navItems: Array<{ id: string; label: string; icon?: string }>;
  visualKind: FeatureVisualKind;
  howItWorksCaption: string;
  workedExamples: Array<{
    id: string;
    title: string;
    situation: string;
    whatGoodLooksLike: string;
    whatToAskVendors: string;
  }>;
  stats: Array<{
    label: string;
    href?: string;
    icon?: "products" | "updated" | "independent" | "methodology";
  }>;
};

function mapAvailability(value: FeatureAvailability | undefined): FeatureSupportStatus {
  switch (value) {
    case "supported":
      return "supported";
    case "limited":
      return "limited";
    case "add-on":
      return "partially-supported";
    case "higher-plan-only":
      return "plan-dependent";
    case "not-supported":
      return "not-supported";
    default:
      return "not-evidenced";
  }
}

function toEvidenceCellStatus(
  status: FeatureSupportStatus,
): "supported" | "partial" | "unknown" | "not-supported" {
  if (status === "supported") return "supported";
  if (
    status === "partially-supported" ||
    status === "plan-dependent" ||
    status === "limited"
  ) {
    return "partial";
  }
  if (status === "not-supported") return "not-supported";
  return "unknown";
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

function humanizePlanSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
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

function confidenceFromEvidence(count: number): FeatureConfidence {
  if (count >= 3) return "High";
  if (count >= 2) return "Medium";
  if (count >= 1) return "Low";
  return "Unknown";
}

function depthFromSupport(
  status: FeatureSupportStatus,
  relatedSupported: number,
  relatedKnown: number,
): { label: FeatureDepthLabel; segments: number } {
  if (status === "not-evidenced") return { label: "Unknown", segments: 0 };
  if (status === "not-supported") return { label: "Limited", segments: 1 };
  if (status === "limited" || status === "partially-supported") {
    return { label: "Limited", segments: 2 };
  }
  if (status === "plan-dependent") {
    return relatedSupported >= 2
      ? { label: "Good", segments: 3 }
      : { label: "Limited", segments: 2 };
  }
  // supported
  if (relatedKnown >= 3 && relatedSupported >= 3) {
    return { label: "Strong", segments: 5 };
  }
  if (relatedSupported >= 2) return { label: "Strong", segments: 4 };
  if (relatedSupported >= 1) return { label: "Good", segments: 3 };
  return { label: "Good", segments: 3 };
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

function getFeatureSupport(productSlug: string, featureSlug: string) {
  const enrichment = loadEnrichment(productSlug);
  const fromEnrichment = enrichment?.featureSupport.find(
    (f) => f.featureSlug === featureSlug,
  );
  if (fromEnrichment) return fromEnrichment;

  const software = getSoftwareBySlug(productSlug);
  const rating = software?.featureRatings.find(
    (r) => r.featureSlug === featureSlug,
  );
  if (!rating || rating.available == null) return null;
  return {
    featureSlug,
    availability: rating.available
      ? ("supported" as const)
      : ("not-supported" as const),
    planSlugs: [] as string[],
    sourceIds: [] as string[],
    notes: undefined as string | undefined,
  };
}

function extractVerifiedLimit(notes: string | undefined): string | null {
  if (!notes) return null;
  // Only surface explicit numeric / unlimited claims from research notes.
  const unlimited = notes.match(/\bunlimited\b/i);
  if (unlimited) return "Unlimited (researched note)";
  const numeric = notes.match(
    /\b(\d+)\s+(pipelines?|workflows?|automations?|rules?)\b/i,
  );
  if (numeric) return `${numeric[1]} ${numeric[2]} (researched note)`;
  // Soft qualitative limit notes only when clearly about scale/limits.
  if (/\b(scale|limit|cap|gated)\b/i.test(notes)) {
    return notes.length > 120 ? `${notes.slice(0, 117)}…` : notes;
  }
  return null;
}

function statusDisplay(status: FeatureSupportStatus): string {
  switch (status) {
    case "supported":
      return "Supported";
    case "partially-supported":
      return "Partially supported";
    case "plan-dependent":
      return "Plan dependent";
    case "limited":
      return "Limited";
    case "not-supported":
      return "Not supported";
    default:
      return "Not verified";
  }
}

function buildFinderHref(profile: FeatureDetailProfile, industrySlug?: string) {
  const base = profile.finderHref ?? "/tools/crm-finder/";
  const params = new URLSearchParams();
  params.set("feature", profile.canonicalFeatureSlug);
  if (industrySlug) params.set("industry", industrySlug);
  return `${base}?${params.toString()}`;
}

/**
 * Build Feature Detail page model from profile + enrichment evidence.
 */
export function buildFeatureDetailModel(input: {
  featureSlug: string;
  industrySlug?: string;
}): FeatureDetailModel | null {
  const profile = getFeatureDetailProfile(input.featureSlug);
  if (!profile) return null;

  const industry = input.industrySlug
    ? getIndustryBySlug(input.industrySlug, { includeUnpublished: true }) ??
      null
    : null;
  if (input.industrySlug && !industry) return null;

  const industryContext =
    profile.industryContexts.find(
      (c) => c.industrySlug === input.industrySlug,
    ) ?? null;
  if (input.industrySlug && !industryContext) return null;

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

  let evidenceItemCount = 0;
  let screenshotCount = 0;
  let planRecordCount = 0;
  const screenshots: FeatureScreenshot[] = [];
  const mediaPool: ProductMedia[] = [];

  const productEntries = primaryProducts.map((product) => {
    const enrichment = loadEnrichment(product.slug);
    if (enrichment?.media?.length) {
      mediaPool.push(...enrichment.media);
    }
    const primary = getFeatureSupport(
      product.slug,
      profile.canonicalFeatureSlug,
    );
    const supportStatus = mapAvailability(primary?.availability);
    const minimumPlan =
      primary?.planSlugs?.[0] != null
        ? humanizePlanSlug(primary.planSlugs[0])
        : null;
    if (primary?.planSlugs?.length) planRecordCount += 1;

    const knownLimit = extractVerifiedLimit(primary?.notes);
    const relatedEvidence =
      enrichment?.featureSupport?.filter((f) =>
        [
          profile.canonicalFeatureSlug,
          ...profile.evaluationDimensions
            .map((d) => d.relatedFeatureSlug)
            .filter(Boolean),
        ].includes(f.featureSlug),
      ) ?? [];
    evidenceItemCount += enrichment?.featureSupport?.length ?? 0;

    const relatedStatuses = profile.evaluationDimensions
      .filter((d) => d.source === "related-feature" && d.relatedFeatureSlug)
      .map((d) =>
        mapAvailability(
          getFeatureSupport(product.slug, d.relatedFeatureSlug!)?.availability,
        ),
      );
    const relatedKnown = relatedStatuses.filter(
      (s) => s !== "not-evidenced",
    ).length;
    const relatedSupported = relatedStatuses.filter(
      (s) => s === "supported" || s === "plan-dependent",
    ).length;

    const depth = depthFromSupport(
      supportStatus,
      relatedSupported,
      relatedKnown,
    );

    const dimensionCells: Record<string, FeatureDimensionCell> = {};
    for (const dim of profile.evaluationDimensions) {
      if (dim.source === "primary") {
        const status = supportStatus;
        dimensionCells[dim.id] = {
          display: statusDisplay(status),
          status,
          evidenceNote: primary?.notes ?? null,
          evidence: null,
        };
      } else if (dim.source === "min-plan") {
        dimensionCells[dim.id] = {
          display: minimumPlan ?? "Not verified",
          status: minimumPlan ? "text" : "not-evidenced",
          evidenceNote: null,
          evidence: null,
        };
      } else if (dim.source === "notes-limit") {
        dimensionCells[dim.id] = {
          display: knownLimit ?? "Not verified",
          status: knownLimit ? "text" : "not-evidenced",
          evidenceNote: primary?.notes ?? null,
          evidence: null,
        };
      } else if (dim.source === "related-feature" && dim.relatedFeatureSlug) {
        const related = getFeatureSupport(product.slug, dim.relatedFeatureSlug);
        const status = mapAvailability(related?.availability);
        dimensionCells[dim.id] = {
          display: statusDisplay(status),
          status,
          evidenceNote: related?.notes ?? null,
          evidence: null,
        };
      }
    }

    const productShots = (enrichment?.screenshots ?? []).filter((s) =>
      screenshotMatches(s, profile.screenshotMatchTerms),
    );
    screenshotCount += enrichment?.screenshots?.length ?? 0;
    for (const shot of productShots.slice(0, 3)) {
      const tabIds = profile.screenshotTabs
        .filter((tab) => screenshotMatches(shot, tab.matchTerms))
        .map((t) => t.id);
      screenshots.push({
        productSlug: product.slug,
        productName: product.name,
        id: shot.id,
        src: shot.src,
        alt: shot.alt,
        caption: shot.caption,
        source: shot.source,
        checkedAt: shot.checkedAt,
        tabIds: tabIds.length > 0 ? tabIds : ["all"],
      });
    }

    const mediaCtxBase = {
      featureSlug: profile.canonicalFeatureSlug,
      pageFeatureSlug: profile.slug,
      capabilitySlug: profile.primaryCapabilitySlug ?? null,
      relatedFeatureSlugs: profile.relatedFeatureSlugs ?? [],
      relatedRequirementSlugs: (profile.requirementMappings ?? [])
        .map((r) => r.requirementSlug)
        .filter((s): s is string => Boolean(s)),
      evaluationDimensionIds: profile.evaluationDimensions.map((d) => d.id),
    };

    const featureVideo = selectFeatureDeepDiveVideo(enrichment?.media ?? [], {
      ...mediaCtxBase,
      productSlug: product.slug,
    });
    const productVideos = selectFeaturePageVideos(
      enrichment?.media ?? [],
      { ...mediaCtxBase, productSlug: product.slug },
      { limit: 4, allowBrandPromoFallback: false },
    );
    const productSources = loadManualSources(product.slug);
    const sourceCount =
      (primary?.sourceIds?.length ?? 0) +
      productSources.filter((s) => s.status !== "rejected").length;

    // Attach dimension-scoped evidence (does not change display/status).
    for (const dim of profile.evaluationDimensions) {
      const cell = dimensionCells[dim.id];
      if (!cell) continue;
      const related =
        dim.source === "related-feature" && dim.relatedFeatureSlug
          ? getFeatureSupport(product.slug, dim.relatedFeatureSlug)
          : null;
      const supportSourceIds =
        dim.source === "related-feature"
          ? (related?.sourceIds ?? [])
          : (primary?.sourceIds ?? []);
      const attachScreenshots =
        dim.source === "primary" || dim.source === "related-feature";
      cell.evidence = buildMatrixCellEvidence({
        dim,
        featureSlug: profile.canonicalFeatureSlug,
        supportSourceIds,
        allSources: productSources,
        productVideos,
        productScreenshots: productShots,
        attachScreenshots,
      });
    }

    const strengths: string[] = [];
    if (supportStatus === "supported") {
      strengths.push(`${profile.name} researched as supported`);
    }
    if (supportStatus === "plan-dependent" && minimumPlan) {
      strengths.push(`Available from ${minimumPlan} (researched)`);
    }
    for (const dim of profile.evaluationDimensions) {
      const cell = dimensionCells[dim.id];
      if (cell?.status === "supported") {
        strengths.push(`${dim.name}: supported`);
      }
    }

    const limitations: string[] = [];
    if (supportStatus === "plan-dependent") {
      limitations.push("Feature may require a higher plan");
    }
    if (supportStatus === "limited" || supportStatus === "partially-supported") {
      limitations.push("Support is limited or plan/add-on dependent");
    }
    if (knownLimit) limitations.push(knownLimit);
    if (primary?.notes && !knownLimit) {
      // Prefer researched notes for feature-specific caveats.
      limitations.push(
        primary.notes.length > 140
          ? `${primary.notes.slice(0, 137)}…`
          : primary.notes,
      );
    }
    for (const dim of profile.evaluationDimensions) {
      const cell = dimensionCells[dim.id];
      if (
        cell &&
        (cell.status === "limited" ||
          cell.status === "plan-dependent" ||
          cell.status === "partially-supported")
      ) {
        limitations.push(`${dim.name}: ${cell.display}`);
      }
    }

    const howItWorks =
      primary?.notes != null
        ? publicCopy(primary.notes)
        : supportStatus === "supported"
          ? `${product.name} has researched support for ${profile.name.toLowerCase()}. See the comparison matrix for related dimensions.`
          : supportStatus === "plan-dependent"
            ? `${product.name} support for ${profile.name.toLowerCase()} is researched as plan-dependent${minimumPlan ? ` (from ${minimumPlan})` : ""}.`
            : supportStatus === "not-evidenced"
              ? `We have not verified ${profile.name.toLowerCase()} support for ${product.name} yet.`
              : null;

    const evidenceCount =
      (primary?.sourceIds?.length ?? 0) + relatedEvidence.length;
    const sortKey =
      (supportStatus === "supported"
        ? 50
        : supportStatus === "plan-dependent"
          ? 40
          : supportStatus === "partially-supported" ||
              supportStatus === "limited"
            ? 30
            : supportStatus === "not-supported"
              ? 10
              : 0) +
      depth.segments * 2 +
      evidenceCount;
    // Intentionally do not add videoCount to sortKey — video presence must not alter scoring.

    return {
      row: {
        slug: product.slug,
        name: product.name,
        logo: product.logo,
        supportStatus,
        depthLabel: depth.label,
        depthSegments: depth.segments,
        minimumPlan,
        knownLimit,
        evidenceConfidence: confidenceFromEvidence(evidenceCount),
        evidenceCount,
        sourceCount,
        screenshotCount: productShots.length,
        videoCount: productVideos.length,
        featureVideo,
        strengths: [...new Set(strengths)].slice(0, 4),
        limitations: [...new Set(limitations)].slice(0, 4),
        bestFor: productBestFor(product),
        howItWorks,
        pricingTeaser: pricingTeaser(product),
        dimensionCells,
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
      } satisfies FeatureProductRow,
      sortKey,
    };
  });

  const ranked = [...productEntries]
    .sort((a, b) => {
      if (b.sortKey !== a.sortKey) return b.sortKey - a.sortKey;
      return a.row.name.localeCompare(b.row.name);
    })
    .map((e) => e.row);

  const withEvidence = ranked.filter((r) => r.supportStatus !== "not-evidenced");
  const scorecardSource = withEvidence.length >= 4 ? withEvidence : ranked;
  const productRows = scorecardSource.slice(0, 10);
  const productCards = productRows
    .filter((r) => r.supportStatus !== "not-evidenced")
    .slice(0, 6);

  const planRows = productCards.map((p) => ({
    productSlug: p.slug,
    productName: p.name,
    logo: p.logo,
    entryPlan: p.minimumPlan,
    featureStartsAt: p.minimumPlan,
    notes:
      p.supportStatus === "plan-dependent"
        ? "Higher-plan gated (researched)"
        : p.knownLimit,
  }));

  const relatedFeatures = profile.relatedFeatureSlugs
    .map((slug) => {
      const relatedProfile = getFeatureDetailProfile(slug);
      if (!relatedProfile) return null;
      return {
        slug: relatedProfile.slug,
        name: relatedProfile.name ?? featureName(slug),
        href: `/features/${relatedProfile.slug}/`,
        description: relatedProfile.tagline ?? null,
      };
    })
    .filter(Boolean)
    .slice(0, 8) as Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;

  const relatedCapabilities = (
    profile.relatedCapabilitySlugs.length
      ? profile.relatedCapabilitySlugs
      : profile.primaryCapabilitySlug
        ? [profile.primaryCapabilitySlug]
        : []
  )
    .map((slug) => {
      const cap = industry
        ? getIndustryCapabilityProfile(industry.slug, slug)
        : getIndustryCapabilityProfile("financial-services", slug);
      if (!cap) return null;
      return {
        slug,
        name: cap.displayName ?? featureName(slug),
        href: `/industries/${cap.industrySlug}/capabilities/${slug}/`,
      };
    })
    .filter(Boolean) as Array<{ slug: string; name: string; href: string }>;

  const comparisons = allCategoryComparisons
    .filter((c) =>
      c.productSlugs.some((slug) => productRows.some((p) => p.slug === slug)),
    )
    .slice(0, 6)
    .map((comparison) => ({
      href: `/compare/${comparison.slug}/#${profile.canonicalFeatureSlug}`,
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
    industry?.metadata.updatedAt,
    industry?.metadata.reviewedAt,
    ...primaryProducts.map((s) => s.lastVerifiedAt),
  ].filter(Boolean) as string[];
  const lastReviewedAt = lastReviewedCandidates.sort().at(-1) ?? null;

  const displayTitle =
    industryContext?.displayTitleOverride ??
    profile.displayTitle ??
    `${profile.name} in CRM Software`;
  const eyebrow =
    industryContext?.eyebrowOverride ??
    profile.eyebrow ??
    "CRM feature";
  const tagline =
    industryContext?.taglineOverride ??
    profile.tagline ??
    `Compare CRM support for ${profile.name.toLowerCase()}.`;

  const useCaseRelevance = industryContext?.useCaseRelationships?.length
    ? industryContext.useCaseRelationships
    : profile.useCaseRelevance;

  const navItems = [
    { id: "overview", label: "Overview", icon: "overview" },
    ...(profile.overview
      ? [{ id: "overview-body", label: "Fit snapshot", icon: "overview" as const }]
      : []),
    { id: "definition", label: "What it is", icon: "features" },
    ...(profile.challenges.length
      ? [{ id: "challenges", label: "Challenges", icon: "choose" as const }]
      : []),
    ...(profile.outcomes.length
      ? [{ id: "outcomes", label: "Outcomes", icon: "star" as const }]
      : []),
    ...(profile.workflowSteps.length || profile.workflowVisual
      ? [{ id: "workflow", label: "Workflow", icon: "puzzle" as const }]
      : [{ id: "how-it-works", label: "How it works", icon: "puzzle" as const }]),
    { id: "examples", label: "Examples", icon: "use-cases" },
    { id: "need", label: "Do you need it?", icon: "choose" },
    { id: "criteria", label: "Evaluation criteria", icon: "puzzle" },
    ...(selectFeaturePageVideos(mediaPool, {
      featureSlug: profile.canonicalFeatureSlug,
      pageFeatureSlug: profile.slug,
      capabilitySlug: profile.primaryCapabilitySlug ?? null,
      relatedFeatureSlugs: profile.relatedFeatureSlugs ?? [],
      relatedRequirementSlugs: (profile.requirementMappings ?? [])
        .map((r) => r.requirementSlug)
        .filter((s): s is string => Boolean(s)),
      evaluationDimensionIds: profile.evaluationDimensions.map((d) => d.id),
    }).length > 0
      ? [{ id: "see-in-action", label: "See in action", icon: "explore" as const }]
      : []),
    { id: "support", label: "Product support", icon: "star" },
    { id: "matrix", label: "Comparison", icon: "comparisons" },
    { id: "plans", label: "Plan availability", icon: "pricing" },
    { id: "implementation", label: "Implementation", icon: "features" },
    { id: "feature-evidence", label: "Feature evidence", icon: "methodology" },
    ...(screenshots.length > 0
      ? [{ id: "screenshots", label: "Screenshots", icon: "explore" as const }]
      : []),
    { id: "use-cases", label: "Use cases", icon: "use-cases" },
    { id: "questions", label: "Vendor questions", icon: "faq" },
    { id: "methodology", label: "Evidence", icon: "methodology" },
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  const visualKind = featureVisualKindForSlug(profile.slug);
  const workedExamples =
    profile.workedExamples?.length > 0
      ? profile.workedExamples
      : workedExamplesForFeature(profile.slug, profile.name);

  const capabilityHref =
    profile.primaryCapabilityHref ??
    (profile.primaryCapabilitySlug
      ? relatedCapabilities.find(
          (c) => c.slug === profile.primaryCapabilitySlug,
        )?.href ?? null
      : null);

  const mediaCtx = {
    featureSlug: profile.canonicalFeatureSlug,
    pageFeatureSlug: profile.slug,
    capabilitySlug: profile.primaryCapabilitySlug ?? null,
    relatedFeatureSlugs: profile.relatedFeatureSlugs ?? [],
    relatedRequirementSlugs: (profile.requirementMappings ?? [])
      .map((r) => r.requirementSlug)
      .filter((s): s is string => Boolean(s)),
    evaluationDimensionIds: profile.evaluationDimensions.map((d) => d.id),
  };

  const dimensionLabelById = new Map(
    profile.evaluationDimensions.map((d) => [d.id, d.name]),
  );

  const seeInAction = selectFeatureSeeInActionCards({
    mediaPool,
    products: (productCards.length >= 2
      ? productCards
      : productRows.slice(0, 5)
    ).map((p) => ({ slug: p.slug, name: p.name, logo: p.logo })),
    ctx: mediaCtx,
    dimensionLabelById,
    limit: 4,
  });

  const videos = selectFeaturePageVideos(mediaPool, mediaCtx, {
    limit: 6,
    allowBrandPromoFallback: false,
  });

  return {
    profile,
    featureSlug: profile.slug,
    featureName: profile.name,
    canonicalFeatureSlug: profile.canonicalFeatureSlug,
    displayTitle,
    eyebrow,
    tagline,
    industry,
    industryContext,
    categoryHref: `/categories/${categorySlug}/`,
    capabilityHref,
    finderHref: buildFinderHref(profile, industry?.slug),
    calculatorHref: profile.calculatorHref ?? "/tools/crm-cost-calculator/",
    compareHref: profile.compareHref ?? "/compare/",
    methodologyHref: profile.methodologyHref ?? COMPANY_ROUTES.methodology,
    glance: {
      featureTypeLabel: profile.featureTypeLabel ?? profile.featureType,
      primaryCapabilityName: profile.primaryCapabilityName ?? null,
      typicalBuyerNeed: profile.typicalBuyerNeed ?? null,
      commonLimitation: profile.commonLimitation ?? null,
      researchedProductCount: productRows.length,
      evidenceItemCount,
      lastReviewedAt,
    },
    productRows,
    productCards: productCards.length >= 2 ? productCards : productRows.slice(0, 5),
    planRows,
    screenshots: screenshots.slice(0, 12),
    videos,
    seeInAction,
    relatedFeatures,
    relatedCapabilities,
    comparisons,
    useCaseRelevance,
    industryRelevance: profile.industryRelevance,
    research: {
      productCount: productRows.length,
      evidenceItemCount,
      screenshotCount,
      planRecordCount,
      officialVideoCount: videos.length,
      lastUpdated: lastReviewedAt,
    },
    decisionFlow: [
      {
        label: "Capability",
        value: profile.primaryCapabilityName ?? "CRM capability",
      },
      {
        label: "Requirement",
        value: profile.relatedRequirementName ?? "Buyer requirement",
      },
      { label: "Feature", value: profile.name },
      {
        label: "Products",
        value: `${productRows.length} researched`,
      },
      {
        label: "Evidence",
        value: `${evidenceItemCount} records`,
      },
    ],
    navItems,
    visualKind,
    howItWorksCaption: featureHowItWorksCaption(profile.name, visualKind),
    workedExamples,
    stats: [
      {
        label: `${productRows.length} CRM products researched`,
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

export function getFeatureDetailPage(
  featureSlug: string,
  industrySlug?: string,
): FeatureDetailModel | null {
  return buildFeatureDetailModel({ featureSlug, industrySlug });
}

/** Re-export helper for EvidenceMark-compatible mapping. */
export { toEvidenceCellStatus };
