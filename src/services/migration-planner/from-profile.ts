import type {
  CrmDecisionProfile,
  CrmImplementationPlan,
  CrmMigrationPlan,
  MigrationNeeded,
  MigrationObjectKey,
  TCOSession,
} from "@/domain";
import { createEmptyCrmMigrationPlan } from "@/domain";

export type MigrationPrefill = {
  productId?: string;
  productName?: string;
  users?: number;
  teamLabels: string[];
  migrationComplexity?: "none" | "low" | "medium" | "high";
  currentState?: CrmDecisionProfile["businessContext"]["currentState"];
  implementationMigrationSource?: string;
  implementationMigrationObjects: string[];
  tcoMigrationNeeded?: MigrationNeeded;
  tcoMigrationScopes: string[];
  targetGoLive?: string;
  hasProfile: boolean;
  hasImplementationPlan: boolean;
  hasTcoSession: boolean;
  profileSummary: string[];
};

const OBJECT_KEY_ALIASES: Record<string, MigrationObjectKey> = {
  contacts: "contacts",
  contact: "contacts",
  people: "contacts",
  persons: "contacts",
  companies: "companies",
  accounts: "companies",
  organizations: "companies",
  leads: "leads",
  deals: "deals",
  opportunities: "deals",
  activities: "activities",
  tasks: "tasks",
  notes: "notes",
  emails: "emails",
  attachments: "attachments",
  files: "attachments",
  products: "products",
  quotes: "quotes",
  users: "users",
  teams: "teams",
  "custom-fields": "custom-fields",
  "custom fields": "custom-fields",
  "pipeline-stages": "pipeline-stages",
  pipelines: "pipeline-stages",
  tags: "tags",
  campaigns: "campaigns",
};

export function normalizeObjectKey(raw: string): MigrationObjectKey | null {
  const key = raw.trim().toLowerCase();
  return OBJECT_KEY_ALIASES[key] ?? null;
}

/**
 * Prefill migration planner from CRMDecisionProfile + Implementation Plan + TCO.
 * Does not invent product import capabilities.
 */
export function prefillMigrationFromContext(
  profile: CrmDecisionProfile | null,
  implementationPlan?: CrmImplementationPlan | null,
  tcoSession?: TCOSession | null,
): MigrationPrefill {
  const scenario = tcoSession?.scenarios.find(
    (s) => s.id === tcoSession.activeScenarioId,
  );

  const summary: string[] = [];
  if (profile?.businessContext.currentState) {
    summary.push(`Current state: ${profile.businessContext.currentState}`);
  }
  if (profile?.businessContext.crmUserCount) {
    summary.push(`Users: ${profile.businessContext.crmUserCount}`);
  }
  if (profile?.implementation.migrationComplexity) {
    summary.push(
      `Profile migration complexity: ${profile.implementation.migrationComplexity}`,
    );
  }
  if (implementationPlan?.scope.migrationSource) {
    summary.push(
      `Implementation migration source: ${implementationPlan.scope.migrationSource}`,
    );
  }
  if (profile?.selectedProductId || implementationPlan?.productId) {
    summary.push(
      `Selected: ${implementationPlan?.productName ?? profile?.selectedProductId}`,
    );
  }

  return {
    productId: implementationPlan?.productId ?? profile?.selectedProductId,
    productName: implementationPlan?.productName,
    users: implementationPlan?.scope.users ?? profile?.businessContext.crmUserCount,
    teamLabels:
      implementationPlan?.scope.teamLabels?.length
        ? implementationPlan.scope.teamLabels
        : (profile?.businessContext.teamIds ?? []),
    migrationComplexity: profile?.implementation.migrationComplexity,
    currentState: profile?.businessContext.currentState,
    implementationMigrationSource: implementationPlan?.scope.migrationSource,
    implementationMigrationObjects:
      implementationPlan?.scope.migrationObjects ?? [],
    tcoMigrationNeeded: scenario?.migration.needed,
    tcoMigrationScopes: scenario?.migration.scopes ?? [],
    targetGoLive: implementationPlan?.targetGoLive,
    hasProfile: Boolean(profile),
    hasImplementationPlan: Boolean(implementationPlan),
    hasTcoSession: Boolean(tcoSession),
    profileSummary: summary,
  };
}

function migrationTypeFromContext(prefill: MigrationPrefill): CrmMigrationPlan["migrationType"] {
  if (prefill.implementationMigrationSource === "multiple-systems") {
    return "multiple-systems";
  }
  if (prefill.implementationMigrationSource === "spreadsheet") {
    return "spreadsheet";
  }
  if (prefill.implementationMigrationSource === "existing-crm") {
    return "existing-crm";
  }
  if (prefill.currentState === "multiple-tools") return "multiple-systems";
  if (prefill.currentState === "spreadsheet") return "spreadsheet";
  if (prefill.currentState === "existing-crm") return "existing-crm";
  return "unknown";
}

function defaultSourceFromPrefill(
  prefill: MigrationPrefill,
): CrmMigrationPlan["sourceSystems"] {
  const type = migrationTypeFromContext(prefill);
  if (type === "spreadsheet") {
    return [
      {
        id: "src-spreadsheet",
        name: "Spreadsheet tracker",
        type: "spreadsheet",
        exportAvailable: "unknown",
        apiAvailable: "no",
        formatKnown: "unknown",
      },
    ];
  }
  if (type === "existing-crm") {
    return [
      {
        id: "src-existing-crm",
        name: "Existing CRM",
        type: "existing-crm",
        exportAvailable: "unknown",
        apiAvailable: "unknown",
        formatKnown: "unknown",
      },
    ];
  }
  if (type === "multiple-systems") {
    return [
      {
        id: "src-crm",
        name: "Existing CRM",
        type: "existing-crm",
        exportAvailable: "unknown",
        apiAvailable: "unknown",
        formatKnown: "unknown",
      },
      {
        id: "src-sheets",
        name: "Spreadsheet tracker",
        type: "spreadsheet",
        exportAvailable: "unknown",
        apiAvailable: "no",
        formatKnown: "unknown",
      },
    ];
  }
  return [];
}

function objectKeysFromPrefill(prefill: MigrationPrefill): MigrationObjectKey[] {
  const fromImpl = prefill.implementationMigrationObjects
    .map(normalizeObjectKey)
    .filter((k): k is MigrationObjectKey => Boolean(k));
  const fromTco = prefill.tcoMigrationScopes
    .map(normalizeObjectKey)
    .filter((k): k is MigrationObjectKey => Boolean(k));
  const merged = [...new Set([...fromImpl, ...fromTco])];
  if (merged.length) return merged;
  return ["contacts", "companies", "deals"];
}

/**
 * Seed a plan from shared context. Safe defaults only — unknowns stay explicit.
 */
export function seedPlanFromContext(
  prefill: MigrationPrefill,
  existing?: CrmMigrationPlan | null,
  now: string = new Date().toISOString(),
): CrmMigrationPlan {
  const base = existing ?? createEmptyCrmMigrationPlan(now);
  const sources =
    base.sourceSystems.length > 0
      ? base.sourceSystems
      : defaultSourceFromPrefill(prefill);
  const primarySourceId = sources[0]?.id ?? "src-default";

  const objectKeys = objectKeysFromPrefill(prefill);
  const objects =
    base.objects.length > 0
      ? base.objects
      : objectKeys.map((key, index) => ({
          id: `obj-${key}-${index}`,
          sourceSystemId: primarySourceId,
          objectKey: key,
          sourceObjectLabel: key.replace(/-/g, " "),
          priority:
            key === "contacts" || key === "companies" || key === "deals"
              ? ("must-migrate" as const)
              : ("unknown" as const),
          historyDepth: "unknown" as const,
          status: "not-started" as const,
          required: true,
        }));

  const vendorNeutral = !prefill.productId;

  return {
    ...base,
    targetProductId: prefill.productId ?? base.targetProductId,
    targetProductName: prefill.productName ?? base.targetProductName,
    vendorNeutral,
    migrationType: migrationTypeFromContext(prefill),
    sourceSystems: sources,
    objects,
    targetGoLive: prefill.targetGoLive ?? base.targetGoLive,
    decisionProfileUpdatedAt: prefill.hasProfile
      ? now
      : base.decisionProfileUpdatedAt,
    implementationPlanUpdatedAt: prefill.hasImplementationPlan
      ? now
      : base.implementationPlanUpdatedAt,
    tcoSessionUpdatedAt: prefill.hasTcoSession
      ? now
      : base.tcoSessionUpdatedAt,
    assumptions: [
      ...base.assumptions,
      ...(prefill.hasProfile
        ? []
        : ["No CRMDecisionProfile loaded — answers entered manually."]),
      "Product-specific import support is not assumed unless researched.",
      "SoftwareGlimpse plans the migration; it does not execute data movement.",
    ].filter((v, i, arr) => arr.indexOf(v) === i),
    updatedAt: now,
  };
}

/** Map profile/impl complexity into TCO migration.needed suggestion. */
export function complexityToTcoNeeded(
  level: string | undefined,
): MigrationNeeded {
  switch (level) {
    case "none":
    case "low":
      return "basic";
    case "moderate":
    case "medium":
      return "moderate";
    case "high":
    case "very-high":
      return "complex";
    default:
      return "unknown";
  }
}
