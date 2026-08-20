import type {
  CrmDecisionProfile,
  CrmImplementationPlan,
  ImplementationType,
  TrainingApproach,
  MigrationSource,
} from "@/domain";
import { createEmptyCrmImplementationPlan } from "@/domain";
import {
  assessImplementationComplexity,
  complexityInputFromPlanAndProfile,
} from "./complexity";
import { generatePhases, totalPlanningWeeks } from "./phases";
import {
  generateGoLiveChecklist,
  generateMilestones,
  generateTasks,
  generateUatItems,
} from "./tasks";
import {
  defaultProjectRoles,
  generateReadinessGaps,
  generateRisks,
  mergeGeneratedRisks,
} from "./risks";

export type GeneratePlanOptions = {
  profile: CrmDecisionProfile | null;
  existing?: CrmImplementationPlan | null;
  productId?: string;
  productName?: string;
  vendorNeutral?: boolean;
  implementationType?: ImplementationType;
  targetGoLive?: string | null;
  trainingApproach?: TrainingApproach;
  migrationSource?: MigrationSource;
  /** Must-have requirement ids still unverified (e.g. from scorecard). */
  unresolvedMustHaveIds?: string[];
  preserveUserEdits?: boolean;
  now?: string;
};

function migrationObjectsFromProfile(
  profile: CrmDecisionProfile | null,
): string[] {
  const mig = profile?.implementation.migrationComplexity;
  if (!mig || mig === "none") return [];
  return [
    "Contacts",
    "Companies",
    "Leads",
    "Deals",
    "Activities",
    "Notes",
    "Custom fields",
    "Users",
  ];
}

function applyBackwardSchedule(
  plan: CrmImplementationPlan,
  targetGoLive: string,
): CrmImplementationPlan {
  const target = new Date(targetGoLive);
  if (Number.isNaN(target.getTime()) || !plan.planningDurationWeeks) return plan;

  const start = new Date(target);
  start.setDate(start.getDate() - plan.planningDurationWeeks * 7);

  const assumptions = [
    ...plan.assumptions.filter((a) => !a.startsWith("Backward schedule")),
    `Backward schedule from target go-live ${targetGoLive}: planning window starts approximately ${start.toISOString().slice(0, 10)}.`,
  ];

  return { ...plan, assumptions };
}

/**
 * Deterministic CRM implementation plan generator.
 * User-edited tasks are preserved when regenerating if preserveUserEdits is true.
 */
export function generateImplementationPlan(
  options: GeneratePlanOptions,
): CrmImplementationPlan {
  const now = options.now ?? new Date().toISOString();
  const base =
    options.existing ?? createEmptyCrmImplementationPlan(now);
  const profile = options.profile;

  const productId =
    options.productId ?? base.productId ?? profile?.selectedProductId;
  const vendorNeutral =
    options.vendorNeutral ??
    base.vendorNeutral ??
    (!productId && !options.productName);

  const users =
    base.scope.users ??
    profile?.businessContext.crmUserCount ??
    undefined;
  const teamLabels =
    base.scope.teamLabels.length > 0
      ? base.scope.teamLabels
      : (profile?.businessContext.teamIds ?? []);
  const teamCount =
    base.scope.teamCount ?? Math.max(1, teamLabels.length || 1);

  const trainingApproach =
    options.trainingApproach ?? base.scope.trainingApproach ?? "undecided";
  const migrationSource =
    options.migrationSource ??
    base.scope.migrationSource ??
    (profile?.businessContext.currentState === "spreadsheet"
      ? "spreadsheet"
      : profile?.businessContext.currentState === "existing-crm"
        ? "existing-crm"
        : profile?.businessContext.currentState === "multiple-tools"
          ? "multiple-systems"
          : profile?.implementation.migrationComplexity === "none"
            ? "none"
            : "unknown");

  const implementationType =
    options.implementationType ??
    base.implementationType ??
    (profile?.businessContext.currentState === "no-crm"
      ? "new-from-scratch"
      : profile?.businessContext.currentState === "spreadsheet"
        ? "from-spreadsheets"
        : profile?.businessContext.currentState === "existing-crm"
          ? "replace-existing"
          : profile?.businessContext.currentState === "multiple-tools"
            ? "consolidate-multiple"
            : undefined);

  let plan: CrmImplementationPlan = {
    ...base,
    productId,
    productName: options.productName ?? base.productName,
    vendorNeutral: Boolean(vendorNeutral && !productId),
    implementationType,
    decisionProfileUpdatedAt: profile?.updatedAt,
    targetGoLive:
      options.targetGoLive === null
        ? undefined
        : (options.targetGoLive ?? base.targetGoLive),
    scope: {
      ...base.scope,
      users,
      teamCount,
      teamLabels,
      trainingApproach,
      migrationSource,
      migrationObjects:
        base.scope.migrationObjects.length > 0
          ? base.scope.migrationObjects
          : migrationObjectsFromProfile(profile),
      capabilityIdsInScope:
        base.scope.capabilityIdsInScope.length > 0
          ? base.scope.capabilityIdsInScope
          : (profile?.capabilities
              .filter(
                (c) =>
                  c.priority === "critical" ||
                  c.priority === "high" ||
                  c.priority === "important",
              )
              .map((c) => c.id) ?? []),
      capabilityIdsLater:
        base.scope.capabilityIdsLater.length > 0
          ? base.scope.capabilityIdsLater
          : (profile?.capabilities
              .filter((c) => c.priority === "optional")
              .map((c) => c.id) ?? []),
      recordTypes:
        base.scope.recordTypes.length > 0
          ? base.scope.recordTypes
          : ["Contacts", "Companies", "Leads", "Deals / Opportunities", "Activities"],
      trainingGroups:
        base.scope.trainingGroups.length > 0
          ? base.scope.trainingGroups
          : ["Sales reps", "Managers", "Admins"],
    },
    roles: defaultProjectRoles(base.roles),
    updatedAt: now,
  };

  const complexity = assessImplementationComplexity(
    complexityInputFromPlanAndProfile(plan, profile),
  );
  plan.complexity = complexity;

  const mustHaves =
    profile?.requirements.filter((r) => r.priority === "must-have") ?? [];
  const integrations =
    profile?.integrations.filter(
      (i) => i.priority === "required" || i.priority === "preferred",
    ) ?? [];
  const automationRequired = mustHaves.some(
    (r) =>
      r.id.includes("automat") ||
      r.id.includes("workflow") ||
      r.id.includes("follow-up"),
  );
  const reportingRequired = mustHaves.some(
    (r) => r.id.includes("report") || r.id.includes("forecast"),
  );
  const securityHeavy =
    mustHaves.some(
      (r) =>
        r.id === "support-sso" ||
        r.id === "restrict-access-by-team" ||
        r.id === "audit-user-activity",
    ) || profile?.implementation.adminComplexity === "advanced";

  const phases = generatePhases({
    migrationComplexity: profile?.implementation.migrationComplexity,
    integrationCount: integrations.length,
    automationRequired,
    reportingRequired,
    securityHeavy,
    users: users ?? 10,
    complexity: complexity.level,
    implementationType,
    launchScope: plan.scope.launchScope,
    hasMustHaveRequirements: mustHaves.length > 0,
  });

  const generatedTasks = generateTasks({
    phases,
    profile,
    implementationType,
    trainingApproach,
    trainingGroups: plan.scope.trainingGroups,
    users: users ?? 10,
    migrationObjects: plan.scope.migrationObjects,
    recordTypes: plan.scope.recordTypes,
    productId: plan.productId,
    productName: plan.productName,
  });

  let tasks = generatedTasks;
  if (options.preserveUserEdits !== false && base.tasks.length > 0) {
    const prevById = new Map(base.tasks.map((t) => [t.id, t]));
    tasks = generatedTasks.map((t) => {
      const prev = prevById.get(t.id);
      if (!prev) return t;
      if (prev.userEdited || prev.status !== "not-started" || prev.notes) {
        return {
          ...t,
          status: prev.status,
          notes: prev.notes,
          ownerRole: prev.ownerRole ?? t.ownerRole,
          durationDays: prev.durationDays ?? t.durationDays,
          targetDate: prev.targetDate,
          userEdited: prev.userEdited,
        };
      }
      return t;
    });
    // Keep user-added tasks
    for (const prev of base.tasks) {
      if (prev.sourceType === "user-added" && !tasks.some((t) => t.id === prev.id)) {
        tasks.push(prev);
      }
    }
  }

  const includeMigration = phases.some((p) => p.id === "data-migration" && p.included);
  const includeIntegrations = phases.some((p) => p.id === "integrations" && p.included);
  const planningDurationWeeks = totalPlanningWeeks(phases);

  plan = {
    ...plan,
    phases,
    tasks,
    planningDurationWeeks,
    uatItems: generateUatItems(profile),
    goLiveChecklist: generateGoLiveChecklist(includeMigration, includeIntegrations),
    milestones: generateMilestones(planningDurationWeeks, includeMigration),
    assumptions: [
      "Timeline durations are planning assumptions derived from the scope you entered — not vendor-certified estimates.",
      "Generic CRM implementation guidance is used unless product-specific evidence is linked.",
      "Affiliate status has zero influence on phases, tasks or recommendations.",
      ...(plan.vendorNeutral
        ? ["This is a vendor-neutral plan until a product is selected."]
        : []),
    ],
    planGeneratedAt: now,
    updatedAt: now,
  };

  if (plan.targetGoLive) {
    plan = applyBackwardSchedule(plan, plan.targetGoLive);
  }

  plan.risks = mergeGeneratedRisks(
    generateRisks(plan, profile, {
      unresolvedMustHaveIds: options.unresolvedMustHaveIds,
    }),
    base.risks,
  );
  plan.readinessGaps = generateReadinessGaps(plan, profile);

  return plan;
}

export type ProfileChangeSummary = {
  changed: boolean;
  message: string;
  affectedTaskCount: number;
};

/**
 * Detect profile drift without wiping customized plans.
 */
export function detectProfileChanges(
  plan: CrmImplementationPlan,
  profile: CrmDecisionProfile | null,
): ProfileChangeSummary {
  if (!profile) {
    return { changed: false, message: "", affectedTaskCount: 0 };
  }
  if (!plan.decisionProfileUpdatedAt) {
    return {
      changed: true,
      message: "A CRM profile is available that was not linked when this plan was generated.",
      affectedTaskCount: 0,
    };
  }
  if (plan.decisionProfileUpdatedAt === profile.updatedAt) {
    return { changed: false, message: "", affectedTaskCount: 0 };
  }

  const reqTaskCount = plan.tasks.filter(
    (t) =>
      t.sourceType === "requirement-derived" ||
      t.sourceType === "feature-derived" ||
      t.sourceType === "integration-derived" ||
      t.sourceType === "migration-derived" ||
      t.sourceType === "security-derived",
  ).length;

  return {
    changed: true,
    message: `Your CRM profile changed. ${reqTaskCount} implementation task(s) may need updating.`,
    affectedTaskCount: reqTaskCount,
  };
}
