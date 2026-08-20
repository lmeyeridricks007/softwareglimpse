import type {
  FinderOption,
  FinderQuestion,
  FinderQuestionId,
} from "./crm-finder-questions";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  labelForOption,
} from "./crm-finder-questions";

/**
 * Config-driven Sales Intelligence Finder questions.
 * Option values map to SI catalogue taxonomy / feature slugs only.
 */

export {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  labelForOption,
  type FinderOption,
  type FinderQuestion,
  type FinderQuestionId,
} from "./crm-finder-questions";

/** Primary SI jobs — use-case / subcategory slugs from the catalogue. */
export const SI_USE_CASE_OPTIONS: FinderOption[] = [
  { value: "prospecting", label: "Prospecting & lead discovery" },
  { value: "data-enrichment", label: "Data enrichment" },
  { value: "contact-data", label: "Contact & company data" },
  { value: "email-outreach", label: "Email outreach" },
  { value: "sales-engagement", label: "Sales engagement sequences" },
];

/** SI capability slugs — see src/data/seed/features.ts */
export const SI_CAPABILITY_OPTIONS: FinderOption[] = [
  { value: "contact-data", label: "Contact data" },
  { value: "prospecting", label: "Prospecting" },
  { value: "data-enrichment", label: "Data enrichment" },
  { value: "list-building", label: "List building" },
  { value: "crm-sync", label: "CRM sync" },
  { value: "email-outreach", label: "Email outreach" },
  { value: "email-sequences", label: "Email sequences" },
  { value: "data-export", label: "Data export" },
  { value: "lead-scoring", label: "Lead scoring" },
  { value: "ai-assistance", label: "AI assistance" },
  { value: "reporting", label: "Reporting" },
  { value: "integrations", label: "Integrations" },
];

export const SI_INTEGRATION_OPTIONS: FinderOption[] = [
  { value: "salesforce", label: "Salesforce" },
  { value: "hubspot", label: "HubSpot" },
  { value: "pipedrive", label: "Pipedrive" },
  { value: "gmail", label: "Gmail" },
  { value: "outlook", label: "Outlook" },
  { value: "zapier", label: "Zapier" },
  { value: "none", label: "None / not sure" },
];

export const SI_FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: "companySize",
    kind: "single",
    title: "What best describes your business size?",
    description:
      "We'll match sales intelligence tools that fit teams at your scale.",
    field: "companySizeSlug",
    options: COMPANY_SIZE_OPTIONS,
  },
  {
    id: "businessType",
    kind: "single",
    title: "What type of business are you choosing a tool for?",
    description: "Optional — skip if it does not apply.",
    field: "businessTypeSlug",
    options: BUSINESS_TYPE_OPTIONS,
    optional: true,
    skipLabel: "Skip — not important",
  },
  {
    id: "crmUsers",
    kind: "number",
    title: "How many people will use the tool?",
    description:
      "Seat count helps when verified per-seat pricing is available. Credit-based plans often stay budget-unknown.",
    field: "crmUsers",
    min: 1,
    max: 5000,
    defaultValue: 5,
  },
  {
    id: "primaryGoal",
    kind: "single",
    title: "What primary job do you need sales intelligence for?",
    description: "Pick the use case that matters most right now.",
    field: "primaryUseCaseSlug",
    options: SI_USE_CASE_OPTIONS,
  },
  {
    id: "capabilities",
    kind: "multi",
    title: "Which capabilities are essential?",
    description:
      "Select must-have features. Missing catalogue support lowers fit; unknown evidence lowers confidence — we never invent support.",
    field: "requiredFeatureSlugs",
    options: SI_CAPABILITY_OPTIONS,
    minSelected: 0,
  },
  {
    id: "integrations",
    kind: "multi",
    title: "What does the tool need to work with?",
    description:
      "Preferred integrations. Unknown data lowers confidence — it does not invent support.",
    field: "preferredIntegrationSlugs",
    options: SI_INTEGRATION_OPTIONS,
    exclusiveValue: "none",
  },
  {
    id: "budget",
    kind: "single",
    title: "What's your approximate budget per user / month?",
    description:
      "EUR bands from public pricing where available. Credit-based and quote-only vendors often stay budget-unknown.",
    field: "budgetBand",
    options: BUDGET_OPTIONS,
  },
  {
    id: "ease",
    kind: "single",
    title: "How much setup complexity are you comfortable with?",
    field: "easePreference",
    options: EASE_OPTIONS,
  },
];

/** Progress stages for the SI Finder shell. */
export const SI_FINDER_STAGES = [
  {
    id: "business",
    label: "Business",
    questionIds: ["companySize", "businessType"] as FinderQuestionId[],
  },
  {
    id: "team",
    label: "Team",
    questionIds: ["crmUsers"] as FinderQuestionId[],
  },
  {
    id: "goals",
    label: "Goals",
    questionIds: ["primaryGoal"] as FinderQuestionId[],
  },
  {
    id: "features",
    label: "Features",
    questionIds: ["capabilities"] as FinderQuestionId[],
  },
  {
    id: "integrations",
    label: "Integrations",
    questionIds: ["integrations"] as FinderQuestionId[],
  },
  {
    id: "budget",
    label: "Budget",
    questionIds: ["budget", "ease"] as FinderQuestionId[],
  },
  {
    id: "results",
    label: "Results",
    questionIds: [] as FinderQuestionId[],
  },
] as const;

export function siStageIndexForQuestion(
  questionId: FinderQuestionId | "review" | "results",
): number {
  if (questionId === "review" || questionId === "results") {
    return SI_FINDER_STAGES.length - 1;
  }
  const idx = SI_FINDER_STAGES.findIndex((stage) =>
    (stage.questionIds as readonly string[]).includes(questionId),
  );
  return idx >= 0 ? idx : 0;
}

export function siFirstQuestionIndexForStage(stageId: string): number {
  const stage = SI_FINDER_STAGES.find((s) => s.id === stageId);
  if (!stage || stage.questionIds.length === 0) return -1;
  const questionId = stage.questionIds[0];
  return SI_FINDER_QUESTIONS.findIndex((q) => q.id === questionId);
}
