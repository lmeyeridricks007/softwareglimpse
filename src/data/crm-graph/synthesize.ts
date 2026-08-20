import {
  FeatureDetailProfileSchema,
  IndustryCapabilityProfileSchema,
  IndustryUseCaseProfileSchema,
  RequirementDetailProfileSchema,
  type FeatureDetailProfile,
  type IndustryCapabilityProfile,
  type IndustryUseCaseProfile,
  type RequirementDetailProfile,
} from "@/domain";
// Imported from the repository module rather than the `@/data` barrel so the
// shared graph never participates in a cycle with the registries that use it.
import { getIndustryBySlug } from "@/data/repositories/catalog";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { CRM_CAPABILITIES, getCrmCapabilityDefinition } from "./capabilities";
import { CRM_FEATURES, getCrmFeatureDefinition } from "./features";
import { getCrmRequirementDefinition } from "./requirements";
import { CRM_USE_CASES, getCrmUseCaseDefinition } from "./use-cases";

const FINDER_HREF = "/tools/crm-finder/";
const CALCULATOR_HREF = "/tools/crm-cost-calculator/";
const COMPARE_HREF = "/compare/";
const CATEGORY_SLUG = "crm";

/** Catalogue / evidence slug → public feature detail page slug. */
const CATALOGUE_TO_PAGE_SLUG: Record<string, string> = {
  "custom-pipelines": "multiple-pipelines", // keep for multiple-pipelines page; custom-pipeline-stages also uses custom-pipelines as evidence via its own canonical
  "call-functionality": "calling",
  reporting: "reporting-dashboards",
};

/** Page slugs that exist outside the shared graph (hand-authored profiles). */
const EXTERNAL_FEATURE_PAGE_SLUGS = ["multiple-pipelines", "workflow-automation"];

const FEATURE_PAGE_SLUGS = new Set([
  ...CRM_FEATURES.map((feature) => feature.slug),
  ...EXTERNAL_FEATURE_PAGE_SLUGS,
]);

/**
 * Public feature detail page slug for a catalogue feature slug, when a page
 * exists. Returns undefined rather than guessing a URL.
 */
export function crmFeaturePageSlug(featureSlug: string): string | undefined {
  const mapped = CATALOGUE_TO_PAGE_SLUG[featureSlug] ?? featureSlug;
  return FEATURE_PAGE_SLUGS.has(mapped) ? mapped : undefined;
}

/**
 * Lower-case an industry name for mid-sentence use while preserving acronyms —
 * "Financial services" becomes "financial services" but "SaaS" stays "SaaS".
 */
function inlineIndustryName(industryName: string): string {
  return industryName
    .split(" ")
    .map((word) => (/[A-Z]/.test(word.slice(1)) ? word : word.toLowerCase()))
    .join(" ");
}

/**
 * Replace `{industry}` with the industry name, using the properly cased name at
 * sentence starts and the inline form mid-sentence.
 */
function applyTemplate(text: string, industryName: string): string {
  const inline = inlineIndustryName(industryName);
  return text.replace(/\{industry\}/g, (_match, offset: number) => {
    const preceding = text.slice(0, offset);
    const atSentenceStart = /(^|[.!?:]\s+|\n\s*)$/.test(preceding);
    return atSentenceStart ? industryName : inline;
  });
}

function resolveIndustryName(
  industrySlug: string,
  industryName: string | null,
): string | null {
  const industry = getIndustryBySlug(industrySlug, { includeUnpublished: true });
  if (!industry) return null;
  return industryName ?? industry.name;
}

function importanceLabelForWeight(weight: number): string {
  if (weight >= 90) return "Very high";
  if (weight >= 75) return "High";
  if (weight >= 55) return "Medium–High";
  if (weight >= 40) return "Medium";
  return "Situational";
}

const SHARED_LINKS = {
  finderHref: FINDER_HREF,
  calculatorHref: CALCULATOR_HREF,
  compareHref: COMPARE_HREF,
  methodologyHref: COMPANY_ROUTES.methodology,
};

/**
 * Build an Industry × Capability profile from the shared capability definition.
 * `industryName` may be null — the catalogue name is used instead. Returns null
 * for unknown industries or capabilities.
 */
export function synthesizeIndustryCapabilityProfile(
  industrySlug: string,
  industryName: string | null,
  capabilitySlug: string,
): IndustryCapabilityProfile | null {
  const definition = getCrmCapabilityDefinition(capabilitySlug);
  if (!definition) return null;
  const name = resolveIndustryName(industrySlug, industryName);
  if (!name) return null;

  const inlineName = inlineIndustryName(name);
  const capabilityLabel = definition.name.toLowerCase();

  const useCaseFits = CRM_USE_CASES.flatMap((useCase) => {
    const entry = useCase.capabilities.find(
      (item) => item.capabilitySlug === capabilitySlug,
    );
    if (!entry) return [];
    return [
      {
        id: useCase.hubUseCaseId,
        title: useCase.displayName,
        description: entry.description,
        importanceLabel: importanceLabelForWeight(entry.weight),
        icon: entry.icon,
        useCaseSlug: useCase.slug,
        href: `/industries/${industrySlug}/use-cases/${useCase.slug}/`,
      },
    ];
  });

  return IndustryCapabilityProfileSchema.parse({
    industrySlug,
    capabilitySlug: definition.slug,
    displayName: definition.name,
    displayTitle: `${definition.name} for ${name}`,
    eyebrow: `${name} CRM capability`,
    tagline: `Evaluate CRM platforms on how well they support ${capabilityLabel} for ${inlineName} teams — the requirements that matter, the trade-offs involved, and researched product evidence.`,
    whyItMatters: definition.whyItMatters.map((text) =>
      applyTemplate(text, name),
    ),
    weakProcessRisks: definition.weakProcessRisks,
    glance: definition.glance,
    evaluationDimensions: definition.evaluationDimensions,
    requirements: definition.requirements.map((requirement) => ({
      ...requirement,
      href: requirement.requirementSlug
        ? `/requirements/${requirement.requirementSlug}/`
        : undefined,
    })),
    matrixFeatureSlugs: definition.matrixFeatureSlugs,
    criterionSlug: definition.criterionSlug,
    relatedCapabilitySlugs: definition.relatedCapabilitySlugs,
    useCaseFits,
    tradeoffs: definition.tradeoffs,
    outcomes: definition.outcomes,
    vendorQuestions: definition.vendorQuestions,
    implementation: definition.implementation,
    faq: definition.faq.map((item) => ({
      question: applyTemplate(item.question, name),
      answer: applyTemplate(item.answer, name),
    })),
    screenshotMatchTerms: definition.screenshotMatchTerms,
    ...SHARED_LINKS,
    categorySlug: CATEGORY_SLUG,
  });
}

/**
 * Build an Industry × Use Case profile from the shared use-case definition.
 * Returns null for unknown industries or use cases.
 */
export function synthesizeIndustryUseCaseProfile(
  industrySlug: string,
  industryName: string | null,
  useCaseSlug: string,
): IndustryUseCaseProfile | null {
  const definition = getCrmUseCaseDefinition(useCaseSlug);
  if (!definition) return null;
  const name = resolveIndustryName(industrySlug, industryName);
  if (!name) return null;

  return IndustryUseCaseProfileSchema.parse({
    industrySlug,
    useCaseSlug: definition.slug,
    hubUseCaseId: definition.hubUseCaseId,
    displayName: definition.displayName,
    displayTitle: `CRM for ${definition.displayName.toLowerCase()} in ${name}`,
    eyebrow: `${name} CRM use case`,
    tagline: applyTemplate(definition.tagline, name),
    decisionNuance: applyTemplate(definition.decisionNuance, name),
    glance: definition.glance,
    capabilities: definition.capabilities.map((capability) => ({
      ...capability,
      href: `/industries/${industrySlug}/capabilities/${capability.capabilitySlug}/`,
    })),
    requirements: definition.requirements.map((requirement) => ({
      ...requirement,
      href: requirement.requirementSlug
        ? `/requirements/${requirement.requirementSlug}/`
        : undefined,
    })),
    summarySlots: definition.summarySlots,
    scenarios: definition.scenarios,
    tradeoffs: definition.tradeoffs,
    implementation: definition.implementation,
    vendorQuestions: definition.vendorQuestions,
    relatedUseCaseSlugs: definition.relatedUseCaseSlugs,
    relatedCapabilitySlugs: definition.relatedCapabilitySlugs,
    faq: definition.faq.map((item) => ({
      question: applyTemplate(item.question, name),
      answer: applyTemplate(item.answer, name),
    })),
    catalogueUseCaseSlugs: definition.catalogueUseCaseSlugs,
    finderUseCaseSlug: definition.finderUseCaseSlug,
    screenshotMatchTerms: definition.screenshotMatchTerms,
    matrixFeatureSlugs: definition.matrixFeatureSlugs,
    ...SHARED_LINKS,
    categorySlug: CATEGORY_SLUG,
  });
}

/**
 * Build a generic Feature Detail profile from the shared feature definition.
 * No industry overlay is synthesized — industry framing is hand-authored only,
 * so we never imply industry-specific product behaviour.
 */
export function synthesizeFeatureDetailProfile(
  featureSlug: string,
): FeatureDetailProfile | null {
  const definition = getCrmFeatureDefinition(featureSlug);
  if (!definition) return null;

  const canonicalFeatureSlug =
    definition.canonicalFeatureSlug ?? definition.slug;
  const featureLabel = definition.name.toLowerCase();
  const directMapping =
    definition.requirementMappings.find(
      (mapping) => mapping.supportLevel === "direct",
    ) ?? definition.requirementMappings[0];

  const useCaseRelevance = CRM_USE_CASES.flatMap((useCase) => {
    const requirement = useCase.requirements.find(
      (item) => item.featureSlug === canonicalFeatureSlug,
    );
    if (!requirement) return [];
    const relevanceLabel =
      requirement.priority === "must-have"
        ? "High relevance"
        : requirement.priority === "important"
          ? "Medium relevance"
          : "Situational";
    return [
      {
        id: useCase.hubUseCaseId,
        title: useCase.displayName,
        description: requirement.description,
        relevanceLabel,
      },
    ];
  });

  const implementationThemes = definition.extraDimensions
    .slice(0, 3)
    .map((dimension) => ({
      id: dimension.id,
      title: dimension.name,
      description:
        dimension.description ??
        `Compare how products differ on ${dimension.name.toLowerCase()} rather than assuming parity.`,
      dimensionId: dimension.id,
    }));

  return FeatureDetailProfileSchema.parse({
    slug: definition.slug,
    canonicalFeatureSlug,
    name: definition.name,
    displayTitle: `${definition.name} in CRM Software`,
    eyebrow: "CRM feature",
    tagline: `Compare how CRM platforms support ${featureLabel} — availability, plan requirements, limits and implementation differences, based on researched evidence.`,
    definition: definition.definition,
    notTheSameAs: definition.notTheSameAs,
    supportsBullets: definition.supportsBullets,
    featureType: definition.featureType,
    featureTypeLabel: definition.featureTypeLabel,
    typicalBuyerNeed: definition.typicalBuyerNeed,
    commonLimitation: definition.commonLimitation,
    categorySlug: CATEGORY_SLUG,
    primaryCapabilitySlug: definition.primaryCapabilitySlug,
    primaryCapabilityName: definition.primaryCapabilityName,
    relatedRequirementName: directMapping?.name,
    relatedRequirementDescription: directMapping?.description,
    relatedRequirementSlug: directMapping?.requirementSlug,
    evaluationDimensions: [
      {
        id: "availability",
        name: "Feature availability",
        valueType: "support-status",
        source: "primary",
        importance: "critical",
      },
      {
        id: "min-plan",
        name: "Minimum plan",
        valueType: "plan",
        source: "min-plan",
        importance: "high",
      },
      ...definition.extraDimensions,
    ],
    needGuidance: definition.needGuidance,
    requirementMappings: definition.requirementMappings.map((mapping) => ({
      ...mapping,
      href: mapping.requirementSlug
        ? `/requirements/${mapping.requirementSlug}/`
        : undefined,
    })),
    relatedFeatureSlugs: definition.relatedFeatureSlugs,
    relatedCapabilitySlugs: definition.relatedCapabilitySlugs,
    useCaseRelevance,
    industryRelevance: [],
    industryContexts: [],
    implementationThemes,
    tradeoffs: definition.tradeoffs,
    vendorQuestions: definition.vendorQuestions,
    faq: definition.faq,
    screenshotMatchTerms: definition.screenshotMatchTerms,
    // Default operational workflow so synthesized pages are not section-empty.
    workflowSteps: [
      {
        id: "define",
        label: "Define the job",
        detail: `Describe the weekly scenario where ${definition.name.toLowerCase()} must work — not the marketing name alone.`,
      },
      {
        id: "check-support",
        label: "Check product support",
        detail:
          "Confirm availability, plan tier, and known limits from researched product evidence — unknown stays unknown.",
      },
      {
        id: "map-requirements",
        label: "Map to requirements",
        detail:
          "Link the feature to the buyer requirements it actually satisfies before treating it as a must-have.",
      },
      {
        id: "verify",
        label: "Verify in a trial or demo",
        detail:
          "Run the scenario end-to-end with the fields, permissions, and related features your team needs.",
      },
    ],
    lastReviewedAt: "2026-08-15T00:00:00.000Z",
    ...SHARED_LINKS,
  });
}

/**
 * Build a generic Requirement Detail profile from the shared requirement
 * definition. Industry overlays stay hand-authored.
 */
export function synthesizeRequirementDetailProfile(
  requirementSlug: string,
): RequirementDetailProfile | null {
  const definition = getCrmRequirementDefinition(requirementSlug);
  if (!definition) return null;

  return RequirementDetailProfileSchema.parse({
    slug: definition.slug,
    name: definition.name,
    displayTitle: definition.name,
    eyebrow: "CRM requirement",
    tagline: definition.tagline,
    shortAnswer: definition.shortAnswer,
    buyerNeedDescription: definition.buyerNeedDescription,
    requirementType: definition.requirementType,
    requirementTypeLabel: definition.requirementTypeLabel,
    typicalImportanceLabel: definition.typicalImportanceLabel,
    categorySlug: CATEGORY_SLUG,
    primaryCapabilitySlug: definition.primaryCapabilitySlug,
    primaryCapabilityName: definition.primaryCapabilityName,
    featureLinks: definition.featureLinks.map((link) => ({
      ...link,
      featurePageSlug: crmFeaturePageSlug(link.featureSlug),
    })),
    // Evaluation criteria → acceptance needs so buyers can check the requirement.
    acceptanceNeeds: definition.evaluationCriteria.map((criterion) => ({
      id: criterion.id,
      title: criterion.name,
      description: criterion.description,
      priority: criterion.importance === "required" ? ("must" as const) : ("nice" as const),
      href: criterion.featureSlugs?.[0]
        ? `/features/${crmFeaturePageSlug(criterion.featureSlugs[0])}/`
        : undefined,
    })),
    evaluationCriteria: definition.evaluationCriteria,
    needGuidance: definition.needGuidance,
    whyItMatters: definition.whyItMatters,
    summarySlots: [
      {
        id: "overall",
        label: "Strongest overall fit",
        selection: "best-overall",
      },
      {
        id: "simple",
        label: "Best for simple needs",
        selection: "best-simplicity",
      },
      {
        id: "complex",
        label: "Best for complex needs",
        selection: "best-complex",
      },
      { id: "value", label: "Best value at scale", selection: "best-value" },
    ],
    scenarios: definition.scenarios,
    useCaseLinks: definition.useCaseLinks,
    industryContexts: [],
    relatedRequirementSlugs: definition.relatedRequirementSlugs,
    relatedCapabilitySlugs: definition.relatedCapabilitySlugs,
    tradeoffs: definition.tradeoffs,
    vendorQuestions: definition.vendorQuestions,
    faq: definition.faq,
    screenshotMatchTerms: definition.screenshotMatchTerms,
    matrixFeatureSlugs: definition.matrixFeatureSlugs,
    lastReviewedAt: "2026-08-15T00:00:00.000Z",
    ...SHARED_LINKS,
  });
}

/** Capability slugs in hub priority order. */
export function crmCapabilitySlugsByHubPriority(): string[] {
  return CRM_CAPABILITIES.map((capability) => capability.slug);
}
