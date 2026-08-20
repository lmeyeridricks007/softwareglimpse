import type { CrmMigrationPlan, MigrationTask } from "@/domain";

/**
 * Deterministic migration planning rules — transparent and testable.
 * Each rule may add tasks; never invents product capabilities.
 */

export type MigrationRule = {
  id: string;
  description: string;
  applies: (plan: CrmMigrationPlan) => boolean;
  tasks: Array<Omit<MigrationTask, "status"> & { status?: MigrationTask["status"] }>;
};

export const MIGRATION_RULES: MigrationRule[] = [
  {
    id: "multi-source-consolidation",
    description: "Multiple source systems require consolidation tasks.",
    applies: (plan) => plan.sourceSystems.length >= 2,
    tasks: [
      {
        id: "rule-consolidate-sources",
        title: "Define source consolidation approach",
        reason: "Multiple source systems identified",
        section: "discovery",
        ruleId: "multi-source-consolidation",
      },
      {
        id: "rule-source-owners",
        title: "Confirm data owner for each source system",
        reason: "Multiple sources need clear ownership",
        section: "discovery",
        ruleId: "multi-source-consolidation",
      },
    ],
  },
  {
    id: "inactive-owners",
    description: "Inactive source owners require an ownership decision.",
    applies: (plan) =>
      plan.userMappings.some((u) => u.active === "no") ||
      plan.inactiveOwnerStrategy === "unknown",
    tasks: [
      {
        id: "rule-inactive-owner-decision",
        title: "Decide inactive-owner reassignment strategy",
        reason: "Ownership often breaks migrations when users are inactive",
        section: "mapping",
        ruleId: "inactive-owners",
      },
    ],
  },
  {
    id: "custom-fields-mapping",
    description: "Custom fields require field mapping.",
    applies: (plan) =>
      (plan.customFields.sourceCount ?? 0) > 0 ||
      plan.objects.some((o) => o.objectKey === "custom-fields"),
    tasks: [
      {
        id: "rule-map-custom-fields",
        title: "Map custom fields (or mark do-not-migrate)",
        reason: "Custom fields are in scope",
        section: "mapping",
        ruleId: "custom-fields-mapping",
      },
    ],
  },
  {
    id: "multi-pipeline",
    description: "Multiple pipelines require stage mapping.",
    applies: (plan) =>
      plan.pipelineMappings.length >= 2 ||
      plan.objects.some((o) => o.objectKey === "pipeline-stages"),
    tasks: [
      {
        id: "rule-map-pipelines",
        title: "Map each source pipeline to target stages",
        reason: "Pipeline / stage mapping is in scope",
        section: "mapping",
        ruleId: "multi-pipeline",
      },
    ],
  },
  {
    id: "attachments",
    description: "Attachments need validation when selected.",
    applies: (plan) => plan.attachments.needed === "yes",
    tasks: [
      {
        id: "rule-attachment-support",
        title: "Confirm target attachment support with evidence",
        reason: "Attachments selected — do not assume migratability",
        section: "inventory",
        ruleId: "attachments",
      },
      {
        id: "rule-attachment-validation",
        title: "Add attachment checks to test migration validation",
        reason: "Attachments selected",
        section: "validation",
        ruleId: "attachments",
      },
    ],
  },
  {
    id: "high-complexity-extra-test",
    description: "High complexity suggests an extra test cycle.",
    applies: (plan) =>
      plan.complexity?.level === "high" ||
      plan.complexity?.level === "very-high",
    tasks: [
      {
        id: "rule-extra-test-cycle",
        title: "Plan an additional test migration cycle",
        reason: "Migration complexity is high or very high",
        section: "test",
        ruleId: "high-complexity-extra-test",
      },
    ],
  },
  {
    id: "source-remains-active",
    description: "Active source during cutover needs delta reconciliation.",
    applies: (plan) => plan.deltaMigration.sourceRemainsActive === "yes",
    tasks: [
      {
        id: "rule-data-freeze",
        title: "Define data freeze / cutoff timestamp",
        reason: "Source remains active during cutover",
        section: "cutover",
        ruleId: "source-remains-active",
      },
      {
        id: "rule-delta-reconcile",
        title: "Plan delta / change reconciliation after cutover",
        reason: "Source remains active — do not assume incremental import exists",
        section: "cutover",
        ruleId: "source-remains-active",
      },
    ],
  },
  {
    id: "unmapped-required",
    description: "Unmapped required fields must be resolved.",
    applies: (plan) =>
      plan.fieldMappings.some(
        (m) =>
          m.required &&
          (m.status === "unknown" ||
            m.status === "no-target-field" ||
            m.status === "needs-review" ||
            m.status === "suggested"),
      ),
    tasks: [
      {
        id: "rule-resolve-required-fields",
        title: "Resolve unmapped required fields",
        reason: "Required fields without confirmed mapping create go-live risk",
        section: "mapping",
        ruleId: "unmapped-required",
      },
    ],
  },
  {
    id: "dedupe-undefined",
    description: "Deduplication strategy should be defined when contacts migrate.",
    applies: (plan) =>
      plan.objects.some(
        (o) =>
          (o.objectKey === "contacts" || o.objectKey === "companies") &&
          o.priority !== "do-not-migrate",
      ) &&
      (plan.dedupe.matchMethods.length === 0 ||
        plan.dedupe.primaryRule === "unknown"),
    tasks: [
      {
        id: "rule-define-dedupe",
        title: "Define duplicate identification and primary-record rules",
        reason: "Contacts/companies in scope without a dedupe strategy",
        section: "cleaning",
        ruleId: "dedupe-undefined",
      },
    ],
  },
  {
    id: "no-target-product",
    description: "Vendor-neutral plans still need a target decision before cutover.",
    applies: (plan) => !plan.targetProductId,
    tasks: [
      {
        id: "rule-select-target",
        title: "Select target CRM or confirm vendor-neutral planning",
        reason: "No target CRM selected",
        section: "discovery",
        ruleId: "no-target-product",
      },
    ],
  },
];

export function applyMigrationRules(plan: CrmMigrationPlan): MigrationTask[] {
  const generated: MigrationTask[] = [];
  for (const rule of MIGRATION_RULES) {
    if (!rule.applies(plan)) continue;
    for (const task of rule.tasks) {
      generated.push({
        ...task,
        status: task.status ?? "not-started",
      });
    }
  }
  return generated;
}

/** Merge rule-generated tasks without wiping user progress on matching ids. */
export function mergeRuleTasks(
  existing: MigrationTask[],
  generated: MigrationTask[],
): MigrationTask[] {
  const byId = new Map(existing.map((t) => [t.id, t]));
  const merged: MigrationTask[] = [];
  const seen = new Set<string>();

  for (const task of generated) {
    const prev = byId.get(task.id);
    merged.push(
      prev
        ? { ...task, status: prev.status, owner: prev.owner ?? task.owner }
        : task,
    );
    seen.add(task.id);
  }

  for (const task of existing) {
    if (!seen.has(task.id) && !task.ruleId) {
      merged.push(task);
    }
  }

  return merged;
}
