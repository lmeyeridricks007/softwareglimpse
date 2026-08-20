import type {
  OnboardingScorecard,
  PageCandidate,
  PricingReadinessStatus,
  RelationshipCandidate,
  Software,
  SoftwareOnboardingRun,
  TaxonomyAssignment,
} from "@/domain";

export function buildScorecard(input: {
  product: Software;
  taxonomy: TaxonomyAssignment[];
  researchPercent: number;
  pricingStatus: PricingReadinessStatus;
  relationshipCandidates: RelationshipCandidate[];
  pageCandidates: PageCandidate[];
  mode: SoftwareOnboardingRun["mode"];
  hasBlockers: boolean;
  hasReviewWarnings: boolean;
}): OnboardingScorecard {
  const {
    product,
    taxonomy,
    researchPercent,
    pricingStatus,
    relationshipCandidates,
    pageCandidates,
    mode,
    hasBlockers,
    hasReviewWarnings,
  } = input;

  const identity =
    product.name && product.website
      ? ("PASS" as const)
      : product.name
        ? ("PARTIAL" as const)
        : ("FAIL" as const);

  const hasGap = taxonomy.length === 0;
  const taxonomyStatus = hasGap
    ? ("GAP" as const)
    : taxonomy.some((t) => t.confidence === "low")
      ? ("PARTIAL" as const)
      : ("PASS" as const);

  const productPage =
    pageCandidates.find((p) => p.pageType === "software-review")?.status ??
    "blocked";
  const pricingPage =
    pageCandidates.find((p) => p.pageType === "pricing")?.status ?? "blocked";
  const alternativesPage =
    pageCandidates.find((p) => p.pageType === "alternatives")?.status ??
    "blocked";

  const comparisons = pageCandidates.filter((p) => p.pageType === "comparison");
  const comparisonsReady = comparisons.filter(
    (p) => p.status === "ready-to-create",
  ).length;
  const comparisonsBlocked = comparisons.length - comparisonsReady;

  const bestReady = pageCandidates.some(
    (p) =>
      p.pageType === "best-inclusion" &&
      (p.status === "ready-to-create" || p.status === "duplicate"),
  );

  const relationships =
    relationshipCandidates.length === 0
      ? ("NONE" as const)
      : relationshipCandidates.some((c) => c.status === "candidate")
        ? ("REVIEW_REQUIRED" as const)
        : ("PASS" as const);

  let overall: OnboardingScorecard["overall"] = "READY";
  if (hasBlockers) overall = "BLOCKED";
  else if (mode === "reconcile" && !hasReviewWarnings) overall = "RECONCILE_OK";
  else if (hasReviewWarnings || relationships === "REVIEW_REQUIRED")
    overall = "READY_WITH_REVIEW";

  const lines = [
    `${product.name.toUpperCase()} ONBOARDING`,
    "",
    `Identity              ${identity}`,
    `Entity type           ${product.entityType.toUpperCase()}`,
    `Taxonomy              ${taxonomyStatus}`,
    `Research              ${researchPercent}%`,
    `Pricing               ${pricingStatus}`,
    `Relationships         ${relationships}`,
    `Product page          ${productPage}`,
    `Pricing page          ${pricingPage}`,
    `Alternatives          ${alternativesPage}`,
    `Comparisons           ${comparisonsReady} READY / ${comparisonsBlocked} BLOCKED`,
    `Best-page eligibility ${bestReady ? "READY" : "NOT_READY"}`,
    `Internal linking      READY`,
    "",
    `Overall:`,
    overall.replace(/_/g, " "),
  ];

  return {
    productName: product.name,
    productSlug: product.slug,
    identity,
    entityType: product.entityType,
    taxonomy: taxonomyStatus,
    researchPercent,
    pricing: pricingStatus,
    relationships,
    productPage,
    pricingPage,
    alternativesPage,
    comparisonsReady,
    comparisonsBlocked,
    bestPageEligibility: bestReady ? "READY" : "NOT_READY",
    internalLinking: "READY",
    overall,
    lines,
  };
}

export function formatScorecard(scorecard: OnboardingScorecard): string {
  return scorecard.lines.join("\n");
}
