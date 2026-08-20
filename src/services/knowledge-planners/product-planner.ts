import {
  ProductKnowledgePlanSchema,
  type ProductKnowledgePlan,
  type SupportingTopicConcept,
} from "@/domain";
import {
  getSoftwareBySlug,
} from "@/data";
import {
  getGuidesByCategory,
  getGuidesByProduct,
} from "@/data/repositories/guides";
import { getCategoryKnowledgeMap } from "@/data/content-clusters/knowledge";
import { loadEnrichment } from "@/data/research/store";
import {
  buildSupportingTopicCandidates,
  decideTopicPlacement,
} from "@/services/content-clusters";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { softwareContentId } from "@/services/publishing/ids";

type SeoSignal = { query: string; impressions: number; clicks: number };

function strategicImportance(
  productSlug: string,
  published: boolean,
  seedPrimary: boolean,
): "low" | "medium" | "high" {
  if (!published) return "low";
  // Seed / well-known CRM primaries — not affiliate payout
  if (seedPrimary || productSlug === "pipedrive") return "high";
  if (published) return "medium";
  return "low";
}

function complexityFromResearch(productSlug: string): "low" | "medium" | "high" {
  const enrichment = loadEnrichment(productSlug);
  const featureCount = enrichment?.featureSupport?.length ?? 0;
  if (featureCount >= 20) return "high";
  if (featureCount >= 8) return "medium";
  return "low";
}

function productTopicConcepts(
  productSlug: string,
  productName: string,
  categorySlug: string,
): SupportingTopicConcept[] {
  const softId = softwareContentId(productSlug);
  const map = getCategoryKnowledgeMap(categorySlug);
  const fromMap = map?.topics.filter((t) =>
    t.productSlugs.includes(productSlug),
  );
  if (fromMap && fromMap.length > 0) return fromMap;

  return [
    {
      id: `${productSlug}-setup`,
      titleConcept: `How to set up ${productName}`,
      suggestedSlug: `${productSlug}-setup-guide`,
      topicType: "setup",
      journeyStage: "implement",
      knowledgeAreaSlug: "implementation",
      priorityClass: "SECONDARY",
      productSlugs: [productSlug],
      supportsContentIds: [softId],
      supportRelationType: "implementation-for",
      nextActionContentId: softId,
      nextActionLabel: `Read the ${productName} review`,
      intentClusterKeys: [
        `${productSlug} setup`,
        `set up ${productSlug}`,
        `${productName} setup`.toLowerCase(),
      ],
      standaloneSignals: {
        multipleSubquestions: true,
        distinctSearchIntent: true,
        decisionImportance: true,
        internalLinkUsefulness: true,
        meaningfulDepth: true,
      },
      notes: ["Only if product complexity / SEO justifies"],
    },
    {
      id: `${productSlug}-pricing-guide`,
      titleConcept: `${productName} pricing guide`,
      suggestedSlug: `${productSlug}-pricing-guide`,
      topicType: "pricing-education",
      journeyStage: "evaluate",
      knowledgeAreaSlug: "pricing",
      priorityClass: "NOT_RECOMMENDED",
      productSlugs: [productSlug],
      supportsContentIds: [softId],
      supportRelationType: "explains-pricing",
      intentClusterKeys: [`${productSlug} pricing`],
      standaloneSignals: {
        multipleSubquestions: false,
        distinctSearchIntent: false,
        decisionImportance: false,
        internalLinkUsefulness: false,
        meaningfulDepth: false,
      },
      notes: [
        "Canonical pricing page owns this intent — reject standalone guide",
      ],
    },
    {
      id: `${productSlug}-micro-feature`,
      titleConcept: `Does ${productName} support custom fields?`,
      suggestedSlug: `${productSlug}-custom-fields`,
      topicType: "feature-explainer",
      journeyStage: "understand",
      knowledgeAreaSlug: "features",
      priorityClass: "NOT_RECOMMENDED",
      productSlugs: [productSlug],
      supportsContentIds: [softId],
      supportRelationType: "supports-anchor",
      intentClusterKeys: [`${productSlug} custom fields`],
      standaloneSignals: {
        multipleSubquestions: false,
        distinctSearchIntent: false,
        decisionImportance: false,
        internalLinkUsefulness: false,
        meaningfulDepth: false,
      },
      notes: ["Product page section — do not create a guide"],
    },
  ];
}

/**
 * ProductKnowledgePlanner — decides if product-specific guides are justified.
 * Affiliate commission never influences eligibility.
 */
export function planProductKnowledge(
  productSlug: string,
  options?: { seoSignals?: SeoSignal[] },
): ProductKnowledgePlan {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) {
    throw new Error(`Product knowledge planner blocked: unknown ${productSlug}`);
  }

  const categorySlug = product.primaryCategorySlug;
  const enrichment = loadEnrichment(productSlug);
  const researchReady = Boolean(enrichment);
  const published = product.metadata.status === "published";
  const importance = strategicImportance(
    productSlug,
    published,
    Boolean(
      getCategoryKnowledgeMap(categorySlug)?.topics.some((t) =>
        t.productSlugs.includes(productSlug),
      ),
    ),
  );
  const complexity = complexityFromResearch(productSlug);

  const seoSignals = (options?.seoSignals ?? []).filter((s) =>
    s.query.toLowerCase().includes(productSlug),
  );
  const seoQueryCount = seoSignals.length;
  const seoImpressions = seoSignals.reduce((n, s) => n + s.impressions, 0);

  const concepts = productTopicConcepts(
    productSlug,
    product.name,
    categorySlug,
  );

  // Pricing-intent rejection when pricing page / snapshot exists
  const hasPricingPage = listCrmPricingSnapshots({
    includeUnpublished: true,
  }).some((s) => s.productSlug === productSlug);
  const rejected: ProductKnowledgePlan["rejected"] = [];

  if (hasPricingPage) {
    rejected.push({
      titleConcept: `${product.name} pricing guide`,
      reason: "Canonical pricing page already owns this intent",
      canonicalTarget: `content:pricing:${productSlug}`,
    });
  }

  const eligibleConcepts = concepts.filter((c) => {
    if (c.topicType === "pricing-education" && hasPricingPage) {
      return false;
    }
    if (c.priorityClass === "NOT_RECOMMENDED") {
      rejected.push({
        titleConcept: c.titleConcept,
        reason: c.notes[0] ?? "NOT_RECOMMENDED — insufficient standalone value",
        canonicalTarget: `content:software:${productSlug}`,
      });
      return false;
    }
    return true;
  });

  const map = getCategoryKnowledgeMap(categorySlug);
  const knowledgeMap = map
    ? {
        ...map,
        topics: [
          ...map.topics.filter((t) => !t.productSlugs.includes(productSlug)),
          ...eligibleConcepts,
        ],
      }
    : {
        id: `knowledge-${categorySlug}-product-${productSlug}`,
        categorySlug,
        version: "1.0.0",
        areas: [
          {
            slug: "implementation" as const,
            label: "Implementation",
            targetCoreCount: 0,
          },
        ],
        topics: eligibleConcepts,
        toolSupportTopicIds: {},
        bestSupportTopicIds: {},
        notes: [],
      };

  const allCandidates = buildSupportingTopicCandidates(categorySlug, {
    seoSignals: options?.seoSignals,
    knowledgeMap,
  }).filter((c) => c.productSlugs.includes(productSlug));

  // Eligibility decision — never use affiliate commission
  let eligibility: ProductKnowledgePlan["eligibility"] = "GUIDES_NOT_NEEDED";
  const eligibilityReasons: string[] = [];

  if (!researchReady) {
    eligibility = "GUIDES_NOT_NEEDED";
    eligibilityReasons.push(
      "Core research incomplete — product guides remain optional and blocked",
    );
  } else if (!published && importance === "low") {
    eligibility = "GUIDES_NOT_NEEDED";
    eligibilityReasons.push(
      "Unpublished / low strategic importance — keep guidance on software page",
    );
  } else if (
    complexity === "low" &&
    seoQueryCount === 0 &&
    importance !== "high"
  ) {
    eligibility = "GUIDES_NOT_NEEDED";
    eligibilityReasons.push(
      "Low complexity, no product SEO footprint, not strategically high — no standalone guides",
    );
  } else if (importance === "high" && (complexity !== "low" || seoQueryCount > 0)) {
    eligibility = "GUIDES_RECOMMENDED";
    eligibilityReasons.push(
      "High strategic importance with implementation complexity and/or product queries",
    );
  } else if (importance === "high") {
    eligibility = "GUIDES_OPTIONAL";
    eligibilityReasons.push(
      "Strategically important but weak SEO/complexity — optional setup guide only",
    );
  } else if (seoQueryCount > 0 || complexity === "high") {
    eligibility = "GUIDES_OPTIONAL";
    eligibilityReasons.push(
      "Some product query or complexity signals — optional guides",
    );
  } else {
    eligibility = "GUIDES_NOT_NEEDED";
    eligibilityReasons.push(
      "Insufficient signals for product-specific supporting guides",
    );
  }

  // Force candidates to research-required / not-recommended based on eligibility
  const topicCandidates =
    eligibility === "GUIDES_NOT_NEEDED"
      ? []
      : allCandidates.map((c) => ({
          ...c,
          readiness:
            c.readiness === "exists"
              ? c.readiness
              : seoQueryCount === 0 && importance !== "high"
                ? ("research-required" as const)
                : c.readiness,
        }));

  if (eligibility === "GUIDES_NOT_NEEDED") {
    for (const c of allCandidates) {
      if (!rejected.some((r) => r.titleConcept === c.titleConcept)) {
        rejected.push({
          titleConcept: c.titleConcept,
          reason: eligibilityReasons[0] ?? "Guides not needed",
          canonicalTarget: `content:software:${productSlug}`,
        });
      }
    }
  }

  const categoryGuides = getGuidesByCategory(categorySlug, {
    includeUnpublished: true,
  }).map((g) => ({
    slug: g.slug,
    title: g.title,
    status: g.metadata.status,
  }));

  return ProductKnowledgePlanSchema.parse({
    id: `product-knowledge-plan:${productSlug}:${Date.now()}`,
    productSlug,
    categorySlug,
    plannerId: "product-knowledge-planner-agent",
    plannerVersion: "1.0.0",
    eligibility,
    eligibilityReasons,
    signals: {
      productPublished: published,
      researchReady,
      strategicImportance: importance,
      complexity,
      seoQueryCount,
      seoImpressions,
      legacyContentHints: 0,
      uniqueFeatureCount: enrichment?.featureSupport?.length ?? 0,
      affiliateCommissionUsed: false,
    },
    topicCandidates,
    rejected,
    categoryGuides,
    generatedAt: new Date().toISOString(),
  });
}

export function productKnowledgePlannerReadiness(productSlug: string): {
  status: "READY" | "BLOCKED" | "REVIEW_REQUIRED";
  reasons: { code: string; message: string; critical: boolean }[];
  missingDependencies: string[];
} {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) {
    return {
      status: "BLOCKED",
      reasons: [
        {
          code: "PRODUCT_REQUIRED",
          message: `Unknown product ${productSlug}`,
          critical: true,
        },
      ],
      missingDependencies: [`product:${productSlug}`],
    };
  }
  if (!loadEnrichment(productSlug)) {
    return {
      status: "BLOCKED",
      reasons: [
        {
          code: "RESEARCH_REQUIRED",
          message: "Product has not completed core research",
          critical: true,
        },
      ],
      missingDependencies: [`research:${productSlug}`],
    };
  }
  return { status: "READY", reasons: [], missingDependencies: [] };
}

/** Expose decideTopicPlacement for tests via product concepts */
export function evaluateProductTopicPlacement(
  productSlug: string,
  conceptId: string,
) {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) throw new Error("product missing");
  const concepts = productTopicConcepts(
    productSlug,
    product.name,
    product.primaryCategorySlug,
  );
  const concept = concepts.find((c) => c.id === conceptId);
  if (!concept) throw new Error(`concept ${conceptId} missing`);
  const existing = new Set(
    getGuidesByProduct(productSlug, { includeUnpublished: true }).map(
      (g) => g.slug,
    ),
  );
  return decideTopicPlacement(concept, existing);
}
