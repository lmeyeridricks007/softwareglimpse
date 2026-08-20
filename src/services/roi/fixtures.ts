import type { RoiInputs } from "@/domain";
import { createDefaultRoiInputs } from "./persistence";

/**
 * Deterministic fixtures for ROI engine tests.
 * Amounts are in minor units (cents). Always go through createDefaultRoiInputs
 * so Zod defaults fill required fields.
 */

/** A — High cost + low benefit → negative ROI */
export function fixtureNegativeRoi(): RoiInputs {
  return createDefaultRoiInputs({
    analysisName: "Fixture A — Negative",
    currentState: {
      crmUsers: 20,
      salesReps: 15,
      managers: 2,
      opsAdminUsers: 3,
      workingWeeksPerYear: 46,
      hourlyCosts: {
        salesRepMinor: 4000,
        managerMinor: 5500,
        opsAdminMinor: 3500,
        deferHourlyCosts: false,
      },
      processHours: {
        salesRep: {
          dataEntry: 1,
          searching: 0,
          reporting: 0,
          duplicateAdmin: 0,
        },
        manager: {
          pipelineReporting: 0,
          forecasting: 0,
          reconciliation: 0,
        },
        opsAdmin: {
          administration: 0,
          reporting: 0,
          dataCleanup: 0,
          leadRouting: 0,
        },
      },
      softwareCosts: [],
    },
    investment: {
      source: "manual",
      licencesMinor: 5_000_000,
      implementationPartnerMinor: 8_000_000,
      migrationMinor: 2_000_000,
      integrationsMinor: 1_500_000,
      trainingMinor: 500_000,
      crmAdministrationMinor: 1_000_000,
      internalLabour: [],
    },
    productivity: {
      salesReps: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0.1,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      managers: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      opsAdmin: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      realizationFactor: 0.5,
      realizationCustom: false,
    },
    costRevenue: {
      costAvoidance: [],
      winRate: { enabled: false },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
    },
  });
}

/** B — Moderate cost + measurable productivity → positive ROI */
export function fixturePositiveProductivity(): RoiInputs {
  return createDefaultRoiInputs({
    analysisName: "Fixture B — Positive productivity",
    currentState: {
      crmUsers: 20,
      salesReps: 20,
      managers: 2,
      opsAdminUsers: 2,
      workingWeeksPerYear: 46,
      hourlyCosts: {
        salesRepMinor: 4200,
        managerMinor: 5500,
        opsAdminMinor: 3500,
        deferHourlyCosts: false,
      },
      processHours: {
        salesRep: {
          dataEntry: 2,
          searching: 1,
          reporting: 1,
          duplicateAdmin: 0,
        },
        manager: {
          pipelineReporting: 2,
          forecasting: 1,
          reconciliation: 1,
        },
        opsAdmin: {
          administration: 3,
          reporting: 2,
          dataCleanup: 1,
          leadRouting: 1,
        },
      },
      softwareCosts: [],
    },
    investment: {
      source: "manual",
      licencesMinor: 2_400_000,
      addOnsMinor: 0,
      implementationPartnerMinor: 1_500_000,
      migrationMinor: 400_000,
      integrationsMinor: 300_000,
      trainingMinor: 200_000,
      crmAdministrationMinor: 600_000,
      premiumSupportMinor: 200_000,
      internalLabour: [],
    },
    productivity: {
      salesReps: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 1,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
        scenarioHours: { conservative: 0.5, base: 1, upside: 1.5 },
      },
      managers: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 1,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      opsAdmin: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 2,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      realizationFactor: 0.75,
      realizationCustom: false,
    },
    costRevenue: {
      costAvoidance: [
        {
          id: "report-tool",
          label: "Reporting tool",
          currentAnnualMinor: 1_200_000,
          eliminationPercent: 100,
          included: true,
          assumptionType: "verified",
          confidence: "high",
        },
      ],
      winRate: { enabled: false },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
    },
  });
}

/** C — Unknown implementation cost → incomplete / provisional */
export function fixtureUnknownImplementation(): RoiInputs {
  const base = fixturePositiveProductivity();
  return createDefaultRoiInputs({
    ...base,
    analysisName: "Fixture C — Unknown implementation",
    investment: {
      ...base.investment,
      implementationPartnerMinor: null,
      integrationsMinor: null,
    },
    allowProvisional: false,
  });
}

/** D — Revenue scenario disabled → ROI still works */
export function fixtureRevenueDisabled(): RoiInputs {
  const base = fixturePositiveProductivity();
  return createDefaultRoiInputs({
    ...base,
    analysisName: "Fixture D — Revenue disabled",
    costRevenue: {
      ...base.costRevenue,
      winRate: { enabled: false },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
    },
  });
}

/** E — All benefits zero → negative ROI */
export function fixtureZeroBenefits(): RoiInputs {
  const base = fixturePositiveProductivity();
  return createDefaultRoiInputs({
    ...base,
    analysisName: "Fixture E — Zero benefits",
    productivity: {
      salesReps: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      managers: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      opsAdmin: {
        inputMode: "hours-saved",
        hoursSavedPerWeek: 0,
        included: true,
        assumptionType: "estimated",
        confidence: "medium",
      },
      realizationFactor: 0.5,
      realizationCustom: false,
    },
    costRevenue: {
      costAvoidance: [],
      winRate: { enabled: false },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
    },
  });
}

/** F — Large speculative revenue → high result, low confidence / scenario dependence */
export function fixtureSpeculativeRevenue(): RoiInputs {
  const base = fixturePositiveProductivity();
  return createDefaultRoiInputs({
    ...base,
    analysisName: "Fixture F — Speculative revenue",
    productivity: {
      ...base.productivity,
      salesReps: {
        ...base.productivity.salesReps,
        hoursSavedPerWeek: 0.2,
      },
      managers: {
        ...base.productivity.managers,
        hoursSavedPerWeek: 0,
      },
      opsAdmin: {
        ...base.productivity.opsAdmin,
        hoursSavedPerWeek: 0,
      },
    },
    costRevenue: {
      costAvoidance: [],
      winRate: {
        enabled: true,
        included: true,
        annualQualifiedOpportunities: 500,
        currentWinRatePercent: 20,
        scenarioWinRatePercent: 28,
        contributionPerWinMinor: 5_000_000,
        valueBasis: "contribution",
        assumptionType: "scenario",
        confidence: "low",
        scenarioImprovementPp: {
          conservative: 0,
          base: 8,
          upside: 12,
        },
      },
      conversion: { enabled: false },
      recovered: { enabled: false },
      capacity: { enabled: false, included: false },
    },
  });
}
