import {
  listActivatedCategories,
  listCategoryOnboardingRuns,
  loadCategoryOnboardingRun,
} from "@/data/category-onboarding/store";
import { listCategoryDefinitionSeeds } from "@/data/category-onboarding/seed";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { useCasesSeed } from "@/data/seed/dimensions";
import {
  CATEGORY_ONBOARDING_STAGE_ORDER,
  CategoryBlockerCodeSchema,
  type CategoryDefinition,
} from "@/domain";

export type CategoryValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export function validateCategoryDefinition(
  definition: CategoryDefinition,
): CategoryValidationIssue[] {
  const issues: CategoryValidationIssue[] = [];
  const featureSlugs = new Set<string>();

  for (const feature of definition.features) {
    if (featureSlugs.has(feature.slug)) {
      issues.push({
        code: "duplicate-feature",
        severity: "error",
        message: `Duplicate feature slug: ${feature.slug}`,
      });
    }
    featureSlugs.add(feature.slug);
  }

  const criterionSlugs = new Set<string>();
  let weightSum = 0;
  for (const c of definition.editorialMethodology.criteria) {
    if (criterionSlugs.has(c.slug)) {
      issues.push({
        code: "duplicate-criterion",
        severity: "error",
        message: `Duplicate criterion: ${c.slug}`,
      });
    }
    criterionSlugs.add(c.slug);
    weightSum += c.weight;
    for (const req of c.evidenceRequirements) {
      if (req.startsWith("features:")) {
        const slug = req.slice("features:".length);
        if (!featureSlugs.has(slug) && !slug.includes("/")) {
          // warn — may reference shared CRM features
          issues.push({
            code: "unknown-feature-reference",
            severity: "warning",
            message: `Criterion ${c.slug} references feature ${slug} not in category feature model`,
          });
        }
      }
    }
  }

  // Weights: either ~100 or equal weights (CRM style)
  const equalWeights = definition.editorialMethodology.criteria.every(
    (c) => c.weight === definition.editorialMethodology.criteria[0]?.weight,
  );
  if (!equalWeights && Math.abs(weightSum - 100) > 0.5) {
    issues.push({
      code: "invalid-weights",
      severity: "error",
      message: `Editorial weights sum to ${weightSum}, expected ~100 or equal weights`,
    });
  }

  const cmpSlugs = new Set<string>();
  for (const c of definition.comparisonCriteria) {
    if (cmpSlugs.has(c.slug)) {
      issues.push({
        code: "duplicate-comparison-criterion",
        severity: "error",
        message: `Duplicate comparison criterion: ${c.slug}`,
      });
    }
    cmpSlugs.add(c.slug);
    if (c.featureSlug && !featureSlugs.has(c.featureSlug)) {
      issues.push({
        code: "unknown-feature-reference",
        severity: "warning",
        message: `Comparison criterion ${c.slug} references unknown feature ${c.featureSlug}`,
      });
    }
  }

  for (const dim of definition.pricingDimensions) {
    if (dim.enginePrimitive === "unknown" && dim.required) {
      issues.push({
        code: "pricing-primitive-unknown",
        severity: "warning",
        message: `Required pricing dimension ${dim.slug} has unknown engine primitive`,
      });
    }
  }

  if (!definition.scope.definition.trim()) {
    issues.push({
      code: "scope-undefined",
      severity: "error",
      message: "Scope definition is empty",
    });
  }

  if (definition.parentSlug === definition.slug) {
    issues.push({
      code: "taxonomy-cycle",
      severity: "error",
      message: "Category cannot be its own parent",
    });
  }

  const catalogueUseCases = new Set(useCasesSeed.map((item) => item.slug));
  for (const useCase of definition.useCases) {
    if (!catalogueUseCases.has(useCase.slug)) {
      issues.push({
        code: "unknown-catalogue-use-case",
        severity: "error",
        message: `Category ${definition.slug} use case ${useCase.slug} is missing from useCasesSeed`,
      });
    }
  }

  const catalogueFeatures = new Set(
    canonicalFeaturesSeed.map((item) => item.slug),
  );
  for (const feature of definition.features) {
    if (!catalogueFeatures.has(feature.slug)) {
      issues.push({
        code: "unknown-catalogue-feature",
        severity: "error",
        message: `Category ${definition.slug} feature ${feature.slug} is missing from canonicalFeaturesSeed`,
      });
    }
  }

  return issues;
}

export function validateCategorySeedAlignment(): CategoryValidationIssue[] {
  return listCategoryDefinitionSeeds().flatMap((definition) =>
    validateCategoryDefinition(definition),
  );
}

export function validateCategoryOnboardingRepository(): CategoryValidationIssue[] {
  const issues: CategoryValidationIssue[] = [];
  for (const run of listCategoryOnboardingRuns()) {
    for (const stage of run.stages) {
      if (!CATEGORY_ONBOARDING_STAGE_ORDER.includes(stage.stageId)) {
        issues.push({
          code: "unknown-stage",
          severity: "error",
          message: `Run ${run.id} has unknown stage ${stage.stageId}`,
        });
      }
    }
    for (const issue of run.issues) {
      if (
        typeof issue.code === "string" &&
        !CategoryBlockerCodeSchema.safeParse(issue.code).success &&
        !issue.code.startsWith("LOW_") &&
        !issue.code.startsWith("NO_")
      ) {
        // allow warning string codes
      }
    }
    if (!loadCategoryOnboardingRun(run.id)) {
      issues.push({
        code: "run-unreadable",
        severity: "error",
        message: `Could not reload ${run.id}`,
      });
    }
    if (run.definition) {
      issues.push(...validateCategoryDefinition(run.definition));
    }
  }

  for (const activated of listActivatedCategories()) {
    issues.push(...validateCategoryDefinition(activated.definition));
  }

  return issues.filter((i) => i.severity === "error");
}
