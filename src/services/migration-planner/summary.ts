import type { CrmMigrationPlan } from "@/domain";
import { complexityLevelLabel } from "./complexity";
import {
  fieldMappingProgress,
  openMigrationRiskCount,
  totalRecordEstimate,
  userMappingProgress,
} from "./persistence";

export type MigrationDashboardSummary = {
  sourceCount: number;
  targetLabel: string;
  objectCount: number;
  recordEstimate: number | null;
  fieldTotal: number;
  fieldMappedPercent: number | null;
  usersMapped: number;
  usersTotal: number;
  pipelinesMapped: number;
  pipelinesTotal: number;
  testStatus: string;
  openRisks: number;
  complexityLabel: string | null;
  customFieldsSource: number | null;
};

export function buildMigrationDashboard(
  plan: CrmMigrationPlan,
): MigrationDashboardSummary {
  const fields = fieldMappingProgress(plan);
  const users = userMappingProgress(plan);
  const pipelinesTotal = plan.pipelineMappings.length;
  const pipelinesMapped = plan.pipelineMappings.filter((p) =>
    p.stageMaps.length > 0 &&
    p.stageMaps.every((s) => Boolean(s.targetStage)),
  ).length;

  return {
    sourceCount: plan.sourceSystems.length,
    targetLabel:
      plan.targetProductName ??
      (plan.vendorNeutral ? "Vendor-neutral" : "Not selected"),
    objectCount: plan.objects.filter(
      (o) => o.priority !== "do-not-migrate",
    ).length,
    recordEstimate: totalRecordEstimate(plan),
    fieldTotal: fields.total,
    fieldMappedPercent: fields.percentMapped,
    usersMapped: users.mapped,
    usersTotal: users.total,
    pipelinesMapped,
    pipelinesTotal,
    testStatus: plan.testMigration.status,
    openRisks: openMigrationRiskCount(plan),
    complexityLabel: plan.complexity
      ? complexityLevelLabel(plan.complexity.level)
      : null,
    customFieldsSource: plan.customFields.sourceCount ?? null,
  };
}
