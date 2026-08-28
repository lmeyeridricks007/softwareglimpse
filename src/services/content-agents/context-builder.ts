import {
  AgentContextSchema,
  PricingSchema,
  type AgentContext,
  type AgentExecutionMode,
  type AgentRunTask,
  type ContentAgentId,
  type SearchIntentKind,
  type Software,
} from "@/domain";
import { getCtaBudget } from "@/services/editorial/cta-rules";
import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getRelationships,
  getSoftwareBySlug,
} from "@/data";
import { listCategoryKnowledgeMaps } from "@/data/content-clusters/knowledge";
import { loadCandidateSoftware } from "@/data/onboarding/store";
import {
  getMethodologyBySlug,
  loadAssessment,
  listDrafts,
} from "@/data/editorial/store";
import { loadEnrichment, loadFacts } from "@/data/research/store";
import { emailMarketingDefinition } from "@/data/category-onboarding/seed/email-marketing";
import { crmMethodology } from "@/data/seed/crm-methodology";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";

const HANDS_ON_PROHIBITED = [
  "we tested",
  "we tried",
  "hands-on testing",
  "in our testing",
  "we used it for",
  "our team used",
  "after using it",
];

const DEFAULT_PROHIBITED = [
  "Invented statistics or market-share percentages",
  "Unsourced dollar amounts or seat counts",
  "Affiliate-driven ranking claims",
];

export type BuildAgentContextOptions = {
  agentId: ContentAgentId;
  task?: AgentRunTask;
  productSlugs?: string[];
  categorySlugs?: string[];
  targetSlug?: string;
  mode?: AgentExecutionMode;
  changeEvents?: AgentContext["changeEvents"];
  /** When true, include normalized fixture facts for onboarding POC drafts only. */
  allowNormalizedFacts?: boolean;
};

function claimFromFact(value: unknown, field: string): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return `${field}: ${String(value)}`;
  }
  if (value && typeof value === "object") {
    try {
      return `${field}: ${JSON.stringify(value)}`;
    } catch {
      return field;
    }
  }
  return field;
}

export function resolveSoftware(slug: string): Software | null {
  return (
    getSoftwareBySlug(slug, { includeUnpublished: true }) ??
    loadCandidateSoftware(slug)
  );
}

function intentFor(agentId: ContentAgentId): SearchIntentKind {
  switch (agentId) {
    case "software-review-agent":
      return "evaluate-one-product";
    case "pricing-page-agent":
      return "understand-cost";
    case "comparison-agent":
      return "decide-between-products";
    case "alternatives-agent":
      return "replace-product";
    case "best-software-agent":
      return "shortlist-products";
    case "category-hub-agent":
      return "discover-category";
    case "use-case-page-agent":
      return "shortlist-products";
    case "guide-agent":
      return "learn-solve";
    case "internal-link-agent":
      return "link-graph";
    case "refresh-agent":
      return "refresh-existing";
    case "qa-agent":
      return "quality-assurance";
    case "category-knowledge-planner-agent":
      return "plan-category-knowledge";
    case "product-knowledge-planner-agent":
      return "plan-product-knowledge";
    case "supporting-content-planner-agent":
      return "plan-supporting-content";
  }
}

function pageTypeFor(agentId: ContentAgentId): Parameters<typeof getCtaBudget>[0] {
  switch (agentId) {
    case "software-review-agent":
      return "software-review";
    case "pricing-page-agent":
      return "pricing";
    case "comparison-agent":
      return "comparison";
    case "alternatives-agent":
      return "alternatives";
    case "best-software-agent":
      return "best";
    case "category-hub-agent":
      return "category-hub";
    case "use-case-page-agent":
      return "use-case";
    case "guide-agent":
      return "guide";
    case "refresh-agent":
      return "software-review";
    case "internal-link-agent":
    case "qa-agent":
      return "guide";
    case "category-knowledge-planner-agent":
    case "product-knowledge-planner-agent":
    case "supporting-content-planner-agent":
      return "knowledge-plan";
  }
}

function resolveMethodology(categorySlug?: string) {
  if (!categorySlug) return undefined;
  if (categorySlug === "crm") {
    return {
      slug: crmMethodology.slug,
      version: crmMethodology.version,
      name: crmMethodology.name,
    };
  }
  if (categorySlug === "email-marketing" || categorySlug === "marketing") {
    const m = emailMarketingDefinition.editorialMethodology;
    return { slug: m.slug, version: m.version, name: m.name };
  }
  const fromStore = getMethodologyBySlug(`${categorySlug}-editorial`);
  if (fromStore) {
    return {
      slug: fromStore.slug,
      version: fromStore.version,
      name: fromStore.name,
    };
  }
  return undefined;
}

function buildPricingSummary(productSlug: string) {
  const enrichment = loadEnrichment(productSlug);
  const software = resolveSoftware(productSlug);
  const pricingRaw = enrichment?.pricing ?? software?.pricing;
  const parsed = pricingRaw
    ? PricingSchema.safeParse(normalizePricingInput(pricingRaw))
    : null;
  const pricing = parsed?.success ? parsed.data : undefined;
  const planCount = pricing?.plans?.length ?? 0;
  const pricingFacts = loadFacts(productSlug).filter(
    (f) =>
      (f.domain === "pricing" || f.domain === "plans") &&
      (f.status === "approved" || f.status === "verified"),
  );
  const checkedAt = enrichment?.domainCheckedAt?.pricing;
  let criticallyStale = false;
  if (checkedAt) {
    const ageMs = Date.now() - new Date(checkedAt).getTime();
    criticallyStale = ageMs > 1000 * 60 * 60 * 24 * 180;
  } else if (planCount > 0) {
    criticallyStale = true;
  }

  const engineExamples =
    pricing?.plans
      ?.flatMap((plan) =>
        (plan.rules ?? []).flatMap((rule) => {
          if ("amountPerSeat" in rule && typeof rule.amountPerSeat === "number") {
            return [
              {
                label: `${plan.name} per-seat`,
                amount: rule.amountPerSeat,
                factId: pricingFacts[0]?.id,
              },
            ];
          }
          if ("amount" in rule && typeof rule.amount === "number") {
            return [
              {
                label: `${plan.name} flat`,
                amount: rule.amount,
                factId: pricingFacts[0]?.id,
              },
            ];
          }
          return [];
        }),
      )
      .slice(0, 6) ?? [];

  return {
    verified: pricingFacts.length > 0 && planCount > 0,
    criticallyStale,
    modelSupported: planCount > 0,
    planCount,
    engineExamples,
    caveats: pricing?.notes ? [pricing.notes] : [],
  };
}

/**
 * Build constrained agent context for a task.
 * Never includes affiliate commission, payout %, or revenue fields.
 */
export function buildAgentContext(
  options: BuildAgentContextOptions,
): AgentContext {
  const productSlugs =
    options.productSlugs ??
    options.task?.productIds ??
    [];
  const categorySlugs =
    options.categorySlugs ??
    options.task?.categoryIds ??
    [];
  const mode = options.mode ?? options.task?.mode ?? "CREATE";
  const targetSlug =
    options.targetSlug ??
    options.task?.targetSlug ??
    (options.agentId === "comparison-agent" && productSlugs.length >= 2
      ? [...productSlugs].sort().join("-vs-")
      : productSlugs[0] ?? categorySlugs[0] ?? "unknown");

  const products = productSlugs
    .map((s) => resolveSoftware(s))
    .filter((p): p is Software => Boolean(p));

  const allowNormalized = options.allowNormalizedFacts === true;
  const factStatuses = allowNormalized
    ? new Set(["approved", "verified", "normalized"])
    : new Set(["approved", "verified"]);

  const facts = productSlugs.flatMap((slug) =>
    loadFacts(slug)
      .filter((f) => factStatuses.has(f.status))
      .map((f) => ({
        id: f.id,
        domain: f.domain,
        claim: claimFromFact(f.value, f.field),
        value: f.value,
        sourceIds: f.sourceIds ?? [],
        status: f.status,
      })),
  );

  const editorialAssessments = productSlugs.flatMap((slug) => {
    const assessment = loadAssessment(slug);
    if (!assessment) return [];
    return assessment.criterionAssessments.map((c) => ({
      productSlug: slug,
      criterionSlug: c.criterionSlug,
      score: c.score,
      rationale: c.rationale,
      supportingFactIds: c.supportingFactIds ?? [],
      confidence: c.confidence,
    }));
  });

  const primaryCategory =
    categorySlugs[0] ?? products[0]?.primaryCategorySlug ?? undefined;
  const methodology = (() => {
    const fromAssessment = productSlugs
      .map((s) => loadAssessment(s))
      .find(Boolean);
    if (fromAssessment) {
      return {
        slug: fromAssessment.methodologySlug,
        version: fromAssessment.methodologyVersion,
        name: getMethodologyBySlug(fromAssessment.methodologySlug)?.name,
      };
    }
    return resolveMethodology(primaryCategory);
  })();

  const graph = getRelationships();
  const relationships = graph
    .filter(
      (r) =>
        productSlugs.includes(r.source) || productSlugs.includes(r.target),
    )
    .filter(
      (r) =>
        r.type === "alternative-to" ||
        r.type === "competes-with" ||
        r.type === "related-to",
    )
    .map((r) => ({
      type: r.type,
      sourceSlug: r.source,
      targetSlug: r.target,
      status: "approved",
      reason: r.reason ?? r.reasonCode,
    }));

  const bestPage =
    options.agentId === "best-software-agent" ||
    options.agentId === "use-case-page-agent"
      ? getAllBestPagesUnfiltered().find(
          (b) =>
            b.slug === targetSlug ||
            b.categorySlug === (categorySlugs[0] ?? targetSlug),
        )
      : undefined;

  const approvedRanking =
    bestPage?.recommendations
      .filter((r) => r.approved || options.agentId === "best-software-agent")
      .map((r, index) => ({
        productSlug: r.productSlug,
        rank: index + 1,
        label: r.recommendationLabel,
        rationale: r.rationale,
        approved: r.approved === true,
      })) ?? [];

  const pricingSummary =
    productSlugs[0] != null
      ? buildPricingSummary(productSlugs[0])
      : undefined;

  const handsOn = productSlugs.some(
    (s) => loadAssessment(s)?.handsOnTesting === true,
  );

  const productLabels: Record<string, string> = {};
  for (const p of products) {
    productLabels[p.slug] = p.name;
  }
  for (const slug of productSlugs) {
    if (!productLabels[slug]) productLabels[slug] = slug;
  }

  // Strip anything affiliate-economic if present on software.affiliate
  // (only structural flags allowed — never commission/revenue)
  const notes: string[] = [
    "Affiliate commercial economics (payouts/revenue) are excluded from this context.",
  ];
  if (allowNormalized) {
    notes.push(
      "allowNormalizedFacts=true: normalized fixture facts included for draft POC — QA must still enforce publication bars.",
    );
  }

  if (options.agentId === "guide-agent") {
    const maps = listCategoryKnowledgeMaps();
    for (const map of maps) {
      const topic = map.topics.find((t) => t.suggestedSlug === targetSlug);
      if (!topic) continue;
      notes.push(`Supporting topic type: ${topic.topicType}`);
      notes.push(`User journey stage: ${topic.journeyStage}`);
      notes.push(
        `Supports anchors: ${topic.supportsContentIds.join(", ") || "(none)"}`,
      );
      if (topic.nextActionContentId) {
        notes.push(
          `Intended next action: ${topic.nextActionLabel ?? topic.nextActionContentId}`,
        );
      }
      if (topic.intentClusterKeys.length) {
        notes.push(
          `SEO query cluster keys: ${topic.intentClusterKeys.join("; ")}`,
        );
      }
      notes.push(
        "Prefer structured GuideContentBlock recipes (DirectAnswer, DecisionFramework, FeatureMatrix, CostBreakdown, Scorecard, TrialPlan, InteractiveCTA) over thin H2 essays. Visuals must be HTML/CSS components. Never invent catalogue products. Minimize direct affiliate CTAs — funnel Learn → Best/Pricing → Finder → Compare/Review.",
      );
      notes.push(
        "Reuse softwareglimpse-guide-template-v1 (src/components/guides/guide-template.ts + .sg-guide-* CSS). Selection guides: Quick Answer in hero belowCta; pastel multi-color icon chips; TipCallout; GuideSidebar Finder CTA. Commercial visits via SoftwareCta / AffiliateLink (direct affiliate URL, rel=sponsored). Evidence links use ExternalLink — never affiliate URLs as sources.",
      );
      break;
    }
  }

  const comparison = getAllComparisonsUnfiltered().find(
    (c) => c.slug === targetSlug,
  );
  if (comparison && options.agentId === "comparison-agent") {
    notes.push(
      `Comparison relationship loaded for ${comparison.slug}; outcomes may be tie/depends.`,
    );
  }

  const existingDrafts = listDrafts(pageTypeFor(options.agentId), targetSlug);
  if (existingDrafts.length > 0 && mode === "CREATE") {
    notes.push(
      `Existing drafts found for ${targetSlug} — prefer REFRESH/REWRITE over duplicate CREATE.`,
    );
  }

  const ctaBudget = getCtaBudget(pageTypeFor(options.agentId));

  return AgentContextSchema.parse({
    agentId: options.agentId,
    mode,
    primaryIntent: intentFor(options.agentId),
    productSlugs,
    categorySlugs:
      categorySlugs.length > 0
        ? categorySlugs
        : primaryCategory
          ? [primaryCategory]
          : [],
    targetSlug,
    contentId: options.task?.targetContentId,
    facts,
    editorialAssessments,
    methodology,
    pricingSummary,
    relationships,
    approvedRanking,
    seo: {
      primaryIntent: intentFor(options.agentId),
      targetQueries: [],
      opportunityIds: [],
    },
    changeEvents: options.changeEvents ?? [],
    internalLinkOpportunities: [],
    ctaBudget,
    prohibitedClaims: [
      ...DEFAULT_PROHIBITED,
      ...(handsOn ? [] : HANDS_ON_PROHIBITED),
    ],
    handsOnTestingAllowed: handsOn,
    productLabels,
    snapshot: {
      productUpdatedAt: products[0]?.metadata?.updatedAt,
      researchSnapshotIds: [],
      factIds: facts.map((f) => f.id),
      methodologySlug: methodology?.slug,
      methodologyVersion: methodology?.version,
      pricingFreshnessAt: loadEnrichment(productSlugs[0] ?? "")?.domainCheckedAt
        ?.pricing,
      builtAt: new Date().toISOString(),
    },
    notes,
  });
}

/**
 * Detect overlapping canonical intent for CREATE mode.
 * Generating a draft for an existing entity is allowed; blocking is for
 * conflicting new routes / duplicate page intents in the registry.
 */
export function detectDuplicateIntent(
  agentId: ContentAgentId,
  targetSlug: string,
): { duplicate: boolean; message?: string } {
  if (agentId === "comparison-agent") {
    const existing = getAllComparisonsUnfiltered().find(
      (c) =>
        c.slug === targetSlug &&
        c.seo?.indexable &&
        c.metadata?.status === "published",
    );
    // Existing comparison pages still accept refresh/rewrite drafts;
    // only flag hard duplicate when explicitly creating a second slug variant.
    if (existing && targetSlug.includes("--")) {
      return {
        duplicate: true,
        message: `Indexable comparison already exists for ${targetSlug}`,
      };
    }
  }
  void agentId;
  void targetSlug;
  return { duplicate: false };
}

/**
 * Assert generation context never carries affiliate economics.
 * Exclusion notes that mention the word "commission" are allowed.
 */
export function assertNoAffiliateEconomics(context: AgentContext): string[] {
  const clone = structuredClone(context) as AgentContext & {
    notes?: string[];
  };
  clone.notes = (clone.notes ?? []).filter(
    (n) => !/excluded from this context/i.test(n),
  );
  const serialized = JSON.stringify(clone);
  const banned = [
    "payoutPercentage",
    "payout_percent",
    "affiliateRevenue",
    "historicalRevenue",
    '"epc"',
    "commissionValue",
    "commission_rate",
  ];
  return banned.filter((b) => new RegExp(b, "i").test(serialized));
}
