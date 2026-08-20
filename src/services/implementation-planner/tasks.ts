import type {
  CrmDecisionProfile,
  PlanPhase,
  PlanPhaseId,
  PlanTask,
  PlanTaskSourceType,
  ProjectRoleId,
  ImplementationType,
  TrainingApproach,
  UatChecklistItem,
  GoLiveChecklistItem,
  PlanMilestone,
} from "@/domain";

type TaskDraft = Omit<PlanTask, "dependencyIds"> & {
  dependencyKeys?: string[];
};

function task(
  partial: Omit<TaskDraft, "status" | "priority" | "sourceRefs" | "requirementIds" | "featureIds" | "integrationIds" | "evidenceRefs" | "criticalPath" | "userEdited" | "dependencyIds"> &
    Partial<
      Pick<
        TaskDraft,
        | "status"
        | "priority"
        | "sourceRefs"
        | "requirementIds"
        | "featureIds"
        | "integrationIds"
        | "evidenceRefs"
        | "criticalPath"
        | "userEdited"
        | "dependencyKeys"
        | "description"
        | "reason"
        | "ownerRole"
        | "durationDays"
      >
    >,
): TaskDraft {
  return {
    sourceRefs: [],
    requirementIds: [],
    featureIds: [],
    integrationIds: [],
    evidenceRefs: [],
    criticalPath: false,
    userEdited: false,
    status: "not-started",
    priority: "medium",
    ...partial,
  };
}

function humanize(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export type TaskGenerationContext = {
  phases: PlanPhase[];
  profile: CrmDecisionProfile | null;
  implementationType?: ImplementationType;
  trainingApproach: TrainingApproach;
  trainingGroups: string[];
  users: number;
  migrationObjects: string[];
  recordTypes: string[];
  productId?: string;
  productName?: string;
};

function phaseIncluded(phases: PlanPhase[], id: PlanPhaseId): boolean {
  return phases.some((p) => p.id === id && p.included);
}

/**
 * Deterministic CRM task library keyed by phase inclusion + profile signals.
 */
export function generateTasks(ctx: TaskGenerationContext): PlanTask[] {
  const drafts: TaskDraft[] = [];
  const mustHaves =
    ctx.profile?.requirements.filter((r) => r.priority === "must-have") ?? [];
  const important =
    ctx.profile?.requirements.filter((r) => r.priority === "important") ?? [];
  const features =
    ctx.profile?.features.filter(
      (f) => f.priority === "must-have" || f.priority === "important",
    ) ?? [];
  const integrations =
    ctx.profile?.integrations.filter(
      (i) => i.priority === "required" || i.priority === "preferred",
    ) ?? [];
  const useCases = ctx.profile?.useCases ?? [];

  if (phaseIncluded(ctx.phases, "discovery")) {
    drafts.push(
      task({
        id: "disc-objectives",
        phaseId: "discovery",
        title: "Confirm implementation objectives",
        sourceType: "generic",
        ownerRole: "executive-sponsor",
        priority: "critical",
        criticalPath: true,
        durationDays: 1,
      }),
      task({
        id: "disc-sponsor",
        phaseId: "discovery",
        title: "Confirm executive / project sponsor",
        sourceType: "generic",
        ownerRole: "executive-sponsor",
        priority: "critical",
        durationDays: 1,
      }),
      task({
        id: "disc-product",
        phaseId: "discovery",
        title: ctx.productName
          ? `Confirm product / plan (${ctx.productName})`
          : "Confirm product selection or vendor-neutral approach",
        sourceType: "generic",
        ownerRole: "project-manager",
        priority: "high",
        durationDays: 1,
      }),
      task({
        id: "disc-scope",
        phaseId: "discovery",
        title: "Confirm launch scope and success metrics",
        sourceType: "generic",
        ownerRole: "project-manager",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["disc-objectives"],
        durationDays: 2,
      }),
      task({
        id: "disc-team",
        phaseId: "discovery",
        title: "Identify project team and governance",
        sourceType: "generic",
        ownerRole: "project-manager",
        durationDays: 2,
      }),
      task({
        id: "disc-golive",
        phaseId: "discovery",
        title: "Define go-live target or planning window",
        sourceType: "generic",
        ownerRole: "project-manager",
        priority: "high",
        durationDays: 1,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "requirements-validation")) {
    drafts.push(
      task({
        id: "req-review-must",
        phaseId: "requirements-validation",
        title: "Review Must Have requirements",
        sourceType: "requirement-derived",
        reason: `${mustHaves.length} must-have requirement(s) from CRMDecisionProfile`,
        requirementIds: mustHaves.map((r) => r.id),
        ownerRole: "crm-owner",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["disc-scope"],
        durationDays: 2,
      }),
      task({
        id: "req-review-important",
        phaseId: "requirements-validation",
        title: "Review Important requirements",
        sourceType: "requirement-derived",
        requirementIds: important.map((r) => r.id),
        ownerRole: "crm-owner",
        durationDays: 1,
      }),
      task({
        id: "req-validate-product",
        phaseId: "requirements-validation",
        title: ctx.productName
          ? `Validate ${ctx.productName} against must-haves`
          : "Validate shortlisted CRMs against must-haves",
        sourceType: "requirement-derived",
        reason: "Unresolved must-haves become implementation risks",
        requirementIds: mustHaves.map((r) => r.id),
        ownerRole: "project-manager",
        priority: "critical",
        dependencyKeys: ["req-review-must"],
        durationDays: 2,
      }),
      task({
        id: "req-phase-split",
        phaseId: "requirements-validation",
        title: "Confirm phase-one vs later-phase requirements",
        sourceType: "generic",
        ownerRole: "project-manager",
        dependencyKeys: ["req-review-must"],
        durationDays: 1,
      }),
      task({
        id: "req-out-of-scope",
        phaseId: "requirements-validation",
        title: "Confirm out-of-scope features",
        sourceType: "generic",
        ownerRole: "crm-owner",
        durationDays: 1,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "process-design")) {
    drafts.push(
      task({
        id: "proc-lifecycle",
        phaseId: "process-design",
        title: "Document lead / opportunity lifecycle",
        sourceType: "generic",
        ownerRole: "sales-operations",
        criticalPath: true,
        dependencyKeys: ["req-phase-split", "disc-scope"],
        durationDays: 2,
      }),
      task({
        id: "proc-stages",
        phaseId: "process-design",
        title: "Define opportunity stages",
        sourceType: "generic",
        ownerRole: "sales-operations",
        dependencyKeys: ["proc-lifecycle"],
        durationDays: 2,
      }),
      task({
        id: "proc-ownership",
        phaseId: "process-design",
        title: "Define ownership and handoff rules",
        sourceType: "generic",
        ownerRole: "sales-operations",
        durationDays: 2,
      }),
      task({
        id: "proc-followup",
        phaseId: "process-design",
        title: "Define follow-up process",
        sourceType: "generic",
        ownerRole: "sales-operations",
        durationDays: 1,
      }),
    );
    for (const uc of useCases.slice(0, 5)) {
      drafts.push(
        task({
          id: `proc-uc-${uc.id}`,
          phaseId: "process-design",
          title: `Document process for use case: ${humanize(uc.id)}`,
          sourceType: "requirement-derived",
          reason: `Selected use case (${uc.priority})`,
          sourceRefs: [`use-case:${uc.id}`],
          ownerRole: "business-representative",
          durationDays: 1,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "data-model")) {
    const recordTypes =
      ctx.recordTypes.length > 0
        ? ctx.recordTypes
        : ["Contacts", "Companies", "Leads", "Deals / Opportunities", "Activities"];
    drafts.push(
      task({
        id: "dm-record-types",
        phaseId: "data-model",
        title: "Confirm required record types",
        description: `Planning for: ${recordTypes.join(", ")}`,
        sourceType: "generic",
        ownerRole: "crm-owner",
        criticalPath: true,
        dependencyKeys: ["proc-stages", "disc-scope"],
        durationDays: 1,
      }),
      task({
        id: "dm-fields",
        phaseId: "data-model",
        title: "Define required and custom fields",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["dm-record-types"],
        durationDays: 3,
      }),
      task({
        id: "dm-stages",
        phaseId: "data-model",
        title: "Define lifecycle / stage values",
        sourceType: "generic",
        ownerRole: "sales-operations",
        dependencyKeys: ["dm-record-types"],
        durationDays: 1,
      }),
      task({
        id: "dm-quality",
        phaseId: "data-model",
        title: "Define data-quality and naming rules",
        sourceType: "generic",
        ownerRole: "data-owner",
        dependencyKeys: ["dm-fields"],
        durationDays: 1,
      }),
      task({
        id: "dm-approve",
        phaseId: "data-model",
        title: "Approve data model",
        sourceType: "generic",
        ownerRole: "project-manager",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["dm-fields", "dm-stages", "dm-quality"],
        durationDays: 1,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "configuration")) {
    drafts.push(
      task({
        id: "cfg-users",
        phaseId: "configuration",
        title: "Configure users and teams",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["dm-approve"],
        durationDays: 2,
      }),
      task({
        id: "cfg-pipelines",
        phaseId: "configuration",
        title: "Configure pipelines and stages",
        sourceType: "generic",
        ownerRole: "crm-owner",
        criticalPath: true,
        dependencyKeys: ["dm-approve"],
        durationDays: 2,
      }),
      task({
        id: "cfg-fields",
        phaseId: "configuration",
        title: "Configure fields and views",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["dm-approve"],
        durationDays: 3,
      }),
      task({
        id: "cfg-activities",
        phaseId: "configuration",
        title: "Configure activity types and templates",
        sourceType: "generic",
        ownerRole: "sales-operations",
        durationDays: 1,
      }),
    );
    for (const f of features.slice(0, 8)) {
      drafts.push(
        task({
          id: `cfg-feat-${f.id}`,
          phaseId: "configuration",
          title: `Configure feature: ${humanize(f.id)}`,
          sourceType: "feature-derived",
          reason: `Added because feature priority is ${f.priority}`,
          featureIds: [f.id],
          ownerRole: "crm-owner",
          dependencyKeys: ["dm-approve"],
          durationDays: 1,
        }),
      );
    }
    const multiPipeline = mustHaves.find((r) =>
      r.id.includes("separate-sales-processes"),
    );
    if (multiPipeline) {
      drafts.push(
        task({
          id: "cfg-multi-pipeline",
          phaseId: "configuration",
          title: "Configure multiple pipelines",
          sourceType: "requirement-derived",
          reason: "Must-have requirement: Support separate sales processes",
          requirementIds: [multiPipeline.id],
          featureIds: features
            .filter((f) => f.id.includes("pipeline"))
            .map((f) => f.id),
          ownerRole: "crm-owner",
          priority: "high",
          dependencyKeys: ["cfg-pipelines"],
          durationDays: 2,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "data-migration")) {
    const objects =
      ctx.migrationObjects.length > 0
        ? ctx.migrationObjects
        : ["Contacts", "Companies", "Deals", "Activities"];
    drafts.push(
      task({
        id: "mig-inventory",
        phaseId: "data-migration",
        title: "Inventory source data",
        description: `Objects in scope: ${objects.join(", ")}`,
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["dm-approve"],
        durationDays: 2,
      }),
      task({
        id: "mig-owners",
        phaseId: "data-migration",
        title: "Identify data owners",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        durationDays: 1,
      }),
      task({
        id: "mig-export",
        phaseId: "data-migration",
        title: "Export source data",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        dependencyKeys: ["mig-inventory"],
        durationDays: 2,
      }),
      task({
        id: "mig-clean",
        phaseId: "data-migration",
        title: "Clean duplicates and normalize data",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        criticalPath: true,
        dependencyKeys: ["mig-export"],
        durationDays: 3,
      }),
      task({
        id: "mig-map-fields",
        phaseId: "data-migration",
        title: "Map source fields to CRM fields",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        criticalPath: true,
        dependencyKeys: ["dm-approve", "mig-clean"],
        durationDays: 3,
      }),
      task({
        id: "mig-map-users",
        phaseId: "data-migration",
        title: "Map users and ownership",
        sourceType: "migration-derived",
        ownerRole: "crm-owner",
        dependencyKeys: ["cfg-users", "mig-map-fields"],
        durationDays: 1,
      }),
      task({
        id: "mig-map-stages",
        phaseId: "data-migration",
        title: "Map statuses / stages",
        sourceType: "migration-derived",
        ownerRole: "sales-operations",
        dependencyKeys: ["cfg-pipelines", "mig-map-fields"],
        durationDays: 1,
      }),
      task({
        id: "mig-test-import",
        phaseId: "data-migration",
        title: "Create and validate test import",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["mig-map-fields", "mig-map-users", "mig-map-stages"],
        durationDays: 3,
      }),
      task({
        id: "mig-correct",
        phaseId: "data-migration",
        title: "Correct mapping issues from test import",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        dependencyKeys: ["mig-test-import"],
        durationDays: 2,
      }),
      task({
        id: "mig-final",
        phaseId: "data-migration",
        title: "Perform final migration",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["mig-correct", "mig-test-import"],
        durationDays: 2,
      }),
      task({
        id: "mig-reconcile",
        phaseId: "data-migration",
        title: "Reconcile record counts and sample records",
        sourceType: "migration-derived",
        ownerRole: "data-owner",
        criticalPath: true,
        dependencyKeys: ["mig-final"],
        durationDays: 1,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "integrations")) {
    for (const integ of integrations) {
      const label = humanize(integ.id);
      drafts.push(
        task({
          id: `int-confirm-${integ.id}`,
          phaseId: "integrations",
          title: `Confirm ${label} integration availability`,
          sourceType: "integration-derived",
          reason: `Integration priority: ${integ.priority}`,
          integrationIds: [integ.id],
          ownerRole: "it-integrations",
          priority: integ.priority === "required" ? "critical" : "high",
          durationDays: 1,
        }),
        task({
          id: `int-auth-${integ.id}`,
          phaseId: "integrations",
          title: `Define ${label} authentication and data direction`,
          sourceType: "integration-derived",
          integrationIds: [integ.id],
          ownerRole: "it-integrations",
          dependencyKeys: [`int-confirm-${integ.id}`],
          durationDays: 1,
        }),
        task({
          id: `int-config-${integ.id}`,
          phaseId: "integrations",
          title: `Configure and test ${label} connection`,
          sourceType: "integration-derived",
          integrationIds: [integ.id],
          ownerRole: "it-integrations",
          criticalPath: integ.priority === "required",
          dependencyKeys: [`int-auth-${integ.id}`, "cfg-fields"],
          durationDays: 2,
        }),
        task({
          id: `int-validate-${integ.id}`,
          phaseId: "integrations",
          title: `Validate ${label} field mapping and first sync`,
          sourceType: "integration-derived",
          integrationIds: [integ.id],
          ownerRole: "it-integrations",
          dependencyKeys: [`int-config-${integ.id}`],
          durationDays: 1,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "automation-reporting")) {
    const automationReqs = mustHaves.filter(
      (r) =>
        r.id.includes("automat") ||
        r.id.includes("workflow") ||
        r.id.includes("follow-up") ||
        r.id.includes("scoring"),
    );
    if (automationReqs.length > 0) {
      drafts.push(
        task({
          id: "auto-define",
          phaseId: "automation-reporting",
          title: "Define automation objectives and triggers",
          sourceType: "requirement-derived",
          requirementIds: automationReqs.map((r) => r.id),
          ownerRole: "sales-operations",
          dependencyKeys: ["cfg-pipelines"],
          durationDays: 2,
        }),
        task({
          id: "auto-build",
          phaseId: "automation-reporting",
          title: "Build and test workflows (happy path + exceptions)",
          sourceType: "requirement-derived",
          requirementIds: automationReqs.map((r) => r.id),
          ownerRole: "crm-owner",
          dependencyKeys: ["auto-define"],
          durationDays: 3,
        }),
        task({
          id: "auto-owner",
          phaseId: "automation-reporting",
          title: "Assign workflow owners and monitoring",
          sourceType: "generic",
          ownerRole: "crm-owner",
          dependencyKeys: ["auto-build"],
          durationDays: 1,
        }),
      );
    }
    const reportingReqs = [...mustHaves, ...important].filter(
      (r) => r.id.includes("report") || r.id.includes("forecast") || r.id.includes("dash"),
    );
    drafts.push(
      task({
        id: "rpt-kpis",
        phaseId: "automation-reporting",
        title: "Define KPIs and management reports",
        sourceType: reportingReqs.length ? "requirement-derived" : "generic",
        requirementIds: reportingReqs.map((r) => r.id),
        ownerRole: "sales-operations",
        dependencyKeys: ["cfg-fields"],
        durationDays: 2,
      }),
      task({
        id: "rpt-dashboards",
        phaseId: "automation-reporting",
        title: "Configure dashboards and validate calculations",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["rpt-kpis"],
        durationDays: 2,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "security")) {
    drafts.push(
      task({
        id: "sec-roles",
        phaseId: "security",
        title: "Define roles and permission model",
        sourceType: "security-derived",
        ownerRole: "security",
        criticalPath: true,
        dependencyKeys: ["cfg-users"],
        durationDays: 2,
      }),
      task({
        id: "sec-teams",
        phaseId: "security",
        title: "Configure team access boundaries",
        sourceType: "security-derived",
        ownerRole: "crm-owner",
        dependencyKeys: ["sec-roles"],
        durationDays: 1,
      }),
      task({
        id: "sec-admins",
        phaseId: "security",
        title: "Define admin users and onboarding/offboarding",
        sourceType: "security-derived",
        ownerRole: "crm-owner",
        durationDays: 1,
      }),
      task({
        id: "sec-export",
        phaseId: "security",
        title: "Define data export and API credential controls",
        sourceType: "security-derived",
        ownerRole: "security",
        durationDays: 1,
      }),
    );
    if (mustHaves.some((r) => r.id === "support-sso")) {
      drafts.push(
        task({
          id: "sec-sso",
          phaseId: "security",
          title: "Configure and test SSO",
          sourceType: "security-derived",
          reason: "Must-have requirement: Support SSO",
          requirementIds: ["support-sso"],
          ownerRole: "it-integrations",
          priority: "critical",
          dependencyKeys: ["sec-roles"],
          durationDays: 2,
        }),
      );
    }
    if (mustHaves.some((r) => r.id === "audit-user-activity")) {
      drafts.push(
        task({
          id: "sec-audit",
          phaseId: "security",
          title: "Confirm audit / activity logging settings",
          sourceType: "security-derived",
          requirementIds: ["audit-user-activity"],
          ownerRole: "security",
          durationDays: 1,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "testing-uat")) {
    drafts.push(
      task({
        id: "test-config",
        phaseId: "testing-uat",
        title: "Configuration testing",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["cfg-pipelines", "cfg-fields"],
        durationDays: 2,
      }),
      task({
        id: "test-permissions",
        phaseId: "testing-uat",
        title: "Permission testing",
        sourceType: "generic",
        ownerRole: "security",
        dependencyKeys: ["sec-roles", "cfg-users"],
        durationDays: 1,
      }),
      task({
        id: "test-uat",
        phaseId: "testing-uat",
        title: "User acceptance testing sign-off",
        sourceType: "requirement-derived",
        reason: "UAT scenarios generated from must-have requirements",
        requirementIds: mustHaves.map((r) => r.id),
        ownerRole: "business-representative",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["test-config"],
        durationDays: 3,
      }),
      task({
        id: "test-rehearsal",
        phaseId: "testing-uat",
        title: "Go-live rehearsal (where relevant)",
        sourceType: "generic",
        ownerRole: "project-manager",
        dependencyKeys: ["test-uat"],
        durationDays: 1,
      }),
    );
    if (phaseIncluded(ctx.phases, "data-migration")) {
      drafts.push(
        task({
          id: "test-data",
          phaseId: "testing-uat",
          title: "Data validation against migrated samples",
          sourceType: "migration-derived",
          ownerRole: "data-owner",
          dependencyKeys: ["mig-test-import"],
          durationDays: 2,
        }),
      );
    }
    if (phaseIncluded(ctx.phases, "integrations")) {
      drafts.push(
        task({
          id: "test-integrations",
          phaseId: "testing-uat",
          title: "Integration testing",
          sourceType: "integration-derived",
          ownerRole: "it-integrations",
          dependencyKeys: integrations.map((i) => `int-validate-${i.id}`),
          durationDays: 2,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "training-change")) {
    const groups =
      ctx.trainingGroups.length > 0
        ? ctx.trainingGroups
        : ["Sales reps", "Managers", "Admins"];
    drafts.push(
      task({
        id: "train-approach",
        phaseId: "training-change",
        title: `Confirm training approach (${ctx.trainingApproach})`,
        sourceType: "generic",
        ownerRole: "trainer-change",
        durationDays: 1,
      }),
      task({
        id: "change-comms",
        phaseId: "training-change",
        title: "Communicate why CRM is changing",
        sourceType: "generic",
        ownerRole: "trainer-change",
        durationDays: 1,
      }),
      task({
        id: "change-champions",
        phaseId: "training-change",
        title: "Identify champions and usage expectations",
        sourceType: "generic",
        ownerRole: "trainer-change",
        durationDays: 1,
      }),
      task({
        id: "train-support",
        phaseId: "training-change",
        title: "Provide support channel for go-live",
        sourceType: "generic",
        ownerRole: "project-manager",
        durationDays: 1,
      }),
    );
    for (const g of groups) {
      const slug = g.toLowerCase().replace(/\s+/g, "-");
      drafts.push(
        task({
          id: `train-${slug}`,
          phaseId: "training-change",
          title: `${g} training`,
          description:
            /manager/i.test(g)
              ? "Pipeline reviews, reporting, forecasting"
              : /admin/i.test(g)
                ? "Users, permissions, workflows, configuration, troubleshooting"
                : "Contacts/accounts, pipeline, activities, email, daily workflow",
          sourceType: "generic",
          ownerRole: "trainer-change",
          priority: "high",
          criticalPath: true,
          dependencyKeys: ["test-uat", "train-approach"],
          durationDays: ctx.users >= 50 ? 3 : 2,
        }),
      );
    }
  }

  if (phaseIncluded(ctx.phases, "go-live")) {
    drafts.push(
      task({
        id: "live-checklist",
        phaseId: "go-live",
        title: "Complete go-live checklist",
        sourceType: "generic",
        ownerRole: "project-manager",
        priority: "critical",
        criticalPath: true,
        dependencyKeys: ["test-uat", "mig-reconcile", "train-support"].filter(
          (id) => drafts.some((d) => d.id === id) || id === "test-uat",
        ),
        durationDays: 1,
      }),
      task({
        id: "live-comms",
        phaseId: "go-live",
        title: "Send go-live communications",
        sourceType: "generic",
        ownerRole: "trainer-change",
        dependencyKeys: ["live-checklist"],
        durationDays: 1,
      }),
      task({
        id: "live-activate",
        phaseId: "go-live",
        title: "Activate user accounts and legacy access decision",
        sourceType: "generic",
        ownerRole: "crm-owner",
        criticalPath: true,
        dependencyKeys: ["live-checklist"],
        durationDays: 1,
      }),
    );
  }

  if (phaseIncluded(ctx.phases, "stabilization")) {
    drafts.push(
      task({
        id: "stab-week1",
        phaseId: "stabilization",
        title: "Week 1 hypercare — monitor errors and support users",
        sourceType: "generic",
        ownerRole: "project-manager",
        dependencyKeys: ["live-activate"],
        durationDays: 5,
      }),
      task({
        id: "stab-week2",
        phaseId: "stabilization",
        title: "Week 2 — fix priority issues and review adoption",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["stab-week1"],
        durationDays: 5,
      }),
      task({
        id: "stab-30",
        phaseId: "stabilization",
        title: "30-day review — data quality, process, automation",
        sourceType: "generic",
        ownerRole: "sales-operations",
        dependencyKeys: ["stab-week2"],
        durationDays: 2,
      }),
      task({
        id: "stab-60",
        phaseId: "stabilization",
        title: "60-day optimize workflows and reporting",
        sourceType: "generic",
        ownerRole: "crm-owner",
        dependencyKeys: ["stab-30"],
        durationDays: 2,
      }),
      task({
        id: "stab-90",
        phaseId: "stabilization",
        title: "90-day evaluate success metrics and prioritize phase 2",
        sourceType: "generic",
        ownerRole: "executive-sponsor",
        dependencyKeys: ["stab-60"],
        durationDays: 2,
      }),
    );
  }

  // Resolve dependency keys → only keep deps that exist
  const idSet = new Set(drafts.map((d) => d.id));
  return drafts.map(({ dependencyKeys, ...rest }) => ({
    ...rest,
    dependencyIds: (dependencyKeys ?? []).filter((id) => idSet.has(id)),
  }));
}

export function generateUatItems(
  profile: CrmDecisionProfile | null,
): UatChecklistItem[] {
  const mustHaves =
    profile?.requirements.filter((r) => r.priority === "must-have") ?? [];
  return mustHaves.map((r) => {
    const label = humanize(r.id);
    const { scenario, expectedResult, ownerRole } = uatScenarioForRequirement(
      r.id,
      label,
    );
    return {
      id: `uat-${r.id}`,
      requirementId: r.id,
      requirementLabel: label,
      scenario,
      expectedResult,
      ownerRole,
      status: "not-tested" as const,
    };
  });
}

function uatScenarioForRequirement(
  id: string,
  label: string,
): {
  scenario: string;
  expectedResult: string;
  ownerRole: ProjectRoleId;
} {
  if (id.includes("separate-sales-processes") || id.includes("pipeline")) {
    return {
      scenario:
        "Create an opportunity in Pipeline A and another in Pipeline B with different stage structures.",
      expectedResult:
        "Each opportunity follows its own stage path; stages do not bleed across pipelines.",
      ownerRole: "sales-operations",
    };
  }
  if (id.includes("email") || id.includes("integrate-with-email")) {
    return {
      scenario:
        "Connect a test mailbox, send/log an email on a contact, and confirm it appears on the timeline.",
      expectedResult:
        "Email is associated to the correct record and visible to permitted users.",
      ownerRole: "business-representative",
    };
  }
  if (id.includes("restrict-access") || id.includes("team")) {
    return {
      scenario:
        "Log in as a user on Team A and confirm records owned by Team B are hidden or read-only as designed.",
      expectedResult:
        "Team visibility rules match the agreed permission model; no unintended cross-team access.",
      ownerRole: "security",
    };
  }
  if (id.includes("sso")) {
    return {
      scenario:
        "Sign in via SSO with a provisioned user and confirm session and role mapping.",
      expectedResult:
        "SSO login succeeds and the user lands with the correct CRM role/permissions.",
      ownerRole: "it-integrations",
    };
  }
  if (id.includes("automat") || id.includes("follow-up") || id.includes("workflow")) {
    return {
      scenario:
        "Trigger the agreed automation (happy path), then trigger an exception path.",
      expectedResult:
        "Actions fire correctly on the happy path; exceptions are handled without silent failure.",
      ownerRole: "sales-operations",
    };
  }
  if (id.includes("custom") && id.includes("field")) {
    return {
      scenario:
        "Create/edit a record using required custom fields and save with a missing mandatory field.",
      expectedResult:
        "Custom fields appear as configured; mandatory validation blocks incomplete saves.",
      ownerRole: "crm-owner",
    };
  }
  if (id.includes("report") || id.includes("forecast")) {
    return {
      scenario:
        "Open the agreed management report/dashboard with sample data and check totals against source records.",
      expectedResult:
        "Figures match source records; filters and permissions behave as expected.",
      ownerRole: "sales-operations",
    };
  }
  if (id.includes("interaction") || id.includes("activit") || id.includes("track-client")) {
    return {
      scenario:
        "Log a call, meeting and note against a contact/deal and reopen the record.",
      expectedResult:
        "All activities appear on the timeline with correct type, owner and timestamp.",
      ownerRole: "business-representative",
    };
  }
  return {
    scenario: `Walk through the primary user workflow that depends on: ${label}.`,
    expectedResult: `Must-have requirement "${label}" works as agreed for phase-one scope, with no critical gaps.`,
    ownerRole: "business-representative",
  };
}

/** Refresh scenario copy from current templates while preserving test status. */
export function mergeUatItems(
  generated: UatChecklistItem[],
  previous: UatChecklistItem[],
): UatChecklistItem[] {
  const prevById = new Map(previous.map((u) => [u.id, u]));
  return generated.map((item) => {
    const prev = prevById.get(item.id);
    if (!prev) return item;
    return {
      ...item,
      status: prev.status,
    };
  });
}

export function generateGoLiveChecklist(
  includeMigration: boolean,
  includeIntegrations: boolean,
): GoLiveChecklistItem[] {
  const items: GoLiveChecklistItem[] = [
    {
      id: "gl-uat",
      label: "UAT signed off",
      status: "pending",
      category: "validation",
    },
    {
      id: "gl-workflows",
      label: "Critical workflows tested",
      status: "pending",
      category: "validation",
    },
    {
      id: "gl-users",
      label: "User accounts active",
      status: "pending",
      category: "people",
    },
    {
      id: "gl-perms",
      label: "Permissions validated",
      status: "pending",
      category: "systems",
    },
    {
      id: "gl-training",
      label: "Training complete for launch roles",
      status: "pending",
      category: "people",
    },
    {
      id: "gl-support",
      label: "Support process ready",
      status: "pending",
      category: "people",
    },
    {
      id: "gl-legacy",
      label: "Legacy system access decision made",
      status: "pending",
      category: "cutover",
    },
    {
      id: "gl-backup",
      label: "Backup / export complete where relevant",
      status: "pending",
      category: "cutover",
    },
    {
      id: "gl-comms",
      label: "Go-live communications sent",
      status: "pending",
      category: "people",
    },
  ];
  if (includeMigration) {
    items.unshift(
      {
        id: "gl-mig",
        label: "Final migration complete",
        status: "pending",
        category: "cutover",
      },
      {
        id: "gl-counts",
        label: "Record counts reconciled",
        status: "pending",
        category: "validation",
      },
    );
  }
  if (includeIntegrations) {
    items.splice(2, 0, {
      id: "gl-int",
      label: "Critical integrations green",
      status: "pending",
      category: "systems",
    });
  }
  return items;
}

export function generateMilestones(
  totalWeeks: number,
  includeMigration: boolean,
): PlanMilestone[] {
  const milestones: PlanMilestone[] = [
    {
      id: "ms-plan-ready",
      label: "Implementation plan approved",
      weekOffset: 1,
      kind: "planning",
    },
    {
      id: "ms-golive",
      label: "Go-live",
      weekOffset: Math.max(1, totalWeeks - (totalWeeks > 4 ? 2 : 0)),
      kind: "cutover",
    },
    {
      id: "ms-hypercare-end",
      label: "Hypercare complete",
      weekOffset: totalWeeks,
      kind: "hypercare",
    },
    {
      id: "ms-30",
      label: "30-day adoption review",
      weekOffset: totalWeeks + 2,
      kind: "review",
    },
  ];
  if (includeMigration) {
    milestones.splice(1, 0, {
      id: "ms-test-mig",
      label: "Test migration validated",
      weekOffset: Math.max(2, Math.floor(totalWeeks * 0.55)),
      kind: "planning",
    });
  }
  return milestones;
}

export type { PlanTaskSourceType };
