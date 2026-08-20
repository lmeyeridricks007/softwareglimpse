import {
  CRM_ROI_STORAGE_KEY,
  CRM_ROI_BUSINESS_CASE_HANDOFF_KEY,
  ROI_SESSION_VERSION,
  RoiHandoffPayloadSchema,
  RoiInputsSchema,
  RoiSessionSchema,
  type RoiHandoffPayload,
  type RoiInputs,
  type RoiSession,
} from "@/domain";
import type { z } from "zod";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

type InputsInput = z.input<typeof RoiInputsSchema>;

export function createDefaultCostAvoidanceRows() {
  return [
    {
      id: newId("avoid"),
      label: "Existing CRM / tools being replaced",
      included: true,
      eliminationPercent: 100,
      assumptionType: "estimated" as const,
      confidence: "medium" as const,
    },
    {
      id: newId("avoid"),
      label: "Reporting tool",
      included: false,
      eliminationPercent: 100,
      assumptionType: "estimated" as const,
      confidence: "medium" as const,
    },
    {
      id: newId("avoid"),
      label: "Sales engagement tool",
      included: false,
      eliminationPercent: 100,
      assumptionType: "estimated" as const,
      confidence: "medium" as const,
    },
    {
      id: newId("avoid"),
      label: "Manual service / outsourcing",
      included: false,
      eliminationPercent: 100,
      assumptionType: "estimated" as const,
      confidence: "medium" as const,
    },
  ];
}

export function createDefaultSoftwareCostRows() {
  return [
    {
      id: newId("sw"),
      label: "Current CRM",
      include: false,
      billing: "annual" as const,
    },
    {
      id: newId("sw"),
      label: "Spreadsheets / tools being replaced",
      include: false,
      billing: "annual" as const,
    },
    {
      id: newId("sw"),
      label: "Sales engagement tools",
      include: false,
      billing: "annual" as const,
    },
    {
      id: newId("sw"),
      label: "Reporting tools",
      include: false,
      billing: "annual" as const,
    },
    {
      id: newId("sw"),
      label: "Integration tools",
      include: false,
      billing: "annual" as const,
    },
    {
      id: newId("sw"),
      label: "Other duplicate tools",
      include: false,
      billing: "annual" as const,
    },
  ];
}

export function createDefaultRoiInputs(
  overrides: Partial<InputsInput> = {},
): RoiInputs {
  return RoiInputsSchema.parse({
    analysisName: overrides.analysisName ?? "My CRM ROI",
    currency: overrides.currency ?? "EUR",
    horizonYears: overrides.horizonYears ?? 3,
    activeScenario: overrides.activeScenario ?? "base",
    currentState: {
      crmUsers: 10,
      salesReps: 8,
      managers: 1,
      opsAdminUsers: 1,
      hourlyCosts: { deferHourlyCosts: false },
      workingWeeksPerYear: 46,
      softwareCosts: createDefaultSoftwareCostRows(),
      ...(overrides.currentState ?? {}),
    },
    investment: {
      source: "manual",
      internalLabour: [],
      ...(overrides.investment ?? {}),
    },
    productivity: {
      salesReps: {
        inputMode: "reduction-percent",
        assumptionType: "estimated",
        confidence: "medium",
        included: true,
      },
      managers: {
        inputMode: "reduction-percent",
        assumptionType: "estimated",
        confidence: "medium",
        included: true,
      },
      opsAdmin: {
        inputMode: "reduction-percent",
        assumptionType: "estimated",
        confidence: "medium",
        included: true,
      },
      realizationFactor: 0.5,
      ...(overrides.productivity ?? {}),
    },
    costRevenue: {
      costAvoidance: createDefaultCostAvoidanceRows(),
      winRate: { enabled: false },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
      ...(overrides.costRevenue ?? {}),
    },
    adoption: {
      enabled: false,
      year1Percent: 60,
      year2Percent: 85,
      year3Percent: 100,
      ...(overrides.adoption ?? {}),
    },
    assumptionOverrides: overrides.assumptionOverrides ?? [],
    allowProvisional: overrides.allowProvisional ?? false,
  });
}

export function createEmptyRoiSession(
  overrides: Partial<RoiSession> = {},
): RoiSession {
  const now = new Date().toISOString();
  return RoiSessionSchema.parse({
    version: ROI_SESSION_VERSION,
    wizardStepId: "current-state",
    maxReachableStepIndex: 0,
    inputs: createDefaultRoiInputs(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

export function loadCrmRoiSession(): RoiSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_ROI_STORAGE_KEY);
    if (!raw) return null;
    return RoiSessionSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCrmRoiSession(session: RoiSession): boolean {
  if (!canUseStorage()) return false;
  try {
    const next = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CRM_ROI_STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function resetCrmRoiSession(): RoiSession {
  const empty = createEmptyRoiSession();
  saveCrmRoiSession(empty);
  return empty;
}

export function saveBusinessCaseHandoff(payload: RoiHandoffPayload): boolean {
  if (!canUseStorage()) return false;
  try {
    localStorage.setItem(
      CRM_ROI_BUSINESS_CASE_HANDOFF_KEY,
      JSON.stringify(payload),
    );
    return true;
  } catch {
    return false;
  }
}

export function loadBusinessCaseHandoff(): RoiHandoffPayload | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_ROI_BUSINESS_CASE_HANDOFF_KEY);
    if (!raw) return null;
    return RoiHandoffPayloadSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function clearBusinessCaseHandoff(): void {
  if (!canUseStorage()) return;
  localStorage.removeItem(CRM_ROI_BUSINESS_CASE_HANDOFF_KEY);
}

export { CRM_ROI_STORAGE_KEY, CRM_ROI_BUSINESS_CASE_HANDOFF_KEY };
