import {
  McSessionSchema,
  McInputsSchema,
  McBusinessCaseHandoffPayloadSchema,
  McRoiHandoffPayloadSchema,
  McTcoHandoffPayloadSchema,
  CRM_MIGRATION_COST_STORAGE_KEY,
  CRM_MIGRATION_COST_TCO_HANDOFF_KEY,
  CRM_MIGRATION_COST_ROI_HANDOFF_KEY,
  CRM_MIGRATION_COST_BUSINESS_CASE_HANDOFF_KEY,
  createDefaultDataObjects,
  createDefaultDataQualityIssues,
  createDefaultIntegrations,
  createDefaultCustomizations,
  createDefaultInternalRoles,
  createDefaultEffortCategories,
  createDefaultScopeToggles,
  createDefaultTimelineStages,
  type McSession,
  type McInputs,
  type McTcoHandoffPayload,
  type McRoiHandoffPayload,
  type McBusinessCaseHandoffPayload,
} from "@/domain";
import type { McComputeResult } from "./compute";

export function createEmptyMigrationCostInputs(): McInputs {
  return McInputsSchema.parse({
    currency: "EUR",
    currentSystem: {
      projectName: "CRM Migration Estimate",
    },
    dataScope: {
      objects: createDefaultDataObjects(),
      historicalActivity: {},
      attachments: {},
    },
    dataQuality: {
      issues: createDefaultDataQualityIssues(),
    },
    fieldMapping: {},
    integrations: {
      rows: createDefaultIntegrations(),
      customizations: createDefaultCustomizations(),
    },
    approach: {
      quotes: [],
      tooling: [],
    },
    internalEffort: {
      roles: createDefaultInternalRoles(),
      categories: createDefaultEffortCategories(),
    },
    testingCutover: {
      testing: {
        cycles: [
          {
            id: "test-1",
            label: "Test 1 — Mapping validation",
            include: true,
          },
          {
            id: "test-2",
            label: "Test 2 — Cleansing / transform validation",
            include: true,
          },
          {
            id: "test-3",
            label: "Test 3 — Production rehearsal",
            include: true,
          },
        ],
      },
      cutover: {},
      downtime: { include: false },
      hypercare: { period: "none" },
      training: { classification: "migration" },
      contingency: { percent: 0 },
    },
    scenarios: {
      scopeToggles: createDefaultScopeToggles(),
      phases: [],
      timelineStages: createDefaultTimelineStages(),
    },
  });
}

export function createEmptyMigrationCostSession(): McSession {
  const now = new Date().toISOString();
  return McSessionSchema.parse({
    version: 1,
    wizardStepId: "current-system",
    maxReachableStepIndex: 0,
    inputs: createEmptyMigrationCostInputs(),
    createdAt: now,
    updatedAt: now,
  });
}

export function loadMigrationCostSession(): McSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CRM_MIGRATION_COST_STORAGE_KEY);
    if (!raw) return null;
    return McSessionSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveMigrationCostSession(session: McSession): void {
  if (typeof window === "undefined") return;
  try {
    const next = McSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(CRM_MIGRATION_COST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures
  }
}

export function resetMigrationCostSession(): McSession {
  const empty = createEmptyMigrationCostSession();
  saveMigrationCostSession(empty);
  return empty;
}

export function buildTcoHandoffPayload(
  inputs: McInputs,
  result: McComputeResult,
): McTcoHandoffPayload {
  return McTcoHandoffPayloadSchema.parse({
    version: 1,
    source: "crm-migration-cost-calculator",
    currency: inputs.currency,
    expectedTotalMinor: result.expectedTotalMinor,
    externalCostMinor: result.externalMinor,
    internalLabourMinor: result.internalLabourMinor,
    internalHours: result.internalHoursTotal,
    toolingMinor: result.toolingMinor,
    contingencyMinor: result.contingencyMinor,
    dataCleaningCostMinor:
      result.categories.find((c) => c.id === "data-preparation")
        ?.expectedMinor ?? null,
    complexity: result.complexity.overall,
    confidence: result.confidence,
    coveragePercent: result.coveragePercent,
    createdAt: new Date().toISOString(),
  });
}

export function buildRoiHandoffPayload(
  inputs: McInputs,
  result: McComputeResult,
): McRoiHandoffPayload {
  return McRoiHandoffPayloadSchema.parse({
    version: 1,
    source: "crm-migration-cost-calculator",
    currency: inputs.currency,
    migrationMinor: result.expectedTotalMinor,
    createdAt: new Date().toISOString(),
  });
}

export function buildBusinessCaseHandoffPayload(
  inputs: McInputs,
  result: McComputeResult,
): McBusinessCaseHandoffPayload {
  return McBusinessCaseHandoffPayloadSchema.parse({
    version: 1,
    source: "crm-migration-cost-calculator",
    currency: inputs.currency,
    projectName: inputs.currentSystem.projectName,
    expectedTotalMinor: result.expectedTotalMinor,
    externalCostMinor: result.externalMinor,
    internalLabourMinor: result.internalLabourMinor,
    toolingMinor: result.toolingMinor,
    contingencyMinor: result.contingencyMinor,
    complexity: result.complexity.overall,
    confidence: result.confidence,
    timelineWeeks: result.timelineWeeks,
    majorAssumptions: [
      `Source: ${inputs.currentSystem.sourceType ?? "not set"}`,
      `Target CRM: ${inputs.currentSystem.targetCrm ?? "not set"}`,
      `Migration type: ${inputs.currentSystem.migrationType ?? "not set"}`,
      `Complexity: ${result.complexity.overall}`,
      `Confidence: ${result.confidence}`,
    ],
    risks: result.readinessWarnings,
    unknowns: result.unknowns.map((u) => u.label),
    createdAt: new Date().toISOString(),
  });
}

export function saveTcoHandoff(payload: McTcoHandoffPayload): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CRM_MIGRATION_COST_TCO_HANDOFF_KEY,
    JSON.stringify(payload),
  );
}

export function saveRoiHandoff(payload: McRoiHandoffPayload): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CRM_MIGRATION_COST_ROI_HANDOFF_KEY,
    JSON.stringify(payload),
  );
}

export function saveBusinessCaseHandoff(
  payload: McBusinessCaseHandoffPayload,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    CRM_MIGRATION_COST_BUSINESS_CASE_HANDOFF_KEY,
    JSON.stringify(payload),
  );
}

export function loadTcoHandoff(): McTcoHandoffPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CRM_MIGRATION_COST_TCO_HANDOFF_KEY);
    if (!raw) return null;
    return McTcoHandoffPayloadSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function loadRoiHandoff(): McRoiHandoffPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CRM_MIGRATION_COST_ROI_HANDOFF_KEY);
    if (!raw) return null;
    return McRoiHandoffPayloadSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function detectRoiOverlap(): {
  overlap: boolean;
  message: string | null;
} {
  if (typeof window === "undefined") {
    return { overlap: false, message: null };
  }
  try {
    const tcoRaw = localStorage.getItem("sg-crm-tco-v1");
    const roiRaw = localStorage.getItem("sg-crm-roi-v1");
    let tcoHasMigration = false;
    let roiHasMigration = false;
    if (tcoRaw) {
      const tco = JSON.parse(tcoRaw) as {
        scenarios?: Array<{
          migration?: { externalCostMinor?: number | null };
        }>;
      };
      tcoHasMigration = Boolean(
        tco.scenarios?.some(
          (s) =>
            s.migration?.externalCostMinor != null &&
            s.migration.externalCostMinor > 0,
        ),
      );
    }
    if (roiRaw) {
      const roi = JSON.parse(roiRaw) as {
        inputs?: { investment?: { migrationMinor?: number | null } };
      };
      roiHasMigration =
        roi.inputs?.investment?.migrationMinor != null &&
        (roi.inputs.investment.migrationMinor ?? 0) > 0;
    }
    if (tcoHasMigration && roiHasMigration) {
      return {
        overlap: true,
        message:
          "Migration cost already appears in both your TCO and ROI models. Importing again may double-count Year 1 investment — review before confirming.",
      };
    }
    if (tcoHasMigration) {
      return {
        overlap: true,
        message:
          "A migration amount already exists in your TCO model. Prefer importing once (TCO or ROI), not both, unless you intentionally split costs.",
      };
    }
    if (roiHasMigration) {
      return {
        overlap: true,
        message:
          "A migration amount already exists in your ROI investment. Confirm before overwriting.",
      };
    }
  } catch {
    // ignore
  }
  return { overlap: false, message: null };
}

export {
  CRM_MIGRATION_COST_STORAGE_KEY,
  CRM_MIGRATION_COST_TCO_HANDOFF_KEY,
  CRM_MIGRATION_COST_ROI_HANDOFF_KEY,
  CRM_MIGRATION_COST_BUSINESS_CASE_HANDOFF_KEY,
};
