import type {
  CrmDecisionProfile,
  CrmReadinessSession,
  DecisionCategorySlug,
  DecisionProfile,
  SiDecisionProfile,
} from "@/domain";
import {
  createEmptyCrmDecisionProfile,
  createEmptyDecisionProfile,
  createEmptySiDecisionProfile,
  touchCrmDecisionProfile,
  touchDecisionProfile,
  touchSiDecisionProfile,
} from "@/services/decision-profile/client";

/**
 * Seed lightweight fields on the shared CRM decision profile from readiness context.
 * Does not overwrite richer requirements already captured.
 */
export function seedDecisionProfileFromReadiness(
  session: CrmReadinessSession,
  existing: CrmDecisionProfile | null,
): CrmDecisionProfile {
  const base = existing ?? createEmptyCrmDecisionProfile();
  const ctx = session.context;

  return touchCrmDecisionProfile(base, {
    businessContext: {
      ...base.businessContext,
      industrySlug:
        base.businessContext.industrySlug ||
        (ctx.industry
          ? ctx.industry.toLowerCase().replace(/\s+/g, "-")
          : undefined),
      companySizeSlug:
        base.businessContext.companySizeSlug || ctx.companySize,
      crmUserCount:
        base.businessContext.crmUserCount ?? ctx.crmUsers,
      currentState:
        base.businessContext.currentState ||
        (ctx.replacingCrm
          ? "existing-crm"
          : ctx.replacingCrm === false
            ? "spreadsheet"
            : undefined),
    },
  });
}

/**
 * Seed lightweight SI decision profile fields from readiness context.
 */
export function seedSiDecisionProfileFromReadiness(
  session: CrmReadinessSession,
  existing: SiDecisionProfile | null,
): SiDecisionProfile {
  const base = existing ?? createEmptySiDecisionProfile();
  const ctx = session.context;

  return touchSiDecisionProfile(base, {
    businessContext: {
      ...base.businessContext,
      industrySlug:
        base.businessContext.industrySlug ||
        (ctx.industry
          ? ctx.industry.toLowerCase().replace(/\s+/g, "-")
          : undefined),
      companySizeSlug:
        base.businessContext.companySizeSlug || ctx.companySize,
      crmUserCount:
        base.businessContext.crmUserCount ?? ctx.crmUsers,
      currentState:
        base.businessContext.currentState ||
        (ctx.replacingCrm
          ? "existing-crm"
          : ctx.replacingCrm === false
            ? "spreadsheet"
            : undefined),
    },
  });
}

export function seedDecisionProfileFromReadinessForCategory(
  session: CrmReadinessSession,
  existing: DecisionProfile | null,
  categorySlug: DecisionCategorySlug,
): DecisionProfile {
  const base = existing ?? createEmptyDecisionProfile(categorySlug);
  const ctx = session.context;

  return touchDecisionProfile(base, {
    businessContext: {
      ...base.businessContext,
      industrySlug:
        base.businessContext.industrySlug ||
        (ctx.industry
          ? ctx.industry.toLowerCase().replace(/\s+/g, "-")
          : undefined),
      companySizeSlug:
        base.businessContext.companySizeSlug || ctx.companySize,
      crmUserCount: base.businessContext.crmUserCount ?? ctx.crmUsers,
      currentState:
        base.businessContext.currentState ||
        (ctx.replacingCrm
          ? "existing-crm"
          : ctx.replacingCrm === false
            ? "spreadsheet"
            : undefined),
    },
  });
}
