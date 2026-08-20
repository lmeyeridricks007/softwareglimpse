import type {
  CrmImplementationPlan,
  CrmMigrationPlan,
  PlanTask,
  TCOSession,
} from "@/domain";
import { complexityToTcoNeeded } from "./from-profile";
import { fieldMappingProgress } from "./persistence";

export type ImplementationHandoffPreview = {
  taskCount: number;
  tasks: Array<{ id: string; title: string }>;
  complexityLevel?: string;
  mappingPercent: number | null;
  testStatus: string;
  openRiskCount: number;
  cutoverDate?: string;
  message: string;
};

/**
 * Preview migration → implementation handoff. User must confirm before apply.
 */
export function previewImplementationHandoff(
  migration: CrmMigrationPlan,
): ImplementationHandoffPreview {
  const tasks = migration.migrationTasks
    .filter((t) => t.status !== "not-applicable")
    .map((t) => ({ id: `mig-handoff-${t.id}`, title: t.title }));

  const progress = fieldMappingProgress(migration);
  const openRiskCount = migration.risks.filter(
    (r) => r.status === "open" || r.status === "mitigating",
  ).length;

  return {
    taskCount: tasks.length,
    tasks,
    complexityLevel: migration.complexity?.level,
    mappingPercent: progress.percentMapped,
    testStatus: migration.testMigration.status,
    openRiskCount,
    cutoverDate: migration.targetGoLive,
    message: `${tasks.length} migration task(s) will be added/updated on the implementation plan after you confirm. Existing non-migration tasks are left unchanged.`,
  };
}

/**
 * Apply handoff into an implementation plan (pure). Caller persists.
 */
export function applyImplementationHandoff(
  implementation: CrmImplementationPlan,
  migration: CrmMigrationPlan,
): CrmImplementationPlan {
  const preview = previewImplementationHandoff(migration);
  const existingIds = new Set(implementation.tasks.map((t) => t.id));
  const newTasks: PlanTask[] = [];

  for (const t of preview.tasks) {
    if (existingIds.has(t.id)) {
      continue;
    }
    newTasks.push({
      id: t.id,
      phaseId: "data-migration",
      title: t.title,
      sourceType: "migration-derived",
      sourceRefs: [migration.id],
      priority: "high",
      status: "not-started",
      dependencyIds: [],
      requirementIds: [],
      featureIds: [],
      integrationIds: [],
      evidenceRefs: [],
      criticalPath: false,
      userEdited: false,
      reason: "Synced from CRM Migration Planner",
    });
  }

  // Update existing handoff tasks' titles if still present
  const updatedTasks = implementation.tasks.map((task) => {
    const match = preview.tasks.find((t) => t.id === task.id);
    if (!match || task.userEdited) return task;
    return { ...task, title: match.title };
  });

  const migrationSource =
    migration.migrationType === "spreadsheet"
      ? "spreadsheet"
      : migration.migrationType === "existing-crm"
        ? "existing-crm"
        : migration.migrationType === "multiple-systems"
          ? "multiple-systems"
          : migration.migrationType === "unknown"
            ? "unknown"
            : "other";

  return {
    ...implementation,
    scope: {
      ...implementation.scope,
      migrationSource,
      migrationObjects: migration.objects
        .filter(
          (o) =>
            o.priority === "must-migrate" || o.priority === "should-migrate",
        )
        .map((o) => o.objectKey),
    },
    targetGoLive: migration.targetGoLive ?? implementation.targetGoLive,
    tasks: [...updatedTasks, ...newTasks],
    milestones: [
      ...implementation.milestones.filter((m) => m.id !== "mig-cutover"),
      ...(migration.targetGoLive
        ? [
            {
              id: "mig-cutover",
              label: "Migration cutover",
              date: migration.targetGoLive,
              kind: "cutover" as const,
            },
          ]
        : []),
    ],
    updatedAt: new Date().toISOString(),
  };
}

export type TcoHandoffPreview = {
  needed: string;
  scopes: string[];
  externalMigrationCostMinor?: number | null;
  dataCleaningCostMinor?: number | null;
  internalHours?: number | null;
  message: string;
};

export function previewTcoHandoff(migration: CrmMigrationPlan): TcoHandoffPreview {
  const scopes = migration.objects
    .filter(
      (o) => o.priority === "must-migrate" || o.priority === "should-migrate",
    )
    .map((o) => o.objectKey);

  return {
    needed: complexityToTcoNeeded(migration.complexity?.level),
    scopes,
    externalMigrationCostMinor:
      migration.tcoHints.externalMigrationCostMinor ??
      migration.tcoHints.partnerCostMinor,
    dataCleaningCostMinor: undefined,
    internalHours:
      migration.tcoHints.internalMigrationHours ??
      migration.tcoHints.dataCleaningEffortHours,
    message:
      "These planning values can update your TCO migration assumptions after you confirm — nothing is overwritten automatically.",
  };
}

/**
 * Apply TCO handoff (pure). Caller persists after user confirm.
 */
export function applyTcoHandoff(
  session: TCOSession,
  migration: CrmMigrationPlan,
): TCOSession {
  const preview = previewTcoHandoff(migration);
  return {
    ...session,
    scenarios: session.scenarios.map((s) => {
      if (s.id !== session.activeScenarioId) return s;
      return {
        ...s,
        migration: {
          ...s.migration,
          needed: preview.needed as typeof s.migration.needed,
          scopes: preview.scopes.length ? preview.scopes : s.migration.scopes,
          ...(preview.externalMigrationCostMinor !== undefined
            ? { externalCostMinor: preview.externalMigrationCostMinor }
            : {}),
          ...(preview.internalHours !== undefined && preview.internalHours !== null
            ? { internalHours: preview.internalHours }
            : {}),
        },
      };
    }),
    updatedAt: new Date().toISOString(),
  };
}
