import type {
  CleaningTask,
  CrmMigrationPlan,
  CutoverStep,
  MigrationReadinessGap,
  MigrationRisk,
  TestMigrationPlan,
  ValidationCheck,
} from "@/domain";
import { assessMigrationComplexity } from "./complexity";
import { applyMigrationRules, mergeRuleTasks } from "./rules";

const DEFAULT_TEST_STEPS: TestMigrationPlan["steps"] = [
  { id: "test-freeze", label: "Freeze mapping version", status: "pending" },
  {
    id: "test-sample",
    label: "Select representative sample",
    status: "pending",
  },
  { id: "test-export", label: "Export source sample", status: "pending" },
  { id: "test-transform", label: "Transform data per mapping", status: "pending" },
  {
    id: "test-import",
    label: "Import into sandbox/test environment where available",
    status: "pending",
  },
  { id: "test-counts", label: "Validate counts", status: "pending" },
  { id: "test-fields", label: "Validate field mapping", status: "pending" },
  { id: "test-owners", label: "Validate ownership", status: "pending" },
  {
    id: "test-relationships",
    label: "Validate relationships",
    status: "pending",
  },
  {
    id: "test-stages",
    label: "Validate pipeline stages",
    status: "pending",
  },
  {
    id: "test-attachments",
    label: "Validate attachments/history",
    status: "pending",
  },
  { id: "test-perms", label: "Validate permissions", status: "pending" },
  { id: "test-defects", label: "Record defects", status: "pending" },
  { id: "test-update-map", label: "Update mapping", status: "pending" },
  { id: "test-repeat", label: "Repeat as needed", status: "pending" },
];

const DEFAULT_CUTOVER: CutoverStep[] = [
  {
    id: "cut-t7",
    relativeDay: "t-minus-7",
    title: "Freeze schema changes",
    description: "Planning default — editable. Stop non-essential source schema changes.",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t5",
    relativeDay: "t-minus-5",
    title: "Final data cleanup",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t3",
    relativeDay: "t-minus-3",
    title: "Resolve remaining mapping issues",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t1",
    relativeDay: "t-minus-1",
    title: "Final source export",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t0-import",
    relativeDay: "t-0",
    title: "Import",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t0-validate",
    relativeDay: "t-0",
    title: "Validate counts and critical records",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-t0-users",
    relativeDay: "t-0",
    title: "Activate users",
    editableDefault: true,
    status: "pending",
  },
  {
    id: "cut-tp1",
    relativeDay: "t-plus-1",
    title: "Hypercare — resolve migration issues",
    editableDefault: true,
    status: "pending",
  },
];

const DEFAULT_CLEANING: Array<Omit<CleaningTask, "status"> & { status?: CleaningTask["status"] }> = [
  {
    id: "clean-dupes",
    label: "Remove obvious duplicates",
    category: "duplicates",
  },
  {
    id: "clean-country",
    label: "Normalize country values",
    category: "normalization",
  },
  {
    id: "clean-phone",
    label: "Normalize phone formats",
    category: "normalization",
  },
  {
    id: "clean-required",
    label: "Resolve empty required fields",
    category: "required-fields",
  },
  {
    id: "clean-test-records",
    label: "Remove obsolete test records",
    category: "archive",
  },
  {
    id: "clean-inactive-owners",
    label: "Confirm inactive-user ownership",
    category: "ownership",
  },
  {
    id: "clean-statuses",
    label: "Standardize pipeline statuses",
    category: "pipeline",
  },
  {
    id: "clean-archive",
    label: "Archive data not needed in target",
    category: "archive",
  },
];

export function defaultCleaningTasks(): CleaningTask[] {
  return DEFAULT_CLEANING.map((t) => ({ ...t, status: t.status ?? "pending" }));
}

export function defaultTestMigrationPlan(
  existing?: TestMigrationPlan,
): TestMigrationPlan {
  if (existing?.steps.length) return existing;
  return {
    status: existing?.status ?? "not-started",
    sampleNotes:
      existing?.sampleNotes ??
      "Include different teams, pipeline stages, custom fields, inactive owners, attachments, edge cases, and recent + older records. Sample size is structural — not a fixed universal count.",
    sandboxAvailability: existing?.sandboxAvailability ?? "unknown",
    steps: DEFAULT_TEST_STEPS.map((s) => ({ ...s })),
  };
}

export function defaultCutoverSteps(existing: CutoverStep[]): CutoverStep[] {
  if (existing.length) return existing;
  return DEFAULT_CUTOVER.map((s) => ({ ...s }));
}

export function generateValidationChecks(
  plan: CrmMigrationPlan,
): ValidationCheck[] {
  const kinds: ValidationCheck["checkKind"][] = [
    "record-counts",
    "required-fields",
    "field-values",
    "relationships",
    "ownership",
    "pipeline-stages",
    "dates",
    "activity-history",
    "attachments",
    "duplicate-count",
    "permissions",
  ];

  const existingById = new Map(plan.validationChecks.map((c) => [c.id, c]));
  const checks: ValidationCheck[] = [];

  for (const obj of plan.objects.filter(
    (o) => o.priority !== "do-not-migrate" && o.priority !== "archive-only",
  )) {
    for (const kind of ["record-counts", "required-fields"] as const) {
      const id = `val-${obj.id}-${kind}`;
      const prev = existingById.get(id);
      checks.push(
        prev ?? {
          id,
          objectKey: obj.objectKey,
          objectLabel: obj.sourceObjectLabel,
          sourceCount: obj.recordCount ?? null,
          importedCount: null,
          validatedSampleCount: null,
          checkKind: kind,
          status: "not-tested",
        },
      );
    }
  }

  for (const kind of kinds) {
    const id = `val-global-${kind}`;
    const prev = existingById.get(id);
    if (prev) {
      checks.push(prev);
      continue;
    }
    if (
      kind === "attachments" &&
      plan.attachments.needed !== "yes"
    ) {
      continue;
    }
    if (
      kind === "activity-history" &&
      plan.activities.historyMatters === "unknown" &&
      !plan.objects.some((o) => o.objectKey === "activities")
    ) {
      continue;
    }
    checks.push({
      id,
      objectLabel: "Migration-wide",
      checkKind: kind,
      status: "not-tested",
      sourceCount: null,
      importedCount: null,
      validatedSampleCount: null,
    });
  }

  return checks;
}

export function generateMigrationRisks(plan: CrmMigrationPlan): MigrationRisk[] {
  const risks: MigrationRisk[] = [];

  const unmappedRequired = plan.fieldMappings.filter(
    (m) =>
      m.required &&
      !["mapped", "do-not-migrate"].includes(m.status),
  );
  if (unmappedRequired.length) {
    risks.push({
      id: "risk-unmapped-required",
      title: "Unmapped required fields",
      severity: "high",
      reason: `${unmappedRequired.length} required field(s) still unmapped or unconfirmed`,
      recommendedAction: "Map, transform, or explicitly exclude each required field",
      status: "open",
      sourceRefs: unmappedRequired.map((m) => m.id),
    });
  }

  const inactive = plan.userMappings.filter((u) => u.active === "no");
  if (inactive.length && plan.inactiveOwnerStrategy === "unknown") {
    risks.push({
      id: "risk-inactive-owners",
      title: "Inactive owners",
      severity: "high",
      reason: `${inactive.length} inactive source user(s) without an ownership strategy`,
      recommendedAction: "Choose inactive-owner strategy before test migration",
      status: "open",
      sourceRefs: inactive.map((u) => u.id),
    });
  }

  if (
    plan.dedupe.matchMethods.length === 0 ||
    plan.dedupe.primaryRule === "unknown"
  ) {
    if (
      plan.objects.some(
        (o) =>
          (o.objectKey === "contacts" || o.objectKey === "companies") &&
          o.priority !== "do-not-migrate",
      )
    ) {
      risks.push({
        id: "risk-dedupe",
        title: "Duplicate strategy not defined",
        severity: "low",
        reason: "Contacts/companies in scope without match methods or primary-record rule",
        recommendedAction: "Define how duplicates are identified and which record wins",
        status: "open",
        sourceRefs: [],
      });
    }
  }

  for (const pipe of plan.pipelineMappings) {
    const manyToOne = new Map<string, number>();
    for (const stage of pipe.stageMaps) {
      if (!stage.targetStage) {
        risks.push({
          id: `risk-pipe-missing-${pipe.id}-${stage.sourceStage}`,
          title: "Missing target stage mapping",
          severity: "medium",
          reason: `Source stage "${stage.sourceStage}" in "${pipe.sourcePipelineName}" has no target`,
          recommendedAction: "Map the stage or document intentional exclusion",
          status: "open",
          sourceRefs: [pipe.id],
        });
      } else {
        manyToOne.set(
          stage.targetStage,
          (manyToOne.get(stage.targetStage) ?? 0) + 1,
        );
      }
      if (stage.warnings.includes("closed-state-mismatch")) {
        risks.push({
          id: `risk-pipe-closed-${pipe.id}-${stage.sourceStage}`,
          title: "Closed-state mismatch",
          severity: "medium",
          reason: `Stage "${stage.sourceStage}" may not align with target closed states`,
          recommendedAction: "Review won/lost semantics before cutover",
          status: "open",
          sourceRefs: [pipe.id],
        });
      }
    }
    for (const [target, count] of manyToOne) {
      if (count > 1) {
        risks.push({
          id: `risk-pipe-mto-${pipe.id}-${target}`,
          title: "Pipeline stage many-to-one mapping",
          severity: "medium",
          reason: `${count} source stages map to "${target}" in "${pipe.sourcePipelineName}"`,
          recommendedAction: "Confirm reporting impact of collapsed stages",
          status: "open",
          sourceRefs: [pipe.id],
        });
      }
    }
    if (pipe.targetSupportStatus === "not-researched" || pipe.targetSupportStatus === "unknown") {
      risks.push({
        id: `risk-pipe-support-${pipe.id}`,
        title: "Target pipeline support not verified",
        severity: "medium",
        reason: `Multiple-pipeline support for target is ${pipe.targetSupportStatus}`,
        recommendedAction: "Verify with product documentation — do not assume unsupported",
        status: "open",
        sourceRefs: [pipe.id],
      });
    }
  }

  if (plan.attachments.needed === "yes") {
    if (
      plan.attachments.targetSupportStatus === "unknown" ||
      plan.attachments.targetSupportStatus === "not-researched"
    ) {
      risks.push({
        id: "risk-attachments",
        title: "Attachments support not yet verified",
        severity: "high",
        reason: "Attachments are in scope but target support is not researched",
        recommendedAction: "Link official documentation or mark as unknown / out of scope",
        status: "open",
        sourceRefs: [],
      });
    }
  }

  if (plan.deltaMigration.sourceRemainsActive === "unknown") {
    risks.push({
      id: "risk-freeze-decision",
      title: "No data freeze decision",
      severity: "medium",
      reason: "Whether the source remains active during cutover is unknown",
      recommendedAction: "Decide freeze vs delta approach before final export",
      status: "open",
      sourceRefs: [],
    });
  }

  const noTargetFields = plan.fieldMappings.filter(
    (m) => m.status === "no-target-field",
  );
  if (noTargetFields.length) {
    risks.push({
      id: "risk-data-loss-fields",
      title: "Potential data loss — unmapped source fields",
      severity: "medium",
      reason: `${noTargetFields.length} source field(s) have no target field`,
      recommendedAction: "Create target fields, transform, archive, or explicitly exclude",
      status: "open",
      sourceRefs: noTargetFields.map((m) => m.id),
    });
  }

  // Preserve user risk status edits for matching ids
  const prevById = new Map(plan.risks.map((r) => [r.id, r]));
  return risks.map((r) => {
    const prev = prevById.get(r.id);
    return prev
      ? { ...r, status: prev.status, owner: prev.owner ?? r.owner }
      : r;
  });
}

export function generateReadinessGaps(
  plan: CrmMigrationPlan,
): MigrationReadinessGap[] {
  const gaps: MigrationReadinessGap[] = [];

  const hasObjects = plan.objects.some(
    (o) => o.priority === "must-migrate" || o.priority === "should-migrate",
  );
  gaps.push({
    id: "gap-objects",
    kind: "definition",
    title: "Target objects defined",
    detail: hasObjects
      ? "At least one object is marked must/should migrate"
      : "Define which objects must migrate",
    state: hasObjects ? "ready" : "needs-work",
    resolved: hasObjects,
  });

  const progress = plan.fieldMappings;
  const mappingIncomplete =
    progress.length === 0 ||
    progress.some(
      (m) =>
        m.status === "unknown" ||
        m.status === "suggested" ||
        m.status === "needs-review",
    );
  gaps.push({
    id: "gap-mapping",
    kind: "definition",
    title: "Field mapping complete",
    detail: mappingIncomplete
      ? "Mapping incomplete — confirm or exclude remaining fields"
      : "All listed fields have a confirmed status",
    state: mappingIncomplete ? "needs-work" : "ready",
    resolved: !mappingIncomplete,
  });

  const usersIncomplete =
    plan.userMappings.length === 0 ||
    plan.userMappings.some(
      (u) => u.status === "unknown" || u.status === "needs-decision",
    );
  gaps.push({
    id: "gap-users",
    kind: "decision",
    title: "User mapping complete",
    detail: usersIncomplete
      ? "User / ownership mapping incomplete"
      : "Users mapped or explicitly handled",
    state: usersIncomplete ? "needs-work" : "ready",
    resolved: !usersIncomplete,
  });

  const dedupeMissing =
    plan.dedupe.matchMethods.length === 0 ||
    plan.dedupe.primaryRule === "unknown";
  gaps.push({
    id: "gap-dedupe",
    kind: "decision",
    title: "Dedupe rule defined",
    detail: dedupeMissing
      ? "Dedupe rule missing"
      : "Match methods and primary-record rule set",
    state: dedupeMissing ? "needs-work" : "ready",
    resolved: !dedupeMissing,
  });

  const sampleMissing = !plan.testMigration.sampleNotes?.trim();
  gaps.push({
    id: "gap-sample",
    kind: "verification",
    title: "Test sample selected",
    detail: sampleMissing
      ? "Test sample not selected / described"
      : "Sample approach documented",
    state: sampleMissing ? "needs-work" : "ready",
    resolved: !sampleMissing,
  });

  const requiredBlocked = plan.fieldMappings.some(
    (m) =>
      m.required &&
      (m.status === "no-target-field" || m.status === "unknown"),
  );
  if (requiredBlocked) {
    gaps.push({
      id: "gap-required-blocked",
      kind: "verification",
      title: "Required fields unresolved",
      detail: "Unmapped required fields block test migration readiness",
      state: "blocked",
      resolved: false,
    });
  }

  return gaps;
}

export type GenerateMigrationPlanOptions = {
  existing?: CrmMigrationPlan | null;
  now?: string;
};

/**
 * Refresh derived plan artefacts from current inventory/mappings.
 * Does not invent product import capabilities.
 */
export function generateMigrationPlan(
  plan: CrmMigrationPlan,
  options: GenerateMigrationPlanOptions = {},
): CrmMigrationPlan {
  const now = options.now ?? new Date().toISOString();
  const base = options.existing ?? plan;

  const complexity = assessMigrationComplexity(base);
  const withComplexity = { ...base, complexity };

  const ruleTasks = applyMigrationRules(withComplexity);
  const migrationTasks = mergeRuleTasks(base.migrationTasks, ruleTasks);

  const cleaningTasks =
    base.cleaningTasks.length > 0
      ? base.cleaningTasks
      : defaultCleaningTasks();

  const testMigration = defaultTestMigrationPlan(base.testMigration);
  const cutoverSteps = defaultCutoverSteps(base.cutoverSteps);
  const validationChecks = generateValidationChecks(withComplexity);
  const risks = generateMigrationRisks(withComplexity);
  const readinessGaps = generateReadinessGaps(withComplexity);

  return {
    ...withComplexity,
    migrationTasks,
    cleaningTasks,
    testMigration,
    cutoverSteps,
    validationChecks,
    risks,
    readinessGaps,
    planGeneratedAt: now,
    updatedAt: now,
  };
}

export function potentialDataLossWarnings(plan: CrmMigrationPlan): string[] {
  const warnings: string[] = [];
  const noTarget = plan.fieldMappings.filter(
    (m) => m.status === "no-target-field",
  ).length;
  if (noTarget) {
    warnings.push(`${noTarget} source field(s) not mapped`);
  }
  if (
    plan.attachments.needed === "yes" &&
    (plan.attachments.targetSupportStatus === "unknown" ||
      plan.attachments.targetSupportStatus === "not-researched")
  ) {
    warnings.push("Attachments support not yet verified");
  }
  const activityPartial =
    plan.activities.targetSupportStatus === "partial" ||
    plan.activities.targetSupportStatus === "unknown";
  if (
    activityPartial &&
    plan.objects.some((o) => o.objectKey === "activities")
  ) {
    warnings.push(
      "Activity history target support is partial or unknown — do not assume full parity",
    );
  }
  return warnings;
}
