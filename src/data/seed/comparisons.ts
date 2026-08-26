import type { z } from "zod";
import { ComparisonSchema, canonicalizeComparisonSlug } from "@/domain";
import {
  attachExistingSupportingFacts,
  buildCompetitorPairComparisonsFromResearch,
  buildCrmComparisonsFromResearch,
  isThinComparisonMesh,
  normalizeOutcomeConfidence,
  researchedFeatureOutcome,
  researchedFreePlanOutcome,
  softenUnfactedProductA,
} from "@/services/comparison-research";
import {
  buildMissingComparisonShells,
  buildTierHubComparisonShells,
} from "./ecosystem-shells";
import { tierHubComparisonPairs } from "./tier-hub-comparison-pairs";
import { softwareSeed } from "./software";

type ComparisonInput = z.input<typeof ComparisonSchema>;

function overallFromCriterionWins(
  outcomes: Array<{ winnerKind?: string }>,
  slugA: string,
  slugB: string,
): {
  overallWinnerKind: "product-a" | "product-b" | "tie" | "depends";
  overallWinnerSlug: string | null;
} {
  const winsA = outcomes.filter((o) => o.winnerKind === "product-a").length;
  const winsB = outcomes.filter((o) => o.winnerKind === "product-b").length;
  if (winsA > winsB) {
    return { overallWinnerKind: "product-a", overallWinnerSlug: slugA };
  }
  if (winsB > winsA) {
    return { overallWinnerKind: "product-b", overallWinnerSlug: slugB };
  }
  if (winsA > 0 || winsB > 0) {
    return { overallWinnerKind: "tie", overallWinnerSlug: null };
  }
  return { overallWinnerKind: "depends", overallWinnerSlug: null };
}

const SI_CRITERIA = [
  "ease-of-use",
  "contact-data",
  "prospecting",
  "email-outreach",
  "integrations",
  "value-for-money",
] as const;

type SiScores = Record<(typeof SI_CRITERIA)[number], number>;

/** Email-marketing comparisonCriteria (factual + editorial) from category onboarding. */
const EM_COMPARISON_CRITERIA = [
  "starting-pricing",
  "contact-limits",
  "email-limits",
  "automation",
  "templates",
  "segmentation",
  "landing-pages",
  "analytics",
  "integrations",
  "ai-features",
] as const;

/** Marketing-editorial criteria from Wave-2 assessments. */
const MARKETING_CRITERIA = [
  "ease-of-use",
  "campaign-content",
  "marketing-automation",
  "funnel-conversion",
  "analytics-attribution",
  "brand-monitoring",
  "integrations",
  "scalability",
  "value-for-money",
  "ai-capabilities",
] as const;

type MarketingScores = Record<(typeof MARKETING_CRITERIA)[number], number>;

/**
 * Project-management comparisonCriteria from category onboarding —
 * five factual, three editorial.
 */
const PM_COMPARISON_CRITERIA = [
  "starting-pricing",
  "seat-minimum",
  "free-plan",
  "timeline-gantt",
  "automations",
  "ease-of-use",
  "work-planning",
  "automation-workflows",
  "collaboration",
  "integrations",
  "ai-features",
  "reporting",
  "scalability",
  "value-for-money",
] as const;

type PmEditorialScores = {
  integrations: number;
  "ai-features": number;
  reporting: number;
};

type PmFactualNotes = {
  startingPricing: string;
  seatMinimum: string;
  freePlan: string;
  timelineGantt: string;
  automations: string;
};

type PmFactualLead = "a" | "b" | "tie" | "depends";

type PmFactualLeads = Partial<{
  startingPricing: PmFactualLead;
  seatMinimum: PmFactualLead;
  freePlan: PmFactualLead;
  timelineGantt: PmFactualLead;
  automations: PmFactualLead;
}>;

/**
 * HR comparisonCriteria from the activated category definition —
 * three factual, six editorial (job-cluster depth dimensions).
 */
const HR_COMPARISON_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "user-minimum",
  "hiring-workflow",
  "core-hris",
  "payroll-processing",
  "scheduling-depth",
  "training-depth",
  "time-tracking-depth",
  "integrations",
  "mobile",
] as const;

type HrEditorialScores = {
  "hiring-workflow": number;
  "core-hris": number;
  "payroll-processing": number;
  "scheduling-depth": number;
  "training-depth": number;
  "time-tracking-depth": number;
  integrations: number;
  mobile: number;
};

type HrFactualNotes = {
  startingPricing: string;
  freePlan: string;
  userMinimum: string;
};

const HR_EDITORIAL_LABELS: Record<keyof HrEditorialScores, string> = {
  "hiring-workflow": "hiring workflow",
  "core-hris": "core HRIS depth",
  "payroll-processing": "payroll processing",
  "scheduling-depth": "workforce scheduling",
  "training-depth": "training and SOPs",
  "time-tracking-depth": "time tracking",
  integrations: "integrations",
  mobile: "mobile and frontline use",
};

const AI_COMPARISON_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "user-minimum",
  "llm-chat-depth",
  "writing-depth",
  "voice-depth",
  "agent-depth",
  "governance",
  "integrations",
  "usage-model",
] as const;

type AiEditorialScores = {
  "llm-chat-depth": number;
  "writing-depth": number;
  "voice-depth": number;
  "agent-depth": number;
  governance: number;
  integrations: number;
  "usage-model": number;
};

const AI_EDITORIAL_LABELS: Record<keyof AiEditorialScores, string> = {
  "llm-chat-depth": "LLM assistant depth",
  "writing-depth": "writing assistance",
  "voice-depth": "voice / TTS depth",
  "agent-depth": "agent / builder depth",
  governance: "governance & privacy",
  integrations: "integrations",
  "usage-model": "usage / credits model",
};

const IT_COMPARISON_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "user-minimum",
  "itsm-depth",
  "observability-depth",
  "source-control-depth",
  "hosting-panel-depth",
  "web-data-depth",
  "security-admin",
  "integrations",
] as const;

type ItEditorialScores = {
  "itsm-depth": number;
  "observability-depth": number;
  "source-control-depth": number;
  "hosting-panel-depth": number;
  "web-data-depth": number;
  "security-admin": number;
  integrations: number;
};

const IT_EDITORIAL_LABELS: Record<keyof ItEditorialScores, string> = {
  "itsm-depth": "ITSM depth",
  "observability-depth": "observability depth",
  "source-control-depth": "source control depth",
  "hosting-panel-depth": "hosting panel depth",
  "web-data-depth": "web data / proxy depth",
  "security-admin": "security & admin",
  integrations: "integrations",
};

/**
 * Customer-service comparisonCriteria from the activated category definition —
 * three factual, eight editorial (job-cluster depth dimensions).
 */
const CS_COMPARISON_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "agent-minimum",
  "ticketing-depth",
  "live-chat",
  "knowledge-base",
  "omnichannel",
  "sla-routing",
  "ecommerce-helpdesk",
  "ai-features",
  "integrations",
] as const;

type CsEditorialScores = {
  "ticketing-depth": number;
  "live-chat": number;
  "knowledge-base": number;
  omnichannel: number;
  "sla-routing": number;
  "ecommerce-helpdesk": number;
  "ai-features": number;
  integrations: number;
};

type CsFactualNotes = {
  startingPricing: string;
  freePlan: string;
  agentMinimum: string;
};

const CS_EDITORIAL_LABELS: Record<keyof CsEditorialScores, string> = {
  "ticketing-depth": "ticketing depth",
  "live-chat": "live chat",
  "knowledge-base": "knowledge base / self-service",
  omnichannel: "omnichannel inbox",
  "sla-routing": "SLA and routing",
  "ecommerce-helpdesk": "ecommerce helpdesk",
  "ai-features": "AI features",
  integrations: "integrations",
};

const ECOM_COMPARISON_CRITERIA = [
  "starting-pricing",
  "storefront-commerce-fit",
  "catalog-orders-depth",
  "checkout-conversion",
  "integrations",
  "omnichannel-pos",
  "value-for-money",
  "ai-capabilities",
] as const;

type EcomScores = {
  "starting-pricing": number;
  "storefront-commerce-fit": number;
  "catalog-orders-depth": number;
  "checkout-conversion": number;
  integrations: number;
  "omnichannel-pos": number;
  "value-for-money": number;
  "ai-capabilities": number;
};

function approvedEcomPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  scoresA: EcomScores;
  scoresB: EcomScores;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const outcomes = ECOM_COMPARISON_CRITERIA.map((criterionSlug) => {
    const scoreA = input.scoresA[criterionSlug];
    const scoreB = input.scoresB[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const label = criterionSlug.replace(/-/g, " ");
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${label}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${label}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from SoftwareGlimpse ecommerce-editorial assessments — not hands-on lab testing.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  });
  const outcomesWithFacts = attachExistingSupportingFacts(
    input.a,
    input.b,
    outcomes,
  );

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "ecommerce",
    criterionSlugs: [...ECOM_COMPARISON_CRITERIA],
    outcomes: outcomesWithFacts,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Researched comparison of ${input.labels.a} and ${input.labels.b} on ecommerce-editorial criteria inside the same job cluster.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-18T12:00:00.000Z",
      updatedAt: "2026-08-18T12:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} for ecommerce — storefront fit, checkout, integrations, and value.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

/**
 * Business-communications comparisonCriteria from the activated category
 * definition — five factual, four editorial.
 */
const BC_COMPARISON_CRITERIA = [
  "starting-pricing",
  "user-minimum",
  "number-coverage",
  "power-dialer",
  "whatsapp-business",
  "crm-integrations",
  "routing",
  "analytics",
  "ai-features",
] as const;

type BcEditorialScores = {
  "crm-integrations": number;
  routing: number;
  analytics: number;
  "ai-features": number;
};

type BcFactualNotes = {
  startingPricing: string;
  userMinimum: string;
  numberCoverage: string;
  powerDialer: string;
  whatsappBusiness: string;
};

type EmEditorialScores = {
  automation: number;
  segmentation: number;
  analytics: number;
  "ai-features": number;
};

type EmFactualNotes = {
  startingPricing: string;
  contactLimits: string;
  emailLimits: string;
  templates: string;
  landingPages: string;
  integrations: string;
};

/**
 * Comparisons catalogue.
 * CRM pairs are materialized from researched enrichment.
 * SI pairs for BookYourData / Reply.io / Kixie are approved from SI editorial assessments.
 *
 * Slugs are global (product pair only). When a non-CRM approved pair reuses a CRM
 * research slug, drop the CRM auto-pair so assertUniqueSlugs does not fail.
 */
const CRM_PAIRS_OVERRIDDEN_BY_CATEGORY_SEED = new Set([
  // Email-marketing Wave-1 approved pair (EM criteria) wins over CRM auto-pair.
  "activecampaign-vs-mailchimp",
]);

function approvedSiPair(input: {
  a: string;
  b: string;
  title: string;
  scoresA: SiScores;
  scoresB: SiScores;
  labels: { a: string; b: string };
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);
  const outcomes = SI_CRITERIA.map((criterionSlug) => {
    const scoreA = input.scoresA[criterionSlug];
    const scoreB = input.scoresB[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${criterionSlug}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${criterionSlug}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) based on SoftwareGlimpse editorial assessments — not hands-on lab testing.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  });
  const outcomesWithFacts = attachExistingSupportingFacts(
    input.a,
    input.b,
    outcomes,
  );

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "sales-intelligence",
    criterionSlugs: [...SI_CRITERIA],
    outcomes: outcomesWithFacts,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Researched side-by-side comparison of ${input.labels.a} and ${input.labels.b} using sales-intelligence criteria and approved editorial assessments. No universal winner — choose by criterion fit.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T07:05:00.000Z",
      updatedAt: "2026-08-17T07:05:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on contact data, prospecting, outreach, integrations, and value — based on SoftwareGlimpse research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedEmPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: EmEditorialScores; b: EmEditorialScores };
  factual: EmFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (
    criterionSlug: keyof EmEditorialScores,
  ) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${criterionSlug}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${criterionSlug}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from SoftwareGlimpse research-grounded editorial judgments — not hands-on lab testing. ActiveCampaign/Mailchimp scores may map from crm-editorial evidence where EM re-scores are pending.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug:
      | "starting-pricing"
      | "contact-limits"
      | "email-limits"
      | "templates"
      | "landing-pages"
      | "integrations",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    factualOutcome("contact-limits", input.factual.contactLimits),
    factualOutcome("email-limits", input.factual.emailLimits),
    editorialOutcome("automation"),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "templates",
      ["email-templates"],
      input.factual.templates,
    ),
    editorialOutcome("segmentation"),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "landing-pages",
      ["landing-pages"],
      input.factual.landingPages,
    ),
    editorialOutcome("analytics"),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "integrations",
      ["integrations", "forms", "email-sync"],
      input.factual.integrations,
    ),
    editorialOutcome("ai-features"),
  ]);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "email-marketing",
    criterionSlugs: [...EM_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Researched side-by-side comparison of ${input.labels.a} and ${input.labels.b} using email-marketing comparison criteria (factual + editorial). No universal winner — choose by criterion fit.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T12:00:00.000Z",
      updatedAt: "2026-08-17T12:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on pricing, automation, templates, segmentation, and integrations — based on SoftwareGlimpse email-marketing research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedMarketingPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  scoresA: MarketingScores;
  scoresB: MarketingScores;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const outcomes = MARKETING_CRITERIA.map((criterionSlug) => {
    const scoreA = input.scoresA[criterionSlug];
    const scoreB = input.scoresB[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${criterionSlug}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${criterionSlug}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from SoftwareGlimpse marketing-editorial assessments — not hands-on lab testing.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  });
  const outcomesWithFacts = attachExistingSupportingFacts(
    input.a,
    input.b,
    outcomes,
  );

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "marketing",
    criterionSlugs: [...MARKETING_CRITERIA],
    outcomes: outcomesWithFacts,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Researched side-by-side comparison of ${input.labels.a} and ${input.labels.b} using marketing-editorial criteria. No universal winner — choose by primary job fit.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T14:00:00.000Z",
      updatedAt: "2026-08-17T14:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on marketing automation, funnels, social, listening, and value — based on SoftwareGlimpse marketing-editorial research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedPmPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: PmEditorialScores; b: PmEditorialScores };
  factual: PmFactualNotes;
  factualLeads?: PmFactualLeads;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof PmEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const label = criterionSlug.replace(/-/g, " ");
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${label}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${label}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from vendor documentation as of the research date — not lab testing.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug:
      | "starting-pricing"
      | "seat-minimum"
      | "free-plan"
      | "timeline-gantt"
      | "automations",
    reason: string,
    leadKey: keyof PmFactualLeads,
  ) => {
    const lead = input.factualLeads?.[leadKey] ?? "depends";
    const winnerKind =
      lead === "a"
        ? ("product-a" as const)
        : lead === "b"
          ? ("product-b" as const)
          : lead === "tie"
            ? ("tie" as const)
            : ("depends" as const);
    const winnerSlug =
      winnerKind === "product-a"
        ? input.a
        : winnerKind === "product-b"
          ? input.b
          : null;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome(
      "starting-pricing",
      input.factual.startingPricing,
      "startingPricing",
    ),
    factualOutcome("seat-minimum", input.factual.seatMinimum, "seatMinimum"),
    input.factualLeads?.freePlan && input.factualLeads.freePlan !== "depends"
      ? factualOutcome("free-plan", input.factual.freePlan, "freePlan")
      : researchedFreePlanOutcome(
          input.a,
          input.b,
          input.labels.a,
          input.labels.b,
          input.factual.freePlan,
        ),
    input.factualLeads?.timelineGantt &&
    input.factualLeads.timelineGantt !== "depends"
      ? factualOutcome(
          "timeline-gantt",
          input.factual.timelineGantt,
          "timelineGantt",
        )
      : researchedFeatureOutcome(
          input.a,
          input.b,
          input.labels.a,
          input.labels.b,
          "timeline-gantt",
          ["timeline-gantt"],
          input.factual.timelineGantt,
        ),
    input.factualLeads?.automations && input.factualLeads.automations !== "depends"
      ? factualOutcome("automations", input.factual.automations, "automations")
      : researchedFeatureOutcome(
          input.a,
          input.b,
          input.labels.a,
          input.labels.b,
          "automations",
          ["automations-workflows"],
          input.factual.automations,
        ),
    editorialOutcome("integrations"),
    editorialOutcome("ai-features"),
    editorialOutcome("reporting"),
  ]);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "project-management",
    criterionSlugs: [...PM_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Compare ${input.labels.a} and ${input.labels.b} on starting price, seat minimums, free plans, timelines, automations, integrations, and reporting. There is no universal winner — choose by job-cluster fit.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T18:00:00.000Z",
      updatedAt: "2026-08-17T18:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on pricing, seat minimums, timelines, automations, integrations, and reporting — based on SoftwareGlimpse project-management research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

/**
 * Approved HR comparison helper. Use for same-cluster or commonly
 * shortlisted peers (ATS vs ATS, HRIS vs people-platform, payroll vs HRIS).
 * Do not invent ATS-vs-time-clock pages.
 */
function approvedHrPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: HrEditorialScores; b: HrEditorialScores };
  factual: HrFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof HrEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const dimension = HR_EDITORIAL_LABELS[criterionSlug];
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${dimension}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} is the stronger fit for ${dimension}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10). Scores reflect job-cluster fit from vendor documentation, not a lab test of the UI.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug: "starting-pricing" | "free-plan" | "user-minimum",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    researchedFreePlanOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      input.factual.freePlan,
    ),
    factualOutcome("user-minimum", input.factual.userMinimum),
    editorialOutcome("hiring-workflow"),
    editorialOutcome("core-hris"),
    editorialOutcome("payroll-processing"),
    editorialOutcome("scheduling-depth"),
    editorialOutcome("training-depth"),
    editorialOutcome("time-tracking-depth"),
    editorialOutcome("integrations"),
    editorialOutcome("mobile"),
  ]);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "hr",
    criterionSlugs: [...HR_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    overallWinnerKind: "depends",
    overallWinnerSlug: null,
    bestFor: input.bestFor,
    scenarioRecommendations: input.bestFor.flatMap((bf) => {
      const name =
        bf.productSlug === input.a ? input.labels.a : input.labels.b;
      return bf.scenarios.map((scenario) => ({
        scenario,
        preferredSlug: bf.productSlug,
        rationale: `Pick ${name} for ${scenario.replace(/\.$/, "")}.`,
      }));
    }),
    summary: `${input.verdict} Compare published pricing, hiring, core HRIS, payroll, scheduling, training, time tracking, integrations, and mobile.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T20:00:00.000Z",
      updatedAt: "2026-08-17T20:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on pricing, free plans, hiring, core HRIS, payroll, scheduling, training, time tracking, integrations, and mobile readiness — based on SoftwareGlimpse HR research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedAiPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: AiEditorialScores; b: AiEditorialScores };
  factual: HrFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof AiEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) winnerKind = "tie";
    else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const dimension = AI_EDITORIAL_LABELS[criterionSlug];
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${dimension}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${dimension}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10). Scores reflect AI job-cluster fit from vendor documentation.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug: "starting-pricing" | "free-plan" | "user-minimum",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    researchedFreePlanOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      input.factual.freePlan,
    ),
    factualOutcome("user-minimum", input.factual.userMinimum),
    editorialOutcome("llm-chat-depth"),
    editorialOutcome("writing-depth"),
    editorialOutcome("voice-depth"),
    editorialOutcome("agent-depth"),
    editorialOutcome("governance"),
    editorialOutcome("integrations"),
    editorialOutcome("usage-model"),
  ]);

  const overall = overallFromCriterionWins(outcomes, input.a, input.b);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "ai",
    criterionSlugs: [...AI_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    overallWinnerKind: overall.overallWinnerKind,
    overallWinnerSlug: overall.overallWinnerSlug,
    bestFor: input.bestFor,
    scenarioRecommendations: input.bestFor.flatMap((bf) => {
      const name =
        bf.productSlug === input.a ? input.labels.a : input.labels.b;
      return bf.scenarios.map((scenario) => ({
        scenario,
        preferredSlug: bf.productSlug,
        rationale: `Pick ${name} for ${scenario.replace(/\.$/, "")}.`,
      }));
    }),
    summary: `${input.verdict} Compare published pricing, LLM depth, writing, voice, agents, governance, integrations, and usage models.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on AI pricing, governance, integrations, and job-cluster fit.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedItPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: ItEditorialScores; b: ItEditorialScores };
  factual: HrFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof ItEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) winnerKind = "tie";
    else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const dimension = IT_EDITORIAL_LABELS[criterionSlug];
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${dimension}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${dimension}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10). Landscape or cluster fit from vendor documentation.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug: "starting-pricing" | "free-plan" | "user-minimum",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    researchedFreePlanOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      input.factual.freePlan,
    ),
    factualOutcome("user-minimum", input.factual.userMinimum),
    editorialOutcome("itsm-depth"),
    editorialOutcome("observability-depth"),
    editorialOutcome("source-control-depth"),
    editorialOutcome("hosting-panel-depth"),
    editorialOutcome("web-data-depth"),
    editorialOutcome("security-admin"),
    editorialOutcome("integrations"),
  ]);

  const overall = overallFromCriterionWins(outcomes, input.a, input.b);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "it-development",
    criterionSlugs: [...IT_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    overallWinnerKind: overall.overallWinnerKind,
    overallWinnerSlug: overall.overallWinnerSlug,
    bestFor: input.bestFor,
    scenarioRecommendations: input.bestFor.flatMap((bf) => {
      const name =
        bf.productSlug === input.a ? input.labels.a : input.labels.b;
      return bf.scenarios.map((scenario) => ({
        scenario,
        preferredSlug: bf.productSlug,
        rationale: `Pick ${name} for ${scenario.replace(/\.$/, "")}.`,
      }));
    }),
    summary: `${input.verdict} Compare published pricing, ITSM, observability, source control, hosting, web data, security, and integrations.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-18T00:00:00.000Z",
      updatedAt: "2026-08-18T00:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on IT pricing, security, integrations, and job-cluster fit.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

/**
 * Approved CS comparison helper. Use for same-cluster peers
 * (helpdesk vs helpdesk, live chat vs live chat). Do not invent
 * helpdesk-vs-ITSM or live-chat-vs-ecommerce pages.
 */
function approvedCsPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: CsEditorialScores; b: CsEditorialScores };
  factual: CsFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof CsEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const dimension = CS_EDITORIAL_LABELS[criterionSlug];
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${dimension}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} is the stronger fit for ${dimension}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10). Scores reflect job-cluster fit from vendor documentation, not a lab test of the UI.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug: "starting-pricing" | "free-plan" | "agent-minimum",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    researchedFreePlanOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      input.factual.freePlan,
    ),
    factualOutcome("agent-minimum", input.factual.agentMinimum),
    editorialOutcome("ticketing-depth"),
    editorialOutcome("live-chat"),
    editorialOutcome("knowledge-base"),
    editorialOutcome("omnichannel"),
    editorialOutcome("sla-routing"),
    editorialOutcome("ecommerce-helpdesk"),
    editorialOutcome("ai-features"),
    editorialOutcome("integrations"),
  ]);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "customer-service",
    criterionSlugs: [...CS_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    overallWinnerKind: "depends",
    overallWinnerSlug: null,
    bestFor: input.bestFor,
    scenarioRecommendations: input.bestFor.flatMap((bf) => {
      const name =
        bf.productSlug === input.a ? input.labels.a : input.labels.b;
      return bf.scenarios.map((scenario) => ({
        scenario,
        preferredSlug: bf.productSlug,
        rationale: `Pick ${name} for ${scenario.replace(/\.$/, "")}.`,
      }));
    }),
    summary: `${input.verdict} Compare published pricing, ticketing, live chat, knowledge base, omnichannel, SLAs, ecommerce helpdesk fit, AI, and integrations.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-18T12:00:00.000Z",
      updatedAt: "2026-08-18T12:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on pricing, free plans, ticketing, live chat, knowledge base, omnichannel, SLAs, ecommerce helpdesk, AI, and integrations — based on SoftwareGlimpse customer-service research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function approvedBcPair(input: {
  a: string;
  b: string;
  title: string;
  labels: { a: string; b: string };
  editorial: { a: BcEditorialScores; b: BcEditorialScores };
  factual: BcFactualNotes;
  verdict: string;
  pricingNotes: string;
  bestFor: Array<{ productSlug: string; scenarios: string[] }>;
}): ComparisonInput {
  const productSlugs = [input.a, input.b] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);

  const editorialOutcome = (criterionSlug: keyof BcEditorialScores) => {
    const scoreA = input.editorial.a[criterionSlug];
    const scoreB = input.editorial.b[criterionSlug];
    const delta = scoreA - scoreB;
    let winnerKind: "product-a" | "product-b" | "tie" | "depends" = "depends";
    let winnerSlug: string | null = null;
    if (Math.abs(delta) <= 0.5) {
      winnerKind = "tie";
    } else if (delta > 0) {
      winnerKind = "product-a";
      winnerSlug = input.a;
    } else {
      winnerKind = "product-b";
      winnerSlug = input.b;
    }
    const lead =
      winnerKind === "tie"
        ? `${input.labels.a} and ${input.labels.b} are close on ${criterionSlug}`
        : `${winnerSlug === input.a ? input.labels.a : input.labels.b} leads on ${criterionSlug}`;
    return {
      criterionSlug,
      winnerKind,
      winnerSlug,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from SoftwareGlimpse business-communications editorial judgments grounded in vendor documentation — not hands-on lab testing.`,
      confidence: "medium" as const,
      supportingFactIds: [],
      researchStatus: "complete" as const,
    };
  };

  const factualOutcome = (
    criterionSlug:
      | "starting-pricing"
      | "user-minimum"
      | "number-coverage"
      | "power-dialer"
      | "whatsapp-business",
    reason: string,
  ) => ({
    criterionSlug,
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason,
    confidence: "medium" as const,
    supportingFactIds: [],
    researchStatus: "complete" as const,
  });

  const outcomes = attachExistingSupportingFacts(input.a, input.b, [
    factualOutcome("starting-pricing", input.factual.startingPricing),
    factualOutcome("user-minimum", input.factual.userMinimum),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "number-coverage",
      ["cloud-phone"],
      input.factual.numberCoverage,
    ),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "power-dialer",
      ["power-dialer"],
      input.factual.powerDialer,
    ),
    researchedFeatureOutcome(
      input.a,
      input.b,
      input.labels.a,
      input.labels.b,
      "whatsapp-business",
      ["whatsapp-business"],
      input.factual.whatsappBusiness,
    ),
    editorialOutcome("crm-integrations"),
    editorialOutcome("routing"),
    editorialOutcome("analytics"),
    editorialOutcome("ai-features"),
  ]);

  return {
    id: `cmp-${slug}`,
    slug,
    title: input.title,
    productSlugs,
    categorySlug: "business-communications",
    criterionSlugs: [...BC_COMPARISON_CRITERIA],
    outcomes,
    verdict: input.verdict,
    ...overallFromCriterionWins(outcomes, input.a, input.b),
    bestFor: input.bestFor,
    summary: `Researched side-by-side comparison of ${input.labels.a} and ${input.labels.b} using business-communications comparison criteria (factual pricing/coverage plus editorial judgments). No universal winner — choose by criterion fit.`,
    pricingNotes: input.pricingNotes,
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-17T09:00:00.000Z",
      updatedAt: "2026-08-17T09:00:00.000Z",
    },
    seo: {
      title: `${input.title}: Which Is Better?`,
      description: `Compare ${input.labels.a} and ${input.labels.b} on pricing, seat minimums, number coverage, dialer tooling, routing, and CRM integrations — based on SoftwareGlimpse business-communications research.`,
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

const comparisonsSeedRaw: ComparisonInput[] = [
  ...buildCrmComparisonsFromResearch({ autoApprove: true }).filter(
    (c) => !CRM_PAIRS_OVERRIDDEN_BY_CATEGORY_SEED.has(c.slug),
  ),
  // SI pairs completed from existing SI scores already published on sibling comparisons
  // (apollo-vs-bookyourdata, bookyourdata-vs-lusha, bookyourdata-vs-rocketreach) plus
  // first-party CRM assessments — not new invented ranks.
  approvedSiPair({
    a: "apollo",
    b: "lusha",
    title: "Apollo.io vs Lusha",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    labels: { a: "Apollo.io", b: "Lusha" },
    verdict:
      "No universal winner. Choose Apollo when prospecting data and email sequences belong in one seat; choose Lusha when verified contact data, signals, and CRM enrichment sit beside an existing CRM of record. Ease of use, contact data, and integrations are close.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional seats (Basic from $49/month in first-party research). Lusha paid USD list prices were not verified from lusha.com/pricing in this research pass. Confirm current credit packaging on vendor sites.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Outbound teams consolidating prospecting data and email sequences", "Buyers who want a published free/Basic on-ramp"] },
      { productSlug: "lusha", scenarios: ["Teams enriching Salesforce/HubSpot/Pipedrive continuously", "Buyers who need signals and verified contacts as a CRM layer"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "rocketreach",
    title: "Apollo.io vs RocketReach",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 7 },
    labels: { a: "Apollo.io", b: "RocketReach" },
    verdict:
      "No universal winner. Choose Apollo when contact data plus sequencing belong in one seat; choose RocketReach when published individual Essentials/Pro/Ultimate lookup pricing and light sequences are the job. Ease of use, contact data, integrations, and value are close.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional seats; RocketReach publishes individual Essentials/Pro/Ultimate cards (first-party). Confirm live pricing before purchase.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Teams consolidating prospecting data and email sequences", "Buyers who want a free tier to evaluate"] },
      { productSlug: "rocketreach", scenarios: ["Individuals who want transparent published pricing", "Buyers who want contact lookup with light sequences"] },
    ],
  }),
  // Approved SI comparisons for newly researched products
  approvedSiPair({
    a: "apollo",
    b: "bookyourdata",
    title: "Apollo.io vs BookYourData",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 9, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 7, "value-for-money": 9 },
    labels: { a: "Apollo.io", b: "BookYourData" },
    verdict:
      "No universal winner. Choose Apollo when you want contact data plus sequencing in one seat; choose BookYourData when verified pay-as-you-go contacts with never-expiring credits are the job.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional seats; BookYourData is usage-based credit packs (live pack dollar amounts not verified in this pass). Confirm current pricing on vendor sites.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Teams consolidating prospecting data and email sequences", "Buyers who want a free tier to evaluate"] },
      { productSlug: "bookyourdata", scenarios: ["List buyers who prefer credits that never expire", "Teams that already own a sequencer"] },
    ],
  }),
  approvedSiPair({
    a: "bookyourdata",
    b: "lusha",
    title: "BookYourData vs Lusha",
    scoresA: { "ease-of-use": 9, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 7, "value-for-money": 9 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    labels: { a: "BookYourData", b: "Lusha" },
    verdict:
      "No universal winner. BookYourData wins for pay-as-you-go verified list buys; Lusha is the better fit when ongoing CRM enrichment and signals matter more than one-shot credits.",
    pricingNotes:
      "BookYourData uses credit packs without a subscription; Lusha uses seat/credit packaging. Confirm current pricing on vendor sites.",
    bestFor: [
      { productSlug: "bookyourdata", scenarios: ["Campaign list builds with never-expiring credits", "Buyers who want a deliverability guarantee tied to credits"] },
      { productSlug: "lusha", scenarios: ["Teams enriching an existing CRM continuously", "Buyers who need signals alongside reveals"] },
    ],
  }),
  approvedSiPair({
    a: "bookyourdata",
    b: "rocketreach",
    title: "BookYourData vs RocketReach",
    scoresA: { "ease-of-use": 9, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 7, "value-for-money": 9 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 7 },
    labels: { a: "BookYourData", b: "RocketReach" },
    verdict:
      "No universal winner. BookYourData fits pay-as-you-go pack buyers; RocketReach fits shoppers who want published individual Essentials/Pro/Ultimate cards and light sequences.",
    pricingNotes:
      "RocketReach publishes individual plan cards; BookYourData credit-pack dollar amounts were not verified from live pricing HTML in this pass.",
    bestFor: [
      { productSlug: "bookyourdata", scenarios: ["Bulk verified list purchases without a monthly seat", "Teams that already sequence elsewhere"] },
      { productSlug: "rocketreach", scenarios: ["Individuals who want transparent published pricing", "Buyers who want light sequences with contact lookup"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "reply",
    title: "Apollo.io vs Reply.io",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 9, integrations: 8, "value-for-money": 7 },
    labels: { a: "Apollo.io", b: "Reply.io" },
    verdict:
      "No universal winner. Apollo is stronger when free-tier evaluation and prospecting database depth matter; Reply is stronger when multichannel sequences (email/LinkedIn/calls/SMS/WhatsApp) and AI outreach are the core job.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional; Reply publishes Email Volume from $49/user/mo and Multichannel from $89/user/mo (first-party figures — reconfirm on reply.io/pricing).",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Teams that want a free tier before buying", "Buyers prioritizing prospecting database breadth"] },
      { productSlug: "reply", scenarios: ["SDR teams running true multichannel cadences", "Agencies needing multichannel + AI SDR packaging"] },
    ],
  }),
  approvedSiPair({
    a: "amplemarket",
    b: "reply",
    title: "Amplemarket vs Reply.io",
    scoresA: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 8, integrations: 8, "value-for-money": 5 },
    scoresB: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 9, integrations: 8, "value-for-money": 7 },
    labels: { a: "Amplemarket", b: "Reply.io" },
    verdict:
      "No universal winner. Amplemarket fits AI-first outbound specialists; Reply fits teams that want published Email Volume/Multichannel packaging and broader channel steps in one sequencer.",
    pricingNotes:
      "Reply publishes entry seat prices; Amplemarket is typically more quote-oriented. Confirm current commercial terms with both vendors.",
    bestFor: [
      { productSlug: "amplemarket", scenarios: ["AI SDR autonomy is the primary evaluation criterion"] },
      { productSlug: "reply", scenarios: ["Published starting prices matter for budgeting", "WhatsApp/SMS/calls belong in the same sequence as email"] },
    ],
  }),
  approvedSiPair({
    a: "closely",
    b: "reply",
    title: "Closely vs Reply.io",
    scoresA: { "ease-of-use": 7, "contact-data": 6, prospecting: 8, "email-outreach": 7, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 9, integrations: 8, "value-for-money": 7 },
    labels: { a: "Closely", b: "Reply.io" },
    verdict:
      "No universal winner. Closely fits LinkedIn+email automation with clear mid-market list pricing and white-label needs; Reply fits broader multichannel sequences with bundled Reply Data.",
    pricingNotes:
      "Closely publishes Starter/Growth/Essential USD cards; Reply publishes Email Volume/Multichannel starting prices. Confirm live pricing before purchase.",
    bestFor: [
      { productSlug: "closely", scenarios: ["Agencies needing white-label LinkedIn+email infrastructure", "Buyers who want transparent mid-market list pricing"] },
      { productSlug: "reply", scenarios: ["Teams needing SMS/WhatsApp/calls alongside email and LinkedIn", "Buyers who want built-in B2B data with the sequencer"] },
    ],
  }),
  approvedSiPair({
    a: "close",
    b: "kixie",
    title: "Close vs Kixie",
    scoresA: { "ease-of-use": 8, "contact-data": 5, prospecting: 7, "email-outreach": 8, integrations: 7, "value-for-money": 6 },
    scoresB: { "ease-of-use": 8, "contact-data": 4, prospecting: 6, "email-outreach": 4, integrations: 9, "value-for-money": 5 },
    labels: { a: "Close", b: "Kixie" },
    verdict:
      "No universal winner. Close wins when you want calling inside a pipeline CRM; Kixie wins when you already have a CRM and need a power-dialer / business-phone layer with bi-directional sync.",
    pricingNotes:
      "Close publishes CRM plan pricing; Kixie plan names are public but seat dollar amounts are quote-gated. Confirm quotes and add-ons before comparing total cost.",
    bestFor: [
      { productSlug: "close", scenarios: ["Teams that want dialer + deal pipeline in one product"] },
      { productSlug: "kixie", scenarios: ["Outbound pods with HubSpot/Salesforce already in place", "Teams that need multi-line power dialing and SMS"] },
    ],
  }),
  approvedSiPair({
    a: "amplemarket",
    b: "kixie",
    title: "Amplemarket vs Kixie",
    scoresA: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 8, integrations: 8, "value-for-money": 5 },
    scoresB: { "ease-of-use": 8, "contact-data": 4, prospecting: 6, "email-outreach": 4, integrations: 9, "value-for-money": 5 },
    labels: { a: "Amplemarket", b: "Kixie" },
    verdict:
      "No universal winner. Amplemarket fits multichannel AI outbound; Kixie fits high-volume calling and SMS with CRM write-back.",
    pricingNotes:
      "Both tend toward quote-oriented commercial conversations at higher tiers. Model total cost including dialer add-ons vs AI outbound seats.",
    bestFor: [
      { productSlug: "amplemarket", scenarios: ["Email/LinkedIn AI outbound is the primary motion"] },
      { productSlug: "kixie", scenarios: ["Phone connect rate and power dialing are the primary motion"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "kixie",
    title: "Apollo.io vs Kixie",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 4, prospecting: 6, "email-outreach": 4, integrations: 9, "value-for-money": 5 },
    labels: { a: "Apollo.io", b: "Kixie" },
    verdict:
      "No universal winner. Apollo fits prospecting data and email sequences; Kixie fits CRM-connected power dialing and SMS for call-led teams.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional; Kixie seat prices are quote-gated. Do not compare list prices as if both publish the same model.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Bottleneck is contacts + email sequencing", "Free-tier evaluation matters"] },
      { productSlug: "kixie", scenarios: ["Bottleneck is dialer productivity and call/SMS CRM logging"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "zoominfo",
    title: "Apollo.io vs ZoomInfo",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    labels: { a: "Apollo.io", b: "ZoomInfo" },
    verdict:
      "No universal winner. Apollo fits teams that want published seats, free-tier evaluation, and built-in email sequencing; ZoomInfo fits enterprise GTM stacks that prioritize deeper contact data, intent/prospecting depth, and CRM sync over list price.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional seats; ZoomInfo is custom-quote packaging. Do not treat Apollo list prices as equivalent to ZoomInfo enterprise contracts.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Teams that need contact data plus email sequences in one seat", "Buyers who want a free tier before committing"] },
      { productSlug: "zoominfo", scenarios: ["Enterprise buyers prioritizing data depth and CRM enrichment", "RevOps stacks that need strong CRM sync and intent-led prospecting"] },
    ],
  }),
  approvedSiPair({
    a: "zoominfo",
    b: "cognism",
    title: "ZoomInfo vs Cognism",
    scoresA: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 6 },
    labels: { a: "ZoomInfo", b: "Cognism" },
    verdict:
      "No universal winner. ZoomInfo leads when US/enterprise intent, enrichment breadth, and CRM sync depth matter most; Cognism fits buyers who want compliance-first phone-verified mobiles (especially EMEA) and slightly better value than ZoomInfo’s quote-led packaging — neither is an email sequencer.",
    pricingNotes:
      "Both are typically quote-led (ZoomInfo enterprise packages; Cognism Sales Prospecting plans). Confirm coverage geography and mobile verification SLAs in the quote, not from list pages alone.",
    bestFor: [
      { productSlug: "zoominfo", scenarios: ["US/global enterprise GTM with intent and enrichment as the core job", "Teams that need the deepest CRM sync and Copilot-style workflows"] },
      { productSlug: "cognism", scenarios: ["EMEA-heavy pipelines needing GDPR-conscious phone-verified mobiles", "Buyers who want strong contact data without ZoomInfo’s enterprise price point"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "cognism",
    title: "Apollo.io vs Cognism",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 6 },
    labels: { a: "Apollo.io", b: "Cognism" },
    verdict:
      "No universal winner. Apollo wins when built-in email outreach and a free tier matter; Cognism wins when phone-verified contact quality and CRM enrichment are the job and sequencing lives elsewhere.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional; Cognism is quote-led Sales Prospecting packaging. Model total cost including whether you still need a separate sequencer with Cognism.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Outbound teams consolidating data and email sequences", "Buyers evaluating with a free tier first"] },
      { productSlug: "cognism", scenarios: ["Teams that already own a sequencer and need verified mobiles", "EMEA compliance-sensitive prospecting and enrichment"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "linkedin-sales-navigator",
    title: "Apollo.io vs LinkedIn Sales Navigator",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 5, prospecting: 9, "email-outreach": 4, integrations: 7, "value-for-money": 7 },
    labels: { a: "Apollo.io", b: "LinkedIn Sales Navigator" },
    verdict:
      "No universal winner. Apollo fits contact-database + email sequencing workflows; Sales Navigator fits LinkedIn-native prospecting and relationship signals where exported emails/phones are secondary.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional; Sales Navigator Core starts around US$119.99/mo with Advanced Plus for stronger CRM sync — confirm current LinkedIn list prices and seat minimums.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Bottleneck is verified emails plus sequenced outreach", "Teams that want a free tier and an all-in-one SI seat"] },
      { productSlug: "linkedin-sales-navigator", scenarios: ["Prospecting lives inside LinkedIn networks and Buyer Intent", "Sellers who prioritize InMail and warm paths over email databases"] },
    ],
  }),
  approvedSiPair({
    a: "lusha",
    b: "linkedin-sales-navigator",
    title: "Lusha vs LinkedIn Sales Navigator",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    scoresB: { "ease-of-use": 8, "contact-data": 5, prospecting: 9, "email-outreach": 4, integrations: 7, "value-for-money": 7 },
    labels: { a: "Lusha", b: "LinkedIn Sales Navigator" },
    verdict:
      "No universal winner. Lusha fits CRM enrichment and contact reveals; Sales Navigator fits LinkedIn-graph prospecting and intent where contact-data exports matter less than relationship context.",
    pricingNotes:
      "Lusha uses seat/credit packaging; Sales Navigator publishes Core from about US$119.99/mo (Advanced Plus for CRM). Confirm credit burn vs LinkedIn seat cost for your team size.",
    bestFor: [
      { productSlug: "lusha", scenarios: ["Ongoing CRM enrichment and contact reveals", "Teams that need emails/phones more than LinkedIn InMail"] },
      { productSlug: "linkedin-sales-navigator", scenarios: ["Account-based sellers working LinkedIn Buyer Intent and network paths", "Buyers who want published seat pricing and easier day-to-day UX"] },
    ],
  }),
  approvedSiPair({
    a: "zoominfo",
    b: "linkedin-sales-navigator",
    title: "ZoomInfo vs LinkedIn Sales Navigator",
    scoresA: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    scoresB: { "ease-of-use": 8, "contact-data": 5, prospecting: 9, "email-outreach": 4, integrations: 7, "value-for-money": 7 },
    labels: { a: "ZoomInfo", b: "LinkedIn Sales Navigator" },
    verdict:
      "No universal winner. ZoomInfo wins for enterprise contact data, enrichment, and CRM sync; Sales Navigator wins for LinkedIn-native prospecting UX and clearer published seat value — contact-data scores stay intentionally lower on LinkedIn.",
    pricingNotes:
      "ZoomInfo is custom-quote enterprise packaging; Sales Navigator Core starts around US$119.99/mo. Compare total cost of ownership, not feature parity on emails alone.",
    bestFor: [
      { productSlug: "zoominfo", scenarios: ["Enterprise data + enrichment + CRM sync as the primary stack", "RevOps needing intent and Copilot workflows outside LinkedIn"] },
      { productSlug: "linkedin-sales-navigator", scenarios: ["Sellers whose pipeline starts on LinkedIn relationships and InMail", "Teams that want published seats and lighter onboarding than ZoomInfo"] },
    ],
  }),
  approvedSiPair({
    a: "cognism",
    b: "lusha",
    title: "Cognism vs Lusha",
    scoresA: { "ease-of-use": 7, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 6 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    labels: { a: "Cognism", b: "Lusha" },
    verdict:
      "No universal winner. Cognism fits phone-verified, compliance-led contact data and stronger prospecting depth; Lusha fits lighter enrichment plus modest in-product outreach when Cognism’s email-outreach gap is a non-issue because you sequence elsewhere.",
    pricingNotes:
      "Cognism is quote-led Sales Prospecting packaging; Lusha uses seat/credit plans. Confirm mobile verification coverage and credit models against your geography before buying.",
    bestFor: [
      { productSlug: "cognism", scenarios: ["Phone-verified mobiles and EMEA/compliance-first data quality", "Teams that already sequence email outside the SI tool"] },
      { productSlug: "lusha", scenarios: ["SMB/mid-market enrichment with lighter packaging", "Buyers who want some outreach capability alongside reveals"] },
    ],
  }),
  approvedSiPair({
    a: "sixsense",
    b: "demandbase",
    title: "6sense vs Demandbase",
    scoresA: { "ease-of-use": 5, "contact-data": 7, prospecting: 8, "email-outreach": 6, integrations: 8, "value-for-money": 5 },
    scoresB: { "ease-of-use": 5, "contact-data": 7, prospecting: 8, "email-outreach": 4, integrations: 8, "value-for-money": 5 },
    labels: { a: "6sense", b: "Demandbase" },
    verdict:
      "No universal winner. Choose 6sense when predictive intent and account prioritization are the primary ABM jobs; choose Demandbase when unified account-based orchestration (data + engagement + ABM) across the revenue stack matters more.",
    pricingNotes:
      "Both are custom-quote enterprise ABM platforms with no public seat dollar prices. Compare modules, implementation scope, and credit/license models in RFPs — not list pages.",
    bestFor: [
      { productSlug: "sixsense", scenarios: ["Predictive buying intent and in-market account prioritization", "Enterprise ABM teams centered on sales intelligence scoring"] },
      { productSlug: "demandbase", scenarios: ["Unified Demandbase One ABX orchestration across marketing and sales", "Teams that need intent plus advertising/engagement connected to CRM"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "seamless-ai",
    title: "Apollo.io vs Seamless.AI",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 8, "value-for-money": 6 },
    labels: { a: "Apollo.io", b: "Seamless.AI" },
    verdict:
      "No universal winner. Apollo fits teams that want clearer published Free/Basic/Professional rungs plus data and sequencing in one seat; Seamless.AI fits high-volume Chrome-led contact prospecting with freemium entry when Pro/Enterprise quote opacity is acceptable.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional seats; Seamless.AI has a free tier but Pro/Enterprise packaging can be quote-led. Confirm credit burn and paid-tier dollars on vendor sites before comparing TCO.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Teams consolidating prospecting data and email sequences with published seat rungs", "Buyers who want a free tier and clearer paid packaging"] },
      { productSlug: "seamless-ai", scenarios: ["SDR teams doing high-volume Chrome/LinkedIn contact capture", "Buyers prioritizing freemium contact discovery before Pro/Enterprise"] },
    ],
  }),
  approvedSiPair({
    a: "apollo",
    b: "clay",
    title: "Apollo.io vs Clay",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 6, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    labels: { a: "Apollo.io", b: "Clay" },
    verdict:
      "No universal winner. Apollo wins when all-in-one contact data plus native sequencing and easier day-to-day UX matter; Clay wins when multi-provider enrichment waterfalls and GTM engineering workflows are the primary job.",
    pricingNotes:
      "Apollo publishes Free/Basic/Professional; Clay publishes Free plus Launch/Growth headline pricing (credits across providers can still surprise budgets). Model provider credit spend separately from seat price.",
    bestFor: [
      { productSlug: "apollo", scenarios: ["Outbound teams consolidating database and email sequences", "Buyers who want simpler UX than a GTM workflow builder"] },
      { productSlug: "clay", scenarios: ["RevOps/GTM engineers building multi-provider enrichment waterfalls", "Teams consolidating many data vendors into one orchestration layer"] },
    ],
  }),
  approvedSiPair({
    a: "clay",
    b: "clearbit",
    title: "Clay vs Clearbit",
    scoresA: { "ease-of-use": 6, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 7, prospecting: 4, "email-outreach": 2, integrations: 8, "value-for-money": 7 },
    labels: { a: "Clay", b: "Clearbit" },
    verdict:
      "No universal winner. Clay fits multi-provider waterfall enrichment and creative GTM prospecting systems; Clearbit (Breeze Intelligence) fits HubSpot-native CRM and inbound enrichment when you already buy HubSpot credits.",
    pricingNotes:
      "Clay has Free plus published Launch/Growth headlines; Clearbit enrichment is usage/credits via HubSpot (Starter+ required). Do not compare Clay seats as equivalent to HubSpot credit packs.",
    bestFor: [
      { productSlug: "clay", scenarios: ["Multi-provider enrichment waterfalls and Claygent-style research workflows", "Teams not locked to HubSpot-only enrichment"] },
      { productSlug: "clearbit", scenarios: ["HubSpot shops needing CRM/form fill via Breeze Intelligence", "Marketing/RevOps prioritizing inbound enrichment over list building"] },
    ],
  }),
  approvedSiPair({
    a: "seamless-ai",
    b: "lusha",
    title: "Seamless.AI vs Lusha",
    scoresA: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 8, "value-for-money": 6 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    labels: { a: "Seamless.AI", b: "Lusha" },
    verdict:
      "No universal winner. Seamless.AI fits high-volume contact prospecting and Chrome-led list building with stronger outreach scores; Lusha fits enrichment of existing CRM records and signals when volume list building is secondary.",
    pricingNotes:
      "Seamless.AI freemium entry with quote-led Pro/Enterprise; Lusha uses seat/credit packaging. Confirm credit allowances and coverage in your regions before choosing.",
    bestFor: [
      { productSlug: "seamless-ai", scenarios: ["High-volume SDR contact discovery and Chrome prospecting", "Teams that want freemium evaluation plus outreach support"] },
      { productSlug: "lusha", scenarios: ["Enriching incomplete CRM records with signals", "Buyers who need enrichment quality more than raw list volume"] },
    ],
  }),
  approvedSiPair({
    a: "sixsense",
    b: "zoominfo",
    title: "6sense vs ZoomInfo",
    scoresA: { "ease-of-use": 5, "contact-data": 7, prospecting: 8, "email-outreach": 6, integrations: 8, "value-for-money": 5 },
    scoresB: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    labels: { a: "6sense", b: "ZoomInfo" },
    verdict:
      "No universal winner. 6sense fits predictive ABM intent and account prioritization; ZoomInfo fits deeper enterprise contact/company data, enrichment breadth, and CRM sync when the primary job is a GTM data platform rather than ABM orchestration alone.",
    pricingNotes:
      "Both are custom-quote enterprise packages. Compare intent/ABM modules versus contact-database depth and credit models in the same RFP — list prices are not published for either.",
    bestFor: [
      { productSlug: "sixsense", scenarios: ["Enterprise ABM centered on predictive intent and in-market accounts", "Revenue orgs orchestrating marketing + sales on shared account intelligence"] },
      { productSlug: "zoominfo", scenarios: ["Enterprise NA data depth, enrichment, and Copilot-style workflows", "RevOps needing the deepest CRM sync and contact coverage"] },
    ],
  }),
  approvedSiPair({
    a: "clearbit",
    b: "lusha",
    title: "Clearbit vs Lusha",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 4, "email-outreach": 2, integrations: 8, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 6, "email-outreach": 6, integrations: 7, "value-for-money": 5 },
    labels: { a: "Clearbit", b: "Lusha" },
    verdict:
      "No universal winner. Clearbit wins for HubSpot-native enrichment simplicity; Lusha wins when you need broader contact reveals, prospecting, and light Engage sequences outside a HubSpot-only motion.",
    pricingNotes:
      "Clearbit runs on HubSpot usage/credits (Starter+); Lusha uses seat/credit plans. If you are not on HubSpot, Clearbit is usually the wrong shortlist — compare Lusha or Clay instead.",
    bestFor: [
      { productSlug: "clearbit", scenarios: ["HubSpot CRM and inbound form enrichment via Breeze Intelligence", "Teams that want enrichment without a separate prospecting database"] },
      { productSlug: "lusha", scenarios: ["SMB/mid-market enrichment plus contact reveals and signals", "Buyers who need some outreach alongside data outside HubSpot-only stacks"] },
    ],
  }),
  approvedSiPair({
    a: "bombora",
    b: "sixsense",
    title: "Bombora vs 6sense",
    scoresA: { "ease-of-use": 6, "contact-data": 3, prospecting: 4, "email-outreach": 2, integrations: 7, "value-for-money": 5 },
    scoresB: { "ease-of-use": 5, "contact-data": 7, prospecting: 8, "email-outreach": 6, integrations: 8, "value-for-money": 5 },
    labels: { a: "Bombora", b: "6sense" },
    verdict:
      "No universal winner. Bombora fits buyers who need a third-party Company Surge® intent data layer to feed existing tools; 6sense fits buyers who want predictive intent packaged inside an enterprise ABM/sales intelligence platform.",
    pricingNotes:
      "Both are custom-quote. Bombora is an intent specialist (not a contact database); 6sense bundles predictive modules with broader sales intelligence. Compare data-feed vs platform scope in the quote.",
    bestFor: [
      { productSlug: "bombora", scenarios: ["Adding Company Surge intent into an existing CRM/MAP/ABM stack", "Teams that already own contact data and only need intent signals"] },
      { productSlug: "sixsense", scenarios: ["Enterprise predictive ABM with account prioritization in one platform", "Revenue teams that want intent plus sales intelligence orchestration"] },
    ],
  }),
  approvedSiPair({
    a: "clay",
    b: "zoominfo",
    title: "Clay vs ZoomInfo",
    scoresA: { "ease-of-use": 6, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    labels: { a: "Clay", b: "ZoomInfo" },
    verdict:
      "No universal winner. Clay fits GTM engineers building multi-provider waterfalls with clearer self-serve packaging; ZoomInfo fits enterprise buyers prioritizing proprietary data depth, intent, and CRM sync under custom-quote contracts.",
    pricingNotes:
      "Clay publishes Free/Launch/Growth headlines; ZoomInfo is custom-quote enterprise packaging. Provider credits in Clay and ZoomInfo licenses/add-ons both drive real TCO — model usage, not sticker alone.",
    bestFor: [
      { productSlug: "clay", scenarios: ["Multi-provider enrichment and creative GTM workflows", "Teams that want published headline pricing and waterfall flexibility"] },
      { productSlug: "zoominfo", scenarios: ["Enterprise NA contact depth, intent, and Copilot-style prioritization", "RevOps needing deep CRM sync under an enterprise data contract"] },
    ],
  }),
  approvedSiPair({
    a: "demandbase",
    b: "zoominfo",
    title: "Demandbase vs ZoomInfo",
    scoresA: { "ease-of-use": 5, "contact-data": 7, prospecting: 8, "email-outreach": 4, integrations: 8, "value-for-money": 5 },
    scoresB: { "ease-of-use": 6, "contact-data": 9, prospecting: 9, "email-outreach": 6, integrations: 9, "value-for-money": 5 },
    labels: { a: "Demandbase", b: "ZoomInfo" },
    verdict:
      "No universal winner. Demandbase fits enterprise account-based orchestration (ABX) across marketing and sales; ZoomInfo fits deeper contact/company data and enrichment when the primary job is a GTM intelligence database rather than ABM platform orchestration.",
    pricingNotes:
      "Both are custom-quote. Compare ABM orchestration scope (Demandbase One) versus contact-database and Copilot depth (ZoomInfo) in the same evaluation — neither publishes main-platform seat dollars.",
    bestFor: [
      { productSlug: "demandbase", scenarios: ["Enterprise ABM/ABX orchestration with intent and advertising connected to CRM", "Revenue orgs comparing Demandbase One vs peer ABM stacks"] },
      { productSlug: "zoominfo", scenarios: ["Enterprise contact data depth, enrichment, and CRM sync", "Teams whose bottleneck is GTM data coverage more than ABM campaign orchestration"] },
    ],
  }),
  // SI Priority-3 approved pairs
  approvedSiPair({
    a: "hunter",
    b: "apollo",
    title: "Hunter vs Apollo",
    scoresA: { "ease-of-use": 9, "contact-data": 7, prospecting: 7, "email-outreach": 8, integrations: 7, "value-for-money": 8 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 9, "email-outreach": 8, integrations: 8, "value-for-money": 8 },
    labels: { a: "Hunter", b: "Apollo" },
    verdict:
      "No universal winner. Hunter fits SMB teams that want a simple domain email finder + verifier + cold email sequences with clear published pricing from $49/mo; Apollo fits teams that need broader contact/company database depth plus engagement in one platform.",
    pricingNotes:
      "Hunter publishes Free/Starter/Growth/Scale dollars; Apollo publishes self-serve plan ladders with credit limits. Model credits and sequence volume, not sticker alone.",
    bestFor: [
      { productSlug: "hunter", scenarios: ["Domain email find/verify plus cold email sequences on a transparent SMB budget", "Teams prioritizing ease of use over enterprise database breadth"] },
      { productSlug: "apollo", scenarios: ["Outbound teams needing large B2B databases plus sequencing in one vendor", "SDR teams building high-volume prospect lists weekly"] },
    ],
  }),
  approvedSiPair({
    a: "hunter",
    b: "snov",
    title: "Hunter vs Snov.io",
    scoresA: { "ease-of-use": 9, "contact-data": 7, prospecting: 7, "email-outreach": 8, integrations: 7, "value-for-money": 8 },
    scoresB: { "ease-of-use": 7, "contact-data": 7, prospecting: 7, "email-outreach": 8, integrations: 7, "value-for-money": 8 },
    labels: { a: "Hunter", b: "Snov.io" },
    verdict:
      "No universal winner. Hunter edges ease-of-use and polished domain-search UX; Snov.io is a strong budget SMB peer with finder + verifier + drips from $39/mo Starter. Choose by UX preference and credit packaging fit.",
    pricingNotes:
      "Both publish SMB ladders (Hunter from $49/mo Starter; Snov from $39/mo Starter) plus free/trial entry. Confirm current credit volumes on each vendor pricing page.",
    bestFor: [
      { productSlug: "hunter", scenarios: ["Teams that want the simplest domain-finder + sequences experience", "Buyers comparing polished All-in-one email prospecting UX"] },
      { productSlug: "snov", scenarios: ["Budget SMB outbound needing finder + drips under a lower entry rung", "Teams that also want LinkedIn extension workflows beside email"] },
    ],
  }),
  approvedSiPair({
    a: "snov",
    b: "apollo",
    title: "Snov.io vs Apollo",
    scoresA: { "ease-of-use": 7, "contact-data": 7, prospecting: 7, "email-outreach": 8, integrations: 7, "value-for-money": 8 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 9, "email-outreach": 8, integrations: 8, "value-for-money": 8 },
    labels: { a: "Snov.io", b: "Apollo" },
    verdict:
      "No universal winner. Snov.io fits budget SMB teams consolidating finder + cold email drips; Apollo fits teams that need deeper database breadth and a more complete GTM data+engagement platform.",
    pricingNotes:
      "Snov publishes Starter/Pro ladders from $39/mo; Apollo publishes self-serve plans with credit governance. Ultra on Snov is contact-sales — do not invent unpublished Ultra dollars.",
    bestFor: [
      { productSlug: "snov", scenarios: ["Budget SMB outbound needing finder + verifier + drips", "Teams prioritizing entry price over database depth"] },
      { productSlug: "apollo", scenarios: ["Teams needing larger B2B coverage plus sequencing", "SDR orgs consolidating data and engagement spend"] },
    ],
  }),
  approvedSiPair({
    a: "uplead",
    b: "apollo",
    title: "UpLead vs Apollo",
    scoresA: { "ease-of-use": 8, "contact-data": 8, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 9, "email-outreach": 8, integrations: 8, "value-for-money": 8 },
    labels: { a: "UpLead", b: "Apollo" },
    verdict:
      "No universal winner. UpLead fits buyers who want a verified contact DB with real-time email verification and published credit plans from $99/mo while keeping sequencing elsewhere; Apollo fits teams that want data and outreach in one platform.",
    pricingNotes:
      "UpLead: Essentials $99 / Plus $199 / Professional contact sales (7-day trial). Apollo: self-serve published plans with credits. Compare verification posture and whether you already own a sequencer.",
    bestFor: [
      { productSlug: "uplead", scenarios: ["Verified contact data with real-time email verification as the primary job", "Teams that already run a separate sequencer"] },
      { productSlug: "apollo", scenarios: ["Combined prospecting data + native sequences", "Teams consolidating database and outreach vendors"] },
    ],
  }),
  approvedSiPair({
    a: "uplead",
    b: "lusha",
    title: "UpLead vs Lusha",
    scoresA: { "ease-of-use": 8, "contact-data": 8, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 8, prospecting: 7, "email-outreach": 6, integrations: 8, "value-for-money": 7 },
    labels: { a: "UpLead", b: "Lusha" },
    verdict:
      "No universal winner. UpLead leans verified list building with real-time email verification claims; Lusha leans enrichment of records you already own plus signals/Engage. Choose by whether the bottleneck is new lists or incomplete CRM records.",
    pricingNotes:
      "UpLead publishes Essentials/Plus credit plans from $99/mo; Lusha publishes credit plans with free entry. Model credit burn for your region and motion.",
    bestFor: [
      { productSlug: "uplead", scenarios: ["Building verified outbound lists from a contact database", "Buyers prioritizing real-time email verification claims"] },
      { productSlug: "lusha", scenarios: ["Enriching existing CRM/contact records", "Teams that want signals and Engage on enriched records"] },
    ],
  }),
  approvedSiPair({
    a: "leadiq",
    b: "lusha",
    title: "LeadIQ vs Lusha",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 8, "email-outreach": 5, integrations: 9, "value-for-money": 6 },
    scoresB: { "ease-of-use": 8, "contact-data": 8, prospecting: 7, "email-outreach": 6, integrations: 8, "value-for-money": 7 },
    labels: { a: "LeadIQ", b: "Lusha" },
    verdict:
      "No universal winner. LeadIQ fits Chrome/LinkedIn-adjacent capture with especially strong CRM sync into Salesforce/HubSpot and engagement handoff; Lusha fits enrichment-first SMB data with clearer value for lighter budgets.",
    pricingNotes:
      "LeadIQ Free (50 credits) then Pro from $200/mo credit slider; Lusha publishes freemium + paid credit plans. Model Pro slider credits carefully against Lusha allowances.",
    bestFor: [
      { productSlug: "leadiq", scenarios: ["SDR capture-in-flow into CRM with Outreach/Salesloft handoff", "Teams prioritizing CRM sync depth over lowest entry price"] },
      { productSlug: "lusha", scenarios: ["Enrichment-first SMB contact data and signals", "Buyers who want Engage sequences closer to the data product"] },
    ],
  }),
  approvedSiPair({
    a: "leadiq",
    b: "seamless-ai",
    title: "LeadIQ vs Seamless.AI",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 8, "email-outreach": 5, integrations: 9, "value-for-money": 6 },
    scoresB: { "ease-of-use": 7, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 8, "value-for-money": 6 },
    labels: { a: "LeadIQ", b: "Seamless.AI" },
    verdict:
      "No universal winner. LeadIQ fits teams that care most about CRM hygiene and engagement-tool handoff from Chrome capture; Seamless.AI fits high-volume freemium contact discovery with stronger built-in outreach posture.",
    pricingNotes:
      "LeadIQ Pro from $200/mo; Seamless Free + Pro/Enterprise (often quote-led). Compare credit models and whether native outreach depth matters.",
    bestFor: [
      { productSlug: "leadiq", scenarios: ["CRM-first capture with Salesforce/HubSpot sync strength", "Orgs already standardized on Outreach/Salesloft"] },
      { productSlug: "seamless-ai", scenarios: ["High-volume contact prospecting with freemium evaluation", "Teams wanting more outreach support inside the data tool"] },
    ],
  }),
  approvedSiPair({
    a: "kaspr",
    b: "cognism",
    title: "Kaspr vs Cognism",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 7, "email-outreach": 3, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 7, "contact-data": 9, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 6 },
    labels: { a: "Kaspr", b: "Cognism" },
    verdict:
      "No universal winner. Kaspr fits SMB/mid-market LinkedIn Chrome capture with EU/EMEA emphasis and transparent Free/Starter packaging; Cognism fits compliance-first EMEA phone-verified data buyers who can absorb a heavier GTM data platform evaluation.",
    pricingNotes:
      "Kaspr publishes Free + annual Starter/Business headlines ($49/$79); Cognism is typically quote-led for Diamond-style packaging. Compare phone credit limits vs phone-verified mobile depth.",
    bestFor: [
      { productSlug: "kaspr", scenarios: ["LinkedIn-centric EU contact capture on an SMB budget", "Teams wanting Free plan evaluation before annual Starter"] },
      { productSlug: "cognism", scenarios: ["Compliance-first EMEA phone-verified mobiles", "Mid-market/enterprise buyers running a formal data-platform evaluation"] },
    ],
  }),
  approvedSiPair({
    a: "kaspr",
    b: "lusha",
    title: "Kaspr vs Lusha",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 7, "email-outreach": 3, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 8, prospecting: 7, "email-outreach": 6, integrations: 8, "value-for-money": 7 },
    labels: { a: "Kaspr", b: "Lusha" },
    verdict:
      "No universal winner. Kaspr is LinkedIn-centric EU/EMEA capture; Lusha is broader enrichment-first contact data with Engage. Choose by LinkedIn Chrome workflow vs enrichment/signals depth.",
    pricingNotes:
      "Both offer free entry and published paid rungs. Kaspr annual Starter $49 headline; Lusha credit plans vary — confirm phone vs email credit rules on each site.",
    bestFor: [
      { productSlug: "kaspr", scenarios: ["EU LinkedIn/Sales Navigator reveal workflows", "SMB teams capturing phones/emails from LinkedIn into CRM"] },
      { productSlug: "lusha", scenarios: ["Enriching existing records with signals and Engage", "Teams needing broader enrichment beyond LinkedIn-only capture"] },
    ],
  }),
  approvedSiPair({
    a: "ocean",
    b: "clay",
    title: "Ocean.io vs Clay",
    scoresA: { "ease-of-use": 7, "contact-data": 7, prospecting: 8, "email-outreach": 2, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 6, "contact-data": 8, prospecting: 8, "email-outreach": 8, integrations: 7, "value-for-money": 7 },
    labels: { a: "Ocean.io", b: "Clay" },
    verdict:
      "No universal winner. Ocean.io fits lookalike/similar-company prospecting with usage-priced credit enrichment and unlimited seats; Clay fits GTM engineers building flexible multi-provider waterfalls and AI research workflows.",
    pricingNotes:
      "Ocean: ~$0.063/credit yearly headline (min ~9k credits, ~$47/mo / ~$567 yearly). Clay: Free + Launch/Growth published headlines. Both burn credits — model usage carefully.",
    bestFor: [
      { productSlug: "ocean", scenarios: ["Lookalike company prospecting from seed accounts", "Teams wanting unlimited seats on a credit subscription"] },
      { productSlug: "clay", scenarios: ["Multi-provider enrichment waterfalls and Claygent-style research", "GTM/RevOps engineers building custom prospecting systems"] },
    ],
  }),
  approvedSiPair({
    a: "adapt-io",
    b: "uplead",
    title: "Adapt.io vs UpLead",
    scoresA: { "ease-of-use": 8, "contact-data": 7, prospecting: 7, "email-outreach": 3, integrations: 7, "value-for-money": 7 },
    scoresB: { "ease-of-use": 8, "contact-data": 8, prospecting: 8, "email-outreach": 3, integrations: 8, "value-for-money": 7 },
    labels: { a: "Adapt.io", b: "UpLead" },
    verdict:
      "No universal winner. Adapt.io fits credit-based regional contact DB buyers wanting Free + Starter-from-$49 with daily caps; UpLead fits buyers wanting verified contact DB strength with Essentials-from-$99 and stronger mid-tier shortlist presence. Adapt.io stays landscape vs ranked UpLead.",
    pricingNotes:
      "Adapt.io: Free; Starter $49/mo; Basic $99/mo; Custom. UpLead: Essentials $99/mo; Plus $199/mo; Professional contact sales. Both credit-based — compare credit allowances and daily caps.",
    bestFor: [
      { productSlug: "adapt-io", scenarios: ["Budget credit-based contact DB with Free evaluation", "Teams exporting contacts to CRM/SEP rather than sequencing in-app"] },
      { productSlug: "uplead", scenarios: ["Verified B2B contact DB with published Essentials/Plus credits", "Buyers wanting a stronger ranked mid-tier SI peer"] },
    ],
  }),
  approvedSiPair({
    a: "outreach",
    b: "salesloft",
    title: "Outreach vs Salesloft",
    scoresA: { "ease-of-use": 7, "contact-data": 3, prospecting: 5, "email-outreach": 9, integrations: 9, "value-for-money": 5 },
    scoresB: { "ease-of-use": 7, "contact-data": 3, prospecting: 5, "email-outreach": 9, integrations: 9, "value-for-money": 5 },
    labels: { a: "Outreach", b: "Salesloft" },
    verdict:
      "No universal winner — both are enterprise SEP peers, not contact-database peers. Choose by AI agent/forecast packaging (Outreach Amplify) vs Salesloft engagement/coaching stack fit, CRM sync depth, and quote economics. Neither belongs in ranked SI contact-DB recommendations.",
    pricingNotes:
      "Both are talk-to-sales / request pricing. Outreach publishes Amplify Essentials/Core/Plus/Pro AI-credit packages without dollar floors. Salesloft pricing page is talk-to-sales only. Do not invent seat dollars.",
    bestFor: [
      { productSlug: "outreach", scenarios: ["Enterprise SEP with Amplify AI agents and forecast workflows", "Teams standardizing sequencing + CRM sync + conversation intelligence"] },
      { productSlug: "salesloft", scenarios: ["Enterprise SEP peer evaluation vs Outreach", "Teams prioritizing bi-directional CRM sync and coaching analytics"] },
    ],
  }),
  approvedSiPair({
    a: "instantly",
    b: "lemlist",
    title: "Instantly vs Lemlist",
    scoresA: { "ease-of-use": 8, "contact-data": 5, prospecting: 6, "email-outreach": 9, integrations: 6, "value-for-money": 8 },
    scoresB: { "ease-of-use": 8, "contact-data": 5, prospecting: 6, "email-outreach": 9, integrations: 7, "value-for-money": 7 },
    labels: { a: "Instantly", b: "Lemlist" },
    verdict:
      "No universal winner. Instantly fits high-volume cold-email infra (unlimited accounts/warmup) with Growth-from-$47; lemlist fits multichannel outbound (email + LinkedIn) with Email-from-$55 yearly. Both are SI landscape cold-email tools — not ranked contact-DB peers.",
    pricingNotes:
      "Instantly Growth from $47/mo; Hypergrowth $97; Light Speed $358. lemlist Email from $55/user/mo yearly ($69 monthly); Multichannel from $87 yearly. Confirm live limits.",
    bestFor: [
      { productSlug: "instantly", scenarios: ["High-volume cold email with unlimited accounts/warmup", "Agencies optimizing deliverability infra cost"] },
      { productSlug: "lemlist", scenarios: ["Multichannel email + LinkedIn outbound", "Teams wanting CRM-native outbound with a 14-day trial"] },
    ],
  }),
  approvedSiPair({
    a: "instantly",
    b: "smartlead",
    title: "Instantly vs Smartlead",
    scoresA: { "ease-of-use": 8, "contact-data": 5, prospecting: 6, "email-outreach": 9, integrations: 6, "value-for-money": 8 },
    scoresB: { "ease-of-use": 8, "contact-data": 4, prospecting: 5, "email-outreach": 9, integrations: 6, "value-for-money": 8 },
    labels: { a: "Instantly", b: "Smartlead" },
    verdict:
      "No universal winner. Both are cold-email infrastructure peers for SI landscape coverage. Instantly emphasizes bundles/credits + Growth packaging; Smartlead emphasizes Base volume bands and unlimited mailboxes. Neither is a ranked SI data core.",
    pricingNotes:
      "Instantly Growth from $47/mo. Smartlead Base from $59/mo ($39/mo yearly headline) with send/verified-email bands — confirm live slider. Do not invent unverified tier dollars.",
    bestFor: [
      { productSlug: "instantly", scenarios: ["Cold-email infra with optional lead credits", "Teams comparing published Growth/Hypergrowth/Light Speed ladders"] },
      { productSlug: "smartlead", scenarios: ["Cold-email volume with Base yearly headline value", "Teams wanting unlimited mailboxes + warmup posture"] },
    ],
  }),

  // Email-marketing Wave-1 approved comparisons (canonical a-vs-b slug order)
  approvedEmPair({
    a: "activecampaign",
    b: "getresponse",
    title: "ActiveCampaign vs GetResponse",
    labels: { a: "ActiveCampaign", b: "GetResponse" },
    editorial: {
      a: { automation: 9, segmentation: 8, analytics: 7, "ai-features": 6 },
      b: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "ActiveCampaign: no free plan; researched Starter ~$15/mo at ~1k contacts (annual) with 14-day trial. GetResponse: forever-free (≤500 contacts) plus Starter from $19/mo at ~1k contacts.",
      contactLimits:
        "Both use contact/subscriber tiers. GetResponse Free caps at ≤500 contacts; ActiveCampaign scales by contact band from Starter upward.",
      emailLimits:
        "GetResponse: unlimited monthly sends on paid plans (research). ActiveCampaign: confirm live send rules per plan — do not invent caps.",
      templates:
        "Both ship campaign templates and editors. GetResponse email-creation 8/10 on EM assessment; ActiveCampaign leads on automation rather than design-first packaging.",
      landingPages:
        "GetResponse bundles landing pages/funnels with email on paid paths. ActiveCampaign focuses on automation + CRM pipelines — LP breadth is not the primary researched differentiator.",
      integrations:
        "Both document broad marketing/CRM ecosystems. ActiveCampaign CRM integrations 8/10 (crm-editorial); GetResponse integrations 7/10 (email-marketing-editorial).",
    },
    verdict:
      "No universal winner. Choose ActiveCampaign when marketing automation depth (and Plus+ CRM) is the job; choose GetResponse when forever-free entry and an all-in-one email + landing-page stack matter more.",
    pricingNotes:
      "ActiveCampaign: no free plan; Starter/Plus/Professional/Enterprise contact tiers (Starter ~$15/mo at ~1k contacts annual per research). GetResponse: Free + Starter from $19/mo at ~1k contacts; unlimited sends on paid. Confirm live vendor pricing.",
    bestFor: [
      {
        productSlug: "activecampaign",
        scenarios: [
          "Marketing-led SMBs needing deep automation + CRM on Plus+",
          "Buyers OK without a free forever plan",
        ],
      },
      {
        productSlug: "getresponse",
        scenarios: [
          "Teams wanting forever-free evaluation plus automation/LPs",
          "SMBs consolidating email, funnels, and landing pages",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "aweber",
    b: "getresponse",
    title: "AWeber vs GetResponse",
    labels: { a: "AWeber", b: "GetResponse" },
    editorial: {
      a: { automation: 6, segmentation: 6, analytics: 6, "ai-features": 5 },
      b: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Both offer forever-free plans. AWeber Lite from $15/mo at 500 subs; GetResponse Starter from $19/mo at ~1k contacts (research 2026-08-17).",
      contactLimits:
        "AWeber Free ≤500 subs / 3k sends; GetResponse Free ≤500 contacts. Paid tiers scale by subscribers/contacts.",
      emailLimits:
        "AWeber Free includes published send caps; GetResponse unlimited sends on paid plans.",
      templates:
        "Both include templates. GetResponse email-creation 8/10 vs AWeber 7/10 on EM assessments.",
      landingPages:
        "Both bundle landing pages with email for creators/SMBs.",
      integrations:
        "GetResponse integrations 7/10 vs AWeber 6/10 on email-marketing-editorial.",
    },
    verdict:
      "No universal winner. Choose GetResponse when automation depth and all-in-one bundling matter; choose AWeber when you want the simplest creator/SMB newsletter path with approachable Lite/Plus packaging.",
    pricingNotes:
      "AWeber: Free forever + Lite from $15/mo at 500 subs. GetResponse: Free + Starter from $19/mo at ~1k contacts. Confirm live vendor pricing.",
    bestFor: [
      {
        productSlug: "aweber",
        scenarios: [
          "Creators wanting simple email + LPs with free forever",
          "Teams prioritizing support culture over deep automation",
        ],
      },
      {
        productSlug: "getresponse",
        scenarios: [
          "SMBs needing stronger automation and AI tooling",
          "Buyers consolidating email, funnels, and landing pages",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "campaign-monitor",
    b: "getresponse",
    title: "Campaign Monitor vs GetResponse",
    labels: { a: "Campaign Monitor", b: "GetResponse" },
    editorial: {
      a: { automation: 6, segmentation: 7, analytics: 7, "ai-features": 6 },
      b: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Campaign Monitor: no forever free; 30-day trial; Lite from ~$13/mo at 0–500 contacts. GetResponse: forever-free + Starter from $19/mo at ~1k contacts.",
      contactLimits:
        "Both use contact-tier packaging. Campaign Monitor Lite/Essentials/Premier bands; GetResponse Free/Starter/Marketer/Creator/Enterprise.",
      emailLimits:
        "Campaign Monitor: Lite send-capped; Essentials/Premier unlimited. GetResponse: unlimited sends on paid.",
      templates:
        "Campaign Monitor leads on design-led templates (email-creation 9/10). GetResponse strong but secondary (8/10).",
      landingPages:
        "GetResponse bundles LPs/funnels more centrally; Campaign Monitor website builder is an add-on on lower tiers (+$10/mo per research).",
      integrations:
        "Both score 7/10 integrations on email-marketing-editorial.",
    },
    verdict:
      "No universal winner. Choose Campaign Monitor when design-led templates and agency packaging are the job; choose GetResponse when forever-free entry and stronger automation bundling matter more.",
    pricingNotes:
      "Campaign Monitor: Lite ~$13 / Essentials $31 / Premier ~$171 at 0–500 contacts (research). GetResponse: Free + Starter from $19/mo at ~1k contacts. Confirm live vendor pricing.",
    bestFor: [
      {
        productSlug: "campaign-monitor",
        scenarios: [
          "Brand-conscious teams prioritizing email design",
          "Agencies needing multi-account tooling on higher plans",
        ],
      },
      {
        productSlug: "getresponse",
        scenarios: [
          "Teams needing free-tier entry plus automation/LPs",
          "SMBs wanting stronger automation than design-first ESPs",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "aweber",
    b: "campaign-monitor",
    title: "AWeber vs Campaign Monitor",
    labels: { a: "AWeber", b: "Campaign Monitor" },
    editorial: {
      a: { automation: 6, segmentation: 6, analytics: 6, "ai-features": 5 },
      b: { automation: 6, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "AWeber: forever-free + Lite from $15/mo at 500 subs. Campaign Monitor: no forever free; Lite from ~$13/mo at 0–500 contacts with 30-day trial.",
      contactLimits:
        "Both contact/subscriber tiered. AWeber Free ≤500; Campaign Monitor Lite starts at 0–500 band.",
      emailLimits:
        "AWeber Free has published send caps; Campaign Monitor Lite is send-capped, Essentials/Premier unlimited.",
      templates:
        "Campaign Monitor leads on design-led templates (email-creation 9/10 vs AWeber 7/10).",
      landingPages:
        "AWeber bundles LPs with creator plans; Campaign Monitor website builder is add-on priced on lower tiers.",
      integrations:
        "Campaign Monitor 7/10 vs AWeber 6/10 on email-marketing-editorial.",
    },
    verdict:
      "No universal winner. Choose Campaign Monitor for design-led campaigns and agency packaging; choose AWeber for forever-free creator/SMB simplicity.",
    pricingNotes:
      "AWeber Lite from $15/mo at 500 subs; Campaign Monitor Lite from ~$13/mo at 0–500 contacts. Confirm live vendor pricing — contact bands differ.",
    bestFor: [
      {
        productSlug: "aweber",
        scenarios: [
          "Creators starting free forever",
          "Simple newsletter programs without design-first budgets",
        ],
      },
      {
        productSlug: "campaign-monitor",
        scenarios: [
          "Brand and agency teams prioritizing templates",
          "Buyers OK without a forever-free plan",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "getresponse",
    b: "mailchimp",
    title: "GetResponse vs Mailchimp",
    labels: { a: "GetResponse", b: "Mailchimp" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Both offer freemium/free entry. GetResponse forever-free ≤500 contacts + Starter from $19/mo at ~1k. Mailchimp: Free tier for eligible audiences; paid contact-based — verify live dollars (no invented ladder).",
      contactLimits:
        "Both contact-tiered. GetResponse Free ≤500; Mailchimp Free eligibility and paid contact bands — confirm on mailchimp.com/pricing.",
      emailLimits:
        "GetResponse unlimited sends on paid (research). Mailchimp send rules vary by plan — verify live.",
      templates:
        "Both ship templates and editors. GetResponse email-creation 8/10 on EM assessment; Mailchimp email-capabilities 9/10 on crm-editorial (cross-methodology).",
      landingPages:
        "GetResponse bundles LPs/funnels as a core researched strength. Mailchimp has audience/campaign tooling — treat LP depth as plan-dependent; verify live.",
      integrations:
        "GetResponse 7/10 (EM); Mailchimp 7/10 integrations (crm-editorial).",
    },
    verdict:
      "No universal winner. Choose GetResponse when forever-free plus automation/landing-page bundling is the job; choose Mailchimp when brand familiarity and freemium audience tools for beginners matter more.",
    pricingNotes:
      "GetResponse: Free + Starter from $19/mo at ~1k contacts (research). Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live Mailchimp pricing (do not invent paid rungs).",
    bestFor: [
      {
        productSlug: "getresponse",
        scenarios: [
          "SMBs wanting automation + LPs with published Starter floors",
          "Creators consolidating webinars/courses with email",
        ],
      },
      {
        productSlug: "mailchimp",
        scenarios: [
          "Beginners prioritizing a widely known freemium brand",
          "Teams needing email + audience CRM-lite features",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "activecampaign",
    b: "mailchimp",
    title: "ActiveCampaign vs Mailchimp",
    labels: { a: "ActiveCampaign", b: "Mailchimp" },
    editorial: {
      a: { automation: 9, segmentation: 8, analytics: 7, "ai-features": 6 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "ActiveCampaign: no free plan; Starter ~$15/mo at ~1k contacts annual + 14-day trial. Mailchimp: Free tier for eligible audiences; paid contact-based — verify live.",
      contactLimits:
        "Both contact-based. ActiveCampaign publishes Starter/Plus/Professional/Enterprise bands at ~1k contacts in research; Mailchimp Free eligibility + paid bands — verify live.",
      emailLimits:
        "Confirm live send rules for both — do not invent caps beyond research packs.",
      templates:
        "Both strong on email campaigns. ActiveCampaign leads on automation depth; Mailchimp leads on beginner brand familiarity.",
      landingPages:
        "Neither is positioned primarily as a landing-page builder in current CRM-era assessments — verify live feature packaging.",
      integrations:
        "ActiveCampaign integrations 8/10 vs Mailchimp 7/10 on crm-editorial assessments.",
    },
    verdict:
      "No universal winner. Choose ActiveCampaign when automation depth (+ CRM on Plus+) is the job; choose Mailchimp when freemium brand recognition for beginners matters more than automation complexity.",
    pricingNotes:
      "ActiveCampaign: no free plan; Starter ~$15 / Plus $49 / Professional $79 / Enterprise $145 per mo at ~1k contacts (annual research figures). Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live (do not invent paid rungs).",
    bestFor: [
      {
        productSlug: "activecampaign",
        scenarios: [
          "Marketing-led teams needing deep automation",
          "Buyers comparing HubSpot/Keap for email-first GTM",
        ],
      },
      {
        productSlug: "mailchimp",
        scenarios: [
          "SMBs starting on freemium email marketing",
          "Buyers prioritizing known brand over automation depth",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "aweber",
    b: "mailchimp",
    title: "AWeber vs Mailchimp",
    labels: { a: "AWeber", b: "Mailchimp" },
    editorial: {
      a: { automation: 6, segmentation: 6, analytics: 6, "ai-features": 5 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Both freemium/free entry. AWeber Free forever + Lite from $15/mo at 500 subs. Mailchimp Free for eligible audiences; paid contact-based — verify live dollars.",
      contactLimits:
        "AWeber Free ≤500 subs / 3k sends. Mailchimp Free eligibility and paid contact bands — confirm on vendor pricing.",
      emailLimits:
        "AWeber Free includes published send multipliers; Mailchimp send rules are plan-dependent — verify live.",
      templates:
        "Both include templates. Mailchimp email-capabilities 9/10 (crm-editorial); AWeber email-creation 7/10 (EM).",
      landingPages:
        "AWeber researches bundled LPs/forms for creators. Mailchimp LP depth is plan-dependent — verify live.",
      integrations:
        "Mailchimp 7/10 (crm-editorial) vs AWeber 6/10 (EM).",
    },
    verdict:
      "No universal winner. Choose Mailchimp for brand-familiar freemium beginners and broader audience tooling; choose AWeber for a simpler creator/SMB forever-free newsletter path with explicit Lite/Plus packaging.",
    pricingNotes:
      "AWeber: Free + Lite from $15/mo at 500 subs (research). Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live Mailchimp pricing.",
    bestFor: [
      {
        productSlug: "aweber",
        scenarios: [
          "Creators wanting simple forever-free + Lite/Plus clarity",
          "Teams prioritizing phone/chat support culture",
        ],
      },
      {
        productSlug: "mailchimp",
        scenarios: [
          "Beginners who want the most widely known freemium ESP brand",
          "Teams needing email + audience CRM-lite features",
        ],
      },
    ],
  }),

  // Email-marketing Priority-1 approved comparisons (Klaviyo, Brevo, MailerLite)
  approvedEmPair({
    a: "klaviyo",
    b: "mailchimp",
    title: "Klaviyo vs Mailchimp",
    labels: { a: "Klaviyo", b: "Mailchimp" },
    editorial: {
      a: { automation: 9, segmentation: 9, analytics: 9, "ai-features": 8 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Klaviyo: Free ≤250 active profiles; Email from ~$20/mo at 251–500 profiles (research floors — confirm live slider). Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live.",
      contactLimits:
        "Klaviyo bills primarily on active profiles. Mailchimp uses contact/audience tiers — confirm Free eligibility and paid bands live.",
      emailLimits:
        "Klaviyo Free includes 500 emails/mo; paid Email scales with profiles. Mailchimp send rules are plan-dependent — verify live.",
      templates:
        "Both include campaign templates. Klaviyo leans ecommerce/flow templates; Mailchimp is broad freemium campaign tooling.",
      landingPages:
        "Mailchimp LP depth is plan-dependent. Klaviyo is email/SMS/flow-centric — LPs are not the primary researched differentiator.",
      integrations:
        "Klaviyo integrations 9/10 (ecommerce-native). Mailchimp 7/10 (crm-editorial integrations evidence).",
    },
    verdict:
      "No universal winner. Choose Klaviyo for ecommerce email + SMS with attribution; choose Mailchimp for brand-familiar freemium beginners and broader audience tooling.",
    pricingNotes:
      "Klaviyo: Free + Email from ~$20/mo (active profiles; confirm slider). Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "klaviyo",
        scenarios: [
          "Shopify/ecommerce brands needing lifecycle email + SMS",
          "Teams prioritizing revenue attribution",
        ],
      },
      {
        productSlug: "mailchimp",
        scenarios: [
          "Beginners wanting the most widely known freemium ESP brand",
          "Teams needing email + audience CRM-lite features",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "activecampaign",
    b: "klaviyo",
    title: "ActiveCampaign vs Klaviyo",
    labels: { a: "ActiveCampaign", b: "Klaviyo" },
    editorial: {
      a: { automation: 9, segmentation: 8, analytics: 7, "ai-features": 6 },
      b: { automation: 9, segmentation: 9, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "ActiveCampaign: no free plan; researched Starter ~$15/mo at ~1k contacts (annual) with 14-day trial. Klaviyo: Free ≤250 active profiles; Email from ~$20/mo at 251–500 profiles (confirm slider).",
      contactLimits:
        "ActiveCampaign scales by contact band. Klaviyo scales by active profiles — different cost drivers at growth.",
      emailLimits:
        "Confirm live send rules for ActiveCampaign. Klaviyo Free caps emails; paid Email scales with profiles.",
      templates:
        "Both ship strong campaign builders. Klaviyo ecommerce/flow templates; ActiveCampaign automation-first journeys.",
      landingPages:
        "Neither is primarily an LP platform vs GetResponse — ActiveCampaign focuses automation+CRM; Klaviyo email/SMS.",
      integrations:
        "Klaviyo 9/10 ecommerce integrations vs ActiveCampaign strong CRM/marketing integrations (crm-editorial 8/10).",
    },
    verdict:
      "No universal winner. Choose Klaviyo when ecommerce catalog flows and SMS attribution are the job; choose ActiveCampaign when B2B/services multi-step automation + CRM pipelines are the job.",
    pricingNotes:
      "ActiveCampaign: contact-tier Starter/Plus/Professional (no free plan). Klaviyo: active-profile Free + Email from ~$20/mo (confirm slider). Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "activecampaign",
        scenarios: [
          "Marketing-led SMBs needing deep automation + CRM on Plus+",
          "B2B/services teams comparing HubSpot/Keap for email-first GTM",
        ],
      },
      {
        productSlug: "klaviyo",
        scenarios: [
          "Ecommerce brands needing Shopify-native flows + SMS",
          "Teams prioritizing revenue attribution analytics",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "brevo",
    b: "klaviyo",
    title: "Brevo vs Klaviyo",
    labels: { a: "Brevo", b: "Klaviyo" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 9, segmentation: 9, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Brevo: Free forever (300 emails/day); Starter from $9/mo by email volume. Klaviyo: Free ≤250 active profiles; Email from ~$20/mo (confirm slider).",
      contactLimits:
        "Brevo Free stores up to 100k contacts; paid is send-volume based. Klaviyo bills active profiles.",
      emailLimits:
        "Brevo Free 300/day; paid volume bands from 5k emails/mo. Klaviyo Free 500 emails/mo; paid scales with profiles.",
      templates:
        "Both include templates. Klaviyo ecommerce-led; Brevo SMB multi-channel campaign tooling.",
      landingPages:
        "Brevo Standard+ includes landing pages (research). Klaviyo is email/SMS-centric.",
      integrations:
        "Klaviyo 9/10 ecommerce-native vs Brevo 7/10 SMB multi-channel connectors.",
    },
    verdict:
      "No universal winner. Choose Klaviyo for ecommerce depth and attribution; choose Brevo for send-based value pricing and a generous free multi-channel path.",
    pricingNotes:
      "Brevo: Free + Starter from $9/mo (send-based). Klaviyo: Free + Email from ~$20/mo (active profiles; confirm slider). Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "brevo",
        scenarios: [
          "SMBs wanting send-based pricing with high free contact storage",
          "EU/SMB multi-channel email buyers",
        ],
      },
      {
        productSlug: "klaviyo",
        scenarios: [
          "Ecommerce brands needing catalog-aware flows + SMS",
          "Teams prioritizing revenue attribution",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "brevo",
    b: "mailerlite",
    title: "Brevo vs MailerLite",
    labels: { a: "Brevo", b: "MailerLite" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 7, segmentation: 7, analytics: 6, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Brevo: Free forever + Starter from $9/mo (send-based). MailerLite: Free ≤250 subscribers; Comfort from $12/mo at 500 subscribers.",
      contactLimits:
        "Brevo Free stores up to 100k contacts. MailerLite Free ≤250 subscribers; paid scales by subscriber band.",
      emailLimits:
        "Brevo Free 300 emails/day; paid from 5k emails/mo. MailerLite Free 2,500 emails/30 days.",
      templates:
        "Both include drag-and-drop templates. MailerLite email-creation 8/10 vs Brevo 7/10 on EM assessments.",
      landingPages:
        "Both bundle landing pages on paid paths (Brevo Standard+; MailerLite Comfort/Power).",
      integrations:
        "Both score 7/10 integrations on email-marketing-editorial.",
    },
    verdict:
      "No universal winner. Choose Brevo for send-based value and multi-channel breadth; choose MailerLite for highest ease-of-use and simple Comfort/Power subscriber packaging.",
    pricingNotes:
      "Brevo: Free + Starter from $9/mo (send volume). MailerLite: Free + Comfort from $12/mo at 500 subscribers (~10% annual). Confirm live bands. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "brevo",
        scenarios: [
          "Teams with large contact databases but moderate send volume",
          "Buyers wanting SMS/chat multi-channel options",
        ],
      },
      {
        productSlug: "mailerlite",
        scenarios: [
          "Creators/SMBs wanting the simplest high-ease ESP path",
          "Buyers comparing Mailchimp for easier freemium email",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "mailchimp",
    b: "mailerlite",
    title: "Mailchimp vs MailerLite",
    labels: { a: "Mailchimp", b: "MailerLite" },
    editorial: {
      a: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
      b: { automation: 7, segmentation: 7, analytics: 6, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Both freemium. MailerLite Free ≤250 subscribers + Comfort from $12/mo at 500. Mailchimp Free for eligible audiences; paid contact-based — verify live.",
      contactLimits:
        "MailerLite Free ≤250 subscribers. Mailchimp Free eligibility and paid contact bands — confirm on vendor pricing.",
      emailLimits:
        "MailerLite Free 2,500 emails/30 days. Mailchimp send rules are plan-dependent — verify live.",
      templates:
        "Both include templates. MailerLite email-creation 8/10 (EM); Mailchimp email-capabilities 9/10 (crm-editorial).",
      landingPages:
        "MailerLite researches bundled LPs/sites. Mailchimp LP depth is plan-dependent — verify live.",
      integrations:
        "Mailchimp broader brand ecosystem; MailerLite 7/10 EM integrations for SMB/creator stacks.",
    },
    verdict:
      "No universal winner. Choose Mailchimp for brand-familiar freemium beginners and broader ecosystem; choose MailerLite for simpler SMB ease and clearer Comfort/Power floors.",
    pricingNotes:
      "MailerLite: Free + Comfort from $12/mo at 500 subscribers. Mailchimp: freemium Free for eligible audiences; paid contact-based — verify live. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "mailchimp",
        scenarios: [
          "Beginners who want the most widely known freemium ESP brand",
          "Teams needing broad integrations and audience CRM-lite tools",
        ],
      },
      {
        productSlug: "mailerlite",
        scenarios: [
          "SMBs wanting high ease and approachable Comfort/Power pricing",
          "Creators bundling landing pages with newsletters",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "brevo",
    b: "getresponse",
    title: "Brevo vs GetResponse",
    labels: { a: "Brevo", b: "GetResponse" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Both forever-free. Brevo Starter from $9/mo (send-based). GetResponse Starter from $19/mo at ~1k contacts (research).",
      contactLimits:
        "Brevo Free stores up to 100k contacts; paid is email-volume based. GetResponse Free ≤500 contacts; paid contact tiers.",
      emailLimits:
        "Brevo Free 300/day; GetResponse Free 2,500 newsletters/mo; GetResponse unlimited sends on paid.",
      templates:
        "Both include templates. GetResponse email-creation 8/10 vs Brevo 7/10 on EM assessments.",
      landingPages:
        "GetResponse bundles LPs/funnels centrally. Brevo landing pages on Standard+ (research).",
      integrations:
        "Both score 7/10 integrations on email-marketing-editorial.",
    },
    verdict:
      "No universal winner. Choose Brevo for send-based pricing and high free contact storage; choose GetResponse for stronger all-in-one automation + landing-page/funnel bundling with unlimited paid sends.",
    pricingNotes:
      "Brevo: Free + Starter from $9/mo (send volume). GetResponse: Free + Starter from $19/mo at ~1k contacts; unlimited paid sends. Confirm live. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "brevo",
        scenarios: [
          "SMBs preferring send-based TCO with large contact storage",
          "Multi-channel email/SMS/chat buyers",
        ],
      },
      {
        productSlug: "getresponse",
        scenarios: [
          "Teams consolidating email, funnels, and landing pages",
          "Buyers wanting unlimited paid sends on contact tiers",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "getresponse",
    b: "klaviyo",
    title: "GetResponse vs Klaviyo",
    labels: { a: "GetResponse", b: "Klaviyo" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 9, segmentation: 9, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "GetResponse: forever-free + Starter from $19/mo at ~1k contacts. Klaviyo: Free ≤250 active profiles; Email from ~$20/mo (confirm slider).",
      contactLimits:
        "GetResponse contact-tier packages. Klaviyo active-profile billing — different growth cost curves.",
      emailLimits:
        "GetResponse unlimited sends on paid. Klaviyo Free 500 emails/mo; paid scales with profiles.",
      templates:
        "GetResponse email-creation 8/10; Klaviyo ecommerce/flow-led templates with automation 9/10.",
      landingPages:
        "GetResponse bundles LPs/funnels as a core all-in-one story. Klaviyo is email/SMS-centric.",
      integrations:
        "Klaviyo 9/10 ecommerce-native vs GetResponse 7/10 SMB/ecommerce connectors.",
    },
    verdict:
      "No universal winner. Choose Klaviyo for ecommerce email + SMS attribution; choose GetResponse for forever-free all-in-one email + landing-page/funnel packaging.",
    pricingNotes:
      "GetResponse: Free + Starter from $19/mo at ~1k contacts. Klaviyo: Free + Email from ~$20/mo (active profiles; confirm slider). Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "getresponse",
        scenarios: [
          "SMBs wanting free-tier entry plus automation/LPs/funnels",
          "Creators bundling webinars/courses with email",
        ],
      },
      {
        productSlug: "klaviyo",
        scenarios: [
          "Ecommerce brands needing catalog-aware flows + SMS",
          "Teams prioritizing revenue attribution",
        ],
      },
    ],
  }),

  // Marketing Wave-2 approved comparisons (primaryCategorySlug=marketing)
  approvedMarketingPair({
    a: "freshmarketer",
    b: "kartra",
    title: "Kartra vs Freshmarketer",
    labels: { a: "Freshmarketer", b: "Kartra" },
    scoresA: {
      "ease-of-use": 7,
      "campaign-content": 6,
      "marketing-automation": 9,
      "funnel-conversion": 7,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 8,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Kartra when funnels, email/SMS, courses, and checkouts in one creator stack are the job; choose Freshmarketer when Freshworks-aligned marketing automation with a free entry rung and multichannel journeys matter more.",
    pricingNotes:
      "Kartra publishes Essentials→Professional creator tiers (entry Essentials researched ~$59/mo). Freshmarketer publishes Free + Enterprise/add-on packaging with a 21-day trial. Confirm live vendor pricing — contact add-ons can dominate Freshmarketer TCO.",
    bestFor: [
      {
        productSlug: "kartra",
        scenarios: [
          "Coaches/creators consolidating funnels + email + courses + checkouts",
          "Solopreneurs wanting one platform vs stitching point tools",
        ],
      },
      {
        productSlug: "freshmarketer",
        scenarios: [
          "Teams already in or considering Freshworks CRM",
          "SMBs wanting marketing automation with a free starting tier",
        ],
      },
    ],
  }),
  approvedMarketingPair({
    a: "brand24",
    b: "socialbee",
    title: "Brand24 vs SocialBee",
    labels: { a: "Brand24", b: "SocialBee" },
    scoresA: {
      "ease-of-use": 7,
      "campaign-content": 4,
      "marketing-automation": 3,
      "funnel-conversion": 2,
      "analytics-attribution": 9,
      "brand-monitoring": 10,
      integrations: 6,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 9,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 4,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Brand24 when social listening, reputation monitoring, and mention analytics are the primary job; choose SocialBee when multi-network scheduling, content recycling, and AI-assisted posting are the job.",
    pricingNotes:
      "Brand24 publishes keyword/mention plan ladders with a 14-day trial. SocialBee publishes profile/workspace ladders with a 14-day Pro trial. Confirm live limits — mention caps vs profile caps drive upgrades differently.",
    bestFor: [
      {
        productSlug: "brand24",
        scenarios: [
          "PR/marketing teams monitoring brand and competitors",
          "Agencies delivering listening reports to clients",
        ],
      },
      {
        productSlug: "socialbee",
        scenarios: [
          "SMBs and agencies scheduling social content across networks",
          "Teams wanting AI-assisted social copy and recycling",
        ],
      },
    ],
  }),
  approvedMarketingPair({
    a: "kartra",
    b: "socialbee",
    title: "Kartra vs SocialBee",
    labels: { a: "Kartra", b: "SocialBee" },
    scoresA: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 9,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 4,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Kartra when creator funnels, email/SMS, courses, and checkouts are the center of gravity; choose SocialBee when social scheduling and content recycling are the primary job — Kartra is weak on social-first workflows.",
    pricingNotes:
      "Kartra: published creator tier ladder from Essentials (~$59/mo researched). SocialBee: profile/workspace packs with Bootstrap→Agency ladders and a 14-day Pro trial. Confirm live vendor pricing.",
    bestFor: [
      {
        productSlug: "kartra",
        scenarios: [
          "Creators consolidating funnel + email + membership stack",
          "Buyers who need checkouts alongside marketing pages",
        ],
      },
      {
        productSlug: "socialbee",
        scenarios: [
          "Social media managers needing multi-network calendars",
          "Agencies needing multi-workspace social scheduling",
        ],
      },
    ],
  }),
  approvedMarketingPair({
    a: "freshmarketer",
    b: "socialbee",
    title: "Freshmarketer vs SocialBee",
    labels: { a: "Freshmarketer", b: "SocialBee" },
    scoresA: {
      "ease-of-use": 7,
      "campaign-content": 6,
      "marketing-automation": 9,
      "funnel-conversion": 7,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 8,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 9,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 4,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Freshmarketer for multichannel marketing automation (especially Freshworks-aligned); choose SocialBee when the daily job is social scheduling and recycling rather than journey automation.",
    pricingNotes:
      "Freshmarketer: Free + Enterprise/add-on packaging (21-day trial). SocialBee: profile/workspace ladders (14-day Pro trial). Confirm live limits — contact add-ons vs social profile caps are different cost drivers.",
    bestFor: [
      {
        productSlug: "freshmarketer",
        scenarios: [
          "Freshworks CRM teams needing marketing journeys",
          "SMBs wanting email/messaging automation with free entry",
        ],
      },
      {
        productSlug: "socialbee",
        scenarios: [
          "Teams whose primary channel is social posting",
          "Agencies scheduling content across client workspaces",
        ],
      },
    ],
  }),

  // EM Priority-2 / Priority-3 + Marketing Priority-1 comparisons (2026-08-17)
  approvedEmPair({
    a: "klaviyo",
    b: "omnisend",
    title: "Klaviyo vs Omnisend",
    labels: { a: "Klaviyo", b: "Omnisend" },
    editorial: {
      a: { automation: 9, segmentation: 9, analytics: 9, "ai-features": 8 },
      b: { automation: 8, segmentation: 8, analytics: 8, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Klaviyo: Free ≤250 active profiles; Email from ~$20/mo (research floors — confirm slider). Omnisend: Free ≤250 contacts; Standard from ~$16/mo at 500 contacts (research floor before intro discounts).",
      contactLimits:
        "Klaviyo bills primarily on active profiles. Omnisend uses contact tiers with Standard send caps.",
      emailLimits:
        "Klaviyo Free 500 emails/mo; paid scales with profiles. Omnisend Free 500 emails/mo; Standard caps scale with contacts; Pro unlimited (fair use).",
      templates:
        "Both ecommerce-oriented. Klaviyo leans attribution/flows; Omnisend leans multichannel presets.",
      landingPages:
        "Neither is primarily an LP platform — both are ecommerce ESP-centered.",
      integrations:
        "Both strong on Shopify/ecommerce. Klaviyo integrations 9/10 vs Omnisend 8/10 on EM assessments.",
    },
    verdict:
      "No universal winner. Choose Klaviyo for deeper ecommerce attribution and SMS sophistication; choose Omnisend for multichannel email/SMS/push value as a common Klaviyo alternative.",
    pricingNotes:
      "Klaviyo: Free + Email from ~$20/mo (active profiles). Omnisend: Free + Standard from ~$16/mo at 500 contacts (confirm live slider/promos). Affiliate excluded.",
    bestFor: [
      {
        productSlug: "klaviyo",
        scenarios: ["Shopify brands prioritizing attribution", "Email + SMS with predictive audiences"],
      },
      {
        productSlug: "omnisend",
        scenarios: ["Ecommerce multichannel on contact pricing", "Teams comparing Klaviyo on value"],
      },
    ],
  }),
  approvedEmPair({
    a: "kit",
    b: "mailerlite",
    title: "Kit vs MailerLite",
    labels: { a: "Kit", b: "MailerLite" },
    editorial: {
      a: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
      b: { automation: 6, segmentation: 6, analytics: 6, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "Kit: Newsletter free; Creator from $33/mo at 1k subscribers. MailerLite: Free; Comfort from $12/mo at 500 subscribers.",
      contactLimits:
        "Both scale with subscribers/contacts — confirm live calculators.",
      emailLimits:
        "Plan-dependent; Kit Free limits automations; MailerLite Free has send/subscriber caps.",
      templates:
        "Kit creator/newsletter templates; MailerLite drag-drop SMB templates (email-creation 8/10).",
      landingPages:
        "Both include LPs/forms; Kit emphasizes creator monetization pages.",
      integrations:
        "Kit 7/10 vs MailerLite 7/10 on EM assessments — creator vs SMB ecosystems.",
    },
    verdict:
      "No universal winner. Choose Kit for creator/newsletter monetization (ConvertKit continuity); choose MailerLite for simpler SMB free-tier ease.",
    pricingNotes:
      "Kit Creator from $33/mo at 1k subs. MailerLite Comfort from $12/mo at 500 subs. Confirm live.",
    bestFor: [
      {
        productSlug: "kit",
        scenarios: ["Creators monetizing newsletters", "ConvertKit migrations"],
      },
      {
        productSlug: "mailerlite",
        scenarios: ["SMB simple free-tier email", "Teams wanting approachable Comfort/Power pricing"],
      },
    ],
  }),
  approvedEmPair({
    a: "kit",
    b: "flodesk",
    title: "Kit vs Flodesk",
    labels: { a: "Kit", b: "Flodesk" },
    editorial: {
      a: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
      b: { automation: 7, segmentation: 6, analytics: 6, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Kit Creator from $33/mo at 1k subscribers. Flodesk Lite from $25/mo at ≤1k subscribers (monthly).",
      contactLimits: "Both subscriber-tiered — confirm live sliders.",
      emailLimits: "Unlimited sends common on paid creator plans — confirm live.",
      templates:
        "Flodesk leads design-led composition (email-creation 9/10); Kit strong creator newsletters (8/10).",
      landingPages: "Both include forms/LPs; Kit adds stronger monetization tooling.",
      integrations: "Kit broader creator app ecosystem vs Flodesk lighter integrations (5–6/10).",
    },
    verdict:
      "No universal winner. Choose Flodesk for design-led creator email; choose Kit for creator automations and monetization depth.",
    pricingNotes:
      "Flodesk Lite from $25/mo; Kit Creator from $33/mo at 1k subscribers. Confirm live.",
    bestFor: [
      {
        productSlug: "flodesk",
        scenarios: ["Creators prioritizing beautiful templates"],
      },
      {
        productSlug: "kit",
        scenarios: ["Creators needing visual automations + product selling"],
      },
    ],
  }),
  approvedEmPair({
    a: "omnisend",
    b: "drip",
    title: "Omnisend vs Drip",
    labels: { a: "Omnisend", b: "Drip" },
    editorial: {
      a: { automation: 8, segmentation: 8, analytics: 8, "ai-features": 7 },
      b: { automation: 8, segmentation: 8, analytics: 7, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "Omnisend Free + Standard from ~$16/mo at 500 contacts. Drip from $39/mo at ≤2,500 people (no free plan).",
      contactLimits: "Both contact/people tiers for ecommerce — confirm live.",
      emailLimits: "Omnisend Standard caps vs Pro unlimited; Drip unlimited sends on published packaging.",
      templates: "Both ecommerce-oriented campaign/automation templates.",
      landingPages: "Secondary for both — ecommerce email center of gravity.",
      integrations: "Both Shopify-oriented; Omnisend 8/10 vs Drip 7/10.",
    },
    verdict:
      "No universal winner. Choose Omnisend for multichannel email/SMS/push with a free rung; choose Drip for behavior-driven ecommerce CRM/email from a single paid plan.",
    pricingNotes:
      "Omnisend from ~$16/mo Standard (research floor). Drip from $39/mo. Confirm live.",
    bestFor: [
      {
        productSlug: "omnisend",
        scenarios: ["Ecommerce multichannel with free entry", "SMS/push beside email"],
      },
      {
        productSlug: "drip",
        scenarios: ["Behavior-driven ecommerce automation", "Unlimited sends from $39/mo entry"],
      },
    ],
  }),
  approvedEmPair({
    a: "brevo",
    b: "mailjet",
    title: "Brevo vs Mailjet",
    labels: { a: "Brevo", b: "Mailjet" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 7, segmentation: 6, analytics: 6, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Brevo Free + Starter from $9/mo (send volume). Mailjet Free + Starter from $9/mo (send volume).",
      contactLimits:
        "Brevo Free stores up to 100k contacts researched. Mailjet Free 1k contacts; Essential+ unlimited contacts researched.",
      emailLimits: "Both send-volume based with free daily/monthly caps — confirm live bands.",
      templates: "Both include editors/templates; Brevo multi-channel SMB; Mailjet collaborative/MJML heritage.",
      landingPages: "Brevo Standard+ LPs; Mailjet Premium LPs researched.",
      integrations: "Both 7/10 on EM assessments.",
    },
    verdict:
      "No universal winner. Choose Brevo for broader multi-channel SMB marketing; choose Mailjet when EU-friendly marketing + transactional/API sending is the dual job.",
    pricingNotes:
      "Both Starter from $9/mo on send-volume packaging. Confirm live volume bands.",
    bestFor: [
      {
        productSlug: "brevo",
        scenarios: ["SMB multi-channel email + SMS/chat", "High contact storage with moderate sends"],
      },
      {
        productSlug: "mailjet",
        scenarios: ["Marketing + transactional/API email", "EU/Sinch packaging buyers"],
      },
    ],
  }),
  approvedEmPair({
    a: "moosend",
    b: "getresponse",
    title: "Moosend vs GetResponse",
    labels: { a: "Moosend", b: "GetResponse" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 6, "ai-features": 6 },
      b: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Moosend Pro from $9/mo at 500 contacts (no free plan; 30-day trial). GetResponse Free forever + paid contact tiers.",
      contactLimits: "Both contact-tiered on paid plans — confirm live.",
      emailLimits: "Moosend unlimited sends on Pro researched; GetResponse unlimited on paid researched.",
      templates: "Both include campaign templates and automation builders.",
      landingPages: "Both include LPs; GetResponse stronger all-in-one free-tier narrative.",
      integrations: "GetResponse broader all-in-one ecosystem vs Moosend budget automation focus.",
    },
    verdict:
      "No universal winner. Choose Moosend for budget automation with unlimited sends; choose GetResponse for all-in-one free-tier automation/LP paths.",
    pricingNotes:
      "Moosend from $9/mo. GetResponse Free + paid contact tiers. Confirm live.",
    bestFor: [
      {
        productSlug: "moosend",
        scenarios: ["Budget automation SMBs", "High-send contact-tier buyers"],
      },
      {
        productSlug: "getresponse",
        scenarios: ["All-in-one free-tier entry", "Automation + LPs in one SMB stack"],
      },
    ],
  }),
  approvedEmPair({
    a: "constant-contact",
    b: "mailchimp",
    title: "Constant Contact vs Mailchimp",
    labels: { a: "Constant Contact", b: "Mailchimp" },
    editorial: {
      a: { automation: 7, segmentation: 6, analytics: 7, "ai-features": 5 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Constant Contact Lite from $12/mo at ≤500 contacts (no free plan). Mailchimp freemium Free for eligible audiences; paid contact-based — verify live.",
      contactLimits: "Both scale with contacts — Constant Contact rises steeply; Mailchimp Free eligibility matters.",
      emailLimits: "Plan-dependent send multipliers — confirm live.",
      templates: "Both SMB-friendly templates; Mailchimp broader brand recognition.",
      landingPages: "Both offer LPs/forms with plan gates — confirm live.",
      integrations: "Mailchimp broader ecosystem; Constant Contact strong for local SMB/event stacks.",
    },
    verdict:
      "No universal winner. Choose Mailchimp for freemium brand-familiar beginners; choose Constant Contact for local SMB/event-oriented email with Lite entry.",
    pricingNotes:
      "Constant Contact Lite from $12/mo. Mailchimp freemium Free for eligible audiences — verify live paid bands.",
    bestFor: [
      {
        productSlug: "constant-contact",
        scenarios: ["Local SMBs and events", "NA brand-familiar paid entry"],
      },
      {
        productSlug: "mailchimp",
        scenarios: ["Beginners wanting freemium brand recognition"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "kartra",
    b: "clickfunnels",
    title: "Kartra vs ClickFunnels",
    labels: { a: "Kartra", b: "ClickFunnels" },
    scoresA: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 7,
      "campaign-content": 8,
      "marketing-automation": 7,
      "funnel-conversion": 9,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    verdict:
      "No universal winner. Both are funnel-first creator platforms — choose Kartra for courses/memberships/all-in-one breadth; choose ClickFunnels when sales-funnel conversion is the singular center of gravity.",
    pricingNotes:
      "Kartra Essentials from $59/mo researched. ClickFunnels Launch from $97/mo ($81/mo annual). Confirm live.",
    bestFor: [
      {
        productSlug: "kartra",
        scenarios: ["Creators needing courses + funnels + email", "All-in-one consolidation"],
      },
      {
        productSlug: "clickfunnels",
        scenarios: ["Funnel-first info-product marketers", "Kartra peer comparisons"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "buffer",
    b: "socialbee",
    title: "Buffer vs SocialBee",
    labels: { a: "Buffer", b: "SocialBee" },
    scoresA: {
      "ease-of-use": 9,
      "campaign-content": 8,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 5,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 9,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 4,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Buffer for mainstream brand recognition and simple per-channel pricing; choose SocialBee when content recycling and agency workspaces are the primary job.",
    pricingNotes:
      "Buffer Free ≤3 channels; Essentials from $6/channel/mo. SocialBee profile/workspace ladders — confirm live.",
    bestFor: [
      {
        productSlug: "buffer",
        scenarios: ["SMB mainstream social scheduling", "Simple free + per-channel entry"],
      },
      {
        productSlug: "socialbee",
        scenarios: ["Content recycling calendars", "Agency multi-workspace social"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "marketo",
    b: "braze",
    title: "Marketo vs Braze",
    labels: { a: "Adobe Marketo Engage", b: "Braze" },
    scoresA: {
      "ease-of-use": 5,
      "campaign-content": 8,
      "marketing-automation": 9,
      "funnel-conversion": 8,
      "analytics-attribution": 9,
      "brand-monitoring": 4,
      integrations: 9,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 6,
      "campaign-content": 8,
      "marketing-automation": 9,
      "funnel-conversion": 6,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 8,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner — different enterprise jobs. Choose Marketo for B2B MAP lead nurture and Adobe/CRM-aligned ops; choose Braze for B2C multi-channel engagement (push/in-app/email/SMS).",
    pricingNotes:
      "Both custom quote / contact sales. SoftwareGlimpse does not invent custom-quote dollars.",
    bestFor: [
      {
        productSlug: "marketo",
        scenarios: ["Enterprise B2B MAP", "Adobe Experience Cloud stacks"],
      },
      {
        productSlug: "braze",
        scenarios: ["Enterprise B2C engagement", "Real-time cross-channel orchestration"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "marketo",
    b: "kartra",
    title: "Marketo vs Kartra",
    labels: { a: "Adobe Marketo Engage", b: "Kartra" },
    scoresA: {
      "ease-of-use": 5,
      "campaign-content": 8,
      "marketing-automation": 9,
      "funnel-conversion": 8,
      "analytics-attribution": 9,
      "brand-monitoring": 4,
      integrations: 9,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Marketo for enterprise B2B MAP governance; choose Kartra for creator all-in-one funnels/courses with published pricing.",
    pricingNotes:
      "Marketo: custom quote only. Kartra: published Essentials from $59/mo researched. Different buyer jobs and TCO models.",
    bestFor: [
      {
        productSlug: "marketo",
        scenarios: ["Enterprise B2B marketing ops", "Complex CRM-integrated nurture"],
      },
      {
        productSlug: "kartra",
        scenarios: ["Creators consolidating funnel + course stacks", "Published-price all-in-one buyers"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "leadpages",
    b: "clickfunnels",
    title: "Leadpages vs ClickFunnels",
    labels: { a: "Leadpages", b: "ClickFunnels" },
    scoresA: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 5,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 2,
      integrations: 8,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 7,
      "campaign-content": 8,
      "marketing-automation": 7,
      "funnel-conversion": 9,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    verdict:
      "No universal winner. Choose Leadpages when landing-page CRO (A/B, Smart Traffic, heatmaps) is the primary job; choose ClickFunnels when multi-step sales funnels and creator checkout stacks are the center of gravity.",
    pricingNotes:
      "Leadpages Grow from $99/mo researched; ClickFunnels Launch from $97/mo ($81/mo annual). Confirm live.",
    bestFor: [
      {
        productSlug: "leadpages",
        scenarios: ["Landing-page CRO with A/B + heatmaps", "Unlimited-traffic page builders"],
      },
      {
        productSlug: "clickfunnels",
        scenarios: ["Funnel-first info-product marketers", "Checkout + upsell path builders"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "leadpages",
    b: "kartra",
    title: "Leadpages vs Kartra",
    labels: { a: "Leadpages", b: "Kartra" },
    scoresA: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 5,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 2,
      integrations: 8,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Leadpages for dedicated landing-page CRO depth; choose Kartra when courses, memberships, email/SMS, and checkouts need one suite.",
    pricingNotes:
      "Leadpages Grow from $99/mo researched. Kartra Essentials from $59/mo researched. Confirm live.",
    bestFor: [
      {
        productSlug: "leadpages",
        scenarios: ["CRO-focused landing pages", "Teams already owning ESP/CRM elsewhere"],
      },
      {
        productSlug: "kartra",
        scenarios: ["Creators consolidating funnel + course stacks", "All-in-one published-price buyers"],
      },
    ],
  }),
  approvedMarketingPair({
    a: "leadpages",
    b: "freshmarketer",
    title: "Leadpages vs Freshmarketer",
    labels: { a: "Leadpages", b: "Freshmarketer" },
    scoresA: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 5,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 2,
      integrations: 8,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 7,
      "campaign-content": 6,
      "marketing-automation": 9,
      "funnel-conversion": 7,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 8,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner. Choose Leadpages when conversion pages and CRO tooling matter most; choose Freshmarketer when Freshworks CRM-aligned marketing automation is the primary job.",
    pricingNotes:
      "Leadpages Grow from $99/mo researched. Freshmarketer pricing is Freshworks-ladder — confirm live.",
    bestFor: [
      {
        productSlug: "leadpages",
        scenarios: ["Standalone landing-page CRO", "AI page creation + heatmaps"],
      },
      {
        productSlug: "freshmarketer",
        scenarios: ["Freshworks CRM marketing automation", "Journey + email orchestration"],
      },
    ],
  }),
  // Business-communications phone-cluster comparisons (Wave-1 onboarding 2026-08-17).
  // Phone peers only — Wati (WhatsApp) and Zenzap (team chat) are different job
  // clusters and are not compared against phone systems.
  approvedBcPair({
    a: "aircall",
    b: "callhippo",
    title: "Aircall vs CallHippo",
    labels: { a: "Aircall", b: "CallHippo" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 7, routing: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Aircall Essentials from ~$30/licence/month on annual billing (research floor — prices render client-side); CallHippo Starter $18/user/month annual with a $0 Basic rung free for the first 6 months. CallHippo is roughly 40% cheaper at entry.",
      userMinimum:
        "Aircall requires 3 licences on Essentials and Professional (25 on Custom); CallHippo Starter requires only 2 users and Basic requires none. Small teams hit the Aircall floor first.",
      numberCoverage:
        "Both include one number per plan with paid additional numbers. Aircall documents unlimited inbound and unlimited simultaneous outbound calling; CallHippo gives unlimited US/CA minutes from Professional with fair-usage exclusions and metered international calling.",
      powerDialer:
        "Aircall: Power Dialer and Voicemail Drop on Professional. CallHippo: stand-alone dialer, AI voicemail drop and auto-rotate in the Pro Suite, but the fair-usage policy prohibits auto/predictive dialing on the Office Phone System.",
      whatsappBusiness:
        "Aircall sells WhatsApp in Aircall as a paid add-on on top of licences; CallHippo lists WhatsApp Business API from the Basic rung with messaging charges billed separately.",
    },
    verdict:
      "No universal winner. Aircall wins on CRM/CTI depth, routing and analytics for mid-market teams that can commit to three licences; CallHippo wins on entry price, seat minimums and bundled WhatsApp for SMB teams that want recording and IVR near $30/user/month.",
    pricingNotes:
      "Aircall: Essentials ~$30 and Professional ~$50 per licence/month annual (3-licence minimum), with AI Assist, Analytics+ and WhatsApp as add-ons. CallHippo: Basic $0 (6 months), Starter $18, Professional $30, Ultimate $42 per user/month annual, plus metered calling, a one-time $20 SMS setup fee and a $10/user/month AI Copilot add-on. Research 2026-08-17 — confirm live.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "Mid-market teams where Salesforce/HubSpot/Zendesk CTI is decisive",
          "Support operations needing smart routing and queue callback",
        ],
      },
      {
        productSlug: "callhippo",
        scenarios: [
          "SMB teams under three seats or on a tight budget",
          "Teams that want WhatsApp Business API bundled with calling",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "aircall",
    b: "krispcall",
    title: "Aircall vs KrispCall",
    labels: { a: "Aircall", b: "KrispCall" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 6, routing: 6, analytics: 6, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "Aircall Essentials from ~$30/licence/month annual; KrispCall Essential $12/user/month annual ($15 monthly). KrispCall is the cheapest entry in the cluster, but its calls and SMS are pay-as-you-go on top of seats.",
      userMinimum:
        "Aircall enforces a 3-licence minimum; KrispCall has no minimum but caps Essential at 5 users and Standard at 50, so the constraint sits at the top rather than the bottom.",
      numberCoverage:
        "KrispCall’s pitch is global virtual numbers with one local or mobile number included per user; Aircall includes one local or toll-free number per plan with paid additions and documents unlimited inbound and simultaneous outbound calling.",
      powerDialer:
        "Aircall: Power Dialer and Voicemail Drop on Professional. KrispCall: power dialer plus listen/whisper/barge monitoring on Standard, absent on Essential.",
      whatsappBusiness:
        "Aircall offers WhatsApp in Aircall as a paid add-on. KrispCall’s WhatsApp position was not verifiable first-party in this research pass and is recorded as unknown.",
    },
    verdict:
      "No universal winner. KrispCall wins on price and international number footprint for small distributed teams; Aircall wins decisively on CRM/CTI depth, routing, analytics and AI for teams whose phone system must sit inside a CRM workflow.",
    pricingNotes:
      "Aircall: ~$30/$50 per licence/month annual with a 3-licence minimum plus add-ons. KrispCall: Essential $12 and Standard $32 per user/month annual, no free plan or trial (14-day money-back), with minutes and SMS billed pay-as-you-go. KrispCall figures are medium confidence — the pricing page blocked automated retrieval.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "CRM-centred sales and support teams needing CTI and routing depth",
          "Teams that want bundled unlimited calling rather than metered usage",
        ],
      },
      {
        productSlug: "krispcall",
        scenarios: [
          "Startups and agencies needing cheap numbers in multiple countries",
          "Teams of five or fewer wanting a real phone system near $12/user/month",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "callhippo",
    b: "krispcall",
    title: "CallHippo vs KrispCall",
    labels: { a: "CallHippo", b: "KrispCall" },
    editorial: {
      a: { "crm-integrations": 7, routing: 7, analytics: 7, "ai-features": 6 },
      b: { "crm-integrations": 6, routing: 6, analytics: 6, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "KrispCall Essential $12/user/month annual is cheaper than CallHippo Starter at $18, but CallHippo publishes a $0 Basic rung (free for the first 6 months) and bundles 1,000 US/CA minutes into Starter while KrispCall meters every minute.",
      userMinimum:
        "CallHippo Starter requires 2 users with no cap below Enterprise (50-user minimum); KrispCall has no minimum but caps Essential at 5 users and Standard at 50.",
      numberCoverage:
        "KrispCall leads on international virtual numbers with one local or mobile number per user; CallHippo leads on bundled domestic calling with unlimited US/CA minutes from Professional plus smart failover and carrier smart-switching.",
      powerDialer:
        "Neither is a parallel dialer. KrispCall puts a power dialer on Standard ($32/user/month annual); CallHippo keeps dialer tooling in the Pro Suite and prohibits auto/predictive dialing on the Office Phone System under fair usage.",
      whatsappBusiness:
        "CallHippo lists WhatsApp Business API from the Basic rung with a free omnichannel inbox; KrispCall’s WhatsApp position could not be verified first-party and is recorded as unknown.",
    },
    verdict:
      "Closest pair in the cluster. CallHippo wins on bundled domestic minutes, WhatsApp availability, routing depth on Ultimate and a free starting rung; KrispCall wins on absolute entry price and international number coverage. Both are SMB-shaped and neither replaces a contact centre.",
    pricingNotes:
      "CallHippo: Basic $0 (6 months), Starter $18 (2-user minimum), Professional $30, Ultimate $42 per user/month annual, plus metered calling and a $10/user/month AI Copilot add-on. KrispCall: Essential $12 (≤5 users), Standard $32 (≤50 users) per user/month annual with pay-as-you-go minutes and SMS. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "callhippo",
        scenarios: [
          "US/Canada-heavy teams that want unlimited domestic calling",
          "Teams that need WhatsApp Business API alongside calling",
        ],
      },
      {
        productSlug: "krispcall",
        scenarios: [
          "Teams needing numbers across many countries at the lowest seat price",
          "Small sales teams that will buy Standard for the power dialer",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "aircall",
    b: "freshcaller",
    title: "Aircall vs Freshcaller",
    labels: { a: "Aircall", b: "Freshcaller" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 7, routing: 8, analytics: 7, "ai-features": 4 },
    },
    factual: {
      startingPricing:
        "Freshcaller publishes a $0 agent tier (pay per minute) and Growth at $15/agent/month annual with 2,000 included incoming minutes; Aircall Essentials starts around $30/licence/month annual with a 3-licence minimum.",
      userMinimum:
        "Freshcaller has no seat minimum and sells $2–$12 day passes for occasional agents; Aircall requires 3 licences (25 on Custom).",
      numberCoverage:
        "Aircall documents unlimited inbound and unlimited simultaneous outbound calling with numbers in many countries; Freshcaller bundles included incoming minutes per tier (2,000/3,000/5,000) and meters outbound.",
      powerDialer:
        "Aircall has Power Dialer and Voicemail Drop on Professional; Freshcaller publishes no power dialer or outbound cadence tooling — it is an inbound-support product.",
      whatsappBusiness:
        "Aircall sells WhatsApp in Aircall as a paid add-on; Freshcaller has no WhatsApp channel — that lives in other Freshworks products.",
    },
    verdict:
      "No universal winner. Freshcaller wins on inbound economics (free tier, bundled incoming minutes, day passes) and native Freshworks fit; Aircall wins on outbound dialing, integration breadth, CRM CTI and AI. Choose by whether the job is inbound support or CRM-connected sales calling.",
    pricingNotes:
      "Freshcaller: Free $0, Growth $15, Pro $39, Enterprise $69 per agent/month annual plus per-minute charges, with $2/$7/$12 day passes and a 14-day trial. Aircall: Essentials ~$30 and Professional ~$50 per licence/month annual (3-licence minimum) plus AI, Analytics+ and WhatsApp add-ons. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "Outbound sales teams needing a dialer and CRM logging",
          "Teams that want 250+ integrations and a Salesforce CTI",
        ],
      },
      {
        productSlug: "freshcaller",
        scenarios: [
          "Support teams already on Freshdesk or Freshsales",
          "Inbound-only teams that want to start free and pay per minute",
        ],
      },
    ],
  }),
  // Business-communications Priority-1 comparisons (onboarding 2026-08-17).
  approvedBcPair({
    a: "aircall",
    b: "ringcentral",
    title: "Aircall vs RingCentral",
    labels: { a: "Aircall", b: "RingCentral" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Aircall Essentials from ~$30/licence/month annual (3-licence minimum, medium confidence — client-side pricing); RingCentral RingEX Core research floor ~$20/user/month annual (medium confidence — selector/quote gated), with Advanced ~$25 and Ultra ~$35.",
      userMinimum:
        "Aircall requires 3 licences on Essentials/Professional; RingCentral seat minimums vary by plan and often land in sales-assisted flows — confirm live. Small CRM-centric teams hit the Aircall floor first; enterprise rollouts usually outgrow that constraint.",
      numberCoverage:
        "Both are multi-country cloud phone platforms. RingCentral’s RingEX envelope includes SMS, video and team messaging in-suite; Aircall focuses on business phone + CTI with unlimited inbound and simultaneous outbound documented first-party.",
      powerDialer:
        "Aircall: Power Dialer and Voicemail Drop on Professional. RingCentral: power dialer is limited/add-on versus sales-dialer specialists — deeper outbound often needs Advanced+ or adjacent tooling.",
      whatsappBusiness:
        "Aircall sells WhatsApp in Aircall as a paid add-on; RingCentral WhatsApp/shared-inbox depth trails messaging-first platforms and is often bundle- or add-on-shaped — confirm current channel packaging.",
    },
    verdict:
      "No universal winner. Aircall wins on CRM/CTI integration depth for mid-market teams living in Salesforce/HubSpot/Zendesk; RingCentral wins on enterprise routing, analytics breadth and all-in-one UCaaS (phone + meetings + messaging + RingCX path). Choose by CTI workspace vs suite standardisation.",
    pricingNotes:
      "Aircall: Essentials ~$30 and Professional ~$50 per licence/month annual (3-licence minimum) plus AI/Analytics+/WhatsApp add-ons. RingCentral: RingEX Core ~$20, Advanced ~$25, Ultra ~$35 per user/month annual research floors (medium confidence); RingCX and AI/CI often quote or add-on. Research 2026-08-17 — confirm live.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "Mid-market teams where native CRM/helpdesk CTI is decisive",
          "Sales/support orgs that want a phone system, not a full UCaaS suite",
        ],
      },
      {
        productSlug: "ringcentral",
        scenarios: [
          "Enterprise/mid buyers standardising phone + meetings + messaging",
          "Organisations that need top-tier routing and a contact-centre path",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "dialpad",
    b: "ringcentral",
    title: "Dialpad vs RingCentral",
    labels: { a: "Dialpad", b: "RingCentral" },
    editorial: {
      a: { "crm-integrations": 8, routing: 9, analytics: 9, "ai-features": 10 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Dialpad Connect Standard ~$15/user/month annual and Pro ~$25 (3-user minimum) research floors (medium confidence); RingCentral RingEX Core ~$20/user/month annual (medium confidence). Dialpad Sell (~$39) and Support (~$80) are separate ladders.",
      userMinimum:
        "Dialpad Pro requires 3 users and Enterprise often 100; RingCentral minimums are plan- and quote-dependent. Micro teams should verify both before assuming self-serve entry.",
      numberCoverage:
        "Both are full cloud-phone / UCaaS platforms with multi-country numbers. RingCentral emphasises carrier-grade RingEX + RingCX expansion; Dialpad emphasises AI-native Connect with Sell/Support product lines for outbound and contact-centre depth.",
      powerDialer:
        "Dialpad: deeper dialer tooling lives on Sell rather than Connect Standard. RingCentral: power dialer limited/add-on versus specialist dialers — Advanced+ unlocks more supervisor/recording surface.",
      whatsappBusiness:
        "Neither is a WhatsApp-first platform. Dialpad WhatsApp/shared-inbox depth is limited; RingCentral WhatsApp packaging is typically add-on or bundle — confirm live channel availability.",
    },
    verdict:
      "No universal winner. Dialpad wins when included AI transcription/summaries and conversation intelligence are the deciding criteria; RingCentral wins on enterprise routing depth, integration breadth and contact-centre path. Close on analytics — decide by AI-included vs suite/routing priority.",
    pricingNotes:
      "Dialpad: Connect Standard ~$15, Pro ~$25 (3-user min), Sell ~$39, Support ~$80 per user/month annual research floors (medium confidence). RingCentral: Core ~$20, Advanced ~$25, Ultra ~$35 per user/month annual plus RingCX/AI add-ons (medium confidence). Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "dialpad",
        scenarios: [
          "Teams that want AI summaries/transcription included on Connect",
          "Buyers shortlisting AI-native calling over suite breadth",
        ],
      },
      {
        productSlug: "ringcentral",
        scenarios: [
          "Enterprise UCaaS standardisation with RingCX expansion",
          "Buyers who need the deepest routing and multi-site phone controls",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "ringcentral",
    b: "zoom",
    title: "RingCentral vs Zoom",
    labels: { a: "RingCentral", b: "Zoom" },
    editorial: {
      a: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 8, analytics: 8, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "RingCentral RingEX Core ~$20/user/month annual (medium confidence); Zoom Phone US/CA Unlimited research floor ~$15–16/user/month annual, with Workplace Pro Plus / Business Plus phone bundles ~$20.50–$24.50 (medium confidence). Zoom also offers free Workplace meetings/chat that are not full Zoom Phone.",
      userMinimum:
        "Both commonly sell through annual seats; Zoom’s free meetings tier has no phone seats. Confirm RingCentral and Zoom Phone minimums on the plan you intend to buy — published floors alone can understate rollout constraints.",
      numberCoverage:
        "Both offer multi-country cloud phone. Zoom’s strength is meetings familiarity plus Zoom Phone SMS/routing; RingCentral’s strength is carrier-grade phone + messaging + video as a UCaaS suite with RingCX.",
      powerDialer:
        "Zoom: Power Pack / dialer tooling is gated or add-on. RingCentral: power dialer limited/add-on versus sales-dialer specialists. Neither replaces a dedicated sales dialer like Kixie for pure outbound cadence.",
      whatsappBusiness:
        "Zoom Phone has no WhatsApp Business channel in this research pass. RingCentral WhatsApp depth trails messaging-first platforms and is typically not the reason to pick RingEX.",
    },
    verdict:
      "No universal winner. Zoom wins when the organisation is already standardised on Zoom meetings and wants the lowest-friction phone extension; RingCentral wins when enterprise routing, analytics depth and an all-in-one UCaaS/contact-centre path matter more than video familiarity.",
    pricingNotes:
      "RingCentral: Core ~$20 / Advanced ~$25 / Ultra ~$35 per user/month annual research floors (medium confidence) plus RingCX/AI. Zoom: Phone US/CA Unlimited ~$15–16; Workplace Pro Plus / Business Plus phone bundles ~$20.50–$24.50 per user/month annual (medium confidence); free meetings/chat exist but Phone is paid. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "ringcentral",
        scenarios: [
          "Enterprise phone-first UCaaS with contact-centre expansion",
          "Buyers who need deeper IVR/queue/supervisor controls than Zoom Phone",
        ],
      },
      {
        productSlug: "zoom",
        scenarios: [
          "Zoom-standardised orgs extending meetings into Zoom Phone",
          "Teams that want free meetings/chat with a paid phone upgrade path",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "aircall",
    b: "nextiva",
    title: "Aircall vs Nextiva",
    labels: { a: "Aircall", b: "Nextiva" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 8, routing: 8, analytics: 8, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Nextiva Core $15 and Engage $25 per user/month annual (high-confidence published floors); Aircall Essentials ~$30/licence/month annual with a 3-licence minimum (medium confidence). Nextiva Scale and Contact Center Essential sit at ~$75/user or agent.",
      userMinimum:
        "Aircall enforces a 3-licence minimum; Nextiva’s published Core/Engage ladders are more SMB-friendly on entry seat economics — confirm current minimums on the plan you buy.",
      numberCoverage:
        "Both are cloud business phone platforms. Nextiva packages messaging apps (including WhatsApp) and unified inbox surfaces more clearly as part of the all-in-one story; Aircall emphasises unlimited inbound/simultaneous outbound calling with deep CTI.",
      powerDialer:
        "Aircall: Power Dialer and Voicemail Drop on Professional. Nextiva: power dialer sits on Contact Center Professional rather than Core — outbound dialer depth is not the Core story.",
      whatsappBusiness:
        "Nextiva supports WhatsApp and messaging apps in the all-in-one ladder; Aircall sells WhatsApp in Aircall as a paid add-on on top of licences.",
    },
    verdict:
      "No universal winner. Aircall wins on native CRM/CTI depth and mid-market routing for teams whose phone must live inside Salesforce/HubSpot/Zendesk; Nextiva wins on published-price SMB/mid all-in-one packaging (phone + messaging apps + CC ladder) and clearer entry floors.",
    pricingNotes:
      "Nextiva: Core $15, Engage $25, Scale $75 per user/month annual; Contact Center from ~$75/agent. Aircall: Essentials ~$30 and Professional ~$50 per licence/month annual (3-licence minimum) plus AI/Analytics+/WhatsApp add-ons. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "Mid-market CRM-centred sales and support teams",
          "Buyers who need CTI depth more than an all-in-one suite",
        ],
      },
      {
        productSlug: "nextiva",
        scenarios: [
          "SMB/mid teams wanting phone + WhatsApp/messaging from one vendor",
          "Buyers who prefer clear published floors over CTI-specialist pricing",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "aircall",
    b: "dialpad",
    title: "Aircall vs Dialpad",
    labels: { a: "Aircall", b: "Dialpad" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 8, routing: 9, analytics: 9, "ai-features": 10 },
    },
    factual: {
      startingPricing:
        "Dialpad Connect Standard ~$15/user/month annual (medium confidence) undercuts Aircall Essentials ~$30/licence/month annual (3-licence minimum). Dialpad Pro ~$25 (3-user minimum); Sell ~$39 when outbound dialer depth is the job.",
      userMinimum:
        "Both effectively start at three seats for the plans most mid-market teams buy (Aircall Essentials/Professional; Dialpad Pro). Dialpad Connect Standard may allow smaller starts — confirm live.",
      numberCoverage:
        "Both are multi-country cloud phone platforms. Aircall documents unlimited inbound and simultaneous outbound calling; Dialpad’s Connect ladder is AI-native UCaaS with Sell/Support as separate product lines.",
      powerDialer:
        "Aircall: Power Dialer on Professional. Dialpad: deeper dialer tooling is on Sell rather than Connect Standard — product-line choice matters as much as plan tier.",
      whatsappBusiness:
        "Aircall offers WhatsApp as a paid add-on; Dialpad’s WhatsApp/shared-inbox depth is limited in this research pass.",
    },
    verdict:
      "No universal winner. Aircall wins on CRM/CTI integration depth for mid-market workspace-centric teams; Dialpad wins when included AI transcription, summaries and conversation intelligence are decisive. Routing is close — decide by CTI vs AI-native calling.",
    pricingNotes:
      "Aircall: ~$30/$50 per licence/month annual with a 3-licence minimum plus add-ons (medium confidence). Dialpad: Connect Standard ~$15, Pro ~$25 (3-user min), Sell ~$39, Support ~$80 per user/month annual research floors (medium confidence). Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "aircall",
        scenarios: [
          "CRM/helpdesk CTI is the primary selection criterion",
          "Teams that want dialer + CTI without jumping product lines",
        ],
      },
      {
        productSlug: "dialpad",
        scenarios: [
          "Buyers who want AI summaries included on Connect",
          "Teams willing to move to Sell when outbound dialer depth becomes the job",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "microsoft-teams",
    b: "slack",
    title: "Microsoft Teams vs Slack",
    labels: { a: "Microsoft Teams", b: "Slack" },
    editorial: {
      a: { "crm-integrations": 10, routing: 5, analytics: 6, "ai-features": 8 },
      b: { "crm-integrations": 10, routing: 4, analytics: 6, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Both offer free tiers. Slack Pro $7.25 and Business+ $15 per user/month annual; Teams is often licensed via Microsoft 365 with a free Teams tier, while Teams Phone Standard ~$10/user/month annual plus PSTN calling plans (~$17–$34 research floors) when telephony is required.",
      userMinimum:
        "Neither is sold as a cloud-phone seat product for this comparison. Slack and Teams seat counts follow collaboration licensing; Teams Phone add-ons only apply when you buy telephony.",
      numberCoverage:
        "Not a phone-peer comparison. Slack has no PSTN business-phone coverage. Teams Phone can add numbers/PSTN, but that is an optional telephony path — not why Teams wins its landscape collaboration award.",
      powerDialer:
        "N/A for both as collaboration hubs. Neither Slack nor Teams (without specialised telephony/contact-centre stacks) is a sales power-dialer product.",
      whatsappBusiness:
        "N/A / not the product job. Customer WhatsApp belongs in a BSP like Wati; Slack Connect and Teams external collaboration are not WhatsApp Business API platforms.",
    },
    verdict:
      "Depends — no universal winner. This is a collaboration comparison, not a phone shootout. Slack wins for channel-first tech/product team messaging culture; Microsoft Teams wins as the M365 collaboration hub (chat, meetings, files, identity). Buy phone separately (or Teams Phone) if PSTN is required.",
    pricingNotes:
      "Slack: Free $0, Pro $7.25, Business+ $15 per user/month annual; Enterprise+ contact sales. Microsoft Teams: free tier + M365 bundling; Teams Phone Standard ~$10/user/month annual plus Calling Plan ~$17 or Domestic+International ~$34 research floors. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "slack",
        scenarios: [
          "Tech and product orgs standardising on channel-based team messaging",
          "Teams that want Slack Connect and a deep app directory",
        ],
      },
      {
        productSlug: "microsoft-teams",
        scenarios: [
          "Organisations standardised on Microsoft 365",
          "Buyers who need chat + meetings + files under one identity plane",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "slack",
    b: "zenzap",
    title: "Slack vs Zenzap",
    labels: { a: "Slack", b: "Zenzap" },
    editorial: {
      a: { "crm-integrations": 10, routing: 4, analytics: 6, "ai-features": 8 },
      b: { "crm-integrations": 5, routing: 5, analytics: 3, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Slack Free $0, Pro $7.25, Business+ $15 per user/month annual. Zenzap: free tier, Pro ~$3/user/month yearly, Business+ ~$8 with HIPAA/integrations/AI agents — positioned for frontline/work-chat budgets rather than enterprise Slack seats.",
      userMinimum:
        "Both are team-chat products without cloud-phone seat minimums. Zenzap targets smaller frontline rollouts; Slack scales from free workspaces to Enterprise+.",
      numberCoverage:
        "N/A — neither is a business phone system. No PSTN number coverage comparison applies.",
      powerDialer:
        "N/A — not dialer products. Choose a cloud phone or sales dialer if outbound calling is the job.",
      whatsappBusiness:
        "Zenzap is often evaluated as a WhatsApp-groups replacement for internal work chat, not as a WhatsApp Business API BSP. Slack is not a customer WhatsApp platform. For official WhatsApp Business API, compare Wati instead.",
    },
    verdict:
      "Depends — no universal winner. Collaboration comparison only. Slack wins for tech-team channel messaging, integrations and scale; Zenzap wins for frontline / multi-site teams that want simple work chat (often replacing informal WhatsApp groups) at a lower seat price.",
    pricingNotes:
      "Slack: Free / Pro $7.25 / Business+ $15 per user/month annual. Zenzap: Free, Pro ~$3/user/month yearly, Business+ ~$8. Research 2026-08-17 — confirm live.",
    bestFor: [
      {
        productSlug: "slack",
        scenarios: [
          "Software and knowledge-work teams needing channels, apps and Slack Connect",
          "Companies already in the Salesforce / SaaS app ecosystem",
        ],
      },
      {
        productSlug: "zenzap",
        scenarios: [
          "Frontline and multi-site teams replacing WhatsApp groups for work chat",
          "Budget-conscious internal messaging without Slack enterprise complexity",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "microsoft-teams",
    b: "zoom",
    title: "Microsoft Teams vs Zoom",
    labels: { a: "Microsoft Teams", b: "Zoom" },
    editorial: {
      a: { "crm-integrations": 10, routing: 5, analytics: 6, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 8, analytics: 8, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Teams: free tier + M365 licensing; Teams Phone Standard ~$10/user/month annual plus PSTN plans when telephony is required. Zoom: free Workplace meetings/chat; Zoom Phone US/CA Unlimited ~$15–16/user/month annual research floor; Workplace phone bundles ~$20.50–$24.50 (medium confidence).",
      userMinimum:
        "Collaboration seats follow M365 or Zoom Workplace licensing. Phone minimums only apply if you buy Teams Phone or Zoom Phone — confirm on the telephony SKU, not the chat/meetings tier.",
      numberCoverage:
        "Partial / depends. Zoom Phone is a first-class UCaaS phone product in this catalogue. Teams Phone is an optional telephony add-on on top of the collaboration hub — capable, but not the landscape reason Teams is awarded here.",
      powerDialer:
        "Zoom Phone: Power Pack / dialer tooling gated or add-on. Teams: no native sales power dialer in the collaboration hub — contact-centre or partner stacks required for dialer-class outbound.",
      whatsappBusiness:
        "N/A for both as primary collaboration products. Neither replaces a WhatsApp Business API platform.",
    },
    verdict:
      "Depends — no universal winner. This is primarily a collaboration / meetings comparison with asymmetric phone paths. Microsoft Teams wins as the M365 hub; Zoom wins when meetings familiarity and a clearer Zoom Phone UCaaS path matter more than Microsoft identity. Do not treat this as a RingCentral-class phone peer shootout.",
    pricingNotes:
      "Microsoft Teams: free / M365; Teams Phone Standard ~$10 plus Calling Plan ~$17 or Domestic+International ~$34 per user/month annual research floors. Zoom: free meetings/chat; Phone US/CA Unlimited ~$15–16; Workplace Pro Plus / Business Plus phone bundles ~$20.50–$24.50 (medium confidence). Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "microsoft-teams",
        scenarios: [
          "M365-standardised organisations needing chat + meetings + files",
          "Buyers who may add Teams Phone later but are buying collaboration first",
        ],
      },
      {
        productSlug: "zoom",
        scenarios: [
          "Video-first orgs standardised on Zoom Workplace",
          "Teams that want Zoom Phone as a dedicated UCaaS path alongside meetings",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "aircall",
    b: "openphone",
    title: "Aircall vs OpenPhone",
    labels: { a: "Aircall", b: "OpenPhone" },
    editorial: {
      a: { "crm-integrations": 10, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 8, routing: 7, analytics: 7, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "OpenPhone Starter $15/user/month annual (high confidence); Business $23; Scale $35. Aircall Essentials ~$30/licence/month annual with a 3-licence minimum (medium confidence). OpenPhone is cheaper at entry with no seat floor.",
      userMinimum:
        "Aircall requires 3 licences on Essentials/Professional; OpenPhone has no seat minimum — solo operators and pairs can start on one Starter seat.",
      numberCoverage:
        "Both are US/Canada-strong cloud phones. OpenPhone includes one local/toll-free number per user with shared-number UX; Aircall includes one number per plan with paid additions and documents unlimited inbound/simultaneous outbound calling.",
      powerDialer:
        "Aircall: Power Dialer and Voicemail Drop on Professional. OpenPhone: no power dialer at any price; fair-use policy prohibits cold calling and auto-dialers.",
      whatsappBusiness:
        "Aircall sells WhatsApp in Aircall as a paid add-on. OpenPhone has no WhatsApp Business channel.",
    },
    verdict:
      "No universal winner. OpenPhone wins on modern SMB shared-phone UX, transparent $15 Starter pricing and included Sona AI answering; Aircall wins on mid-market CRM/CTI depth, routing and outbound dialer tooling. Choose by whether the job is a shared SMB line or a CRM-connected sales/support phone.",
    pricingNotes:
      "OpenPhone: Starter $15, Business $23, Scale $35 per user/month annual. Aircall: Essentials ~$30 and Professional ~$50 per licence/month annual (3-licence minimum) plus AI/Analytics+/WhatsApp add-ons. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "openphone",
        scenarios: [
          "SMB teams wanting a modern shared number with SMS and AI answering",
          "Buyers who refuse a three-licence floor",
        ],
      },
      {
        productSlug: "aircall",
        scenarios: [
          "Mid-market teams where Salesforce/HubSpot/Zendesk CTI is decisive",
          "Sales teams that need Power Dialer and deeper routing",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "callhippo",
    b: "openphone",
    title: "CallHippo vs OpenPhone",
    labels: { a: "CallHippo", b: "OpenPhone" },
    editorial: {
      a: { "crm-integrations": 7, routing: 7, analytics: 7, "ai-features": 6 },
      b: { "crm-integrations": 8, routing: 7, analytics: 7, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "OpenPhone Starter $15/user/month annual; CallHippo Starter $18/user/month annual with a $0 Basic rung free for the first 6 months. CallHippo can be cheaper to trial; OpenPhone’s paid floor is slightly lower than CallHippo Starter.",
      userMinimum:
        "CallHippo Starter requires 2 users; OpenPhone has no seat minimum. Smallest teams hit CallHippo’s floor first on paid Starter.",
      numberCoverage:
        "Both are SMB cloud phones with US/Canada strength. CallHippo bundles domestic minutes on higher rungs and lists WhatsApp Business API; OpenPhone emphasises shared numbers and unlimited US/CA calling & SMS under fair use.",
      powerDialer:
        "CallHippo keeps dialer tooling in the Pro Suite (fair-use limits on office plans). OpenPhone has no dialer and prohibits cold calling/auto-dialers under fair use.",
      whatsappBusiness:
        "CallHippo lists WhatsApp Business API from entry rungs with messaging charges separate. OpenPhone has no WhatsApp Business channel.",
    },
    verdict:
      "Closest SMB phone pair in this Priority-2 set. OpenPhone wins on modern UX, included Sona AI and CRM depth on Business; CallHippo wins on WhatsApp availability, dialer-adjacent packaging and a free starting rung. Neither replaces mid-market Aircall CTI or enterprise UCaaS.",
    pricingNotes:
      "OpenPhone: $15/$23/$35 per user/month annual. CallHippo: Basic $0 (6 months), Starter $18, Professional $30, Ultimate $42 per user/month annual plus metered calling and AI Copilot add-on. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "openphone",
        scenarios: [
          "Teams that want a modern shared inbox phone with AI answering",
          "Buyers prioritising HubSpot/Salesforce on Business over WhatsApp",
        ],
      },
      {
        productSlug: "callhippo",
        scenarios: [
          "SMB teams that want WhatsApp alongside calling",
          "Buyers who want a free Basic rung before committing",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "nextiva",
    b: "openphone",
    title: "Nextiva vs OpenPhone",
    labels: { a: "Nextiva", b: "OpenPhone" },
    editorial: {
      a: { "crm-integrations": 8, routing: 8, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 8, routing: 7, analytics: 7, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Nextiva Core $15 and Engage $25 per user/month annual (high confidence); OpenPhone Starter $15 / Business $23 / Scale $35 annual (high confidence). Entry floors match at $15; Nextiva Scale/CC climb much higher.",
      userMinimum:
        "Neither enforces an Aircall-class 3-licence floor on the published SMB rungs — confirm live minimums on the exact Nextiva plan you buy.",
      numberCoverage:
        "Nextiva is an all-in-one business communications suite (voice, SMS, video, team chat, digital channels). OpenPhone is a focused shared business phone + SMS product without native video meetings or full UCaaS chat.",
      powerDialer:
        "Nextiva: power dialer sits on Contact Center Professional rather than Core. OpenPhone: no power dialer; fair use blocks cold calling/auto-dialers.",
      whatsappBusiness:
        "Nextiva packages messaging apps (including WhatsApp) more clearly in the all-in-one story. OpenPhone has no WhatsApp Business channel.",
    },
    verdict:
      "Depends on suite vs specialist. Nextiva wins when you want all-in-one SMB/mid business communications (voice + meetings + messaging apps); OpenPhone wins when you want a modern shared phone with transparent pricing and AI answering without buying a full suite.",
    pricingNotes:
      "Nextiva: Core $15, Engage $25, Scale $75 per user/month annual. OpenPhone: Starter $15, Business $23, Scale $35 per user/month annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "nextiva",
        scenarios: [
          "SMB/mid teams consolidating voice, chat and digital channels",
          "Buyers who may need a contact-centre path later",
        ],
      },
      {
        productSlug: "openphone",
        scenarios: [
          "Teams that only need a modern shared business phone + SMS",
          "Buyers who want included Sona AI answering on a simple ladder",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "eightx8",
    b: "ringcentral",
    title: "8x8 vs RingCentral",
    labels: { a: "8x8", b: "RingCentral" },
    editorial: {
      a: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "RingCentral RingEX Core research floor ~$20/user/month annual (medium — selector/quote gated); Advanced ~$25, Ultra ~$35. 8x8 Work X2 ~$24 and X4 ~$44 annual (medium — first-party often bot/quote gated); Express ~$15. Both hide clean list dollars frequently.",
      userMinimum:
        "Both are mid-market/enterprise UCaaS sales motions more than self-serve micro-team phones. Confirm seat minimums on the quote you receive.",
      numberCoverage:
        "Both are global UCaaS platforms with multi-country calling, video meetings and team messaging. 8x8 emphasises X-series international calling packages; RingCentral emphasises RingEX + RingCX contact-centre path.",
      powerDialer:
        "Both treat power dialer as limited/add-on or separate ladder rather than a first-class Core/X2 feature. Neither is primarily a sales parallel-dialer product.",
      whatsappBusiness:
        "Both offer limited WhatsApp / digital-channel depth versus dedicated messaging platforms. Contact-centre / engagement bundles deepen channels on both sides.",
    },
    verdict:
      "Closest enterprise UCaaS pair in this catalogue — effectively a tie on editorial axes. RingCentral leads overall (8.8 vs 8.6) on suite breadth and contact-centre path familiarity; 8x8 matches on voice/routing/analytics and is the clearest RingCentral alternative for global UCaaS shortlists. Decide on quote, regional coverage and CC packaging — not a feature blowout.",
    pricingNotes:
      "RingCentral RingEX ~$20/$25/$35 per user/month annual (medium). 8x8 Work X2 ~$24 / X4 ~$44 annual (medium); Contact Center X6–X8 commonly ~$85–$140. Mandatory fees often apply on 8x8. Research 2026-08-17 — confirm live quotes.",
    bestFor: [
      {
        productSlug: "ringcentral",
        scenarios: [
          "Buyers standardising on the most familiar enterprise UCaaS shortlist leader",
          "Organisations that want RingCX as the contact-centre path",
        ],
      },
      {
        productSlug: "eightx8",
        scenarios: [
          "Teams comparing a second global UCaaS/CC vendor to RingCentral",
          "Buyers who want X4 speech analytics / quality management in-suite",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "goto-connect",
    b: "ringcentral",
    title: "GoTo Connect vs RingCentral",
    labels: { a: "GoTo Connect", b: "RingCentral" },
    editorial: {
      a: { "crm-integrations": 8, routing: 8, analytics: 7, "ai-features": 7 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "RingCentral RingEX Core ~$20/user/month annual research floor (medium). GoTo Connect is custom-quote only on goto.com/connect/pricing — industry ranges sometimes cite ~$26 Phone System / ~$34 CX / ~$80 Contact Center (low confidence, not list prices).",
      userMinimum:
        "Both are sales-assisted for serious rollouts. GoTo’s entire ladder is quote-gated; RingCentral seat floors are often selector/quote gated too.",
      numberCoverage:
        "Both offer cloud phone with multi-country calling claims, video meetings and team messaging. RingCentral’s RingEX/RingCX envelope is the deeper enterprise UCaaS + contact-centre story; GoTo Connect is stronger as remote-team mid-tier UCaaS.",
      powerDialer:
        "RingCentral: limited/add-on power dialer. GoTo Connect: auto-dialer on Contact Center ladder, not Phone System.",
      whatsappBusiness:
        "GoTo Connect puts WhatsApp/social channels on CX ladders. RingCentral WhatsApp/shared inbox depth is limited versus messaging platforms.",
    },
    verdict:
      "No universal winner. RingCentral wins on enterprise UCaaS depth, routing, analytics and overall score (8.8 vs 7.4); GoTo Connect wins for remote-team buyers who want phone + meetings + messaging mid-tier and can accept fully quote-based pricing. Do not treat GoTo as a RingCentral feature peer.",
    pricingNotes:
      "RingCentral RingEX ~$20/$25/$35 per user/month annual (medium). GoTo Connect: custom quote only; research ranges low confidence. AI Receptionist add-on on GoTo. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "ringcentral",
        scenarios: [
          "Enterprise/mid UCaaS and contact-centre path buyers",
          "Shortlists that need the strongest routing and analytics envelope",
        ],
      },
      {
        productSlug: "goto-connect",
        scenarios: [
          "Remote/multi-location teams prioritising meetings + phone mid-tier",
          "Buyers already in the GoTo ecosystem",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "callhippo",
    b: "grasshopper",
    title: "CallHippo vs Grasshopper",
    labels: { a: "CallHippo", b: "Grasshopper" },
    editorial: {
      a: { "crm-integrations": 7, routing: 7, analytics: 7, "ai-features": 6 },
      b: { "crm-integrations": 5, routing: 6, analytics: 5, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "Grasshopper True Solo ~$14/month annual flat account (medium); Solo Plus ~$25; Small Business ~$55. CallHippo Starter $18/user/month annual with a $0 Basic rung. Grasshopper can be cheaper for a solo virtual number; CallHippo is per-seat once the team grows.",
      userMinimum:
        "Grasshopper True Solo is 1 user; Solo Plus allows unlimited users on one number. CallHippo Starter requires 2 users on the paid office ladder.",
      numberCoverage:
        "Grasshopper is a virtual-number / extensions product for US/Canada. CallHippo is a fuller SMB cloud phone with IVR, recording and CRM logging on Professional — not just a forwarded virtual line.",
      powerDialer:
        "CallHippo: dialer tooling in Pro Suite with fair-use limits. Grasshopper: no power dialer.",
      whatsappBusiness:
        "CallHippo lists WhatsApp Business API. Grasshopper has no WhatsApp Business API product.",
    },
    verdict:
      "Different jobs under the SMB phone umbrella. Grasshopper wins for the simplest affordable virtual business number; CallHippo wins when you need a real SMB phone system with IVR, recording, CRM logging and optional WhatsApp. Do not treat Grasshopper as a CallHippo feature peer.",
    pricingNotes:
      "Grasshopper: True Solo ~$14, Solo Plus ~$25, Small Business ~$55 per month annual flat (medium). CallHippo: Basic $0 (6 months), Starter $18, Professional $30, Ultimate $42 per user/month annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "grasshopper",
        scenarios: [
          "Solo operators who mainly need a professional virtual number",
          "Buyers who want flat account pricing instead of per-seat maths",
        ],
      },
      {
        productSlug: "callhippo",
        scenarios: [
          "SMB teams needing IVR, recording and CRM logging",
          "Buyers who want WhatsApp alongside calling",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "respond-io",
    b: "wati",
    title: "respond.io vs Wati",
    labels: { a: "respond.io", b: "Wati" },
    editorial: {
      a: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 9 },
      b: { "crm-integrations": 7, routing: 8, analytics: 7, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "respond.io Starter $79, Growth $159, Advanced $279 per month on yearly billing (high confidence). Wati Growth research floor ~$49/month platform fee (medium — region-rendered) plus Meta per-message charges. respond.io’s platform floor is higher; both stack channel/Meta fees.",
      userMinimum:
        "Neither is a phone-seat product. respond.io uses monthly active contacts packaging; Wati gates extra agent seats steeply on higher rungs. Compare contact volume and agent economics, not VoIP licences.",
      numberCoverage:
        "N/A for PSTN. Both are WhatsApp / customer messaging platforms — not business phone systems. respond.io emphasises omnichannel inbox; Wati emphasises WhatsApp Business API specialist packaging.",
      powerDialer:
        "N/A — neither is a dialer. Pair with a cloud phone if PSTN calling is required.",
      whatsappBusiness:
        "Both support official WhatsApp Business API. respond.io positions WhatsApp inside a broader omnichannel inbox with workflows and AI Agents; Wati is the WhatsApp-specialist BSP with broadcasts, templates and Astra AI agents.",
    },
    verdict:
      "Messaging-cluster comparison only — not a phone shootout. respond.io wins on omnichannel breadth, workflow automation and AI Agents packaging (overall 8.2 vs 7.6); Wati wins when WhatsApp-specialist BSP pricing and blue-tick/API packaging matter more than multi-channel inbox depth. Never rank either against RingCentral/Aircall as phone peers.",
    pricingNotes:
      "respond.io: Starter $79, Growth $159, Advanced $279/month yearly; Enterprise custom. Wati: Growth ~$49 research floor (medium) plus Meta message fees; Pro/Business higher with per-extra-user charges. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "respond-io",
        scenarios: [
          "Teams that need WhatsApp plus other messaging channels in one inbox",
          "Buyers who want workflows and AI Agents on Growth+",
        ],
      },
      {
        productSlug: "wati",
        scenarios: [
          "Ecommerce/D2C teams standardised on WhatsApp as the primary channel",
          "Buyers who want WhatsApp-specialist BSP packaging and broadcasts",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "webex",
    b: "zoom",
    title: "Cisco Webex vs Zoom",
    labels: { a: "Cisco Webex", b: "Zoom" },
    editorial: {
      a: { "crm-integrations": 9, routing: 8, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 8, routing: 8, analytics: 8, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Zoom Phone US/CA Unlimited research floor ~$15/user/month annual (medium). Webex Meet ~$14.50 and Suite ~$22.50 research floors (medium — dynamic/EA). Both have free meeting tiers; Calling packaging differs by SKU.",
      userMinimum:
        "Both are sales-assisted for serious Calling rollouts. Webex Enterprise/EA and Zoom Workplace phone packages often quote-gated.",
      numberCoverage:
        "Both deliver meetings-first UC with cloud calling add-ons. Zoom is the default video standard for many orgs; Webex Calling sits inside Cisco hybrid-work / device / EA gravity.",
      powerDialer:
        "Neither is a power-dialer specialist. Limited outbound dialer options versus CallHippo/Five9.",
      whatsappBusiness:
        "Neither is a WhatsApp Business BSP. Pair with Wati/respond.io for customer messaging.",
    },
    verdict:
      "No universal winner. Zoom wins when the org is already meetings-standardised and only needs Zoom Phone; Webex wins inside Cisco EA / hybrid-work / device ecosystems needing Calling + meetings + messaging. Overall scores are close (Webex 8.0 vs Zoom 8.4) — decide on ecosystem fit, not a feature blowout.",
    pricingNotes:
      "Zoom Phone ~$15/user/mo annual research floor (medium). Webex Meet ~$14.50 / Suite ~$22.50 (medium). Free tiers on both. Research 2026-08-17 — confirm live cart/EA.",
    bestFor: [
      {
        productSlug: "webex",
        scenarios: [
          "Cisco EA / hybrid-work organisations extending into Webex Calling",
          "Buyers needing FedRAMP / Enterprise security paths with room devices",
        ],
      },
      {
        productSlug: "zoom",
        scenarios: [
          "Video-standardised orgs adding Zoom Phone",
          "Teams that want the default meetings UX with a lighter phone add-on",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "ringcentral",
    b: "webex",
    title: "RingCentral vs Cisco Webex",
    labels: { a: "RingCentral", b: "Cisco Webex" },
    editorial: {
      a: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 8, analytics: 8, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "RingCentral RingEX Core ~$20/user/month annual (medium). Webex Suite ~$22.50 research floor (medium); Meet lower; Enterprise/Calling often EA-quoted.",
      userMinimum:
        "Both are enterprise/mid UCaaS purchases with sales involvement. RingCentral seat floors often selector/quote gated; Webex EA packaging is common.",
      numberCoverage:
        "RingCentral is UCaaS-first (phone + meetings + messaging + RingCX path). Webex is meetings/messaging-first with Webex Calling and a separate Contact Center line under Cisco.",
      powerDialer:
        "RingCentral: limited/add-on. Webex: limited versus dialer/CCaaS specialists.",
      whatsappBusiness:
        "Neither is a WhatsApp-first BSP. Limited shared-inbox depth versus messaging platforms.",
    },
    verdict:
      "No universal winner. RingCentral wins on UCaaS-first routing depth and overall phone-cluster score (8.8 vs 8.0); Webex wins for Cisco-ecosystem hybrid-work UC with meetings gravity and Calling. Choose by ecosystem and whether phone or meetings is the primary standard.",
    pricingNotes:
      "RingCentral RingEX ~$20/$25/$35 annual (medium). Webex Meet/Suite research floors medium; Enterprise/CC custom. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "ringcentral",
        scenarios: [
          "UCaaS-first mid-market and enterprise shortlists",
          "Buyers who need top-tier IVR/queues and RingCX path",
        ],
      },
      {
        productSlug: "webex",
        scenarios: [
          "Cisco EA customers standardising on Webex App + Calling",
          "Hybrid-work orgs prioritising meetings + devices with Calling",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "nextiva",
    b: "vonage",
    title: "Nextiva vs Vonage",
    labels: { a: "Nextiva", b: "Vonage" },
    editorial: {
      a: { "crm-integrations": 8, routing: 8, analytics: 8, "ai-features": 7 },
      b: { "crm-integrations": 7, routing: 7, analytics: 6, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "Nextiva Core $15/user/month annual (high research). Vonage Mobile $13.99/line/month on 12-month promo ($19.99 monthly) — high confidence from vonage.com.",
      userMinimum:
        "Both are per-seat/line SMB-friendly. Vonage publishes volume discounts at higher line counts; Nextiva tiers Core/Engage/Scale.",
      numberCoverage:
        "Both are US/Canada-centric SMB/mid cloud phones with SMS. Nextiva positions as all-in-one business communications; Vonage VBC is a clearer published-line VoIP ladder (Mobile/Premium/Advanced).",
      powerDialer:
        "Neither is a power-dialer specialist. CallHippo is the closer dialer-adjacent SMB peer.",
      whatsappBusiness:
        "Nextiva lists WhatsApp apps on higher packaging. Vonage VBC is not a WhatsApp BSP.",
    },
    verdict:
      "No universal winner. Nextiva wins on all-in-one SMB/mid UCaaS breadth and overall score (8.1 vs 6.9); Vonage wins when transparent Mobile→Advanced per-line promo floors and simple VoIP packaging matter more than suite breadth.",
    pricingNotes:
      "Nextiva Core $15 / Engage $25 / Scale $75 research. Vonage Mobile/Premium/Advanced $13.99/$20.99/$27.99 annual promo. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "nextiva",
        scenarios: [
          "SMB/mid teams wanting all-in-one business communications",
          "Buyers who may need WhatsApp apps on higher Nextiva packaging",
        ],
      },
      {
        productSlug: "vonage",
        scenarios: [
          "Teams that want published per-line VoIP with SMS",
          "Buyers growing into Premium video meetings and CRM",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "callhippo",
    b: "ooma",
    title: "CallHippo vs Ooma",
    labels: { a: "CallHippo", b: "Ooma" },
    editorial: {
      a: { "crm-integrations": 7, routing: 7, analytics: 7, "ai-features": 6 },
      b: { "crm-integrations": 6, routing: 7, analytics: 6, "ai-features": 5 },
    },
    factual: {
      startingPricing:
        "CallHippo Starter $18/user/month annual with a $0 Basic rung. Ooma Essentials $19.95/user/month monthly with no annual lock-in (high) — Pro $24.95 / Pro Plus $29.95.",
      userMinimum:
        "CallHippo Starter requires 2 users on the paid office ladder. Ooma is per-user with no required annual contract.",
      numberCoverage:
        "Both are SMB cloud phones. CallHippo emphasises dialer-adjacent outbound; Ooma emphasises receptionist/ring groups and no-contract monthly Office tiers.",
      powerDialer:
        "CallHippo: dialer tooling in Pro Suite with fair-use limits. Ooma: auto-dialer on Pro Plus only — not a power-dialer story.",
      whatsappBusiness:
        "CallHippo lists WhatsApp Business API. Ooma has no WhatsApp Business API product.",
    },
    verdict:
      "No universal winner. CallHippo wins for SMB phone value with dialer-adjacent packaging (overall 7.2 vs 6.6); Ooma wins when no-contract monthly floors and simple receptionist/queues matter more than outbound dialing.",
    pricingNotes:
      "CallHippo: Basic $0 (6 months), Starter $18, Professional $30, Ultimate $42 per user/month annual. Ooma: Essentials $19.95, Pro $24.95, Pro Plus $29.95 monthly. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "callhippo",
        scenarios: [
          "SMB sales teams needing dialer-adjacent outbound on a budget",
          "Buyers who want WhatsApp Business API later",
        ],
      },
      {
        productSlug: "ooma",
        scenarios: [
          "Small businesses refusing annual VoIP lock-in",
          "Teams under ~15 seats needing receptionist and Pro Plus queues",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "genesys",
    b: "talkdesk",
    title: "Genesys vs Talkdesk",
    labels: { a: "Genesys", b: "Talkdesk" },
    editorial: {
      a: { "crm-integrations": 10, routing: 10, analytics: 10, "ai-features": 9 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 9 },
    },
    factual: {
      startingPricing:
        "Genesys Cloud CX 1 $75 / CX 2 $115 / CX 3 $155 / CX 4 $240 named annual (high — genesys.com/pricing). Talkdesk Digital $85 / Voice $105 / Elite $165 / Industry $225 per user/month (high — talkdesk.com/pricing). Different licence shapes (named vs often concurrent/contracted).",
      userMinimum:
        "Both are mid-market/enterprise CCaaS — not SMB phone seats. Talkdesk Express offers a limited free-credit path for small US/CA businesses; Genesys is enterprise-shaped.",
      numberCoverage:
        "CCaaS comparison only — agent queues, omnichannel, WFM. Genesys leads enterprise journey/WEM breadth; Talkdesk leads mid-market CX Cloud edition clarity and CXA AI packaging.",
      powerDialer:
        "Both support outbound/blended campaigns. Five9 is the dialer-forward CCaaS peer in this catalogue.",
      whatsappBusiness:
        "Both support digital messaging channels on higher editions; neither replaces a WhatsApp BSP specialist.",
    },
    verdict:
      "CCaaS-cluster comparison only — never a phone shootout. Genesys wins on enterprise orchestration depth and overall (8.8 vs 8.4); Talkdesk wins for mid-market buyers who want published CX Cloud edition floors and CXA AI add-ons. Do not rank either against OpenPhone/RingCentral as phone peers.",
    pricingNotes:
      "Genesys CX 1–4 $75/$115/$155/$240 named annual. Talkdesk $85/$105/$165/$225. AI tokens/add-ons and telephony usage extra. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "genesys",
        scenarios: [
          "Enterprise contact centres needing WEM + journey orchestration",
          "Regulated industries standardising on Genesys Cloud CX",
        ],
      },
      {
        productSlug: "talkdesk",
        scenarios: [
          "Mid-market teams wanting published CX Cloud editions",
          "Buyers evaluating CXA Copilot/Autopilot as a primary CX bet",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "five9",
    b: "talkdesk",
    title: "Five9 vs Talkdesk",
    labels: { a: "Five9", b: "Talkdesk" },
    editorial: {
      a: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 8 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 9 },
    },
    factual: {
      startingPricing:
        "Five9 Digital $119 / Core $159 concurrent seat/month with 50-seat minimum (high); Plus/Pro/Enterprise quote-only. Talkdesk Digital $85 / Voice $105 / Elite $165 / Industry $225 per user/month (high).",
      userMinimum:
        "Five9: 50 concurrent seats minimum — excludes small teams. Talkdesk: no 50-seat floor on published CX Cloud; Express path for small US/CA businesses.",
      numberCoverage:
        "CCaaS only. Five9 emphasises blended dialer/outbound and concurrent-seat economics; Talkdesk emphasises Studio routing, Elite omnichannel and CXA AI.",
      powerDialer:
        "Five9 leads on dialer/blended outbound posture. Talkdesk supports outbound/proactive engagement on higher editions.",
      whatsappBusiness:
        "Both offer digital channels; WhatsApp depth is limited/coming vs BSP specialists.",
    },
    verdict:
      "CCaaS-cluster comparison only. Talkdesk wins on edition clarity, omnichannel Elite packaging and overall (8.4 vs 8.2); Five9 wins when concurrent-seat dialer strength and 50+ agent economics are the purchase. Never rank either as a phone-system peer.",
    pricingNotes:
      "Five9 Digital/Core $119/$159 concurrent (50-seat min); higher tiers quote-only. Talkdesk $85–$225. Research 2026-08-17 — do not invent Five9 Plus/Pro dollars.",
    bestFor: [
      {
        productSlug: "five9",
        scenarios: [
          "Contact centres needing blended dialer strength at 50+ concurrent seats",
          "Buyers who want CRM/UC adapter choice inside CCaaS",
        ],
      },
      {
        productSlug: "talkdesk",
        scenarios: [
          "Mid-market CX teams wanting published Elite omnichannel floors",
          "Buyers under the Five9 50-seat minimum",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "genesys",
    b: "ringcentral",
    title: "Genesys vs RingCentral",
    labels: { a: "Genesys", b: "RingCentral" },
    editorial: {
      a: { "crm-integrations": 10, routing: 10, analytics: 10, "ai-features": 9 },
      b: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "Genesys CX 1 $75 named annual (high). RingCentral RingEX Core ~$20/user/month annual (medium). Different jobs — CCaaS agent seats vs UCaaS phone seats.",
      userMinimum:
        "Genesys is enterprise CCaaS. RingCentral is UCaaS with optional RingCX contact-centre path — not the same purchase as Genesys Cloud CX.",
      numberCoverage:
        "Cross-cluster comparison for decision-path clarity only. Genesys is the contact-centre platform; RingCentral is the UCaaS suite that can expand into RingCX.",
      powerDialer:
        "Genesys: outbound campaigns first-party. RingCentral: limited/add-on versus CCaaS dialers.",
      whatsappBusiness:
        "Genesys digital channels on CX 2+. RingCentral WhatsApp/shared inbox limited versus messaging specialists.",
    },
    verdict:
      "Different jobs. Genesys wins when you are buying enterprise CCaaS; RingCentral wins when you need UCaaS phone + meetings + messaging with an optional lighter CC path. Do not treat them as interchangeable phone peers — SoftwareGlimpse ranks RingCentral in the phone cluster and Genesys as a CCaaS landscape award only.",
    pricingNotes:
      "Genesys CX 1–4 $75/$115/$155/$240 named annual. RingCentral RingEX ~$20/$25/$35 annual (medium). Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "genesys",
        scenarios: [
          "Enterprise contact-centre / experience orchestration buyers",
          "Teams that need WEM and journey management as the core platform",
        ],
      },
      {
        productSlug: "ringcentral",
        scenarios: [
          "UCaaS-first organisations needing phone + meetings + messaging",
          "Buyers who want RingCX as an expansion path, not a CCaaS-first buy",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "manychat",
    b: "respond-io",
    title: "ManyChat vs respond.io",
    labels: { a: "ManyChat", b: "respond.io" },
    editorial: {
      a: { "crm-integrations": 7, routing: 6, analytics: 6, "ai-features": 7 },
      b: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 9 },
    },
    factual: {
      startingPricing:
        "ManyChat Free $0 / Essential ~$14 annual (medium) / Pro $29 annual (high). respond.io Starter $79 yearly (high). Different jobs — marketing chatbot vs omnichannel support inbox.",
      userMinimum:
        "ManyChat: Free/Essential creator packaging; Pro adds inbox seats. respond.io: platform subscription with MAC tiers, not per-seat softphone minimums.",
      numberCoverage:
        "Messaging-cluster only. ManyChat emphasises Instagram/Messenger/WhatsApp growth automations; respond.io emphasises WhatsApp + omnichannel shared inbox for support/sales.",
      powerDialer:
        "Neither is a power dialer. Outbound = broadcasts/automations (ManyChat strong for marketing) vs workflows/broadcasts (respond.io Growth+).",
      whatsappBusiness:
        "Both support WhatsApp. ManyChat WhatsApp gated to Pro+ on the new Active Contacts model; respond.io is WhatsApp-first omnichannel from Starter.",
    },
    verdict:
      "Messaging-cluster comparison only. respond.io wins for omnichannel support inboxes (overall 8.2 vs 7.2); ManyChat wins for creator/marketing DM automations with a Free path. Never rank either as a phone-system peer.",
    pricingNotes:
      "ManyChat Free / Pro $29 annual (high); Essential ~$14 medium. respond.io $79/$159/$279 yearly. Research 2026-08-17. Channel/Meta fees extra.",
    bestFor: [
      {
        productSlug: "manychat",
        scenarios: [
          "Creators and ecommerce brands automating Instagram/Messenger DMs",
          "Buyers who need a Free tier before WhatsApp on Pro",
        ],
      },
      {
        productSlug: "respond-io",
        scenarios: [
          "Support teams needing WhatsApp + multi-channel shared inbox",
          "Buyers who want AI Agents and workflows on Growth+",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "manychat",
    b: "wati",
    title: "ManyChat vs Wati",
    labels: { a: "ManyChat", b: "Wati" },
    editorial: {
      a: { "crm-integrations": 7, routing: 6, analytics: 6, "ai-features": 7 },
      b: { "crm-integrations": 7, routing: 8, analytics: 7, "ai-features": 8 },
    },
    factual: {
      startingPricing:
        "ManyChat Free / Essential ~$14 / Pro $29 annual. Wati publishes WhatsApp BSP seat/plan floors (confirm live Wati pricing). Different emphasis — marketing multi-channel chatbot vs WhatsApp BSP specialist.",
      userMinimum:
        "ManyChat Active Contacts packaging. Wati typically agent/seat WhatsApp BSP packaging — confirm current minimums on Wati.",
      numberCoverage:
        "Messaging-cluster only. ManyChat spans IG/Messenger/WhatsApp/Telegram; Wati is WhatsApp Business API specialist.",
      powerDialer: "Neither offers a power dialer — messaging outbound only.",
      whatsappBusiness:
        "Wati is WhatsApp-first BSP. ManyChat WhatsApp on Pro+ (new model) alongside Instagram/Messenger growth channels.",
    },
    verdict:
      "Messaging-cluster comparison only. Wati wins when WhatsApp BSP support inbox is the job; ManyChat wins for multi-channel marketing automations with a Free path. Not phone peers.",
    pricingNotes:
      "ManyChat Free / Pro $29 annual (high); Essential ~$14 medium. Wati: confirm current BSP floors on vendor pricing. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "manychat",
        scenarios: [
          "Multi-channel creator marketing (IG + Messenger + WhatsApp)",
          "Teams that want Free/Essential before Pro WhatsApp",
        ],
      },
      {
        productSlug: "wati",
        scenarios: [
          "WhatsApp Business API specialist programmes",
          "Support teams standardised on WhatsApp shared inbox",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "intercom",
    b: "manychat",
    title: "Intercom vs ManyChat",
    labels: { a: "Intercom", b: "ManyChat" },
    editorial: {
      a: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 9 },
      b: { "crm-integrations": 7, routing: 6, analytics: 6, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Intercom Essential $29/seat + Fin from $0.99/outcome (high). ManyChat Free / Pro $29 annual platform (high). Different jobs — AI CS inbox vs marketing chatbot.",
      userMinimum:
        "Intercom: per full seat + Fin outcomes. ManyChat: Active Contacts tiers; inbox seats add-on on Pro.",
      numberCoverage:
        "Messaging-cluster only. Intercom is Messenger/helpdesk CS with Fin; ManyChat is growth DM automation across social channels.",
      powerDialer: "Neither is a dialer. Intercom outbound via Proactive Support Plus; ManyChat via broadcasts/automations.",
      whatsappBusiness:
        "Both offer WhatsApp as add-on/higher packaging. Intercom WhatsApp is pay-as-you-go channel; ManyChat WhatsApp on Pro+.",
    },
    verdict:
      "Messaging-cluster comparison only. Intercom wins for AI-first CS shared inbox (overall 8.0 vs 7.2); ManyChat wins for affordable marketing chatbot automations. CS-borderline Intercom also carries secondary customer-service taxonomy. Not phone peers.",
    pricingNotes:
      "Intercom $29/$85/$132 seats + Fin $0.99/outcome. ManyChat Free / Pro $29 annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "intercom",
        scenarios: [
          "SaaS support teams wanting Fin AI + Messenger inbox",
          "Buyers evaluating AI resolution outcomes as a CX bet",
        ],
      },
      {
        productSlug: "manychat",
        scenarios: [
          "Creators needing Free-tier Instagram/Messenger automations",
          "Marketing teams that do not need Fin-priced CS AI",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "intercom",
    b: "respond-io",
    title: "Intercom vs respond.io",
    labels: { a: "Intercom", b: "respond.io" },
    editorial: {
      a: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 9 },
      b: { "crm-integrations": 9, routing: 9, analytics: 8, "ai-features": 9 },
    },
    factual: {
      startingPricing:
        "Intercom Essential $29/seat + Fin outcomes (high). respond.io Starter $79 platform yearly (high). Both messaging/CS — Intercom is Messenger/Fin-first; respond.io is WhatsApp/omnichannel-first.",
      userMinimum:
        "Intercom: seat + Fin usage. respond.io: MAC-based platform plans without classic softphone seat minimums.",
      numberCoverage:
        "Messaging-cluster only. Intercom: in-app Messenger + help center. respond.io: WhatsApp + multi-channel shared inbox.",
      powerDialer: "Neither is a power dialer — CS/messaging outbound only.",
      whatsappBusiness:
        "respond.io is WhatsApp-first omnichannel. Intercom WhatsApp is a pay-as-you-go channel on top of Messenger/inbox.",
    },
    verdict:
      "Messaging-cluster comparison only — near-tie on editorial criteria. Choose Intercom for Fin AI + in-app Messenger CS; choose respond.io for WhatsApp-first omnichannel support. Both landscape-only vs phones; Intercom also secondary customer-service.",
    pricingNotes:
      "Intercom $29/$85/$132 + Fin $0.99/outcome. respond.io $79/$159/$279 yearly. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "intercom",
        scenarios: [
          "Product-led SaaS wanting Fin inside Messenger",
          "Teams already standardised on Intercom help center",
        ],
      },
      {
        productSlug: "respond-io",
        scenarios: [
          "WhatsApp-first support and sales messaging ops",
          "Teams that need multi-channel inbox without Intercom Messenger",
        ],
      },
    ],
  }),
  approvedBcPair({
    a: "talkdesk",
    b: "twilio",
    title: "Talkdesk vs Twilio",
    labels: { a: "Talkdesk", b: "Twilio" },
    editorial: {
      a: { "crm-integrations": 9, routing: 10, analytics: 9, "ai-features": 9 },
      b: { "crm-integrations": 10, routing: 8, analytics: 7, "ai-features": 7 },
    },
    factual: {
      startingPricing:
        "Talkdesk Digital Essentials $85/user/mo (high). Twilio pay-as-you-go (US SMS $0.0083/msg; Flex named $150) — high. Different jobs — packaged CCaaS vs programmable CPaaS.",
      userMinimum:
        "Talkdesk: CX Cloud agent seats. Twilio: no SMB softphone seats — engineering builds the experience; Flex optional named/hourly.",
      numberCoverage:
        "Cross-cluster landscape comparison. Talkdesk is turnkey cloud contact center; Twilio is developer platform (+ optional Flex).",
      powerDialer:
        "Talkdesk: blended outbound on higher editions. Twilio: programmable outbound APIs — DIY dialer, not a packaged power dialer.",
      whatsappBusiness:
        "Talkdesk: limited/digital channels. Twilio: first-party WhatsApp API meters.",
    },
    verdict:
      "Different jobs. Talkdesk wins when you buy a packaged mid-market CCaaS (overall 8.4); Twilio wins when you need programmable voice/SMS APIs or a Flex build-your-own centre (overall 7.9 as adjacent CPaaS). Neither is an SMB phone peer — both are landscape awards only.",
    pricingNotes:
      "Talkdesk $85–$225 CX Cloud. Twilio usage meters + Flex from $150 named / $1 hour. Research 2026-08-17 — no invented CPaaS seat dollars.",
    bestFor: [
      {
        productSlug: "talkdesk",
        scenarios: [
          "Mid-market CX teams buying turnkey cloud contact center seats",
          "Buyers who want Studio routing without building on APIs",
        ],
      },
      {
        productSlug: "twilio",
        scenarios: [
          "Engineering teams embedding SMS/voice into products",
          "Organisations building a custom contact centre on Flex",
        ],
      },
    ],
  }),
  // Project Management Wave-1 comparisons (2026-08-17).
  // Work-OS peers and specialist/adjacent pairs — never force PDF/remote/desktop
  // tools into undifferentiated work-OS ranks.
  approvedPmPair({
    a: "hive",
    b: "monday",
    title: "monday.com vs Hive",
    labels: { a: "Hive", b: "monday.com" },
    editorial: {
      a: { integrations: 7, "ai-features": 7, reporting: 7 },
      b: { integrations: 9, "ai-features": 8, reporting: 8 },
    },
    factual: {
      startingPricing:
        "monday.com Basic $9/seat/mo annual (3-seat minimum) plus AI credit bundles; Hive Starter $5/user/mo annual (≤10) or Teams $12 unlimited. Hive undercuts monday’s paid floor for small teams.",
      seatMinimum:
        "monday.com paid plans enforce a 3-seat minimum; Free is ≤2 seats. Hive Free/Starter allow up to 10 members before Teams unlimited — friendlier for micro teams.",
      freePlan:
        "Both publish free plans. monday.com Free: ≤2 seats, ≤3 boards. Hive Free: ≤10 members with storage/AI credit caps.",
      timelineGantt:
        "Both support timeline/Gantt-style planning on work-management plans. monday.com markets timeline + workload views heavily; Hive covers Gantt/timeline inside projects.",
      automations:
        "Both ship native automations/workflows. monday.com is the broader published Work OS automation narrative; Hive pairs automations with optional ~$5 add-ons.",
    },
    factualLeads: {
      startingPricing: "a",
      seatMinimum: "a",
      freePlan: "a",
      timelineGantt: "tie",
      automations: "b",
    },
    verdict:
      "No universal winner. Choose monday.com when mainstream Work OS breadth, ecosystem depth and brand default matter (overall 8.6); choose Hive when a lower paid entry and generous Free (≤10) matter more (overall 7.6). Both are work-OS peers — not timeline specialists or adjacent PDF/remote tools.",
    pricingNotes:
      "monday.com Basic/Standard/Pro $9/$12/$19 per seat/mo annual (3-seat min) + AI credits. Hive Free; Starter $5; Teams $12 annual. Research 2026-08-17 — confirm live AI/add-on packaging.",
    bestFor: [
      {
        productSlug: "monday",
        scenarios: [
          "Teams standardising on a mainstream Work OS",
          "Buyers who need deep integrations and timeline/workload views",
        ],
      },
      {
        productSlug: "hive",
        scenarios: [
          "SMB teams starting Free (≤10) before Teams",
          "Buyers comparing monday who want a lower paid floor",
        ],
      },
    ],
  }),
  approvedPmPair({
    a: "monday",
    b: "office-timeline",
    title: "monday.com vs Office Timeline",
    labels: { a: "monday.com", b: "Office Timeline" },
    editorial: {
      a: { integrations: 9, "ai-features": 8, reporting: 8 },
      b: { integrations: 6, "ai-features": 3, reporting: 8 },
    },
    factual: {
      startingPricing:
        "monday.com Basic $9/seat/mo annual (3-seat min). Office Timeline Lite $9/user/mo annual after a Free PowerPoint add-in — similar seat floors, different jobs.",
      seatMinimum:
        "monday.com paid: 3-seat minimum. Office Timeline: per-author presentation seats without a work-OS seat floor.",
      freePlan:
        "monday.com Free (≤2 seats, ≤3 boards). Office Timeline Free PowerPoint add-in for basic timelines.",
      timelineGantt:
        "Office Timeline leads as a PowerPoint-native executive Gantt/timeline specialist. monday.com offers live Work OS timeline views tied to boards — different delivery surface.",
      automations:
        "monday.com has native work automations; Office Timeline is not an automation platform (presentation tool).",
    },
    factualLeads: {
      startingPricing: "depends",
      seatMinimum: "b",
      freePlan: "tie",
      timelineGantt: "b",
      automations: "a",
    },
    verdict:
      "Different jobs. Choose monday.com for live Work OS execution (overall 8.6); choose Office Timeline (Lucen) for PowerPoint-native executive timelines (overall 6.5 specialist). Do not rank Office Timeline as a work-OS peer on undifferentiated best lists.",
    pricingNotes:
      "monday.com $9+ annual seats (3-min). Office Timeline Lite/Plus/Expert $9/$17/$21 annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "monday",
        scenarios: [
          "Cross-functional teams running work on boards + automations",
          "Buyers needing integrations and AI-assisted work updates",
        ],
      },
      {
        productSlug: "office-timeline",
        scenarios: [
          "PMO authors building executive PowerPoint Gantt decks",
          "Teams already living in Microsoft Office for stakeholder reporting",
        ],
      },
    ],
  }),
  approvedPmPair({
    a: "hive",
    b: "office-timeline",
    title: "Hive vs Office Timeline",
    labels: { a: "Hive", b: "Office Timeline" },
    editorial: {
      a: { integrations: 7, "ai-features": 7, reporting: 7 },
      b: { integrations: 6, "ai-features": 3, reporting: 8 },
    },
    factual: {
      startingPricing:
        "Hive Starter $5/user/mo annual (≤10) or Teams $12. Office Timeline Lite $9/user/mo annual after Free add-in.",
      seatMinimum:
        "Hive Free/Starter cap at 10 members; Teams unlimited. Office Timeline is per-author presentation licensing.",
      freePlan:
        "Both publish free entry — Hive Free ≤10 members; Office Timeline Free PowerPoint add-in.",
      timelineGantt:
        "Office Timeline wins for polished PowerPoint Gantt presentation. Hive wins for live project Gantt tied to tasks, chat and proofs.",
      automations:
        "Hive supports project automations; Office Timeline does not — specialist presentation tool.",
    },
    factualLeads: {
      startingPricing: "a",
      seatMinimum: "depends",
      freePlan: "tie",
      timelineGantt: "b",
      automations: "a",
    },
    verdict:
      "Different jobs. Choose Hive for work management with chat/proofs (overall 7.6); choose Office Timeline for PowerPoint timeline decks (overall 6.5). Landscape specialist vs work-OS peer — not interchangeable.",
    pricingNotes:
      "Hive Free / $5 Starter / $12 Teams annual. Office Timeline Lite $9 annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "hive",
        scenarios: [
          "Teams needing projects + messaging + proofs",
          "SMB buyers starting on Free before Teams",
        ],
      },
      {
        productSlug: "office-timeline",
        scenarios: [
          "Executive timeline presentation in PowerPoint",
          "PMO reporting without adopting a full work OS",
        ],
      },
    ],
  }),
  approvedPmPair({
    a: "foxit",
    b: "getscreen-me",
    title: "Foxit vs Getscreen.me",
    labels: { a: "Foxit", b: "Getscreen.me" },
    editorial: {
      a: { integrations: 7, "ai-features": 6, reporting: 4 },
      b: { integrations: 6, "ai-features": 2, reporting: 3 },
    },
    factual: {
      startingPricing:
        "Foxit PDF Editor ~$129.99/user/year (~$10.83/mo). Getscreen.me Standard $5/user + $0.10/device. Different specialist jobs — document vs remote access.",
      seatMinimum:
        "Foxit: annual per-licence Editor seats (Reader free). Getscreen.me: Free 1 user/≤2 devices; business plans scale users + devices.",
      freePlan:
        "Foxit Free Reader. Getscreen.me Free (1 user, ≤2 devices).",
      timelineGantt:
        "Neither is a timeline/Gantt product — both are adjacent productivity tools scored low on work-planning by design.",
      automations:
        "Neither is a work OS automation platform. Foxit may offer limited document batch helpers; Getscreen focuses on remote sessions.",
    },
    verdict:
      "Adjacent-to-adjacent comparison only. Choose Foxit for PDF edit/sign productivity (overall 5.4); choose Getscreen.me for remote desktop/screen share (overall 5.1). Never rank either against monday/Hive as work-OS peers.",
    pricingNotes:
      "Foxit Editor ~$129.99/user/year; Editor+ ~$159.99/user/year. Getscreen Standard/Advanced/Enterprise $5/$8/$10 user + device fees. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "foxit",
        scenarios: [
          "PDF edit/convert/sign as adjacent productivity",
          "Adobe Acrobat alternative on annual licences",
        ],
      },
      {
        productSlug: "getscreen-me",
        scenarios: [
          "Support/IT remote access with published user+device rates",
          "Light Free remote desktop before business plans",
        ],
      },
    ],
  }),
  approvedPmPair({
    a: "getscreen-me",
    b: "webcatalog",
    title: "Getscreen.me vs WebCatalog",
    labels: { a: "Getscreen.me", b: "WebCatalog" },
    editorial: {
      a: { integrations: 6, "ai-features": 2, reporting: 3 },
      b: { integrations: 6, "ai-features": 2, reporting: 3 },
    },
    factual: {
      startingPricing:
        "Getscreen.me Standard $5/user + device fees. WebCatalog Pro $5/user/mo annual (Basic Free 2 apps). Similar floors, unrelated jobs.",
      seatMinimum:
        "Getscreen Free: 1 user. WebCatalog Basic Free: 2 apps (not seat-capped the same way). Both scale per user on paid plans.",
      freePlan:
        "Both publish free rungs — Getscreen (1 user/2 devices); WebCatalog Basic (2 apps).",
      timelineGantt:
        "Neither provides timeline/Gantt — adjacent productivity only.",
      automations:
        "Neither is a work-automation platform.",
    },
    verdict:
      "Adjacent pair — different specialist jobs. Choose Getscreen.me for remote access (overall 5.1); choose WebCatalog for desktop web-app workspaces (overall 4.9). Keep both off undifferentiated work-OS ranks.",
    pricingNotes:
      "Getscreen $5/$8/$10 user + device fees. WebCatalog Pro $5 / Business $8 annual. Research 2026-08-17.",
    bestFor: [
      {
        productSlug: "getscreen-me",
        scenarios: [
          "Remote support and unattended desktop access",
          "Hybrid user+device fleets",
        ],
      },
      {
        productSlug: "webcatalog",
        scenarios: [
          "Turning SaaS web apps into desktop apps",
          "Focus workspaces without browser-tab sprawl",
        ],
      },
    ],
  }),
  // Project Management Priority-1 + Priority-2 comparisons (2026-08-17).
  approvedPmPair({
    a: "asana",
    b: "monday",
    title: "Asana vs monday.com",
    labels: {"a":"Asana","b":"monday.com"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":9,"ai-features":8,"reporting":8}},
    factual: {
          "startingPricing": "Asana Starter $10.99/user/mo annual; monday.com Basic $9/seat/mo annual with a 3-seat minimum plus AI credit bundles.",
          "seatMinimum": "monday.com paid plans enforce a 3-seat minimum. Asana Starter is per-user without the same published 3-seat floor.",
          "freePlan": "Both publish free rungs — Asana limited Free; monday.com Free ≤2 seats / ≤3 boards.",
          "timelineGantt": "Both support timeline/workload-style planning on paid work-management plans.",
          "automations": "Both ship native rules/automations; monday.com markets a broader Work OS automation narrative; Asana deepens on Advanced."
    },
    verdict: "Work-OS peers. Choose monday.com for mainstream Work OS breadth and ecosystem (8.6); choose Asana for cross-functional adoption ease and goals-driven workflows (8.3).",
    pricingNotes: "Asana Starter/Advanced $10.99/$24.99 annual. monday.com Basic/Standard/Pro $9/$12/$19 annual (3-seat min) + AI credits. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "asana",
                "scenarios": [
                      "Cross-functional marketing/ops adoption",
                      "Goals + workflow clarity"
                ]
          },
          {
                "productSlug": "monday",
                "scenarios": [
                      "Mainstream Work OS default",
                      "Deepest ecosystem/automation breadth"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "asana",
    b: "clickup",
    title: "Asana vs ClickUp",
    labels: {"a":"Asana","b":"ClickUp"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":8,"ai-features":8,"reporting":8}},
    factual: {
          "startingPricing": "Asana Starter $10.99/user/mo annual; ClickUp Unlimited $7/user/mo annual — ClickUp undercuts Asana’s paid floor.",
          "seatMinimum": "Neither publishes a monday-style 3-seat paid minimum on entry tiers.",
          "freePlan": "ClickUp Free allows unlimited members with caps; Asana Free is more limited on seats/features.",
          "timelineGantt": "Both support multiple planning views on paid plans; ClickUp’s view surface is broader by default.",
          "automations": "Both automate work; ClickUp leans harder into all-in-one automation + Brain; Asana emphasises clearer workflow adoption."
    },
    verdict: "Work-OS peers at the same overall (8.3). Choose Asana for easier cross-functional adoption; choose ClickUp for configurability and lower Unlimited seat economics.",
    pricingNotes: "Asana $10.99/$24.99 annual. ClickUp Unlimited/Business $7/$12 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "asana",
                "scenarios": [
                      "Teams that prioritise adoption ease",
                      "Goals-driven marketing/ops"
                ]
          },
          {
                "productSlug": "clickup",
                "scenarios": [
                      "Consolidating tools into one Work OS",
                      "Budget-conscious Unlimited seats"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "clickup",
    b: "monday",
    title: "ClickUp vs monday.com",
    labels: {"a":"ClickUp","b":"monday.com"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":9,"ai-features":8,"reporting":8}},
    factual: {
          "startingPricing": "ClickUp Unlimited $7/user/mo annual; monday.com Basic $9/seat/mo annual with 3-seat minimum + AI credits.",
          "seatMinimum": "monday.com paid: 3-seat minimum. ClickUp Unlimited has no equivalent published 3-seat floor.",
          "freePlan": "ClickUp Free (unlimited members, capped). monday.com Free ≤2 seats / ≤3 boards.",
          "timelineGantt": "Both offer multi-view planning including timeline/Gantt-style surfaces on paid plans.",
          "automations": "Both are automation-forward Work OS products; monday.com leads ecosystem narrative; ClickUp leads published entry value."
    },
    factualLeads: {
      startingPricing: "a",
      seatMinimum: "a",
      freePlan: "a",
      timelineGantt: "tie",
      automations: "depends",
    },
    verdict: "Work-OS peers. Choose monday.com for mainstream ecosystem depth (8.6); choose ClickUp for all-in-one configurability and $7 Unlimited value (8.3).",
    pricingNotes: "ClickUp $7/$12 annual. monday.com $9+ annual (3-seat min) + AI credits. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "clickup",
                "scenarios": [
                      "Lowest Work OS seat floor",
                      "Docs + tasks consolidation"
                ]
          },
          {
                "productSlug": "monday",
                "scenarios": [
                      "Mainstream Work OS brand/ecosystem",
                      "Teams accepting seat minimums"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "asana",
    b: "wrike",
    title: "Asana vs Wrike",
    labels: {"a":"Asana","b":"Wrike"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":8,"ai-features":7,"reporting":9}},
    factual: {
          "startingPricing": "Asana Starter $10.99/user/mo annual; Wrike Team $10/user/mo annual — similar entry; Wrike Business jumps to $25.",
          "seatMinimum": "Both per-user; Wrike Team often suits smaller collaborative teams before Business governance.",
          "freePlan": "Both publish free rungs with limits.",
          "timelineGantt": "Both support project timelines/Gantt; Wrike emphasises agency delivery structure.",
          "automations": "Asana rules vs Wrike custom workflows/intake — Wrike stronger for proofing/intake on Business+."
    },
    verdict: "Work-OS peers. Choose Asana for cross-functional adoption (8.3); choose Wrike for agency proofing, intake and enterprise reporting (8.1).",
    pricingNotes: "Asana $10.99/$24.99. Wrike Team/Business $10/$25 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "asana",
                "scenarios": [
                      "Cross-functional ease",
                      "Goals-driven work"
                ]
          },
          {
                "productSlug": "wrike",
                "scenarios": [
                      "Agency proofing/intake",
                      "Enterprise delivery reporting"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "jira",
    b: "linear",
    title: "Jira vs Linear",
    labels: {"a":"Jira","b":"Linear"},
    editorial: {"a":{"integrations":9,"ai-features":6,"reporting":8},"b":{"integrations":8,"ai-features":7,"reporting":7}},
    factual: {
          "startingPricing": "Jira Cloud Standard ~$8.15/user/mo annual; Linear Basic ~$8/user/mo annual (medium confidence) — similar eng-tracker floors.",
          "seatMinimum": "Both Free tiers cap users/issues; paid seats scale per user.",
          "freePlan": "Jira Free ≤10 users; Linear Free with issue/member caps.",
          "timelineGantt": "Both plan software delivery (sprints/cycles/roadmaps) — not marketing Work OS timelines.",
          "automations": "Jira’s enterprise automation depth vs Linear’s leaner opinionated workflows."
    },
    verdict: "Engineering-tracker peers (landscape on Work OS lists). Choose Jira for enterprise Agile depth and Atlassian ecosystem (7.7); choose Linear for modern eng UX speed (7.9).",
    pricingNotes: "Jira Standard/Premium ~$8.15/$16 annual. Linear Basic/Business ~$8/$14 annual (medium). Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "jira",
                "scenarios": [
                      "Enterprise Agile + Atlassian stack",
                      "Complex workflows at scale"
                ]
          },
          {
                "productSlug": "linear",
                "scenarios": [
                      "Product/eng teams wanting modern UX",
                      "Startups replacing Jira complexity"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "asana",
    b: "notion",
    title: "Asana vs Notion",
    labels: {"a":"Asana","b":"Notion"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":7,"ai-features":8,"reporting":5}},
    factual: {
          "startingPricing": "Asana Starter $10.99/user/mo annual; Notion Plus $10/user/mo annual — similar floors, different jobs.",
          "seatMinimum": "Both per-user collaborative seats on paid plans.",
          "freePlan": "Both publish free rungs — Notion strong for personal docs; Asana Free more limited for teams.",
          "timelineGantt": "Asana leads as a Work OS planner; Notion offers light database boards, not dedicated portfolio PM.",
          "automations": "Asana rules are stronger for work execution; Notion automations are lighter."
    },
    verdict: "Different jobs. Choose Asana for Work OS execution (8.3); choose Notion for docs-first knowledge work with light tracking (7.0). Do not rank Notion as a Work OS peer.",
    pricingNotes: "Asana $10.99/$24.99. Notion Plus/Business $10/$20 annual (AI often on Business). Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "asana",
                "scenarios": [
                      "Cross-functional project execution",
                      "Goals and workflows"
                ]
          },
          {
                "productSlug": "notion",
                "scenarios": [
                      "Wikis/specs + light boards",
                      "Notion AI writing/search"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "clickup",
    b: "notion",
    title: "ClickUp vs Notion",
    labels: {"a":"ClickUp","b":"Notion"},
    editorial: {"a":{"integrations":8,"ai-features":8,"reporting":8},"b":{"integrations":7,"ai-features":8,"reporting":5}},
    factual: {
          "startingPricing": "ClickUp Unlimited $7/user/mo annual; Notion Plus $10/user/mo annual.",
          "seatMinimum": "Both scale per user; ClickUp Free allows unlimited members with caps.",
          "freePlan": "Both freemium — ClickUp Free is more team-oriented; Notion Free is personal/docs-led.",
          "timelineGantt": "ClickUp is the Work OS planner; Notion is docs/databases with light project views.",
          "automations": "ClickUp automations + Brain vs Notion’s lighter automation/AI docs focus."
    },
    verdict: "Different centres of gravity. Choose ClickUp for configurable Work OS execution (8.3); choose Notion for docs-first workspaces (7.0).",
    pricingNotes: "ClickUp $7/$12. Notion $10/$20 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "clickup",
                "scenarios": [
                      "All-in-one Work OS consolidation",
                      "Dashboards + automations"
                ]
          },
          {
                "productSlug": "notion",
                "scenarios": [
                      "Knowledge base + light tasks",
                      "Docs-first AI"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "wrike",
    b: "smartsheet",
    title: "Wrike vs Smartsheet",
    labels: {"a":"Wrike","b":"Smartsheet"},
    editorial: {"a":{"integrations":8,"ai-features":7,"reporting":9},"b":{"integrations":8,"ai-features":6,"reporting":9}},
    factual: {
          "startingPricing": "Wrike Team $10/user/mo annual; Smartsheet Pro $9/member/mo annual — similar entry floors.",
          "seatMinimum": "Smartsheet Pro often packaged for smaller member counts before Business; Wrike Free/Team for lighter starts.",
          "freePlan": "Wrike publishes Free; Smartsheet is trial/paid-led without a long-term Free plan in this research pass.",
          "timelineGantt": "Both strong on Gantt/timeline planning; Smartsheet is grid-native; Wrike is work-management-native with proofing.",
          "automations": "Both automate; Wrike emphasises intake/proofing workflows; Smartsheet emphasises sheet automations and portfolios."
    },
    verdict: "Related but different clusters. Choose Wrike as a Work OS peer for agency/enterprise delivery (8.1); choose Smartsheet for spreadsheet-style PMO grids (7.9 landscape on Work OS ranks).",
    pricingNotes: "Wrike $10/$25 annual. Smartsheet Pro/Business $9/$19 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "wrike",
                "scenarios": [
                      "Agency proofing/intake",
                      "Work OS delivery control"
                ]
          },
          {
                "productSlug": "smartsheet",
                "scenarios": [
                      "Excel-native PMO grids",
                      "Portfolio dashboards"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "motion",
    b: "asana",
    title: "Motion vs Asana",
    labels: {"a":"Motion","b":"Asana"},
    editorial: {"a":{"integrations":6,"ai-features":9,"reporting":5},"b":{"integrations":8,"ai-features":8,"reporting":8}},
    factual: {
          "startingPricing": "Motion Pro AI $19/seat/mo annual; Asana Starter $10.99/user/mo annual — Motion is a premium AI-scheduling seat.",
          "seatMinimum": "Both per-seat; Motion has no Free plan in this research pass.",
          "freePlan": "Asana Free exists; Motion is trial/paid (Pro AI / Business AI).",
          "timelineGantt": "Asana leads classic Work OS planning; Motion adds Gantt/capacity on Business AI while centering AI calendar.",
          "automations": "Motion’s wedge is AI auto-scheduling; Asana’s wedge is cross-functional work rules/workflows."
    },
    verdict: "Different jobs. Choose Motion when AI calendar auto-scheduling is primary (6.9 landscape); choose Asana for Work OS collaboration and goals (8.3 ranked).",
    pricingNotes: "Motion Pro/Business AI $19/$29 annual + credits. Asana $10.99/$24.99 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "motion",
                "scenarios": [
                      "AI auto-scheduling calendar + tasks",
                      "Individuals/small AI-first teams"
                ]
          },
          {
                "productSlug": "asana",
                "scenarios": [
                      "Cross-functional Work OS",
                      "Goals and workflow adoption"
                ]
          }
    ],
  }),

  // Project Management Batch-D comparisons (2026-08-17).
  approvedPmPair({
    a: "basecamp",
    b: "todoist",
    title: "Basecamp vs Todoist",
    labels: {"a":"Basecamp","b":"Todoist"},
    editorial: {"a":{"integrations":5,"ai-features":2,"reporting":5},"b":{"integrations":8,"ai-features":5,"reporting":4}},
    factual: {
          "startingPricing": "Basecamp Pro $15/user/mo or Pro Unlimited $299/mo flat; Todoist Pro ~$6.25/user/mo annual.",
          "seatMinimum": "Basecamp Pro bills employees/full users; clients/contractors free. Todoist is per-user on Pro/Business.",
          "freePlan": "Both Free — Basecamp 1 project; Todoist Beginner with personal project caps.",
          "timelineGantt": "Neither is a deep Gantt/PMO tool — lightweight hubs/task lists.",
          "automations": "Both light — Basecamp deliberately minimal; Todoist has light assists/recurring rules."
    },
    verdict: "Lightweight peers (landscape). Choose Basecamp for team project hubs with messaging (6.1); choose Todoist for personal/light team task capture (6.4).",
    pricingNotes: "Basecamp Free / Pro $15 / Unlimited $299. Todoist Free / Pro ~$6.25 / Business ~$10. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "basecamp",
                "scenarios": [
                      "Simple team project hubs",
                      "Pro Unlimited flat pricing"
                ]
          },
          {
                "productSlug": "todoist",
                "scenarios": [
                      "Personal productivity",
                      "Natural-language task capture"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "microsoft-project",
    b: "smartsheet",
    title: "Microsoft Project vs Smartsheet",
    labels: {"a":"Microsoft Project","b":"Smartsheet"},
    editorial: {"a":{"integrations":9,"ai-features":6,"reporting":8},"b":{"integrations":8,"ai-features":6,"reporting":9}},
    factual: {
          "startingPricing": "Microsoft Planner Plan 1 ~$10/user/mo; Smartsheet Pro $9/member/mo annual — similar entry, different ecosystems.",
          "seatMinimum": "Both per-user/member seats on published plans.",
          "freePlan": "Smartsheet is trial/paid-led; Microsoft may include limited Planner via M365 SKUs — confirm tenant entitlements.",
          "timelineGantt": "Both strong on Gantt/schedule planning for PMO-style buyers.",
          "automations": "Smartsheet sheet automations vs Microsoft Power Automate adjacency."
    },
    verdict: "Spreadsheet/PMO landscape peers. Choose Microsoft Project when M365 is the system of work (7.4); choose Smartsheet for grid-native cross-stack PMOs (7.9).",
    pricingNotes: "MS Planner/Project ~$10/$30/$55. Smartsheet Pro/Business $9/$19 annual. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "microsoft-project",
                "scenarios": [
                      "M365 standardised PMOs",
                      "Traditional resource scheduling"
                ]
          },
          {
                "productSlug": "smartsheet",
                "scenarios": [
                      "Spreadsheet-native portfolios",
                      "Cross-stack grid PM"
                ]
          }
    ],
  }),
  approvedPmPair({
    a: "basecamp",
    b: "trello",
    title: "Basecamp vs Trello",
    labels: {"a":"Basecamp","b":"Trello"},
    editorial: {"a":{"integrations":5,"ai-features":2,"reporting":5},"b":{"integrations":8,"ai-features":4,"reporting":4}},
    factual: {
          "startingPricing": "Basecamp Pro $15/user/mo or $299 Unlimited; Trello Standard $5/user/mo annual.",
          "seatMinimum": "Basecamp Pro bills full users; Trello per-user on paid plans.",
          "freePlan": "Both Free with limits — Basecamp 1 project; Trello limited boards.",
          "timelineGantt": "Trello Premium adds timeline views; Basecamp emphasises schedules/to-dos over Gantt.",
          "automations": "Trello Butler vs Basecamp’s intentionally light automation."
    },
    verdict: "Lightweight landscape peers. Choose Basecamp for message-board-centric project hubs (6.1); choose Trello for Kanban boards (6.6).",
    pricingNotes: "Basecamp Free/$15/$299. Trello Free/$5/$10. Research 2026-08-17.",
    bestFor: [
          {
                "productSlug": "basecamp",
                "scenarios": [
                      "Async team hubs with chat/docs",
                      "Flat Unlimited pricing"
                ]
          },
          {
                "productSlug": "trello",
                "scenarios": [
                      "Simple Kanban boards",
                      "Atlassian-adjacent lightweight entry"
                ]
          }
    ],
  }),

  approvedHrPair({
    a: "bamboohr",
    b: "rippling",
    title: "BambooHR vs Rippling",
    labels: { a: "BambooHR", b: "Rippling" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 3,
        "training-depth": 4,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 7,
        "core-hris": 9,
        "payroll-processing": 9,
        "scheduling-depth": 5,
        "training-depth": 4,
        "time-tracking-depth": 7,
        integrations: 9,
        mobile: 7,
      },
    },
    factual: {
      startingPricing:
        "BambooHR publishes Core from $10 PEPM (or $250/mo ≤25 employees). Rippling publishes $8 PEPM + $40/mo platform fee — modules stack quote-based PEPM. Neither floor is all-in HCM.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "BambooHR’s $10 PEPM is for >25 employees; smaller teams hit the $250 floor. Rippling is per-user plus a platform fee.",
    },
    verdict:
      "Choose BambooHR for a simpler core HRIS with published PEPM. Choose Rippling when you want HR + payroll + IT on one employee record and will model stacked module TCO.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing pages. Rippling all-in TCO is quote-led. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "bamboohr",
        scenarios: ["Clean SMB/mid core HRIS", "Published PEPM without IT modules"],
      },
      {
        productSlug: "rippling",
        scenarios: ["HR + payroll + IT unification", "Hire-to-device-to-pay workflows"],
      },
    ],
  }),
  approvedHrPair({
    a: "bamboohr",
    b: "gusto",
    title: "BambooHR vs Gusto",
    labels: { a: "BambooHR", b: "Gusto" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 3,
        "training-depth": 4,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 4,
        "core-hris": 5,
        "payroll-processing": 9,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 5,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "BambooHR Core from $10 PEPM (or $250/mo ≤25). Gusto Simple $49/mo + $6/person. Different jobs — HRIS vs payroll-first.",
      freePlan: "Neither publishes a free plan. Gusto setup is free until first payroll.",
      userMinimum:
        "BambooHR small-team floor is $250/mo. Gusto bills a platform fee plus per-person payroll.",
    },
    verdict:
      "Choose BambooHR when the employee system of record is the job. Choose Gusto when US SMB payroll and benefits with transparent month-to-month pricing is the job.",
    pricingNotes:
      "Gusto Simple is single-state. BambooHR payroll is an add-on. Confirm live packaging. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "bamboohr",
        scenarios: ["Core HRIS as system of record", "People admin before payroll"],
      },
      {
        productSlug: "gusto",
        scenarios: ["US SMB payroll first", "Published $49+$6 Simple pricing"],
      },
    ],
  }),
  approvedHrPair({
    a: "gusto",
    b: "rippling",
    title: "Gusto vs Rippling",
    labels: { a: "Gusto", b: "Rippling" },
    editorial: {
      a: {
        "hiring-workflow": 4,
        "core-hris": 5,
        "payroll-processing": 9,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 5,
        integrations: 7,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 7,
        "core-hris": 9,
        "payroll-processing": 9,
        "scheduling-depth": 5,
        "training-depth": 4,
        "time-tracking-depth": 7,
        integrations: 9,
        mobile: 7,
      },
    },
    factual: {
      startingPricing:
        "Gusto Simple $49 + $6/person is a true payroll floor. Rippling’s $8 PEPM + $40 base is platform-only; payroll is a stacked module.",
      freePlan: "Neither has a free plan. Gusto setup is free until first payroll.",
      userMinimum: "Both scale per person. Rippling adds a monthly platform fee.",
    },
    verdict:
      "Choose Gusto for simple US payroll with transparent published prices. Choose Rippling when you need payroll plus HR and IT on one employee record and will accept quote-stacked TCO.",
    pricingNotes:
      "Do not treat Rippling’s $8 floor as comparable all-in payroll. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "gusto",
        scenarios: ["Payroll-first SMB", "Month-to-month published pricing"],
      },
      {
        productSlug: "rippling",
        scenarios: ["Payroll plus IT provisioning", "Unified people platform"],
      },
    ],
  }),
  approvedHrPair({
    a: "greenhouse",
    b: "workable",
    title: "Greenhouse vs Workable",
    labels: { a: "Greenhouse", b: "Workable" },
    editorial: {
      a: {
        "hiring-workflow": 10,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 2,
        integrations: 9,
        mobile: 5,
      },
      b: {
        "hiring-workflow": 8,
        "core-hris": 5,
        "payroll-processing": 3,
        "scheduling-depth": 2,
        "training-depth": 3,
        "time-tracking-depth": 4,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Greenhouse is custom quote (Core/Plus/Pro, no published seat $). Workable Standard is $299/mo annual for 1–20 employees.",
      freePlan: "Neither has a free plan. Workable offers a 15-day Standard trial; Greenhouse is demo-led.",
      userMinimum:
        "Workable prices by company headcount bands. Greenhouse quotes by plan, hiring volume, and complexity.",
    },
    verdict:
      "Choose Greenhouse for structured hiring (kits, scorecards, governance) at mid-market/enterprise. Choose Workable for a dedicated ATS with published SMB floors and a trial.",
    pricingNotes:
      "Workable $299 is the 1–20 employee band; larger companies pay more. Greenhouse dollars are unpublished. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "greenhouse",
        scenarios: ["Structured hiring kits/scorecards", "Enterprise/mid TA teams"],
      },
      {
        productSlug: "workable",
        scenarios: ["Published ATS floors + 15-day trial", "SMB recruiting with light HR"],
      },
    ],
  }),
  approvedHrPair({
    a: "breezy-hr",
    b: "greenhouse",
    title: "Breezy HR vs Greenhouse",
    labels: { a: "Breezy HR", b: "Greenhouse" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 10,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 2,
        integrations: 9,
        mobile: 5,
      },
    },
    factual: {
      startingPricing:
        "Breezy publishes free Bootstrap plus Startup from $157/mo annual. Greenhouse is custom quote with no published seat dollars.",
      freePlan: "Breezy has a free Bootstrap plan (1 active pool). Greenhouse has no free plan.",
      userMinimum:
        "Breezy paid plans are pool/position packaged. Greenhouse quotes by hiring volume and complexity.",
    },
    verdict:
      "Choose Breezy HR for transparent SMB ATS pricing and a usable free tier. Choose Greenhouse when structured hiring process (kits, scorecards, governance) is worth a custom quote.",
    pricingNotes:
      "Breezy add-ons (Intelligence, SMS, Onboard) raise TCO. Greenhouse implementation is commonly extra. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["Free Bootstrap ATS", "Transparent mid-market pool pricing"],
      },
      {
        productSlug: "greenhouse",
        scenarios: ["Structured hiring at scale", "Scorecards and interview kits"],
      },
    ],
  }),
  approvedHrPair({
    a: "breezy-hr",
    b: "workable",
    title: "Breezy HR vs Workable",
    labels: { a: "Breezy HR", b: "Workable" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 8,
        "core-hris": 5,
        "payroll-processing": 3,
        "scheduling-depth": 2,
        "training-depth": 3,
        "time-tracking-depth": 4,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Breezy Bootstrap is free; paid Startup $157/mo annual. Workable Standard $299/mo annual (1–20 employees).",
      freePlan: "Breezy has free Bootstrap (1 active pool). Workable has a 15-day trial, no free plan.",
      userMinimum:
        "Breezy gates on active pools. Workable gates on company headcount bands.",
    },
    verdict:
      "Choose Breezy HR if a free ATS tier or lower published floors matter. Choose Workable if you want a 15-day full Standard trial and optional HRIS-lite alongside recruiting.",
    pricingNotes:
      "Workable Standard add-ons (texting/video/assessments) can close the list-price gap. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["Start on a free ATS", "Lower published paid floors"],
      },
      {
        productSlug: "workable",
        scenarios: ["15-day Standard trial", "ATS plus light HR features"],
      },
    ],
  }),

  approvedHrPair({
    a: "breezy-hr",
    b: "connecteam",
    title: "Breezy HR vs Connecteam",
    labels: { a: "Breezy HR", b: "Connecteam" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 2,
        "scheduling-depth": 9,
        "training-depth": 6,
        "time-tracking-depth": 8,
        integrations: 8,
        mobile: 10,
      },
    },
    factual: {
      startingPricing:
        "Breezy publishes free Bootstrap plus Startup from $157/mo annual (pool packaging). Connecteam is free ≤10 users; paid hubs from $29/mo annual for the first 30 users — Ops / Comms / HR & Skills stack separately.",
      freePlan:
        "Both publish a free tier. Breezy Bootstrap is one active hiring pool. Connecteam Free is capped at 10 users.",
      userMinimum:
        "Breezy paid plans gate on active pools/positions, not a seat floor. Connecteam paid hubs quote the first 30 users then scale.",
    },
    verdict:
      "These are different jobs. Choose Breezy HR when recruiting pipelines and a career site are the purchase. Choose Connecteam when frontline scheduling, mobile comms, and deskless ops hubs are the purchase — do not treat an ATS as a WFM suite.",
    pricingNotes:
      "Compare like-for-like configurations: Breezy pools/add-ons vs Connecteam multi-hub TCO. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["Dedicated ATS / hiring pipelines", "Free Bootstrap recruiting tier"],
      },
      {
        productSlug: "connecteam",
        scenarios: ["Frontline shift scheduling", "Deskless mobile comms + time hubs"],
      },
    ],
  }),
  approvedHrPair({
    a: "breezy-hr",
    b: "jibble",
    title: "Breezy HR vs Jibble",
    labels: { a: "Breezy HR", b: "Jibble" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 2,
        "scheduling-depth": 4,
        "training-depth": 1,
        "time-tracking-depth": 9,
        integrations: 7,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Breezy Bootstrap is free; paid Startup $157/mo annual. Jibble is free forever for unlimited users; paid Premium ~$4.49 and Ultimate ~$7.99/user/mo annual.",
      freePlan:
        "Both have a free plan. Breezy limits active pools. Jibble’s free forever plan is unlimited users with feature gates on Premium/Ultimate.",
      userMinimum:
        "Breezy packages by pools. Jibble bills per user on paid plans with no published seat minimum on Free.",
    },
    verdict:
      "Choose Breezy HR for applicant tracking. Choose Jibble for GPS/face time & attendance. An ATS and a time clock are not peers — shortlist by the job that is blocking work.",
    pricingNotes:
      "Jibble paid dollars are medium-confidence list rates; confirm current Premium/Ultimate gates. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["Hiring pipelines and career sites", "Collaborative recruiting"],
      },
      {
        productSlug: "jibble",
        scenarios: ["GPS / face clock-in", "Free unlimited-user timesheets"],
      },
    ],
  }),
  approvedHrPair({
    a: "breezy-hr",
    b: "trainual",
    title: "Breezy HR vs Trainual",
    labels: { a: "Breezy HR", b: "Trainual" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 2,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 9,
        "time-tracking-depth": 1,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Breezy publishes free Bootstrap and paid pool plans from $157/mo annual. Trainual is demo/quote (Core/Pro/Premium/Enterprise) with a published $1,000 implementation fee.",
      freePlan: "Breezy has free Bootstrap. Trainual does not publish a free plan.",
      userMinimum:
        "Breezy gates on pools. Trainual is positioned for roughly 25–1000 employees on quote packaging.",
    },
    verdict:
      "Choose Breezy HR when hiring is the job. Choose Trainual when SOP playbooks and role training paths are the job. Do not stretch recruiting software into process documentation.",
    pricingNotes:
      "Trainual TCO is quote-led plus implementation. Breezy add-ons (Intelligence, SMS, Onboard) are extra. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["ATS with published floors", "Interview workflow ownership"],
      },
      {
        productSlug: "trainual",
        scenarios: ["SOP knowledge base", "Assigned role training paths"],
      },
    ],
  }),
  approvedHrPair({
    a: "connecteam",
    b: "jibble",
    title: "Connecteam vs Jibble",
    labels: { a: "Connecteam", b: "Jibble" },
    editorial: {
      a: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 2,
        "scheduling-depth": 9,
        "training-depth": 6,
        "time-tracking-depth": 8,
        integrations: 8,
        mobile: 10,
      },
      b: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 2,
        "scheduling-depth": 4,
        "training-depth": 1,
        "time-tracking-depth": 9,
        integrations: 7,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Connecteam Free ≤10 users; paid hubs from $29/mo annual (first 30 users). Jibble Free forever unlimited users; Premium ~$4.49 and Ultimate ~$7.99/user/mo annual.",
      freePlan:
        "Both free. Connecteam caps users at 10. Jibble does not cap users on Free but gates GPS/face policies on paid tiers.",
      userMinimum:
        "Connecteam paid packaging is hub × first-30-users then scale. Jibble paid is per user with no published minimum beyond Free.",
    },
    verdict:
      "Choose Connecteam when shift scheduling and frontline comms are in the same purchase as time. Choose Jibble when accurate GPS/face attendance is the job and you do not need a full WFM suite.",
    pricingNotes:
      "Model Connecteam multi-hub TCO before comparing to Jibble’s per-user paid rungs. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "connecteam",
        scenarios: ["Scheduling + mobile ops hubs", "Deskless teams above 10 users"],
      },
      {
        productSlug: "jibble",
        scenarios: ["Time clock first", "Free unlimited-user attendance"],
      },
    ],
  }),
  approvedHrPair({
    a: "connecteam",
    b: "trainual",
    title: "Connecteam vs Trainual",
    labels: { a: "Connecteam", b: "Trainual" },
    editorial: {
      a: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 2,
        "scheduling-depth": 9,
        "training-depth": 6,
        "time-tracking-depth": 8,
        integrations: 8,
        mobile: 10,
      },
      b: {
        "hiring-workflow": 2,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 9,
        "time-tracking-depth": 1,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Connecteam Free ≤10; paid hubs from $29/mo annual for first 30. Trainual is contact/demo with a $1,000 implementation fee.",
      freePlan: "Connecteam has a 10-user free plan. Trainual does not publish a free plan.",
      userMinimum:
        "Connecteam scales after the first 30 paid users. Trainual quote packaging is aimed at ~25–1000 employees.",
    },
    verdict:
      "Choose Connecteam for frontline scheduling and comms, including lighter training hubs. Choose Trainual when searchable SOPs and role-path completion evidence are the core job — not shift ops.",
    pricingNotes:
      "Do not compare Connecteam’s $29 hub tile to Trainual’s unpublished quote. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "connecteam",
        scenarios: ["Frontline WFM + comms", "Training-lite on an ops hub"],
      },
      {
        productSlug: "trainual",
        scenarios: ["SOP playbooks as the system of record", "Role-based onboarding paths"],
      },
    ],
  }),
  approvedHrPair({
    a: "jibble",
    b: "trainual",
    title: "Jibble vs Trainual",
    labels: { a: "Jibble", b: "Trainual" },
    editorial: {
      a: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 2,
        "scheduling-depth": 4,
        "training-depth": 1,
        "time-tracking-depth": 9,
        integrations: 7,
        mobile: 9,
      },
      b: {
        "hiring-workflow": 2,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 9,
        "time-tracking-depth": 1,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Jibble Free forever; paid from ~$4.49/user/mo annual. Trainual is demo/quote plus a $1,000 implementation fee.",
      freePlan: "Jibble has a free forever plan. Trainual does not.",
      userMinimum:
        "Jibble paid is per user. Trainual is quote-led for growing companies (~25–1000 employees).",
    },
    verdict:
      "Choose Jibble for time & attendance. Choose Trainual for SOP documentation and employee training paths. These products do not replace each other.",
    pricingNotes:
      "Jibble list rungs are not comparable to Trainual quote + implementation. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "jibble",
        scenarios: ["GPS / face attendance", "Timesheets into payroll"],
      },
      {
        productSlug: "trainual",
        scenarios: ["Documented playbooks", "Completion evidence for roles"],
      },
    ],
  }),
  approvedHrPair({
    a: "breezy-hr",
    b: "bamboohr",
    title: "Breezy HR vs BambooHR",
    labels: { a: "Breezy HR", b: "BambooHR" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 3,
        "training-depth": 4,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Breezy Bootstrap is free; paid Startup $157/mo annual. BambooHR Core from $10 PEPM (or $250/mo floor ≤25 employees).",
      freePlan: "Breezy has free Bootstrap. BambooHR does not publish a free plan.",
      userMinimum:
        "Breezy gates on hiring pools. BambooHR’s $10 PEPM applies above 25 employees; smaller teams hit the $250 floor.",
    },
    verdict:
      "Choose Breezy HR for a dedicated ATS with published pool pricing. Choose BambooHR when the employee system of record (core HRIS) is the job and hiring is a module, not the whole product.",
    pricingNotes:
      "BambooHR payroll is an add-on. Breezy Onboard/Perform add-ons are not an HRIS. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "breezy-hr",
        scenarios: ["Recruiting-first ATS", "Transparent free + paid pool plans"],
      },
      {
        productSlug: "bamboohr",
        scenarios: ["Core HRIS as system of record", "People admin before a specialist ATS"],
      },
    ],
  }),
  approvedHrPair({
    a: "learnworlds",
    b: "trainual",
    title: "LearnWorlds vs Trainual",
    labels: { a: "LearnWorlds", b: "Trainual" },
    editorial: {
      a: {
        "hiring-workflow": 1,
        "core-hris": 1,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 8,
        "time-tracking-depth": 1,
        integrations: 7,
        mobile: 5,
      },
      b: {
        "hiring-workflow": 2,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 9,
        "time-tracking-depth": 1,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "LearnWorlds Starter publishes from $24/mo annual plus enrollment fees (marketing-primary LMS). Trainual is demo/quote with a $1,000 implementation fee.",
      freePlan: "Neither is a free-forever internal SOP tool. Confirm current LearnWorlds trial terms on the vendor site.",
      userMinimum:
        "LearnWorlds packages around course commerce and learner caps. Trainual quote packaging is aimed at ~25–1000 employees.",
    },
    verdict:
      "Choose Trainual for internal SOP playbooks and role paths. Choose LearnWorlds when course commerce / academy selling is the job (it remains marketing-primary on SoftwareGlimpse). Do not treat a public LMS as an internal knowledge base by default.",
    pricingNotes:
      "LearnWorlds enrollment fees are not comparable to Trainual implementation + seat quotes. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "learnworlds",
        scenarios: ["Course commerce / customer academy", "Paid enrollment LMS"],
      },
      {
        productSlug: "trainual",
        scenarios: ["Internal SOPs and role training", "Completion evidence for employees"],
      },
    ],
  }),

  approvedHrPair({
    a: "connecteam",
    b: "homebase",
    title: "Connecteam vs Homebase",
    labels: { a: "Connecteam", b: "Homebase" },
    editorial: {
      a: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 2,
        "scheduling-depth": 9,
        "training-depth": 6,
        "time-tracking-depth": 8,
        integrations: 8,
        mobile: 10,
      },
      b: {
        "hiring-workflow": 5,
        "core-hris": 3,
        "payroll-processing": 4,
        "scheduling-depth": 9,
        "training-depth": 3,
        "time-tracking-depth": 8,
        integrations: 7,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Connecteam paid hubs start from $29/mo per hub (annual). Homebase paid locations start from $24/mo annual (Essentials). Both have a free ≤10-employee/user starter.",
      freePlan:
        "Both publish a free starter: Connecteam ≤10 users; Homebase Basic is 1 location and ≤10 employees.",
      userMinimum:
        "Connecteam TCO stacks by hub. Homebase TCO stacks by location. Neither is per-user WFM at the paid floor.",
    },
    verdict:
      "Choose Connecteam for deskless hubs (scheduling + comms + training). Choose Homebase when SMB hourly scheduling, time clocks, and light hiring priced per location is the job.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. Multi-hub vs multi-location TCO is the real comparison — not the headline floor. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "connecteam",
        scenarios: ["Deskless comms + scheduling hubs", "Ops training alongside shifts"],
      },
      {
        productSlug: "homebase",
        scenarios: ["SMB hourly scheduling + time per location", "Light hiring in the same app"],
      },
    ],
  }),

  approvedHrPair({
    a: "homebase",
    b: "when-i-work",
    title: "Homebase vs When I Work",
    labels: { a: "Homebase", b: "When I Work" },
    editorial: {
      a: {
        "hiring-workflow": 5,
        "core-hris": 3,
        "payroll-processing": 4,
        "scheduling-depth": 9,
        "training-depth": 3,
        "time-tracking-depth": 8,
        integrations: 7,
        mobile: 9,
      },
      b: {
        "hiring-workflow": 2,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 9,
        "training-depth": 2,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Homebase paid Essentials from $24/location/mo annual. When I Work Essentials is $2.50/user/mo for scheduling; time & attendance is a paid toggle not printed on the live price card.",
      freePlan:
        "Homebase publishes Basic free (1 location, ≤10 employees). When I Work has a 14-day trial and no free forever plan.",
      userMinimum:
        "Homebase paid tiers are unlimited employees per location. When I Work bills every scheduling user.",
    },
    verdict:
      "Choose Homebase for a free tiny-team starter plus time clocks in the same location-priced app. Choose When I Work when cheap per-user scheduling is the job and clocks can wait.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. When I Work T&A dollars are not on the pricing card. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "homebase",
        scenarios: ["Free ≤10-employee hourly starter", "Scheduling + time in one SMB app"],
      },
      {
        productSlug: "when-i-work",
        scenarios: ["Low per-user scheduling", "OpenShifts without buying clocks yet"],
      },
    ],
  }),

  approvedHrPair({
    a: "connecteam",
    b: "deputy",
    title: "Connecteam vs Deputy",
    labels: { a: "Connecteam", b: "Deputy" },
    editorial: {
      a: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 2,
        "scheduling-depth": 9,
        "training-depth": 6,
        "time-tracking-depth": 8,
        integrations: 8,
        mobile: 10,
      },
      b: {
        "hiring-workflow": 3,
        "core-hris": 4,
        "payroll-processing": 4,
        "scheduling-depth": 9,
        "training-depth": 3,
        "time-tracking-depth": 9,
        integrations: 8,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Connecteam paid hubs from $29/mo. Deputy Lite is $5/user/mo with a $30 invoice minimum; Core $6.50 / Pro $9. Deputy add-ons (HR, messaging, analytics, US payroll) stack.",
      freePlan:
        "Connecteam publishes a ≤10-user free plan. Deputy has up to a 31-day trial and no free forever plan.",
      userMinimum:
        "Deputy bills every user including managers. Connecteam TCO is hub-based, then per-user above 30.",
    },
    verdict:
      "Choose Connecteam for deskless comms hubs with a free starter. Choose Deputy for multi-location shift-work timekeeping, labor compliance, and WFM AI when you will pay per user.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. Deputy manager billing and add-ons often exceed the $5 headline. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "connecteam",
        scenarios: ["Deskless comms + scheduling", "Free ≤10-user WFM start"],
      },
      {
        productSlug: "deputy",
        scenarios: ["Multi-location compliance WFM", "Timekeeping + auto-scheduling"],
      },
    ],
  }),

  approvedHrPair({
    a: "homebase",
    b: "7shifts",
    title: "Homebase vs 7shifts",
    labels: { a: "Homebase", b: "7shifts" },
    editorial: {
      a: {
        "hiring-workflow": 5,
        "core-hris": 3,
        "payroll-processing": 4,
        "scheduling-depth": 9,
        "training-depth": 3,
        "time-tracking-depth": 8,
        integrations: 7,
        mobile: 9,
      },
      b: {
        "hiring-workflow": 3,
        "core-hris": 2,
        "payroll-processing": 5,
        "scheduling-depth": 9,
        "training-depth": 2,
        "time-tracking-depth": 8,
        integrations: 9,
        mobile: 9,
      },
    },
    factual: {
      startingPricing:
        "Homebase Essentials from $24/location/mo annual. 7shifts Essentials $44.99/location/mo (≤30 employees); Pro $89.99 (≤60); Premium $149.99 unlimited.",
      freePlan:
        "Both publish a free starter. Homebase Basic is 1 location / ≤10 employees. 7shifts Comp caps were not fully published on fetched pages.",
      userMinimum:
        "Homebase paid locations are unlimited employees. 7shifts paid tiers cap at 30 / 60 / unlimited employees per location.",
    },
    verdict:
      "Choose Homebase for general SMB hourly (retail, cafes, local services). Choose 7shifts when restaurant scheduling, punches, tips, and POS sync are the job — it is hospitality landscape, not a generic WFM award.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. 7shifts payroll still bills ~$6/employee paid even when ‘included’ on Premium. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "homebase",
        scenarios: ["General SMB hourly WFM", "Retail / local services scheduling + time"],
      },
      {
        productSlug: "7shifts",
        scenarios: ["Restaurant WFM + POS", "Hospitality tips, punches, and forecasts"],
      },
    ],
  }),

  approvedHrPair({
    a: "ashby",
    b: "greenhouse",
    title: "Ashby vs Greenhouse",
    labels: { a: "Ashby", b: "Greenhouse" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 10,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 2,
        integrations: 9,
        mobile: 5,
      },
    },
    factual: {
      startingPricing:
        "Ashby Foundations is $400/mo for ≤100 employees (10% off annual). Greenhouse is custom quote (Core / Plus / Pro) with no published seat dollars.",
      freePlan: "Neither publishes a free plan or a self-serve trial on the pricing pages used for this research.",
      userMinimum:
        "Ashby leaves the $400 flat after 100 employees for seat-based Plus/Enterprise quotes. Greenhouse quotes by hiring volume/complexity.",
    },
    verdict:
      "Choose Greenhouse for structured hiring kits, scorecards, and governance (ATS cluster award). Choose Ashby when a modern AI-forward ATS with a published Foundations floor for ≤100 employees is the job.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. Ashby SSO/Notetaker add-ons and Greenhouse implementation extras are not in the headline. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "ashby",
        scenarios: ["Startup/growth ATS + analytics", "Published $400 Foundations (≤100 employees)"],
      },
      {
        productSlug: "greenhouse",
        scenarios: ["Structured hiring kits and scorecards", "Mid-market/enterprise TA governance"],
      },
    ],
  }),

  approvedHrPair({
    a: "greenhouse",
    b: "lever",
    title: "Greenhouse vs Lever",
    labels: { a: "Greenhouse", b: "Lever" },
    editorial: {
      a: {
        "hiring-workflow": 10,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 2,
        integrations: 9,
        mobile: 5,
      },
      b: {
        "hiring-workflow": 9,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 5,
      },
    },
    factual: {
      startingPricing:
        "Both are custom quote. Greenhouse names Core / Plus / Pro. Lever names a core AI-powered hiring platform plus Insights / VONQ / Onboarding add-ons. Neither publishes seat dollars.",
      freePlan: "Neither publishes a free plan or a self-serve trial.",
      userMinimum:
        "Both quote by company size / hiring needs rather than a public seat floor.",
    },
    verdict:
      "Choose Greenhouse for structured hiring process depth. Choose Lever when ATS + recruiting CRM in one Employ-family platform is the job and you will take a demo.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing pages. Opaque quotes on both sides. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "greenhouse",
        scenarios: ["Structured hiring kits", "Scorecard-led interview process"],
      },
      {
        productSlug: "lever",
        scenarios: ["ATS + recruiting CRM together", "AI screening with a custom quote"],
      },
    ],
  }),

  approvedHrPair({
    a: "ashby",
    b: "lever",
    title: "Ashby vs Lever",
    labels: { a: "Ashby", b: "Lever" },
    editorial: {
      a: {
        "hiring-workflow": 9,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 1,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 9,
        "core-hris": 3,
        "payroll-processing": 1,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 1,
        integrations: 8,
        mobile: 5,
      },
    },
    factual: {
      startingPricing:
        "Ashby Foundations $400/mo (≤100 employees). Lever is custom quote with no published USD floor.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Ashby has a 100-employee Foundations cliff. Lever quotes by company size from the start.",
    },
    verdict:
      "Choose Ashby for a modern ATS+analytics platform with a published startup floor. Choose Lever for ATS+CRM under Employ when you prefer a demo-led quote over a $400/mo Foundations SKU.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. Ashby add-ons (SSO, Notetaker) and Lever Insights/VONQ extras are quote-adjacent. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "ashby",
        scenarios: ["Published Foundations ATS", "Native recruiting analytics"],
      },
      {
        productSlug: "lever",
        scenarios: ["ATS + recruiting CRM", "Employ-family packaging"],
      },
    ],
  }),

  approvedHrPair({
    a: "bamboohr",
    b: "hibob",
    title: "BambooHR vs HiBob",
    labels: { a: "BambooHR", b: "HiBob" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 3,
        "training-depth": 4,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 2,
        "training-depth": 5,
        "time-tracking-depth": 6,
        integrations: 8,
        mobile: 7,
      },
    },
    factual: {
      startingPricing:
        "BambooHR publishes Core from $10 PEPM (>25 employees) or $250/mo ≤25. HiBob is custom PEPM — Bob Core is included; talent, payroll, T&A, and learning are modules. No published HiBob dollars.",
      freePlan: "Neither publishes a free plan or a self-serve trial.",
      userMinimum:
        "BambooHR’s $10 PEPM is for >25 employees. HiBob quotes by company size and selected modules.",
    },
    verdict:
      "Choose BambooHR for a simpler SMB/mid core HRIS with published PEPM (cluster award). Choose HiBob for a culture-forward mid-market HRIS when you will take a module PEPM quote.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. HiBob TCO is implementation + modules, not a $10 analogue. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "bamboohr",
        scenarios: ["Published SMB/mid PEPM", "Straightforward people admin"],
      },
      {
        productSlug: "hibob",
        scenarios: ["Culture-forward mid-market HRIS", "Modular talent/payroll later"],
      },
    ],
  }),

  approvedHrPair({
    a: "hibob",
    b: "personio",
    title: "HiBob vs Personio",
    labels: { a: "HiBob", b: "Personio" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 6,
        "scheduling-depth": 2,
        "training-depth": 5,
        "time-tracking-depth": 6,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 5,
        "scheduling-depth": 2,
        "training-depth": 3,
        "time-tracking-depth": 6,
        integrations: 8,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "HiBob is custom PEPM with no published dollars. Personio Core publishes from €7.60 PEPM (EUR, not USD); CorePro and Apps are quotes. We do not invent a USD Personio floor.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Personio is a 12-month annual minimum plus a size-based setup fee; every active employee is a license. HiBob quotes by modules and headcount.",
    },
    verdict:
      "Choose HiBob for a culture-forward mid-market HRIS UX (custom PEPM). Choose Personio when EU GDPR-native core HRIS with a published euro PEPM floor is the job.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing. Personio Recruiting/Payroll are Apps on top of Core. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "hibob",
        scenarios: ["Distributed mid-market people ops", "Included AI Companion in Core"],
      },
      {
        productSlug: "personio",
        scenarios: ["EU GDPR-native HRIS", "Published euro Core PEPM"],
      },
    ],
  }),

  approvedHrPair({
    a: "oracle-hcm",
    b: "workday",
    title: "Oracle Cloud HCM vs Workday",
    labels: { a: "Oracle Cloud HCM", b: "Workday" },
    editorial: {
      a: {
        "hiring-workflow": 8,
        "core-hris": 10,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 8,
        "time-tracking-depth": 6,
        integrations: 9,
        mobile: 5,
      },
      b: {
        "hiring-workflow": 8,
        "core-hris": 10,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 7,
        "time-tracking-depth": 7,
        integrations: 9,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Both are custom PEPM quotes with no published seat dollars. Implementation and module stacks dominate TCO.",
      freePlan: "Neither publishes a free plan or a self-serve trial.",
      userMinimum:
        "Both target 1,000+ employee programmes. Quotes scale with worker count and modules — not a public seat floor.",
    },
    verdict:
      "Choose Workday as the independent enterprise HCM default. Choose Oracle Cloud HCM when Fusion ERP/EPM stack adjacency and global localisation on one Oracle data model are the job. Neither is an SMB HRIS or published-PEPM payroll product.",
    pricingNotes:
      "Research 2026-08-18 from first-party product pages. No USD invented from third-party PEPM benchmarks. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "workday",
        scenarios: ["Independent enterprise HCM default", "HR + payroll + talent on one record"],
      },
      {
        productSlug: "oracle-hcm",
        scenarios: ["Already on Oracle Cloud ERP/EPM", "Global HR localisation on Fusion"],
      },
    ],
  }),

  approvedHrPair({
    a: "ukg-pro",
    b: "workday",
    title: "UKG Pro vs Workday",
    labels: { a: "UKG Pro", b: "Workday" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 9,
        "scheduling-depth": 10,
        "training-depth": 6,
        "time-tracking-depth": 10,
        integrations: 8,
        mobile: 8,
      },
      b: {
        "hiring-workflow": 8,
        "core-hris": 10,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 7,
        "time-tracking-depth": 7,
        integrations: 9,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Both are custom quotes with no published PEPM. UKG Pro is scoped by HCM vs WFM modules; Workday is module-stacked PEPM.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "UKG Pro is enterprise (Ready is a separate mid-market product). Workday quotes by worker count typically at 1,000+.",
    },
    verdict:
      "Choose Workday for the enterprise HCM system-of-record default. Choose UKG Pro when complex hourly WFM, timekeeping, and scheduling must live in the same HCM as payroll.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. UKG Ready is not a Pro upgrade. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "ukg-pro",
        scenarios: ["HCM + complex hourly WFM", "Healthcare / 24/7 scheduling compliance"],
      },
      {
        productSlug: "workday",
        scenarios: ["Enterprise HCM default", "Global HR + talent analytics"],
      },
    ],
  }),

  approvedHrPair({
    a: "dayforce",
    b: "workday",
    title: "Dayforce vs Workday",
    labels: { a: "Dayforce", b: "Workday" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 10,
        "scheduling-depth": 8,
        "training-depth": 6,
        "time-tracking-depth": 9,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 8,
        "core-hris": 10,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 7,
        "time-tracking-depth": 7,
        integrations: 9,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Both are custom quotes with no published PEPM. Implementation is a large share of year-one TCO on both sides.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Dayforce sells mid-market through enterprise. Workday is the 1,000+ HCM default.",
    },
    verdict:
      "Choose Workday for the enterprise HCM default. Choose Dayforce when continuous-calculation payroll plus time/WFM in one app is the differentiator.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Dayforce is the Ceridian brand. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "dayforce",
        scenarios: ["Continuous-calc payroll + time", "Single-app HR/pay/WFM"],
      },
      {
        productSlug: "workday",
        scenarios: ["Enterprise HCM system of record", "Global talent + planning adjacency"],
      },
    ],
  }),

  approvedHrPair({
    a: "dayforce",
    b: "ukg-pro",
    title: "Dayforce vs UKG Pro",
    labels: { a: "Dayforce", b: "UKG Pro" },
    editorial: {
      a: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 10,
        "scheduling-depth": 8,
        "training-depth": 6,
        "time-tracking-depth": 9,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 9,
        "payroll-processing": 9,
        "scheduling-depth": 10,
        "training-depth": 6,
        "time-tracking-depth": 10,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Both are custom HCM+WFM quotes with no published PEPM.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Both sell mid-market through enterprise. UKG Ready is a different UKG product for smaller mid-market.",
    },
    verdict:
      "Choose UKG Pro for the deepest complex hourly scheduling/compliance WFM inside HCM. Choose Dayforce when continuous payroll calculation on one app is the job.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "dayforce",
        scenarios: ["Continuous payroll calc", "Unified HR/pay/time app"],
      },
      {
        productSlug: "ukg-pro",
        scenarios: ["Complex 24/7 WFM + HCM", "Kronos-heritage timekeeping"],
      },
    ],
  }),

  approvedHrPair({
    a: "adp-workforce-now",
    b: "gusto",
    title: "ADP Workforce Now vs Gusto",
    labels: { a: "ADP Workforce Now", b: "Gusto" },
    editorial: {
      a: {
        "hiring-workflow": 5,
        "core-hris": 7,
        "payroll-processing": 10,
        "scheduling-depth": 6,
        "training-depth": 4,
        "time-tracking-depth": 7,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 4,
        "core-hris": 5,
        "payroll-processing": 9,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 5,
        integrations: 7,
        mobile: 6,
      },
    },
    factual: {
      startingPricing:
        "Gusto publishes Simple from $49/mo + $6/person. ADP Workforce Now is custom quote (Select / Plus / Premium) with no published PEPM.",
      freePlan:
        "Neither is a free-forever payroll product. Gusto setup is free until first payroll.",
      userMinimum:
        "Gusto is SMB-scaled with a platform + per-person fee. ADP WFN quotes mid-market headcount and modules.",
    },
    verdict:
      "Choose Gusto for published US SMB payroll (cluster award). Choose ADP Workforce Now when mid-market tax/compliance payroll+HR is the job and you will take a custom quote. Do not rank them as interchangeable.",
    pricingNotes:
      "Research 2026-08-18. Gusto figures are first-party list. ADP PEPM is unpublished — no third-party $ invented. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "adp-workforce-now",
        scenarios: ["Mid-market payroll compliance", "Select/Plus/Premium package path"],
      },
      {
        productSlug: "gusto",
        scenarios: ["Published SMB payroll", "Simple $49 + $6/person"],
      },
    ],
  }),

  approvedHrPair({
    a: "gusto",
    b: "paylocity",
    title: "Gusto vs Paylocity",
    labels: { a: "Gusto", b: "Paylocity" },
    editorial: {
      a: {
        "hiring-workflow": 4,
        "core-hris": 5,
        "payroll-processing": 9,
        "scheduling-depth": 2,
        "training-depth": 2,
        "time-tracking-depth": 5,
        integrations: 7,
        mobile: 6,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 8,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 5,
        "time-tracking-depth": 7,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Gusto Simple $49/mo + $6/person (first-party). Paylocity is a customized quote with no published PEPM.",
      freePlan: "Neither publishes a free payroll plan. Gusto setup is free until first payroll.",
      userMinimum:
        "Gusto is SMB. Paylocity markets 1–99 / 100–499 / 500+ bands without a public dollar floor.",
    },
    verdict:
      "Choose Gusto for transparent US SMB payroll (award). Choose Paylocity when mid-market payroll+HR with Community/Ignite AI is the job and you will take a quote.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Paylocity ‘Explore Payroll Pricing’ is quote-led. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "gusto",
        scenarios: ["Published SMB payroll", "Month-to-month US pay runs"],
      },
      {
        productSlug: "paylocity",
        scenarios: ["Mid-market HR + payroll", "Employee Community / Ignite AI"],
      },
    ],
  }),

  approvedHrPair({
    a: "paycor",
    b: "paylocity",
    title: "Paycor vs Paylocity",
    labels: { a: "Paycor", b: "Paylocity" },
    editorial: {
      a: {
        "hiring-workflow": 7,
        "core-hris": 7,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 5,
        "time-tracking-depth": 7,
        integrations: 7,
        mobile: 8,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 8,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 5,
        "time-tracking-depth": 7,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Both are custom quotes with no current published PEPM. Paycor pulled its public rate card after the 2025 Paychex acquisition.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Both sell SMB through mid-market. Enterprise HCM is a different shortlist (Workday / UKG).",
    },
    verdict:
      "Choose Paylocity for a broader HR + payroll + finance/IT platform story. Choose Paycor when Paychex-orbit HCM with WISE AI and hourly-vertical packaging is the job. Gusto remains the published-SMB payroll award.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Historical Paycor $99+$6 figures are not treated as live list. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "paycor",
        scenarios: ["Paychex-orbit mid-market HCM", "WISE AI + hourly verticals"],
      },
      {
        productSlug: "paylocity",
        scenarios: ["Unified HR + payroll + Community", "Ignite AI / finance modules"],
      },
    ],
  }),

  approvedHrPair({
    a: "adp-workforce-now",
    b: "paylocity",
    title: "ADP Workforce Now vs Paylocity",
    labels: { a: "ADP Workforce Now", b: "Paylocity" },
    editorial: {
      a: {
        "hiring-workflow": 5,
        "core-hris": 7,
        "payroll-processing": 10,
        "scheduling-depth": 6,
        "training-depth": 4,
        "time-tracking-depth": 7,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 6,
        "core-hris": 8,
        "payroll-processing": 9,
        "scheduling-depth": 6,
        "training-depth": 5,
        "time-tracking-depth": 7,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Both are custom PEPM quotes with no published USD. ADP names Select / Plus / Premium; Paylocity is a single platform quote.",
      freePlan: "Neither publishes a free plan.",
      userMinimum:
        "Both quote mid-market headcount. Gusto remains the published-SMB alternative.",
    },
    verdict:
      "Choose ADP Workforce Now for payroll/tax compliance brand and a named Select/Plus/Premium ladder. Choose Paylocity for a more modern employee Community/Ignite UX. Neither replaces Gusto’s published SMB award.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. No PEPM invented. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "adp-workforce-now",
        scenarios: ["Payroll/tax compliance depth", "Select → Plus → Premium packaging"],
      },
      {
        productSlug: "paylocity",
        scenarios: ["Modern mid-market HCM UX", "Community + Ignite AI"],
      },
    ],
  }),

  // Ecommerce Wave-1 comparisons (2026-08-18) — same-cluster peers only.
  approvedEcomPair({
    a: "shopify",
    b: "bigcommerce",
    title: "Shopify vs BigCommerce",
    labels: { a: "Shopify", b: "BigCommerce" },
    scoresA: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 10,
      "catalog-orders-depth": 9,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 9,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    verdict:
      "No universal winner inside hosted SaaS platforms. Choose Shopify (overall 9.2) for ecosystem depth, checkout/Shop Pay, POS, and app marketplace leadership; choose BigCommerce (overall 8.5) when open-SaaS architecture, multi-storefront, and GMV packaging fit your TCO model — after modeling 2026 GMV thresholds and open payment provider fees.",
    pricingNotes:
      "Both list Core/Basic-class floors at $39/mo ($29 annual) and mid tiers at $105/$79. Shopify Plus from $2,300/mo; BigCommerce Performance from $1,499/mo annual. Confirm live processing and overage rules. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "shopify",
        scenarios: [
          "Default hosted platform + largest app/channel ecosystem",
          "Brands scaling POS + online with Shop Pay checkout",
        ],
      },
      {
        productSlug: "bigcommerce",
        scenarios: [
          "Open-SaaS TCO modeling vs Shopify transaction fees",
          "Multi-storefront or API/headless experiments",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "spocket",
    b: "alidrop",
    title: "Spocket vs AliDrop",
    labels: { a: "Spocket", b: "AliDrop" },
    scoresA: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 4,
      integrations: 9,
      "omnichannel-pos": 3,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 4,
      integrations: 8,
      "omnichannel-pos": 3,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    verdict:
      "No universal winner among dropshipping sourcing apps — neither replaces a storefront. Choose Spocket (overall 7.1) for US/EU supplier curation; choose AliDrop (overall 7.0) for AliExpress/Temu/Alibaba marketplace automation. Both require Shopify/Woo/BigCommerce as the cart layer.",
    pricingNotes:
      "Spocket Starter $39.99/mo (25 products); AliDrop Starter $39/mo (50 products) after $1/7-day trial. Higher tiers raise product caps. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "spocket",
        scenarios: ["US/EU dropshipping supplier network", "Shopify-native import workflows"],
      },
      {
        productSlug: "alidrop",
        scenarios: ["AliExpress/Temu/Alibaba sourcing automation", "Product analyzer + multi-marketplace imports"],
      },
    ],
  }),

  // Ecommerce Priority-1 comparisons (2026-08-18)
  approvedEcomPair({
    a: "wix",
    b: "squarespace",
    title: "Wix vs Squarespace",
    labels: { a: "Wix", b: "Squarespace" },
    scoresA: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 5,
      "checkout-conversion": 7,
      integrations: 6,
      "omnichannel-pos": 3,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    verdict:
      "No universal winner inside website-builder commerce. Choose Wix (overall 7.1) for App Market flexibility and Core ecommerce gating; choose Squarespace (overall 6.6) when template design quality is the purchase driver. Neither is a Shopify-class commerce OS peer.",
    pricingNotes:
      "Wix Core ~$29/mo annual unlocks selling; Squarespace Core ~$23 / Plus ~$39 annual with plan-tied platform fees. Confirm live tiles and fees. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "wix",
        scenarios: ["Site + store with broader apps", "Service + product mixes needing builder flexibility"],
      },
      {
        productSlug: "squarespace",
        scenarios: ["Design-led curated brand shops", "Creators prioritizing template polish"],
      },
    ],
  }),
  approvedEcomPair({
    a: "magento",
    b: "woocommerce",
    title: "Magento vs WooCommerce",
    labels: { a: "Magento", b: "WooCommerce" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 10,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 6,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 6,
      "value-for-money": 9,
      "ai-capabilities": 5,
    },
    verdict:
      "No universal open-source winner. Choose WooCommerce (overall 8.1 — cluster award) for WordPress-native SMB stacks with lower ops friction; choose Magento (overall 8.0 — landscape) when complex catalogs/B2B and enterprise programme depth justify agency and hosting TCO. Magento does not steal WooCommerce’s open-source award.",
    pricingNotes:
      "Both offer free cores; TCO is hosting + extensions/agency. Adobe Commerce is GMV quote-only. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "woocommerce",
        scenarios: ["WordPress content + commerce", "SMB open-source with plugin TCO modeled"],
      },
      {
        productSlug: "magento",
        scenarios: ["Complex B2B / multi-store catalogs", "Teams with Magento/Adobe partner capacity"],
      },
    ],
  }),

  // Ecommerce Priority-2 comparisons (2026-08-18) — same-cluster peers only.
  approvedEcomPair({
    a: "printful",
    b: "printify",
    title: "Printful vs Printify",
    labels: { a: "Printful", b: "Printify" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 3,
      integrations: 9,
      "omnichannel-pos": 2,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 3,
      integrations: 9,
      "omnichannel-pos": 2,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    verdict:
      "No universal POD winner — neither replaces a storefront, and neither steals Spocket’s US/EU supplier-import award. Choose Printful (overall 7.0) for branded fulfillment + Growth plan discounts ($24.99/mo, waivable at $12k/year sales); choose Printify (overall 6.9) for Printify Network catalog breadth and Premium product discounts. Both require Shopify/Woo/etc. as the cart layer.",
    pricingNotes:
      "Both offer free plans. Printful Growth $24.99/mo; Printify Premium from $39/mo or ~$24.99 annual. Product/print costs are separate. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "printful",
        scenarios: ["Branded packaging / in-house print quality path", "Sellers targeting Growth waiver at volume"],
      },
      {
        productSlug: "printify",
        scenarios: ["Multi-provider POD catalog shopping", "Premium discount optimization on Printify Network"],
      },
    ],
  }),
  approvedEcomPair({
    a: "prestashop",
    b: "shopware",
    title: "PrestaShop vs Shopware",
    labels: { a: "PrestaShop", b: "Shopware" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 4,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    verdict:
      "No universal open-source EU winner — WooCommerce keeps the open-source cluster award. Choose PrestaShop (overall 7.1) for Classic free core + Hosted from ~€24/mo; choose Shopware (overall 7.3) for Community Edition with Rise commercial path (~€600/mo) and stronger native AI tooling on paid editions. Neither is ranked against Shopify.",
    pricingNotes:
      "PrestaShop Classic free; Hosted from €24/mo excl. VAT annual. Shopware Community free (Fair Usage ~€1M GMV); Rise from €600/mo. Hosting/agency dominate TCO. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "prestashop",
        scenarios: ["EU SMB open-source with Hosted shortcut", "Teams already on PrestaShop modules"],
      },
      {
        productSlug: "shopware",
        scenarios: ["DACH/EU mid-market needing Rise support + AI Copilot", "Symfony-stack agencies"],
      },
    ],
  }),
  approvedEcomPair({
    a: "ecwid",
    b: "shopify",
    title: "Ecwid vs Shopify",
    labels: { a: "Ecwid", b: "Shopify" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 5,
      "value-for-money": 9,
      "ai-capabilities": 4,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 10,
      "catalog-orders-depth": 9,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    verdict:
      "Different SaaS jobs inside the same broad cluster. Choose Ecwid (overall 7.3 — landscape) when you need an embeddable cart on an existing site without migrating CMS; choose Shopify (overall 9.2 — cluster award) when you want a full hosted commerce OS. Ecwid does not steal Shopify’s award.",
    pricingNotes:
      "Ecwid from $5/mo Starter (Venture ~$29 annual); Shopify Basic ~$29 annual. Ecwid adds no platform transaction fee; model payment processing on both. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "ecwid",
        scenarios: ["Add a store to an existing website", "Lowest-friction embeddable cart"],
      },
      {
        productSlug: "shopify",
        scenarios: ["Full hosted platform + apps/channels", "Brands scaling POS + online"],
      },
    ],
  }),
  approvedEcomPair({
    a: "salesforce-commerce-cloud",
    b: "magento",
    title: "Salesforce Commerce Cloud vs Magento",
    labels: { a: "Salesforce Commerce Cloud", b: "Magento" },
    scoresA: {
      "starting-pricing": 4,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 10,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 7,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 10,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 6,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    verdict:
      "Enterprise landscape comparison — not SMB peers and not a Shopify substitute. Choose Salesforce Commerce Cloud (overall 8.3) when Salesforce CRM/Marketing Cloud unification and GMV SaaS packaging fit; choose Magento / Adobe Commerce (overall 8.0) when open-source control or Adobe Commerce partner programmes fit. WooCommerce keeps the open-source award; Shopify keeps the SaaS award.",
    pricingNotes:
      "SFCC Growth/Plus/Premium are Contact-for-pricing GMV %. Magento Open Source is free + hosting; Adobe Commerce is GMV quote. Implementation dominates both. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "salesforce-commerce-cloud",
        scenarios: ["Salesforce-stack enterprises", "B2C programmes needing Data Cloud personalization path"],
      },
      {
        productSlug: "magento",
        scenarios: ["Open-source or Adobe Commerce partner stacks", "Complex B2B catalogs with agency capacity"],
      },
    ],
  }),

  // Ecommerce Priority-2b comparisons (2026-08-18) — same-cluster peers only.
  approvedEcomPair({
    a: "webflow",
    b: "wix",
    title: "Webflow vs Wix",
    labels: { a: "Webflow", b: "Wix" },
    scoresA: {
      "starting-pricing": 6,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 2,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    verdict:
      "No universal winner inside website-builder commerce — Wix keeps the cluster award (7.1). Choose Wix for a single Core tile (~$29/mo annual) that unlocks selling; choose Webflow (overall 6.6 — landscape) when visual CMS control matters and you will pay for both a Site plan (~$25/mo) and an Ecommerce plan (from $29/mo Standard). Neither is a Shopify-class commerce OS peer.",
    pricingNotes:
      "Wix Core ~$29/mo annual unlocks selling. Webflow Ecommerce Standard $29 / Plus $74 / Advanced $212 annual plus a required Site plan (~$25/mo Premium). Combined Webflow floor is ~$54/mo before processing. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "webflow",
        scenarios: [
          "Design-led brands wanting visual CMS control",
          "Teams that will model Site + Ecommerce TCO and stay inside item caps",
        ],
      },
      {
        productSlug: "wix",
        scenarios: [
          "Site + store with a single Core ecommerce tile",
          "Service + product mixes needing builder flexibility",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "lightspeed-retail",
    b: "square-online",
    title: "Lightspeed Retail vs Square Online",
    labels: { a: "Lightspeed Retail", b: "Square Online" },
    scoresA: {
      "starting-pricing": 5,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 8,
      "omnichannel-pos": 10,
      "value-for-money": 6,
      "ai-capabilities": 5,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 7,
      "checkout-conversion": 8,
      integrations: 7,
      "omnichannel-pos": 10,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    verdict:
      "No universal omnichannel winner — Square Online keeps the cluster award (8.0). Choose Square Online when Square POS is already in place and you want a free-to-start unified online store; choose Lightspeed Retail (overall 7.7 — landscape) for deeper multi-location inventory and X-Series POS as the system of record. Lightspeed Retail is not Ecwid (the Lightspeed eCom embeddable cart).",
    pricingNotes:
      "Square Online Free $0 (higher online processing); Plus $49 / Premium $149 per location. Lightspeed Retail Basic $89 / Core $149 / Plus $289 USD; Lightspeed Payments card-present ~1.5%; third-party processors may incur a monthly surcharge — confirm live. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "lightspeed-retail",
        scenarios: [
          "Specialty retail needing POS + inventory as the system of record",
          "Multi-location catalogs outgrowing Square’s simplest online store",
        ],
      },
      {
        productSlug: "square-online",
        scenarios: [
          "Already on Square POS / payments",
          "Free-tier online store alongside in-person selling",
        ],
      },
    ],
  }),

  // Ecommerce Priority-3 comparisons (2026-08-18) — same-cluster peers only.
  approvedEcomPair({
    a: "opencart",
    b: "woocommerce",
    title: "OpenCart vs WooCommerce",
    labels: { a: "OpenCart", b: "WooCommerce" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 6,
      "catalog-orders-depth": 7,
      "checkout-conversion": 6,
      integrations: 6,
      "omnichannel-pos": 2,
      "value-for-money": 8,
      "ai-capabilities": 3,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 6,
      "value-for-money": 9,
      "ai-capabilities": 5,
    },
    verdict:
      "No universal open-source winner — WooCommerce keeps the cluster award (8.1). Choose WooCommerce for WordPress-native content + commerce; choose OpenCart (overall 6.0 — landscape) for a free GPL PHP cart when you are not on WordPress. Neither steals Magento’s enterprise open-source landscape role.",
    pricingNotes:
      "Both offer free cores; TCO is hosting + extensions. OpenCart managed cloud sometimes cited ~$59–$99/mo by secondary sources — confirm live. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "opencart",
        scenarios: [
          "PHP open-source cart without WordPress",
          "SMB self-host with extension marketplace",
        ],
      },
      {
        productSlug: "woocommerce",
        scenarios: [
          "WordPress content + commerce",
          "Open-source cluster award path with large plugin ecosystem",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "commercetools",
    b: "salesforce-commerce-cloud",
    title: "commercetools vs Salesforce Commerce Cloud",
    labels: { a: "commercetools", b: "Salesforce Commerce Cloud" },
    scoresA: {
      "starting-pricing": 5,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 9,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 7,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoresB: {
      "starting-pricing": 4,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 10,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 7,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    verdict:
      "Enterprise landscape comparison — Shopify keeps the SaaS award (9.2). Choose commercetools (overall 7.7) for MACH/composable API-first programmes with a 60-day trial; choose Salesforce Commerce Cloud (overall 8.3) when Salesforce CRM/Marketing Cloud unification and GMV SaaS packaging fit. Neither is an SMB Shopify substitute.",
    pricingNotes:
      "Both are quote-only. commercetools publishes a 60-day free trial; SFCC Growth/Plus/Premium are GMV-% contact sales. Implementation dominates TCO. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "commercetools",
        scenarios: [
          "Composable / MACH commerce engine",
          "Teams that will assemble their own storefronts",
        ],
      },
      {
        productSlug: "salesforce-commerce-cloud",
        scenarios: [
          "Salesforce-stack enterprises",
          "B2C programmes needing Data Cloud personalization path",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "vtex",
    b: "bigcommerce",
    title: "VTEX vs BigCommerce",
    labels: { a: "VTEX", b: "BigCommerce" },
    scoresA: {
      "starting-pricing": 4,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 8,
      "omnichannel-pos": 6,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 9,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    verdict:
      "Hosted SaaS landscape peers — Shopify keeps the cluster award (9.2). Choose BigCommerce (overall 8.5) when published Core-to-Enterprise tiles and open-SaaS TCO modeling matter; choose VTEX (overall 7.5 — landscape) for mid-market/enterprise programmes that will run a sales-led evaluation. VTEX does not invent list floors.",
    pricingNotes:
      "BigCommerce lists Core/Plus/Pro/Enterprise tiles (from ~$29 annual Core). VTEX is contact-sales only via get-started — no invented floors. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "vtex",
        scenarios: [
          "Mid-market/enterprise hosted commerce sales cycle",
          "Marketplace-oriented digital commerce programmes",
        ],
      },
      {
        productSlug: "bigcommerce",
        scenarios: [
          "Published SaaS tiles without Shopify transaction fees",
          "Multi-storefront / open-SaaS TCO modeling",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "saleor",
    b: "medusa",
    title: "Saleor vs Medusa",
    labels: { a: "Saleor", b: "Medusa" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 4,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoresB: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 7,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 3,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    verdict:
      "No universal headless open-source winner — WooCommerce keeps the open-source award (8.1). Choose Medusa (overall 6.9) for MIT JS commerce with Cloud from $29/$99 and no GMV tax; choose Saleor (overall 6.8) for GraphQL-native Cloud with Select $1599 / Volume $3999 GMV bands. Saleor Forever Free is non-commercial prototyping only.",
    pricingNotes:
      "Both OSS self-host free. Medusa Cloud Develop $29 / Launch $99 / Scale $299. Saleor Cloud Select $1599 / Volume $3999 / Enterprise quote. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "saleor",
        scenarios: [
          "GraphQL-native headless with Cloud Select+",
          "Teams budgeting for GMV-banded Cloud",
        ],
      },
      {
        productSlug: "medusa",
        scenarios: [
          "JS/TypeScript headless with lower Cloud floors",
          "No-GMV-tax Cloud packaging",
        ],
      },
    ],
  }),
  approvedEcomPair({
    a: "tiendanube",
    b: "shopify",
    title: "Tiendanube vs Shopify",
    labels: { a: "Tiendanube", b: "Shopify" },
    scoresA: {
      "starting-pricing": 9,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 7,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoresB: {
      "starting-pricing": 8,
      "storefront-commerce-fit": 10,
      "catalog-orders-depth": 9,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    verdict:
      "Hosted SaaS peers inside the same cluster — Shopify keeps the award (9.2). Choose Shopify for global ecosystem, apps, POS, and Shop Pay; choose Tiendanube (overall 6.9 — landscape) for LATAM-focused SMB commerce with ARS plan tiles (Nuvemshop is an alias, not a second page). Tiendanube does not steal Shopify’s award.",
    pricingNotes:
      "Shopify Basic ~$29 annual. Tiendanube Argentina: Inicial ARS $0; Esencial/Impulso/Escala in ARS (USD ~$20/$59/$174 at ~1350 FX, medium confidence). 7-day trial on paid. Research 2026-08-18.",
    bestFor: [
      {
        productSlug: "tiendanube",
        scenarios: [
          "LATAM SMB storefront with regional pricing/UX",
          "Merchants comparing local ARS plan ladders",
        ],
      },
      {
        productSlug: "shopify",
        scenarios: [
          "Global hosted platform + largest app/channel ecosystem",
          "Brands scaling POS + online with Shop Pay",
        ],
      },
    ],
  }),


  // AI Wave-1 comparisons (2026-08-18)
  approvedAiPair({
    a: "chatgpt",
    b: "claude",
    title: "ChatGPT vs Claude",
    labels: { a: "ChatGPT", b: "Claude" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":7,"usage-model":8},
    },
    factual: {
      startingPricing: "ChatGPT Plus is $20/mo; Claude Pro is about $17/mo on annual ($20 monthly) — confirm live packaging and model/usage caps.",
      freePlan: "Both publish free tiers with caps. Everyday light chat can stay free; heavy Projects/custom GPTs usually need Plus/Pro.",
      userMinimum: "ChatGPT Business has a 2-seat minimum on published plans; Claude Team Standard also has a 2-seat minimum — confirm current floors.",
    },
    verdict:
      "Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Choose Claude when writing quality, long-context analysis, and reasoning are the primary LLM assistant job — especially if ChatGPT's tone or connectors are not the deciding factor. Overall: ChatGPT 8.7 vs Claude 8.4. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
      {
        productSlug: "claude",
        scenarios: [
          "Writers and analysts who prioritize long-document and reasoning quality",
          "Teams wanting a ChatGPT alternative with Projects and team workspaces",
          "Buyers who value careful output tone for customer-facing drafts",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "chatgpt",
    b: "gemini",
    title: "ChatGPT vs Gemini",
    labels: { a: "ChatGPT", b: "Gemini" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":7,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "ChatGPT Plus is $20/mo; Google AI Pro (Gemini) is $19.99/mo — confirm live packaging and what each floor includes.",
      freePlan: "Both publish free tiers. Gemini Free suits light Google-native use; ChatGPT Free covers basic chat before Plus.",
      userMinimum: "ChatGPT Business publishes a 2-seat floor; Gemini Workspace/enterprise packaging is plan- or quote-gated — confirm seat math.",
    },
    verdict:
      "Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Choose Gemini when Google Workspace is your productivity hub and you want an LLM assistant embedded in Google apps — not when connectors outside Google are the priority. Overall: ChatGPT 8.7 vs Gemini 8. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
      {
        productSlug: "gemini",
        scenarios: [
          "Google Workspace-centric teams wanting an integrated LLM assistant",
          "Buyers who value Gemini inside Docs, Gmail, and Drive workflows",
          "Individuals already paying for Google One who want AI bundled",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "claude",
    b: "gemini",
    title: "Claude vs Gemini",
    labels: { a: "Claude", b: "Gemini" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":7,"usage-model":8},
      b: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":7,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing:
        "Claude Pro is about $17/mo on annual ($20 monthly). Google AI Pro (Gemini) is $19.99/mo — confirm live packaging and what each floor includes.",
      freePlan:
        "Both publish usable free tiers with usage caps. Claude Free and Gemini Free are fine for light chat; heavy writing or Workspace-embedded work usually needs Pro.",
      userMinimum:
        "Claude Team Standard has a 2-seat minimum ($20/seat annual or $25 monthly). Gemini consumer Pro is per-user; Workspace/enterprise Gemini packaging is quote- or plan-gated — confirm seat floors before purchase.",
    },
    verdict:
      "Choose Claude when long-context writing, careful reasoning, and Projects/team workspaces are the job. Choose Gemini when Google Workspace (Docs, Gmail, Drive) is your productivity hub and native Gemini embedding matters more than Anthropic's writing style. Overall: Claude 8.4 vs Gemini 8.0 — same llm-assistant cluster, different stack bets. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from Anthropic and Google first-party pages. Affiliate economics excluded. Bundled Google One / Workspace AI plans can change Gemini TCO vs standalone Claude Pro.",
    bestFor: [
      {
        productSlug: "claude",
        scenarios: [
          "Long-document analysis and careful writing/reasoning quality",
          "Teams that want Projects and Team Standard workspaces without living in Google apps",
          "Buyers comparing ChatGPT alternatives on tone and governance narrative",
        ],
      },
      {
        productSlug: "gemini",
        scenarios: [
          "Google Workspace-centric teams wanting Gemini inside Docs, Gmail, and Drive",
          "Individuals already on Google One who want AI bundled into the Google stack",
          "Multimodal chat where Google-native image and app context matter more than Claude Projects",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "quillbot",
    b: "chatgpt",
    title: "QuillBot vs ChatGPT",
    labels: { a: "QuillBot", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":7,"governance":6,"integrations":6,"usage-model":9},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: QuillBot ~$8.33 vs ChatGPT ~$20 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "QuillBot is an AI writing/paraphrasing specialist; ChatGPT is a general LLM assistant — not undifferentiated peers. Choose QuillBot when paraphrasing, grammar, and quick writing edits are the job — not when you need a general LLM for research and coding. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: QuillBot 7.5 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "quillbot",
        scenarios: [
          "Students and writers who primarily need paraphrasing and grammar",
          "Content teams wanting a lightweight writing assistant vs full LLM subscription",
          "Budget-conscious buyers who do not need chat/reasoning depth",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "elevenlabs",
    b: "gamma",
    title: "ElevenLabs vs Gamma",
    labels: { a: "ElevenLabs", b: "Gamma" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":7,"integrations":7,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":7,"governance":6,"integrations":6,"usage-model":9},
    },
    factual: {
      startingPricing: "Published starting floors: ElevenLabs ~$6 vs Gamma ~$8 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "ElevenLabs is voice/TTS; Gamma is AI presentations — different job clusters. Choose ElevenLabs when AI voice production — TTS, cloning, or API embedding — is the primary job, not when you need slides or LLM chat. Choose Gamma when AI-generated presentations and documents are the primary job — not when you need voice production or full websites. Overall: ElevenLabs 8.2 vs Gamma 7.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "elevenlabs",
        scenarios: [
          "Creators and product teams needing realistic TTS and voice cloning",
          "Video, podcast, and app teams embedding voice via API",
          "Buyers evaluating voice quality before committing to higher credit tiers",
        ],
      },
      {
        productSlug: "gamma",
        scenarios: [
          "Founders and marketers who need fast AI-generated pitch decks",
          "Teams wanting docs and microsites without PowerPoint or Figma skills",
          "Budget buyers who need presentation output, not full LLM chat",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "gamma",
    b: "wegic",
    title: "Gamma vs Wegic",
    labels: { a: "Gamma", b: "Wegic" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":7,"governance":6,"integrations":6,"usage-model":9},
      b: {"llm-chat-depth":8,"writing-depth":7,"voice-depth":7,"agent-depth":7,"governance":6,"integrations":5,"usage-model":7},
    },
    factual: {
      startingPricing: "Published starting floors: Gamma ~$8 vs Wegic ~$12 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Gamma is AI presentations/docs; Wegic is AI website building — different job clusters. Choose Gamma when AI-generated presentations and documents are the primary job — not when you need voice production or full websites. Choose Wegic when building a small business website via AI chat is the primary job — not when you need slide decks or ad banners. Overall: Gamma 7.7 vs Wegic 7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "gamma",
        scenarios: [
          "Founders and marketers who need fast AI-generated pitch decks",
          "Teams wanting docs and microsites without PowerPoint or Figma skills",
          "Budget buyers who need presentation output, not full LLM chat",
        ],
      },
      {
        productSlug: "wegic",
        scenarios: [
          "Founders and SMBs who want a conversational AI website builder",
          "Buyers who prefer chat-to-site over drag-and-drop builders",
          "Teams evaluating via free trial before committing to starter pricing",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "adcreative-ai",
    b: "gamma",
    title: "AdCreative.ai vs Gamma",
    labels: { a: "AdCreative.ai", b: "Gamma" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":6,"integrations":7,"usage-model":6},
      b: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":7,"governance":6,"integrations":6,"usage-model":9},
    },
    factual: {
      startingPricing: "Published starting floors: AdCreative.ai ~$29 vs Gamma ~$8 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "AdCreative.ai is paid-media creative generation; Gamma is presentations/docs — different job clusters. Choose AdCreative.ai when paid-media ad creative generation is the primary job — especially for Facebook and Google campaigns. Choose Gamma when AI-generated presentations and documents are the primary job — not when you need voice production or full websites. Overall: AdCreative.ai 7.6 vs Gamma 7.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "adcreative-ai",
        scenarios: [
          "Paid media teams and agencies generating ad variants at scale",
          "Growth marketers running Facebook and Google campaigns",
          "Buyers who want performance-scored creative, not manual design",
        ],
      },
      {
        productSlug: "gamma",
        scenarios: [
          "Founders and marketers who need fast AI-generated pitch decks",
          "Teams wanting docs and microsites without PowerPoint or Figma skills",
          "Budget buyers who need presentation output, not full LLM chat",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "mindstudio",
    b: "chatgpt",
    title: "MindStudio vs ChatGPT",
    labels: { a: "MindStudio", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":8,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":6,"integrations":7,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: MindStudio ~$16 vs ChatGPT ~$20 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "MindStudio is agent/mini-app building; ChatGPT is a general LLM assistant — adjacent jobs, not the same primary cluster. Choose MindStudio when building repeatable AI agents and mini-apps is the job — not when you only need conversational LLM chat. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: MindStudio 7.3 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "mindstudio",
        scenarios: [
          "Ops and marketing teams building repeatable AI agents without developers",
          "Founders automating workflows with visual builder logic",
          "Buyers who need published agent apps, not just chat",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),

  // IT Wave-1 comparisons (2026-08-18) — landscape
  approvedItPair({
    a: "freshservice",
    b: "datadog",
    title: "Freshservice vs Datadog",
    labels: { a: "Freshservice", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Freshservice ~$19 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Landscape comparison — ITSM / service desk vs observability; not undifferentiated peers. Choose Freshservice when ITSM and internal employee service desk is the primary job — not customer ecommerce helpdesk or website live chat. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Freshservice 8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "freshservice",
        scenarios: [
          "IT teams needing ITIL-style incidents, changes, and asset management",
          "Employee service desk and internal support portals",
          "Freshworks customers wanting ITSM separate from Freshdesk",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "github",
    b: "datadog",
    title: "GitHub vs Datadog",
    labels: { a: "GitHub", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: GitHub ~$4 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Landscape comparison — source control / DevOps vs observability; not undifferentiated peers. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: GitHub 9.1 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "plesk",
    b: "bright-data",
    title: "Plesk vs Bright Data",
    labels: { a: "Plesk", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Plesk ~$16.99 vs Bright Data ~$499 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Landscape comparison — hosting panel vs web data / proxy collection; not undifferentiated peers. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: Plesk 7.4 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),

  // Customer-service Wave-1 comparisons (2026-08-18) — same-cluster peers only.
  approvedCsPair({
    a: "freshdesk",
    b: "zendesk-suite",
    title: "Freshdesk vs Zendesk Suite",
    labels: { a: "Freshdesk", b: "Zendesk Suite" },
    editorial: {
      a: {
        "ticketing-depth": 8,
        "live-chat": 7,
        "knowledge-base": 7,
        omnichannel: 8,
        "sla-routing": 8,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 9,
        "live-chat": 8,
        "knowledge-base": 8,
        omnichannel: 9,
        "sla-routing": 9,
        "ecommerce-helpdesk": 5,
        "ai-features": 8,
        integrations: 9,
      },
    },
    factual: {
      startingPricing:
        "Both publish $19/agent/month annual entry (Freshdesk Growth; Zendesk Support Team). Zendesk Suite Team is $55 and Suite Pro $115 — Support Team is not full Suite omnichannel.",
      freePlan:
        "Neither publishes a free forever plan. Freshdesk has a 14-day trial; Zendesk publishes trials on Suite packaging.",
      agentMinimum:
        "Both bill per agent. Model Suite vs Growth/Pro for the channels and AI you will actually use — the $19 tile is not all-in omnichannel.",
    },
    verdict:
      "Choose Zendesk Suite (overall 8.2) for enterprise omnichannel, SLA/routing, and Suite AI. Choose Freshdesk (7.9) for Freshworks-aligned mid-market ticketing at a similar published $19 floor without Suite Pro pricing. Not an ecommerce or ITSM comparison.",
    pricingNotes:
      "Research 2026-08-18 from first-party pricing pages. Confirm live Suite vs Support Team packaging. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "freshdesk",
        scenarios: [
          "Mid-market helpdesk with Freshworks ecosystem alignment",
          "Published Growth/Pro/Enterprise per-agent ladder",
        ],
      },
      {
        productSlug: "zendesk-suite",
        scenarios: [
          "Enterprise omnichannel helpdesk at Suite Team/Pro depth",
          "SLA, routing, and AI agent programmes at scale",
        ],
      },
    ],
  }),
  approvedCsPair({
    a: "freshdesk",
    b: "help-scout",
    title: "Freshdesk vs Help Scout",
    labels: { a: "Freshdesk", b: "Help Scout" },
    editorial: {
      a: {
        "ticketing-depth": 8,
        "live-chat": 7,
        "knowledge-base": 7,
        omnichannel: 8,
        "sla-routing": 8,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 7,
        "live-chat": 5,
        "knowledge-base": 8,
        omnichannel: 6,
        "sla-routing": 6,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "Freshdesk Growth from $19/agent/mo annual. Help Scout Standard $25, Plus $45, Pro $75 user/mo annual — plus AI Answers usage on paid tiers.",
      freePlan:
        "Help Scout publishes a free plan for up to 5 users. Freshdesk does not publish a free forever plan (14-day trial).",
      agentMinimum:
        "Freshdesk bills per agent on paid tiers. Help Scout’s free cap is 5 users; paid plans are per user.",
    },
    verdict:
      "Choose Freshdesk (7.9) for omnichannel ticketing and SLA depth. Choose Help Scout (7.5) for SMB shared-inbox simplicity, Docs-first self-service, and a 5-user free plan. Do not treat Help Scout as an enterprise omnichannel peer.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Help Scout AI Answers can add variable cost. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "freshdesk",
        scenarios: ["Omnichannel helpdesk ticketing", "SLA and routing on paid tiers"],
      },
      {
        productSlug: "help-scout",
        scenarios: ["SMB shared inbox with a free 5-user tier", "Docs-first self-service"],
      },
    ],
  }),
  approvedCsPair({
    a: "freshdesk",
    b: "zoho-desk",
    title: "Freshdesk vs Zoho Desk",
    labels: { a: "Freshdesk", b: "Zoho Desk" },
    editorial: {
      a: {
        "ticketing-depth": 8,
        "live-chat": 7,
        "knowledge-base": 7,
        omnichannel: 8,
        "sla-routing": 8,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 8,
        "live-chat": 6,
        "knowledge-base": 7,
        omnichannel: 7,
        "sla-routing": 8,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "Freshdesk Growth $19/agent/mo annual. Zoho Desk Express $7, Standard $14, Professional $23, Enterprise $40 agent/mo annual (USD selector — some regions show INR).",
      freePlan:
        "Zoho Desk publishes a free plan for up to 3 agents. Freshdesk has no free forever plan.",
      agentMinimum:
        "Both bill per agent on paid tiers. Zoho’s free cap is 3 agents; Freshdesk paid starts at Growth.",
    },
    verdict:
      "Choose Freshdesk (7.9) for omnichannel inbox depth and Freshworks alignment. Choose Zoho Desk (7.8) for value — free 3-agent or $7 Express — and Zoho suite adjacency. Close helpdesk peers; pick by stack and floor, not a universal winner.",
    pricingNotes:
      "Research 2026-08-18. Confirm Zoho USD vs regional currency on the live pricing page. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "freshdesk",
        scenarios: ["Freshworks-aligned omnichannel helpdesk", "Mid-market ticketing depth"],
      },
      {
        productSlug: "zoho-desk",
        scenarios: ["Budget helpdesk with a free 3-agent tier", "Zoho CRM / suite buyers"],
      },
    ],
  }),
  approvedCsPair({
    a: "zendesk-suite",
    b: "help-scout",
    title: "Zendesk Suite vs Help Scout",
    labels: { a: "Zendesk Suite", b: "Help Scout" },
    editorial: {
      a: {
        "ticketing-depth": 9,
        "live-chat": 8,
        "knowledge-base": 8,
        omnichannel: 9,
        "sla-routing": 9,
        "ecommerce-helpdesk": 5,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 7,
        "live-chat": 5,
        "knowledge-base": 8,
        omnichannel: 6,
        "sla-routing": 6,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "Zendesk Support Team $19/agent annual; Suite Team $55, Suite Pro $115. Help Scout Standard $25 user/mo annual (Plus $45, Pro $75) after a free 5-user tier.",
      freePlan:
        "Help Scout publishes a free plan for up to 5 users. Zendesk Suite does not publish a free forever plan.",
      agentMinimum:
        "Zendesk bills per agent. Help Scout free is capped at 5 users; paid is per user. Model Suite packaging separately from Support Team.",
    },
    verdict:
      "Choose Zendesk Suite (8.2) for scale, omnichannel, and routing. Choose Help Scout (7.5) when SMB shared-inbox UX and Docs-first self-service beat Suite complexity. Different jobs inside helpdesk — not a false peer ranking on one undifferentiated list.",
    pricingNotes:
      "Research 2026-08-18. Suite Team/Pro is the honest Zendesk comparison to omnichannel needs. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "zendesk-suite",
        scenarios: ["Enterprise omnichannel helpdesk", "SLA/routing at Suite depth"],
      },
      {
        productSlug: "help-scout",
        scenarios: ["SMB email-first shared inbox", "Teams that will use the free 5-user tier"],
      },
    ],
  }),
  approvedCsPair({
    a: "zendesk-suite",
    b: "zoho-desk",
    title: "Zendesk Suite vs Zoho Desk",
    labels: { a: "Zendesk Suite", b: "Zoho Desk" },
    editorial: {
      a: {
        "ticketing-depth": 9,
        "live-chat": 8,
        "knowledge-base": 8,
        omnichannel: 9,
        "sla-routing": 9,
        "ecommerce-helpdesk": 5,
        "ai-features": 8,
        integrations: 9,
      },
      b: {
        "ticketing-depth": 8,
        "live-chat": 6,
        "knowledge-base": 7,
        omnichannel: 7,
        "sla-routing": 8,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "Zendesk Support Team $19/agent annual (Suite Team $55 / Pro $115). Zoho Desk Express $7 through Enterprise $40 agent/mo annual, plus a free 3-agent plan.",
      freePlan:
        "Zoho Desk publishes a free plan for up to 3 agents. Zendesk Suite does not.",
      agentMinimum:
        "Both bill per agent on paid tiers. Zoho’s free cap is 3 agents; Zendesk Suite has no free-agent floor.",
    },
    verdict:
      "Choose Zendesk Suite (8.2) for enterprise omnichannel and integrations. Choose Zoho Desk (7.8) when published low floors and Zoho CRM adjacency matter more than Suite depth. Value vs scale — not a single #1.",
    pricingNotes:
      "Research 2026-08-18 from first-party USD pages. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "zendesk-suite",
        scenarios: ["Mid-market/enterprise omnichannel scale", "Mature marketplace and analytics"],
      },
      {
        productSlug: "zoho-desk",
        scenarios: ["Lowest published helpdesk floors", "Already on Zoho CRM / Zoho One"],
      },
    ],
  }),
  approvedCsPair({
    a: "help-scout",
    b: "zoho-desk",
    title: "Help Scout vs Zoho Desk",
    labels: { a: "Help Scout", b: "Zoho Desk" },
    editorial: {
      a: {
        "ticketing-depth": 7,
        "live-chat": 5,
        "knowledge-base": 8,
        omnichannel: 6,
        "sla-routing": 6,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 7,
      },
      b: {
        "ticketing-depth": 8,
        "live-chat": 6,
        "knowledge-base": 7,
        omnichannel: 7,
        "sla-routing": 8,
        "ecommerce-helpdesk": 4,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "Help Scout Standard $25 user/mo annual after a free 5-user tier. Zoho Desk Express $7 agent/mo annual after a free 3-agent tier.",
      freePlan:
        "Both publish free plans — Help Scout up to 5 users; Zoho Desk up to 3 agents. Caps and feature gates differ; do not treat them as equivalent forever-free helpdesks.",
      agentMinimum:
        "Help Scout free is 5 users. Zoho Desk free is 3 agents. Paid both per seat — Zoho’s Express floor is lower for growing teams.",
    },
    verdict:
      "Choose Help Scout (7.5) for shared-inbox UX and Docs. Choose Zoho Desk (7.8) for cheaper per-agent scale and ticketing workflow depth. Both are SMB-friendly helpdesks — pick UX vs suite value, not a forced omnichannel winner.",
    pricingNotes:
      "Research 2026-08-18. Both have free caps — model the paid qualifying plan. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "help-scout",
        scenarios: ["Email-first SMB shared inbox", "Docs / knowledge-base emphasis"],
      },
      {
        productSlug: "zoho-desk",
        scenarios: ["Lower paid per-agent floors at team scale", "Zoho suite buyers"],
      },
    ],
  }),
  approvedCsPair({
    a: "freshchat",
    b: "livechat",
    title: "Freshchat vs LiveChat",
    labels: { a: "Freshchat", b: "LiveChat" },
    editorial: {
      a: {
        "ticketing-depth": 5,
        "live-chat": 9,
        "knowledge-base": 6,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 5,
        "live-chat": 9,
        "knowledge-base": 6,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "Freshchat Growth $19/agent/mo annual (Pro $49, Enterprise $79). LiveChat Starter $19, Team $49, Business $79, Enterprise $52 per person/mo annual.",
      freePlan:
        "Freshchat publishes a free plan for up to 10 agents. LiveChat does not publish a free forever tier.",
      agentMinimum:
        "Both bill per agent/person on paid tiers. Freshchat’s free 10-agent cap is the main TCO fork versus LiveChat’s paid-from-Starter model.",
    },
    verdict:
      "Choose Freshchat (7.6) for live chat/messaging with a free 10-agent tier inside Freshworks. Choose LiveChat (7.4) for established website chat and Text-suite expansion when you accept per-person pricing without a free plan. Live-chat cluster only — not helpdesk or ITSM peers.",
    pricingNotes:
      "Research 2026-08-18. Distinct from Freshdesk (helpdesk) and Freshservice (ITSM). Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "freshchat",
        scenarios: ["Free 10-agent live chat", "Freshworks messaging + later helpdesk add-on"],
      },
      {
        productSlug: "livechat",
        scenarios: ["Proven website live chat", "Text ecosystem (ChatBot / HelpDesk) expansion"],
      },
    ],
  }),
  approvedCsPair({
    a: "freshchat",
    b: "tidio",
    title: "Freshchat vs Tidio",
    labels: { a: "Freshchat", b: "Tidio" },
    editorial: {
      a: {
        "ticketing-depth": 5,
        "live-chat": 9,
        "knowledge-base": 6,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 4,
        "live-chat": 9,
        "knowledge-base": 7,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 8,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "Freshchat Growth $19/agent/mo annual after a free 10-agent tier. Tidio Starter $24.17/mo annual for 100 billable conversations; Growth from $49.17 — conversation-cap pricing, not per-agent.",
      freePlan:
        "Freshchat publishes free for up to 10 agents. Tidio markets visitor chat with conversation-based paid tiers — confirm live free/trial terms on tidio.com.",
      agentMinimum:
        "Freshchat is per-agent. Tidio bills on billable conversations (Starter 100/mo) — overage risk vs seat math is the real comparison, not a $19 vs $24 tile.",
    },
    verdict:
      "Choose Freshchat (7.6) for per-agent messaging in Freshworks. Choose Tidio (7.3) for conversation-cap pricing, Lyro AI deflection, and SMB website chat. Tidio is not a sales CRM — live-chat cluster only.",
    pricingNotes:
      "Research 2026-08-18. Tidio re-homed from CRM-primary to CS live-chat. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "freshchat",
        scenarios: ["Per-agent live chat with a free 10-agent tier", "Freshworks stack buyers"],
      },
      {
        productSlug: "tidio",
        scenarios: ["AI visitor deflection (Lyro)", "Conversation-cap pricing for website chat"],
      },
    ],
  }),
  approvedCsPair({
    a: "livechat",
    b: "tidio",
    title: "LiveChat vs Tidio",
    labels: { a: "LiveChat", b: "Tidio" },
    editorial: {
      a: {
        "ticketing-depth": 5,
        "live-chat": 9,
        "knowledge-base": 6,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 4,
        "live-chat": 9,
        "knowledge-base": 7,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 8,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "LiveChat Starter $19 per person/mo annual. Tidio Starter $24.17/mo annual (100 billable conversations) — different units (seats vs conversations).",
      freePlan:
        "LiveChat does not publish a free forever tier. Confirm Tidio’s current free/trial terms; paid Starter is conversation-capped.",
      agentMinimum:
        "LiveChat bills per person from Starter. Tidio Starter is a conversation pack — growing chat volume can exceed per-seat LiveChat before headcount does.",
    },
    verdict:
      "Choose LiveChat (7.4) for proven website chat with Text-suite expansion. Choose Tidio (7.3) when AI visitor deflection and conversation-based pricing fit better than per-person seats. Live-chat cluster only.",
    pricingNotes:
      "Research 2026-08-18. Model seats vs billable conversations at your volume. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "livechat",
        scenarios: ["Per-person website live chat", "Text HelpDesk / ChatBot expansion path"],
      },
      {
        productSlug: "tidio",
        scenarios: ["Lyro AI + flows for deflection", "Conversation-pack TCO for SMB sites"],
      },
    ],
  }),

  // AI Priority-2 comparisons (2026-08-18)
  approvedAiPair({
    a: "microsoft-copilot",
    b: "chatgpt",
    title: "Microsoft 365 Copilot vs ChatGPT",
    labels: { a: "Microsoft 365 Copilot", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":9,"integrations":10,"usage-model":6},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Microsoft 365 Copilot Business starts around $21/user/mo annual on a qualifying M365 base; ChatGPT Plus is $20/mo (Business from ~$20/seat annual) — confirm live packaging.",
      freePlan: "ChatGPT publishes a free tier; Microsoft 365 Copilot is an add-on without a standalone free Copilot seat — confirm trial eligibility.",
      userMinimum: "Copilot requires a qualifying Microsoft 365 licence; ChatGPT Business has a published 2-seat floor — confirm before budgeting.",
    },
    verdict:
      "Choose Microsoft 365 Copilot when the primary job is an LLM assistant inside Microsoft 365 — not a standalone chat tab and not GitHub Copilot. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: Microsoft 365 Copilot 8.2 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "microsoft-copilot",
        scenarios: [
          "Microsoft 365 shops that want AI inside Word, Excel, Outlook, and Teams",
          "IT buyers who need tenant admin and Graph grounding",
          "Enterprises already paying for E3/E5 who can absorb the $30 add-on",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "perplexity",
    b: "chatgpt",
    title: "Perplexity vs ChatGPT",
    labels: { a: "Perplexity", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":8,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Perplexity Pro and ChatGPT Plus both publish around $20/mo (~$17 annual for Perplexity) — confirm live packaging and Max/Enterprise tiers.",
      freePlan: "Both publish free tiers. Perplexity Free emphasizes cited search; ChatGPT Free is general chat with caps.",
      userMinimum: "Perplexity Enterprise Pro publishes higher seat floors; ChatGPT Business has a 2-seat minimum — confirm current terms.",
    },
    verdict:
      "Choose Perplexity when the LLM job is cited research and Deep Research — not a general Custom GPT workshop. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: Perplexity 8.3 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "perplexity",
        scenarios: [
          "Analysts and operators who need cited answers and Deep Research",
          "Teams replacing ‘Google then paste into ChatGPT’ with one research surface",
          "Orgs that want Enterprise Pro admin without Microsoft Graph lock-in",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "github-copilot",
    b: "cursor",
    title: "GitHub Copilot vs Cursor",
    labels: { a: "GitHub Copilot", b: "Cursor" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":9,"governance":7,"integrations":8,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: GitHub Copilot ~$10 vs Cursor ~$20 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Both are AI coding assistants — Copilot is IDE/GitHub-plugin oriented; Cursor is an AI-native editor. Choose GitHub Copilot when AI coding inside GitHub and your current IDE is the job — not Microsoft 365 Copilot. Choose Cursor when the job is an AI-native coding editor and agents — not GitHub Copilot-as-a-plugin and not ChatGPT. Overall: GitHub Copilot 8.3 vs Cursor 8.4. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "github-copilot",
        scenarios: [
          "Teams already on GitHub who want IDE + PR Copilot",
          "Orgs that need Business/Enterprise policy on a familiar SKU",
          "Developers who want completions without switching editors",
        ],
      },
      {
        productSlug: "cursor",
        scenarios: [
          "Developers who want an AI-native editor rather than a plugin",
          "Teams running Agent-heavy refactors with MCP/tools",
          "Orgs ready for Teams SSO and privacy modes",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "midjourney",
    b: "adobe-firefly",
    title: "Midjourney vs Adobe Firefly",
    labels: { a: "Midjourney", b: "Adobe Firefly" },
    editorial: {
      a: {"llm-chat-depth":10,"writing-depth":10,"voice-depth":10,"agent-depth":8,"governance":6,"integrations":6,"usage-model":8},
      b: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":9,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: Midjourney ~$10 vs Adobe Firefly ~$10 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Both are AI image generation — Midjourney for distinctive stills; Firefly for Creative Cloud / commercial-safe workflows. Choose Midjourney when distinctive AI stills (and optional video) are the job — not Firefly-in-Photoshop and not ChatGPT images. Choose Adobe Firefly when AI images must live in Creative Cloud with a commercial IP story — not as a Midjourney Discord substitute. Overall: Midjourney 8.3 vs Adobe Firefly 8.1. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "midjourney",
        scenarios: [
          "Creative teams that want distinctive stills",
          "Studios that can live with GPU-hour packs and Discord/web",
          "Pro/Mega buyers who need Stealth or high-volume Fast time",
        ],
      },
      {
        productSlug: "adobe-firefly",
        scenarios: [
          "Designers already in Photoshop / Creative Cloud",
          "Brands that need commercial IP posture",
          "Teams that want Firefly + Express without Discord",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "runway",
    b: "midjourney",
    title: "Runway vs Midjourney",
    labels: { a: "Runway", b: "Midjourney" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":6,"integrations":6,"usage-model":7},
      b: {"llm-chat-depth":10,"writing-depth":10,"voice-depth":10,"agent-depth":8,"governance":6,"integrations":6,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: Runway ~$12 vs Midjourney ~$10 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Runway is generative video; Midjourney is primarily stills (with limited video) — different job clusters. Choose Runway when generative video clips are the job — not Midjourney stills and not an LLM chat. Choose Midjourney when distinctive AI stills (and optional video) are the job — not Firefly-in-Photoshop and not ChatGPT images. Overall: Runway 7.7 vs Midjourney 8.3. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "runway",
        scenarios: [
          "Creators and agencies generating short AI video clips",
          "Teams that can budget credits rather than unlimited renders",
          "Pro buyers who need commercial rights",
        ],
      },
      {
        productSlug: "midjourney",
        scenarios: [
          "Creative teams that want distinctive stills",
          "Studios that can live with GPU-hour packs and Discord/web",
          "Pro/Mega buyers who need Stealth or high-volume Fast time",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "otter-ai",
    b: "microsoft-copilot",
    title: "Otter.ai vs Microsoft 365 Copilot",
    labels: { a: "Otter.ai", b: "Microsoft 365 Copilot" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":7,"integrations":8,"usage-model":8},
      b: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":9,"integrations":10,"usage-model":6},
    },
    factual: {
      startingPricing: "Published starting floors: Otter.ai ~$8.33 vs Microsoft 365 Copilot ~$21 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Otter.ai is meeting transcription/notes; Microsoft 365 Copilot is a workspace LLM add-on — different primary jobs. Choose Otter.ai when AI meeting notes and auto-join transcription are the job — not a general LLM or voice studio. Choose Microsoft 365 Copilot when the primary job is an LLM assistant inside Microsoft 365 — not a standalone chat tab and not GitHub Copilot. Overall: Otter.ai 8 vs Microsoft 365 Copilot 8.2. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "otter-ai",
        scenarios: [
          "Individuals drowning in meeting notes",
          "Sales and CS teams that want auto-join transcripts",
          "SMBs that need Business admin without an enterprise RFP",
        ],
      },
      {
        productSlug: "microsoft-copilot",
        scenarios: [
          "Microsoft 365 shops that want AI inside Word, Excel, Outlook, and Teams",
          "IT buyers who need tenant admin and Graph grounding",
          "Enterprises already paying for E3/E5 who can absorb the $30 add-on",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "cursor",
    b: "chatgpt",
    title: "Cursor vs ChatGPT",
    labels: { a: "Cursor", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":9,"governance":7,"integrations":8,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: Cursor ~$20 vs ChatGPT ~$20 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Cursor is an AI coding editor; ChatGPT is a general LLM assistant — landscape, not same-cluster peers. Choose Cursor when the job is an AI-native coding editor and agents — not GitHub Copilot-as-a-plugin and not ChatGPT. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: Cursor 8.4 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "cursor",
        scenarios: [
          "Developers who want an AI-native editor rather than a plugin",
          "Teams running Agent-heavy refactors with MCP/tools",
          "Orgs ready for Teams SSO and privacy modes",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "github-copilot",
    b: "chatgpt",
    title: "GitHub Copilot vs ChatGPT",
    labels: { a: "GitHub Copilot", b: "ChatGPT" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: GitHub Copilot ~$10 vs ChatGPT ~$20 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "GitHub Copilot is AI coding in the IDE; ChatGPT is a general LLM assistant — landscape comparison. Choose GitHub Copilot when AI coding inside GitHub and your current IDE is the job — not Microsoft 365 Copilot. Choose ChatGPT when a general-purpose LLM assistant with custom projects, connectors, and a clear team upgrade path is the primary job. Overall: GitHub Copilot 8.3 vs ChatGPT 8.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "github-copilot",
        scenarios: [
          "Teams already on GitHub who want IDE + PR Copilot",
          "Orgs that need Business/Enterprise policy on a familiar SKU",
          "Developers who want completions without switching editors",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "Teams and individuals wanting a mainstream general-purpose LLM assistant",
          "Buyers who need custom GPT projects and broad model access on Plus/Pro",
          "Orgs standardizing on OpenAI with Business admin and connector depth",
        ],
      },
    ],
  }),

  // IT Priority-2 comparisons (2026-08-18)
  approvedItPair({
    a: "servicenow",
    b: "freshservice",
    title: "ServiceNow vs Freshservice",
    labels: { a: "ServiceNow", b: "Freshservice" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":10,"integrations":10},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: ServiceNow ~$100 vs Freshservice ~$19 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose ServiceNow when enterprise ITSM (and likely adjacent Now modules) is the job and you can run an RFP — not when you need Freshservice’s published Starter SKU. Choose Freshservice when ITSM and internal employee service desk is the primary job — not customer ecommerce helpdesk or website live chat. Overall: ServiceNow 8.7 vs Freshservice 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "servicenow",
        scenarios: [
          "Enterprises standardising ITSM (and often HRSD/CSM) on one platform",
          "ITIL-mature shops that need CMDB + change at scale",
          "Buyers with budget for implementation partners",
        ],
      },
      {
        productSlug: "freshservice",
        scenarios: [
          "IT teams needing ITIL-style incidents, changes, and asset management",
          "Employee service desk and internal support portals",
          "Freshworks customers wanting ITSM separate from Freshdesk",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "jira-service-management",
    b: "freshservice",
    title: "Jira Service Management vs Freshservice",
    labels: { a: "Jira Service Management", b: "Freshservice" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":9},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Jira Service Management ~$20 vs Freshservice ~$19 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose Jira Service Management when ITSM must sit on Jira Cloud — not as a Jira Software licence and not as ServiceNow. Choose Freshservice when ITSM and internal employee service desk is the primary job — not customer ecommerce helpdesk or website live chat. Overall: Jira Service Management 8 vs Freshservice 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "jira-service-management",
        scenarios: [
          "Teams already on Jira Cloud who need a service desk",
          "IT/HR/ops request management next to engineering issues",
          "Buyers who want a published agent SKU under ServiceNow TCO",
        ],
      },
      {
        productSlug: "freshservice",
        scenarios: [
          "IT teams needing ITIL-style incidents, changes, and asset management",
          "Employee service desk and internal support portals",
          "Freshworks customers wanting ITSM separate from Freshdesk",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "servicenow",
    b: "jira-service-management",
    title: "ServiceNow vs Jira Service Management",
    labels: { a: "ServiceNow", b: "Jira Service Management" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":10,"integrations":10},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: ServiceNow ~$100 vs Jira Service Management ~$20 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose ServiceNow when enterprise ITSM (and likely adjacent Now modules) is the job and you can run an RFP — not when you need Freshservice’s published Starter SKU. Choose Jira Service Management when ITSM must sit on Jira Cloud — not as a Jira Software licence and not as ServiceNow. Overall: ServiceNow 8.7 vs Jira Service Management 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "servicenow",
        scenarios: [
          "Enterprises standardising ITSM (and often HRSD/CSM) on one platform",
          "ITIL-mature shops that need CMDB + change at scale",
          "Buyers with budget for implementation partners",
        ],
      },
      {
        productSlug: "jira-service-management",
        scenarios: [
          "Teams already on Jira Cloud who need a service desk",
          "IT/HR/ops request management next to engineering issues",
          "Buyers who want a published agent SKU under ServiceNow TCO",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "new-relic",
    b: "datadog",
    title: "New Relic vs Datadog",
    labels: { a: "New Relic", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: New Relic ~$10 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose New Relic when unified observability billed on ingest + users is the job — not Datadog host packs and not ITSM. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: New Relic 8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "new-relic",
        scenarios: [
          "Teams that want APM + logs + infra in one ingest bill",
          "Orgs that can live with 1–5 Standard full users",
          "Buyers comparing usage-based observability to Datadog hosts",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "grafana-cloud",
    b: "datadog",
    title: "Grafana Cloud vs Datadog",
    labels: { a: "Grafana Cloud", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Grafana Cloud ~$19 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Grafana Cloud when managed Grafana/LGTM telemetry is the job — not Datadog host modules and not ITSM. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Grafana Cloud 7.5 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "grafana-cloud",
        scenarios: [
          "Teams already fluent in Grafana/Prometheus",
          "Startups that fit in the Free telemetry caps",
          "Platform teams that want Mimir/Loki without operating it",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "pagerduty",
    b: "datadog",
    title: "PagerDuty vs Datadog",
    labels: { a: "PagerDuty", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: PagerDuty ~$21 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (incident / on-call vs observability) — not undifferentiated peers. Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: PagerDuty 8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "pagerduty",
        scenarios: [
          "SRE/IT teams that need on-call schedules and paging",
          "Orgs already sending alerts from Datadog/CloudWatch",
          "Incident commanders who want a dedicated ops cloud",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "gitlab",
    b: "github",
    title: "GitLab vs GitHub",
    labels: { a: "GitLab", b: "GitHub" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
    },
    factual: {
      startingPricing: "Published starting floors: GitLab ~$29 vs GitHub ~$4 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster source control / DevOps peer comparison. Choose GitLab when a DevSecOps platform (git + CI + security) is the job — not GitHub Copilot and not Bitbucket-as-cheap-git. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Overall: GitLab 8.3 vs GitHub 9.1. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "gitlab",
        scenarios: [
          "Teams that want git + CI + security in one licence",
          "Self-managed / data-residency buyers",
          "Orgs leaving a many-tool DevOps stack",
        ],
      },
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "bitbucket",
    b: "github",
    title: "Bitbucket Cloud vs GitHub",
    labels: { a: "Bitbucket Cloud", b: "GitHub" },
    editorial: {
      a: {"itsm-depth":7,"observability-depth":7,"source-control-depth":7,"hosting-panel-depth":7,"web-data-depth":7,"security-admin":7,"integrations":9},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
    },
    factual: {
      startingPricing: "Published starting floors: Bitbucket Cloud ~$3.65 vs GitHub ~$4 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster source control / DevOps peer comparison. Choose Bitbucket Cloud when cheap Atlassian-native git + Pipelines is the job — not GitHub’s ecosystem and not GitLab DevSecOps. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Overall: Bitbucket Cloud 7.6 vs GitHub 9.1. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "bitbucket",
        scenarios: [
          "Jira Cloud teams that want cheap git + Pipelines",
          "Small orgs that fit in Free (≤5 users)",
          "Premium buyers who need IP allowlisting",
        ],
      },
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "cpanel",
    b: "plesk",
    title: "cPanel vs Plesk",
    labels: { a: "cPanel", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":8,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":7,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: cPanel ~$29.99 vs Plesk ~$16.99 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster hosting panel peer comparison. Choose cPanel when Linux hosting-account administration is the job — not Plesk-by-default without checking Windows needs, and not a DevOps platform. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: cPanel 7.3 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "cpanel",
        scenarios: [
          "Web hosts and agencies administering many accounts on a VPS",
          "Operators who need the cPanel ecosystem (installers, WHM)",
          "Premier buyers on dedicated/metal",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),

  // AI Priority-3 comparisons (2026-08-18)
  approvedAiPair({
    a: "synthesia",
    b: "runway",
    title: "Synthesia vs Runway",
    labels: { a: "Synthesia", b: "Runway" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":7,"usage-model":7},
      b: {"llm-chat-depth":9,"writing-depth":9,"voice-depth":9,"agent-depth":8,"governance":6,"integrations":6,"usage-model":7},
    },
    factual: {
      startingPricing: "Published starting floors: Synthesia ~$18 vs Runway ~$12 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Synthesia is avatar/training video; Runway is generative video clips — different video jobs. Choose Synthesia when avatar / training video is the job — not Runway generative clips and not ChatGPT. Choose Runway when generative video clips are the job — not Midjourney stills and not an LLM chat. Overall: Synthesia 8 vs Runway 7.7. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "synthesia",
        scenarios: [
          "L&D and enablement teams producing talking-head explainers",
          "Internal comms that need on-brand avatars without a film crew",
          "Creator/Enterprise buyers who need API, SSO, or SCORM",
        ],
      },
      {
        productSlug: "runway",
        scenarios: [
          "Creators and agencies generating short AI video clips",
          "Teams that can budget credits rather than unlimited renders",
          "Pro buyers who need commercial rights",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "fireflies",
    b: "otter-ai",
    title: "Fireflies.ai vs Otter.ai",
    labels: { a: "Fireflies.ai", b: "Otter.ai" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":7,"integrations":8,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: Fireflies.ai ~$10 vs Otter.ai ~$8.33 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Both are AI meeting notes / conversation intelligence peers. Choose Fireflies.ai when AI meeting notes and conversation intelligence are the job — not a general LLM or Teams-recap add-on alone. Choose Otter.ai when AI meeting notes and auto-join transcription are the job — not a general LLM or voice studio. Overall: Fireflies.ai 8.2 vs Otter.ai 8. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "fireflies",
        scenarios: [
          "Teams that want auto-join transcripts across Zoom/Meet/Teams",
          "RevOps/CS leads who will actually use Business conversation intelligence",
          "Enterprises that need HIPAA/SSO meeting capture",
        ],
      },
      {
        productSlug: "otter-ai",
        scenarios: [
          "Individuals drowning in meeting notes",
          "Sales and CS teams that want auto-join transcripts",
          "SMBs that need Business admin without an enterprise RFP",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "fireflies",
    b: "microsoft-copilot",
    title: "Fireflies.ai vs Microsoft 365 Copilot",
    labels: { a: "Fireflies.ai", b: "Microsoft 365 Copilot" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":9,"usage-model":8},
      b: {"llm-chat-depth":8,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":9,"integrations":10,"usage-model":6},
    },
    factual: {
      startingPricing: "Published starting floors: Fireflies.ai ~$10 vs Microsoft 365 Copilot ~$21 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Fireflies.ai is meeting notes/CI; Microsoft 365 Copilot is a workspace LLM add-on — different primary jobs. Choose Fireflies.ai when AI meeting notes and conversation intelligence are the job — not a general LLM or Teams-recap add-on alone. Choose Microsoft 365 Copilot when the primary job is an LLM assistant inside Microsoft 365 — not a standalone chat tab and not GitHub Copilot. Overall: Fireflies.ai 8.2 vs Microsoft 365 Copilot 8.2. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "fireflies",
        scenarios: [
          "Teams that want auto-join transcripts across Zoom/Meet/Teams",
          "RevOps/CS leads who will actually use Business conversation intelligence",
          "Enterprises that need HIPAA/SSO meeting capture",
        ],
      },
      {
        productSlug: "microsoft-copilot",
        scenarios: [
          "Microsoft 365 shops that want AI inside Word, Excel, Outlook, and Teams",
          "IT buyers who need tenant admin and Graph grounding",
          "Enterprises already paying for E3/E5 who can absorb the $30 add-on",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "midjourney",
    b: "synthesia",
    title: "Midjourney vs Synthesia",
    labels: { a: "Midjourney", b: "Synthesia" },
    editorial: {
      a: {"llm-chat-depth":10,"writing-depth":10,"voice-depth":10,"agent-depth":8,"governance":6,"integrations":6,"usage-model":8},
      b: {"llm-chat-depth":9,"writing-depth":8,"voice-depth":8,"agent-depth":8,"governance":8,"integrations":7,"usage-model":7},
    },
    factual: {
      startingPricing: "Published starting floors: Midjourney ~$10 vs Synthesia ~$18 — confirm live packaging.",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Midjourney is AI stills; Synthesia is avatar/training video — different creative jobs. Choose Midjourney when distinctive AI stills (and optional video) are the job — not Firefly-in-Photoshop and not ChatGPT images. Choose Synthesia when avatar / training video is the job — not Runway generative clips and not ChatGPT. Overall: Midjourney 8.3 vs Synthesia 8. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "midjourney",
        scenarios: [
          "Creative teams that want distinctive stills",
          "Studios that can live with GPU-hour packs and Discord/web",
          "Pro/Mega buyers who need Stealth or high-volume Fast time",
        ],
      },
      {
        productSlug: "synthesia",
        scenarios: [
          "L&D and enablement teams producing talking-head explainers",
          "Internal comms that need on-brand avatars without a film crew",
          "Creator/Enterprise buyers who need API, SSO, or SCORM",
        ],
      },
    ],
  }),

  // IT Priority-3 comparisons (2026-08-18)
  approvedItPair({
    a: "dynatrace",
    b: "datadog",
    title: "Dynatrace vs Datadog",
    labels: { a: "Dynatrace", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Dynatrace ~$58 vs Datadog ~$15 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Dynatrace when enterprise full-stack observability with a DPS commit is the job — not Datadog host modules by default, and not PagerDuty. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Dynatrace 8.2 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "dynatrace",
        scenarios: [
          "Enterprises that will sign a DPS commit and deploy OneAgent broadly",
          "SRE teams that want full-stack APM plus Davis AI in one platform",
          "Buyers who already rejected per-host Datadog module math",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "dynatrace",
    b: "new-relic",
    title: "Dynatrace vs New Relic",
    labels: { a: "Dynatrace", b: "New Relic" },
    editorial: {
      a: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Dynatrace ~$58 vs New Relic ~$10 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Dynatrace when enterprise full-stack observability with a DPS commit is the job — not Datadog host modules by default, and not PagerDuty. Choose New Relic when unified observability billed on ingest + users is the job — not Datadog host packs and not ITSM. Overall: Dynatrace 8.2 vs New Relic 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "dynatrace",
        scenarios: [
          "Enterprises that will sign a DPS commit and deploy OneAgent broadly",
          "SRE teams that want full-stack APM plus Davis AI in one platform",
          "Buyers who already rejected per-host Datadog module math",
        ],
      },
      {
        productSlug: "new-relic",
        scenarios: [
          "Teams that want APM + logs + infra in one ingest bill",
          "Orgs that can live with 1–5 Standard full users",
          "Buyers comparing usage-based observability to Datadog hosts",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "azure-devops",
    b: "github",
    title: "Azure DevOps vs GitHub",
    labels: { a: "Azure DevOps", b: "GitHub" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
    },
    factual: {
      startingPricing: "Published starting floors: Azure DevOps ~$6 vs GitHub ~$4 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster source control / DevOps peer comparison. Choose Azure DevOps when Azure-native Boards/Repos/Pipelines are the job — not GitHub by default, and not GitHub Copilot. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Overall: Azure DevOps 8.2 vs GitHub 9.1. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "azure-devops",
        scenarios: [
          "Microsoft/Azure-native engineering orgs",
          "Teams that want Boards + Repos + Pipelines without GitHub",
          "QA groups that will actually buy Test Plans seats",
        ],
      },
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "azure-devops",
    b: "gitlab",
    title: "Azure DevOps vs GitLab",
    labels: { a: "Azure DevOps", b: "GitLab" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Azure DevOps ~$6 vs GitLab ~$29 — confirm live packaging.",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster source control / DevOps peer comparison. Choose Azure DevOps when Azure-native Boards/Repos/Pipelines are the job — not GitHub by default, and not GitHub Copilot. Choose GitLab when a DevSecOps platform (git + CI + security) is the job — not GitHub Copilot and not Bitbucket-as-cheap-git. Overall: Azure DevOps 8.2 vs GitLab 8.3. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "azure-devops",
        scenarios: [
          "Microsoft/Azure-native engineering orgs",
          "Teams that want Boards + Repos + Pipelines without GitHub",
          "QA groups that will actually buy Test Plans seats",
        ],
      },
      {
        productSlug: "gitlab",
        scenarios: [
          "Teams that want git + CI + security in one licence",
          "Self-managed / data-residency buyers",
          "Orgs leaving a many-tool DevOps stack",
        ],
      },
    ],
  }),

  // IT web-data peers comparisons (2026-08-18)
  approvedItPair({
    a: "oxylabs",
    b: "bright-data",
    title: "Oxylabs vs Bright Data",
    labels: { a: "Oxylabs", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Oxylabs ~$30 vs Bright Data ~$499 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Oxylabs when enterprise proxy / scraper-API infrastructure with published self-serve floors is the job — not Bright Data by default, and not Plesk. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: Oxylabs 7.7 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "oxylabs",
        scenarios: [
          "Data teams that need enterprise residential/datacenter proxies with published self-serve floors",
          "Buyers who want Web Scraper API and proxy lines from one vendor",
          "Projects that need ISO 27001-certified collection infrastructure",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "scraperapi",
    b: "bright-data",
    title: "ScraperAPI vs Bright Data",
    labels: { a: "ScraperAPI", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: ScraperAPI ~$49 vs Bright Data ~$499 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose ScraperAPI when a managed scraping API with credit tiers is the job — not raw proxy GB packs by default. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: ScraperAPI 7.3 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "scraperapi",
        scenarios: [
          "Developers who want a managed scrape API without operating proxy pools",
          "Teams that need a free/trial path before commit",
          "Moderate-volume production scraping with published credit tiers",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "apify",
    b: "bright-data",
    title: "Apify vs Bright Data",
    labels: { a: "Apify", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Apify ~$29 vs Bright Data ~$499 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Apify when Actor-based scraping and automation is the job — not Bright Data proxy GB by default. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: Apify 7.5 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "apify",
        scenarios: [
          "Teams that want ready-made or custom Actors rather than raw proxy ops",
          "Developers who need compute + storage + proxy in one platform",
          "Projects that benefit from Apify Store scrapers",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "thordata",
    b: "bright-data",
    title: "ThorData vs Bright Data",
    labels: { a: "ThorData", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":6},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: ThorData ~$2 vs Bright Data ~$499 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose ThorData when a budget published proxy/scraper pack is the job — not Bright Data enterprise commits by default. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: ThorData 6.8 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "thordata",
        scenarios: [
          "Teams that need a low published GB entry for proxy experiments",
          "Buyers comparing budget residential packs against Bright Data commits",
          "Projects that will validate quality before scaling volume",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "oxylabs",
    b: "scraperapi",
    title: "Oxylabs vs ScraperAPI",
    labels: { a: "Oxylabs", b: "ScraperAPI" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Oxylabs ~$30 vs ScraperAPI ~$49 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Oxylabs when enterprise proxy / scraper-API infrastructure with published self-serve floors is the job — not Bright Data by default, and not Plesk. Choose ScraperAPI when a managed scraping API with credit tiers is the job — not raw proxy GB packs by default. Overall: Oxylabs 7.7 vs ScraperAPI 7.3. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "oxylabs",
        scenarios: [
          "Data teams that need enterprise residential/datacenter proxies with published self-serve floors",
          "Buyers who want Web Scraper API and proxy lines from one vendor",
          "Projects that need ISO 27001-certified collection infrastructure",
        ],
      },
      {
        productSlug: "scraperapi",
        scenarios: [
          "Developers who want a managed scrape API without operating proxy pools",
          "Teams that need a free/trial path before commit",
          "Moderate-volume production scraping with published credit tiers",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "apify",
    b: "oxylabs",
    title: "Apify vs Oxylabs",
    labels: { a: "Apify", b: "Oxylabs" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Apify ~$29 vs Oxylabs ~$30 — confirm live packaging (GB/credits/usage units differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Apify when Actor-based scraping and automation is the job — not Bright Data proxy GB by default. Choose Oxylabs when enterprise proxy / scraper-API infrastructure with published self-serve floors is the job — not Bright Data by default, and not Plesk. Overall: Apify 7.5 vs Oxylabs 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "apify",
        scenarios: [
          "Teams that want ready-made or custom Actors rather than raw proxy ops",
          "Developers who need compute + storage + proxy in one platform",
          "Projects that benefit from Apify Store scrapers",
        ],
      },
      {
        productSlug: "oxylabs",
        scenarios: [
          "Data teams that need enterprise residential/datacenter proxies with published self-serve floors",
          "Buyers who want Web Scraper API and proxy lines from one vendor",
          "Projects that need ISO 27001-certified collection infrastructure",
        ],
      },
    ],
  }),

  // IT hosting providers comparisons (2026-08-18)
  approvedItPair({
    a: "wp-engine",
    b: "cloudways",
    title: "WP Engine vs Cloudways",
    labels: { a: "WP Engine", b: "Cloudways" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: WP Engine ~$30 vs Cloudways ~$11 — confirm live packaging (managed hosting vs panel licences differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose WP Engine when managed WordPress-specialist hosting is the job — not Cloudways multi-cloud/multi-app by default, and not a Plesk/cPanel panel licence. Choose Cloudways when managed multi-cloud hosting is the job — not a Plesk/cPanel panel licence, and not WP Engine’s WordPress-only specialist path by default. Overall: WP Engine 7.7 vs Cloudways 7.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "wp-engine",
        scenarios: [
          "Teams whose only hosting job is managed WordPress",
          "Buyers who will pay for WP Engine specialist support and WP workflow",
          "Organisations that will land on Core or Enterprise, not only the first-year Startup tile",
        ],
      },
      {
        productSlug: "cloudways",
        scenarios: [
          "Teams that want managed hosting on a chosen cloud VM without buying a panel licence",
          "Agencies running WordPress plus other apps on one Cloudways account",
          "Buyers who will actually use hourly Flexible billing and the $11 DigitalOcean Standard floor",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "cloudways",
    b: "plesk",
    title: "Cloudways vs Plesk",
    labels: { a: "Cloudways", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: Cloudways ~$11 vs Plesk ~$16.99 — confirm live packaging (managed hosting vs panel licences differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (managed hosting vs hosting panel) — not undifferentiated peers. Choose Cloudways when managed multi-cloud hosting is the job — not a Plesk/cPanel panel licence, and not WP Engine’s WordPress-only specialist path by default. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: Cloudways 7.6 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "cloudways",
        scenarios: [
          "Teams that want managed hosting on a chosen cloud VM without buying a panel licence",
          "Agencies running WordPress plus other apps on one Cloudways account",
          "Buyers who will actually use hourly Flexible billing and the $11 DigitalOcean Standard floor",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "wp-engine",
    b: "plesk",
    title: "WP Engine vs Plesk",
    labels: { a: "WP Engine", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: WP Engine ~$30 vs Plesk ~$16.99 — confirm live packaging (managed hosting vs panel licences differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (managed WordPress hosting vs hosting panel) — not undifferentiated peers. Choose WP Engine when managed WordPress-specialist hosting is the job — not Cloudways multi-cloud/multi-app by default, and not a Plesk/cPanel panel licence. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: WP Engine 7.7 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "wp-engine",
        scenarios: [
          "Teams whose only hosting job is managed WordPress",
          "Buyers who will pay for WP Engine specialist support and WP workflow",
          "Organisations that will land on Core or Enterprise, not only the first-year Startup tile",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),

  // AI automation overlay comparisons (2026-08-18)
  approvedAiPair({
    a: "zapier",
    b: "n8n",
    title: "Zapier vs n8n",
    labels: { a: "Zapier", b: "n8n" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":7,"integrations":10,"usage-model":7},
      b: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":9,"governance":8,"integrations":8,"usage-model":9},
    },
    factual: {
      startingPricing: "Published starting floors: Zapier ~$19.99 vs n8n ~$20 — confirm live packaging (task/execution units and currency differ).",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Both are workflow automation platforms — Zapier leans no-code SaaS tasks; n8n leans self-host / EUR Cloud executions. Choose Zapier when no-code app automation with AI steps is the job — not ChatGPT as an LLM, and not MindStudio as an agent studio by default. Choose n8n when self-host or EUR Cloud workflow automation is the job — not Zapier by default, and not ChatGPT or MindStudio as the primary product. Overall: Zapier 8.1 vs n8n 8. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "zapier",
        scenarios: [
          "Ops teams that need the widest SaaS connector catalogue with AI steps",
          "Buyers who want a Free 100-task sandbox then Pro at $19.99 annual",
          "Teams that will treat Agents as an add-on, not as the reason to skip n8n",
        ],
      },
      {
        productSlug: "n8n",
        scenarios: [
          "Teams that want Community self-host or EUR Cloud execution volume",
          "Builders comfortable with a node graph instead of Zapier’s editor",
          "Buyers who need automation overlay, not ChatGPT as the home screen",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "zapier",
    b: "mindstudio",
    title: "Zapier vs MindStudio",
    labels: { a: "Zapier", b: "MindStudio" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":7,"integrations":10,"usage-model":7},
      b: {"llm-chat-depth":8,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":6,"integrations":7,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: Zapier ~$19.99 vs MindStudio ~$16 — confirm live packaging (task/execution units and currency differ).",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "Zapier is app automation; MindStudio is AI agent building — adjacent automation jobs, not undifferentiated peers. Choose Zapier when no-code app automation with AI steps is the job — not ChatGPT as an LLM, and not MindStudio as an agent studio by default. Choose MindStudio when building repeatable AI agents and mini-apps is the job — not when you only need conversational LLM chat. Overall: Zapier 8.1 vs MindStudio 7.3. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "zapier",
        scenarios: [
          "Ops teams that need the widest SaaS connector catalogue with AI steps",
          "Buyers who want a Free 100-task sandbox then Pro at $19.99 annual",
          "Teams that will treat Agents as an add-on, not as the reason to skip n8n",
        ],
      },
      {
        productSlug: "mindstudio",
        scenarios: [
          "Ops and marketing teams building repeatable AI agents without developers",
          "Founders automating workflows with visual builder logic",
          "Buyers who need published agent apps, not just chat",
        ],
      },
    ],
  }),
  approvedAiPair({
    a: "n8n",
    b: "mindstudio",
    title: "n8n vs MindStudio",
    labels: { a: "n8n", b: "MindStudio" },
    editorial: {
      a: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":9,"governance":8,"integrations":8,"usage-model":9},
      b: {"llm-chat-depth":8,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":6,"integrations":7,"usage-model":8},
    },
    factual: {
      startingPricing: "Published starting floors: n8n ~$20 vs MindStudio ~$16 — confirm live packaging (task/execution units and currency differ).",
      freePlan: "Both publish free or trial paths with usage/credit caps — confirm what each free tier actually unlocks for your workload.",
      userMinimum: "Confirm seat floors, credit packs, task/execution units, and whether AI features sit in higher tiers before purchase.",
    },
    verdict:
      "n8n is workflow automation; MindStudio is AI agent building — adjacent jobs, not the same cluster. Choose n8n when self-host or EUR Cloud workflow automation is the job — not Zapier by default, and not ChatGPT or MindStudio as the primary product. Choose MindStudio when building repeatable AI agents and mini-apps is the job — not when you only need conversational LLM chat. Overall: n8n 8 vs MindStudio 7.3. Not hands-on lab tested; confirm live pricing and usage caps.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — usage, seats, and credits change TCO.",
    bestFor: [
      {
        productSlug: "n8n",
        scenarios: [
          "Teams that want Community self-host or EUR Cloud execution volume",
          "Builders comfortable with a node graph instead of Zapier’s editor",
          "Buyers who need automation overlay, not ChatGPT as the home screen",
        ],
      },
      {
        productSlug: "mindstudio",
        scenarios: [
          "Ops and marketing teams building repeatable AI agents without developers",
          "Founders automating workflows with visual builder logic",
          "Buyers who need published agent apps, not just chat",
        ],
      },
    ],
  }),

  // IT industry Tier-A comparisons (2026-08-18)
  approvedItPair({
    a: "splunk",
    b: "datadog",
    title: "Splunk Observability Cloud vs Datadog",
    labels: { a: "Splunk Observability Cloud", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Splunk Observability Cloud ~$15 vs Datadog ~$15 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Splunk Observability Cloud when Cisco/Splunk host-priced observability is the job — not Splunk Platform SIEM ingest, and not Datadog by default. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Splunk Observability Cloud 7.8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "splunk",
        scenarios: [
          "SRE teams that want Splunk Observability Cloud host packs rather than Platform ingest",
          "Cisco/Splunk-aligned estates that need metrics and APM in one Cloud SKU",
          "Buyers who will model $15 vs $60 vs $75 host packs before commit",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "elastic-observability",
    b: "grafana-cloud",
    title: "Elastic Observability vs Grafana Cloud",
    labels: { a: "Elastic Observability", b: "Grafana Cloud" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Elastic Observability ~$99 vs Grafana Cloud ~$19 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Elastic Observability when Elastic Cloud telemetry (not search-only Elasticsearch) is the job — not Datadog host modules by default. Choose Grafana Cloud when managed Grafana/LGTM telemetry is the job — not Datadog host modules and not ITSM. Overall: Elastic Observability 7.6 vs Grafana Cloud 7.5. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "elastic-observability",
        scenarios: [
          "Teams already on Elasticsearch who want Observability as the Cloud solution",
          "Buyers comparing Grafana Cloud OSS-aligned stacks to Elastic Cloud",
          "Orgs that will actually size the $99 hosted config versus serverless ingest",
        ],
      },
      {
        productSlug: "grafana-cloud",
        scenarios: [
          "Teams already fluent in Grafana/Prometheus",
          "Startups that fit in the Free telemetry caps",
          "Platform teams that want Mimir/Loki without operating it",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "sentry",
    b: "datadog",
    title: "Sentry vs Datadog",
    labels: { a: "Sentry", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Sentry ~$26 vs Datadog ~$15 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose Sentry when application error monitoring, tracing, and replays are the job — not Datadog infrastructure monitoring by default. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Sentry 8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "sentry",
        scenarios: [
          "Application teams whose primary observability job is errors, traces, and replays",
          "Developers who want a free 5k-error path before Team $26",
          "Buyers comparing a specialist to Datadog/Splunk host suites",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "incident-io",
    b: "pagerduty",
    title: "incident.io vs PagerDuty",
    labels: { a: "incident.io", b: "PagerDuty" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: incident.io ~$15 vs PagerDuty ~$21 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster incident / on-call peer comparison. Choose incident.io when incident command is the job and you want a published $15 Team floor — not PagerDuty by default, and not Datadog/Sentry. Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM. Overall: incident.io 7.8 vs PagerDuty 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "incident-io",
        scenarios: [
          "Teams that want incident command in Slack more than a paging-first ops cloud",
          "Buyers who will add on-call only if needed",
          "Product-led incident response versus PagerDuty Professional seats",
        ],
      },
      {
        productSlug: "pagerduty",
        scenarios: [
          "SRE/IT teams that need on-call schedules and paging",
          "Orgs already sending alerts from Datadog/CloudWatch",
          "Incident commanders who want a dedicated ops cloud",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "circleci",
    b: "github",
    title: "CircleCI vs GitHub",
    labels: { a: "CircleCI", b: "GitHub" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
    },
    factual: {
      startingPricing: "Published starting floors: CircleCI ~$15 vs GitHub ~$4 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose CircleCI when specialist CI/CD is the job — not GitHub the SCM by default, even though both sit in source-control-devops. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Overall: CircleCI 7.5 vs GitHub 9.1. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "circleci",
        scenarios: [
          "Teams that want specialist CI/CD against an existing GitHub/GitLab/Bitbucket remote",
          "Buyers comparing CircleCI Performance $15 to GitHub Actions minutes",
          "Orgs that do not want to move source control in order to buy CI",
        ],
      },
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "directadmin",
    b: "plesk",
    title: "DirectAdmin vs Plesk",
    labels: { a: "DirectAdmin", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":6},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: DirectAdmin ~$5 vs Plesk ~$16.99 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster hosting panel peer comparison. Choose DirectAdmin when a low published panel licence is the job — not Plesk by default, and not Kinsta managed hosting. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: DirectAdmin 6.8 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "directadmin",
        scenarios: [
          "Admins who want a cheap panel licence on VPS/dedicated they already run",
          "Buyers comparing Personal Plus $5 to Plesk Web Admin or cPanel Solo",
          "Hosts that need Standard unlimited accounts/domains at $29",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "kinsta",
    b: "wp-engine",
    title: "Kinsta vs WP Engine",
    labels: { a: "Kinsta", b: "WP Engine" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: Kinsta ~$35 vs WP Engine ~$30 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster managed WordPress hosting peer comparison. Choose Kinsta when managed WordPress hosting is the job — not a Plesk/DirectAdmin panel licence, and not WP Engine by default. Choose WP Engine when managed WordPress-specialist hosting is the job — not Cloudways multi-cloud/multi-app by default, and not a Plesk/cPanel panel licence. Overall: Kinsta 7.6 vs WP Engine 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "kinsta",
        scenarios: [
          "Teams that want managed WordPress hosting without a panel licence",
          "Buyers comparing Kinsta $35 Single to WP Engine Essential and Cloudways Flexible",
          "Orgs that will treat $35 as ongoing TCO, not a promo month",
        ],
      },
      {
        productSlug: "wp-engine",
        scenarios: [
          "Teams whose only hosting job is managed WordPress",
          "Buyers who will pay for WP Engine specialist support and WP workflow",
          "Organisations that will land on Core or Enterprise, not only the first-year Startup tile",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "smartproxy",
    b: "bright-data",
    title: "Decodo (Smartproxy) vs Bright Data",
    labels: { a: "Decodo (Smartproxy)", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Decodo (Smartproxy) ~$11.25 vs Bright Data ~$499 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Decodo (Smartproxy) when a self-serve residential proxy starter is the job — not Bright Data enterprise commits by default. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: Decodo (Smartproxy) 6.9 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "smartproxy",
        scenarios: [
          "Teams that knew Smartproxy and need the Decodo-branded same network",
          "Buyers who want a published $11.25 residential starter versus Bright Data commits",
          "Projects that will validate a 3-day trial before GB scale",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "splunk",
    b: "elastic-observability",
    title: "Splunk Observability Cloud vs Elastic Observability",
    labels: { a: "Splunk Observability Cloud", b: "Elastic Observability" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Splunk Observability Cloud ~$15 vs Elastic Observability ~$99 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Splunk Observability Cloud when Cisco/Splunk host-priced observability is the job — not Splunk Platform SIEM ingest, and not Datadog by default. Choose Elastic Observability when Elastic Cloud telemetry (not search-only Elasticsearch) is the job — not Datadog host modules by default. Overall: Splunk Observability Cloud 7.8 vs Elastic Observability 7.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "splunk",
        scenarios: [
          "SRE teams that want Splunk Observability Cloud host packs rather than Platform ingest",
          "Cisco/Splunk-aligned estates that need metrics and APM in one Cloud SKU",
          "Buyers who will model $15 vs $60 vs $75 host packs before commit",
        ],
      },
      {
        productSlug: "elastic-observability",
        scenarios: [
          "Teams already on Elasticsearch who want Observability as the Cloud solution",
          "Buyers comparing Grafana Cloud OSS-aligned stacks to Elastic Cloud",
          "Orgs that will actually size the $99 hosted config versus serverless ingest",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "sentry",
    b: "splunk",
    title: "Sentry vs Splunk Observability Cloud",
    labels: { a: "Sentry", b: "Splunk Observability Cloud" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Sentry ~$26 vs Splunk Observability Cloud ~$15 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose Sentry when application error monitoring, tracing, and replays are the job — not Datadog infrastructure monitoring by default. Choose Splunk Observability Cloud when Cisco/Splunk host-priced observability is the job — not Splunk Platform SIEM ingest, and not Datadog by default. Overall: Sentry 8 vs Splunk Observability Cloud 7.8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "sentry",
        scenarios: [
          "Application teams whose primary observability job is errors, traces, and replays",
          "Developers who want a free 5k-error path before Team $26",
          "Buyers comparing a specialist to Datadog/Splunk host suites",
        ],
      },
      {
        productSlug: "splunk",
        scenarios: [
          "SRE teams that want Splunk Observability Cloud host packs rather than Platform ingest",
          "Cisco/Splunk-aligned estates that need metrics and APM in one Cloud SKU",
          "Buyers who will model $15 vs $60 vs $75 host packs before commit",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "kinsta",
    b: "plesk",
    title: "Kinsta vs Plesk",
    labels: { a: "Kinsta", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: Kinsta ~$35 vs Plesk ~$16.99 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (managed WordPress hosting vs hosting panel) — not undifferentiated peers. Choose Kinsta when managed WordPress hosting is the job — not a Plesk/DirectAdmin panel licence, and not WP Engine by default. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: Kinsta 7.6 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "kinsta",
        scenarios: [
          "Teams that want managed WordPress hosting without a panel licence",
          "Buyers comparing Kinsta $35 Single to WP Engine Essential and Cloudways Flexible",
          "Orgs that will treat $35 as ongoing TCO, not a promo month",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "sentry",
    b: "pagerduty",
    title: "Sentry vs PagerDuty",
    labels: { a: "Sentry", b: "PagerDuty" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Sentry ~$26 vs PagerDuty ~$21 — confirm live packaging (host, seat, GB, CI-minute, and panel vs managed-host math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Landscape comparison — error monitoring / observability-adjacent vs incident / on-call; not undifferentiated peers. Choose Sentry when application error monitoring, tracing, and replays are the job — not Datadog infrastructure monitoring by default. Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM. Overall: Sentry 8 vs PagerDuty 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "sentry",
        scenarios: [
          "Application teams whose primary observability job is errors, traces, and replays",
          "Developers who want a free 5k-error path before Team $26",
          "Buyers comparing a specialist to Datadog/Splunk host suites",
        ],
      },
      {
        productSlug: "pagerduty",
        scenarios: [
          "SRE/IT teams that need on-call schedules and paging",
          "Orgs already sending alerts from Datadog/CloudWatch",
          "Incident commanders who want a dedicated ops cloud",
        ],
      },
    ],
  }),

  // IT Tier-B + ITSM SMB comparisons (2026-08-18)
  approvedItPair({
    a: "manageengine-servicedesk-plus",
    b: "freshservice",
    title: "ManageEngine ServiceDesk Plus vs Freshservice",
    labels: { a: "ManageEngine ServiceDesk Plus", b: "Freshservice" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: ManageEngine ServiceDesk Plus ~$13 vs Freshservice ~$19 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose ManageEngine ServiceDesk Plus when published SMB/mid-market ITSM is the job — not ServiceNow by default, and not Freshservice by default. Choose Freshservice when ITSM and internal employee service desk is the primary job — not customer ecommerce helpdesk or website live chat. Overall: ManageEngine ServiceDesk Plus 7.8 vs Freshservice 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "manageengine-servicedesk-plus",
        scenarios: [
          "SMB/mid-market IT teams that want a published $13/technician ITSM SKU",
          "Zoho/ManageEngine-aligned shops that need incidents, changes, and assets without a ServiceNow RFP",
          "Buyers who will actually use the 5-tech free Standard path before paid Cloud",
        ],
      },
      {
        productSlug: "freshservice",
        scenarios: [
          "IT teams needing ITIL-style incidents, changes, and asset management",
          "Employee service desk and internal support portals",
          "Freshworks customers wanting ITSM separate from Freshdesk",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "sysaid",
    b: "freshservice",
    title: "SysAid vs Freshservice",
    labels: { a: "SysAid", b: "Freshservice" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: SysAid ~$89 vs Freshservice ~$19 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose SysAid when a quoted ITSM desk with automation/AI assist is the job — not Freshservice’s published Starter by default, and not ServiceNow. Choose Freshservice when ITSM and internal employee service desk is the primary job — not customer ecommerce helpdesk or website live chat. Overall: SysAid 7.7 vs Freshservice 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "sysaid",
        scenarios: [
          "Mid-market IT desks comparing SysAid automation to Freshservice Growth/Pro",
          "Buyers who will run a trial and get a live quote rather than trust $89 listings",
          "Teams that need 20+ agents and will talk Enterprise anyway",
        ],
      },
      {
        productSlug: "freshservice",
        scenarios: [
          "IT teams needing ITIL-style incidents, changes, and asset management",
          "Employee service desk and internal support portals",
          "Freshworks customers wanting ITSM separate from Freshdesk",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "haloitsm",
    b: "manageengine-servicedesk-plus",
    title: "HaloITSM vs ManageEngine ServiceDesk Plus",
    labels: { a: "HaloITSM", b: "ManageEngine ServiceDesk Plus" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: HaloITSM ~$66 vs ManageEngine ServiceDesk Plus ~$13 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose HaloITSM when all-in-one per-agent ITSM with a published UK calculator is the job — not ServiceNow by default, and not Freshservice by default. Choose ManageEngine ServiceDesk Plus when published SMB/mid-market ITSM is the job — not ServiceNow by default, and not Freshservice by default. Overall: HaloITSM 7.9 vs ManageEngine ServiceDesk Plus 7.8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "haloitsm",
        scenarios: [
          "IT teams that want an all-in-one per-agent ITSM calculator rather than edition ladders",
          "UK/GBP buyers who will model £66 annual plus onboarding",
          "Desks comparing HaloITSM to SysAid quotes and ManageEngine $13 Standard",
        ],
      },
      {
        productSlug: "manageengine-servicedesk-plus",
        scenarios: [
          "SMB/mid-market IT teams that want a published $13/technician ITSM SKU",
          "Zoho/ManageEngine-aligned shops that need incidents, changes, and assets without a ServiceNow RFP",
          "Buyers who will actually use the 5-tech free Standard path before paid Cloud",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "sysaid",
    b: "haloitsm",
    title: "SysAid vs HaloITSM",
    labels: { a: "SysAid", b: "HaloITSM" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: SysAid ~$89 vs HaloITSM ~$66 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster ITSM / service desk peer comparison. Choose SysAid when a quoted ITSM desk with automation/AI assist is the job — not Freshservice’s published Starter by default, and not ServiceNow. Choose HaloITSM when all-in-one per-agent ITSM with a published UK calculator is the job — not ServiceNow by default, and not Freshservice by default. Overall: SysAid 7.7 vs HaloITSM 7.9. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "sysaid",
        scenarios: [
          "Mid-market IT desks comparing SysAid automation to Freshservice Growth/Pro",
          "Buyers who will run a trial and get a live quote rather than trust $89 listings",
          "Teams that need 20+ agents and will talk Enterprise anyway",
        ],
      },
      {
        productSlug: "haloitsm",
        scenarios: [
          "IT teams that want an all-in-one per-agent ITSM calculator rather than edition ladders",
          "UK/GBP buyers who will model £66 annual plus onboarding",
          "Desks comparing HaloITSM to SysAid quotes and ManageEngine $13 Standard",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "appdynamics",
    b: "datadog",
    title: "AppDynamics vs Datadog",
    labels: { a: "AppDynamics", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: AppDynamics ~$33 vs Datadog ~$15 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose AppDynamics when Cisco vCPU-priced APM (Premium $33, not $6 infra) is the job — not Datadog host modules by default. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: AppDynamics 7.9 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "appdynamics",
        scenarios: [
          "Cisco-aligned estates that will model vCPU Premium $33 (not $6 infra-only) as APM TCO",
          "APM buyers comparing AppDynamics to Dynatrace DPS and Datadog modules",
          "Teams already in a Cisco EA who will not self-serve Datadog tiles",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "honeycomb",
    b: "datadog",
    title: "Honeycomb vs Datadog",
    labels: { a: "Honeycomb", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Honeycomb ~$150 vs Datadog ~$15 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose Honeycomb when high-cardinality event/trace debugging is the job — not Datadog infrastructure monitoring by default, and not PagerDuty. Choose Datadog when observability — infrastructure, APM, and logs — is the primary job and you can model module/consumption TCO. Overall: Honeycomb 7.8 vs Datadog 8.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "honeycomb",
        scenarios: [
          "Teams whose observability job is high-cardinality events and traces",
          "OpenTelemetry-first debugging vs host/infra suites",
          "Buyers who will start on Free before Pro $150",
        ],
      },
      {
        productSlug: "datadog",
        scenarios: [
          "SRE/platform teams needing unified infra + APM + logs",
          "Cloud-native orgs with AWS/Azure/GCP estates",
          "Teams that can model multi-module observability TCO upfront",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "appdynamics",
    b: "dynatrace",
    title: "AppDynamics vs Dynatrace",
    labels: { a: "AppDynamics", b: "Dynatrace" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: AppDynamics ~$33 vs Dynatrace ~$58 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster observability peer comparison. Choose AppDynamics when Cisco vCPU-priced APM (Premium $33, not $6 infra) is the job — not Datadog host modules by default. Choose Dynatrace when enterprise full-stack observability with a DPS commit is the job — not Datadog host modules by default, and not PagerDuty. Overall: AppDynamics 7.9 vs Dynatrace 8.2. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "appdynamics",
        scenarios: [
          "Cisco-aligned estates that will model vCPU Premium $33 (not $6 infra-only) as APM TCO",
          "APM buyers comparing AppDynamics to Dynatrace DPS and Datadog modules",
          "Teams already in a Cisco EA who will not self-serve Datadog tiles",
        ],
      },
      {
        productSlug: "dynatrace",
        scenarios: [
          "Enterprises that will sign a DPS commit and deploy OneAgent broadly",
          "SRE teams that want full-stack APM plus Davis AI in one platform",
          "Buyers who already rejected per-host Datadog module math",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "firehydrant",
    b: "pagerduty",
    title: "FireHydrant vs PagerDuty",
    labels: { a: "FireHydrant", b: "PagerDuty" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: FireHydrant ~$25 vs PagerDuty ~$21 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster incident / on-call peer comparison. Choose FireHydrant when incident command with a published $25 Pro floor is the job — not PagerDuty by default, and not Datadog/Honeycomb. Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM. Overall: FireHydrant 7.7 vs PagerDuty 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "firehydrant",
        scenarios: [
          "Teams that want incident command with a 10-responder free path",
          "Buyers comparing FireHydrant Pro $25 to Rootly $20 and incident.io Team $15",
          "Orgs that will keep PagerDuty for paging and add FireHydrant for command",
        ],
      },
      {
        productSlug: "pagerduty",
        scenarios: [
          "SRE/IT teams that need on-call schedules and paging",
          "Orgs already sending alerts from Datadog/CloudWatch",
          "Incident commanders who want a dedicated ops cloud",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "rootly",
    b: "incident-io",
    title: "Rootly vs incident.io",
    labels: { a: "Rootly", b: "incident.io" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Rootly ~$20 vs incident.io ~$15 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster incident / on-call peer comparison. Choose Rootly when Slack-native incident response at $20/user is the job — not PagerDuty by default, and not FireHydrant’s free-10 path by default. Choose incident.io when incident command is the job and you want a published $15 Team floor — not PagerDuty by default, and not Datadog/Sentry. Overall: Rootly 7.7 vs incident.io 7.8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "rootly",
        scenarios: [
          "Slack-first teams buying incident command at a published $20/user floor",
          "Buyers who will add On-Call Essentials only if they need paging",
          "Comparisons versus FireHydrant Pro $25 and incident.io Team $15",
        ],
      },
      {
        productSlug: "incident-io",
        scenarios: [
          "Teams that want incident command in Slack more than a paging-first ops cloud",
          "Buyers who will add on-call only if needed",
          "Product-led incident response versus PagerDuty Professional seats",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "firehydrant",
    b: "rootly",
    title: "FireHydrant vs Rootly",
    labels: { a: "FireHydrant", b: "Rootly" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: FireHydrant ~$25 vs Rootly ~$20 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster incident / on-call peer comparison. Choose FireHydrant when incident command with a published $25 Pro floor is the job — not PagerDuty by default, and not Datadog/Honeycomb. Choose Rootly when Slack-native incident response at $20/user is the job — not PagerDuty by default, and not FireHydrant’s free-10 path by default. Overall: FireHydrant 7.7 vs Rootly 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "firehydrant",
        scenarios: [
          "Teams that want incident command with a 10-responder free path",
          "Buyers comparing FireHydrant Pro $25 to Rootly $20 and incident.io Team $15",
          "Orgs that will keep PagerDuty for paging and add FireHydrant for command",
        ],
      },
      {
        productSlug: "rootly",
        scenarios: [
          "Slack-first teams buying incident command at a published $20/user floor",
          "Buyers who will add On-Call Essentials only if they need paging",
          "Comparisons versus FireHydrant Pro $25 and incident.io Team $15",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "buildkite",
    b: "circleci",
    title: "Buildkite vs CircleCI",
    labels: { a: "Buildkite", b: "CircleCI" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Buildkite ~$30 vs CircleCI ~$15 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster CI / build pipelines peer comparison. Choose Buildkite when hybrid CI/CD (self-hosted + hosted agents) is the job — not GitHub the SCM by default, even though both sit in source-control-devops. Choose CircleCI when specialist CI/CD is the job — not GitHub the SCM by default, even though both sit in source-control-devops. Overall: Buildkite 7.6 vs CircleCI 7.5. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "buildkite",
        scenarios: [
          "Teams that want specialist CI/CD with self-hosted agents against an existing git remote",
          "Buyers comparing Buildkite Pro $30 to CircleCI Performance $15 and GitHub Actions minutes",
          "Orgs that will not move source control in order to buy CI",
        ],
      },
      {
        productSlug: "circleci",
        scenarios: [
          "Teams that want specialist CI/CD against an existing GitHub/GitLab/Bitbucket remote",
          "Buyers comparing CircleCI Performance $15 to GitHub Actions minutes",
          "Orgs that do not want to move source control in order to buy CI",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "buildkite",
    b: "github",
    title: "Buildkite vs GitHub",
    labels: { a: "Buildkite", b: "GitHub" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":9,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":10},
    },
    factual: {
      startingPricing: "Published starting floors: Buildkite ~$30 vs GitHub ~$4 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose Buildkite when hybrid CI/CD (self-hosted + hosted agents) is the job — not GitHub the SCM by default, even though both sit in source-control-devops. Choose GitHub when source control and developer collaboration are the primary job — with Actions for CI/CD if needed. Overall: Buildkite 7.6 vs GitHub 9.1. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "buildkite",
        scenarios: [
          "Teams that want specialist CI/CD with self-hosted agents against an existing git remote",
          "Buyers comparing Buildkite Pro $30 to CircleCI Performance $15 and GitHub Actions minutes",
          "Orgs that will not move source control in order to buy CI",
        ],
      },
      {
        productSlug: "github",
        scenarios: [
          "Software teams needing Git source control as the system of record",
          "Organizations standardising on Actions for CI/CD alongside repos",
          "Enterprises needing audit/SSO governance on code",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "siteground",
    b: "wp-engine",
    title: "SiteGround vs WP Engine",
    labels: { a: "SiteGround", b: "WP Engine" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: SiteGround ~$17.99 vs WP Engine ~$30 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose SiteGround when managed WordPress on shared-plan packaging at a $17.99 ongoing floor is the job — not a Plesk panel licence, and not WP Engine by default. Choose WP Engine when managed WordPress-specialist hosting is the job — not Cloudways multi-cloud/multi-app by default, and not a Plesk/cPanel panel licence. Overall: SiteGround 7.3 vs WP Engine 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "siteground",
        scenarios: [
          "Teams that want managed WordPress hosting with a published $17.99 ongoing floor",
          "Buyers comparing SiteGround StartUp to WP Engine Essential and Kinsta Single",
          "Orgs that will treat $17.99 as renewal TCO, not the $2.99 promo month",
        ],
      },
      {
        productSlug: "wp-engine",
        scenarios: [
          "Teams whose only hosting job is managed WordPress",
          "Buyers who will pay for WP Engine specialist support and WP workflow",
          "Organisations that will land on Core or Enterprise, not only the first-year Startup tile",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "siteground",
    b: "kinsta",
    title: "SiteGround vs Kinsta",
    labels: { a: "SiteGround", b: "Kinsta" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: SiteGround ~$17.99 vs Kinsta ~$35 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Choose SiteGround when managed WordPress on shared-plan packaging at a $17.99 ongoing floor is the job — not a Plesk panel licence, and not WP Engine by default. Choose Kinsta when managed WordPress hosting is the job — not a Plesk/DirectAdmin panel licence, and not WP Engine by default. Overall: SiteGround 7.3 vs Kinsta 7.6. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "siteground",
        scenarios: [
          "Teams that want managed WordPress hosting with a published $17.99 ongoing floor",
          "Buyers comparing SiteGround StartUp to WP Engine Essential and Kinsta Single",
          "Orgs that will treat $17.99 as renewal TCO, not the $2.99 promo month",
        ],
      },
      {
        productSlug: "kinsta",
        scenarios: [
          "Teams that want managed WordPress hosting without a panel licence",
          "Buyers comparing Kinsta $35 Single to WP Engine Essential and Cloudways Flexible",
          "Orgs that will treat $35 as ongoing TCO, not a promo month",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "zyte",
    b: "bright-data",
    title: "Zyte vs Bright Data",
    labels: { a: "Zyte", b: "Bright Data" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Zyte ~$100 vs Bright Data ~$499 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Zyte when a managed scraping API with a $100 monthly commit is the job — not Bright Data enterprise proxy commits by default. Choose Bright Data when web data collection at scale — with proxy network reliability — is the primary job and budget supports GB/commitment pricing. Overall: Zyte 7.4 vs Bright Data 7.7. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "zyte",
        scenarios: [
          "Teams that knew Scrapinghub and need the Zyte API extraction path",
          "Buyers who want a published $100 monthly commit versus Bright Data ~$499",
          "Projects that will spend the $5 trial credit before scaling",
        ],
      },
      {
        productSlug: "bright-data",
        scenarios: [
          "Data engineering teams needing reliable residential/datacenter proxy networks",
          "Enterprises with budget for committed web-data infrastructure",
          "Projects with clear compliance review and acceptable-use alignment",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "iproyal",
    b: "smartproxy",
    title: "IPRoyal vs Decodo (Smartproxy)",
    labels: { a: "IPRoyal", b: "Decodo (Smartproxy)" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":6,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":6},
      b: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: IPRoyal ~$1.75 vs Decodo (Smartproxy) ~$11.25 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose IPRoyal when a published $1.75/GB residential floor is the job — not Bright Data enterprise commits by default. Choose Decodo (Smartproxy) when a self-serve residential proxy starter is the job — not Bright Data enterprise commits by default. Overall: IPRoyal 6.7 vs Decodo (Smartproxy) 6.9. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "iproyal",
        scenarios: [
          "Teams that need a low published residential GB floor",
          "Buyers comparing $1.75/GB to ThorData $2/GB and Decodo $3.75/GB starters",
          "Projects that will validate quality/compliance before production volume",
        ],
      },
      {
        productSlug: "smartproxy",
        scenarios: [
          "Teams that knew Smartproxy and need the Decodo-branded same network",
          "Buyers who want a published $11.25 residential starter versus Bright Data commits",
          "Projects that will validate a 3-day trial before GB scale",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "zyte",
    b: "scraperapi",
    title: "Zyte vs ScraperAPI",
    labels: { a: "Zyte", b: "ScraperAPI" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":6,"integrations":8},
    },
    factual: {
      startingPricing: "Published starting floors: Zyte ~$100 vs ScraperAPI ~$49 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Same-cluster web data / proxy collection peer comparison. Choose Zyte when a managed scraping API with a $100 monthly commit is the job — not Bright Data enterprise proxy commits by default. Choose ScraperAPI when a managed scraping API with credit tiers is the job — not raw proxy GB packs by default. Overall: Zyte 7.4 vs ScraperAPI 7.3. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "zyte",
        scenarios: [
          "Teams that knew Scrapinghub and need the Zyte API extraction path",
          "Buyers who want a published $100 monthly commit versus Bright Data ~$499",
          "Projects that will spend the $5 trial credit before scaling",
        ],
      },
      {
        productSlug: "scraperapi",
        scenarios: [
          "Developers who want a managed scrape API without operating proxy pools",
          "Teams that need a free/trial path before commit",
          "Moderate-volume production scraping with published credit tiers",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "siteground",
    b: "plesk",
    title: "SiteGround vs Plesk",
    labels: { a: "SiteGround", b: "Plesk" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":7,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":7},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":7},
    },
    factual: {
      startingPricing: "Published starting floors: SiteGround ~$17.99 vs Plesk ~$16.99 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (managed hosting vs hosting panel) — not undifferentiated peers. Choose SiteGround when managed WordPress on shared-plan packaging at a $17.99 ongoing floor is the job — not a Plesk panel licence, and not WP Engine by default. Choose Plesk when hosting/server panel administration is the primary job on infrastructure you control. Overall: SiteGround 7.3 vs Plesk 7.4. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "siteground",
        scenarios: [
          "Teams that want managed WordPress hosting with a published $17.99 ongoing floor",
          "Buyers comparing SiteGround StartUp to WP Engine Essential and Kinsta Single",
          "Orgs that will treat $17.99 as renewal TCO, not the $2.99 promo month",
        ],
      },
      {
        productSlug: "plesk",
        scenarios: [
          "Web agencies and hosts administering sites on VPS/dedicated servers",
          "Admins wanting GUI panel versus manual LAMP/stack configuration",
          "Resellers needing Web Host multi-customer management",
        ],
      },
    ],
  }),
  approvedItPair({
    a: "honeycomb",
    b: "pagerduty",
    title: "Honeycomb vs PagerDuty",
    labels: { a: "Honeycomb", b: "PagerDuty" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Published starting floors: Honeycomb ~$150 vs PagerDuty ~$21 — confirm live packaging (technician/agent, vCPU, seat, CI-user, shared-host renewal, GB/API-commit, and GBP vs USD math differ).",
      freePlan: "Compare published free tiers, trials, and first-month promotions — confirm what each path unlocks for your workload.",
      userMinimum: "Confirm seat floors, host/GB/CI-minute units, add-ons, and whether the SKU is ITSM, observability, on-call, CI, panel, managed hosting, or proxy GB before purchase.",
    },
    verdict:
      "Adjacent IT jobs (observability vs incident / on-call) — not undifferentiated peers. Choose Honeycomb when high-cardinality event/trace debugging is the job — not Datadog infrastructure monitoring by default, and not PagerDuty. Choose PagerDuty when paging and incident response are the job — not when you need Datadog telemetry or ServiceNow ITSM. Overall: Honeycomb 7.8 vs PagerDuty 8. Not hands-on lab tested; confirm live pricing and packaging.",
    pricingNotes:
      "Research 2026-08-18 from first-party pages. Affiliate economics excluded. Confirm live packaging — seats, hosts, GB, CI minutes, and add-ons change TCO.",
    bestFor: [
      {
        productSlug: "honeycomb",
        scenarios: [
          "Teams whose observability job is high-cardinality events and traces",
          "OpenTelemetry-first debugging vs host/infra suites",
          "Buyers who will start on Free before Pro $150",
        ],
      },
      {
        productSlug: "pagerduty",
        scenarios: [
          "SRE/IT teams that need on-call schedules and paging",
          "Orgs already sending alerts from Datadog/CloudWatch",
          "Incident commanders who want a dedicated ops cloud",
        ],
      },
    ],
  }),

  // IT optional-next comparisons (2026-08-18)
  approvedItPair({
    a: "topdesk",
    b: "freshservice",
    title: "TOPdesk vs Freshservice",
    labels: { a: "TOPdesk", b: "Freshservice" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Starting floors: TOPdesk ~$51 vs Freshservice ~$19 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: TOPdesk 7.8 vs Freshservice 8.4.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "topdesk", scenarios: ["TOPdesk primary-job workflows"] },
      { productSlug: "freshservice", scenarios: ["Freshservice primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "topdesk",
    b: "haloitsm",
    title: "TOPdesk vs HaloITSM",
    labels: { a: "TOPdesk", b: "HaloITSM" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: TOPdesk ~$51 vs HaloITSM ~$66 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: TOPdesk 7.8 vs HaloITSM 7.9.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "topdesk", scenarios: ["TOPdesk primary-job workflows"] },
      { productSlug: "haloitsm", scenarios: ["HaloITSM primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "ivanti",
    b: "servicenow",
    title: "Ivanti Neurons for ITSM vs ServiceNow",
    labels: { a: "Ivanti Neurons for ITSM", b: "ServiceNow" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":10,"integrations":10},
    },
    factual: {
      startingPricing: "Starting floors: Ivanti Neurons for ITSM ~$95 vs ServiceNow ~$100 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Ivanti Neurons for ITSM 8 vs ServiceNow 8.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "ivanti", scenarios: ["Ivanti Neurons for ITSM primary-job workflows"] },
      { productSlug: "servicenow", scenarios: ["ServiceNow primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "bmc-helix",
    b: "servicenow",
    title: "BMC Helix ITSM vs ServiceNow",
    labels: { a: "BMC Helix ITSM", b: "ServiceNow" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":9},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":10,"integrations":10},
    },
    factual: {
      startingPricing: "Starting floors: BMC Helix ITSM ~$115 vs ServiceNow ~$100 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: BMC Helix ITSM 8.3 vs ServiceNow 8.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "bmc-helix", scenarios: ["BMC Helix ITSM primary-job workflows"] },
      { productSlug: "servicenow", scenarios: ["ServiceNow primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "ivanti",
    b: "bmc-helix",
    title: "Ivanti Neurons for ITSM vs BMC Helix ITSM",
    labels: { a: "Ivanti Neurons for ITSM", b: "BMC Helix ITSM" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Starting floors: Ivanti Neurons for ITSM ~$95 vs BMC Helix ITSM ~$115 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Ivanti Neurons for ITSM 8 vs BMC Helix ITSM 8.3.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "ivanti", scenarios: ["Ivanti Neurons for ITSM primary-job workflows"] },
      { productSlug: "bmc-helix", scenarios: ["BMC Helix ITSM primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "chronosphere",
    b: "datadog",
    title: "Chronosphere vs Datadog",
    labels: { a: "Chronosphere", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Starting floors: Chronosphere contact vs Datadog ~$15 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Chronosphere 7.9 vs Datadog 8.6.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "chronosphere", scenarios: ["Chronosphere primary-job workflows"] },
      { productSlug: "datadog", scenarios: ["Datadog primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "coralogix",
    b: "datadog",
    title: "Coralogix vs Datadog",
    labels: { a: "Coralogix", b: "Datadog" },
    editorial: {
      a: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
      b: {"itsm-depth":10,"observability-depth":10,"source-control-depth":10,"hosting-panel-depth":10,"web-data-depth":10,"security-admin":9,"integrations":9},
    },
    factual: {
      startingPricing: "Starting floors: Coralogix contact vs Datadog ~$15 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Coralogix 7.8 vs Datadog 8.6.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "coralogix", scenarios: ["Coralogix primary-job workflows"] },
      { productSlug: "datadog", scenarios: ["Datadog primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "chronosphere",
    b: "honeycomb",
    title: "Chronosphere vs Honeycomb",
    labels: { a: "Chronosphere", b: "Honeycomb" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":9,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":8,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Chronosphere contact vs Honeycomb ~$150 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Chronosphere 7.9 vs Honeycomb 7.8.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "chronosphere", scenarios: ["Chronosphere primary-job workflows"] },
      { productSlug: "honeycomb", scenarios: ["Honeycomb primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "render",
    b: "fly-io",
    title: "Render vs Fly.io",
    labels: { a: "Render", b: "Fly.io" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Render ~$25 vs Fly.io ~$1.94 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Same-cluster peer comparison. Overall: Render 7.9 vs Fly.io 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "render", scenarios: ["Render primary-job workflows"] },
      { productSlug: "fly-io", scenarios: ["Fly.io primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "render",
    b: "wp-engine",
    title: "Render vs WP Engine",
    labels: { a: "Render", b: "WP Engine" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
    },
    factual: {
      startingPricing: "Starting floors: Render ~$25 vs WP Engine ~$30 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Landscape comparison — different job clusters; not undifferentiated peers. Overall: Render 7.9 vs WP Engine 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "render", scenarios: ["Render primary-job workflows"] },
      { productSlug: "wp-engine", scenarios: ["WP Engine primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "fly-io",
    b: "cloudways",
    title: "Fly.io vs Cloudways",
    labels: { a: "Fly.io", b: "Cloudways" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Fly.io ~$1.94 vs Cloudways ~$11 — confirm live packaging (agent/GBP vs USD, named-user RFP estimates, usage GB/tokens, Pro workspace vs PAYG compute, and managed-hosting vs PaaS math differ).",
      freePlan: "Compare published free tiers, trials, Hobby workspaces, pilots, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, support SKUs vs hosting, and whether the SKU is ITSM, observability, cloud PaaS, or managed hosting.",
    },
    verdict: "Landscape comparison — different job clusters; not undifferentiated peers. Overall: Fly.io 7.7 vs Cloudways 7.6.",
    pricingNotes: "Research 2026-08-18 from first-party pages (or labelled third-party/marketplace signals). Affiliate economics excluded.",
    bestFor: [
      { productSlug: "fly-io", scenarios: ["Fly.io primary-job workflows"] },
      { productSlug: "cloudways", scenarios: ["Cloudways primary-job workflows"] },
    ],
  }),

  // IT gap-fill PaaS + incident comparisons (2026-08-18)
  approvedItPair({
    a: "railway",
    b: "render",
    title: "Railway vs Render",
    labels: { a: "Railway", b: "Render" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Railway ~$5 vs Render ~$25 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: Railway 7.8 vs Render 7.9.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "railway", scenarios: ["Railway primary-job workflows"] },
      { productSlug: "render", scenarios: ["Render primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "railway",
    b: "fly-io",
    title: "Railway vs Fly.io",
    labels: { a: "Railway", b: "Fly.io" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Railway ~$5 vs Fly.io ~$1.94 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: Railway 7.8 vs Fly.io 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "railway", scenarios: ["Railway primary-job workflows"] },
      { productSlug: "fly-io", scenarios: ["Fly.io primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "heroku",
    b: "render",
    title: "Heroku vs Render",
    labels: { a: "Heroku", b: "Render" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Heroku ~$7 vs Render ~$25 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: Heroku 7.7 vs Render 7.9.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "heroku", scenarios: ["Heroku primary-job workflows"] },
      { productSlug: "render", scenarios: ["Render primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "heroku",
    b: "railway",
    title: "Heroku vs Railway",
    labels: { a: "Heroku", b: "Railway" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Heroku ~$7 vs Railway ~$5 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: Heroku 7.7 vs Railway 7.8.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "heroku", scenarios: ["Heroku primary-job workflows"] },
      { productSlug: "railway", scenarios: ["Railway primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "heroku",
    b: "fly-io",
    title: "Heroku vs Fly.io",
    labels: { a: "Heroku", b: "Fly.io" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: Heroku ~$7 vs Fly.io ~$1.94 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: Heroku 7.7 vs Fly.io 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "heroku", scenarios: ["Heroku primary-job workflows"] },
      { productSlug: "fly-io", scenarios: ["Fly.io primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "squadcast",
    b: "pagerduty",
    title: "SolarWinds Incident Response vs PagerDuty",
    labels: { a: "SolarWinds Incident Response", b: "PagerDuty" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":9},
    },
    factual: {
      startingPricing: "Starting floors: SolarWinds Incident Response ~$15 vs PagerDuty ~$21 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: SolarWinds Incident Response 7.7 vs PagerDuty 8.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "squadcast", scenarios: ["SolarWinds Incident Response primary-job workflows"] },
      { productSlug: "pagerduty", scenarios: ["PagerDuty primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "squadcast",
    b: "incident-io",
    title: "SolarWinds Incident Response vs incident.io",
    labels: { a: "SolarWinds Incident Response", b: "incident.io" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: SolarWinds Incident Response ~$15 vs incident.io ~$15 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: SolarWinds Incident Response 7.7 vs incident.io 7.8.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "squadcast", scenarios: ["SolarWinds Incident Response primary-job workflows"] },
      { productSlug: "incident-io", scenarios: ["incident.io primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "squadcast",
    b: "firehydrant",
    title: "SolarWinds Incident Response vs FireHydrant",
    labels: { a: "SolarWinds Incident Response", b: "FireHydrant" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":8,"observability-depth":8,"source-control-depth":8,"hosting-panel-depth":8,"web-data-depth":8,"security-admin":7,"integrations":8},
    },
    factual: {
      startingPricing: "Starting floors: SolarWinds Incident Response ~$15 vs FireHydrant ~$25 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Same-cluster peer comparison. Overall: SolarWinds Incident Response 7.7 vs FireHydrant 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "squadcast", scenarios: ["SolarWinds Incident Response primary-job workflows"] },
      { productSlug: "firehydrant", scenarios: ["FireHydrant primary-job workflows"] },
    ],
  }),
  approvedItPair({
    a: "railway",
    b: "wp-engine",
    title: "Railway vs WP Engine",
    labels: { a: "Railway", b: "WP Engine" },
    editorial: {
      a: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":7,"integrations":8},
      b: {"itsm-depth":9,"observability-depth":8,"source-control-depth":9,"hosting-panel-depth":9,"web-data-depth":9,"security-admin":8,"integrations":7},
    },
    factual: {
      startingPricing: "Starting floors: Railway ~$5 vs WP Engine ~$30 — confirm live packaging (workspace/credits vs dyno always-on vs managed-WP vs per-user on-call math differ).",
      freePlan: "Compare published free tiers, trials, Hobby/Free credits, Eco sleep dynos, and first-month promotions on each vendor pricing page.",
      userMinimum: "Check annual vs monthly billing, add-ons, Eco sleep vs always-on, Pro workspace vs dyno ladders, and whether the SKU is cloud PaaS, managed WordPress, or incident-oncall.",
    },
    verdict: "Landscape comparison — different job clusters; not undifferentiated peers. Overall: Railway 7.8 vs WP Engine 7.7.",
    pricingNotes: "Research 2026-08-18 from first-party pages. Affiliate economics excluded.",
    bestFor: [
      { productSlug: "railway", scenarios: ["Railway primary-job workflows"] },
      { productSlug: "wp-engine", scenarios: ["WP Engine primary-job workflows"] },
    ],
  }),

  approvedAiPair({
    a: "notion",
    b: "chatgpt",
    title: "Notion vs ChatGPT",
    labels: { a: "Notion", b: "ChatGPT" },
    editorial: {
      a: {
        "llm-chat-depth": 6,
        "writing-depth": 7,
        "voice-depth": 4,
        "agent-depth": 6,
        governance: 7,
        integrations: 8,
        "usage-model": 7,
      },
      b: {
        "llm-chat-depth": 9,
        "writing-depth": 9,
        "voice-depth": 9,
        "agent-depth": 8,
        governance: 8,
        integrations: 9,
        "usage-model": 8,
      },
    },
    factual: {
      startingPricing:
        "Notion Plus from about $10/member/mo; ChatGPT Plus $20/mo — different jobs (workspace vs LLM assistant). Confirm live annual/monthly packaging.",
      freePlan:
        "Both publish free tiers. Notion Free for personal notes; ChatGPT Free for capped chat — not interchangeable for team wiki + AI assistant depth.",
      userMinimum:
        "Notion Team/Business seat minimums vs ChatGPT Business 2-seat floor — compare workspace seats vs LLM seats separately.",
    },
    verdict:
      "Different primary jobs. Choose Notion when docs, databases, and team wiki are the system of record with AI as an add-on. Choose ChatGPT when a standalone LLM assistant, custom GPTs, and broad model access are the job. Overall: ChatGPT 8.6 vs Notion 6.4 for AI-assistant criteria — Notion wins when workspace OS is the purchase driver.",
    pricingNotes:
      "Research 2026-08-19 from first-party pages. Not an apples-to-apples SKU comparison — match purchase to workspace vs LLM assistant.",
    bestFor: [
      {
        productSlug: "notion",
        scenarios: [
          "Team wiki and project docs with embedded AI blocks",
          "Buyers who need databases + docs before LLM depth",
        ],
      },
      {
        productSlug: "chatgpt",
        scenarios: [
          "General-purpose LLM assistant with Plus/Pro model access",
          "Teams standardizing on OpenAI connectors and custom GPTs",
        ],
      },
    ],
  }),

  // Cross-category legacy comparison URLs materialized for migration (2026-08-19)
  approvedMarketingPair({
    a: "marketo",
    b: "salesforce",
    title: "Marketo vs Salesforce",
    labels: { a: "Adobe Marketo Engage", b: "Salesforce Sales Cloud" },
    scoresA: {
      "ease-of-use": 5,
      "campaign-content": 8,
      "marketing-automation": 9,
      "funnel-conversion": 8,
      "analytics-attribution": 9,
      "brand-monitoring": 4,
      integrations: 9,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoresB: {
      "ease-of-use": 5,
      "campaign-content": 6,
      "marketing-automation": 7,
      "funnel-conversion": 6,
      "analytics-attribution": 8,
      "brand-monitoring": 4,
      integrations: 10,
      scalability: 10,
      "value-for-money": 4,
      "ai-capabilities": 8,
    },
    verdict:
      "No universal winner — different enterprise systems. Choose Marketo for B2B marketing automation and nurture programmes; choose Salesforce Sales Cloud when pipeline CRM, forecasting, and platform customization are the primary job. Many stacks pair both rather than choosing one.",
    pricingNotes:
      "Marketo: custom quote only. Salesforce: published Starter Suite through Unlimited ladder — confirm live edition and add-on TCO. SoftwareGlimpse does not invent custom-quote dollars.",
    bestFor: [
      {
        productSlug: "marketo",
        scenarios: [
          "Enterprise B2B MAP and lead nurture",
          "Adobe Experience Cloud marketing ops",
        ],
      },
      {
        productSlug: "salesforce",
        scenarios: [
          "Enterprise sales CRM and pipeline governance",
          "Salesforce platform standardization",
        ],
      },
    ],
  }),
  approvedEmPair({
    a: "hubspot",
    b: "mailchimp",
    title: "HubSpot vs Mailchimp",
    labels: { a: "HubSpot", b: "Mailchimp" },
    editorial: {
      a: { automation: 8, segmentation: 7, analytics: 7, "ai-features": 7 },
      b: { automation: 7, segmentation: 7, analytics: 7, "ai-features": 6 },
    },
    factual: {
      startingPricing:
        "HubSpot Free CRM plus Marketing Hub Starter from published Smart CRM / hub ladders. Mailchimp freemium Free for eligible audiences; paid contact-based bands — verify live on each vendor pricing page.",
      contactLimits:
        "Both scale with contacts/marketing contacts. HubSpot hub packaging adds seat types; Mailchimp Free eligibility and paid tiers drive TCO differently.",
      emailLimits: "Plan-dependent send limits and marketing-contact caps — confirm live.",
      templates: "Both offer campaign templates; Mailchimp stronger freemium email brand familiarity; HubSpot ties templates to hub packaging.",
      landingPages: "Both include forms/LPs with plan gates — HubSpot via Marketing Hub; Mailchimp on paid tiers.",
      integrations: "HubSpot Marketplace breadth vs Mailchimp email-centric ecosystem — choose by whether CRM + hubs or email-first is the job.",
    },
    verdict:
      "No universal winner. Choose Mailchimp when freemium email marketing and audience tools are the primary job. Choose HubSpot when you want free CRM now with an upgrade path into marketing, sales, and service hubs on one platform.",
    pricingNotes:
      "HubSpot Free CRM + hub ladders researched from first-party pages. Mailchimp freemium Free for eligible audiences — verify live paid bands.",
    bestFor: [
      {
        productSlug: "mailchimp",
        scenarios: [
          "Email-first SMBs wanting freemium entry",
          "Campaign teams without sales-pipeline depth needs",
        ],
      },
      {
        productSlug: "hubspot",
        scenarios: [
          "Teams wanting free CRM with marketing hub expansion",
          "Organizations aligning marketing + sales on one platform",
        ],
      },
    ],
  }),
  approvedCsPair({
    a: "hubspot",
    b: "tidio",
    title: "HubSpot vs Tidio",
    labels: { a: "HubSpot", b: "Tidio" },
    editorial: {
      a: {
        "ticketing-depth": 6,
        "live-chat": 7,
        "knowledge-base": 7,
        omnichannel: 7,
        "sla-routing": 6,
        "ecommerce-helpdesk": 5,
        "ai-features": 7,
        integrations: 8,
      },
      b: {
        "ticketing-depth": 4,
        "live-chat": 9,
        "knowledge-base": 7,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 8,
        integrations: 7,
      },
    },
    factual: {
      startingPricing:
        "HubSpot Free CRM includes basic chat; Service/Marketing hubs add paid chat depth. Tidio Starter $24.17/mo annual for 100 billable conversations; Growth from $49.17 — conversation-cap pricing.",
      freePlan:
        "HubSpot publishes free CRM with chat widgets. Tidio markets visitor chat with conversation-based paid tiers — confirm live free/trial terms.",
      agentMinimum:
        "HubSpot scales on hub seats. Tidio bills on billable conversations — compare seat math vs conversation caps for your traffic.",
    },
    verdict:
      "Choose Tidio (7.4) for SMB website live chat, Lyro AI deflection, and conversation-cap pricing. Choose HubSpot (7.1) when chat is one piece of a broader free CRM + marketing/sales hub strategy. Not a full helpdesk vs CRM platform decision — match the primary job.",
    pricingNotes:
      "Research 2026-08-19 from first-party pages. HubSpot hub packaging vs Tidio conversation tiers. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "tidio",
        scenarios: [
          "Website live chat with AI visitor deflection",
          "Conversation-cap pricing for SMB storefronts",
        ],
      },
      {
        productSlug: "hubspot",
        scenarios: [
          "Free CRM with chat as part of a hub upgrade path",
          "Teams already standardizing on HubSpot GTM hubs",
        ],
      },
    ],
  }),
  approvedCsPair({
    a: "tidio",
    b: "zendesk",
    title: "Tidio vs Zendesk Sell",
    labels: { a: "Tidio", b: "Zendesk Sell" },
    editorial: {
      a: {
        "ticketing-depth": 4,
        "live-chat": 9,
        "knowledge-base": 7,
        omnichannel: 6,
        "sla-routing": 5,
        "ecommerce-helpdesk": 6,
        "ai-features": 8,
        integrations: 7,
      },
      b: {
        "ticketing-depth": 5,
        "live-chat": 5,
        "knowledge-base": 4,
        omnichannel: 5,
        "sla-routing": 5,
        "ecommerce-helpdesk": 4,
        "ai-features": 6,
        integrations: 8,
      },
    },
    factual: {
      startingPricing:
        "Tidio Starter $24.17/mo annual (100 billable conversations). Zendesk Sell Team $19/agent/mo annual — sales CRM, not Suite helpdesk.",
      freePlan:
        "Tidio markets visitor chat tiers; Zendesk Sell publishes trials but not a forever-free CRM — confirm live.",
      agentMinimum:
        "Tidio conversation-cap vs Zendesk Sell per-agent seats — legacy URL often mixed support chat with sales CRM; compare the job you actually need.",
    },
    verdict:
      "Different primary jobs. Choose Tidio for website live chat and AI deflection. Choose Zendesk Sell for sales pipeline CRM — not Zendesk Suite helpdesk. If you need omnichannel support ticketing, compare Tidio to Zendesk Suite or Freshdesk instead.",
    pricingNotes:
      "Research 2026-08-19. Catalogue maps zendesk slug to Zendesk Sell (sales CRM). Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "tidio",
        scenarios: [
          "SMB website chat and Lyro AI deflection",
          "Conversation-cap pricing vs per-agent CRM seats",
        ],
      },
      {
        productSlug: "zendesk",
        scenarios: [
          "Sales pipeline CRM on Zendesk Sell",
          "Teams already on Zendesk with Sell add-on needs",
        ],
      },
    ],
  }),
  approvedHrPair({
    a: "bolt-for-business",
    b: "navan",
    title: "Bolt for Business vs Navan",
    labels: { a: "Bolt for Business", b: "Navan" },
    editorial: {
      a: {
        "hiring-workflow": 1,
        "core-hris": 1,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 2,
        integrations: 6,
        mobile: 9,
      },
      b: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 2,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Bolt for Business bills per trip (usage-based) — no published per-seat HR SaaS rate card. Navan is quote-based enterprise travel & expense — per active traveler or company contract.",
      freePlan:
        "Neither product publishes a forever-free HR-style plan. Confirm current trial or pilot terms with each vendor.",
      userMinimum:
        "Bolt scales from small teams needing ride accounts. Navan targets mid-market and enterprise travel programs — confirm minimum traveler counts on quote.",
    },
    verdict:
      "Different primary jobs. Choose Bolt for Business when employee ground transport with central billing is the bottleneck. Choose Navan when flights, hotels, policy-driven T&E, and expense approvals need one platform — not a ride-hailing account alone.",
    pricingNotes:
      "Bolt is trip-usage economics; Navan is contract T&E. Research 2026-08-19. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "bolt-for-business",
        scenarios: [
          "Team ride-hailing with company billing",
          "Ground transport in Bolt-served cities",
        ],
      },
      {
        productSlug: "navan",
        scenarios: [
          "Corporate flight/hotel/car booking",
          "T&E policy, approvals, and reporting",
        ],
      },
    ],
  }),
  approvedHrPair({
    a: "jibble",
    b: "navan",
    title: "Jibble vs Navan",
    labels: { a: "Jibble", b: "Navan" },
    editorial: {
      a: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 2,
        "scheduling-depth": 4,
        "training-depth": 1,
        "time-tracking-depth": 9,
        integrations: 7,
        mobile: 9,
      },
      b: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 2,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "Jibble is free forever for unlimited users; Premium ~$4.49 and Ultimate ~$7.99/user/mo annual. Navan is quote-based enterprise travel & expense.",
      freePlan:
        "Jibble publishes a free forever plan. Navan does not publish a free plan — trial terms may be available on quote.",
      userMinimum:
        "Jibble has no published seat minimum on Free. Navan packaging is typically per active traveler or company contract.",
    },
    verdict:
      "These are not peers. Choose Jibble for GPS/face clock-in and timesheets. Choose Navan when business travel booking and expense management are the purchase — not hourly attendance tracking.",
    pricingNotes:
      "Jibble paid tiers are medium-confidence list rates. Navan requires vendor quote. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "jibble",
        scenarios: ["GPS / face time tracking", "Free unlimited-user timesheets"],
      },
      {
        productSlug: "navan",
        scenarios: ["Corporate travel programs", "T&E approvals and reporting"],
      },
    ],
  }),
  approvedHrPair({
    a: "bamboohr",
    b: "navan",
    title: "BambooHR vs Navan",
    labels: { a: "BambooHR", b: "Navan" },
    editorial: {
      a: {
        "hiring-workflow": 7,
        "core-hris": 9,
        "payroll-processing": 7,
        "scheduling-depth": 3,
        "training-depth": 4,
        "time-tracking-depth": 5,
        integrations: 8,
        mobile: 7,
      },
      b: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 2,
        integrations: 8,
        mobile: 8,
      },
    },
    factual: {
      startingPricing:
        "BambooHR Core from $10/employee/mo above 25 employees (or $250/mo flat floor). Navan is quote-based enterprise travel & expense.",
      freePlan:
        "BambooHR does not publish a forever-free HRIS plan. Navan does not publish a free plan.",
      userMinimum:
        "BambooHR Core targets SMB/mid-market HR teams. Navan targets organizations with recurring business travel volume.",
    },
    verdict:
      "Different jobs. Choose BambooHR when employee records, onboarding, and core HRIS are the system of record. Choose Navan when corporate travel and T&E control are the bottleneck — often alongside an HRIS, not instead of one.",
    pricingNotes:
      "Compare BambooHR PEPM vs Navan traveler/contract packaging. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "bamboohr",
        scenarios: ["Core HRIS for SMB teams", "Employee records and onboarding"],
      },
      {
        productSlug: "navan",
        scenarios: ["Business travel booking", "Expense policy and approvals"],
      },
    ],
  }),
  approvedHrPair({
    a: "navan",
    b: "rippling",
    title: "Navan vs Rippling",
    labels: { a: "Navan", b: "Rippling" },
    editorial: {
      a: {
        "hiring-workflow": 1,
        "core-hris": 2,
        "payroll-processing": 1,
        "scheduling-depth": 1,
        "training-depth": 1,
        "time-tracking-depth": 2,
        integrations: 8,
        mobile: 8,
      },
      b: {
        "hiring-workflow": 7,
        "core-hris": 9,
        "payroll-processing": 9,
        "scheduling-depth": 5,
        "training-depth": 5,
        "time-tracking-depth": 6,
        integrations: 9,
        mobile: 7,
      },
    },
    factual: {
      startingPricing:
        "Navan is quote-based enterprise travel & expense. Rippling publishes an SMB floor ($8/user/mo plus $40/mo platform fee) with module stacking on quote.",
      freePlan:
        "Neither product publishes a forever-free core plan. Confirm trials during sales.",
      userMinimum:
        "Navan suits mid-market and enterprise travel programs. Rippling scales from SMB unified HR + payroll + IT.",
    },
    verdict:
      "Rippling is a unified people platform (HR, payroll, IT). Navan is travel and expense management. Choose Rippling when HRIS + payroll + device management are the purchase; Navan when T&E volume and policy enforcement need a dedicated stack layer.",
    pricingNotes:
      "Rippling module stacking vs Navan traveler contracts — model TCO separately. Affiliate economics excluded.",
    bestFor: [
      {
        productSlug: "navan",
        scenarios: ["Corporate travel and expense programs", "Finance-led T&E policy"],
      },
      {
        productSlug: "rippling",
        scenarios: ["Unified HR + payroll + IT", "People platform as system of record"],
      },
    ],
  }),
  // Affiliate new 2026-08-26 (CometChat + Turbotic)
  approvedCsPair({
    a: "cometchat",
    b: "tidio",
    title: "CometChat vs Tidio",
    labels: { a: "CometChat", b: "Tidio" },
    editorial: { a: {"ticketing-depth":3,"live-chat":9,"knowledge-base":3,"omnichannel":6,"sla-routing":3,"ecommerce-helpdesk":4,"ai-features":8,"integrations":9}, b: {"ticketing-depth":4,"live-chat":9,"knowledge-base":7,"omnichannel":6,"sla-routing":5,"ecommerce-helpdesk":6,"ai-features":8,"integrations":7} },
    factual: {
      startingPricing: "CometChat paid chat from ~$239/mo annual at 1k MAU (SDK). Tidio Starter $24.17/mo annual (100 billable conversations) — different pricing units.",
      freePlan: "CometChat Build free for 100 MAU dev/testing. Tidio publishes visitor-chat tiers — confirm live free/trial on tidio.com.",
      agentMinimum: "CometChat bills MAU/concurrency for embedded apps; Tidio bills conversation caps for website chat — not interchangeable units.",
    },
    verdict: "Different primary jobs. Choose CometChat when you embed chat/voice/video inside your own app via SDK/UI kits. Choose Tidio for website live chat and Lyro AI deflection without building custom messaging infrastructure.",
    pricingNotes: "Research 2026-08-26 from first-party pages. Landscape comparison — in-app SDK vs website widget. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "cometchat",
                "scenarios": [
                      "Mobile/web apps that need embedded messaging infrastructure",
                      "Teams shipping SDK/UI kits instead of a site chat bubble"
                ]
          },
          {
                "productSlug": "tidio",
                "scenarios": [
                      "SMB website live chat with conversation-cap pricing",
                      "Storefront teams wanting plug-in chat without developers"
                ]
          }
    ],
  }),
  approvedCsPair({
    a: "cometchat",
    b: "intercom",
    title: "CometChat vs Intercom",
    labels: { a: "CometChat", b: "Intercom" },
    editorial: { a: {"ticketing-depth":3,"live-chat":9,"knowledge-base":3,"omnichannel":6,"sla-routing":3,"ecommerce-helpdesk":4,"ai-features":8,"integrations":9}, b: {"ticketing-depth":7,"live-chat":9,"knowledge-base":8,"omnichannel":9,"sla-routing":7,"ecommerce-helpdesk":6,"ai-features":9,"integrations":9} },
    factual: {
      startingPricing: "CometChat ~$239/mo annual at 1k MAU (SDK). Intercom Essential from ~$29/seat/mo plus Fin usage — confirm live intercom.com/pricing.",
      freePlan: "CometChat Build free (100 MAU). Intercom packaging is seat/outcome based — confirm trials on intercom.com.",
      agentMinimum: "CometChat MAU tiers for embedded apps vs Intercom per-seat + Fin outcomes for customer messaging platform.",
    },
    verdict: "Choose CometChat to embed messaging inside your product. Choose Intercom for a customer messaging platform with inbox, Fin AI, and GTM workflows — not as a drop-in SDK replacement.",
    pricingNotes: "Research 2026-08-26. Landscape — SDK vs messaging platform. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "cometchat",
                "scenarios": [
                      "Product-led apps embedding chat/calls natively"
                ]
          },
          {
                "productSlug": "intercom",
                "scenarios": [
                      "GTM/support teams standardizing on Intercom inbox + Fin"
                ]
          }
    ],
  }),
  approvedCsPair({
    a: "cometchat",
    b: "freshchat",
    title: "CometChat vs Freshchat",
    labels: { a: "CometChat", b: "Freshchat" },
    editorial: { a: {"ticketing-depth":3,"live-chat":9,"knowledge-base":3,"omnichannel":6,"sla-routing":3,"ecommerce-helpdesk":4,"ai-features":8,"integrations":9}, b: {"ticketing-depth":6,"live-chat":8,"knowledge-base":7,"omnichannel":7,"sla-routing":6,"ecommerce-helpdesk":5,"ai-features":7,"integrations":8} },
    factual: {
      startingPricing: "CometChat ~$239/mo annual at 1k MAU. Freshchat Growth from ~$19/agent/mo annual — agent seats vs MAU.",
      freePlan: "CometChat Build free (100 MAU). Freshchat free up to 10 agents on published tiers — confirm live.",
      agentMinimum: "Compare MAU/concurrency (CometChat SDK) vs Freshchat agent seats in Freshworks bundle.",
    },
    verdict: "CometChat embeds chat in your app; Freshchat is Freshworks live messaging for support teams. Pick CometChat for developers; Freshchat for Freshworks-aligned agent inboxes.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "cometchat",
                "scenarios": [
                      "In-app messaging for product teams"
                ]
          },
          {
                "productSlug": "freshchat",
                "scenarios": [
                      "Freshworks-aligned live chat for agents"
                ]
          }
    ],
  }),
  approvedCsPair({
    a: "cometchat",
    b: "livechat",
    title: "CometChat vs LiveChat",
    labels: { a: "CometChat", b: "LiveChat" },
    editorial: { a: {"ticketing-depth":3,"live-chat":9,"knowledge-base":3,"omnichannel":6,"sla-routing":3,"ecommerce-helpdesk":4,"ai-features":8,"integrations":9}, b: {"ticketing-depth":5,"live-chat":9,"knowledge-base":6,"omnichannel":6,"sla-routing":5,"ecommerce-helpdesk":6,"ai-features":7,"integrations":8} },
    factual: {
      startingPricing: "CometChat ~$239/mo annual at 1k MAU. LiveChat Starter $19/agent/mo annual — per agent vs MAU.",
      freePlan: "CometChat Build free (100 MAU). LiveChat trial terms on livechat.com — confirm live.",
      agentMinimum: "CometChat SDK MAU pricing vs LiveChat per-agent website chat seats.",
    },
    verdict: "CometChat is for builders embedding chat in apps; LiveChat is established website live chat from Text. Different buyer — developers vs support ops on a site widget.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "cometchat",
                "scenarios": [
                      "Embedded in-app chat/voice/video"
                ]
          },
          {
                "productSlug": "livechat",
                "scenarios": [
                      "Website agent chat with per-seat pricing"
                ]
          }
    ],
  }),
  approvedAiPair({
    a: "turbotic",
    b: "zapier",
    title: "Turbotic vs Zapier",
    labels: { a: "Turbotic", b: "Zapier" },
    editorial: { a: {"llm-chat-depth":8,"writing-depth":6,"voice-depth":5,"agent-depth":8,"governance":6,"integrations":8,"usage-model":8}, b: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":8,"governance":7,"integrations":10,"usage-model":7} },
    factual: {
      startingPricing: "Turbotic Basic from $14.99/mo annual; Zapier Pro from $19.99/mo annual (750 tasks) — confirm execution vs task units.",
      freePlan: "Turbotic Free: 100 executions/mo. Zapier Free: 100 tasks/mo — compare caps on each vendor site.",
      userMinimum: "Confirm automation counts, execution/chat quotas, and AI add-ons before purchase.",
    },
    verdict: "Same ai-automation cluster. Choose Turbotic for AI-native natural-language automation with self-healing positioning. Choose Zapier for the broadest SaaS connector catalog and mature Zap editor.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "turbotic",
                "scenarios": [
                      "AI-generated workflows with ROI reporting"
                ]
          },
          {
                "productSlug": "zapier",
                "scenarios": [
                      "Maximum connector breadth and no-code Zaps"
                ]
          }
    ],
  }),
  approvedAiPair({
    a: "turbotic",
    b: "n8n",
    title: "Turbotic vs n8n",
    labels: { a: "Turbotic", b: "n8n" },
    editorial: { a: {"llm-chat-depth":8,"writing-depth":6,"voice-depth":5,"agent-depth":8,"governance":6,"integrations":8,"usage-model":8}, b: {"llm-chat-depth":9,"writing-depth":7,"voice-depth":7,"agent-depth":9,"governance":8,"integrations":8,"usage-model":9} },
    factual: {
      startingPricing: "Turbotic Basic $14.99/mo annual vs n8n Cloud Starter ~€20/mo annual — confirm live currency and execution caps.",
      freePlan: "Turbotic Free (100 executions/mo). n8n Community self-host free — different deployment model.",
      userMinimum: "Compare hosted execution quotas vs self-host ops burden.",
    },
    verdict: "Choose Turbotic for conversational AI automation on a hosted platform. Choose n8n when self-host or EUR Cloud node-based automation is the job.",
    pricingNotes: "Research 2026-08-26. Affiliate economics excluded.",
    bestFor: [
          {
                "productSlug": "turbotic",
                "scenarios": [
                      "Hosted AI automation with NL build"
                ]
          },
          {
                "productSlug": "n8n",
                "scenarios": [
                      "Self-host or technical node workflows"
                ]
          }
    ],
  }),

];

const comparisonsSeedAuthored: ComparisonInput[] =
  uniqueCanonicalComparisons(comparisonsSeedRaw);

const competitorPairsFromResearch = buildCompetitorPairComparisonsFromResearch();

const tierHubShells = buildTierHubComparisonShells(softwareSeed, [
  ...comparisonsSeedAuthored,
  ...competitorPairsFromResearch,
], tierHubComparisonPairs);

export const comparisonsSeed: ComparisonInput[] = uniqueCanonicalComparisons([
  ...comparisonsSeedAuthored,
  ...competitorPairsFromResearch,
  ...tierHubShells,
  ...buildMissingComparisonShells(softwareSeed, [
    ...comparisonsSeedAuthored,
    ...competitorPairsFromResearch,
    ...tierHubShells,
  ]),
]);

function comparisonIsIndexableComplete(item: ComparisonInput): boolean {
  const outcomes = item.outcomes ?? [];
  const completeOutcomes = outcomes.filter((outcome) => {
    if (!outcome.reason?.trim()) return false;
    return (
      outcome.researchStatus !== "in-progress" &&
      outcome.researchStatus !== "none"
    );
  });
  return Boolean(item.verdict?.trim()) && completeOutcomes.length >= 3;
}

function finalizeComparisonEvidence(item: ComparisonInput): ComparisonInput {
  const [slugA, slugB] = item.productSlugs ?? [];
  const attached =
    slugA && slugB
      ? softenUnfactedProductA(
          attachExistingSupportingFacts(slugA, slugB, item.outcomes ?? []),
        )
      : (item.outcomes ?? []);
  const normalizedOutcomes = attached.map((outcome) => ({
    ...outcome,
    confidence: normalizeOutcomeConfidence(outcome),
  }));
  const next = { ...item, outcomes: normalizedOutcomes };
  if (next.seo?.indexable && !comparisonIsIndexableComplete(next)) {
    return {
      ...next,
      seo: { ...next.seo, indexable: false },
    };
  }
  if (isThinComparisonMesh(next)) {
    return {
      ...next,
      metadata: {
        ...next.metadata,
        researchStatus: "in-progress",
      },
      seo: { ...next.seo, indexable: false },
    };
  }
  return next;
}

function uniqueCanonicalComparisons(
  items: ComparisonInput[],
): ComparisonInput[] {
  const seen = new Map<string, ComparisonInput>();
  for (const item of items) {
    const slugs = item.productSlugs;
    const slug =
      Array.isArray(slugs) && slugs.length >= 2
        ? canonicalizeComparisonSlug(slugs)
        : item.slug;
    if (!slug) continue;
    const finalized = finalizeComparisonEvidence(item);
    const existing = seen.get(slug);
    if (!existing) {
      seen.set(slug, finalized);
      continue;
    }
    if (isThinComparisonMesh(existing) && !isThinComparisonMesh(finalized)) {
      seen.set(slug, finalized);
    }
  }
  return [...seen.values()];
}
