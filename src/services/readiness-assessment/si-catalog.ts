/**
 * Sales Intelligence Readiness Assessment catalog.
 * Dimensions focused on SI buying readiness — not CRM pipeline implementation.
 * Version: si-readiness-v1.
 */

import { SI_READINESS_ASSESSMENT_VERSION } from "@/domain";
import type {
  AnswerOption,
  OrgComplexity,
  QuestionCondition,
  QuestionType,
  ReadinessDimensionDef,
  ReadinessQuestionDef,
} from "./catalog";

export { SI_READINESS_ASSESSMENT_VERSION };

export const SI_READINESS_DIMENSIONS: ReadinessDimensionDef[] = [
  {
    id: "icp-clarity",
    slug: "icp-clarity",
    title: "ICP clarity",
    shortTitle: "ICP",
    description:
      "Whether target accounts, personas, and geographies are clear enough to evaluate coverage.",
    selectionWeight: 1.4,
    implementationWeight: 0.8,
    estimatedMinutes: 1,
  },
  {
    id: "crm-sor-readiness",
    slug: "crm-sor-readiness",
    title: "CRM system-of-record readiness",
    shortTitle: "CRM SoR",
    description:
      "Whether CRM is ready to receive synced prospect data without chaos.",
    selectionWeight: 1.1,
    implementationWeight: 1.4,
    estimatedMinutes: 1,
  },
  {
    id: "data-ownership",
    slug: "data-ownership",
    title: "Data ownership",
    shortTitle: "Data ownership",
    description:
      "Who owns prospect data quality, enrichment rules, and list hygiene.",
    selectionWeight: 1.0,
    implementationWeight: 1.2,
    estimatedMinutes: 1,
  },
  {
    id: "compliance-owner",
    slug: "compliance-owner",
    title: "Compliance owner",
    shortTitle: "Compliance",
    description:
      "Whether lawful outreach and suppression have a named owner — not legal advice.",
    selectionWeight: 1.2,
    implementationWeight: 1.1,
    estimatedMinutes: 1,
  },
  {
    id: "volume-credit-planning",
    slug: "volume-credit-planning",
    title: "Volume / credit planning",
    shortTitle: "Credits",
    description:
      "Whether expected search, reveal, enrich, and export volume is modeled.",
    selectionWeight: 1.3,
    implementationWeight: 1.0,
    estimatedMinutes: 1,
  },
  {
    id: "enrichment-vs-list",
    slug: "enrichment-vs-list",
    title: "Enrichment vs list-buy decision",
    shortTitle: "Enrich vs list",
    description:
      "Whether the team knows if it needs enrichment, database access, or both.",
    selectionWeight: 1.2,
    implementationWeight: 0.7,
    estimatedMinutes: 1,
  },
  {
    id: "outbound-maturity",
    slug: "outbound-maturity",
    title: "Outbound process maturity",
    shortTitle: "Outbound",
    description:
      "Whether cadences, ownership, and handoffs exist to use SI data productively.",
    selectionWeight: 1.0,
    implementationWeight: 1.3,
    estimatedMinutes: 1,
  },
  {
    id: "success-metrics",
    slug: "success-metrics",
    title: "Success metrics",
    shortTitle: "Metrics",
    description:
      "Whether trial and post-purchase success metrics are defined up front.",
    selectionWeight: 1.1,
    implementationWeight: 1.0,
    estimatedMinutes: 1,
  },
];

const YPN: AnswerOption[] = [
  { id: "yes", label: "Yes", points: 100 },
  { id: "partly", label: "Partly", points: 55 },
  { id: "no", label: "No", points: 15 },
  { id: "unsure", label: "Not sure", points: 40, uncertain: true },
];

const MATURITY: AnswerOption[] = [
  { id: "strong", label: "Strong / documented", points: 100 },
  { id: "adequate", label: "Adequate", points: 70 },
  { id: "weak", label: "Weak / informal", points: 35 },
  { id: "none", label: "Missing", points: 10 },
  { id: "unsure", label: "Not sure", points: 40, uncertain: true },
];

export const SI_READINESS_QUESTIONS: ReadinessQuestionDef[] = [
  // ICP clarity
  {
    id: "si-icp-segments",
    dimensionId: "icp-clarity",
    type: "yes-partly-no",
    prompt: "Are ICP segments (industry, size, geography) written down?",
    helpText: "Coverage tests fail without a concrete account definition.",
    options: YPN,
    selectionWeight: 1.2,
    implementationWeight: 0.6,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },
  {
    id: "si-icp-personas",
    dimensionId: "icp-clarity",
    type: "yes-partly-no",
    prompt: "Are target personas / titles defined for outbound?",
    options: YPN,
    selectionWeight: 1.0,
    implementationWeight: 0.5,
  },
  {
    id: "si-icp-sample-list",
    dimensionId: "icp-clarity",
    type: "yes-partly-no",
    prompt: "Can you produce a sample of ~100–200 target accounts for a coverage test?",
    options: YPN,
    selectionWeight: 1.3,
    implementationWeight: 0.7,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },

  // CRM SoR
  {
    id: "si-crm-exists",
    dimensionId: "crm-sor-readiness",
    type: "yes-partly-no",
    prompt: "Is there a CRM that will be the system of record for prospect data?",
    options: YPN,
    selectionWeight: 1.1,
    implementationWeight: 1.4,
    riskSeverity: "critical",
    criticalWhen: ["no"],
  },
  {
    id: "si-crm-owner",
    dimensionId: "crm-sor-readiness",
    type: "yes-partly-no",
    prompt: "Is there an owner for CRM fields, duplicates, and sync rules?",
    options: YPN,
    selectionWeight: 0.9,
    implementationWeight: 1.3,
  },
  {
    id: "si-crm-dedupe",
    dimensionId: "crm-sor-readiness",
    type: "maturity",
    prompt: "How mature is contact/account deduplication in CRM today?",
    options: MATURITY,
    selectionWeight: 0.8,
    implementationWeight: 1.2,
  },

  // Data ownership
  {
    id: "si-data-owner",
    dimensionId: "data-ownership",
    type: "yes-partly-no",
    prompt: "Is there a named owner for prospect data quality?",
    options: YPN,
    selectionWeight: 1.0,
    implementationWeight: 1.2,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },
  {
    id: "si-enrich-rules",
    dimensionId: "data-ownership",
    type: "maturity",
    prompt: "Are enrichment / overwrite rules agreed (what may update CRM)?",
    options: MATURITY,
    selectionWeight: 0.9,
    implementationWeight: 1.1,
  },
  {
    id: "si-list-hygiene",
    dimensionId: "data-ownership",
    type: "maturity",
    prompt: "How mature is list hygiene (bounces, unsubscribes, stale records)?",
    options: MATURITY,
    selectionWeight: 0.8,
    implementationWeight: 1.0,
  },

  // Compliance
  {
    id: "si-compliance-owner",
    dimensionId: "compliance-owner",
    type: "yes-partly-no",
    prompt: "Is there a named owner for outreach compliance / suppression?",
    helpText: "This is an ownership check — not legal advice.",
    options: YPN,
    selectionWeight: 1.3,
    implementationWeight: 1.1,
    riskSeverity: "critical",
    criticalWhen: ["no"],
  },
  {
    id: "si-suppression-list",
    dimensionId: "compliance-owner",
    type: "yes-partly-no",
    prompt: "Do you maintain a usable suppression / do-not-contact list?",
    options: YPN,
    selectionWeight: 1.1,
    implementationWeight: 1.0,
  },
  {
    id: "si-region-rules",
    dimensionId: "compliance-owner",
    type: "maturity",
    prompt: "How clear are regional outreach rules for your markets?",
    options: MATURITY,
    selectionWeight: 1.0,
    implementationWeight: 0.9,
  },

  // Volume / credits
  {
    id: "si-volume-estimate",
    dimensionId: "volume-credit-planning",
    type: "yes-partly-no",
    prompt: "Have you estimated monthly search / reveal / enrich volume?",
    options: YPN,
    selectionWeight: 1.3,
    implementationWeight: 0.9,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },
  {
    id: "si-credit-budget",
    dimensionId: "volume-credit-planning",
    type: "yes-partly-no",
    prompt: "Is there a budget owner for seats and credits?",
    options: YPN,
    selectionWeight: 1.1,
    implementationWeight: 1.0,
  },
  {
    id: "si-export-needs",
    dimensionId: "volume-credit-planning",
    type: "yes-partly-no",
    prompt: "Are export rights and destinations (CRM, CSV, engagement) defined?",
    options: YPN,
    selectionWeight: 1.0,
    implementationWeight: 0.8,
  },

  // Enrichment vs list
  {
    id: "si-job-to-be-done",
    dimensionId: "enrichment-vs-list",
    type: "single",
    prompt: "Primary job for sales intelligence right now?",
    options: [
      { id: "database", label: "Build net-new lists from a database", points: 90 },
      { id: "enrich", label: "Enrich existing CRM / list records", points: 90 },
      { id: "both", label: "Both database access and enrichment", points: 100 },
      { id: "unclear", label: "Not decided yet", points: 25, uncertain: true },
    ],
    selectionWeight: 1.4,
    implementationWeight: 0.6,
    riskSeverity: "high",
    criticalWhen: ["unclear"],
  },
  {
    id: "si-list-buy-habit",
    dimensionId: "enrichment-vs-list",
    type: "yes-partly-no",
    prompt: "Are you replacing recurring list buys with a platform?",
    options: YPN,
    selectionWeight: 0.8,
    implementationWeight: 0.5,
  },
  {
    id: "si-intent-needed",
    dimensionId: "enrichment-vs-list",
    type: "single",
    prompt: "Do you need intent / buying signals in v1?",
    options: [
      { id: "required", label: "Required for v1", points: 70 },
      { id: "nice", label: "Nice-to-have", points: 90 },
      { id: "no", label: "Not needed now", points: 100 },
      { id: "unsure", label: "Not sure", points: 40, uncertain: true },
    ],
    selectionWeight: 0.9,
    implementationWeight: 0.4,
  },

  // Outbound maturity
  {
    id: "si-outbound-process",
    dimensionId: "outbound-maturity",
    type: "maturity",
    prompt: "How mature is the outbound / prospecting process today?",
    options: MATURITY,
    selectionWeight: 1.0,
    implementationWeight: 1.3,
  },
  {
    id: "si-engagement-stack",
    dimensionId: "outbound-maturity",
    type: "yes-partly-no",
    prompt: "Is there a sequencing / engagement tool (or CRM sequences) ready?",
    options: YPN,
    selectionWeight: 0.8,
    implementationWeight: 1.0,
  },
  {
    id: "si-rep-capacity",
    dimensionId: "outbound-maturity",
    type: "yes-partly-no",
    prompt: "Do reps have capacity to use new prospect data weekly?",
    options: YPN,
    selectionWeight: 0.7,
    implementationWeight: 1.4,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },

  // Success metrics
  {
    id: "si-trial-metrics",
    dimensionId: "success-metrics",
    type: "yes-partly-no",
    prompt: "Are trial success metrics written (coverage, bounce, sync, adoption)?",
    options: YPN,
    selectionWeight: 1.3,
    implementationWeight: 0.9,
    riskSeverity: "high",
    criticalWhen: ["no"],
  },
  {
    id: "si-owner-decision",
    dimensionId: "success-metrics",
    type: "yes-partly-no",
    prompt: "Is there a named decision owner for the SI purchase?",
    options: YPN,
    selectionWeight: 1.2,
    implementationWeight: 0.8,
    riskSeverity: "critical",
    criticalWhen: ["no"],
  },
  {
    id: "si-post-metrics",
    dimensionId: "success-metrics",
    type: "maturity",
    prompt: "How clear are ongoing KPIs after purchase (pipeline, meetings, data quality)?",
    options: MATURITY,
    selectionWeight: 1.0,
    implementationWeight: 1.0,
  },
];

export function getSiQuestionById(id: string): ReadinessQuestionDef | undefined {
  return SI_READINESS_QUESTIONS.find((q) => q.id === id);
}

export function getSiDimensionById(
  id: string,
): ReadinessDimensionDef | undefined {
  return SI_READINESS_DIMENSIONS.find((d) => d.id === id);
}

// Re-export types used by SI consumers for convenience
export type {
  AnswerOption,
  OrgComplexity,
  QuestionCondition,
  QuestionType,
  ReadinessDimensionDef,
  ReadinessQuestionDef,
};
