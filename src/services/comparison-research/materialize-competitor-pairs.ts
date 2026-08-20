import { canonicalizeComparisonSlug, sortProductPair } from "@/domain";
import type { z } from "zod";
import { ComparisonSchema } from "@/domain";
import type { ProductEditorialAssessment } from "@/domain";
import type { ProductResearchEnrichment } from "@/domain";
import { softwareSeed } from "@/data/seed/software";
import { loadAssessment } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { attachExistingSupportingFacts, softenUnfactedProductA } from "./attach-supporting-facts";
import { researchedAvailabilityTieReason } from "./distinctive-research";

type ComparisonInput = z.input<typeof ComparisonSchema>;
type Outcome = NonNullable<ComparisonInput["outcomes"]>[number];
type WinnerKind = NonNullable<Outcome["winnerKind"]>;

export const COMPETITOR_PAIR_CATEGORIES = [
  "sales-intelligence",
  "business-communications",
  "hr",
  "email-marketing",
  "project-management",
  "marketing",
  "customer-service",
  "ai",
  "it-development",
  "ecommerce",
] as const;

export type CompetitorPairCategory =
  (typeof COMPETITOR_PAIR_CATEGORIES)[number];

const PUBLISHED_AT = "2026-08-18T16:00:00.000Z";
const SEO_TITLE_MAX = 70;

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

const BC_CRITERIA = [
  "starting-pricing",
  "user-minimum",
  "ease-of-use",
  "number-coverage",
  "power-dialer",
  "whatsapp-business",
  "crm-integrations",
  "routing",
  "analytics",
  "ai-features",
  "value-for-money",
] as const;

const EM_CRITERIA = [
  "starting-pricing",
  "contact-limits",
  "email-limits",
  "ease-of-use",
  "automation",
  "templates",
  "segmentation",
  "landing-pages",
  "analytics",
  "integrations",
  "ai-features",
  "value-for-money",
] as const;

const PM_CRITERIA = [
  "starting-pricing",
  "seat-minimum",
  "free-plan",
  "ease-of-use",
  "timeline-gantt",
  "automations",
  "collaboration",
  "integrations",
  "ai-features",
  "reporting",
  "value-for-money",
] as const;

const HR_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "user-minimum",
  "hiring-workforce-fit",
  "workflow-depth",
  "integrations",
  "mobile-frontline",
  "analytics",
  "scalability",
  "value-for-money",
  "ai-capabilities",
] as const;

const HR_FEATURE_CRITERIA: Record<
  Exclude<
    (typeof HR_CRITERIA)[number],
    | "starting-pricing"
    | "free-plan"
    | "user-minimum"
    | "hiring-workforce-fit"
    | "workflow-depth"
    | "analytics"
    | "scalability"
    | "value-for-money"
    | "ai-capabilities"
  >,
  string[]
> = {
  integrations: ["hris-integrations"],
  "mobile-frontline": ["frontline-comms", "mobile-app"],
};

const HCM_CLUSTERS = new Set([
  "hris-core",
  "people-platform",
  "payroll-benefits",
  "enterprise-hcm",
]);
const WFM_CLUSTERS = new Set(["frontline-wfm", "time-attendance"]);
const PM_WORK_CLUSTERS = new Set([
  "work-os",
  "lightweight-board",
  "spreadsheet-pmo",
  "eng-tracker",
  "docs-first",
  "ai-calendar",
  "docs-db-hybrid",
]);
const BC_FAMILY: Record<string, string> = {
  "cloud-phone": "phone",
  "customer-messaging": "messaging",
  "team-messaging": "collab",
  "contact-center": "ccaas",
  "inbox-adjacent": "inbox",
  "communications-platform": "cpaas",
};
const IT_FAMILY: Record<string, string> = {
  "observability-monitoring": "observability",
  "incident-oncall": "incident",
  "itsm-service-desk": "itsm",
  "source-control-devops": "devops",
  // Keep hosting jobs separate — managed WP hosts ≠ panel licences ≠ app PaaS.
  "hosting-providers": "hosting-providers",
  "hosting-operations": "hosting-operations",
  "cloud-paas": "cloud-paas",
  "web-data-collection": "webdata",
};

const IT_JOB_FEATURES = [
  "managed-hosting",
  "hosting-panel",
  "cloud-paas",
  "incident-management",
  "change-problem",
  "service-catalog",
  "infrastructure-monitoring",
  "apm-tracing",
  "log-management",
  "source-control",
  "cicd-actions",
  "proxy-network",
] as const;

const IT_WORKFLOW_FEATURES = [
  "incident-management",
  "change-problem",
  "service-catalog",
  "managed-hosting",
  "cloud-paas",
  "cicd-actions",
  "hosting-panel",
  "apm-tracing",
  "log-management",
] as const;

const IT_AI_FEATURES = ["itsm-ai", "dev-ai"] as const;
const AI_FAMILY: Record<string, string> = {
  "llm-assistant": "llm",
  "ai-automation": "automation",
  "ai-meeting": "meeting",
  "ai-video": "video",
};
const ECOM_FAMILY: Record<string, string> = {
  "saas-platform": "platform",
  "open-source-platform": "platform",
  "website-builder": "builder",
  "dropshipping-sourcing": "dropship",
  "omnichannel-pos": "pos",
};
const CS_FAMILY: Record<string, string> = {
  "helpdesk-ticketing": "helpdesk",
  "live-chat": "chat",
  "shared-inbox": "inbox",
  "it-service-management": "itsm",
};
const SI_CRITERIA = [
  "ease-of-use",
  "contact-data",
  "prospecting",
  "email-outreach",
  "integrations",
  "value-for-money",
] as const;
const SI_FEATURES = {
  "contact-data": ["contact-data", "data-enrichment", "lead-management"],
  prospecting: ["prospecting", "lead-scoring", "data-enrichment"],
  "email-outreach": ["email-outreach", "email-sequences", "email-sync"],
  integrations: ["crm-sync", "integrations", "data-export"],
} as const;

const ECOM_FEATURES = {
  "storefront-commerce-fit": [
    "online-storefront",
    "dropshipping-sourcing",
    "marketplace-channels",
  ],
  "catalog-orders-depth": [
    "product-catalog",
    "order-management",
    "inventory-management",
  ],
  "checkout-conversion": ["checkout", "shipping-fulfillment"],
  integrations: ["app-extensions", "integrations", "marketplace-channels"],
  "omnichannel-pos": ["omnichannel-pos", "marketplace-channels"],
  "ai-capabilities": ["ai-assistance"],
} as const;

const HR_WORKFLOW_FEATURES = [
  "applicant-tracking",
  "career-site-job-boards",
  "interview-scheduling",
  "core-hris",
  "payroll-processing",
  "benefits-admin",
  "time-attendance",
  "employee-training-paths",
] as const;

const MARKETING_FEATURES = {
  "campaign-content": ["content-calendar", "email-sms-channels"],
  "marketing-automation": ["marketing-automation"],
  "funnel-conversion": ["funnel-builder", "landing-pages", "forms-lead-capture"],
  "analytics-attribution": ["analytics"],
  "brand-monitoring": ["brand-monitoring", "social-listening"],
  integrations: ["integrations", "team-collaboration"],
  "ai-capabilities": ["ai-assistance", "ai-decisioning"],
} as const;
const CS_CRITERIA = [
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
const AI_CRITERIA = [
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
const IT_CRITERIA = [
  "starting-pricing",
  "free-plan",
  "user-minimum",
  "ease-of-use",
  "it-job-fit",
  "workflow-depth",
  "integrations",
  "security-admin",
  "scalability",
  "value-for-money",
  "ai-capabilities",
] as const;
const ECOM_CRITERIA = [
  "starting-pricing",
  "ease-of-use",
  "storefront-commerce-fit",
  "catalog-orders-depth",
  "checkout-conversion",
  "integrations",
  "omnichannel-pos",
  "value-for-money",
  "ai-capabilities",
] as const;

type PairContext = {
  category: CompetitorPairCategory;
  slugA: string;
  slugB: string;
  labelA: string;
  labelB: string;
  primaryCategoryA: string;
  primaryCategoryB: string;
  assessmentA: ProductEditorialAssessment;
  assessmentB: ProductEditorialAssessment;
  enrichmentA: ProductResearchEnrichment | null;
  enrichmentB: ProductResearchEnrichment | null;
};

type PricingShape = {
  startingPriceMonthly?: number | null;
  hasFreePlan?: boolean | null;
};

function publishedProducts() {
  return softwareSeed.filter((item) => item.metadata?.status === "published");
}

function parseNotes(notes: string | undefined): {
  membershipRole?: string;
  jobCluster?: string;
} {
  if (!notes) return {};
  return {
    membershipRole: notes.match(/membershipRole=([a-z0-9-]+)/i)?.[1],
    jobCluster: notes.match(/jobCluster=([a-z0-9-]+)/i)?.[1],
  };
}

function scoresOf(
  assessment: ProductEditorialAssessment,
): Map<string, number> {
  const scores = new Map<string, number>();
  for (const row of assessment.criterionAssessments ?? []) {
    if (typeof row.score === "number") scores.set(row.criterionSlug, row.score);
  }
  return scores;
}

function mappedScore(
  scores: Map<string, number>,
  from: string,
  fallback?: string,
): number | null {
  const direct = scores.get(from);
  if (typeof direct === "number") return direct;
  if (fallback) {
    const next = scores.get(fallback);
    if (typeof next === "number") return next;
  }
  return null;
}

function criterionFactIds(
  assessment: ProductEditorialAssessment,
  scoreKeys: string[],
): string[] {
  const ids: string[] = [];
  for (const key of scoreKeys) {
    const row = assessment.criterionAssessments?.find(
      (item) => item.criterionSlug === key,
    );
    for (const id of row?.supportingFactIds ?? []) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids;
}

function scoredOutcome(
  ctx: PairContext,
  criterionSlug: string,
  scoreKeys: string[],
): Outcome {
  const scoresA = scoresOf(ctx.assessmentA);
  const scoresB = scoresOf(ctx.assessmentB);
  let a: number | null = null;
  let b: number | null = null;
  for (const key of scoreKeys) {
    if (a == null) a = mappedScore(scoresA, key);
    if (b == null) b = mappedScore(scoresB, key);
  }
  if (a != null && b != null) {
    const outcome = editorialOutcome(ctx, criterionSlug, a, b);
    return {
      ...outcome,
      supportingFactIds: [
        ...criterionFactIds(ctx.assessmentA, scoreKeys),
        ...criterionFactIds(ctx.assessmentB, scoreKeys),
      ],
    };
  }
  return factualOutcome(
    criterionSlug,
    `${ctx.labelA} vs ${ctx.labelB} on ${criterionSlug.replace(/-/g, " ")} is not a scored universal winner in current research — choose by job fit.`,
  );
}

function sameClusterFamily(
  clusterA: string | undefined,
  clusterB: string | undefined,
  family: Record<string, string>,
): boolean {
  if (clusterA && clusterB && clusterA === clusterB) return true;
  const familyA = clusterA ? family[clusterA] : undefined;
  const familyB = clusterB ? family[clusterB] : undefined;
  return Boolean(familyA && familyB && familyA === familyB);
}

const EM_DELIVERABILITY_SLUGS = new Set(["bouncer", "inboxally"]);

export function clustersAreSubstitutes(
  category: CompetitorPairCategory,
  clusterA: string | undefined,
  clusterB: string | undefined,
  roleA: string | undefined,
  roleB: string | undefined,
  slugA?: string,
  slugB?: string,
): boolean {
  const adjacentVsPrimary =
    (roleA === "adjacent" && roleB === "primary") ||
    (roleB === "adjacent" && roleA === "primary");
  if (adjacentVsPrimary) {
    if (category === "email-marketing") {
      if (
        (slugA && EM_DELIVERABILITY_SLUGS.has(slugA)) ||
        (slugB && EM_DELIVERABILITY_SLUGS.has(slugB))
      ) {
        return false;
      }
      // Newsletter / product-led adjacent tools are still compared on competitor slugs.
    } else {
      return false;
    }
  }

  if (clusterA && clusterB && clusterA === clusterB) return true;

  if (category === "hr") {
    if (clusterA && clusterB && HCM_CLUSTERS.has(clusterA) && HCM_CLUSTERS.has(clusterB)) {
      return true;
    }
    if (clusterA && clusterB && WFM_CLUSTERS.has(clusterA) && WFM_CLUSTERS.has(clusterB)) {
      return true;
    }
    return false;
  }

  if (category === "project-management") {
    if (
      (clusterA === "timeline" && clusterB === "spreadsheet-pmo") ||
      (clusterB === "timeline" && clusterA === "spreadsheet-pmo")
    ) {
      return true;
    }
    return Boolean(
      clusterA &&
        clusterB &&
        PM_WORK_CLUSTERS.has(clusterA) &&
        PM_WORK_CLUSTERS.has(clusterB),
    );
  }

  if (category === "business-communications") {
    const familyA = clusterA ? BC_FAMILY[clusterA] : undefined;
    const familyB = clusterB ? BC_FAMILY[clusterB] : undefined;
    return Boolean(familyA && familyB && familyA === familyB);
  }

  if (category === "it-development") {
    return sameClusterFamily(clusterA, clusterB, IT_FAMILY);
  }
  if (category === "ai") {
    return sameClusterFamily(clusterA, clusterB, AI_FAMILY);
  }
  if (category === "ecommerce") {
    return sameClusterFamily(clusterA, clusterB, ECOM_FAMILY);
  }
  if (category === "customer-service") {
    return sameClusterFamily(clusterA, clusterB, CS_FAMILY);
  }

  // Email marketing / marketing / SI Wave assessments often omit jobCluster.
  // Adjacent-vs-primary already returned false; remaining primary peers are kept.
  return true;
}

function pricingOf(
  enrichment: ProductResearchEnrichment | null,
): PricingShape {
  const raw = enrichment?.pricing;
  if (!raw || typeof raw !== "object") return {};
  const pricing = raw as PricingShape;
  return {
    startingPriceMonthly:
      typeof pricing.startingPriceMonthly === "number"
        ? pricing.startingPriceMonthly
        : null,
    hasFreePlan:
      typeof pricing.hasFreePlan === "boolean" ? pricing.hasFreePlan : null,
  };
}

function availabilityOf(
  enrichment: ProductResearchEnrichment | null,
  featureSlug: string,
): string | undefined {
  return enrichment?.featureSupport?.find((row) => row.featureSlug === featureSlug)
    ?.availability;
}

function seoTitle(labelA: string, labelB: string): string {
  const pair = `${labelA} vs ${labelB}`;
  const candidates = [`${pair}: Which Is Better?`, `${pair} Compared`, pair];
  for (const candidate of candidates) {
    if (candidate.length <= SEO_TITLE_MAX) return candidate;
  }
  return `${pair.slice(0, SEO_TITLE_MAX - 1)}…`;
}

function seoDescription(
  labelA: string,
  labelB: string,
  topics: string,
): string {
  const text = `Compare ${labelA} and ${labelB} on ${topics} using SoftwareGlimpse research-grounded editorial assessments. No universal winner — choose by job fit. Confirm live vendor pricing.`;
  return text.length <= 320 ? text : `${text.slice(0, 319)}…`;
}

function pricePhrase(label: string, enrichment: ProductResearchEnrichment | null): string {
  const pricing = pricingOf(enrichment);
  if (pricing.startingPriceMonthly != null) {
    const free = pricing.hasFreePlan ? "; a free plan is researched" : "";
    return `${label} researched starting price from $${pricing.startingPriceMonthly}/mo${free}`;
  }
  return `${label} starting price was not verified in current research — confirm on the vendor pricing page`;
}

function freePlanPhrase(
  label: string,
  enrichment: ProductResearchEnrichment | null,
): string {
  const free = pricingOf(enrichment).hasFreePlan;
  if (free === true) return `${label} researches a free plan`;
  if (free === false) return `${label} does not research a free plan`;
  return `${label} free-plan status was not verified in current research`;
}

function editorialOutcome(
  ctx: PairContext,
  criterionSlug: string,
  scoreA: number,
  scoreB: number,
): Outcome {
  const delta = scoreA - scoreB;
  let winnerKind: WinnerKind = "depends";
  let winnerSlug: string | null = null;
  if (Math.abs(delta) <= 0.5) {
    winnerKind = "tie";
  } else if (delta > 0) {
    winnerKind = "product-a";
    winnerSlug = ctx.slugA;
  } else {
    winnerKind = "product-b";
    winnerSlug = ctx.slugB;
  }
  const label = criterionSlug.replace(/-/g, " ");
  const lead =
    winnerKind === "tie"
      ? `${ctx.labelA} and ${ctx.labelB} are close on ${label}`
      : `${winnerSlug === ctx.slugA ? ctx.labelA : ctx.labelB} leads on ${label}`;
  return {
    criterionSlug,
    winnerKind,
    winnerSlug,
    reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from approved SoftwareGlimpse editorial assessments — not hands-on lab testing.`,
    confidence: "medium",
    supportingFactIds: [],
    assessmentIds: [ctx.assessmentA.id, ctx.assessmentB.id],
    researchStatus: "complete",
  };
}

function factualOutcome(
  criterionSlug: string,
  reason: string,
  winnerKind: WinnerKind = "depends",
  winnerSlug: string | null = null,
): Outcome {
  return {
    criterionSlug,
    winnerKind,
    winnerSlug,
    reason,
    confidence: "medium",
    supportingFactIds: [],
    researchStatus: "complete",
  };
}

function availabilityScore(value: string | undefined): number | null {
  if (!value || value === "unknown") return null;
  if (value === "supported") return 3;
  if (value === "limited" || value === "add-on" || value === "higher-plan-only") {
    return 2;
  }
  if (value === "not-supported") return 0;
  return 1;
}

function featureBundleOutcome(
  ctx: PairContext,
  criterionSlug: string,
  features: string[],
): Outcome {
  let scoreA = 0;
  let scoreB = 0;
  let known = 0;
  const notes: string[] = [];

  for (const feature of features) {
    const a = availabilityOf(ctx.enrichmentA, feature);
    const b = availabilityOf(ctx.enrichmentB, feature);
    const sa = availabilityScore(a);
    const sb = availabilityScore(b);
    if (sa == null && sb == null) continue;
    known += 1;
    if (sa != null) scoreA += sa;
    if (sb != null) scoreB += sb;
    if (sa != null && sb != null && sa !== sb) {
      const stronger = sa > sb ? ctx.labelA : ctx.labelB;
      notes.push(
        `${feature.replace(/-/g, " ")}: ${stronger} shows stronger researched availability (${a ?? "unknown"} vs ${b ?? "unknown"}).`,
      );
    }
  }

  if (known === 0) {
    return factualOutcome(
      criterionSlug,
      `Feature evidence for ${criterionSlug.replace(/-/g, " ")} is incomplete for one or both products — outcome depends on the buyer’s job.`,
    );
  }

  if (scoreA === scoreB) {
    const rows = features.map((feature) => ({
      feature,
      availabilityA: availabilityOf(ctx.enrichmentA, feature),
      availabilityB: availabilityOf(ctx.enrichmentB, feature),
    }));
    return factualOutcome(
      criterionSlug,
      notes[0] ??
        researchedAvailabilityTieReason(ctx.labelA, ctx.labelB, rows),
      "tie",
      null,
    );
  }

  const aWins = scoreA > scoreB;
  return factualOutcome(
    criterionSlug,
    notes[0] ??
      `${aWins ? ctx.labelA : ctx.labelB} has stronger researched coverage across ${features.join(", ").replace(/-/g, " ")}.`,
    aWins ? "product-a" : "product-b",
    aWins ? ctx.slugA : ctx.slugB,
  );
}

function freePlanLead(
  ctx: PairContext,
): { winnerKind: WinnerKind; winnerSlug: string | null } {
  const freeA = pricingOf(ctx.enrichmentA).hasFreePlan;
  const freeB = pricingOf(ctx.enrichmentB).hasFreePlan;
  if (freeA === true && freeB === false) {
    return { winnerKind: "product-a", winnerSlug: ctx.slugA };
  }
  if (freeB === true && freeA === false) {
    return { winnerKind: "product-b", winnerSlug: ctx.slugB };
  }
  if (freeA === true && freeB === true) {
    return { winnerKind: "tie", winnerSlug: null };
  }
  return { winnerKind: "depends", winnerSlug: null };
}

function bestFor(
  slug: string,
  assessment: ProductEditorialAssessment,
): { productSlug: string; scenarios: string[] } {
  const scenarios = (assessment.bestFor ?? []).slice(0, 3);
  return {
    productSlug: slug,
    scenarios:
      scenarios.length > 0
        ? scenarios
        : [`Teams evaluating ${slug} on current SoftwareGlimpse research`],
  };
}

function verdictFor(ctx: PairContext): string {
  const notesA = parseNotes(ctx.assessmentA.editorialNotes);
  const notesB = parseNotes(ctx.assessmentB.editorialNotes);
  const peer =
    ctx.primaryCategoryA === ctx.primaryCategoryB &&
    clustersAreSubstitutes(
      ctx.category,
      notesA.jobCluster,
      notesB.jobCluster,
      notesA.membershipRole,
      notesB.membershipRole,
      ctx.slugA,
      ctx.slugB,
    );
  if (!peer) {
    return `${ctx.labelA} and ${ctx.labelB} are not peer substitutes for the same job cluster. This researched comparison exists so every in-category pair is covered — choose the product whose job matches the work, not a universal winner. Confirm live vendor packaging.`;
  }
  const chooseA = ctx.assessmentA.bestFor?.[0];
  const chooseB = ctx.assessmentB.bestFor?.[0];
  const aLine = chooseA
    ? ` Choose ${ctx.labelA} when ${chooseA.replace(/\.$/, "")}.`
    : "";
  const bLine = chooseB
    ? ` Choose ${ctx.labelB} when ${chooseB.replace(/\.$/, "")}.`
    : "";
  return `There is no universal winner between ${ctx.labelA} and ${ctx.labelB}.${aLine}${bLine} Criterion scores come from approved SoftwareGlimpse editorial assessments and first-party research — not hands-on lab testing.`;
}

function pricingNotesFor(ctx: PairContext): string {
  return `${pricePhrase(ctx.labelA, ctx.enrichmentA)}. ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Affiliate economics excluded.`;
}

function finalize(
  ctx: PairContext,
  criterionSlugs: readonly string[],
  outcomes: Outcome[],
  topics: string,
): ComparisonInput {
  const slug = canonicalizeComparisonSlug([ctx.slugA, ctx.slugB]);
  const withFacts = softenUnfactedProductA(
    attachExistingSupportingFacts(ctx.slugA, ctx.slugB, outcomes),
  );
  const title = `${ctx.labelA} vs ${ctx.labelB}`;
  return {
    id: `cmp-${slug}`,
    slug,
    title,
    productSlugs: [ctx.slugA, ctx.slugB],
    categorySlug: ctx.category,
    criterionSlugs: [...criterionSlugs],
    outcomes: withFacts,
    verdict: verdictFor(ctx),
    overallWinnerKind: "depends",
    overallWinnerSlug: null,
    bestFor: [bestFor(ctx.slugA, ctx.assessmentA), bestFor(ctx.slugB, ctx.assessmentB)],
    summary: `Researched side-by-side comparison of ${ctx.labelA} and ${ctx.labelB} using ${ctx.category.replace(/-/g, " ")} comparison criteria. No universal winner — choose by job-cluster fit.`,
    pricingNotes: pricingNotesFor(ctx),
    methodologyVersion: "1.0.0",
    editorialStatus: "approved",
    metadata: {
      status: "published",
      researchStatus: "complete",
      publishedAt: PUBLISHED_AT,
      updatedAt: PUBLISHED_AT,
    },
    seo: {
      title: seoTitle(ctx.labelA, ctx.labelB),
      description: seoDescription(ctx.labelA, ctx.labelB, topics),
      indexable: true,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

function scoredOrFeatures(
  ctx: PairContext,
  criterionSlug: string,
  scoreKeys: string[],
  features: string[],
): Outcome {
  const scored = scoredOutcome(ctx, criterionSlug, scoreKeys);
  if ((scored.assessmentIds?.length ?? 0) > 0) return scored;
  return featureBundleOutcome(ctx, criterionSlug, features);
}

/** Prefer assessment wins; when scores tie/depends, use researched feature availability. */
function scoredPreferringFeatureDelta(
  ctx: PairContext,
  criterionSlug: string,
  scoreKeys: string[],
  features: readonly string[],
): Outcome {
  const scored = scoredOutcome(ctx, criterionSlug, scoreKeys);
  if (
    scored.winnerKind === "product-a" ||
    scored.winnerKind === "product-b"
  ) {
    return scored;
  }
  const feat = featureBundleOutcome(ctx, criterionSlug, [...features]);
  if (
    feat.winnerKind === "product-a" ||
    feat.winnerKind === "product-b"
  ) {
    return {
      ...feat,
      assessmentIds: scored.assessmentIds,
      supportingFactIds: [
        ...(scored.supportingFactIds ?? []),
        ...(feat.supportingFactIds ?? []),
      ],
    };
  }
  return scored;
}

function startingPriceOutcome(ctx: PairContext): Outcome {
  const priceA = pricingOf(ctx.enrichmentA).startingPriceMonthly;
  const priceB = pricingOf(ctx.enrichmentB).startingPriceMonthly;
  const base = factualOutcome(
    "starting-pricing",
    `${pricePhrase(ctx.labelA, ctx.enrichmentA)}; ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Better value depends on plan rungs, currency, and add-ons.`,
  );
  if (
    typeof priceA !== "number" ||
    typeof priceB !== "number" ||
    priceA <= 0 ||
    priceB <= 0 ||
    priceA === priceB
  ) {
    return base;
  }
  const cheaperIsA = priceA < priceB;
  const low = cheaperIsA ? priceA : priceB;
  const high = cheaperIsA ? priceB : priceA;
  // Require a clear researched floor gap (not noise on near-equal list prices).
  if (high < low * 1.2 && high - low < 5) return base;
  const winnerLabel = cheaperIsA ? ctx.labelA : ctx.labelB;
  const otherLabel = cheaperIsA ? ctx.labelB : ctx.labelA;
  return {
    ...base,
    winnerKind: cheaperIsA ? "product-a" : "product-b",
    winnerSlug: cheaperIsA ? ctx.slugA : ctx.slugB,
    reason: `${winnerLabel} publishes a lower researched starting floor ($${low}/mo vs $${high}/mo for ${otherLabel}). Confirm currency, renewals, and add-ons — not a total TCO winner.`,
    confidence: "medium",
  };
}

function valueForMoneyFromPrice(ctx: PairContext, scored: Outcome): Outcome {
  if (
    scored.winnerKind === "product-a" ||
    scored.winnerKind === "product-b"
  ) {
    return scored;
  }
  const priceA = pricingOf(ctx.enrichmentA).startingPriceMonthly;
  const priceB = pricingOf(ctx.enrichmentB).startingPriceMonthly;
  if (
    typeof priceA !== "number" ||
    typeof priceB !== "number" ||
    priceA <= 0 ||
    priceB <= 0 ||
    priceA === priceB
  ) {
    return scored;
  }
  const cheaperIsA = priceA < priceB;
  const low = cheaperIsA ? priceA : priceB;
  const high = cheaperIsA ? priceB : priceA;
  if (high < low * 1.2 && high - low < 5) return scored;
  const winnerLabel = cheaperIsA ? ctx.labelA : ctx.labelB;
  const otherLabel = cheaperIsA ? ctx.labelB : ctx.labelA;
  return {
    ...scored,
    winnerKind: cheaperIsA ? "product-a" : "product-b",
    winnerSlug: cheaperIsA ? ctx.slugA : ctx.slugB,
    reason: `${winnerLabel} has the lower researched starting floor ($${low}/mo vs $${high}/mo for ${otherLabel}) while editorial value scores are close. Confirm renewals and seat math.`,
    confidence: "medium",
  };
}

function buildMarketing(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    scoredPreferringFeatureDelta(
      ctx,
      "campaign-content",
      ["campaign-content"],
      MARKETING_FEATURES["campaign-content"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "marketing-automation",
      ["marketing-automation"],
      MARKETING_FEATURES["marketing-automation"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "funnel-conversion",
      ["funnel-conversion"],
      MARKETING_FEATURES["funnel-conversion"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "analytics-attribution",
      ["analytics-attribution"],
      MARKETING_FEATURES["analytics-attribution"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "brand-monitoring",
      ["brand-monitoring"],
      MARKETING_FEATURES["brand-monitoring"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "integrations",
      ["integrations"],
      MARKETING_FEATURES.integrations,
    ),
    scoredOutcome(ctx, "scalability", ["scalability"]),
    valueForMoneyOutcome(ctx),
    scoredPreferringFeatureDelta(
      ctx,
      "ai-capabilities",
      ["ai-capabilities"],
      MARKETING_FEATURES["ai-capabilities"],
    ),
  ];
  return finalize(
    ctx,
    MARKETING_CRITERIA,
    outcomes,
    "campaign content, automation, funnels, listening, integrations, and value",
  );
}

function buildBc(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    factualOutcome(
      "starting-pricing",
      `${pricePhrase(ctx.labelA, ctx.enrichmentA)}; ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Better value depends on seat minimums and add-ons.`,
    ),
    factualOutcome(
      "user-minimum",
      `Check seat or licence minimums for ${ctx.labelA} and ${ctx.labelB} on current vendor packaging — not inferred beyond researched pricing notes.`,
    ),
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    featureBundleOutcome(ctx, "number-coverage", ["cloud-phone"]),
    scoredOrFeatures(ctx, "power-dialer", ["power-dialer", "outbound-tools"], [
      "power-dialer",
    ]),
    featureBundleOutcome(ctx, "whatsapp-business", ["whatsapp-business"]),
    scoredOutcome(ctx, "crm-integrations", [
      "integrations",
      "crm-sync",
      "crm-integrations",
    ]),
    scoredOutcome(ctx, "routing", ["routing-workflows", "routing"]),
    scoredOutcome(ctx, "analytics", ["analytics", "reporting"]),
    scoredOutcome(ctx, "ai-features", ["ai-capabilities", "ai-features"]),
    valueForMoneyOutcome(ctx),
  ];
  return finalize(
    ctx,
    BC_CRITERIA,
    outcomes,
    "pricing, ease of use, dialer tooling, routing, CRM sync, and value",
  );
}

function buildEm(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    factualOutcome(
      "starting-pricing",
      `${pricePhrase(ctx.labelA, ctx.enrichmentA)}; ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Contact-based packaging can change the real TCO.`,
    ),
    factualOutcome(
      "contact-limits",
      `Contact and profile limits for ${ctx.labelA} and ${ctx.labelB} should be confirmed on live vendor pricing — current research records plan models, not a universal cheaper winner.`,
    ),
    factualOutcome(
      "email-limits",
      `Email send limits depend on plan rungs for ${ctx.labelA} and ${ctx.labelB}. Confirm current send and automation caps before purchase.`,
    ),
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    scoredOutcome(ctx, "automation", ["automation", "sales-automation"]),
    scoredOrFeatures(ctx, "templates", ["templates", "email-creation", "email-capabilities"], [
      "email-templates",
    ]),
    scoredOutcome(ctx, "segmentation", ["segmentation"]),
    scoredOrFeatures(ctx, "landing-pages", ["landing-pages"], ["landing-pages"]),
    scoredOutcome(ctx, "analytics", ["analytics", "reporting"]),
    scoredOrFeatures(ctx, "integrations", ["integrations"], [
      "integrations",
      "forms",
      "email-sync",
    ]),
    scoredOutcome(ctx, "ai-features", ["ai-capabilities", "ai-features"]),
    valueForMoneyOutcome(ctx),
  ];
  return finalize(
    ctx,
    EM_CRITERIA,
    outcomes,
    "pricing, ease of use, automation, templates, segmentation, integrations, and value",
  );
}

function buildPm(ctx: PairContext): ComparisonInput {
  const free = freePlanLead(ctx);
  const outcomes: Outcome[] = [
    factualOutcome(
      "starting-pricing",
      `${pricePhrase(ctx.labelA, ctx.enrichmentA)}; ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Seat minimums and AI credits can change TCO.`,
    ),
    factualOutcome(
      "seat-minimum",
      `Check paid seat floors for ${ctx.labelA} and ${ctx.labelB} on current vendor packaging.`,
    ),
    factualOutcome(
      "free-plan",
      `${freePlanPhrase(ctx.labelA, ctx.enrichmentA)}; ${freePlanPhrase(ctx.labelB, ctx.enrichmentB)}.`,
      free.winnerKind,
      free.winnerSlug,
    ),
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    scoredOrFeatures(ctx, "timeline-gantt", ["work-planning", "timeline-gantt"], [
      "timeline-gantt",
    ]),
    scoredOrFeatures(
      ctx,
      "automations",
      ["automation-workflows", "automations"],
      ["automations-workflows"],
    ),
    scoredOutcome(ctx, "collaboration", ["collaboration"]),
    scoredOutcome(ctx, "integrations", ["integrations"]),
    scoredOutcome(ctx, "ai-features", ["ai-capabilities", "ai-features"]),
    scoredOutcome(ctx, "reporting", ["reporting"]),
    valueForMoneyOutcome(ctx),
  ];
  return finalize(
    ctx,
    PM_CRITERIA,
    outcomes,
    "pricing, ease of use, timelines, automations, collaboration, and value",
  );
}

function buildHr(ctx: PairContext): ComparisonInput {
  const free = freePlanLead(ctx);
  const outcomes: Outcome[] = [
    startingPriceOutcome(ctx),
    factualOutcome(
      "free-plan",
      `${freePlanPhrase(ctx.labelA, ctx.enrichmentA)}; ${freePlanPhrase(ctx.labelB, ctx.enrichmentB)}.`,
      free.winnerKind,
      free.winnerSlug,
    ),
    factualOutcome(
      "user-minimum",
      `Check employee or licence minimums for ${ctx.labelA} and ${ctx.labelB} on current vendor packaging.`,
    ),
    // Prefer hiring/job-fit scores; ease-of-use is a separate signal when those tie.
    scoredPreferringFeatureDelta(
      ctx,
      "hiring-workforce-fit",
      ["hiring-workforce-fit", "hr-job-fit", "ease-of-use"],
      [
        "applicant-tracking",
        "career-site-job-boards",
        "interview-scheduling",
      ],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "workflow-depth",
      ["workflow-depth", "core-hris", "payroll-processing"],
      HR_WORKFLOW_FEATURES,
    ),
    scoredPreferringFeatureDelta(ctx, "integrations", ["integrations"], [
      ...HR_FEATURE_CRITERIA.integrations,
    ]),
    scoredPreferringFeatureDelta(
      ctx,
      "mobile-frontline",
      ["mobile-frontline"],
      HR_FEATURE_CRITERIA["mobile-frontline"],
    ),
    scoredOutcome(ctx, "analytics", ["analytics", "reporting"]),
    scoredOutcome(ctx, "scalability", ["scalability"]),
    valueForMoneyOutcome(ctx),
    scoredOutcome(ctx, "ai-capabilities", ["ai-capabilities", "ai-features"]),
  ];
  return finalize(
    ctx,
    HR_CRITERIA,
    outcomes,
    "pricing, hiring fit, workflow depth, integrations, mobile, analytics, and value",
  );
}

function pricingFactuals(
  ctx: PairContext,
  extras: Array<"user-minimum" | "agent-minimum"> = ["user-minimum"],
): Outcome[] {
  const free = freePlanLead(ctx);
  const rows: Outcome[] = [
    factualOutcome(
      "starting-pricing",
      `${pricePhrase(ctx.labelA, ctx.enrichmentA)}; ${pricePhrase(ctx.labelB, ctx.enrichmentB)}. Better value depends on plan rungs and add-ons.`,
    ),
    factualOutcome(
      "free-plan",
      `${freePlanPhrase(ctx.labelA, ctx.enrichmentA)}; ${freePlanPhrase(ctx.labelB, ctx.enrichmentB)}.`,
      free.winnerKind,
      free.winnerSlug,
    ),
  ];
  for (const extra of extras) {
    rows.push(
      factualOutcome(
        extra,
        `Check ${extra.replace(/-/g, " ")} for ${ctx.labelA} and ${ctx.labelB} on current vendor packaging.`,
      ),
    );
  }
  return rows;
}

function valueForMoneyOutcome(ctx: PairContext): Outcome {
  const scored = scoredOutcome(ctx, "value-for-money", ["value-for-money"]);
  const free = freePlanLead(ctx);
  if (
    (scored.winnerKind === "tie" || scored.winnerKind === "depends") &&
    (free.winnerKind === "product-a" || free.winnerKind === "product-b")
  ) {
    const label =
      free.winnerSlug === ctx.slugA ? ctx.labelA : ctx.labelB;
    const other =
      free.winnerSlug === ctx.slugA ? ctx.labelB : ctx.labelA;
    return {
      ...scored,
      winnerKind: free.winnerKind,
      winnerSlug: free.winnerSlug,
      reason: `${label} researches a free plan; ${other} does not in current verified pricing. Editorial value scores are close.`,
      confidence: "medium",
    };
  }
  return valueForMoneyFromPrice(ctx, scored);
}

function buildSi(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    scoredPreferringFeatureDelta(
      ctx,
      "contact-data",
      ["contact-data", "data-enrichment", "features"],
      SI_FEATURES["contact-data"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "prospecting",
      ["prospecting", "sales-automation", "data-enrichment"],
      SI_FEATURES.prospecting,
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "email-outreach",
      ["email-outreach", "email-capabilities"],
      SI_FEATURES["email-outreach"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "integrations",
      ["integrations", "crm-sync"],
      SI_FEATURES.integrations,
    ),
    valueForMoneyOutcome(ctx),
  ];
  return finalize(
    ctx,
    SI_CRITERIA,
    outcomes,
    "contact data, prospecting, outreach, integrations, and value",
  );
}

function buildCs(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    ...pricingFactuals(ctx, ["agent-minimum"]),
    featureBundleOutcome(ctx, "ticketing-depth", ["ticketing", "macros-automation"]),
    featureBundleOutcome(ctx, "live-chat", ["live-chat", "shared-inbox"]),
    featureBundleOutcome(ctx, "knowledge-base", [
      "knowledge-base",
      "self-service-portal",
    ]),
    featureBundleOutcome(ctx, "omnichannel", [
      "omnichannel-inbox",
      "unified-inbox",
      "shared-inbox",
    ]),
    featureBundleOutcome(ctx, "sla-routing", ["sla-routing", "ticketing"]),
    featureBundleOutcome(ctx, "ecommerce-helpdesk", [
      "ecommerce-helpdesk",
      "ticketing",
    ]),
    scoredOutcome(ctx, "ai-features", ["ai-capabilities", "ai-features"]),
    scoredOutcome(ctx, "integrations", ["integrations"]),
  ];
  return finalize(
    ctx,
    CS_CRITERIA,
    outcomes,
    "ticketing, live chat, knowledge base, omnichannel, and AI",
  );
}

function buildAi(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    ...pricingFactuals(ctx),
    scoredOutcome(ctx, "llm-chat-depth", [
      "llm-chat-depth",
      "model-capability",
      "ai-job-fit",
    ]),
    scoredOutcome(ctx, "writing-depth", ["writing-depth", "output-quality"]),
    featureBundleOutcome(ctx, "voice-depth", ["voice-tts", "meeting-notes"]),
    featureBundleOutcome(ctx, "agent-depth", ["agent-builder", "custom-projects"]),
    scoredOutcome(ctx, "governance", ["governance", "governance-privacy"]),
    scoredOutcome(ctx, "integrations", ["integrations"]),
    scoredOutcome(ctx, "usage-model", ["usage-model", "value-for-money"]),
  ];
  return finalize(
    ctx,
    AI_CRITERIA,
    outcomes,
    "pricing, LLM depth, writing, voice, agents, and governance",
  );
}

function buildIt(ctx: PairContext): ComparisonInput {
  // Prefer assessment deltas; when scores tie, fall back to researched feature
  // availability and published starting floors so cross-job and close peers
  // still surface first-party differences (not flag-only indexability).
  const free = freePlanLead(ctx);
  const outcomes: Outcome[] = [
    startingPriceOutcome(ctx),
    factualOutcome(
      "free-plan",
      `${freePlanPhrase(ctx.labelA, ctx.enrichmentA)}; ${freePlanPhrase(ctx.labelB, ctx.enrichmentB)}.`,
      free.winnerKind,
      free.winnerSlug,
    ),
    factualOutcome(
      "user-minimum",
      `Check seat, agent, or licence minimums for ${ctx.labelA} and ${ctx.labelB} on current vendor packaging.`,
    ),
    scoredOutcome(ctx, "ease-of-use", ["ease-of-use"]),
    scoredPreferringFeatureDelta(
      ctx,
      "it-job-fit",
      ["it-job-fit"],
      IT_JOB_FEATURES,
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "workflow-depth",
      ["workflow-depth"],
      IT_WORKFLOW_FEATURES,
    ),
    scoredOutcome(ctx, "integrations", ["integrations"]),
    scoredOutcome(ctx, "security-admin", [
      "admin-security",
      "security-admin",
    ]),
    scoredOutcome(ctx, "scalability", ["scalability"]),
    valueForMoneyOutcome(ctx),
    scoredPreferringFeatureDelta(
      ctx,
      "ai-capabilities",
      ["ai-capabilities"],
      IT_AI_FEATURES,
    ),
  ];
  return finalize(
    ctx,
    IT_CRITERIA,
    outcomes,
    "pricing, job fit, workflow depth, security, scalability, and value",
  );
}

function buildEcom(ctx: PairContext): ComparisonInput {
  const outcomes: Outcome[] = [
    startingPriceOutcome(ctx),
    scoredPreferringFeatureDelta(
      ctx,
      "ease-of-use",
      ["ease-of-use"],
      ECOM_FEATURES["storefront-commerce-fit"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "storefront-commerce-fit",
      ["storefront-commerce-fit"],
      ECOM_FEATURES["storefront-commerce-fit"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "catalog-orders-depth",
      ["catalog-orders-depth"],
      ECOM_FEATURES["catalog-orders-depth"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "checkout-conversion",
      ["checkout-conversion"],
      ECOM_FEATURES["checkout-conversion"],
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "integrations",
      ["integrations"],
      ECOM_FEATURES.integrations,
    ),
    scoredPreferringFeatureDelta(
      ctx,
      "omnichannel-pos",
      ["omnichannel-pos"],
      ECOM_FEATURES["omnichannel-pos"],
    ),
    valueForMoneyOutcome(ctx),
    scoredPreferringFeatureDelta(
      ctx,
      "ai-capabilities",
      ["ai-capabilities"],
      ECOM_FEATURES["ai-capabilities"],
    ),
  ];
  return finalize(
    ctx,
    ECOM_CRITERIA,
    outcomes,
    "ease of use, storefront fit, catalog, checkout, POS, integrations, and value",
  );
}

function buildPair(ctx: PairContext): ComparisonInput {
  switch (ctx.category) {
    case "marketing":
      return buildMarketing(ctx);
    case "business-communications":
      return buildBc(ctx);
    case "email-marketing":
      return buildEm(ctx);
    case "project-management":
      return buildPm(ctx);
    case "hr":
      return buildHr(ctx);
    case "sales-intelligence":
      return buildSi(ctx);
    case "customer-service":
      return buildCs(ctx);
    case "ai":
      return buildAi(ctx);
    case "it-development":
      return buildIt(ctx);
    case "ecommerce":
      return buildEcom(ctx);
  }
}

export type EligibleCompetitorPair = {
  category: CompetitorPairCategory;
  slugA: string;
  slugB: string;
  canonicalSlug: string;
};

const COMPETITOR_PAIR_CATEGORY_SET = new Set<string>(COMPETITOR_PAIR_CATEGORIES);

function competitorPairCategoryFor(
  listingCategory: string | undefined,
  otherCategory: string | undefined,
): CompetitorPairCategory | null {
  if (listingCategory && COMPETITOR_PAIR_CATEGORY_SET.has(listingCategory)) {
    return listingCategory as CompetitorPairCategory;
  }
  if (otherCategory && COMPETITOR_PAIR_CATEGORY_SET.has(otherCategory)) {
    return otherCategory as CompetitorPairCategory;
  }
  return null;
}

function pushPairIfEligible(
  out: EligibleCompetitorPair[],
  seen: Set<string>,
  assessments: Map<string, ProductEditorialAssessment | null>,
  category: CompetitorPairCategory,
  left: string,
  right: string,
): void {
  const [slugA, slugB] = sortProductPair([left, right]);
  const canonicalSlug = canonicalizeComparisonSlug([slugA, slugB]);
  if (seen.has(canonicalSlug)) return;
  const assessmentOf = (slug: string) => {
    if (!assessments.has(slug)) assessments.set(slug, loadAssessment(slug));
    return assessments.get(slug) ?? null;
  };
  const assessmentA = assessmentOf(slugA);
  const assessmentB = assessmentOf(slugB);
  if (assessmentA?.status !== "approved" || assessmentB?.status !== "approved") {
    return;
  }
  seen.add(canonicalSlug);
  out.push({ category, slugA, slugB, canonicalSlug });
}

function listInCategoryPairs(
  category: CompetitorPairCategory,
  published: ReturnType<typeof publishedProducts>,
  seen: Set<string>,
  assessments: Map<string, ProductEditorialAssessment | null>,
): EligibleCompetitorPair[] {
  const out: EligibleCompetitorPair[] = [];
  const products = published
    .filter((item) => item.primaryCategorySlug === category)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  for (let i = 0; i < products.length; i += 1) {
    for (let j = i + 1; j < products.length; j += 1) {
      pushPairIfEligible(
        out,
        seen,
        assessments,
        category,
        products[i]!.slug,
        products[j]!.slug,
      );
    }
  }
  return out;
}

function listCrossCategoryCompetitorPairs(
  published: ReturnType<typeof publishedProducts>,
  seen: Set<string>,
  assessments: Map<string, ProductEditorialAssessment | null>,
): EligibleCompetitorPair[] {
  const bySlug = new Map(published.map((item) => [item.slug, item]));
  const out: EligibleCompetitorPair[] = [];
  for (const product of published) {
    for (const competitorSlug of product.competitorSlugs ?? []) {
      const other = bySlug.get(competitorSlug);
      if (!other) continue;
      if (product.primaryCategorySlug === other.primaryCategorySlug) continue;
      const category = competitorPairCategoryFor(
        product.primaryCategorySlug,
        other.primaryCategorySlug,
      );
      if (!category) continue;
      pushPairIfEligible(
        out,
        seen,
        assessments,
        category,
        product.slug,
        other.slug,
      );
    }
  }
  return out;
}

export function listEligibleCompetitorPairs(
  category?: CompetitorPairCategory,
): EligibleCompetitorPair[] {
  const published = publishedProducts();
  const seen = new Set<string>();
  const assessments = new Map<string, ProductEditorialAssessment | null>();
  if (category) {
    return listInCategoryPairs(category, published, seen, assessments);
  }
  const out: EligibleCompetitorPair[] = [];
  for (const cat of COMPETITOR_PAIR_CATEGORIES) {
    out.push(...listInCategoryPairs(cat, published, seen, assessments));
  }
  out.push(
    ...listCrossCategoryCompetitorPairs(published, seen, assessments),
  );
  return out;
}

export function buildCompetitorPairComparisonsFromResearch(): ComparisonInput[] {
  const published = publishedProducts();
  const labels = new Map(published.map((item) => [item.slug, item.name]));
  const primaryCategory = new Map(
    published.map((item) => [item.slug, item.primaryCategorySlug ?? ""]),
  );
  const assessmentCache = new Map<string, ProductEditorialAssessment | null>();
  const enrichmentCache = new Map<string, ProductResearchEnrichment | null>();
  const assessment = (slug: string) => {
    if (!assessmentCache.has(slug)) assessmentCache.set(slug, loadAssessment(slug));
    return assessmentCache.get(slug) ?? null;
  };
  const enrichment = (slug: string) => {
    if (!enrichmentCache.has(slug)) enrichmentCache.set(slug, loadEnrichment(slug));
    return enrichmentCache.get(slug) ?? null;
  };

  const out: ComparisonInput[] = [];
  for (const pair of listEligibleCompetitorPairs()) {
    const assessmentA = assessment(pair.slugA);
    const assessmentB = assessment(pair.slugB);
    if (!assessmentA || !assessmentB) continue;
    const ctx: PairContext = {
      category: pair.category,
      slugA: pair.slugA,
      slugB: pair.slugB,
      labelA: labels.get(pair.slugA) ?? pair.slugA,
      labelB: labels.get(pair.slugB) ?? pair.slugB,
      primaryCategoryA: primaryCategory.get(pair.slugA) ?? pair.category,
      primaryCategoryB: primaryCategory.get(pair.slugB) ?? pair.category,
      assessmentA,
      assessmentB,
      enrichmentA: enrichment(pair.slugA),
      enrichmentB: enrichment(pair.slugB),
    };
    const built = buildPair(ctx);
    out.push(built);
  }
  return out;
}

export function competitorPairMaterializeReport(
  comparisons: ComparisonInput[] = buildCompetitorPairComparisonsFromResearch(),
) {
  const byCategory = new Map<string, number>();
  for (const comparison of comparisons) {
    const category = comparison.categorySlug ?? "unknown";
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
  }
  return {
    pairCount: comparisons.length,
    indexable: comparisons.filter((item) => item.seo?.indexable).length,
    approved: comparisons.filter((item) => item.editorialStatus === "approved")
      .length,
    byCategory: Object.fromEntries(byCategory),
    skippedNonSubstitutes: {
      "foxit-vs-monday": !comparisons.some((item) => item.slug === "foxit-vs-monday"),
    },
  };
}
