import type { CrmDecisionProfile, CrmImplementationPlan, TCOSession } from "@/domain";
import { loadCrmTcoSession } from "@/services/tco/persistence";
import type { TrainingApproach } from "@/domain";

export type PlannerPrefill = {
  productId?: string;
  users?: number;
  teamLabels: string[];
  migrationComplexity?: "none" | "low" | "medium" | "high";
  integrationCount: number;
  trainingApproach?: TrainingApproach;
  tcoImplementationApproach?: string;
  tcoInternalHours?: number | null;
  hasTcoSession: boolean;
  profileSummary: string[];
};

/**
 * Prefill planner inputs from CRMDecisionProfile + optional TCO session.
 * Does not invent product-specific steps.
 */
export function prefillFromProfile(
  profile: CrmDecisionProfile | null,
  tcoSession?: TCOSession | null,
): PlannerPrefill {
  const tco = tcoSession ?? (typeof window !== "undefined" ? loadCrmTcoSession() : null);
  const scenario = tco?.scenarios.find((s) => s.id === tco.activeScenarioId);

  const trainingMap: Record<string, TrainingApproach> = {
    "self-service": "self-service",
    internal: "internal-trainer",
    vendor: "vendor",
    partner: "partner",
    mixed: "mixed",
  };

  const integrations = (profile?.integrations ?? []).filter(
    (i) => i.priority === "required" || i.priority === "preferred",
  );

  const summary: string[] = [];
  if (profile?.businessContext.industrySlug) {
    summary.push(`Industry: ${profile.businessContext.industrySlug}`);
  }
  if (profile?.businessContext.crmUserCount) {
    summary.push(`Users: ${profile.businessContext.crmUserCount}`);
  }
  if (profile?.implementation.migrationComplexity) {
    summary.push(`Migration: ${profile.implementation.migrationComplexity}`);
  }
  if (integrations.length) {
    summary.push(`Integrations: ${integrations.length}`);
  }
  if (profile?.selectedProductId) {
    summary.push(`Selected: ${profile.selectedProductId}`);
  } else if (profile?.shortlistProductIds.length) {
    summary.push(`Shortlist: ${profile.shortlistProductIds.join(", ")}`);
  }

  return {
    productId: profile?.selectedProductId,
    users: profile?.businessContext.crmUserCount,
    teamLabels: profile?.businessContext.teamIds ?? [],
    migrationComplexity: profile?.implementation.migrationComplexity,
    integrationCount: integrations.length,
    trainingApproach: scenario?.training.method
      ? trainingMap[scenario.training.method]
      : undefined,
    tcoImplementationApproach: scenario?.implementation.approach,
    tcoInternalHours: scenario?.implementation.internalHours ?? null,
    hasTcoSession: Boolean(tco),
    profileSummary: summary,
  };
}

/**
 * Values the planner can propose to TCO — only applied after user confirms.
 */
export function buildTcoAssumptionSuggestions(plan: CrmImplementationPlan): {
  integrationCount: number;
  planningDurationWeeks?: number;
  users?: number;
  migrationComplexity?: string;
  message: string;
} {
  return {
    integrationCount: new Set(
      plan.tasks.flatMap((t) => t.integrationIds),
    ).size,
    planningDurationWeeks: plan.planningDurationWeeks,
    users: plan.scope.users,
    migrationComplexity: plan.scope.migrationSource,
    message:
      "These planning values can update your TCO assumptions after you confirm — nothing is overwritten automatically.",
  };
}
