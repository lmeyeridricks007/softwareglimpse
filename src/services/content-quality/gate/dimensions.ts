import type { GateDimensionId } from "./types";

/** Human-readable dimension definitions — every score must be explainable. */
export const GATE_DIMENSION_META: Record<
  GateDimensionId,
  { label: string; explanation: string }
> = {
  searchIntentFit: {
    label: "Search intent fit",
    explanation:
      "Does the page answer the query a buyer would type, without diluting the primary job?",
  },
  uniqueValue: {
    label: "Unique value",
    explanation:
      "Does the page add SoftwareGlimpse-specific analysis, frameworks, or evidence — not boilerplate?",
  },
  dataCompleteness: {
    label: "Data completeness",
    explanation:
      "Are required facts present for this page type (pricing, criteria, products, scenarios)?",
  },
  decisionSupport: {
    label: "Decision support",
    explanation:
      "Can a buyer choose or shortlist from this page (verdict, best-for, trade-offs, next step)?",
  },
  evidenceQuality: {
    label: "Evidence quality",
    explanation:
      "Are claims backed by sources, verification timestamps, or recorded testing — not unsupported assertions?",
  },
  freshness: {
    label: "Freshness",
    explanation:
      "Is material data (pricing, research dates) recent enough for a buying decision?",
  },
  internalDiscoverability: {
    label: "Internal discoverability",
    explanation:
      "Is the page reachable from hubs/related content and does it hand off to a useful next step?",
  },
  contentSpecificity: {
    label: "Content specificity",
    explanation:
      "Is the page specific to its subject (product, category, industry) rather than generic filler?",
  },
  technicalSEO: {
    label: "Technical SEO",
    explanation:
      "Canonical, route validity, title/description basics — without treating word count as a gate.",
  },
  duplicationRisk: {
    label: "Duplication risk",
    explanation:
      "Does the page cannibalize a stronger sibling or near-duplicate existing estate content?",
  },
};
