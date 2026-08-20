import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";
import { salesIntelligenceMethodology } from "@/data/seed/sales-intelligence-methodology";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { comparisonCriteriaSeed } from "@/data/seed/comparison-criteria";

/**
 * Sales Intelligence category definition for reconcile/activation.
 * Separate decision domain from CRM — Finder remains FUTURE until UI ships.
 */
export function buildSalesIntelligenceCategoryDefinition(): CategoryDefinition {
  const features = canonicalFeaturesSeed
    .filter((f) => f.categorySlugs?.includes("sales-intelligence"))
    .map((f) => ({
      id: f.id,
      slug: f.slug,
      name: f.name,
      description:
        f.description ?? `${f.name} capability for sales intelligence products.`,
      importance: "important" as const,
      comparisonRelevant: true,
      finderRelevant: true,
      aliases: [] as string[],
    }));

  const comparisonCriteria = comparisonCriteriaSeed
    .filter((c) =>
      (c.applicableCategorySlugs ?? []).includes("sales-intelligence"),
    )
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
    id: "cat-def-sales-intelligence-v1",
    slug: "sales-intelligence",
    name: "Sales Intelligence",
    shortDescription:
      "Prospecting, enrichment, and sales intelligence software for finding and engaging buyers.",
    parentSlug: null,
    aliases: [
      "sales intelligence software",
      "lead generation software",
      "prospecting tools",
      "B2B contact data",
    ],
    lifecycle: "active",
    configVersion: salesIntelligenceMethodology.version,
    scope: {
      definition:
        "Software whose primary job is discovering contacts/companies, enriching records, and enabling outbound prospecting — not replacing a sales CRM.",
      includes: [
        { id: "inc-contact-db", label: "Contact / company databases" },
        { id: "inc-enrichment", label: "Enrichment and intent tools" },
        { id: "inc-outreach", label: "Sales engagement / sequencing with data core" },
      ],
      excludes: [
        {
          id: "exc-crm-core",
          label: "Primary CRM systems without a data/prospecting core",
        },
      ],
      adjacentCategorySlugs: ["crm", "email-marketing"],
      classificationNotes: [
        "Do not treat SI tools as CRM substitutes unless graph evidence supports it",
      ],
    },
    features: features.length
      ? features
      : [
          {
            id: "feat-si-placeholder",
            slug: "contact-data",
            name: "Contact data",
            description: "Contact and company database coverage.",
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
    editorialMethodology: salesIntelligenceMethodology,
    comparisonCriteria: comparisonCriteria.length
      ? comparisonCriteria
      : [
          {
            id: "cmp-si-fallback",
            slug: "contact-data",
            name: "Contact data",
            kind: "editorial",
            displayOrder: 0,
            decisionImportance: "high",
          },
        ],
    pricingDimensions: [
      {
        id: "pd-si-credits",
        slug: "credits",
        name: "Credits / exports",
        enginePrimitive: "usage",
        required: true,
      },
      {
        id: "pd-si-seats",
        slug: "seats",
        name: "Seats / users",
        enginePrimitive: "per-seat",
        required: false,
      },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Many SI vendors use credits + custom quotes; calculator support is limited",
    ],
    recommendationDimensions: [
      { id: "rd-si-usecase", slug: "use-case", name: "Primary use case" },
      { id: "rd-si-coverage", slug: "data-coverage", name: "Data coverage" },
      { id: "rd-si-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "UI_READY",
    finderNotes: [
      "Sales Intelligence Finder shipped at /tools/sales-intelligence-finder/",
    ],
    useCases: [
      {
        slug: "prospecting",
        name: "Prospecting",
        pageEligibility: "content-candidate",
      },
      {
        slug: "data-enrichment",
        name: "Data enrichment",
        pageEligibility: "content-candidate",
      },
    ],
    seedProductSlugs: [
      "apollo",
      "lusha",
      "rocketreach",
      "amplemarket",
      "closely",
      "zoominfo",
      "cognism",
      "linkedin-sales-navigator",
      "bookyourdata",
      "reply",
      "kixie",
      "sixsense",
      "demandbase",
      "seamless-ai",
      "clay",
      "clearbit",
      "bombora",
      "uplead",
      "leadiq",
      "hunter",
      "snov",
      "kaspr",
      "ocean",
      "adapt-io",
      "outreach",
      "salesloft",
      "instantly",
      "gong",
      "lemlist",
      "smartlead",
    ],
    queryAliases: [
      "sales intelligence",
      "best sales intelligence software",
      "prospecting tools",
    ],
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
    pricingModelsSupported: ["per-seat", "usage", "custom", "hybrid"],
    notes: [
      "Reconciled from existing SI catalogue + feature seed",
      "Not a CRM substitute category",
    ],
  });
}
