import type { RoiInputs, RoiSession, TCOSession } from "@/domain";
import { createDefaultRoiInputs, createEmptyRoiSession } from "./persistence";

type CostDraft = {
  crmUsers?: number;
  billingPreference?: string;
  /** Optional annual licence estimate in major units if present. */
  estimatedAnnualMajor?: number;
  productName?: string;
  currency?: string;
};

/**
 * Prefill headcount / currency from Cost Calculator draft.
 * Does not invent implementation or benefit amounts.
 */
export function applyCostCalculatorHandoff(
  session: RoiSession,
  draft: CostDraft,
  opts?: { overwriteInvestment?: boolean },
): RoiSession {
  const inputs = session.inputs;
  const users = draft.crmUsers ?? inputs.currentState.crmUsers;
  let investment = inputs.investment;

  if (opts?.overwriteInvestment && draft.estimatedAnnualMajor != null) {
    investment = {
      ...investment,
      source: "cost-calculator",
      licencesMinor: Math.round(draft.estimatedAnnualMajor * 100),
      importedFromCostAt: new Date().toISOString(),
      importedProductName: draft.productName,
    };
  }

  return {
    ...session,
    inputs: {
      ...inputs,
      currency: (draft.currency as RoiInputs["currency"]) ?? inputs.currency,
      currentState: {
        ...inputs.currentState,
        crmUsers: users,
        salesReps: inputs.currentState.salesReps || Math.max(0, users - 2),
      },
      investment,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Import known TCO cost figures into ROI investment fields.
 * Requires explicit overwrite confirmation from the UI.
 */
export function applyTcoHandoff(
  session: RoiSession,
  tco: TCOSession,
  productResult: {
    productName: string;
    currency: string;
    year1SoftwareMinor?: number;
    implementationMinor?: number;
    migrationMinor?: number;
    integrationsMinor?: number;
    trainingMinor?: number;
    adminAnnualMinor?: number;
    supportAnnualMinor?: number;
    knownYear1Minor?: number;
    knownAnnualRecurringMinor?: number;
  },
): RoiSession {
  const active = tco.scenarios.find((s) => s.id === tco.activeScenarioId);
  return {
    ...session,
    inputs: {
      ...session.inputs,
      currency:
        (productResult.currency as RoiInputs["currency"]) ||
        active?.currency ||
        session.inputs.currency,
      horizonYears:
        active?.horizonYears === 1 ||
        active?.horizonYears === 2 ||
        active?.horizonYears === 3
          ? active.horizonYears
          : session.inputs.horizonYears,
      currentState: {
        ...session.inputs.currentState,
        crmUsers:
          active?.startingUsers ?? session.inputs.currentState.crmUsers,
      },
      investment: {
        ...session.inputs.investment,
        source: "tco",
        licencesMinor: productResult.year1SoftwareMinor ?? null,
        implementationPartnerMinor: productResult.implementationMinor ?? null,
        migrationMinor: productResult.migrationMinor ?? null,
        integrationsMinor: productResult.integrationsMinor ?? null,
        trainingMinor: productResult.trainingMinor ?? null,
        crmAdministrationMinor: productResult.adminAnnualMinor ?? null,
        premiumSupportMinor: productResult.supportAnnualMinor ?? null,
        importedFromCostAt: new Date().toISOString(),
        importedProductName: productResult.productName,
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

export function sessionFromPartialInputs(
  partial: Partial<RoiInputs>,
): RoiSession {
  return createEmptyRoiSession({
    inputs: createDefaultRoiInputs(partial),
  });
}
