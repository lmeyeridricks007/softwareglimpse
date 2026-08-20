import type {
  ComplexityDriver,
  CrmDecisionProfile,
  CrmImplementationPlan,
  ImplementationComplexity,
  ImplementationComplexityLevel,
  ImplementationType,
} from "@/domain";

export type ComplexityInput = {
  users?: number;
  teamCount?: number;
  regions: string[];
  migrationComplexity?: "none" | "low" | "medium" | "high";
  integrationCount: number;
  automationRequired: boolean;
  securityHeavy: boolean;
  reportingRequired: boolean;
  implementationType?: ImplementationType;
  launchScope?: "core-only" | "most-requirements" | "full-target-state";
  customAdmin?: boolean;
};

function levelFromScore(score: number): ImplementationComplexityLevel {
  if (score <= 6) return "low";
  if (score <= 14) return "moderate";
  if (score <= 22) return "high";
  return "very-high";
}

/**
 * Transparent, deterministic complexity from scope inputs.
 * Returns level + drivers — not a fake /100 score for UI display.
 */
export function assessImplementationComplexity(
  input: ComplexityInput,
): ImplementationComplexity {
  const drivers: ComplexityDriver[] = [];

  const users = input.users ?? 0;
  if (users > 200) {
    drivers.push({ id: "users-large", label: "Large user base (200+)", weight: 4 });
  } else if (users > 50) {
    drivers.push({ id: "users-mid", label: "Mid-size user base (51–200)", weight: 2 });
  } else if (users > 15) {
    drivers.push({ id: "users-small-mid", label: "Growing user base (16–50)", weight: 1 });
  }

  if ((input.teamCount ?? 0) >= 3) {
    drivers.push({
      id: "multi-team",
      label: "Multiple teams in scope",
      weight: 2,
    });
  } else if ((input.teamCount ?? 0) === 2) {
    drivers.push({ id: "two-teams", label: "Two teams in scope", weight: 1 });
  }

  if (input.regions.length >= 2) {
    drivers.push({
      id: "multi-region",
      label: "Multiple geographies",
      weight: 2,
    });
  }

  const mig = input.migrationComplexity ?? "none";
  if (mig === "high") {
    drivers.push({ id: "migration-high", label: "High migration complexity", weight: 4 });
  } else if (mig === "medium") {
    drivers.push({
      id: "migration-medium",
      label: "Migration from existing CRM / systems",
      weight: 3,
    });
  } else if (mig === "low") {
    drivers.push({ id: "migration-low", label: "Light data migration", weight: 1 });
  }

  if (input.integrationCount >= 5) {
    drivers.push({
      id: "integrations-many",
      label: `${input.integrationCount} integrations`,
      weight: 4,
    });
  } else if (input.integrationCount >= 3) {
    drivers.push({
      id: "integrations-several",
      label: `${input.integrationCount} integrations`,
      weight: 3,
    });
  } else if (input.integrationCount >= 1) {
    drivers.push({
      id: "integrations-few",
      label: `${input.integrationCount} integration(s)`,
      weight: 1,
    });
  }

  if (input.automationRequired) {
    drivers.push({
      id: "automation",
      label: "Workflow automation in scope",
      weight: 2,
    });
  }

  if (input.securityHeavy) {
    drivers.push({
      id: "security",
      label: "Security / permissions requirements",
      weight: 3,
    });
  }

  if (input.reportingRequired) {
    drivers.push({
      id: "reporting",
      label: "Reporting / dashboards in scope",
      weight: 1,
    });
  }

  if (input.customAdmin) {
    drivers.push({
      id: "admin-advanced",
      label: "Advanced administration expected",
      weight: 2,
    });
  }

  if (
    input.implementationType === "consolidate-multiple" ||
    input.implementationType === "replace-existing"
  ) {
    drivers.push({
      id: "replace-or-consolidate",
      label: "Replace / consolidate existing systems",
      weight: 2,
    });
  }

  if (input.launchScope === "full-target-state") {
    drivers.push({
      id: "full-scope",
      label: "Full target-state launch scope",
      weight: 2,
    });
  } else if (input.launchScope === "core-only") {
    drivers.push({
      id: "core-scope",
      label: "Core-only phased launch",
      weight: 0,
    });
  }

  const score = drivers.reduce((sum, d) => sum + d.weight, 0);
  return {
    level: levelFromScore(score),
    drivers: drivers.filter((d) => d.weight > 0),
    score,
  };
}

export function complexityInputFromPlanAndProfile(
  plan: CrmImplementationPlan,
  profile: CrmDecisionProfile | null,
): ComplexityInput {
  const mustHaveReqs = (profile?.requirements ?? []).filter(
    (r) => r.priority === "must-have",
  );
  const automationRequired = mustHaveReqs.some(
    (r) =>
      r.id.includes("automat") ||
      r.id.includes("workflow") ||
      r.id.includes("follow-up"),
  );
  const securityHeavy =
    mustHaveReqs.some(
      (r) =>
        r.id === "support-sso" ||
        r.id === "restrict-access-by-team" ||
        r.id === "audit-user-activity",
    ) || profile?.implementation.adminComplexity === "advanced";
  const reportingRequired = mustHaveReqs.some(
    (r) => r.id.includes("report") || r.id.includes("forecast"),
  );
  const integrations = (profile?.integrations ?? []).filter(
    (i) => i.priority === "required" || i.priority === "preferred",
  );

  return {
    users: plan.scope.users ?? profile?.businessContext.crmUserCount,
    teamCount:
      plan.scope.teamCount ??
      Math.max(1, profile?.businessContext.teamIds.length ?? 1),
    regions: plan.scope.regions,
    migrationComplexity: profile?.implementation.migrationComplexity,
    integrationCount: integrations.length,
    automationRequired,
    securityHeavy,
    reportingRequired,
    implementationType: plan.implementationType,
    launchScope: plan.scope.launchScope,
    customAdmin: profile?.implementation.adminComplexity === "advanced",
  };
}
