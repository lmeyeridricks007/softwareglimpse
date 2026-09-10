import type { EnrichmentGuideType, GuideQualityBlueprint } from "./types";

const BLUEPRINTS: Record<EnrichmentGuideType, GuideQualityBlueprint> = {
  CATEGORY_EDUCATION: {
    guideType: "CATEGORY_EDUCATION",
    requiredSections: [
      "problem_or_definition",
      "who_needs_it",
      "workflows",
      "capabilities",
      "implementation",
      "pricing_expectations",
      "common_mistakes",
      "candidate_products",
      "next_decision",
    ],
    optionalSections: ["tradeoffs", "checklist", "evidence"],
    minUniqueElements: 4,
    notes:
      "Category education: what it solves, who needs it, workflows, capabilities, pricing from SG data, mistakes, products, next step.",
  },
  BUYING_GUIDE: {
    guideType: "BUYING_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "requirements",
      "capabilities",
      "candidate_products",
      "tradeoffs",
      "pricing_expectations",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["scenario_analysis", "comparisons", "evidence"],
    minUniqueElements: 4,
    notes: "Buying guide: criteria, shortlist, tradeoffs, pricing, checklist.",
  },
  IMPLEMENTATION_GUIDE: {
    guideType: "IMPLEMENTATION_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "requirements",
      "implementation",
      "workflows",
      "common_mistakes",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["integrations", "pricing_expectations", "evidence"],
    minUniqueElements: 3,
    notes: "Implementation: workflow, constraints, mistakes, checklist.",
  },
  USE_CASE_GUIDE: {
    guideType: "USE_CASE_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "who_needs_it",
      "requirements",
      "workflows",
      "capabilities",
      "candidate_products",
      "tradeoffs",
      "pricing_expectations",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["scenario_analysis", "evidence"],
    minUniqueElements: 4,
    notes:
      "Use-case: problem → requirements → capabilities → candidates → checklist.",
  },
  INDUSTRY_GUIDE: {
    guideType: "INDUSTRY_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "workflows",
      "requirements",
      "industry_constraints",
      "integrations",
      "implementation",
      "candidate_products",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["pricing_expectations", "evidence"],
    minUniqueElements: 4,
    notes:
      "Industry: workflows, constraints, integrations, evaluation criteria, candidates.",
  },
  PRODUCT_EXPLAINER: {
    guideType: "PRODUCT_EXPLAINER",
    requiredSections: [
      "problem_or_definition",
      "who_needs_it",
      "workflows",
      "capabilities",
      "limitations",
      "pricing_expectations",
      "integrations",
      "alternatives",
      "comparisons",
      "checklist",
      "evidence",
      "next_decision",
    ],
    optionalSections: ["tradeoffs", "scenario_analysis"],
    minUniqueElements: 5,
    notes:
      "Product explainer (what-is-{product}): informational orientation — what it is, who uses it, workflows, capabilities, limits, pricing shape, integrations, alternatives, when to consider — distinct from the commercial product review.",
  },
  FEATURE_GUIDE: {
    guideType: "FEATURE_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "capabilities",
      "workflows",
      "candidate_products",
      "tradeoffs",
      "next_decision",
    ],
    optionalSections: ["checklist", "evidence"],
    minUniqueElements: 3,
    notes:
      "Feature guide: capability meaning, when it matters, product coverage.",
  },
  COST_GUIDE: {
    guideType: "COST_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "pricing_expectations",
      "tradeoffs",
      "candidate_products",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["scenario_analysis", "evidence"],
    minUniqueElements: 3,
    notes:
      "Cost guide: real plan structure, free/trial, TCO tradeoffs — never invent prices.",
  },
  MIGRATION_GUIDE: {
    guideType: "MIGRATION_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "requirements",
      "implementation",
      "common_mistakes",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["integrations", "candidate_products", "evidence"],
    minUniqueElements: 3,
    notes: "Migration: cutover risks, data mapping, checklist.",
  },
  INTEGRATION_GUIDE: {
    guideType: "INTEGRATION_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "integrations",
      "workflows",
      "requirements",
      "candidate_products",
      "next_decision",
    ],
    optionalSections: ["checklist", "evidence"],
    minUniqueElements: 3,
    notes: "Integration: systems, patterns, product coverage.",
  },
  DECISION_GUIDE: {
    guideType: "DECISION_GUIDE",
    requiredSections: [
      "problem_or_definition",
      "requirements",
      "tradeoffs",
      "candidate_products",
      "scenario_analysis",
      "checklist",
      "next_decision",
    ],
    optionalSections: ["pricing_expectations", "comparisons", "evidence"],
    minUniqueElements: 4,
    notes: "Decision: framework, scenarios, shortlist, next action.",
  },
  OTHER: {
    guideType: "OTHER",
    requiredSections: ["problem_or_definition", "next_decision"],
    optionalSections: ["checklist", "evidence"],
    minUniqueElements: 2,
    notes: "Fallback — keep flexible; do not force a mismatched template.",
  },
};

export function blueprintForType(
  type: EnrichmentGuideType,
): GuideQualityBlueprint {
  return BLUEPRINTS[type];
}

export function allBlueprints(): GuideQualityBlueprint[] {
  return Object.values(BLUEPRINTS);
}
