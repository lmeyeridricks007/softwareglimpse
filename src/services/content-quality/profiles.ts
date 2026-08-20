import type {
  ContentQualityDimensionId,
  ContentQualityPageType,
} from "@/domain/schemas/content-quality";

export type DimensionWeightMap = Partial<
  Record<ContentQualityDimensionId, number>
>;

export type PageQualityProfile = {
  id: string;
  pageType: ContentQualityPageType;
  label: string;
  description: string;
  /** Relative weights — do not need to sum to 1; normalized at score time. */
  weights: DimensionWeightMap;
  /** Expected section ids for completeness checks. */
  expectedSections: string[];
  /** Checklist items scored under page-type-specific. */
  checklist: string[];
  /** Primary intent the page should serve. */
  expectedIntent: "informational" | "commercial" | "implementation" | "comparison";
  /** When true, visuals are optional (simple subjects). */
  visualsOptional?: boolean;
};

const BASE_WEIGHTS: DimensionWeightMap = {
  "user-intent-fit": 1.2,
  "content-completeness": 1.1,
  "subject-depth": 1.0,
  "original-value": 1.0,
  "evidence-source-quality": 0.9,
  "research-freshness": 0.7,
  "decision-support": 0.9,
  actionability: 0.8,
  "structure-readability": 0.8,
  "visual-media-support": 0.5,
  "internal-linking": 0.7,
  "journey-next-step": 0.8,
  "trust-transparency": 0.6,
  "content-differentiation": 0.7,
  "page-type-specific": 1.2,
};

function withWeights(
  overrides: DimensionWeightMap,
): DimensionWeightMap {
  return { ...BASE_WEIGHTS, ...overrides };
}

export const PAGE_QUALITY_PROFILES: Record<
  ContentQualityPageType,
  PageQualityProfile
> = {
  article: {
    id: "ArticleQualityProfile",
    pageType: "article",
    label: "Supporting article",
    description:
      "Educational supporting article with a distinct question and clear next step.",
    expectedIntent: "informational",
    expectedSections: [
      "direct-answer",
      "explanation",
      "examples",
      "related",
      "next-step",
    ],
    checklist: [
      "answers-title-question",
      "concrete-example",
      "supports-anchor",
      "no-product-ranking-half-page",
      "distinct-from-siblings",
    ],
    weights: withWeights({
      "decision-support": 0.5,
      "evidence-source-quality": 0.6,
      "visual-media-support": 0.4,
    }),
  },
  guide: {
    id: "GuideQualityProfile",
    pageType: "guide",
    label: "Guide",
    description:
      "Teaching guide: quick answer, framework/steps, examples, tools/resources, next step.",
    expectedIntent: "informational",
    expectedSections: [
      "quick-answer",
      "framework-or-steps",
      "examples",
      "tools-or-resources",
      "sources",
      "next-step",
      "faq",
    ],
    checklist: [
      "direct-answer-decision-rule",
      "worked-example",
      "teaching-visual",
      "unique-hero",
      "anchor-supports",
      "checklist-or-framework",
    ],
    weights: withWeights({
      "subject-depth": 1.2,
      actionability: 1.0,
      "visual-media-support": 0.8,
      "decision-support": 0.8,
    }),
  },
  "product-review": {
    id: "ProductReviewQualityProfile",
    pageType: "product-review",
    label: "Product review",
    description:
      "Canonical software review with verdict, fit, criteria, evidence, alternatives.",
    expectedIntent: "commercial",
    expectedSections: [
      "verdict",
      "best-for",
      "not-for",
      "criteria",
      "features",
      "pricing",
      "pros-cons",
      "evidence",
      "alternatives",
      "methodology",
      "faq",
    ],
    checklist: [
      "approved-editorial",
      "criterion-rationales",
      "best-for-and-not-for",
      "pricing-summary",
      "alternative-or-comparison-links",
      "methodology-referenced",
      "fact-backed-claims",
    ],
    weights: withWeights({
      "evidence-source-quality": 1.3,
      "decision-support": 1.2,
      "research-freshness": 1.0,
      "trust-transparency": 1.0,
      "original-value": 1.1,
    }),
  },
  comparison: {
    id: "ComparisonQualityProfile",
    pageType: "comparison",
    label: "Comparison",
    description:
      "A vs B decision page with criterion outcomes, scenarios, and evidence balance.",
    expectedIntent: "comparison",
    expectedSections: [
      "verdict-or-depends",
      "criteria-table",
      "scenarios",
      "evidence",
      "pricing-context",
      "next-step",
    ],
    checklist: [
      "researched-criteria",
      "balanced-evidence",
      "scenario-recommendations",
      "no-forced-universal-winner",
      "pricing-or-tco-context",
    ],
    weights: withWeights({
      "decision-support": 1.4,
      "evidence-source-quality": 1.2,
      "content-differentiation": 0.9,
      "subject-depth": 1.1,
    }),
  },
  best: {
    id: "BestPageQualityProfile",
    pageType: "best",
    label: "Best page",
    description:
      "Methodology-backed ranked list with eligibility, rationales, and disclosures.",
    expectedIntent: "commercial",
    expectedSections: [
      "methodology",
      "eligibility",
      "recommendations",
      "rationales",
      "who-should-skip",
      "next-step",
    ],
    checklist: [
      "methodology-present",
      "approved-recommendations",
      "eligibility-rules",
      "rationale-per-pick",
      "affiliate-disclosure",
    ],
    weights: withWeights({
      "trust-transparency": 1.3,
      "decision-support": 1.3,
      "original-value": 1.1,
      "evidence-source-quality": 1.0,
    }),
  },
  "product-guide": {
    id: "ProductGuideQualityProfile",
    pageType: "product-guide",
    label: "Product-specific guide",
    description:
      "Product setup / how-to guide focused on implementation for one product.",
    expectedIntent: "implementation",
    expectedSections: [
      "quick-answer",
      "prerequisites",
      "steps",
      "screenshots-or-video",
      "limitations",
      "next-step",
    ],
    checklist: [
      "product-scoped",
      "step-by-step",
      "official-media-or-docs",
      "not-a-review-rerun",
    ],
    weights: withWeights({
      actionability: 1.3,
      "subject-depth": 1.2,
      "visual-media-support": 1.0,
      "decision-support": 0.4,
      "evidence-source-quality": 1.0,
    }),
  },
  industry: {
    id: "IndustryQualityProfile",
    pageType: "industry",
    label: "Industry hub",
    description:
      "Vertical decision hub with industry priorities, use cases, and capabilities — not a generic category copy.",
    expectedIntent: "commercial",
    expectedSections: [
      "industry-priorities",
      "use-cases",
      "capabilities",
      "implementation-notes",
      "security-or-compliance",
      "next-step",
    ],
    checklist: [
      "industry-specific-priorities",
      "not-generic-category-copy",
      "use-case-links",
      "capability-or-feature-links",
      "buyer-questions",
    ],
    weights: withWeights({
      "content-differentiation": 1.4,
      "subject-depth": 1.2,
      "decision-support": 1.1,
      "original-value": 1.1,
    }),
  },
  "use-case": {
    id: "UseCaseQualityProfile",
    pageType: "use-case",
    label: "Use-case page",
    description:
      "Job-to-be-done page with workflow, requirements, and product relevance — not H1-only variants.",
    expectedIntent: "informational",
    expectedSections: [
      "definition",
      "workflow",
      "requirements",
      "capabilities",
      "product-relevance",
      "next-step",
    ],
    checklist: [
      "workflow-specific",
      "requirement-links",
      "not-only-h1-changed",
      "evidence-when-claiming-support",
    ],
    weights: withWeights({
      "subject-depth": 1.3,
      "content-differentiation": 1.2,
      "decision-support": 1.0,
      "evidence-source-quality": 0.9,
    }),
  },
  capability: {
    id: "CapabilityQualityProfile",
    pageType: "capability",
    label: "Capability hub",
    description:
      "Capability explanation with related features, requirements, and buyer guidance.",
    expectedIntent: "informational",
    expectedSections: [
      "definition",
      "why-it-matters",
      "related-features",
      "requirements",
      "evaluation-guidance",
      "next-step",
    ],
    checklist: [
      "clear-definition",
      "feature-graph-links",
      "evaluation-criteria",
      "not-feature-duplicate",
    ],
    weights: withWeights({
      "subject-depth": 1.2,
      "content-differentiation": 1.1,
      "decision-support": 1.0,
    }),
  },
  requirement: {
    id: "RequirementQualityProfile",
    pageType: "requirement",
    label: "Requirement detail",
    description:
      "Buyer requirement with acceptance criteria, feature mappings, and evaluation help.",
    expectedIntent: "informational",
    expectedSections: [
      "definition",
      "acceptance-criteria",
      "feature-mappings",
      "questions-to-ask",
      "next-step",
    ],
    checklist: [
      "acceptance-criteria",
      "feature-or-capability-links",
      "vendor-questions",
      "scorecard-or-finder-handoff",
    ],
    weights: withWeights({
      "decision-support": 1.4,
      actionability: 1.2,
      "subject-depth": 1.1,
      "evidence-source-quality": 0.7,
    }),
  },
  feature: {
    id: "FeatureQualityProfile",
    pageType: "feature",
    label: "Feature detail",
    description:
      "Feature explanation with need guidance, product support evidence, and visuals for pillars.",
    expectedIntent: "informational",
    expectedSections: [
      "definition",
      "need-guidance",
      "workflow",
      "requirement-mappings",
      "product-support",
      "evidence",
      "next-step",
    ],
    checklist: [
      "definition",
      "need-if-guidance",
      "requirement-mappings",
      "support-evidence-not-invented",
      "teaching-visual-for-pillars",
    ],
    weights: withWeights({
      "evidence-source-quality": 1.3,
      "subject-depth": 1.2,
      "visual-media-support": 0.9,
      "content-differentiation": 0.9,
    }),
  },
  "implementation-guide": {
    id: "ImplementationGuideQualityProfile",
    pageType: "implementation-guide",
    label: "Implementation guide",
    description:
      "Rollout / migration / adoption guide focused on doing the work — not ranking products.",
    expectedIntent: "implementation",
    expectedSections: [
      "quick-answer",
      "prerequisites",
      "phases-or-steps",
      "risks",
      "checklist",
      "resources",
      "next-step",
    ],
    checklist: [
      "implementation-primary-intent",
      "not-half-product-ranking",
      "checklist-or-plan",
      "risks-and-edge-cases",
      "resource-or-tool-handoff",
    ],
    weights: withWeights({
      actionability: 1.4,
      "subject-depth": 1.3,
      "decision-support": 0.5,
      "user-intent-fit": 1.4,
      "visual-media-support": 0.8,
    }),
  },
  resource: {
    id: "ResourceQualityProfile",
    pageType: "resource",
    label: "Resource / checklist",
    description:
      "Downloadable or interactive artifact that operationalizes a decision or implementation step.",
    expectedIntent: "informational",
    expectedSections: [
      "purpose",
      "how-to-use",
      "artifact",
      "related-guides",
      "next-step",
    ],
    checklist: [
      "usable-artifact",
      "usage-instructions",
      "linked-from-journey",
      "not-thin-landing-only",
    ],
    weights: withWeights({
      actionability: 1.5,
      "original-value": 1.2,
      "subject-depth": 0.7,
      "evidence-source-quality": 0.4,
      "visual-media-support": 0.6,
    }),
    visualsOptional: true,
  },
  "tool-landing": {
    id: "ToolLandingQualityProfile",
    pageType: "tool-landing",
    label: "Tool landing page",
    description:
      "Interactive tool entry: explains job, inputs, outputs, and handoff into the journey.",
    expectedIntent: "commercial",
    expectedSections: [
      "what-it-does",
      "who-its-for",
      "how-it-works",
      "tool-cta",
      "related-guides",
      "next-step",
    ],
    checklist: [
      "clear-job-to-be-done",
      "tool-entrypoint",
      "input-output-explained",
      "journey-context",
    ],
    weights: withWeights({
      actionability: 1.5,
      "decision-support": 1.3,
      "journey-next-step": 1.1,
      "subject-depth": 0.6,
      "evidence-source-quality": 0.4,
    }),
    visualsOptional: true,
  },
};

export function getProfileForPageType(
  pageType: ContentQualityPageType,
): PageQualityProfile {
  return PAGE_QUALITY_PROFILES[pageType];
}

export function resolveWeights(
  profile: PageQualityProfile,
): Record<ContentQualityDimensionId, number> {
  const out = {} as Record<ContentQualityDimensionId, number>;
  for (const id of Object.keys(BASE_WEIGHTS) as ContentQualityDimensionId[]) {
    out[id] = profile.weights[id] ?? BASE_WEIGHTS[id] ?? 1;
  }
  return out;
}
