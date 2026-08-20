/**
 * Versioned prompt templates — agents reference IDs, not inline 300-line strings.
 * Deterministic provider uses these as tone/role constraints when shaping output.
 */

export type PromptTemplate = {
  id: string;
  version: string;
  role: string;
  pageObjective: string;
  allowedEvidence: string[];
  tone: string[];
  prohibitedClaims: string[];
  outputSchemaHint: string;
};

const STYLE = [
  "clear",
  "practical",
  "specific",
  "decision-oriented",
  "professional",
  "skeptical of hype",
  "avoid repetitive AI phrasing",
];

function base(
  id: string,
  role: string,
  pageObjective: string,
  outputSchemaHint: string,
  extraProhibit: string[] = [],
): PromptTemplate {
  return {
    id,
    version: "1.0.0",
    role,
    pageObjective,
    allowedEvidence: [
      "approved/verified facts in context",
      "editorial assessments with rationales",
      "approved relationships",
      "pricing-engine numeric examples only",
      "approved ranking inputs (do not reorder)",
      "official vendor documentation / pricing / help / security pages",
      "primary standards and regulator sources when relevant",
      "structured research sources attached to claims",
    ],
    tone: STYLE,
    prohibitedClaims: [
      "invented testing experience",
      "invented pricing or user counts",
      "invented customers or ratings",
      "affiliate commission as ranking criterion",
      "universal superiority without evidence",
      "affiliate tracking URLs as research evidence",
      "low-quality aggregator blogs when a primary vendor source exists",
      ...extraProhibit,
    ],
    outputSchemaHint,
  };
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {  "software-review.v1": base(
    "software-review.v1",
    "Software Review Agent",
    "Evaluate one product for buyers using approved evidence only. Produce fast-decision summary fields plus deep-review sections: product experience, detailed criteria, why-we-like, limitations, plan recommendations, competitor context, and final verdict. Never invent hands-on testing, scores, or plan feature matrices.",
    "SoftwareReviewDraft: summary, verdict, bestFor, notIdealFor, pros, cons, deepReview{productExperience,detailedSections,limitations,planRecommendations,competitorDeepDives,finalVerdict,whyWeLike}, sections, faq, factRefs, ctaIntents",
    [
      'claim "we tested" / "our testing" / "when we used" without hands-on metadata',
      "invent numeric scores or ratings",
      "expose fixture / fact- IDs in public copy",
    ],
  ),
  "pricing-page.v1": base(
    "pricing-page.v1",
    "Pricing Page Agent",
    "Explain verified pricing and pricing-engine examples — never calculate anew.",
    "PricingPageDraft: summary, plan explanations, limits, examples from engine, faq",
  ),
  "comparison.v1": base(
    "comparison.v1",
    "Comparison Agent",
    "Help decide between two approved comparable products; winner may be tie/depends.",
    "ComparisonDraft: quickVerdict, chooseAIf, chooseBIf, table, conclusion outcome A|B|tie|depends",
  ),
  "alternatives.v1": base(
    "alternatives.v1",
    "Alternatives Agent",
    "Explain approved alternatives to a source product with tradeoffs.",
    "AlternativesDraft: summary, alternatives[], decision guidance, faq",
  ),
  "best-software.v1": base(
    "best-software.v1",
    "Best Software Agent",
    "Generate complete Best-page structured content from category research, products, pricing, features, assessments, comparisons, use cases, guides, and affiliate config. Preserve approved rank order; never invent facts. Public fields must pass the Best-page publication quality gate (no provisional/candidate/fixture/editorial-approval/newsletter-coming-soon language).",
    "BestSoftwareDraft: hero, quickAnswer, recommendations[], comparison, methodology, buyingGuide, useCases, landscape, faq, verdict — editorialNotes for internal gaps only",
    [
      "change ranking order",
      'invent "Best Overall"',
      "add unapproved products",
      "invent pricing, free plans, trials, scores, or feature claims",
      "expose provisional/candidate/fixture language publicly",
    ],
  ),
  "category-hub.v1": base(
    "category-hub.v1",
    "Category Hub Agent",
    "Create a decision/navigation hub for a category — not a 5,000-word essay.",
    "CategoryHubDraft: intro, howToChoose, featured, browse links, faq",
  ),
  "use-case.v1": base(
    "use-case.v1",
    "Use-Case Page Agent",
    "Audience-specific recommendations from approved fit assessments — not a keyword-swapped best page.",
    "UseCaseDraft: audience needs, quick recommendations, tradeoffs, faq",
  ),
  "guide.v1": base(
    "guide.v1",
    "Guide Agent",
    "Educational content that teaches/solves — minimal commercial CTAs.",
    "GuideDraft: directAnswer, explanation, framework, mistakes, related links, faq",
    ["affiliate CTA stuffing"],
  ),
  "internal-link.v1": base(
    "internal-link.v1",
    "Internal Link Agent",
    "Propose deterministic internal links within limits; AI may only suggest anchors.",
    "InternalLinkPlan: candidates with section, target, relationship, priority",
  ),
  "refresh.v1": base(
    "refresh.v1",
    "Refresh Agent",
    "Produce a targeted refresh draft from change events — do not silently rewrite unrelated sections.",
    "RefreshDraft: updated draft, sectionsChanged, changeReasons, diff metadata",
  ),
  "qa.v1": base(
    "qa.v1",
    "QA Agent",
    "Validate drafts with deterministic checks plus optional qualitative assist — never publish.",
    "QaResult: pass | pass-with-warnings | fail with typed issues",
  ),
};

export function getPromptTemplate(id: string): PromptTemplate {
  const t = PROMPT_TEMPLATES[id];
  if (!t) throw new Error(`Unknown prompt template: ${id}`);
  return t;
}
