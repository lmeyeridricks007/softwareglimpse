import type {
  FeatureAvailability,
  Industry,
  ProductMedia,
  RequirementDetailProfile,
  Software,
} from "@/domain";
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
import { getRequirementDetailProfile } from "@/data/requirement-detail";
import { loadEnrichment } from "@/data/research/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import {
  selectRequirementPageVideos,
  selectRequirementSeeSupportCards,
  type RequirementSeeSupportCard,
} from "@/services/product-media/requirement-page-media";
import {
  REQUIREMENT_EVIDENCE_METHODOLOGY,
} from "@/services/evidence-explorer/build-from-requirement";
import { buildRequirementDemoTest } from "@/services/requirement-detail/demo-test";
import {
  buildRequirementScorecardEvidenceMap,
  type RequirementCriterionCellEvidence,
} from "@/services/requirement-detail/scorecard-cell-evidence";
import {
  type RequirementConfidence,
  type RequirementFeatureCellStatus,
  type RequirementFitStatus,
} from "./labels";

export type {
  RequirementConfidence,
  RequirementFeatureCellStatus,
  RequirementFitStatus,
} from "./labels";
export { fitStatusLabel } from "./labels";
export type { RequirementSeeSupportCard };
export type { RequirementCriterionCellEvidence };

export type RequirementProductRow = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  fitStatus: RequirementFitStatus;
  /** Evidenced core features satisfied / total core features with evidence. */
  coreSatisfied: number;
  coreTotal: number;
  supportingSatisfied: number;
  supportingTotal: number;
  /** Coverage fraction 0–1 among evidenced linked features — not a fake 4.7/5. */
  coverageRatio: number | null;
  minimumPlan: string | null;
  evidenceConfidence: RequirementConfidence;
  evidenceCount: number;
  /** Informational evidence breakdown — never used for fit scoring. */
  documentationCount: number;
  screenshotCount: number;
  officialVideoCount: number;
  strengths: string[];
  limitations: string[];
  keyStrength: string | null;
  featureCells: Record<string, RequirementFeatureCellStatus>;
  criterionCells: Record<
    string,
    RequirementFitStatus | "insufficient-evidence"
  >;
  bestFor: string | null;
  reviewHref: string;
  compareHref: string;
  pricingHref: string;
};

export type RequirementScreenshot = {
  productSlug: string;
  productName: string;
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
};

export type RequirementSummaryPick = {
  id: string;
  label: string;
  product: RequirementProductRow | null;
};

export type RequirementVerificationGap = {
  productSlug: string;
  productName: string;
  criterionId: string;
  criterionName: string;
  note: string;
};

export type RequirementDetailModel = {
  profile: RequirementDetailProfile;
  requirementSlug: string;
  requirementName: string;
  displayTitle: string;
  eyebrow: string;
  tagline: string;
  shortAnswer: string | null;
  industry: Industry | null;
  industryContext: RequirementDetailProfile["industryContexts"][number] | null;
  categoryHref: string;
  capabilityHref: string | null;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  methodologyHref: string;
  demoChecklistHref: string;
  implementationPlannerHref: string;
  requirementsBuilderHref: string;
  methodologyNote: string;
  glance: {
    requirementTypeLabel: string | null;
    primaryCapabilityName: string | null;
    typicalImportanceLabel: string | null;
    coreFeatureCount: number;
    supportingFeatureCount: number;
    researchedProductCount: number;
    evidenceItemCount: number;
    lastReviewedAt: string | null;
  };
  coreFeatures: RequirementDetailProfile["featureLinks"];
  supportingFeatures: RequirementDetailProfile["featureLinks"];
  summaryPicks: RequirementSummaryPick[];
  productRows: RequirementProductRow[];
  productCards: RequirementProductRow[];
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    priorities: string[];
    icon?: string;
    product: RequirementProductRow | null;
  }>;
  screenshots: RequirementScreenshot[];
  videos: ProductMedia[];
  seeSupportCards: RequirementSeeSupportCard[];
  deepDiveMediaByProduct: Record<string, RequirementSeeSupportCard | null>;
  verificationGaps: RequirementVerificationGap[];
  demoVerificationSteps: string[];
  demoTest: import("@/domain").RequirementDemoTest;
  sideBySide: {
    left: RequirementSeeSupportCard | null;
    right: RequirementSeeSupportCard | null;
    interpretation: string | null;
  } | null;
  videoCriteriaLabels: string[];
  useCaseLinks: RequirementDetailProfile["useCaseLinks"];
  relatedRequirements: Array<{
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
  relatedFeatures: Array<{
    slug: string;
    name: string;
    href: string;
    relationship: string;
    rationale: string;
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
  research: {
    productCount: number;
    featureCount: number;
    evidenceItemCount: number;
    screenshotCount: number;
    officialVideoCount: number;
    lastUpdated: string | null;
  };
  decisionFlow: Array<{ label: string; value: string }>;
  navItems: Array<{ id: string; label: string; icon?: string }>;
  matrixFeatures: Array<{ slug: string; name: string }>;
  /** productSlug::criterionId → cell evidence for Why? drawers. */
  scorecardEvidence: Record<string, RequirementCriterionCellEvidence>;
};

function mapAvailability(
  value: FeatureAvailability | undefined,
): RequirementFeatureCellStatus {
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

function cellScore(status: RequirementFeatureCellStatus): number | null {
  switch (status) {
    case "supported":
      return 1;
    case "plan-dependent":
      return 0.75;
    case "partially-supported":
    case "limited":
      return 0.4;
    case "not-supported":
      return 0;
    default:
      return null;
  }
}

function fitFromCoverage(
  ratio: number | null,
  evidencedCount: number,
  hasExplicitNo: boolean,
): RequirementFitStatus {
  if (evidencedCount < 1) return "insufficient-evidence";
  if (hasExplicitNo && (ratio == null || ratio < 0.35)) {
    return "does-not-satisfy";
  }
  if (ratio == null) return "insufficient-evidence";
  if (ratio >= 0.85) return "strong-support";
  if (ratio >= 0.65) return "good-support";
  if (ratio >= 0.4) return "partial-support";
  if (ratio > 0) return "limited-support";
  return hasExplicitNo ? "does-not-satisfy" : "insufficient-evidence";
}

function criterionFit(
  statuses: RequirementFeatureCellStatus[],
): RequirementFitStatus {
  const scores = statuses.map(cellScore).filter((s): s is number => s != null);
  if (scores.length === 0) return "insufficient-evidence";
  const ratio = scores.reduce((a, b) => a + b, 0) / scores.length;
  const hasNo = statuses.includes("not-supported");
  return fitFromCoverage(ratio, scores.length, hasNo);
}

function confidenceFromCount(count: number): RequirementConfidence {
  if (count >= 4) return "High";
  if (count >= 2) return "Medium";
  if (count >= 1) return "Low";
  return "Unknown";
}

function productBestFor(software: Software): string | null {
  return firstPublicCopy([
    software.bestFor[0],
    loadAssessment(software.slug)?.bestFor?.[0],
    software.shortDescription,
  ]);
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
): number | null {
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
  return criterion.score;
}

function featurePageHref(
  link: RequirementDetailProfile["featureLinks"][number],
) {
  const pageSlug = link.featurePageSlug ?? link.featureSlug;
  const profile = getFeatureDetailProfile(pageSlug);
  if (profile) return `/features/${profile.slug}/`;
  // custom-pipelines maps to multiple-pipelines page
  if (link.featureSlug === "custom-pipelines") {
    return "/features/multiple-pipelines/";
  }
  return `/categories/crm/`;
}

function buildFinderHref(
  profile: RequirementDetailProfile,
  industrySlug?: string,
) {
  const base = profile.finderHref ?? "/tools/crm-finder/";
  const params = new URLSearchParams();
  params.set("requirement", profile.slug);
  const required = profile.featureLinks
    .filter((f) => f.relationship === "required")
    .map((f) => f.featureSlug);
  if (required[0]) params.set("feature", required[0]);
  if (industrySlug) params.set("industry", industrySlug);
  return `${base}?${params.toString()}`;
}

function pickDistinct(
  candidates: RequirementProductRow[],
  used: Set<string>,
): RequirementProductRow | null {
  for (const row of candidates) {
    if (!used.has(row.slug)) {
      used.add(row.slug);
      return row;
    }
  }
  return candidates[0] ?? null;
}

/**
 * Build Requirement Detail page model.
 * Fit derives from linked feature enrichment — never invented winners.
 */
export function buildRequirementDetailModel(input: {
  requirementSlug: string;
  industrySlug?: string;
}): RequirementDetailModel | null {
  const profile = getRequirementDetailProfile(input.requirementSlug);
  if (!profile) return null;

  const industry = input.industrySlug
    ? (getIndustryBySlug(input.industrySlug, { includeUnpublished: true }) ??
      null)
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

  const coreFeatures = profile.featureLinks.filter(
    (f) =>
      f.relationship === "required" || f.relationship === "strongly-supporting",
  );
  const supportingFeatures = profile.featureLinks.filter(
    (f) => f.relationship === "supporting" || f.relationship === "optional",
  );

  const matrixSlugs =
    profile.matrixFeatureSlugs.length > 0
      ? profile.matrixFeatureSlugs
      : profile.featureLinks.map((f) => f.featureSlug);

  let evidenceItemCount = 0;
  let screenshotCount = 0;
  const screenshots: RequirementScreenshot[] = [];
  const mediaPool: ProductMedia[] = [];

  const productEntries = primaryProducts.map((product) => {
    const enrichment = loadEnrichment(product.slug);
    if (enrichment?.media?.length) {
      mediaPool.push(...enrichment.media);
    }
    evidenceItemCount += enrichment?.featureSupport?.length ?? 0;

    const featureCells: Record<string, RequirementFeatureCellStatus> = {};
    for (const slug of matrixSlugs) {
      featureCells[slug] = mapAvailability(
        getFeatureSupport(product.slug, slug)?.availability,
      );
    }

    const coreStatuses = coreFeatures.map(
      (f) =>
        featureCells[f.featureSlug] ??
        mapAvailability(
          getFeatureSupport(product.slug, f.featureSlug)?.availability,
        ),
    );
    const supportingStatuses = supportingFeatures.map(
      (f) =>
        featureCells[f.featureSlug] ??
        mapAvailability(
          getFeatureSupport(product.slug, f.featureSlug)?.availability,
        ),
    );

    const coreScores = coreStatuses
      .map(cellScore)
      .filter((s): s is number => s != null);
    const supportingScores = supportingStatuses
      .map(cellScore)
      .filter((s): s is number => s != null);

    const coreSatisfied = coreStatuses.filter(
      (s) => s === "supported" || s === "plan-dependent",
    ).length;
    const supportingSatisfied = supportingStatuses.filter(
      (s) => s === "supported" || s === "plan-dependent",
    ).length;

    const coreTotalEvidenced = coreStatuses.filter(
      (s) => s !== "not-evidenced",
    ).length;
    const supportingTotalEvidenced = supportingStatuses.filter(
      (s) => s !== "not-evidenced",
    ).length;

    const allScores = [...coreScores, ...supportingScores.map((s) => s * 0.6)];
    const weightSum = coreScores.length + supportingScores.length * 0.6;
    const coverageRatio =
      weightSum > 0
        ? Math.round((allScores.reduce((a, b) => a + b, 0) / weightSum) * 100) /
          100
        : null;

    const hasExplicitNo = [...coreStatuses, ...supportingStatuses].includes(
      "not-supported",
    );
    const fitStatus = fitFromCoverage(
      coverageRatio,
      coreScores.length + supportingScores.length,
      hasExplicitNo,
    );

    const criterionCells: RequirementProductRow["criterionCells"] = {};
    for (const criterion of profile.evaluationCriteria) {
      const statuses = criterion.featureSlugs.map(
        (slug) =>
          featureCells[slug] ??
          mapAvailability(getFeatureSupport(product.slug, slug)?.availability),
      );
      criterionCells[criterion.id] = criterionFit(statuses);
    }

    let minimumPlan: string | null = null;
    for (const link of coreFeatures) {
      const support = getFeatureSupport(product.slug, link.featureSlug);
      if (support?.planSlugs?.[0]) {
        minimumPlan = humanizePlanSlug(support.planSlugs[0]);
        if (
          support.availability === "higher-plan-only" ||
          link.relationship === "required"
        ) {
          break;
        }
      }
    }

    const strengths: string[] = [];
    for (const link of profile.featureLinks) {
      const status = featureCells[link.featureSlug];
      if (status === "supported") {
        strengths.push(`${link.name}: supported`);
      } else if (status === "plan-dependent") {
        strengths.push(`${link.name}: available on higher plans`);
      }
    }

    const limitations: string[] = [];
    for (const link of profile.featureLinks) {
      const status = featureCells[link.featureSlug];
      const support = getFeatureSupport(product.slug, link.featureSlug);
      if (status === "plan-dependent") {
        limitations.push(`${link.name} may require a higher plan`);
      } else if (status === "limited" || status === "partially-supported") {
        limitations.push(`${link.name}: limited / plan-dependent`);
      } else if (status === "not-supported") {
        limitations.push(`${link.name}: not evidenced as supported`);
      }
      if (support?.notes) {
        const note = publicCopy(support.notes) ?? support.notes;
        limitations.push(note);
      }
    }

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

    const evidenceCount = profile.featureLinks.reduce((sum, link) => {
      const support = getFeatureSupport(product.slug, link.featureSlug);
      return sum + (support?.sourceIds?.length ?? 0);
    }, 0);

    const mediaCtxBase = {
      requirementSlug: profile.slug,
      industrySlug: industry?.slug ?? null,
      capabilitySlug: profile.primaryCapabilitySlug ?? null,
      coreFeatureSlugs: coreFeatures.map((f) => f.featureSlug),
      supportingFeatureSlugs: supportingFeatures.map((f) => f.featureSlug),
      criterionIds: profile.evaluationCriteria.map((c) => c.id),
      useCaseSlugs: (profile.useCaseLinks ?? []).map((u) => u.id),
      requireStrongMatch: true as const,
    };
    const productVideos = selectRequirementPageVideos(
      enrichment?.media ?? [],
      { ...mediaCtxBase, productSlug: product.slug },
      { limit: 3 },
    );
    const documentationCount = evidenceCount;
    const productScreenshotCount = productShots.length;
    const officialVideoCount = productVideos.length;

    const sortKey =
      (coverageRatio ?? 0) * 100 +
      coreSatisfied * 5 +
      supportingSatisfied +
      evidenceCount * 0.1;

    return {
      row: {
        slug: product.slug,
        name: product.name,
        logo: product.logo,
        fitStatus,
        coreSatisfied,
        coreTotal:
          coreTotalEvidenced > 0 ? coreTotalEvidenced : coreFeatures.length,
        supportingSatisfied,
        supportingTotal:
          supportingTotalEvidenced > 0
            ? supportingTotalEvidenced
            : supportingFeatures.length,
        coverageRatio,
        minimumPlan,
        evidenceConfidence: confidenceFromCount(evidenceCount),
        evidenceCount,
        documentationCount,
        screenshotCount: productScreenshotCount,
        officialVideoCount,
        strengths: [...new Set(strengths)].slice(0, 4),
        limitations: [...new Set(limitations)].slice(0, 4),
        keyStrength: strengths[0] ?? productBestFor(product),
        featureCells,
        criterionCells,
        bestFor: productBestFor(product),
        reviewHref: `/software/${product.slug}/`,
        compareHref: compareHrefForProduct(
          product.slug,
          allCategoryComparisons,
        ),
        pricingHref: `/software/${product.slug}/#pricing`,
      } satisfies RequirementProductRow,
      sortKey,
    };
  });

  const ranked = [...productEntries]
    .sort((a, b) => {
      if (b.sortKey !== a.sortKey) return b.sortKey - a.sortKey;
      return a.row.name.localeCompare(b.row.name);
    })
    .map((e) => e.row);

  const withEvidence = ranked.filter(
    (r) => r.fitStatus !== "insufficient-evidence",
  );
  const productRows = (withEvidence.length >= 4 ? withEvidence : ranked).slice(
    0,
    10,
  );
  const productCards = productRows
    .filter((r) => r.fitStatus !== "insufficient-evidence")
    .slice(0, 6);

  const eligible = productRows.filter(
    (p) =>
      p.fitStatus === "strong-support" ||
      p.fitStatus === "good-support" ||
      p.fitStatus === "partial-support",
  );
  const used = new Set<string>();
  const summaryPicks: RequirementSummaryPick[] = profile.summarySlots.map(
    (slot) => {
      let pool = [...eligible];
      if (slot.selection === "best-simplicity") {
        pool.sort(
          (a, b) =>
            (approvedCriterionScore(b.slug, "ease-of-use") ?? -1) -
            (approvedCriterionScore(a.slug, "ease-of-use") ?? -1),
        );
      } else if (slot.selection === "best-complex") {
        pool.sort(
          (a, b) =>
            (approvedCriterionScore(b.slug, "customization") ?? -1) -
            (approvedCriterionScore(a.slug, "customization") ?? -1),
        );
      } else if (slot.selection === "best-value") {
        pool.sort(
          (a, b) =>
            (approvedCriterionScore(b.slug, "value-for-money") ?? -1) -
            (approvedCriterionScore(a.slug, "value-for-money") ?? -1),
        );
      } else {
        pool.sort((a, b) => (b.coverageRatio ?? 0) - (a.coverageRatio ?? 0));
      }
      return {
        id: slot.id,
        label: slot.label,
        product: pickDistinct(pool, used),
      };
    },
  );

  const scenarios = profile.scenarios.map((scenario) => {
    let pool = [...productRows];
    if (scenario.focusCriterionSlug) {
      pool.sort(
        (a, b) =>
          (approvedCriterionScore(b.slug, scenario.focusCriterionSlug!) ?? -1) -
          (approvedCriterionScore(a.slug, scenario.focusCriterionSlug!) ?? -1),
      );
    } else {
      pool.sort((a, b) => (b.coverageRatio ?? 0) - (a.coverageRatio ?? 0));
    }
    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.description,
      priorities: scenario.priorities,
      icon: scenario.icon,
      product: pool[0] ?? null,
    };
  });

  const relatedFeatures = profile.featureLinks.map((link) => ({
    slug: link.featureSlug,
    name: link.name,
    href: featurePageHref(link),
    relationship: link.relationship,
    rationale: link.rationale,
  }));

  const relatedRequirements = profile.relatedRequirementSlugs.map((slug) => {
    const related = getRequirementDetailProfile(slug);
    return {
      slug,
      name: related?.name ?? featureName(slug),
      href: related ? `/requirements/${related.slug}/` : `/requirements/`,
      description: related?.tagline ?? null,
    };
  });

  const relatedCapabilities = (
    profile.relatedCapabilitySlugs.length
      ? profile.relatedCapabilitySlugs
      : profile.primaryCapabilitySlug
        ? [profile.primaryCapabilitySlug]
        : []
  )
    .map((slug) => {
      const industrySlug = industry?.slug ?? "financial-services";
      const cap = getIndustryCapabilityProfile(industrySlug, slug);
      if (cap) {
        return {
          slug,
          name: cap.displayName ?? featureName(slug),
          href: `/industries/${cap.industrySlug}/capabilities/${slug}/`,
        };
      }
      // Fall back to global capability hubs (CRM-CAP).
      const globalSlug =
        slug === "security-administration"
          ? "security"
          : slug === "reporting" &&
              profile.primaryCapabilityHref?.includes("forecasting")
            ? "forecasting"
            : slug;
      return {
        slug: globalSlug,
        name: featureName(globalSlug),
        href: `/capabilities/${globalSlug}/`,
      };
    })
    .filter(Boolean) as Array<{ slug: string; name: string; href: string }>;

  const comparisons = allCategoryComparisons
    .filter((c) =>
      c.productSlugs.some((slug) => productRows.some((p) => p.slug === slug)),
    )
    .slice(0, 6)
    .map((comparison) => ({
      href: `/compare/${comparison.slug}/?requirement=${profile.slug}`,
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
    profile.name;
  const eyebrow =
    industryContext?.eyebrowOverride ?? profile.eyebrow ?? "CRM requirement";
  const tagline =
    industryContext?.taglineOverride ??
    profile.tagline ??
    `Compare CRM support for: ${profile.name.toLowerCase()}.`;

  const useCaseLinks = industryContext?.useCaseRelationships?.length
    ? industryContext.useCaseRelationships
    : profile.useCaseLinks;

  const capabilityHref =
    profile.primaryCapabilityHref ??
    relatedCapabilities.find((c) => c.slug === profile.primaryCapabilitySlug)
      ?.href ??
    null;

  const navItems = [
    { id: "overview", label: "Overview", icon: "overview" },
    ...(profile.overview
      ? [
          { id: "overview-body", label: "Overview", icon: "overview" },
          ...(profile.challenges.length > 0
            ? [{ id: "challenges", label: "Challenges", icon: "features" }]
            : []),
          { id: "how-it-helps", label: "How it helps", icon: "puzzle" },
          ...(profile.acceptanceNeeds.length > 0
            ? [
                {
                  id: "acceptance",
                  label: "Acceptance criteria",
                  icon: "choose",
                },
              ]
            : []),
          ...(profile.workflowSteps.length > 0
            ? [
                {
                  id: "eval-workflow",
                  label: "How to validate",
                  icon: "methodology",
                },
              ]
            : []),
        ]
      : []),
    { id: "short-answer", label: "The short answer", icon: "star" },
    { id: "need", label: "Do you need this?", icon: "choose" },
    { id: "why", label: "Why it matters", icon: "features" },
    { id: "fit-model", label: "Where it fits", icon: "puzzle" },
    { id: "criteria", label: "What good looks like", icon: "features" },
    { id: "features", label: "Required features", icon: "puzzle" },
    { id: "see-support", label: "See support", icon: "explore" },
    { id: "support", label: "Product fit", icon: "star" },
    { id: "scorecard", label: "Scorecard", icon: "comparisons" },
    { id: "matrix", label: "Comparison", icon: "comparisons" },
    { id: "plans", label: "Plan impact", icon: "pricing" },
    ...(screenshots.length > 0
      ? [{ id: "screenshots", label: "Screenshots", icon: "explore" as const }]
      : []),
    { id: "scenarios", label: "By scenario", icon: "use-cases" },
    { id: "verify-demo", label: "Verify in demo", icon: "choose" },
    { id: "questions", label: "Vendor questions", icon: "faq" },
    { id: "requirement-evidence", label: "Evidence", icon: "methodology" },
    { id: "methodology", label: "Methodology", icon: "methodology" },
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  const mediaCtx = {
    requirementSlug: profile.slug,
    industrySlug: industry?.slug ?? null,
    capabilitySlug: profile.primaryCapabilitySlug ?? null,
    coreFeatureSlugs: coreFeatures.map((f) => f.featureSlug),
    supportingFeatureSlugs: supportingFeatures.map((f) => f.featureSlug),
    criterionIds: profile.evaluationCriteria.map((c) => c.id),
    useCaseSlugs: useCaseLinks.map((u) => u.id),
    requireStrongMatch: true as const,
  };

  const videos = selectRequirementPageVideos(mediaPool, mediaCtx, {
    limit: 6,
  });

  const seeSupportCards = selectRequirementSeeSupportCards({
    mediaPool,
    products: productCards.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.logo,
    })),
    ctx: mediaCtx,
    criteria: profile.evaluationCriteria.map((c) => ({
      id: c.id,
      name: c.name,
    })),
    features: profile.featureLinks.map((f) => ({
      slug: f.featureSlug,
      name: f.name,
      pageSlug: f.featurePageSlug,
      relationship: f.relationship,
    })),
    useCaseLinks: useCaseLinks.map((u) => ({
      id: u.id,
      title: u.title,
      href: u.href,
    })),
    limit: 3,
  });

  const deepDiveMediaByProduct: Record<string, RequirementSeeSupportCard | null> =
    {};
  for (const card of productCards.slice(0, 5)) {
    const match = seeSupportCards.find((c) => c.productSlug === card.slug);
    if (match) {
      deepDiveMediaByProduct[card.slug] = match;
      continue;
    }
    const one = selectRequirementSeeSupportCards({
      mediaPool,
      products: [{ slug: card.slug, name: card.name, logo: card.logo }],
      ctx: mediaCtx,
      criteria: profile.evaluationCriteria.map((c) => ({
        id: c.id,
        name: c.name,
      })),
      features: profile.featureLinks.map((f) => ({
        slug: f.featureSlug,
        name: f.name,
        pageSlug: f.featurePageSlug,
        relationship: f.relationship,
      })),
      useCaseLinks: useCaseLinks.map((u) => ({
        id: u.id,
        title: u.title,
        href: u.href,
      })),
      limit: 1,
    });
    deepDiveMediaByProduct[card.slug] = one[0] ?? null;
  }

  const verificationGaps: RequirementVerificationGap[] = [];
  for (const row of productCards.slice(0, 6)) {
    for (const criterion of profile.evaluationCriteria) {
      const cell = row.criterionCells[criterion.id];
      if (
        cell === "insufficient-evidence" ||
        cell === "partial-support" ||
        cell === "limited-support"
      ) {
        verificationGaps.push({
          productSlug: row.slug,
          productName: row.name,
          criterionId: criterion.id,
          criterionName: criterion.name,
          note:
            cell === "insufficient-evidence"
              ? "Not sufficiently verified"
              : "Evidence incomplete / partial",
        });
      }
    }
  }

  const demoVerificationSteps =
    profile.workflowSteps.length > 0
      ? profile.workflowSteps.map((s) => s.detail || s.label).slice(0, 8)
      : profile.acceptanceNeeds
          .map((n) => n.description || n.title)
          .filter(Boolean)
          .slice(0, 8);

  const demoTest = buildRequirementDemoTest(profile);

  const sideBySide =
    seeSupportCards.length >= 2
      ? {
          left: seeSupportCards[0]!,
          right: seeSupportCards[1]!,
          interpretation:
            "These official demos illustrate visible product behavior for mapped criteria and features. Fit and ranking still come from structured feature assessments — not from which demo looks smoother.",
        }
      : null;

  const videoCriteriaLabels = [
    ...new Set(
      seeSupportCards.flatMap((c) => c.criteriaSupported.map((x) => x.name)),
    ),
  ];

  const featureNames: Record<string, string> = {};
  for (const link of profile.featureLinks) {
    featureNames[link.featureSlug] = link.name;
  }

  const scorecardEvidence = buildRequirementScorecardEvidenceMap({
    requirementSlug: profile.slug,
    criteria: profile.evaluationCriteria.slice(0, 5).map((c) => ({
      id: c.id,
      name: c.name,
      featureSlugs: c.featureSlugs,
    })),
    products: productRows.slice(0, 8).map((p) => ({
      slug: p.slug,
      name: p.name,
      criterionCells: p.criterionCells,
      featureCells: p.featureCells,
    })),
    featureNames,
    mediaPool,
  });

  const calculatorHref = `${profile.calculatorHref ?? "/tools/crm-cost-calculator/"}?requirement=${encodeURIComponent(profile.slug)}`;
  const requirementsBuilderHref = `/tools/crm-requirements-builder/?requirement=${encodeURIComponent(profile.slug)}&start=1`;
  const demoChecklistHref = `/tools/crm-demo-checklist-builder/?requirement=${encodeURIComponent(profile.slug)}`;
  const implementationPlannerHref = `/tools/crm-implementation-planner/?requirement=${encodeURIComponent(profile.slug)}`;

  return {
    profile,
    requirementSlug: profile.slug,
    requirementName: profile.name,
    displayTitle,
    eyebrow,
    tagline,
    shortAnswer: profile.shortAnswer ?? null,
    industry,
    industryContext,
    categoryHref: `/categories/${categorySlug}/`,
    capabilityHref,
    finderHref: buildFinderHref(profile, industry?.slug),
    calculatorHref,
    compareHref: profile.compareHref ?? "/compare/",
    methodologyHref: profile.methodologyHref ?? COMPANY_ROUTES.methodology,
    demoChecklistHref,
    implementationPlannerHref,
    requirementsBuilderHref,
    methodologyNote: REQUIREMENT_EVIDENCE_METHODOLOGY,
    glance: {
      requirementTypeLabel:
        profile.requirementTypeLabel ?? profile.requirementType ?? null,
      primaryCapabilityName: profile.primaryCapabilityName ?? null,
      typicalImportanceLabel: profile.typicalImportanceLabel ?? null,
      coreFeatureCount: coreFeatures.length,
      supportingFeatureCount: supportingFeatures.length,
      researchedProductCount: productRows.length,
      evidenceItemCount,
      lastReviewedAt,
    },
    coreFeatures,
    supportingFeatures,
    summaryPicks: summaryPicks.filter((p) => p.product != null),
    productRows,
    productCards:
      productCards.length >= 2 ? productCards : productRows.slice(0, 5),
    scenarios,
    screenshots: screenshots.slice(0, 9),
    videos,
    seeSupportCards,
    deepDiveMediaByProduct,
    verificationGaps: verificationGaps.slice(0, 8),
    demoVerificationSteps,
    demoTest,
    sideBySide,
    videoCriteriaLabels,
    useCaseLinks,
    relatedRequirements,
    relatedCapabilities,
    relatedFeatures,
    comparisons,
    research: {
      productCount: productRows.length,
      featureCount: profile.featureLinks.length,
      evidenceItemCount,
      screenshotCount: screenshots.length,
      officialVideoCount: videos.length,
      lastUpdated: lastReviewedAt,
    },
    decisionFlow: [
      { label: "Buyer need", value: profile.name },
      {
        label: "Capability",
        value: profile.primaryCapabilityName ?? "CRM capability",
      },
      {
        label: "Criteria",
        value: `${profile.evaluationCriteria.length} evaluation criteria`,
      },
      {
        label: "Features",
        value: `${coreFeatures.length} core · ${supportingFeatures.length} supporting`,
      },
      {
        label: "Products",
        value: `${productRows.length} researched`,
      },
    ],
    navItems,
    matrixFeatures: matrixSlugs.map((slug) => ({
      slug,
      name: featureName(slug),
    })),
    scorecardEvidence,
  };
}

export function getRequirementDetailPage(
  requirementSlug: string,
  industrySlug?: string,
): RequirementDetailModel | null {
  return buildRequirementDetailModel({ requirementSlug, industrySlug });
}
