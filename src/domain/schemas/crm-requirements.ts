import { z } from "zod";
import { SlugSchema } from "./primitives";
import {
  BudgetBandSchema,
  type CrmFinderAnswers,
} from "./finder";

export const BillingPreferenceSchema = z.enum([
  "monthly",
  "annual",
  "either",
]);

export type BillingPreference = z.infer<typeof BillingPreferenceSchema>;

/**
 * Shared CRM cost inputs — finder handoff and calculator UI both map here.
 */
export const CrmRequirementsSchema = z.object({
  crmUsers: z.number().int().min(1).max(10_000),
  requiredFeatureSlugs: z.array(SlugSchema).default([]),
  preferredFeatureSlugs: z.array(SlugSchema).optional(),
  billingPreference: BillingPreferenceSchema.default("either"),
  companySizeSlug: SlugSchema.optional(),
  primaryUseCaseSlug: SlugSchema.optional(),
  budgetBand: BudgetBandSchema.optional(),
});

export type CrmRequirements = z.infer<typeof CrmRequirementsSchema>;

export function crmRequirementsFromFinderAnswers(
  answers: CrmFinderAnswers,
  billingPreference: BillingPreference = "either",
): CrmRequirements {
  return CrmRequirementsSchema.parse({
    crmUsers: answers.crmUsers,
    requiredFeatureSlugs: answers.requiredFeatureSlugs ?? [],
    preferredFeatureSlugs: answers.preferredFeatureSlugs,
    billingPreference,
    companySizeSlug: answers.companySizeSlug,
    primaryUseCaseSlug: answers.primaryUseCaseSlug,
    budgetBand: answers.budgetBand,
  });
}

export function crmRequirementsFromCalculatorInput(input: {
  crmUsers: number;
  requiredFeatureSlugs?: string[];
  preferredFeatureSlugs?: string[];
  billingPreference?: BillingPreference;
  companySizeSlug?: string;
  primaryUseCaseSlug?: string;
  budgetBand?: CrmRequirements["budgetBand"];
}): CrmRequirements {
  return CrmRequirementsSchema.parse({
    crmUsers: input.crmUsers,
    requiredFeatureSlugs: input.requiredFeatureSlugs ?? [],
    preferredFeatureSlugs: input.preferredFeatureSlugs,
    billingPreference: input.billingPreference ?? "either",
    companySizeSlug: input.companySizeSlug,
    primaryUseCaseSlug: input.primaryUseCaseSlug,
    budgetBand: input.budgetBand,
  });
}
