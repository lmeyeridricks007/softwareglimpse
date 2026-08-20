import { describe, expect, it } from "vitest";
import { fromMajor } from "@/domain";
import { computeMigrationCost, applyScopeReductions } from "./compute";
import { computeComplexityProfile, historicalActivityImpact } from "./complexity";
import { createEmptyMigrationCostInputs } from "./persistence";
import {
  fixtureDirtyData,
  fixtureNoHistory,
  fixturePipedriveHubSpot,
  fixtureSalesforceDynamics,
  fixtureSpreadsheetSimple,
  fixtureUnknownPartner,
} from "./fixtures";

describe("computeMigrationCost", () => {
  it("treats empty session as incomplete with no invented totals", () => {
    const result = computeMigrationCost(createEmptyMigrationCostInputs());
    expect(result.status).toBe("incomplete");
    expect(result.expectedTotalMinor).toBeNull();
    expect(result.knownMinor).toBe(0);
  });

  it("sums external fixed quote", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.migrationSpecificQuoteMinor = fromMajor(20_000, "EUR").amountMinor;
    const result = computeMigrationCost(inputs);
    expect(result.externalMinor).toBe(fromMajor(20_000, "EUR").amountMinor);
    expect(result.expectedTotalMinor).toBe(fromMajor(20_000, "EUR").amountMinor);
  });

  it("computes rate × days", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.partnerDayRateMinor = fromMajor(1_000, "EUR").amountMinor;
    inputs.approach.estimatedDays = 10;
    const result = computeMigrationCost(inputs);
    expect(result.externalMinor).toBe(fromMajor(10_000, "EUR").amountMinor);
  });

  it("computes internal people × hours × rate", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) =>
      r.id === "pm"
        ? {
            ...r,
            people: 2,
            hoursPerPerson: 10,
            hourlyCostMinor: fromMajor(50, "EUR").amountMinor,
          }
        : r,
    );
    const result = computeMigrationCost(inputs);
    expect(result.internalLabourMinor).toBe(fromMajor(1_000, "EUR").amountMinor);
  });

  it("keeps internal hours without rate as unknown cost", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) =>
      r.id === "pm"
        ? { ...r, people: 1, hoursPerPerson: 40 }
        : r,
    );
    const result = computeMigrationCost(inputs);
    expect(result.internalLabourMinor).toBeNull();
    expect(result.unknowns.some((u) => u.id === "internal-rates")).toBe(true);
    expect(result.internalHoursTotal).toBe(40);
  });

  it("includes tooling cost", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.tooling = [
      {
        id: "etl",
        tool: "ETL tool",
        costMinor: fromMajor(500, "EUR").amountMinor,
        billing: "monthly",
        durationMonths: 3,
        include: true,
      },
    ];
    const result = computeMigrationCost(inputs);
    expect(result.toolingMinor).toBe(fromMajor(1_500, "EUR").amountMinor);
  });

  it("sums test cycles", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.testingCutover.testing.cycles = [
      {
        id: "t1",
        label: "Test 1",
        partnerCostMinor: fromMajor(2_000, "EUR").amountMinor,
        include: true,
      },
      {
        id: "t2",
        label: "Test 2",
        partnerCostMinor: fromMajor(3_000, "EUR").amountMinor,
        toolCostMinor: fromMajor(500, "EUR").amountMinor,
        include: true,
      },
    ];
    const result = computeMigrationCost(inputs);
    expect(result.externalMinor).toBe(fromMajor(5_000, "EUR").amountMinor);
    expect(result.toolingMinor).toBe(fromMajor(500, "EUR").amountMinor);
  });

  it("includes hypercare and training when classified as migration", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.testingCutover.hypercare.externalSupportCostMinor =
      fromMajor(4_000, "EUR").amountMinor;
    inputs.testingCutover.training.trainingCostMinor =
      fromMajor(3_000, "EUR").amountMinor;
    inputs.testingCutover.training.classification = "migration";
    const result = computeMigrationCost(inputs);
    expect(result.expectedTotalMinor).toBe(fromMajor(7_000, "EUR").amountMinor);
  });

  it("excludes training when classified as implementation", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.testingCutover.training.trainingCostMinor =
      fromMajor(3_000, "EUR").amountMinor;
    inputs.testingCutover.training.classification = "implementation";
    const result = computeMigrationCost(inputs);
    expect(result.expectedTotalMinor).toBeNull();
  });

  it("applies contingency only when percent > 0 and base exists", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.migrationSpecificQuoteMinor = fromMajor(10_000, "EUR").amountMinor;
    inputs.testingCutover.contingency.percent = 10;
    inputs.testingCutover.contingency.applyToExternal = true;
    const result = computeMigrationCost(inputs);
    expect(result.contingencyMinor).toBe(fromMajor(1_000, "EUR").amountMinor);
    expect(result.expectedTotalMinor).toBe(fromMajor(11_000, "EUR").amountMinor);
  });

  it("does not invent contingency when percent is 0", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.migrationSpecificQuoteMinor = fromMajor(10_000, "EUR").amountMinor;
    inputs.testingCutover.contingency.percent = 0;
    const result = computeMigrationCost(inputs);
    expect(result.contingencyMinor).toBe(0);
  });

  it("builds low/expected/high only when user supplies range", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.fieldMapping.externalQuoteMinor = fromMajor(8_000, "EUR").amountMinor;
    inputs.fieldMapping.range = {
      lowMinor: fromMajor(6_000, "EUR").amountMinor,
      expectedMinor: fromMajor(8_000, "EUR").amountMinor,
      highMinor: fromMajor(12_000, "EUR").amountMinor,
    };
    const result = computeMigrationCost(inputs);
    expect(result.hasUserRange).toBe(true);
    expect(result.lowTotalMinor).toBe(fromMajor(6_000, "EUR").amountMinor);
    expect(result.highTotalMinor).toBe(fromMajor(12_000, "EUR").amountMinor);
  });

  it("does not manufacture a range from a single number", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.migrationSpecificQuoteMinor = fromMajor(9_000, "EUR").amountMinor;
    const result = computeMigrationCost(inputs);
    expect(result.hasUserRange).toBe(false);
    expect(result.lowTotalMinor).toBeNull();
    expect(result.highTotalMinor).toBeNull();
  });

  it("excludes optional downtime from base total", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.approach.migrationSpecificQuoteMinor = fromMajor(5_000, "EUR").amountMinor;
    inputs.testingCutover.downtime = {
      include: true,
      hours: 8,
      affectedUsers: 10,
      hourlyBusinessImpactMinor: fromMajor(100, "EUR").amountMinor,
    };
    const result = computeMigrationCost(inputs);
    expect(result.expectedTotalMinor).toBe(fromMajor(5_000, "EUR").amountMinor);
    expect(result.optionalMinor).toBe(fromMajor(8_000, "EUR").amountMinor);
  });

  it("applies scope reductions only when user supplies reduction amounts", () => {
    const inputs = fixturePipedriveHubSpot();
    inputs.scenarios.scopeToggles = inputs.scenarios.scopeToggles.map((t) =>
      t.id === "exclude-historical-emails"
        ? {
            ...t,
            enabled: true,
            reductionMinor: fromMajor(5_000, "EUR").amountMinor,
          }
        : t,
    );
    const result = computeMigrationCost(inputs);
    const reduced = applyScopeReductions(
      result.expectedTotalMinor,
      result.scopeReductions,
    );
    expect(reduced).toBe(
      (result.expectedTotalMinor ?? 0) - fromMajor(5_000, "EUR").amountMinor,
    );
  });

  it("models phased migration allocated costs", () => {
    const inputs = createEmptyMigrationCostInputs();
    inputs.scenarios.phases = [
      {
        id: "p1",
        label: "Phase 1",
        objectIds: ["contacts"],
        integrationIds: [],
        includeHistorical: false,
        includeCustomObjects: false,
        allocatedCostMinor: fromMajor(40_000, "EUR").amountMinor,
      },
      {
        id: "p2",
        label: "Phase 2",
        objectIds: ["emails"],
        integrationIds: [],
        includeHistorical: true,
        includeCustomObjects: true,
        allocatedCostMinor: fromMajor(55_000, "EUR").amountMinor,
      },
    ];
    const result = computeMigrationCost(inputs);
    expect(result.phaseTotals[0]?.expectedMinor).toBe(
      fromMajor(40_000, "EUR").amountMinor,
    );
    expect(result.phaseTotals[1]?.expectedMinor).toBe(
      fromMajor(55_000, "EUR").amountMinor,
    );
  });
});

describe("complexity scenarios", () => {
  it("A: spreadsheet simple → low complexity", () => {
    const profile = computeComplexityProfile(fixtureSpreadsheetSimple());
    expect(["low", "moderate"]).toContain(profile.overall);
  });

  it("B: Pipedrive → HubSpot → moderate/high", () => {
    const profile = computeComplexityProfile(fixturePipedriveHubSpot());
    expect(["moderate", "high", "very-high"]).toContain(profile.overall);
  });

  it("C: Salesforce → Dynamics → very high", () => {
    const profile = computeComplexityProfile(fixtureSalesforceDynamics());
    expect(profile.overall).toBe("very-high");
  });

  it("D: unknown partner → provisional / incomplete with unknowns", () => {
    const result = computeMigrationCost(fixtureUnknownPartner());
    expect(["provisional", "incomplete"]).toContain(result.status);
    expect(result.unknowns.some((u) => u.id === "partner-cost")).toBe(true);
  });

  it("E: no historical data reduces history impact", () => {
    expect(historicalActivityImpact(fixtureNoHistory())).toBe("low");
    expect(historicalActivityImpact(fixturePipedriveHubSpot())).not.toBe("low");
  });

  it("F: heavy dirty data elevates data-quality dimension", () => {
    const profile = computeComplexityProfile(fixtureDirtyData());
    const dq = profile.dimensions.find((d) => d.id === "data-quality");
    expect(["high", "very-high"]).toContain(dq?.band);
  });
});
