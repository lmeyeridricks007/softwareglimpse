import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import {
  BUDGET_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  labelForOption,
  type FinderQuestion,
  type FinderQuestionId,
} from "./crm-finder-questions";

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

export function buildCategoryFinderQuestions(
  kit: CategoryFinderClientKit,
): FinderQuestion[] {
  return [
    {
      id: "companySize",
      kind: "single",
      title: "What best describes your business size?",
      description: `We'll match ${kit.softwarePhrase} that fit teams at your scale.`,
      field: "companySizeSlug",
      options: COMPANY_SIZE_OPTIONS,
    },
    {
      id: "businessType",
      kind: "single",
      title: `What type of business are you choosing ${kit.softwarePhrase} for?`,
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
        "Seat count helps when verified per-seat pricing is available. Usage-based and quote-only plans often stay budget-unknown.",
      field: "crmUsers",
      min: 1,
      max: 5000,
      defaultValue: 5,
    },
    {
      id: "primaryGoal",
      kind: "single",
      title: `What primary job do you need ${kit.softwarePhrase} for?`,
      description: "Pick the use case that matters most right now.",
      field: "primaryUseCaseSlug",
      options: kit.useCaseOptions,
    },
    {
      id: "capabilities",
      kind: "multi",
      title: "Which capabilities are essential?",
      description:
        "Select must-have features. Missing catalogue support lowers fit; unknown evidence lowers confidence — we never invent support.",
      field: "requiredFeatureSlugs",
      options: kit.capabilityOptions,
      minSelected: 0,
    },
    {
      id: "integrations",
      kind: "multi",
      title: "What does the tool need to work with?",
      description:
        "Preferred integrations. Unknown data lowers confidence — it does not invent support.",
      field: "preferredIntegrationSlugs",
      options: kit.integrationOptions,
      exclusiveValue: "none",
    },
    {
      id: "budget",
      kind: "single",
      title: "What's your approximate budget per user / month?",
      description:
        "EUR bands from public pricing where available. Usage-based and quote-only vendors often stay budget-unknown.",
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
}

export const CATEGORY_FINDER_STAGES = [
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
];

export function categoryStageIndexForQuestion(
  questionId: FinderQuestionId,
): number {
  const index = CATEGORY_FINDER_STAGES.findIndex((stage) =>
    stage.questionIds.includes(questionId),
  );
  return index < 0 ? 0 : index;
}

export function categoryFirstQuestionIndexForStage(
  stageId: string,
  questions: FinderQuestion[],
): number {
  const stage = CATEGORY_FINDER_STAGES.find((s) => s.id === stageId);
  const firstId = stage?.questionIds[0];
  if (!firstId) return 0;
  const index = questions.findIndex((q) => q.id === firstId);
  return index < 0 ? 0 : index;
}
