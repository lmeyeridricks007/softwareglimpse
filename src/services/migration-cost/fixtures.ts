import { fromMajor } from "@/domain";
import { createEmptyMigrationCostInputs } from "./persistence";
import type { McInputs } from "@/domain";

/** Scenario A: spreadsheet → simple CRM */
export function fixtureSpreadsheetSimple(): McInputs {
  const inputs = createEmptyMigrationCostInputs();
  inputs.currentSystem = {
    ...inputs.currentSystem,
    projectName: "Spreadsheet migration",
    sourceType: "spreadsheets",
    targetCrm: "HubSpot",
    migrationType: "simple",
    cutoverApproach: "one-time",
  };
  inputs.dataScope.objects = inputs.dataScope.objects.map((o) => {
    if (["contacts", "accounts", "deals"].includes(o.id)) {
      return {
        ...o,
        migrate: true,
        recordVolumeBand: "under-10k",
        historyDepth: "current-only",
        customFieldsApprox: 5,
      };
    }
    return o;
  });
  inputs.approach.migrationSpecificQuoteMinor = fromMajor(5000, "EUR").amountMinor;
  inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) => {
    if (r.id === "crm-admin") {
      return {
        ...r,
        people: 1,
        hoursPerPerson: 40,
        hourlyCostMinor: fromMajor(50, "EUR").amountMinor,
      };
    }
    return r;
  });
  inputs.testingCutover.contingency.percent = 0;
  return inputs;
}

/** Scenario B: Pipedrive → HubSpot moderate */
export function fixturePipedriveHubSpot(): McInputs {
  const inputs = createEmptyMigrationCostInputs();
  inputs.currentSystem = {
    ...inputs.currentSystem,
    projectName: "Pipedrive to HubSpot",
    sourceType: "existing-crm",
    currentPlatform: "Pipedrive",
    targetCrm: "HubSpot",
    migrationType: "moderate",
  };
  inputs.dataScope.objects = inputs.dataScope.objects.map((o) => {
    if (["contacts", "accounts", "deals", "activities", "emails"].includes(o.id)) {
      return {
        ...o,
        migrate: true,
        recordVolumeBand: "10k-50k",
        historyDepth: "3-years",
        customFieldsApprox: 20,
      };
    }
    return o;
  });
  inputs.dataScope.historicalActivity.emails = true;
  inputs.dataScope.historicalActivity.calls = true;
  inputs.fieldMapping = {
    ...inputs.fieldMapping,
    sourceFieldsApprox: 180,
    targetFieldsApprox: 160,
    directMappings: 100,
    transformationRules: 25,
    valueMappings: 30,
    lookupMappings: 8,
  };
  inputs.integrations.rows = inputs.integrations.rows.map((r) => {
    if (["email-calendar", "marketing", "website-forms"].includes(r.id)) {
      return {
        ...r,
        existing: "yes",
        disposition: "rebuild",
        complexity: "moderate",
        who: "partner",
        externalCostMinor: fromMajor(4000, "EUR").amountMinor,
      };
    }
    return r;
  });
  inputs.approach.migrationSpecificQuoteMinor = fromMajor(18000, "EUR").amountMinor;
  inputs.approach.toolingLicenseCostMinor = fromMajor(2000, "EUR").amountMinor;
  inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) => {
    if (r.id === "pm" || r.id === "crm-admin" || r.id === "revops") {
      return {
        ...r,
        people: 1,
        hoursPerPerson: r.id === "pm" ? 80 : 60,
        hourlyCostMinor: fromMajor(65, "EUR").amountMinor,
      };
    }
    return r;
  });
  inputs.testingCutover.contingency.percent = 10;
  return inputs;
}

/** Scenario C: Salesforce → Dynamics very high */
export function fixtureSalesforceDynamics(): McInputs {
  const inputs = createEmptyMigrationCostInputs();
  inputs.currentSystem = {
    ...inputs.currentSystem,
    projectName: "Salesforce to Dynamics",
    sourceType: "combination",
    currentPlatform: "Salesforce",
    targetCrm: "Dynamics 365",
    migrationType: "complex",
  };
  inputs.dataScope.objects = inputs.dataScope.objects.map((o) => ({
    ...o,
    migrate: true,
    recordVolumeBand: o.id === "emails" ? "1m-plus" : "250k-1m",
    historyDepth: "all-history",
    customFieldsApprox: 40,
  }));
  inputs.dataScope.historicalActivity = {
    emails: true,
    calls: true,
    meetings: true,
    tasks: true,
    notes: true,
    stageHistory: true,
    ownerHistory: true,
  };
  inputs.dataScope.attachments = {
    scope: "most-all",
    storageBand: "100gb-plus",
    externalFileLinks: "yes",
    emailAttachments: "yes",
  };
  inputs.fieldMapping = {
    ...inputs.fieldMapping,
    sourceFieldsApprox: 900,
    targetFieldsApprox: 750,
    transformationRules: 120,
    valueMappings: 80,
    lookupMappings: 40,
    customObjects: 5,
    unmappedRequired: 12,
    openIssues: 18,
  };
  inputs.dataQuality.issues = inputs.dataQuality.issues.map((i) => ({
    ...i,
    severity: "significant" as const,
    owner: "external" as const,
  }));
  inputs.dataQuality.overallExternalQuoteMinor = fromMajor(25000, "EUR").amountMinor;
  inputs.integrations.rows = inputs.integrations.rows.map((r) => ({
    ...r,
    existing: "yes" as const,
    disposition: "rebuild" as const,
    complexity: "complex" as const,
    integrationType: "custom-api" as const,
    who: "partner" as const,
    externalCostMinor: fromMajor(12000, "EUR").amountMinor,
  }));
  inputs.approach.partnerDayRateMinor = fromMajor(1200, "EUR").amountMinor;
  inputs.approach.estimatedDays = 60;
  inputs.approach.toolingLicenseCostMinor = fromMajor(8000, "EUR").amountMinor;
  inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) => ({
    ...r,
    people: 1,
    hoursPerPerson: 100,
    hourlyCostMinor: fromMajor(75, "EUR").amountMinor,
  }));
  inputs.testingCutover.testing.testMigrationCount = "3-plus";
  inputs.testingCutover.testing.fullReconciliation = true;
  inputs.testingCutover.contingency.percent = 15;
  return inputs;
}

/** Scenario D: unknown partner cost */
export function fixtureUnknownPartner(): McInputs {
  const inputs = createEmptyMigrationCostInputs();
  inputs.currentSystem.migrationType = "moderate";
  inputs.currentSystem.sourceType = "existing-crm";
  inputs.dataScope.objects = inputs.dataScope.objects.map((o) =>
    o.id === "contacts" || o.id === "deals"
      ? { ...o, migrate: true, recordVolumeBand: "10k-50k" as const }
      : o,
  );
  inputs.internalEffort.roles = inputs.internalEffort.roles.map((r) =>
    r.id === "crm-admin"
      ? {
          ...r,
          people: 1,
          hoursPerPerson: 20,
          hourlyCostMinor: fromMajor(50, "EUR").amountMinor,
        }
      : r,
  );
  // No partner quote — intentional
  return inputs;
}

/** Scenario E: no historical data */
export function fixtureNoHistory(): McInputs {
  const inputs = fixturePipedriveHubSpot();
  inputs.dataScope.historicalActivity = {
    emails: false,
    calls: false,
    meetings: false,
    tasks: false,
    notes: false,
    stageHistory: false,
    ownerHistory: false,
  };
  inputs.dataScope.objects = inputs.dataScope.objects.map((o) => ({
    ...o,
    historyDepth: "current-only" as const,
  }));
  return inputs;
}

/** Scenario F: heavy dirty data */
export function fixtureDirtyData(): McInputs {
  const inputs = fixturePipedriveHubSpot();
  inputs.dataQuality.issues = inputs.dataQuality.issues.map((i) => ({
    ...i,
    severity: "significant" as const,
    owner: "external" as const,
    externalQuoteMinor: fromMajor(3000, "EUR").amountMinor,
  }));
  return inputs;
}
