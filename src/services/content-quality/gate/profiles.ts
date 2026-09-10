import type { ContentQualityPageType } from "@/domain/schemas/content-quality";
import type { GateDimensionId, GatePageType } from "./types";
import { INDEX_QUALITY_SCORE_MIN } from "./thresholds";

export type GateProfile = {
  pageType: GatePageType;
  label: string;
  description: string;
  /** Maps to existing dimensional evaluator profile. */
  qualityPageType: ContentQualityPageType;
  weights: Record<GateDimensionId, number>;
  /** Minimum qualityScore for indexEligible (never lowered casually). */
  minIndexScore: number;
};

const BASE: Record<GateDimensionId, number> = {
  searchIntentFit: 1.1,
  uniqueValue: 1.0,
  dataCompleteness: 1.0,
  decisionSupport: 1.0,
  evidenceQuality: 0.9,
  freshness: 0.7,
  internalDiscoverability: 0.8,
  contentSpecificity: 1.0,
  technicalSEO: 0.7,
  duplicationRisk: 0.9,
};

function w(
  overrides: Partial<Record<GateDimensionId, number>>,
): Record<GateDimensionId, number> {
  return { ...BASE, ...overrides };
}

export const GATE_PROFILES: Record<GatePageType, GateProfile> = {
  software: {
    pageType: "software",
    label: "Software review",
    description: "Product page: data quality, evidence, decision support.",
    qualityPageType: "product-review",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      dataCompleteness: 1.4,
      evidenceQuality: 1.4,
      decisionSupport: 1.3,
      freshness: 1.1,
      uniqueValue: 1.1,
    }),
  },
  guide: {
    pageType: "guide",
    label: "Guide",
    description: "Educational guide: intent fit, unique value, usefulness.",
    qualityPageType: "guide",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      searchIntentFit: 1.5,
      uniqueValue: 1.4,
      contentSpecificity: 1.2,
      decisionSupport: 0.9,
    }),
  },
  comparison: {
    pageType: "comparison",
    label: "Comparison",
    description:
      "A vs B: decision support, comparison specificity, data completeness.",
    qualityPageType: "comparison",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      decisionSupport: 1.5,
      contentSpecificity: 1.4,
      dataCompleteness: 1.3,
      evidenceQuality: 1.2,
      duplicationRisk: 1.0,
    }),
  },
  "product-explainer": {
    pageType: "product-explainer",
    label: "Product explainer",
    description:
      "what-is / explainer: unique product analysis, intent, specificity.",
    qualityPageType: "product-guide",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      searchIntentFit: 1.3,
      uniqueValue: 1.5,
      contentSpecificity: 1.4,
      duplicationRisk: 1.2,
      decisionSupport: 0.7,
    }),
  },
  best: {
    pageType: "best",
    label: "Best page",
    description: "Shortlist: methodology, decision support, transparency.",
    qualityPageType: "best",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      decisionSupport: 1.4,
      evidenceQuality: 1.2,
      uniqueValue: 1.2,
      dataCompleteness: 1.1,
    }),
  },
  alternatives: {
    pageType: "alternatives",
    label: "Alternatives",
    description: "Alternatives list: specificity, decision support, data.",
    qualityPageType: "best",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      decisionSupport: 1.4,
      contentSpecificity: 1.3,
      dataCompleteness: 1.2,
      uniqueValue: 1.1,
    }),
  },
  category: {
    pageType: "category",
    label: "Category hub",
    description: "Category hub: discoverability, completeness, intent.",
    qualityPageType: "industry",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      internalDiscoverability: 1.4,
      dataCompleteness: 1.2,
      searchIntentFit: 1.2,
      decisionSupport: 1.1,
    }),
  },
  "use-case": {
    pageType: "use-case",
    label: "Use case",
    description: "Job-to-be-done: specificity and decision support.",
    qualityPageType: "use-case",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      contentSpecificity: 1.4,
      decisionSupport: 1.2,
      uniqueValue: 1.1,
    }),
  },
  industry: {
    pageType: "industry",
    label: "Industry",
    description: "Vertical guidance: differentiation and decision support.",
    qualityPageType: "industry",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      contentSpecificity: 1.4,
      uniqueValue: 1.3,
      decisionSupport: 1.2,
      duplicationRisk: 1.1,
    }),
  },
  capability: {
    pageType: "capability",
    label: "Capability",
    description: "Capability hub: specificity and evaluation guidance.",
    qualityPageType: "capability",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      contentSpecificity: 1.3,
      dataCompleteness: 1.2,
      decisionSupport: 1.1,
    }),
  },
  "tool-landing": {
    pageType: "tool-landing",
    label: "Tool landing",
    description: "Decision tool entry: actionability and intent fit.",
    qualityPageType: "tool-landing",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      searchIntentFit: 1.3,
      decisionSupport: 1.4,
      internalDiscoverability: 1.2,
      evidenceQuality: 0.5,
    }),
  },
  research: {
    pageType: "research",
    label: "Research",
    description: "Original research: unique value, evidence, freshness.",
    qualityPageType: "guide",
    minIndexScore: INDEX_QUALITY_SCORE_MIN,
    weights: w({
      uniqueValue: 1.5,
      evidenceQuality: 1.4,
      freshness: 1.3,
      dataCompleteness: 1.2,
      contentSpecificity: 1.1,
    }),
  },
};

export function getGateProfile(pageType: GatePageType): GateProfile {
  return GATE_PROFILES[pageType];
}
