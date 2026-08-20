import type { CrmDecisionProfile, TCOScenario, TCOSession } from "@/domain";
import { crmRequirementsFromDecisionProfile } from "@/domain";
import {
  createDefaultScenario,
  createEmptyTcoSession,
  getActiveScenario,
} from "./persistence";

const MIGRATION_SCOPE_HINTS = [
  "contacts",
  "companies",
  "deals",
  "activities",
  "attachments",
  "custom-fields",
  "history",
  "users",
] as const;

/**
 * Prefill TCO session from CRMDecisionProfile without inventing cost amounts.
 */
export function sessionFromDecisionProfile(
  profile: CrmDecisionProfile,
  existing?: TCOSession | null,
): TCOSession {
  const reqs = crmRequirementsFromDecisionProfile(profile);
  const base = existing ?? createEmptyTcoSession();
  const active = getActiveScenario(base);

  const migrationComplexity = profile.implementation.migrationComplexity;
  const needed =
    migrationComplexity === "none"
      ? "none"
      : migrationComplexity === "low"
        ? "basic"
        : migrationComplexity === "medium"
          ? "moderate"
          : migrationComplexity === "high"
            ? "complex"
            : "unknown";

  const integrations = profile.integrations
    .filter((i) => i.priority === "required" || i.priority === "preferred")
    .map((i) => ({
      id: i.id,
      name: i.id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      status: "unknown" as const,
    }));

  const scenario = createDefaultScenario({
    ...active,
    id: active.id,
    name: active.name,
    productIds:
      profile.shortlistProductIds.length > 0
        ? profile.shortlistProductIds.slice(0, 5)
        : active.productIds,
    startingUsers:
      reqs?.crmUsers ??
      profile.businessContext.crmUserCount ??
      active.startingUsers,
    billingPreference:
      reqs?.billingPreference ??
      profile.budget.billingPreference ??
      active.billingPreference,
    currency: profile.budget.currency ?? active.currency,
    migration: {
      ...active.migration,
      needed,
      scopes:
        needed === "none" || needed === "unknown"
          ? []
          : [...MIGRATION_SCOPE_HINTS],
    },
    integrations:
      integrations.length > 0 ? integrations : active.integrations,
  });

  return {
    ...base,
    decisionProfileLinked: true,
    scenarios: base.scenarios.map((s) =>
      s.id === active.id ? scenario : s,
    ),
    focusProductId:
      profile.selectedProductId ??
      scenario.productIds[0] ??
      base.focusProductId,
    updatedAt: new Date().toISOString(),
  };
}

export function requiredFeaturesFromProfile(
  profile: CrmDecisionProfile | null,
): string[] {
  if (!profile) return [];
  return profile.features
    .filter((f) => f.priority === "must-have")
    .map((f) => f.id);
}

export type ProfileSummary = {
  industry?: string;
  companySize?: string;
  crmUsers?: number;
  mustHaveCount: number;
  shortlistCount: number;
};

export function summarizeProfile(
  profile: CrmDecisionProfile,
): ProfileSummary {
  return {
    industry: profile.businessContext.industrySlug,
    companySize: profile.businessContext.companySizeSlug,
    crmUsers: profile.businessContext.crmUserCount,
    mustHaveCount: profile.features.filter((f) => f.priority === "must-have")
      .length,
    shortlistCount: profile.shortlistProductIds.length,
  };
}

/** Apply cost draft handoff from Cost Calculator storage shape. */
export function applyCostCalculatorHandoff(
  session: TCOSession,
  draft: {
    crmUsers?: number;
    billingPreference?: TCOScenario["billingPreference"];
    productSlugs?: string[];
  },
): TCOSession {
  const active = getActiveScenario(session);
  const scenario = createDefaultScenario({
    ...active,
    id: active.id,
    startingUsers: draft.crmUsers ?? active.startingUsers,
    billingPreference: draft.billingPreference ?? active.billingPreference,
    productIds:
      draft.productSlugs && draft.productSlugs.length > 0
        ? draft.productSlugs.slice(0, 5)
        : active.productIds,
  });
  return {
    ...session,
    scenarios: session.scenarios.map((s) =>
      s.id === active.id ? scenario : s,
    ),
    focusProductId: scenario.productIds[0] ?? session.focusProductId,
    updatedAt: new Date().toISOString(),
  };
}
