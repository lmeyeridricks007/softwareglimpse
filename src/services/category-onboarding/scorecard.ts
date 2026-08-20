import type {
  CategoryDefinition,
  CategoryMembership,
  CategoryScorecard,
  PricingCapabilityStatus,
} from "@/domain";

export function buildCategoryScorecard(input: {
  definition: CategoryDefinition;
  memberships: CategoryMembership[];
  mode: "new" | "reconcile";
  hasBlockers: boolean;
  pricingCapability: PricingCapabilityStatus;
}): CategoryScorecard {
  const { definition, memberships, mode, hasBlockers, pricingCapability } =
    input;

  const passFail = (ok: boolean) => (ok ? ("PASS" as const) : ("FAIL" as const));

  const identity = passFail(Boolean(definition.name && definition.slug));
  const hierarchy = passFail(
    definition.parentSlug === null || Boolean(definition.parentSlug),
  );
  const scope = passFail(
    definition.scope.definition.length > 0 &&
      definition.scope.includes.length > 0,
  );
  const features = passFail(definition.features.length >= 5);
  const researchModel = passFail(
    definition.researchRequirements.some((r) => r.level === "required"),
  );
  const editorialMethodology = passFail(
    definition.editorialMethodology.criteria.length >= 5,
  );
  const comparisonMethodology = passFail(
    definition.comparisonCriteria.length >= 3,
  );
  const pricingModel =
    pricingCapability === "SUPPORTED"
      ? ("PASS" as const)
      : pricingCapability === "PARTIAL"
        ? ("PARTIAL" as const)
        : ("FAIL" as const);
  const useCases = passFail(definition.useCases.length > 0);
  const contentArchitecture = passFail(true);

  const productCoverage = memberships.filter(
    (m) => m.role === "primary" || m.role === "secondary",
  ).length;

  let overall: CategoryScorecard["overall"] = "READY";
  if (hasBlockers) overall = "BLOCKED";
  else if (mode === "reconcile" && pricingCapability === "SUPPORTED")
    overall = "RECONCILE_OK";
  else if (pricingCapability === "PARTIAL" || pricingCapability === "UNSUPPORTED")
    overall = "READY_WITH_PRICING_GAP";
  else if (
    memberships.some((m) => m.role === "uncertain") ||
    productCoverage < definition.coverageThresholds.hubMinProducts
  )
    overall = "READY_WITH_WARNINGS";

  const lines = [
    `${definition.name.toUpperCase()}`,
    "",
    `Identity                ${identity}`,
    `Hierarchy               ${hierarchy}`,
    `Scope                   ${scope}`,
    `Features                ${features} (${definition.features.length})`,
    `Research model          ${researchModel}`,
    `Editorial methodology   ${editorialMethodology}`,
    `Comparison methodology  ${comparisonMethodology}`,
    `Pricing model           ${pricingModel}`,
    `Use cases               ${useCases} (${definition.useCases.length})`,
    `Content architecture    ${contentArchitecture}`,
    `Finder readiness        ${definition.finderReadiness.replace(/_/g, " ")}`,
    `Product coverage        ${productCoverage} products`,
    "",
    "Overall:",
    overall.replace(/_/g, " "),
  ];

  return {
    categoryName: definition.name,
    categorySlug: definition.slug,
    identity,
    hierarchy,
    scope,
    features,
    researchModel,
    editorialMethodology,
    comparisonMethodology,
    pricingModel,
    useCases,
    contentArchitecture,
    finderReadiness: definition.finderReadiness,
    productCoverage,
    overall,
    lines,
  };
}

export function formatCategoryScorecard(scorecard: CategoryScorecard): string {
  return scorecard.lines.join("\n");
}
