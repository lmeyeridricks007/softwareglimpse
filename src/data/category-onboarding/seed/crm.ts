import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";
import { crmMethodology } from "@/data/seed/crm-methodology";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { comparisonCriteriaSeed } from "@/data/seed/comparison-criteria";

/**
 * Project existing CRM catalogue assets into CategoryDefinition for reconcile.
 * Does not duplicate CRM methodology — reuses crmMethodology.
 */
export function buildCrmCategoryDefinition(): CategoryDefinition {
  const crmFeatures = canonicalFeaturesSeed
    .filter((f) => f.categorySlugs?.includes("crm"))
    .map((f) => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      description: f.description ?? `${f.name} capability for CRM products.`,
      importance: "important" as const,
      comparisonRelevant: true,
      finderRelevant: true,
      aliases: [] as string[],
    }));

  const comparisonCriteria = comparisonCriteriaSeed
    .filter((c) => (c.applicableCategorySlugs ?? []).includes("crm"))
    .map((c, i) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      kind: "editorial" as const,
      displayOrder: c.displayOrder ?? i,
      decisionImportance: "medium" as const,
    }));

  return CategoryDefinitionSchema.parse({
    id: "cat-def-crm-v1",
    slug: "crm",
    name: "CRM",
    shortDescription:
      "Customer relationship management software for sales pipelines and customer data.",
    parentSlug: null,
    aliases: ["crm software", "sales crm", "customer relationship management"],
    lifecycle: "active",
    configVersion: crmMethodology.version,
    scope: {
      definition:
        "Software whose primary job is managing contacts, deals, and sales pipelines.",
      includes: [
        { id: "inc-sales-crm", label: "Sales CRM" },
        { id: "inc-simple-crm", label: "Simple / relationship CRM" },
      ],
      excludes: [
        {
          id: "exc-marketing-only",
          label: "Marketing-only email platforms without CRM core",
        },
      ],
      adjacentCategorySlugs: ["sales-intelligence", "marketing"],
      classificationNotes: [],
    },
    features: crmFeatures.length
      ? crmFeatures
      : [
          {
            id: "feat-crm-placeholder",
            slug: "contact-management",
            name: "Contact management",
            description: "Contact records and relationship tracking.",
            importance: "core",
            comparisonRelevant: true,
            finderRelevant: true,
            aliases: [],
          },
        ],
    researchRequirements: [
      { domain: "identity", level: "required" },
      { domain: "pricing", level: "required" },
      { domain: "plans", level: "required" },
      { domain: "features", level: "required" },
      { domain: "integrations", level: "required" },
      { domain: "ai-capabilities", level: "recommended" },
      { domain: "free-trial", level: "recommended" },
      { domain: "support", level: "optional" },
    ],
    editorialMethodology: crmMethodology,
    comparisonCriteria: comparisonCriteria.length
      ? comparisonCriteria
      : [
          {
            id: "cmp-crm-fallback",
            slug: "ease-of-use",
            name: "Ease of use",
            kind: "editorial",
            displayOrder: 0,
            decisionImportance: "high",
          },
        ],
    pricingDimensions: [
      {
        id: "pd-crm-seats",
        slug: "seats",
        name: "Seats / users",
        enginePrimitive: "per-seat",
        required: true,
      },
      {
        id: "pd-crm-plans",
        slug: "plans",
        name: "Plan tiers",
        enginePrimitive: "flat",
        required: true,
      },
    ],
    pricingCapability: "SUPPORTED",
    pricingCapabilityNotes: ["CRM pricing engine + calculator exist"],
    recommendationDimensions: [
      { id: "rd-crm-usecase", slug: "use-case", name: "Primary use case" },
      { id: "rd-crm-size", slug: "business-size", name: "Business size" },
      { id: "rd-crm-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "UI_READY",
    finderNotes: ["CRM Finder shipped"],
    useCases: [
      {
        slug: "pipeline-management",
        name: "Pipeline management",
        pageEligibility: "published",
      },
      {
        slug: "lead-management",
        name: "Lead management",
        pageEligibility: "content-candidate",
      },
    ],
    seedProductSlugs: [
      "pipedrive",
      "freshsales",
      "close",
      "salesflare",
      "folk",
      "keap",
      "streak",
      "capsule",
    ],
    queryAliases: ["crm software", "best crm", "sales crm"],
    requiredResearchDomains: [
      "identity",
      "pricing",
      "plans",
      "features",
      "integrations",
      "ai-capabilities",
      "free-trial",
      "support",
    ],
    optionalResearchDomains: [
      "free-plan",
      "limits",
      "security-compliance",
      "product-positioning",
      "use-cases",
      "business-size-fit",
    ],
    pricingModelsSupported: ["per-seat", "flat", "custom", "hybrid"],
    notes: ["Reconciled from existing CRM methodology + feature seed"],
    supportingKnowledgeAreas: [
      "fundamentals",
      "selection",
      "pricing",
      "features",
      "implementation",
      "migration",
    ],
  });
}
