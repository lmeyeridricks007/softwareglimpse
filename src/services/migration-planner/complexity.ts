import type {
  ComplexityDriver,
  CrmMigrationPlan,
  MigrationComplexityAssessment,
} from "@/domain";

/**
 * Transparent semantic complexity — no fake precision.
 * Drivers are labelled; level bands are deterministic thresholds on weight sum.
 */
export function assessMigrationComplexity(
  plan: CrmMigrationPlan,
): MigrationComplexityAssessment {
  const drivers: ComplexityDriver[] = [];

  const sourceCount = plan.sourceSystems.length;
  if (sourceCount >= 3) {
    drivers.push({
      id: "sources-many",
      label: `${sourceCount} source systems`,
      weight: 3,
    });
  } else if (sourceCount === 2) {
    drivers.push({
      id: "sources-two",
      label: "2 source systems",
      weight: 2,
    });
  } else if (sourceCount === 1) {
    drivers.push({
      id: "sources-one",
      label: "1 source system",
      weight: 1,
    });
  }

  const objectCount = plan.objects.filter(
    (o) => o.priority !== "do-not-migrate" && o.priority !== "archive-only",
  ).length;
  if (objectCount >= 10) {
    drivers.push({
      id: "objects-many",
      label: `${objectCount} objects in scope`,
      weight: 3,
    });
  } else if (objectCount >= 5) {
    drivers.push({
      id: "objects-mid",
      label: `${objectCount} objects in scope`,
      weight: 2,
    });
  } else if (objectCount > 0) {
    drivers.push({
      id: "objects-few",
      label: `${objectCount} object(s) in scope`,
      weight: 1,
    });
  }

  const records = plan.objects
    .map((o) => o.recordCount)
    .filter((c): c is number => typeof c === "number");
  const totalRecords = records.reduce((a, b) => a + b, 0);
  if (records.length && totalRecords >= 100_000) {
    drivers.push({
      id: "records-very-high",
      label: `~${totalRecords.toLocaleString()} records`,
      weight: 3,
    });
  } else if (records.length && totalRecords >= 20_000) {
    drivers.push({
      id: "records-high",
      label: `~${totalRecords.toLocaleString()} records`,
      weight: 2,
    });
  } else if (records.length && totalRecords >= 5_000) {
    drivers.push({
      id: "records-mid",
      label: `~${totalRecords.toLocaleString()} records`,
      weight: 1,
    });
  }

  const customFieldCount = plan.customFields.sourceCount ?? 0;
  if (customFieldCount >= 30) {
    drivers.push({
      id: "custom-fields-high",
      label: `${customFieldCount} custom fields`,
      weight: 3,
    });
  } else if (customFieldCount >= 10) {
    drivers.push({
      id: "custom-fields-mid",
      label: `${customFieldCount} custom fields`,
      weight: 2,
    });
  } else if (customFieldCount > 0) {
    drivers.push({
      id: "custom-fields-low",
      label: `${customFieldCount} custom field(s)`,
      weight: 1,
    });
  }

  if (plan.objects.some((o) => o.objectKey === "custom-objects")) {
    drivers.push({
      id: "custom-objects",
      label: "Custom objects in scope",
      weight: 2,
    });
  }

  if (
    plan.objects.some(
      (o) =>
        (o.objectKey === "activities" || o.objectKey === "emails") &&
        (o.historyDepth === "all-history" ||
          o.historyDepth === "last-24-months"),
    )
  ) {
    drivers.push({
      id: "history-deep",
      label: "Historical activity required",
      weight: 2,
    });
  }

  if (plan.attachments.needed === "yes") {
    drivers.push({
      id: "attachments",
      label: "Attachments / files in scope",
      weight: 2,
    });
  }

  const inactiveUsers = plan.userMappings.filter(
    (u) => u.active === "no",
  ).length;
  if (inactiveUsers > 0) {
    drivers.push({
      id: "inactive-owners",
      label: `${inactiveUsers} inactive source user(s)`,
      weight: 1,
    });
  }

  if (plan.userMappings.length >= 25) {
    drivers.push({
      id: "users-many",
      label: `${plan.userMappings.length} users to map`,
      weight: 1,
    });
  }

  if (plan.pipelineMappings.length >= 2) {
    drivers.push({
      id: "pipelines-multi",
      label: `${plan.pipelineMappings.length} pipelines`,
      weight: 2,
    });
  } else if (plan.pipelineMappings.length === 1) {
    drivers.push({
      id: "pipelines-one",
      label: "Pipeline / stage mapping required",
      weight: 1,
    });
  }

  const transforms = plan.fieldMappings.filter(
    (m) =>
      m.transformation !== "none" ||
      m.status === "transformation-needed",
  ).length;
  if (transforms >= 10) {
    drivers.push({
      id: "transforms-many",
      label: `${transforms} field transformations`,
      weight: 2,
    });
  } else if (transforms > 0) {
    drivers.push({
      id: "transforms-some",
      label: `${transforms} field transformation(s)`,
      weight: 1,
    });
  }

  if (
    plan.dedupe.matchMethods.length === 0 ||
    plan.dedupe.primaryRule === "unknown"
  ) {
    // Not a complexity driver — surfaced as risk instead.
  } else {
    drivers.push({
      id: "dedupe",
      label: "Deduplication required",
      weight: 1,
    });
  }

  if (plan.deltaMigration.sourceRemainsActive === "yes") {
    drivers.push({
      id: "delta",
      label: "Source remains active during cutover",
      weight: 2,
    });
  }

  if (!plan.targetProductId && plan.vendorNeutral) {
    drivers.push({
      id: "vendor-neutral",
      label: "No target CRM selected (vendor-neutral plan)",
      weight: 1,
    });
  }

  const score = drivers.reduce((sum, d) => sum + d.weight, 0);
  let level: MigrationComplexityAssessment["level"];
  if (score <= 3) level = "low";
  else if (score <= 7) level = "moderate";
  else if (score <= 12) level = "high";
  else level = "very-high";

  return { level, drivers, score };
}

export function complexityLevelLabel(
  level: MigrationComplexityAssessment["level"],
): string {
  switch (level) {
    case "low":
      return "Low";
    case "moderate":
      return "Moderate";
    case "high":
      return "High";
    case "very-high":
      return "Very High";
  }
}
