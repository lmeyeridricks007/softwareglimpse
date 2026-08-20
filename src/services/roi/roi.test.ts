import { describe, expect, it } from "vitest";
import { computeRoi, computeRoiForScenario, costAvoidanceAnnual } from "./compute";
import {
  fixtureNegativeRoi,
  fixturePositiveProductivity,
  fixtureRevenueDisabled,
  fixtureSpeculativeRevenue,
  fixtureUnknownImplementation,
  fixtureZeroBenefits,
} from "./fixtures";
import { createDefaultRoiInputs } from "./persistence";

describe("CRM ROI calculator", () => {
  it("A: high cost + low benefit → negative ROI", () => {
    const result = computeRoi(fixtureNegativeRoi());
    expect(result.status).toBe("negative");
    expect(result.roiPercent).not.toBeNull();
    expect(result.roiPercent!).toBeLessThan(0);
    expect(result.netThreeYearValueMinor!).toBeLessThan(0);
  });

  it("B: moderate cost + measurable productivity → positive ROI", () => {
    const result = computeRoi(fixturePositiveProductivity());
    expect(result.status).toBe("complete");
    expect(result.annualBenefitMinor).toBeGreaterThan(0);
    expect(result.roiPercent).not.toBeNull();
    expect(result.roiPercent!).toBeGreaterThan(0);
    expect(result.paybackMonths).not.toBeNull();
    expect(result.paybackMonths!).toBeGreaterThan(0);
  });

  it("C: unknown implementation → incomplete (unless provisional)", () => {
    const incomplete = computeRoi(fixtureUnknownImplementation());
    expect(incomplete.status).toBe("incomplete");
    expect(incomplete.roiPercent).toBeNull();
    expect(incomplete.unknowns.some((u) => u.material)).toBe(true);

    const provisional = computeRoi({
      ...fixtureUnknownImplementation(),
      allowProvisional: true,
    });
    expect(provisional.status === "provisional" || provisional.status === "negative" || provisional.status === "complete").toBe(true);
    expect(provisional.statusReason).toMatch(/provisional|unknown/i);
  });

  it("D: revenue scenario disabled → ROI still works", () => {
    const result = computeRoi(fixtureRevenueDisabled());
    expect(result.benefitByCategory.find((c) => c.category === "revenue-scenario")?.annualMinor ?? 0).toBe(0);
    expect(result.annualBenefitMinor).toBeGreaterThan(0);
    expect(result.roiPercent).not.toBeNull();
  });

  it("E: all benefits zero → negative ROI", () => {
    const result = computeRoi(fixtureZeroBenefits());
    expect(result.annualBenefitMinor).toBe(0);
    expect(result.status).toBe("negative");
    expect(result.roiPercent!).toBeLessThan(0);
  });

  it("F: large speculative revenue → high result but scenario dependence visible", () => {
    const result = computeRoi(fixtureSpeculativeRevenue());
    const revenueShare =
      result.benefitByCategory.find((c) => c.category === "revenue-scenario")
        ?.sharePercent ?? 0;
    expect(revenueShare).toBeGreaterThanOrEqual(50);
    expect(result.assessment.revenueDependence).toBe("high");
    expect(result.assessment.benefitConfidence).toBe("low");
    expect(result.benefitByType.find((t) => t.assumptionType === "scenario")?.sharePercent ?? 0).toBeGreaterThan(40);
  });

  it("applies productivity realization factor", () => {
    const base = fixturePositiveProductivity();
    const full = computeRoi({
      ...base,
      productivity: { ...base.productivity, realizationFactor: 1 },
    });
    const half = computeRoi({
      ...base,
      productivity: { ...base.productivity, realizationFactor: 0.5 },
    });
    const fullProd = full.productivityRealizedAnnualMinor;
    const halfProd = half.productivityRealizedAnnualMinor;
    expect(halfProd).toBe(Math.round(fullProd * 0.5));
  });

  it("computes cost avoidance from elimination percent", () => {
    expect(
      costAvoidanceAnnual({
        id: "1",
        label: "Tool",
        currentAnnualMinor: 1_200_000,
        eliminationPercent: 50,
        included: true,
        assumptionType: "verified",
        confidence: "high",
      } as const),
    ).toBe(600_000);
  });

  it("win-rate scenario uses percentage-point improvement", () => {
    const inputs = createDefaultRoiInputs({
      investment: {
        source: "manual",
        licencesMinor: 100_000,
        implementationPartnerMinor: 0,
        internalLabour: [],
      },
      costRevenue: {
        costAvoidance: [],
        winRate: {
          enabled: true,
          included: true,
          annualQualifiedOpportunities: 100,
          currentWinRatePercent: 20,
          scenarioWinRatePercent: 21,
          contributionPerWinMinor: 10_000_00,
          valueBasis: "contribution",
          assumptionType: "scenario",
          confidence: "low",
        },
        conversion: { enabled: false },
        recovered: { enabled: false },
        capacity: { enabled: false, included: false },
      },
      productivity: {
        salesReps: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 0,
          included: false,
          assumptionType: "estimated",
          confidence: "medium",
        },
        managers: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 0,
          included: false,
          assumptionType: "estimated",
          confidence: "medium",
        },
        opsAdmin: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 0,
          included: false,
          assumptionType: "estimated",
          confidence: "medium",
        },
        realizationFactor: 0.5,
      },
    });
    const result = computeRoiForScenario(inputs, "base");
    // 100 opps × 1pp = 1 additional win × 10_000_00 = 1_000_000
    const winLine = result.benefitLines.find((l) => l.id === "win-rate");
    expect(winLine?.annualMinor).toBe(1_000_000);
  });

  it("does not invent win-rate improvement when blank", () => {
    const inputs = createDefaultRoiInputs({
      costRevenue: {
        costAvoidance: [],
        winRate: {
          enabled: true,
          included: true,
          annualQualifiedOpportunities: 100,
          currentWinRatePercent: 20,
          // scenarioWinRatePercent intentionally omitted
          contributionPerWinMinor: 10_000_00,
          valueBasis: "contribution",
          assumptionType: "scenario",
          confidence: "low",
        },
        conversion: { enabled: false },
        recovered: { enabled: false },
        capacity: { enabled: false, included: false },
      },
    });
    const result = computeRoiForScenario(inputs, "base");
    const winLine = result.benefitLines.find((l) => l.id === "win-rate");
    expect(winLine?.annualMinor).toBe(0);
  });

  it("invalid denominator when three-year cost is zero", () => {
    const inputs = createDefaultRoiInputs({
      investment: {
        source: "manual",
        licencesMinor: 0,
        implementationPartnerMinor: 0,
        internalLabour: [],
      },
    });
    const result = computeRoi(inputs);
    expect(result.threeYearTcoMinor).toBe(0);
    expect(result.roiPercent).toBeNull();
  });

  it("adoption ramp scales year benefits", () => {
    const base = fixturePositiveProductivity();
    const withRamp = computeRoi({
      ...base,
      adoption: {
        enabled: true,
        year1Percent: 50,
        year2Percent: 100,
        year3Percent: 100,
      },
    });
    const y1 = withRamp.cashFlow.find((c) => c.year === 1)!;
    const y2 = withRamp.cashFlow.find((c) => c.year === 2)!;
    expect(y1.benefitsMinor).toBe(Math.round(withRamp.annualBenefitMinor * 0.5));
    expect(y2.benefitsMinor).toBe(withRamp.annualBenefitMinor);
  });

  it("scenario comparison uses user-defined hours", () => {
    const result = computeRoi(fixturePositiveProductivity());
    const cons = result.scenarios.find((s) => s.key === "conservative")!;
    const base = result.scenarios.find((s) => s.key === "base")!;
    const up = result.scenarios.find((s) => s.key === "upside")!;
    expect(cons.annualBenefitMinor).toBeLessThan(base.annualBenefitMinor);
    expect(up.annualBenefitMinor).toBeGreaterThan(base.annualBenefitMinor);
  });

  it("break-even returns hours when hourly costs known", () => {
    const result = computeRoi(fixturePositiveProductivity());
    expect(result.breakEven.annualMeasurableBenefitMinor).not.toBeNull();
    expect(result.breakEven.hoursSavedPerUserWeek).not.toBeNull();
    expect(result.breakEven.hoursSavedPerUserWeek!).toBeGreaterThan(0);
  });

  it("3-year TCO = year1 + recurring × (horizon-1)", () => {
    const result = computeRoi(fixturePositiveProductivity());
    const y1 = result.year1InvestmentMinor!;
    const rec = result.annualRecurringMinor!;
    expect(result.threeYearTcoMinor).toBe(y1 + rec * 2);
  });

  it("uses main hours saved when scenario override key is absent", () => {
    const inputs = createDefaultRoiInputs({
      activeScenario: "upside",
      currentState: {
        salesReps: 10,
        managers: 0,
        opsAdminUsers: 0,
        crmUsers: 10,
        workingWeeksPerYear: 46,
        hourlyCosts: {
          salesRepMinor: 4000,
          deferHourlyCosts: false,
        },
        processHours: {
          salesRep: {
            dataEntry: 4,
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
        licencesMinor: 1_000_000,
        implementationPartnerMinor: 0,
        internalLabour: [],
      },
      productivity: {
        salesReps: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 1,
          included: true,
          assumptionType: "estimated",
          confidence: "medium",
          // conservative only — upside key absent must fall back to 1 hr
          scenarioHours: { conservative: 0.25 },
        },
        managers: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 0,
          included: false,
          assumptionType: "estimated",
          confidence: "medium",
        },
        opsAdmin: {
          inputMode: "hours-saved",
          hoursSavedPerWeek: 0,
          included: false,
          assumptionType: "estimated",
          confidence: "medium",
        },
        realizationFactor: 1,
        realizationCustom: false,
      },
    });
    const upside = computeRoiForScenario(inputs, "upside");
    const conservative = computeRoiForScenario(inputs, "conservative");
    // 10 × 1 × 46 × 4000 = 1_840_000
    expect(upside.annualBenefitMinor).toBe(1_840_000);
    // 10 × 0.25 × 46 × 4000 = 460_000
    expect(conservative.annualBenefitMinor).toBe(460_000);
  });

  it("marks ROI incomplete when no investment costs are entered", () => {
    const result = computeRoi(createDefaultRoiInputs());
    expect(result.status).toBe("incomplete");
    expect(result.year1InvestmentMinor).toBeNull();
    expect(result.roiPercent).toBeNull();
  });
});
