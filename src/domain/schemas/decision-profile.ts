import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";
import {
  BudgetBandSchema,
  EasePreferenceSchema,
  FinderCategorySlugSchema,
  type CrmFinderAnswers,
} from "./finder";
import {
  BillingPreferenceSchema,
  CrmRequirementsSchema,
  type CrmRequirements,
} from "./crm-requirements";

/**
 * Shared cross-tool decision profile.
 * CRM Requirements Builder is the primary writer; Finder / Cost Calculator consume it.
 * Affiliate status must never appear in this model.
 */

export const DecisionProfileVersion = 1 as const;

export const RequirementPrioritySchema = z.enum([
  "must-have",
  "important",
  "nice-to-have",
  "not-needed",
]);
export type RequirementPriority = z.infer<typeof RequirementPrioritySchema>;

export const FeaturePrioritySchema = z.enum([
  "must-have",
  "important",
  "nice-to-have",
]);
export type FeaturePriority = z.infer<typeof FeaturePrioritySchema>;

export const UseCaseSelectionPrioritySchema = z.enum([
  "primary",
  "important",
  "relevant",
]);
export type UseCaseSelectionPriority = z.infer<
  typeof UseCaseSelectionPrioritySchema
>;

export const CapabilitySelectionPrioritySchema = z.enum([
  "critical",
  "high",
  "important",
  "optional",
]);
export type CapabilitySelectionPriority = z.infer<
  typeof CapabilitySelectionPrioritySchema
>;

export const IntegrationPrioritySchema = z.enum([
  "required",
  "preferred",
  "optional",
]);
export type IntegrationPriority = z.infer<typeof IntegrationPrioritySchema>;

export const ProfileItemSourceSchema = z.enum([
  "user-selected",
  "inferred-from-use-case",
  "inferred-from-capability",
  "inferred-from-requirement",
]);
export type ProfileItemSource = z.infer<typeof ProfileItemSourceSchema>;

export const CrmCurrentStateSchema = z.enum([
  "no-crm",
  "spreadsheet",
  "existing-crm",
  "multiple-tools",
]);
export type CrmCurrentState = z.infer<typeof CrmCurrentStateSchema>;

export const AdminComplexitySchema = z.enum([
  "simple",
  "moderate",
  "advanced",
  "doesnt-matter",
]);
export type AdminComplexity = z.infer<typeof AdminComplexitySchema>;

export const MigrationComplexitySchema = z.enum([
  "none",
  "low",
  "medium",
  "high",
]);
export type MigrationComplexity = z.infer<typeof MigrationComplexitySchema>;

export const ProfileUseCaseSchema = z.object({
  id: SlugSchema,
  priority: UseCaseSelectionPrioritySchema,
});
export type ProfileUseCase = z.infer<typeof ProfileUseCaseSchema>;

export const ProfileCapabilitySchema = z.object({
  id: SlugSchema,
  priority: CapabilitySelectionPrioritySchema,
  source: ProfileItemSourceSchema.optional(),
});
export type ProfileCapability = z.infer<typeof ProfileCapabilitySchema>;

export const ProfileRequirementSchema = z.object({
  id: SlugSchema,
  priority: RequirementPrioritySchema,
  source: ProfileItemSourceSchema,
});
export type ProfileRequirement = z.infer<typeof ProfileRequirementSchema>;

export const ProfileFeatureSchema = z.object({
  id: SlugSchema,
  priority: FeaturePrioritySchema,
  source: ProfileItemSourceSchema,
});
export type ProfileFeature = z.infer<typeof ProfileFeatureSchema>;

export const ProfileIntegrationSchema = z.object({
  id: SlugSchema,
  priority: IntegrationPrioritySchema,
});
export type ProfileIntegration = z.infer<typeof ProfileIntegrationSchema>;

export const CrmBusinessContextSchema = z.object({
  industrySlug: SlugSchema.optional(),
  businessTypeSlug: SlugSchema.optional(),
  companySizeSlug: SlugSchema.optional(),
  crmUserCount: z.number().int().min(1).max(10_000).optional(),
  /** Preference labels (not a separate taxonomy). */
  teamIds: z.array(z.string()).default([]),
  currentState: CrmCurrentStateSchema.optional(),
});

export const CrmDecisionBudgetSchema = z.object({
  band: BudgetBandSchema.optional(),
  currency: CurrencyCodeSchema.default("EUR"),
  billingPreference: BillingPreferenceSchema.optional(),
});

export const CrmDecisionImplementationSchema = z.object({
  /** Maps to Finder easePreference where applicable. */
  complexity: EasePreferenceSchema.optional(),
  adminComplexity: AdminComplexitySchema.optional(),
  migrationComplexity: MigrationComplexitySchema.optional(),
});

export const DecisionCategorySlugSchema = FinderCategorySlugSchema;
export type DecisionCategorySlug = z.infer<typeof DecisionCategorySlugSchema>;

/** Shared cross-tool decision profile (CRM + Sales Intelligence). */
export const DecisionProfileSchema = z.object({
  version: z.literal(DecisionProfileVersion),
  categorySlug: DecisionCategorySlugSchema,
  businessContext: CrmBusinessContextSchema.default({
    teamIds: [],
  }),
  useCases: z.array(ProfileUseCaseSchema).default([]),
  capabilities: z.array(ProfileCapabilitySchema).default([]),
  requirements: z.array(ProfileRequirementSchema).default([]),
  features: z.array(ProfileFeatureSchema).default([]),
  integrations: z.array(ProfileIntegrationSchema).default([]),
  budget: CrmDecisionBudgetSchema.default({ currency: "EUR" }),
  implementation: CrmDecisionImplementationSchema.default({}),
  shortlistProductIds: z.array(SlugSchema).default([]),
  selectedProductId: SlugSchema.optional(),
  /** Last wizard step id for resume. */
  wizardStepId: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

/** @deprecated Prefer DecisionProfileSchema — kept for existing CRM imports. */
export const CrmDecisionProfileSchema = DecisionProfileSchema;

export type DecisionProfile = z.infer<typeof DecisionProfileSchema>;
export type CrmDecisionProfile = DecisionProfile;
export type SiDecisionProfile = DecisionProfile;

export const CRM_DECISION_PROFILE_STORAGE_KEY = "sg-crm-decision-profile-v1";
export const SI_DECISION_PROFILE_STORAGE_KEY = "sg-si-decision-profile-v1";

export function decisionProfileStorageKey(
  category: DecisionCategorySlug,
): string {
  if (category === "crm") return CRM_DECISION_PROFILE_STORAGE_KEY;
  if (category === "sales-intelligence") return SI_DECISION_PROFILE_STORAGE_KEY;
  return `sg-${category}-decision-profile-v1`;
}

export function createEmptyDecisionProfile(
  category: DecisionCategorySlug = "crm",
  now: string = new Date().toISOString(),
): DecisionProfile {
  return DecisionProfileSchema.parse({
    version: DecisionProfileVersion,
    categorySlug: category,
    createdAt: now,
    updatedAt: now,
  });
}

export function createEmptyCrmDecisionProfile(
  now: string = new Date().toISOString(),
): CrmDecisionProfile {
  return createEmptyDecisionProfile("crm", now);
}

export function createEmptySiDecisionProfile(
  now: string = new Date().toISOString(),
): SiDecisionProfile {
  return createEmptyDecisionProfile("sales-intelligence", now);
}

/** Feature slugs Finder treats as hard requirements. */
export function mustHaveFeatureSlugs(profile: DecisionProfile): string[] {
  return profile.features
    .filter((f) => f.priority === "must-have")
    .map((f) => f.id);
}

export function preferredFeatureSlugs(profile: DecisionProfile): string[] {
  return profile.features
    .filter(
      (f) => f.priority === "important" || f.priority === "nice-to-have",
    )
    .map((f) => f.id);
}

/**
 * Map decision profile → Finder answers.
 * Primary use case comes from the highest-priority selected use case that has a
 * finder slug mapping (resolved by the caller via mapUseCaseToFinderSlug).
 */
export function crmFinderAnswersFromDecisionProfile(
  profile: DecisionProfile,
  options: {
    primaryUseCaseSlug: string;
    secondaryUseCaseSlugs?: string[];
  },
): CrmFinderAnswers | null {
  const size = profile.businessContext.companySizeSlug;
  const users = profile.businessContext.crmUserCount;
  if (!size || users == null) return null;

  const required = mustHaveFeatureSlugs(profile);
  const preferred = preferredFeatureSlugs(profile).filter(
    (slug) => !required.includes(slug),
  );
  const integrations = profile.integrations
    .filter((i) => i.priority === "required" || i.priority === "preferred")
    .map((i) => i.id)
    .filter((id) => id !== "none");

  return {
    companySizeSlug: size,
    crmUsers: users,
    primaryUseCaseSlug: options.primaryUseCaseSlug,
    secondaryUseCaseSlugs: options.secondaryUseCaseSlugs,
    requiredFeatureSlugs: required,
    preferredFeatureSlugs: preferred.length > 0 ? preferred : undefined,
    preferredIntegrationSlugs:
      integrations.length > 0 ? integrations : undefined,
    budgetBand: profile.budget.band,
    budgetMode: "per-user-month",
    easePreference: profile.implementation.complexity,
    businessTypeSlug: profile.businessContext.businessTypeSlug,
  };
}

/** Map decision profile → shared cost calculator inputs. */
export function crmRequirementsFromDecisionProfile(
  profile: DecisionProfile,
): CrmRequirements | null {
  const users = profile.businessContext.crmUserCount;
  if (users == null) return null;

  const primary = profile.useCases.find((u) => u.priority === "primary");
  return CrmRequirementsSchema.parse({
    crmUsers: users,
    requiredFeatureSlugs: mustHaveFeatureSlugs(profile),
    preferredFeatureSlugs: preferredFeatureSlugs(profile),
    billingPreference: profile.budget.billingPreference ?? "either",
    companySizeSlug: profile.businessContext.companySizeSlug,
    primaryUseCaseSlug: primary?.id,
    budgetBand: profile.budget.band,
  });
}
