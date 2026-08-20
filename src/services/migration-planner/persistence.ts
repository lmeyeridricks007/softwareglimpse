import {
  CRM_MIGRATION_PLAN_STORAGE_KEY,
  CrmMigrationPlanSchema,
  createEmptyCrmMigrationPlan,
  type ChecklistItemStatus,
  type CleaningTask,
  type CrmMigrationPlan,
  type FieldMapping,
  type FieldMappingStatus,
  type MigrationTaskStatus,
} from "@/domain";

export { CRM_MIGRATION_PLAN_STORAGE_KEY };

export function loadCrmMigrationPlan(): CrmMigrationPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CRM_MIGRATION_PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmMigrationPlanSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCrmMigrationPlan(
  plan: CrmMigrationPlan,
): CrmMigrationPlan {
  const next = CrmMigrationPlanSchema.parse({
    ...plan,
    updatedAt: new Date().toISOString(),
  });
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CRM_MIGRATION_PLAN_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full / private mode — fail silently.
    }
  }
  return next;
}

export function resetCrmMigrationPlan(): CrmMigrationPlan {
  const empty = createEmptyCrmMigrationPlan();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        CRM_MIGRATION_PLAN_STORAGE_KEY,
        JSON.stringify(empty),
      );
    } catch {
      // ignore
    }
  }
  return empty;
}

export function touchCrmMigrationPlan(
  plan: CrmMigrationPlan,
  patch: Partial<CrmMigrationPlan>,
): CrmMigrationPlan {
  return CrmMigrationPlanSchema.parse({
    ...plan,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export function updateFieldMapping(
  plan: CrmMigrationPlan,
  mappingId: string,
  patch: Partial<FieldMapping>,
): CrmMigrationPlan {
  return touchCrmMigrationPlan(plan, {
    fieldMappings: plan.fieldMappings.map((m) =>
      m.id === mappingId ? { ...m, ...patch } : m,
    ),
  });
}

export function setFieldMappingStatus(
  plan: CrmMigrationPlan,
  mappingId: string,
  status: FieldMappingStatus,
): CrmMigrationPlan {
  return updateFieldMapping(plan, mappingId, {
    status,
    suggestionPending: status === "suggested",
  });
}

export function bulkUpdateFieldMappings(
  plan: CrmMigrationPlan,
  ids: string[],
  patch: Partial<FieldMapping>,
): CrmMigrationPlan {
  const idSet = new Set(ids);
  return touchCrmMigrationPlan(plan, {
    fieldMappings: plan.fieldMappings.map((m) =>
      idSet.has(m.id) ? { ...m, ...patch } : m,
    ),
  });
}

export function setCleaningTaskStatus(
  plan: CrmMigrationPlan,
  taskId: string,
  status: ChecklistItemStatus,
): CrmMigrationPlan {
  return touchCrmMigrationPlan(plan, {
    cleaningTasks: plan.cleaningTasks.map((t: CleaningTask) =>
      t.id === taskId ? { ...t, status } : t,
    ),
  });
}

export function setMigrationTaskStatus(
  plan: CrmMigrationPlan,
  taskId: string,
  status: MigrationTaskStatus,
): CrmMigrationPlan {
  return touchCrmMigrationPlan(plan, {
    migrationTasks: plan.migrationTasks.map((t) =>
      t.id === taskId ? { ...t, status } : t,
    ),
  });
}

export function fieldMappingProgress(plan: CrmMigrationPlan): {
  total: number;
  mapped: number;
  needsReview: number;
  noTarget: number;
  excluded: number;
  suggested: number;
  percentMapped: number | null;
} {
  const total = plan.fieldMappings.length;
  const mapped = plan.fieldMappings.filter((m) => m.status === "mapped").length;
  const needsReview = plan.fieldMappings.filter(
    (m) => m.status === "needs-review" || m.status === "transformation-needed",
  ).length;
  const noTarget = plan.fieldMappings.filter(
    (m) => m.status === "no-target-field",
  ).length;
  const excluded = plan.fieldMappings.filter(
    (m) => m.status === "do-not-migrate",
  ).length;
  const suggested = plan.fieldMappings.filter(
    (m) => m.status === "suggested" || m.suggestionPending,
  ).length;
  return {
    total,
    mapped,
    needsReview,
    noTarget,
    excluded,
    suggested,
    percentMapped: total > 0 ? Math.round((mapped / total) * 100) : null,
  };
}

export function userMappingProgress(plan: CrmMigrationPlan): {
  total: number;
  mapped: number;
} {
  const total = plan.userMappings.length;
  const mapped = plan.userMappings.filter((m) => m.status === "mapped").length;
  return { total, mapped };
}

export function openMigrationRiskCount(plan: CrmMigrationPlan): number {
  return plan.risks.filter(
    (r) => r.status === "open" || r.status === "mitigating",
  ).length;
}

export function totalRecordEstimate(plan: CrmMigrationPlan): number | null {
  const counts = plan.objects
    .map((o) => o.recordCount)
    .filter((c): c is number => typeof c === "number");
  if (!counts.length) return null;
  return counts.reduce((a, b) => a + b, 0);
}
