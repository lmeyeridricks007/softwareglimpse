import {
  AgentBriefSchema,
  AgentDraftExtensionSchema,
  EditorialBriefSchema,
  type AgentBrief,
  type AgentContext,
  type AgentDraftBundle,
  type AgentReadiness,
  type AgentValidationResult,
  type ContentAgentId,
  type EditorialDraft,
  type SearchIntentKind,
} from "@/domain";
import { resolveProviderProfile } from "@/data/config/agents/provider-profiles";
import { validateEditorialDraft } from "@/services/editorial/validate-draft";
import {
  categoryKnowledgePlannerReadiness,
  planCategoryKnowledge,
  planProductKnowledge,
  planSupportingContentDecisions,
  productKnowledgePlannerReadiness,
  saveCategoryKnowledgePlan,
  saveProductKnowledgePlan,
} from "@/services/knowledge-planners";
import { getPromptTemplate } from "./prompts";
import { createGenerationProvider } from "./providers/deterministic-provider";
import type { ContentAgent } from "./types";
import {
  assertNoAffiliateEconomics,
  detectDuplicateIntent,
} from "./context-builder";
import { GUIDE_BLOCK_RECIPES } from "@/domain/schemas/guide-blocks";
import { GUIDE_AGENT_TEMPLATE_RULES, GUIDE_TEMPLATE_ID } from "@/components/guides/guide-template";
import { buildProductMediaHealthReport } from "@/services/product-media/media-health-report";

function nowIso(): string {
  return new Date().toISOString();
}

function blocked(
  reasons: { code: string; message: string; critical?: boolean }[],
  missing: string[] = [],
): AgentReadiness {
  return {
    status: "BLOCKED",
    reasons: reasons.map((r) => ({
      code: r.code,
      message: r.message,
      critical: r.critical ?? true,
    })),
    missingDependencies: missing,
  };
}

function ready(extra: AgentReadiness["reasons"] = []): AgentReadiness {
  return {
    status: extra.some((r) => r.critical)
      ? "REVIEW_REQUIRED"
      : "READY",
    reasons: extra,
    missingDependencies: [],
  };
}

function editorialBriefFromContext(
  context: AgentContext,
  pageType: AgentBrief["pageType"],
  requiredSections: string[],
  targetIntent: string,
): AgentBrief["editorialBrief"] {
  const productSlug = context.productSlugs[0];
  return EditorialBriefSchema.parse({
    id: `brief-${context.agentId}-${context.targetSlug ?? "x"}-${Date.now()}`,
    pageType,
    targetIntent,
    primaryKeyword: context.seo?.targetQueries[0],
    productSlug,
    productSlugs: context.productSlugs,
    audience: context.categorySlugs[0],
    requiredSections,
    facts: context.facts.map((f) => ({
      id: f.id,
      domain: f.domain,
      claim: f.claim,
      value: f.value,
    })),
    editorialAssessments: context.editorialAssessments.map((a) => ({
      criterionSlug: a.criterionSlug,
      score: a.score,
      rationale: a.rationale,
      supportingFactIds: a.supportingFactIds,
      confidence: a.confidence ?? "low",
      status: "assessment-in-progress",
    })),
    allowedComparisons: context.relationships
      .filter((r) => r.type === "competes-with")
      .map((r) =>
        r.sourceSlug === productSlug ? r.targetSlug : r.sourceSlug,
      ),
    allowedAlternatives: context.relationships
      .filter((r) => r.type === "alternative-to")
      .map((r) =>
        r.sourceSlug === productSlug ? r.targetSlug : r.sourceSlug,
      ),
    internalLinks: [],
    prohibitedClaims: context.prohibitedClaims,
    approvedNumbers: (context.pricingSummary?.engineExamples ?? []).map(
      (e) => ({
        kind: e.label,
        value: e.amount,
        factId: e.factId,
      }),
    ),
    handsOnTestingAllowed: context.handsOnTestingAllowed,
    methodologyVersion: context.methodology?.version,
    toneNotes: [
      "Use clear, practical, decision-oriented prose.",
      "Do not invent facts; omit unsupported sections.",
      "Affiliate economics must not influence editorial conclusions.",
    ],
  });
}

async function runDeterministic(
  agent: ContentAgent,
  brief: AgentBrief,
  context: AgentContext,
  skeleton?: Partial<EditorialDraft>,
): Promise<AgentDraftBundle> {
  const profile = resolveProviderProfile(agent.id);
  const provider = createGenerationProvider(profile.id);
  const generated = await provider.generate({ brief, profile, skeleton });
  const extension = AgentDraftExtensionSchema.parse({
    agentId: agent.id,
    agentVersion: agent.version,
    methodologyVersion: context.methodology?.version,
    generationProvider: generated.cost.provider,
    generationProviderVersion: generated.providerVersion,
    generatedAt: nowIso(),
    mode: context.mode,
    ctaIntents: brief.ctaIntents,
    internalLinkCandidates: [],
    contextSnapshot: context.snapshot,
    sectionsChanged:
      context.mode === "REFRESH"
        ? context.changeEvents.flatMap((e) => e.affectedSections)
        : [],
    changeReasons:
      context.mode === "REFRESH"
        ? context.changeEvents.flatMap((e) =>
            e.affectedSections.map((section) => ({
              section,
              reason: e.summary,
            })),
          )
        : [],
    draftStale: false,
    staleReasons: [],
  });
  return { draft: generated.draft, extension };
}

function validateBundle(
  output: AgentDraftBundle,
  context: AgentContext,
  brief: AgentBrief,
): AgentValidationResult {
  const errors: string[] = [];
  const affiliateLeaks = assertNoAffiliateEconomics(context);
  if (affiliateLeaks.length) {
    errors.push(`affiliate-economics-in-context:${affiliateLeaks.join(",")}`);
  }
  const draftValidation = validateEditorialDraft(output.draft, brief.editorialBrief);
  errors.push(...draftValidation.errors);
  if (output.extension.agentId !== context.agentId) {
    errors.push("agent-id-mismatch");
  }
  return { ok: errors.length === 0, errors };
}

function makeAgent(config: {
  id: ContentAgentId;
  version?: string;
  pageType: AgentBrief["pageType"];
  primaryIntent: SearchIntentKind;
  promptId: string;
  requiredSections: string[];
  canRun: (context: AgentContext) => AgentReadiness;
  skeleton?: (
    context: AgentContext,
    brief: AgentBrief,
  ) => Partial<EditorialDraft>;
  ctaIntents?: (context: AgentContext) => AgentBrief["ctaIntents"];
}): ContentAgent {
  const version = config.version ?? "1.0.0";
  return {
    id: config.id,
    version,
    pageType: config.pageType,
    primaryIntent: config.primaryIntent,
    canRun(context) {
      if (context.mode === "CREATE") {
        const dup = detectDuplicateIntent(
          config.id,
          context.targetSlug ?? context.productSlugs[0] ?? "",
        );
        if (dup.duplicate) {
          return blocked([
            {
              code: "DUPLICATE_INTENT",
              message: dup.message ?? "Duplicate canonical intent",
            },
          ]);
        }
      }
      return config.canRun(context);
    },
    buildBrief(context) {
      const prompt = getPromptTemplate(config.promptId);
      const targetSlug =
        context.targetSlug ?? context.productSlugs[0] ?? "unknown";
      const label =
        context.productLabels[context.productSlugs[0] ?? ""] ?? targetSlug;
      const editorialBrief = editorialBriefFromContext(
        context,
        config.pageType,
        config.requiredSections,
        prompt.pageObjective.replace(/one product|products/g, label),
      );
      return AgentBriefSchema.parse({
        id: `agent-brief-${config.id}-${targetSlug}-${Date.now()}`,
        agentId: config.id,
        agentVersion: version,
        methodologyVersion: context.methodology?.version,
        pageType: config.pageType,
        mode: context.mode,
        primaryIntent: config.primaryIntent,
        targetSlug,
        requiredSections: config.requiredSections,
        editorialBrief,
        ctaIntents: config.ctaIntents?.(context) ?? [],
        promptTemplateId: prompt.id,
        promptTemplateVersion: prompt.version,
        contextSnapshot: context.snapshot,
        createdAt: nowIso(),
      });
    },
    async execute(brief, context) {
      const skeleton = config.skeleton?.(context, brief);
      return runDeterministic(this, brief, context, skeleton);
    },
    validate(output, context) {
      const brief = this.buildBrief(context);
      // Re-validate against a fresh brief aligned to context; prefer stored brief facts
      return validateBundle(
        output,
        context,
        {
          ...brief,
          editorialBrief: {
            ...brief.editorialBrief,
            facts: context.facts.map((f) => ({
              id: f.id,
              domain: f.domain,
              claim: f.claim,
              value: f.value,
            })),
          },
        },
      );
    },
  };
}

function minFacts(context: AgentContext, n: number): boolean {
  return context.facts.length >= n;
}

export const softwareReviewAgent = makeAgent({
  id: "software-review-agent",
  pageType: "software-review",
  primaryIntent: "evaluate-one-product",
  promptId: "software-review.v1",
  requiredSections: [
    "executive-summary",
    "verdict",
    "best-for",
    "not-ideal-for",
    "product-experience",
    "detailed-criteria",
    "why-we-like",
    "limitations",
    "pricing-overview",
    "plan-recommendations",
    "key-features",
    "competitor-context",
    "final-verdict",
    "alternatives",
    "methodology-summary",
    "faq",
  ],
  canRun(context) {
    const missing: string[] = [];
    const reasons: AgentReadiness["reasons"] = [];
    if (!context.productSlugs[0]) {
      return blocked([{ code: "MISSING_PRODUCT", message: "Product slug required" }]);
    }
    if (!context.methodology) {
      missing.push("category-methodology");
      reasons.push({
        code: "METHODOLOGY_INACTIVE",
        message: "Category methodology not active",
        critical: true,
      });
    }
    if (!minFacts(context, 1)) {
      missing.push("approved-research-facts");
      reasons.push({
        code: "RESEARCH_INCOMPLETE",
        message: "Core research facts missing (need approved/verified facts)",
        critical: true,
      });
    }
    if (context.editorialAssessments.length === 0) {
      missing.push("editorial-assessment");
      reasons.push({
        code: "ASSESSMENT_MISSING",
        message: "Editorial assessment required",
        critical: true,
      });
    }
    if (reasons.some((r) => r.critical)) return blocked(reasons, missing);
    return ready();
  },
  ctaIntents: (ctx) => [
    {
      type: "visit-product",
      productId: ctx.productSlugs[0],
      placement: "header",
    },
    {
      type: "open-pricing",
      productId: ctx.productSlugs[0],
      placement: "mid",
    },
    {
      type: "visit-product",
      productId: ctx.productSlugs[0],
      placement: "final",
    },
  ],
  skeleton(context) {
    const name =
      context.productLabels[context.productSlugs[0] ?? ""] ??
      context.productSlugs[0] ??
      "Product";
    const pros = context.editorialAssessments
      .filter((a) => a.score >= 7)
      .slice(0, 5)
      .map((a) => `${a.criterionSlug}: researched capability notes available`);
    const cons = context.editorialAssessments
      .filter((a) => a.score < 6)
      .slice(0, 5)
      .map((a) => `${a.criterionSlug}: research indicates weaker coverage`);
    const factIds = context.facts.slice(0, 6).map((f) => f.id);
    const featureFacts = context.facts
      .filter((f) => f.domain === "features")
      .slice(0, 8)
      .map((f) => f.id);
    const pricingFacts = context.facts
      .filter((f) => f.domain === "pricing" || f.domain === "plans")
      .map((f) => f.id);
    const section = (id: string, heading: string, body: string, refs: string[] = factIds) => ({
      id,
      heading,
      body,
      factRefs: refs,
    });
    return {
      summary: `Based on our evaluation of ${name}, this review synthesizes approved research and editorial notes. It is a draft — not a published page.`,
      verdict:
        context.editorialAssessments.length > 0
          ? `Based on our evaluation of ${name}, buyers should weigh criterion evidence and alternatives before deciding. Numeric scores publish only after editorial approval.`
          : undefined,
      pros,
      cons,
      sections: [
        section(
          "executive-summary",
          "Executive summary",
          `Based on our evaluation of ${name}, approved facts (${context.facts.length}) and criterion assessments (${context.editorialAssessments.length}) inform this draft.`,
        ),
        section(
          "verdict",
          "Verdict",
          `Based on our evaluation of ${name}, keep conclusions qualitative until scores are approved.`,
          context.editorialAssessments.flatMap((a) => a.supportingFactIds).slice(0, 6),
        ),
        section(
          "best-for",
          "Best for",
          `Based on our evaluation of ${name}, best-fit audiences should follow assessment rationales — not affiliate availability.`,
          [],
        ),
        section(
          "not-ideal-for",
          "Not ideal for",
          `Based on our evaluation of ${name}, research gaps are called out as limitations rather than invented capabilities.`,
          [],
        ),
        section(
          "product-experience",
          "Product experience",
          `Based on documented capabilities for ${name}, describe the buyer workflow from researched product features. Do not invent personal usage claims.`,
          featureFacts,
        ),
        section(
          "detailed-criteria",
          "Detailed criteria",
          `Expand each active methodology criterion for ${name} using researched feature support and approved assessment rationales.`,
          featureFacts,
        ),
        section(
          "why-we-like",
          "Why we like it",
          `Explain ${name}'s central strengths in plain language using approved strengths and positioning.`,
          [],
        ),
        section(
          "limitations",
          "Limitations",
          `Based on our evaluation of ${name}, unknown facts are omitted rather than inferred.`,
          [],
        ),
        section(
          "pricing-overview",
          "Pricing overview",
          context.pricingSummary?.engineExamples.length
            ? `Based on our evaluation of pricing-engine outputs only: ${context.pricingSummary.engineExamples
                .map((e) => `${e.label}=${e.amount}`)
                .join("; ")}.`
            : `Based on our evaluation of ${name}, structured pricing examples are not yet available.`,
          pricingFacts,
        ),
        section(
          "plan-recommendations",
          "Plan recommendations",
          `Recommend plan tiers for ${name} only from structured pricing plans and researched feature-to-plan links.`,
          pricingFacts,
        ),
        section(
          "key-features",
          "Key features",
          `Based on our evaluation of documented feature evidence for ${name}.`,
          featureFacts,
        ),
        section(
          "competitor-context",
          "Competitor context",
          `Include strategic competitor deep dives only when comparison outcomes exist for ${name}.`,
          [],
        ),
        section(
          "final-verdict",
          "Final verdict",
          `Close with buyer-specific choose-if guidance for ${name}. Avoid generic praise.`,
          [],
        ),
        section(
          "alternatives",
          "Alternatives",
          context.relationships.filter((r) => r.type === "alternative-to").length > 0
            ? `Approved alternatives: ${context.relationships
                .filter((r) => r.type === "alternative-to")
                .map((r) => r.targetSlug)
                .join(", ")}.`
            : "No approved alternative relationships in context.",
          [],
        ),
        section(
          "methodology-summary",
          "Methodology summary",
          `Methodology ${context.methodology?.slug ?? "n/a"} v${context.methodology?.version ?? "n/a"}.`,
          [],
        ),
        section(
          "faq",
          "FAQ",
          `Answer common buyer questions about ${name} using approved evidence only.`,
          [],
        ),
      ],
    };
  },
});

export const pricingPageAgent = makeAgent({
  id: "pricing-page-agent",
  pageType: "pricing",
  primaryIntent: "understand-cost",
  promptId: "pricing-page.v1",
  requiredSections: [
    "pricing-summary",
    "plan-explanations",
    "limits",
    "billing-considerations",
    "example-costs",
    "caveats",
    "faq",
  ],
  canRun(context) {
    const p = context.pricingSummary;
    if (!p) {
      return blocked([
        {
          code: "PRICING_MISSING",
          message: "Pricing summary unavailable",
        },
      ]);
    }
    if (!p.verified) {
      return blocked([
        {
          code: "PRICING_UNVERIFIED",
          message: "Product pricing data is unverified",
        },
      ]);
    }
    if (p.criticallyStale) {
      return blocked([
        {
          code: "PRICING_STALE",
          message: "Product pricing data is critically stale",
        },
      ]);
    }
    if (!p.modelSupported || p.planCount < 1) {
      return blocked([
        {
          code: "PRICING_INSUFFICIENT",
          message: "Plan data insufficient or model unsupported",
        },
      ]);
    }
    return ready();
  },
  ctaIntents: (ctx) => [
    {
      type: "open-calculator",
      productId: ctx.productSlugs[0],
      placement: "mid",
      labelHint: "Estimate your cost",
    },
    {
      type: "visit-product",
      productId: ctx.productSlugs[0],
      placement: "final",
    },
  ],
  skeleton(context) {
    const examples = context.pricingSummary?.engineExamples ?? [];
    return {
      summary:
        "Based on our evaluation of verified pricing structures and pricing-engine examples only.",
      sections: [
        {
          id: "pricing-summary",
          heading: "Pricing summary",
          body: `Plans available: ${context.pricingSummary?.planCount ?? 0}. Examples are engine-derived, not recalculated by this agent.`,
          factRefs: context.facts
            .filter((f) => f.domain === "pricing")
            .map((f) => f.id),
        },
        {
          id: "plan-explanations",
          heading: "Plan explanations",
          body: "Each plan is described from structured plan data in context — not invented marketing copy.",
          factRefs: [],
        },
        {
          id: "limits",
          heading: "Important limits",
          body: "Limits are included only when present on structured plans.",
          factRefs: [],
        },
        {
          id: "billing-considerations",
          heading: "Billing considerations",
          body: "Annual vs monthly billing follows pricing-engine outputs when available.",
          factRefs: [],
        },
        {
          id: "example-costs",
          heading: "Example costs",
          body: examples.length
            ? examples.map((e) => `${e.label}: ${e.amount}`).join("; ")
            : "No engine examples available.",
          factRefs: examples.map((e) => e.factId).filter(Boolean) as string[],
        },
        {
          id: "caveats",
          heading: "Pricing caveats",
          body: (context.pricingSummary?.caveats ?? []).join(" ") ||
            "Verify live vendor pricing before publication.",
          factRefs: [],
        },
      ],
    };
  },
});

export const comparisonAgent = makeAgent({
  id: "comparison-agent",
  pageType: "comparison",
  primaryIntent: "decide-between-products",
  promptId: "comparison.v1",
  requiredSections: [
    "quick-verdict",
    "choose-a-if",
    "choose-b-if",
    "criterion-analysis",
    "pricing",
    "conclusion",
    "faq",
  ],
  canRun(context) {
    if (context.productSlugs.length < 2) {
      return blocked([
        {
          code: "MISSING_PRODUCTS",
          message: "Comparison requires two product slugs",
        },
      ]);
    }
    const [a, b] = context.productSlugs;
    const rel = context.relationships.find(
      (r) =>
        (r.sourceSlug === a && r.targetSlug === b) ||
        (r.sourceSlug === b && r.targetSlug === a),
    );
    if (!rel) {
      return blocked([
        {
          code: "RELATIONSHIP_UNAPPROVED",
          message: "Approved comparable relationship required",
        },
      ], ["approved-relationship"]);
    }
    if (!context.methodology) {
      return blocked([
        {
          code: "METHODOLOGY_INACTIVE",
          message: "Comparison methodology not active",
        },
      ]);
    }
    for (const slug of context.productSlugs.slice(0, 2)) {
      const facts = context.facts.filter((f) => f.id.includes(slug) || true);
      if (context.facts.length < 2) {
        return blocked([
          {
            code: "RESEARCH_INCOMPLETE",
            message: `Research incomplete for comparison involving ${slug}`,
          },
        ]);
      }
      void facts;
    }
    return ready();
  },
  skeleton(context) {
    const [a, b] = context.productSlugs;
    const aLabel = context.productLabels[a] ?? a;
    const bLabel = context.productLabels[b] ?? b;
    return {
      summary: `Based on our evaluation of ${aLabel} and ${bLabel}, this comparison uses approved facts and relationships only.`,
      verdict: "depends",
      sections: [
        {
          id: "quick-verdict",
          heading: "Quick verdict",
          body: `Outcome: depends — neither product is universally superior. Choose based on criterion fit.`,
          factRefs: context.facts.slice(0, 4).map((f) => f.id),
        },
        {
          id: "choose-a-if",
          heading: `Choose ${aLabel} if`,
          body: `You prioritize strengths evidenced for ${aLabel} in approved assessments.`,
          factRefs: [],
        },
        {
          id: "choose-b-if",
          heading: `Choose ${bLabel} if`,
          body: `You prioritize strengths evidenced for ${bLabel} in approved assessments.`,
          factRefs: [],
        },
        {
          id: "criterion-analysis",
          heading: "Criterion-by-criterion",
          body: context.editorialAssessments
            .map((x) => `${x.productSlug}/${x.criterionSlug}: ${x.score}/10`)
            .join("; ") || "Criterion outcomes pending deeper editorial mapping.",
          factRefs: [],
        },
        {
          id: "pricing",
          heading: "Pricing",
          body: "Compare only structured pricing-engine figures when verified for both products.",
          factRefs: [],
        },
        {
          id: "conclusion",
          heading: "Overall conclusion",
          body: "Overall outcome: depends. Do not force a winner without criterion evidence.",
          factRefs: [],
        },
      ],
    };
  },
});

export const alternativesAgent = makeAgent({
  id: "alternatives-agent",
  pageType: "alternatives",
  primaryIntent: "replace-product",
  promptId: "alternatives.v1",
  requiredSections: [
    "summary",
    "alternatives",
    "decision-guidance",
    "faq",
  ],
  canRun(context) {
    const alts = context.relationships.filter((r) => r.type === "alternative-to");
    if (alts.length === 0) {
      return blocked([
        {
          code: "NO_APPROVED_ALTERNATIVES",
          message:
            "Approved alternative relationships required — same-category alone is insufficient",
        },
      ]);
    }
    if (!alts.every((a) => a.reason && a.reason.length > 0)) {
      return blocked([
        {
          code: "MISSING_ALTERNATIVE_REASON",
          message: "Each alternative requires a meaningful reason",
        },
      ]);
    }
    return ready();
  },
  skeleton(context) {
    const alts = context.relationships.filter((r) => r.type === "alternative-to");
    return {
      summary: `Based on our evaluation of approved alternatives to ${context.productSlugs[0]}.`,
      sections: [
        {
          id: "summary",
          heading: "Summary",
          body: `Approved alternatives (${alts.length}) with relationship reasons — not a random category list.`,
          factRefs: [],
        },
        {
          id: "alternatives",
          heading: "Alternatives",
          body: alts
            .map((a) => {
              const target =
                a.sourceSlug === context.productSlugs[0]
                  ? a.targetSlug
                  : a.sourceSlug;
              return `${target}: relevant because ${a.reason}; better when that tradeoff fits; worse when the source product's strengths matter more.`;
            })
            .join("\n"),
          factRefs: [],
        },
        {
          id: "decision-guidance",
          heading: "Decision guidance",
          body: "Use comparison pages for pairwise decisions; do not invent superiority.",
          factRefs: [],
        },
      ],
    };
  },
});

export const bestSoftwareAgent = makeAgent({
  id: "best-software-agent",
  pageType: "best",
  primaryIntent: "shortlist-products",
  promptId: "best-software.v1",
  requiredSections: [
    "intro",
    "quick-picks",
    "recommendation-table",
    "detailed-recommendations",
    "methodology",
    "how-to-choose",
    "use-cases",
    "comparisons",
    "faq",
    "verdict",
  ],
  canRun(context) {
    if (!context.methodology) {
      return blocked([
        {
          code: "METHODOLOGY_REQUIRED",
          message: "Category methodology required",
        },
      ]);
    }
    const approved = context.approvedRanking.filter((r) => r.approved);
    const eligible = context.approvedRanking;
    if (eligible.length < 3) {
      return blocked([
        {
          code: "MIN_ELIGIBLE_PRODUCTS",
          message: "Minimum eligible products not met for best page",
        },
      ]);
    }
    if (approved.length === 0) {
      return {
        status: "REVIEW_REQUIRED",
        reasons: [
          {
            code: "RANKING_UNAPPROVED",
            message:
              "Rankings exist but are not approved — draft may structure a shortlist without public rank numbers or awards",
            critical: false,
          },
        ],
        missingDependencies: [],
      };
    }
    return ready();
  },
  skeleton(context) {
    const order = context.approvedRanking;
    const approved = order.filter((r) => r.approved);
    const listMode = approved.length > 0 ? "ranked" : "shortlist";
    return {
      summary:
        "Build the complete Best-page structured content from research. Never invent pricing, scores, free plans, trials, or awards. Never expose provisional/candidate/fixture/editorial-approval language in public fields — put workflow notes in editorialNotes only.",
      sections: [
        {
          id: "intro",
          heading: "Introduction",
          body: "Hero subtitle + quickAnswerIntro from category research. Public buyer language only.",
          factRefs: [],
        },
        {
          id: "quick-picks",
          heading: listMode === "ranked" ? "Top picks" : "Shortlist",
          body: order
            .map((r) =>
              r.approved
                ? `#${r.rank} ${r.productSlug}: ${r.label ?? r.rationale}`
                : `${r.productSlug}: ${r.rationale} (shortlist — not a public rank)`,
            )
            .join("; "),
          factRefs: [],
        },
        {
          id: "recommendation-table",
          heading: "Comparison table",
          body: [
            "Columns only where verified data exists. Omit Our rating until scores are approved. Omit pricing columns without researched prices.",
            ...order.map((r) =>
              r.approved
                ? `${r.rank}. ${r.productSlug} — ${r.rationale}`
                : `${r.productSlug} — ${r.rationale}`,
            ),
          ].join("\n"),
          factRefs: [],
        },
        {
          id: "detailed-recommendations",
          heading: "Detailed recommendations",
          body: order
            .map(
              (r) =>
                `${r.productSlug}: strengths/tradeoffs/whyPicked/idealFor/avoidIf from approved assessments only`,
            )
            .join("\n"),
          factRefs: [],
        },
        {
          id: "methodology",
          heading: "How we evaluated",
          body: `Methodology ${context.methodology?.slug}. Do not publish version numbers on the public page. Affiliate economics excluded.`,
          factRefs: [],
        },
        {
          id: "how-to-choose",
          heading: "How to choose",
          body: "Category buying steps + link to published choose guide when available.",
          factRefs: [],
        },
        {
          id: "use-cases",
          heading: "Best by use case",
          body: "Link published use-case pages; only attach product awards when approved.",
          factRefs: [],
        },
        {
          id: "comparisons",
          heading: "Popular comparisons",
          body: "Only published comparison and alternatives pages.",
          factRefs: [],
        },
        {
          id: "faq",
          heading: "FAQ",
          body: "Answers from researched/approved content only. FAQPage schema only when compliant.",
          factRefs: [],
        },
        {
          id: "verdict",
          heading: "Bottom line",
          body: "No universal winner. Decision paths only when approved. Finder CTA when tool exists.",
          factRefs: [],
        },
      ],
    };
  },
});

export const categoryHubAgent = makeAgent({
  id: "category-hub-agent",
  pageType: "category-hub",
  primaryIntent: "discover-category",
  promptId: "category-hub.v1",
  requiredSections: [
    "category-intro",
    "how-to-choose",
    "featured-software",
    "browse-by-need",
    "tools",
    "faq",
  ],
  canRun(context) {
    if (!context.categorySlugs[0] && !context.targetSlug) {
      return blocked([
        {
          code: "CATEGORY_REQUIRED",
          message: "Category slug required",
        },
      ]);
    }
    if (!context.methodology) {
      return blocked([
        {
          code: "METHODOLOGY_REQUIRED",
          message: "Category methodology required for hub",
        },
      ]);
    }
    return ready();
  },
  skeleton(context) {
    return {
      summary: `Decision hub for ${context.categorySlugs[0] ?? context.targetSlug}.`,
      sections: [
        {
          id: "category-intro",
          heading: "Category intro",
          body: `Based on our evaluation of the ${context.categorySlugs[0]} category definition and scope.`,
          factRefs: [],
        },
        {
          id: "how-to-choose",
          heading: "How to choose",
          body: "Use methodology criteria and fit dimensions — not a longform essay.",
          factRefs: [],
        },
        {
          id: "featured-software",
          heading: "Featured software",
          body: "Feature only products present in approved catalogue/ranking context — no hardcoded lists.",
          factRefs: [],
        },
        {
          id: "browse-by-need",
          heading: "Browse by need",
          body: "Link only to published child pages when available.",
          factRefs: [],
        },
        {
          id: "tools",
          heading: "Tools and calculators",
          body: "Surface finder/calculator CTAs as intents when category tools exist.",
          factRefs: [],
        },
      ],
    };
  },
});

export const useCasePageAgent = makeAgent({
  id: "use-case-page-agent",
  pageType: "use-case",
  primaryIntent: "shortlist-products",
  promptId: "use-case.v1",
  requiredSections: [
    "audience-needs",
    "quick-recommendations",
    "fit-rationale",
    "tradeoffs",
    "selection-criteria",
    "faq",
  ],
  canRun(context) {
    if (context.approvedRanking.length === 0 && context.editorialAssessments.length === 0) {
      return blocked([
        {
          code: "FIT_ASSESSMENTS_MISSING",
          message: "Approved fit assessments or ranking inputs required",
        },
      ]);
    }
    if (!context.methodology) {
      return blocked([
        {
          code: "METHODOLOGY_REQUIRED",
          message: "Methodology required",
        },
      ]);
    }
    return ready();
  },
  skeleton(context) {
    return {
      summary:
        "Audience-specific guidance from approved fit assessments — not a keyword-swapped best page.",
      sections: [
        {
          id: "audience-needs",
          heading: "Audience-specific needs",
          body: `Needs for ${context.targetSlug} based on category methodology.`,
          factRefs: [],
        },
        {
          id: "quick-recommendations",
          heading: "Quick recommendations",
          body: context.approvedRanking
            .slice(0, 3)
            .map((r) => r.productSlug)
            .join(", ") || "Recommendations require approved fit inputs.",
          factRefs: [],
        },
        {
          id: "fit-rationale",
          heading: "Why products fit",
          body: context.editorialAssessments
            .slice(0, 5)
            .map((a) => `${a.productSlug}/${a.criterionSlug}: ${a.rationale}`)
            .join("; "),
          factRefs: [],
        },
        {
          id: "tradeoffs",
          heading: "Tradeoffs",
          body: "Call out tradeoffs from assessments — do not invent.",
          factRefs: [],
        },
        {
          id: "selection-criteria",
          heading: "Selection criteria",
          body: `Follow ${context.methodology?.slug} criteria for this audience.`,
          factRefs: [],
        },
      ],
    };
  },
});

export const guideAgent = makeAgent({
  id: "guide-agent",
  pageType: "guide",
  primaryIntent: "learn-solve",
  promptId: "guide.v1",
  requiredSections: [
    "direct-answer",
    "block-recipe",
    "decision-framework",
    "mistakes",
    "related-resources",
    "faq",
  ],
  canRun(context) {
    if (!context.targetSlug && context.categorySlugs.length === 0) {
      return blocked([
        {
          code: "TOPIC_REQUIRED",
          message: "Guide topic/target required",
        },
      ]);
    }
    return ready([
      {
        code: "INFORMATIONAL",
        message:
          "Guide drafts use structured content blocks by topic intent — not thin H2 essays. Minimize commercial CTAs; funnel to Finder / Best / Calculator.",
        critical: false,
      },
      {
        code: "GUIDE_TEMPLATE",
        message: `Reuse ${GUIDE_TEMPLATE_ID}: ${GUIDE_AGENT_TEMPLATE_RULES.join(" ")}`,
        critical: false,
      },
    ]);
  },
  ctaIntents: () => [
    {
      type: "open-category",
      placement: "final",
      labelHint: "Explore the category",
    },
  ],
  skeleton(context) {
    const topicType =
      context.notes
        .find((n) => n.startsWith("Supporting topic type:"))
        ?.replace("Supporting topic type:", "")
        .trim() || "fundamental";
    const recipe =
      GUIDE_BLOCK_RECIPES[topicType] ?? GUIDE_BLOCK_RECIPES.fundamental ?? [];
    return {
      summary: `Educational / decision guide for ${context.targetSlug} using ${GUIDE_TEMPLATE_ID} + block recipe for topicType=${topicType}. Optimize for intent completeness — not word count.`,
      sections: [
        {
          id: "direct-answer",
          heading: "Direct answer",
          body: "Answer the search intent in under 30 seconds. Prefer DirectAnswer + KeyTakeaways blocks. Quick Answer renders in the hero left column (belowCta) beside this guide's unique heroVisual.",
          factRefs: context.facts.slice(0, 3).map((f) => f.id),
        },
        {
          id: "block-recipe",
          heading: "Content block recipe",
          body: `Emit GuideContentBlock[] in this order (skip only with justification): ${recipe.join(" → ")}. Set unique heroVisual for this slug (public/guides/{slug}-hero.png) — never copy another guide's image. Add figure assets on steps / matrices / size-match or type=figure blocks so the page is diagram-led, not text-only. Render via GuideBlocksRenderer + guide-visuals (pastel multi-color icon chips, TipCallout, GuideFigure). Never invent catalogue products; reference existing slugs only. Do not duplicate Best / Finder / Calculator pages — teach how to decide, then link upward. Template rules: ${GUIDE_AGENT_TEMPLATE_RULES.join(" | ")}`,
          factRefs: [],
        },
        {
          id: "decision-framework",
          heading: "Decision framework",
          body: "For selection/buying-guide topics: include interactive checklist, weighted criteria, trial plan, Finder CTA, and selection-specific diagrams. For fundamentals: unique educational diagrams (how-it-works, spreadsheet vs tool, stages, types) — not the selection-framework hero. For implementation: timeline + checklists + risks + process visuals.",
          factRefs: [],
        },
        {
          id: "mistakes",
          heading: "Common mistakes",
          body: "Call out buyer mistakes without inventing vendor claims.",
          factRefs: [],
        },
        {
          id: "related-resources",
          heading: "Related tools and pages",
          body: "Link Learn → Best/Pricing → Finder → Compare/Review → vendor via SoftwareCta /go paths. Affiliate status never sets order.",
          factRefs: [],
        },
      ],
    };
  },
});

export const internalLinkAgent = makeAgent({
  id: "internal-link-agent",
  pageType: "guide",
  primaryIntent: "link-graph",
  promptId: "internal-link.v1",
  requiredSections: ["link-plan"],
  canRun(context) {
    if (!context.targetSlug && !context.contentId) {
      return blocked([
        {
          code: "CONTENT_REQUIRED",
          message: "Content ID or target required for link planning",
        },
      ]);
    }
    return ready();
  },
  skeleton(context) {
    const publishedRels = context.relationships.slice(0, 5);
    return {
      summary: "Deterministic internal link plan — drafts and scheduled pages excluded.",
      sections: [
        {
          id: "link-plan",
          heading: "Internal link candidates",
          body: publishedRels.length
            ? publishedRels
                .map(
                  (r) =>
                    `${r.sourceSlug} → ${r.targetSlug} (${r.type}): ${r.reason}`,
                )
                .join("\n")
            : "No eligible published relationship targets in context.",
          factRefs: [],
        },
      ],
    };
  },
});

export const refreshAgent = makeAgent({
  id: "refresh-agent",
  pageType: "software-review",
  primaryIntent: "refresh-existing",
  promptId: "refresh.v1",
  requiredSections: [
    "refresh-summary",
    "updated-sections",
    "official-media-health",
    "diff-metadata",
  ],
  canRun(context) {
    if (context.changeEvents.length === 0) {
      return blocked([
        {
          code: "NO_CHANGE_EVENTS",
          message: "Refresh requires change events",
        },
      ]);
    }
    if (!context.productSlugs[0] && !context.contentId) {
      return blocked([
        {
          code: "TARGET_REQUIRED",
          message: "Refresh target product/content required",
        },
      ]);
    }
    return ready();
  },
  skeleton(context) {
    const affected = [
      ...new Set(context.changeEvents.flatMap((e) => e.affectedSections)),
    ];
    const productSlug = context.productSlugs[0] ?? context.targetSlug;
    const mediaHealth = productSlug
      ? buildProductMediaHealthReport({ productSlug })
      : null;
    const row = mediaHealth?.products[0];
    const mediaBody = row
      ? [
          `Check official media health for ${row.productName}.`,
          `Active videos: ${row.activeVideos}.`,
          `Needs review: ${row.needsReview}.`,
          `Unavailable: ${row.unavailable}.`,
          `Oldest verification: ${row.oldestVerification ?? "none"}.`,
          row.missingMajorMediaCoverage
            ? "Missing major media coverage: yes — research refresh recommended."
            : "Missing major media coverage: no.",
          row.mediaResults.length
            ? row.mediaResults
                .map(
                  (r) =>
                    `- ${r.mediaId}: visibility=${r.publicVisibility}; flags=${r.flags.join(",") || "none"}; refresh=${r.needsResearchRefresh ? "yes" : "no"}`,
                )
                .join("\n")
            : "No media records on enrichment.",
          "Do not delete research history; flag unavailable sources and hide from active public display.",
        ].join("\n")
      : "Check official media health — no product enrichment row available.";

    return {
      summary: `Refresh draft for ${context.targetSlug} — targeted section updates only.`,
      sections: [
        {
          id: "refresh-summary",
          heading: "Refresh summary",
          body: context.changeEvents.map((e) => e.summary).join("; "),
          factRefs: context.facts.slice(0, 4).map((f) => f.id),
        },
        {
          id: "updated-sections",
          heading: "Updated sections",
          body: affected.length
            ? affected
                .map((s) => {
                  if (s === "pricing" || s === "pricing-overview") {
                    const examples =
                      context.pricingSummary?.engineExamples ?? [];
                    return `${s}: updated from pricing change event. Engine figures: ${examples
                      .map((e) => `${e.label}=${e.amount}`)
                      .join("; ")}`;
                  }
                  if (
                    s === "official-media" ||
                    s === "media" ||
                    s === "evidence"
                  ) {
                    return `${s}: updated from official media health check; preserve research history.`;
                  }
                  return `${s}: updated from change event; unrelated sections preserved.`;
                })
                .join("\n")
            : "No section list provided — defaulting to minimal refresh notes.",
          factRefs: context.facts
            .filter((f) => f.domain === "pricing")
            .map((f) => f.id),
        },
        {
          id: "official-media-health",
          heading: "Official media health",
          body: mediaBody,
          factRefs: [],
        },
        {
          id: "diff-metadata",
          heading: "Diff metadata",
          body: `Sections changed: ${affected.join(", ") || "none"}. Published version is not overwritten by this agent.`,
          factRefs: [],
        },
      ],
    };
  },
});

/** QA agent is executed via runQa — this stub satisfies registry discovery. */
export const qaAgentStub: ContentAgent = {
  id: "qa-agent",
  version: "1.0.0",
  pageType: "guide",
  primaryIntent: "quality-assurance",
  canRun: () =>
    ready([
      {
        code: "QA_USES_RUN_QA",
        message: "Use runQa()/CLI agent:qa against a draft id",
        critical: false,
      },
    ]),
  buildBrief: (context) =>
    AgentBriefSchema.parse({
      id: `qa-brief-${Date.now()}`,
      agentId: "qa-agent",
      agentVersion: "1.0.0",
      pageType: "guide",
      mode: context.mode,
      primaryIntent: "quality-assurance",
      targetSlug: context.targetSlug ?? "qa",
      requiredSections: [],
      editorialBrief: editorialBriefFromContext(
        context,
        "guide",
        [],
        "Validate draft quality",
      ),
      ctaIntents: [],
      promptTemplateId: "qa.v1",
      promptTemplateVersion: "1.0.0",
      contextSnapshot: context.snapshot,
      createdAt: nowIso(),
    }),
  execute: async () => {
    throw new Error("qa-agent does not generate drafts — use runQa");
  },
  validate: () => ({ ok: true, errors: [] }),
};

function planBrief(
  agentId: ContentAgentId,
  intent: SearchIntentKind,
  context: AgentContext,
  requiredSections: string[],
): AgentBrief {
  return AgentBriefSchema.parse({
    id: `agent-brief-${agentId}-${context.targetSlug ?? "plan"}-${Date.now()}`,
    agentId,
    agentVersion: "1.0.0",
    pageType: "knowledge-plan",
    mode: context.mode,
    primaryIntent: intent,
    targetSlug: context.targetSlug ?? context.categorySlugs[0] ?? "plan",
    requiredSections,
    editorialBrief: editorialBriefFromContext(
      context,
      "knowledge-plan",
      requiredSections,
      "Produce a structured supporting-knowledge plan — do not write articles",
    ),
    ctaIntents: [],
    promptTemplateId: `${agentId}.v1`,
    promptTemplateVersion: "1.0.0",
    contextSnapshot: context.snapshot,
    createdAt: nowIso(),
  });
}

function planDraftBundle(
  agentId: ContentAgentId,
  targetSlug: string,
  summary: string,
  sections: { id: string; heading: string; body: string }[],
  briefId: string,
): AgentDraftBundle {
  const now = nowIso();
  const draft = {
    id: `draft-plan-${agentId}-${targetSlug}-${Date.now()}`,
    briefId,
    pageType: "knowledge-plan" as const,
    targetSlug,
    provider: "deterministic",
    status: "generated" as const,
    summary,
    sections: sections.map((s) => ({
      ...s,
      factRefs: [] as string[],
    })),
    pros: [],
    cons: [],
    faq: [],
    factRefs: [],
    validationErrors: [],
    createdAt: now,
    updatedAt: now,
  };
  return {
    draft: draft as AgentDraftBundle["draft"],
    extension: AgentDraftExtensionSchema.parse({
      agentId,
      agentVersion: "1.0.0",
      generationProvider: "deterministic",
      generationProviderVersion: "1.0.0",
      generatedAt: now,
      mode: "CREATE",
      ctaIntents: [],
      internalLinkCandidates: [],
      contextSnapshot: {
        factIds: [],
        builtAt: now,
      },
      sectionsChanged: [],
      changeReasons: [],
      draftStale: false,
      staleReasons: [],
    }),
  };
}

export const categoryKnowledgePlannerAgent: ContentAgent = {
  id: "category-knowledge-planner-agent",
  version: "1.0.0",
  pageType: "knowledge-plan",
  primaryIntent: "plan-category-knowledge",
  canRun(context) {
    const slug = context.targetSlug ?? context.categorySlugs[0];
    if (!slug) {
      return blocked([
        {
          code: "CATEGORY_REQUIRED",
          message: "Category slug required for knowledge planning",
        },
      ]);
    }
    return categoryKnowledgePlannerReadiness(slug);
  },
  buildBrief(context) {
    return planBrief(
      "category-knowledge-planner-agent",
      "plan-category-knowledge",
      context,
      ["knowledge-areas", "topic-candidates", "gaps", "anchor-coverage"],
    );
  },
  async execute(brief, context) {
    const slug = context.targetSlug ?? context.categorySlugs[0]!;
    const plan = planCategoryKnowledge(slug);
    saveCategoryKnowledgePlan(plan);
    return planDraftBundle(
      "category-knowledge-planner-agent",
      slug,
      `Category knowledge plan for ${slug}: ${plan.summary.coreCount} CORE, ${plan.summary.newPageCount} new-page candidates (not executed)`,
      [
        {
          id: "knowledge-areas",
          heading: "Knowledge areas",
          body: plan.knowledgeAreas
            .map(
              (a) =>
                `${a.slug}: ${a.applicable ? "applicable" : "skip"} — ${a.reason ?? ""}`,
            )
            .join("\n"),
        },
        {
          id: "topic-candidates",
          heading: "Topic candidates",
          body: plan.topicCandidates
            .slice(0, 40)
            .map(
              (c) =>
                `${c.priorityClass} ${c.titleConcept} [${c.placement}/${c.readiness}]`,
            )
            .join("\n"),
        },
        {
          id: "gaps",
          heading: "Gaps",
          body: plan.gaps.map((g) => g.message).join("\n") || "(none)",
        },
        {
          id: "anchor-coverage",
          heading: "Anchor coverage",
          body: plan.anchorCoverage
            .map(
              (a) =>
                `${a.title}: ${a.supportingGuideCount} guides; missing CORE ${a.missingCoreTopicIds.join(",") || "—"}`,
            )
            .join("\n"),
        },
      ],
      brief.id,
    );
  },
  validate: () => ({ ok: true, errors: [] }),
};

export const productKnowledgePlannerAgent: ContentAgent = {
  id: "product-knowledge-planner-agent",
  version: "1.0.0",
  pageType: "knowledge-plan",
  primaryIntent: "plan-product-knowledge",
  canRun(context) {
    const slug = context.targetSlug ?? context.productSlugs[0];
    if (!slug) {
      return blocked([
        {
          code: "PRODUCT_REQUIRED",
          message: "Product slug required",
        },
      ]);
    }
    return productKnowledgePlannerReadiness(slug);
  },
  buildBrief(context) {
    return planBrief(
      "product-knowledge-planner-agent",
      "plan-product-knowledge",
      context,
      ["eligibility", "candidates", "rejected"],
    );
  },
  async execute(brief, context) {
    const slug = context.targetSlug ?? context.productSlugs[0]!;
    const plan = planProductKnowledge(slug);
    saveProductKnowledgePlan(plan);
    return planDraftBundle(
      "product-knowledge-planner-agent",
      slug,
      `Product knowledge plan for ${slug}: ${plan.eligibility}`,
      [
        {
          id: "eligibility",
          heading: "Eligibility",
          body: `${plan.eligibility}\n${plan.eligibilityReasons.join("\n")}`,
        },
        {
          id: "candidates",
          heading: "Candidates",
          body:
            plan.topicCandidates
              .map((c) => `${c.priorityClass} ${c.titleConcept}`)
              .join("\n") || "(none)",
        },
        {
          id: "rejected",
          heading: "Rejected",
          body:
            plan.rejected
              .map((r) => `${r.titleConcept}: ${r.reason}`)
              .join("\n") || "(none)",
        },
      ],
      brief.id,
    );
  },
  validate: () => ({ ok: true, errors: [] }),
};

export const supportingContentPlannerAgent: ContentAgent = {
  id: "supporting-content-planner-agent",
  version: "1.0.0",
  pageType: "knowledge-plan",
  primaryIntent: "plan-supporting-content",
  canRun() {
    return ready();
  },
  buildBrief(context) {
    return planBrief(
      "supporting-content-planner-agent",
      "plan-supporting-content",
      context,
      ["decisions"],
    );
  },
  async execute(brief, context) {
    const slug = context.categorySlugs[0] ?? context.targetSlug ?? "crm";
    const plan = planCategoryKnowledge(slug);
    const decisions = planSupportingContentDecisions(plan.topicCandidates);
    return planDraftBundle(
      "supporting-content-planner-agent",
      slug,
      `Supporting content decisions for ${slug}`,
      [
        {
          id: "decisions",
          heading: "Decisions",
          body: decisions
            .map(
              (d) =>
                `${d.candidateId}: ${d.recommendation} → ${d.workflowAction} (${d.nextAgentId})`,
            )
            .join("\n"),
        },
      ],
      brief.id,
    );
  },
  validate: () => ({ ok: true, errors: [] }),
};
