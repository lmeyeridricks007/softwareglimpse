import {
  CRM_IMPLEMENTATION_PLAN_STORAGE_KEY,
  CrmImplementationPlanSchema,
  createEmptyCrmImplementationPlan,
  type CrmImplementationPlan,
  type PlanTask,
  type PlanTaskStatus,
  type ProjectRoleId,
} from "@/domain";

export { CRM_IMPLEMENTATION_PLAN_STORAGE_KEY };

export function loadCrmImplementationPlan(): CrmImplementationPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CRM_IMPLEMENTATION_PLAN_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmImplementationPlanSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCrmImplementationPlan(
  plan: CrmImplementationPlan,
): CrmImplementationPlan {
  const next = CrmImplementationPlanSchema.parse({
    ...plan,
    updatedAt: new Date().toISOString(),
  });
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        CRM_IMPLEMENTATION_PLAN_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch {
      // storage full / private mode — ignore
    }
  }
  return next;
}

export function resetCrmImplementationPlan(): CrmImplementationPlan {
  const empty = createEmptyCrmImplementationPlan();
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(CRM_IMPLEMENTATION_PLAN_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return empty;
}

export function updateTask(
  plan: CrmImplementationPlan,
  taskId: string,
  patch: Partial<PlanTask>,
): CrmImplementationPlan {
  return {
    ...plan,
    tasks: plan.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            ...patch,
            userEdited: true,
          }
        : t,
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function setTaskStatus(
  plan: CrmImplementationPlan,
  taskId: string,
  status: PlanTaskStatus,
): CrmImplementationPlan {
  return updateTask(plan, taskId, { status });
}

export function addUserTask(
  plan: CrmImplementationPlan,
  input: {
    phaseId: PlanTask["phaseId"];
    title: string;
    description?: string;
    ownerRole?: ProjectRoleId;
  },
): CrmImplementationPlan {
  const id = `user-${Date.now().toString(36)}`;
  const task: PlanTask = {
    id,
    phaseId: input.phaseId,
    title: input.title,
    description: input.description,
    sourceType: "user-added",
    sourceRefs: [],
    ownerRole: input.ownerRole,
    dependencyIds: [],
    priority: "medium",
    status: "not-started",
    requirementIds: [],
    featureIds: [],
    integrationIds: [],
    evidenceRefs: [],
    criticalPath: false,
    userEdited: true,
  };
  return {
    ...plan,
    tasks: [...plan.tasks, task],
    updatedAt: new Date().toISOString(),
  };
}

export function planCompletionPercent(plan: CrmImplementationPlan): number {
  const active = plan.tasks.filter((t) => t.status !== "not-applicable");
  if (active.length === 0) return 0;
  const done = active.filter((t) => t.status === "complete").length;
  return Math.round((done / active.length) * 100);
}

export function openRiskCount(plan: CrmImplementationPlan): number {
  return plan.risks.filter(
    (r) => r.status === "open" || r.status === "mitigating",
  ).length;
}
