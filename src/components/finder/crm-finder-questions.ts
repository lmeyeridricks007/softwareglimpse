import type {
  BudgetBand,
  EasePreference,
} from "@/domain";

/**
 * Config-driven CRM Finder questions.
 * Option values map to catalogue taxonomy / finder schema slugs only.
 */

export type FinderOption = {
  value: string;
  label: string;
  description?: string;
};

export type FinderQuestionId =
  | "companySize"
  | "crmUsers"
  | "primaryGoal"
  | "capabilities"
  | "integrations"
  | "budget"
  | "ease"
  | "businessType";

export type FinderQuestion =
  | {
      id: FinderQuestionId;
      kind: "single";
      title: string;
      description?: string;
      field: "companySizeSlug" | "primaryUseCaseSlug" | "budgetBand" | "easePreference" | "businessTypeSlug";
      options: FinderOption[];
      optional?: boolean;
      skipLabel?: string;
    }
  | {
      id: FinderQuestionId;
      kind: "multi";
      title: string;
      description?: string;
      field: "requiredFeatureSlugs" | "preferredIntegrationSlugs";
      options: FinderOption[];
      minSelected?: number;
      exclusiveValue?: string;
    }
  | {
      id: FinderQuestionId;
      kind: "number";
      title: string;
      description?: string;
      field: "crmUsers";
      min: number;
      max: number;
      defaultValue: number;
    };

/** Business size options aligned to taxonomy employee ranges. */
export const COMPANY_SIZE_OPTIONS: FinderOption[] = [
  {
    value: "solo",
    label: "Solo / Freelancer",
    description: "Just me managing contacts and tasks",
  },
  {
    value: "micro",
    label: "Micro team",
    description: "2–10 employees",
  },
  {
    value: "small-business",
    label: "Small business",
    description: "11–50 employees",
  },
  {
    value: "mid-market",
    label: "Growing / mid-market",
    description: "51–500 employees",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "501+ employees",
  },
];

export const USE_CASE_OPTIONS: FinderOption[] = [
  { value: "pipeline-management", label: "Pipeline & deal management" },
  { value: "lead-management", label: "Lead management" },
  { value: "contact-management", label: "Contact & relationship management" },
  { value: "sales-automation", label: "Sales automation" },
  { value: "email-outreach", label: "Email outreach & sequences" },
  { value: "sales-engagement", label: "Sales engagement" },
  { value: "reporting", label: "Reporting & forecasting" },
];

/** Canonical CRM feature slugs only — see src/data/seed/features.ts */
export const CAPABILITY_OPTIONS: FinderOption[] = [
  { value: "contact-management", label: "Contact management" },
  { value: "lead-management", label: "Lead management" },
  { value: "pipeline-management", label: "Pipeline management" },
  { value: "deal-management", label: "Deal management" },
  { value: "email-sync", label: "Email sync" },
  { value: "email-sequences", label: "Email sequences" },
  { value: "workflow-automation", label: "Workflow automation" },
  { value: "lead-scoring", label: "Lead scoring" },
  { value: "reporting", label: "Reporting" },
  { value: "forecasting", label: "Forecasting" },
  { value: "custom-fields", label: "Custom fields" },
  { value: "custom-pipelines", label: "Custom pipelines" },
  { value: "mobile-app", label: "Mobile app" },
  { value: "ai-assistance", label: "AI assistance" },
  { value: "call-functionality", label: "Call functionality" },
  { value: "meeting-scheduling", label: "Meeting scheduling" },
];

export const INTEGRATION_OPTIONS: FinderOption[] = [
  { value: "gmail", label: "Gmail" },
  { value: "google-workspace", label: "Google Workspace" },
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "outlook", label: "Outlook" },
  { value: "slack", label: "Slack" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "zapier", label: "Zapier" },
  { value: "quickbooks", label: "QuickBooks" },
  { value: "xero", label: "Xero" },
  { value: "mailchimp", label: "Mailchimp" },
  { value: "none", label: "None / not sure" },
];

export const BUDGET_OPTIONS: FinderOption[] = (
  [
    ["under-15", "Under €15 / user / month"],
    ["15-30", "€15–30 / user / month"],
    ["30-60", "€30–60 / user / month"],
    ["60-100", "€60–100 / user / month"],
    ["100-plus", "€100+ / user / month"],
    ["no-limit", "No hard limit"],
  ] as const satisfies ReadonlyArray<readonly [BudgetBand, string]>
).map(([value, label]) => ({ value, label }));

export const EASE_OPTIONS: FinderOption[] = (
  [
    [
      "easy-setup",
      "Easy setup first",
      "Prefer fast onboarding and low admin burden",
    ],
    [
      "balanced",
      "Balanced",
      "Some customization without heavy complexity",
    ],
    [
      "advanced-customization",
      "Advanced customization",
      "Willing to invest in setup for deeper control",
    ],
  ] as const satisfies ReadonlyArray<
    readonly [EasePreference, string, string]
  >
).map(([value, label, description]) => ({ value, label, description }));

export const BUSINESS_TYPE_OPTIONS: FinderOption[] = [
  { value: "startup", label: "Startup" },
  { value: "agency", label: "Agency" },
  { value: "consultancy", label: "Consultancy" },
  { value: "professional-services", label: "Professional services" },
  { value: "saas", label: "SaaS" },
  { value: "local-business", label: "Local business" },
];

export const CRM_FINDER_QUESTIONS: FinderQuestion[] = [
  {
    id: "companySize",
    kind: "single",
    title: "What best describes your business size?",
    description: "We'll match CRMs that fit teams at your scale.",
    field: "companySizeSlug",
    options: COMPANY_SIZE_OPTIONS,
  },
  {
    id: "businessType",
    kind: "single",
    title: "What type of business are you choosing a CRM for?",
    description: "Optional — skip if it does not apply.",
    field: "businessTypeSlug",
    options: BUSINESS_TYPE_OPTIONS,
    optional: true,
    skipLabel: "Skip — not important",
  },
  {
    id: "crmUsers",
    kind: "number",
    title: "How many people will use the CRM?",
    description:
      "Seat count helps when verified pricing is available for budget fit.",
    field: "crmUsers",
    min: 1,
    max: 5000,
    defaultValue: 5,
  },
  {
    id: "primaryGoal",
    kind: "single",
    title: "What do you most want your CRM to improve?",
    description: "Pick the primary use case that matters most right now.",
    field: "primaryUseCaseSlug",
    options: USE_CASE_OPTIONS,
  },
  {
    id: "capabilities",
    kind: "multi",
    title: "Which capabilities are essential?",
    description:
      "Select must-have features. Missing catalogue support lowers fit; unknown evidence lowers confidence — we never invent support.",
    field: "requiredFeatureSlugs",
    options: CAPABILITY_OPTIONS,
    minSelected: 0,
  },
  {
    id: "integrations",
    kind: "multi",
    title: "What does your CRM need to work with?",
    description:
      "Preferred integrations. Unknown data lowers confidence — it does not invent support.",
    field: "preferredIntegrationSlugs",
    options: INTEGRATION_OPTIONS,
    exclusiveValue: "none",
  },
  {
    id: "budget",
    kind: "single",
    title: "What's your approximate budget per user / month?",
    description:
      "EUR bands from public pricing. Products without pricing stay budget-unknown.",
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

/** Progress stages for the CRM Finder shell. */
export const CRM_FINDER_STAGES = [
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

export function stageIndexForQuestion(
  questionId: FinderQuestionId | "review" | "results",
): number {
  if (questionId === "review" || questionId === "results") {
    return CRM_FINDER_STAGES.length - 1;
  }
  const idx = CRM_FINDER_STAGES.findIndex((stage) =>
    (stage.questionIds as readonly string[]).includes(questionId),
  );
  return idx >= 0 ? idx : 0;
}

/** First CRM Finder question index for a progress stage (or -1 for Results). */
export function firstQuestionIndexForStage(stageId: string): number {
  const stage = CRM_FINDER_STAGES.find((s) => s.id === stageId);
  if (!stage || stage.questionIds.length === 0) return -1;
  const questionId = stage.questionIds[0];
  return CRM_FINDER_QUESTIONS.findIndex((q) => q.id === questionId);
}

export function labelForOption(
  options: FinderOption[],
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label ?? value;
}
