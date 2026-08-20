import {
  TCOScenarioSchema,
  TCOSessionSchema,
  TCO_SESSION_VERSION,
  type TCOScenario,
  type TCOSession,
} from "@/domain";
import type { z } from "zod";

export const CRM_TCO_STORAGE_KEY = "sg-crm-tco-v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

type ScenarioInput = z.input<typeof TCOScenarioSchema>;

export function createDefaultScenario(
  overrides: Partial<ScenarioInput> = {},
): TCOScenario {
  return TCOScenarioSchema.parse({
    id: overrides.id ?? newId("scenario"),
    name: overrides.name ?? "Base case",
    productIds: overrides.productIds ?? [],
    horizonYears: overrides.horizonYears ?? 3,
    startingUsers: overrides.startingUsers ?? 10,
    growthMode: overrides.growthMode ?? "flat",
    annualGrowthPercent: overrides.annualGrowthPercent,
    customSeats: overrides.customSeats,
    billingPreference: overrides.billingPreference ?? "annual",
    negotiatedDiscountPercent: overrides.negotiatedDiscountPercent ?? 0,
    planSelections: overrides.planSelections ?? {},
    currency: overrides.currency ?? "EUR",
    implementation: overrides.implementation ?? { approach: "unsure" },
    migration: overrides.migration ?? { needed: "none", scopes: [] },
    integrations: overrides.integrations ?? [],
    training: overrides.training ?? { method: "mixed" },
    administration: overrides.administration ?? {},
    support: overrides.support ?? {},
    customCosts: overrides.customCosts ?? [],
  });
}

export function createEmptyTcoSession(
  overrides: Partial<TCOSession> = {},
): TCOSession {
  const now = new Date().toISOString();
  const scenario = createDefaultScenario();
  const scenarios = overrides.scenarios ?? [scenario];
  return TCOSessionSchema.parse({
    version: TCO_SESSION_VERSION,
    categorySlug: "crm",
    decisionProfileLinked: false,
    wizardStepId: "products",
    createdAt: now,
    updatedAt: now,
    ...overrides,
    scenarios,
    activeScenarioId:
      overrides.activeScenarioId ?? scenarios[0]?.id ?? scenario.id,
  });
}

export function loadCrmTcoSession(): TCOSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_TCO_STORAGE_KEY);
    if (!raw) return null;
    return TCOSessionSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCrmTcoSession(session: TCOSession): boolean {
  if (!canUseStorage()) return false;
  try {
    const next = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CRM_TCO_STORAGE_KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function resetCrmTcoSession(): TCOSession {
  const empty = createEmptyTcoSession();
  saveCrmTcoSession(empty);
  return empty;
}

export function getActiveScenario(session: TCOSession): TCOScenario {
  return (
    session.scenarios.find((s) => s.id === session.activeScenarioId) ??
    session.scenarios[0]!
  );
}

export function updateActiveScenario(
  session: TCOSession,
  patch: Partial<ScenarioInput>,
): TCOSession {
  const active = getActiveScenario(session);
  const nextScenario = TCOScenarioSchema.parse({ ...active, ...patch });
  return {
    ...session,
    scenarios: session.scenarios.map((s) =>
      s.id === active.id ? nextScenario : s,
    ),
    updatedAt: new Date().toISOString(),
  };
}

/** Duplicate active scenario for lean/complex comparison — user edits after. */
export function duplicateScenario(
  session: TCOSession,
  name?: string,
): TCOSession {
  const active = getActiveScenario(session);
  const copy = createDefaultScenario({
    ...active,
    id: newId("scenario"),
    name: name ?? `${active.name} (copy)`,
  });
  return {
    ...session,
    scenarios: [...session.scenarios, copy],
    activeScenarioId: copy.id,
    updatedAt: new Date().toISOString(),
  };
}

export function deleteScenario(
  session: TCOSession,
  scenarioId: string,
): TCOSession {
  if (session.scenarios.length <= 1) return session;
  const scenarios = session.scenarios.filter((s) => s.id !== scenarioId);
  const activeScenarioId =
    session.activeScenarioId === scenarioId
      ? scenarios[0]!.id
      : session.activeScenarioId;
  return {
    ...session,
    scenarios,
    activeScenarioId,
    updatedAt: new Date().toISOString(),
  };
}
