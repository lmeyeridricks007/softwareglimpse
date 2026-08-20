import { describe, expect, it } from "vitest";
import {
  createEmptyCrmDecisionProfile,
  createEmptyCrmImplementationPlan,
  type CrmDecisionProfile,
} from "@/domain";
import {
  assessImplementationComplexity,
  detectProfileChanges,
  generateImplementationPlan,
  generatePhases,
  phasesOverlap,
  planToChecklistCsv,
  planToPlainText,
  setTaskStatus,
  updateTask,
  addUserTask,
} from "@/services/implementation-planner";

function profileFixture(
  patch: Partial<CrmDecisionProfile> & {
    businessContext?: Partial<CrmDecisionProfile["businessContext"]>;
    implementation?: Partial<CrmDecisionProfile["implementation"]>;
  } = {},
): CrmDecisionProfile {
  const base = createEmptyCrmDecisionProfile("2026-08-01T00:00:00.000Z");
  return {
    ...base,
    ...patch,
    businessContext: {
      ...base.businessContext,
      crmUserCount: 25,
      teamIds: ["sales", "ops"],
      currentState: "existing-crm",
      ...patch.businessContext,
    },
    implementation: {
      ...base.implementation,
      migrationComplexity: "medium",
      ...patch.implementation,
    },
    requirements: patch.requirements ?? [
      {
        id: "separate-sales-processes",
        priority: "must-have",
        source: "user-selected",
      },
      {
        id: "support-sso",
        priority: "must-have",
        source: "user-selected",
      },
      {
        id: "automate-lead-follow-up",
        priority: "must-have",
        source: "user-selected",
      },
    ],
    features: patch.features ?? [
      {
        id: "multiple-pipelines",
        priority: "must-have",
        source: "inferred-from-requirement",
      },
    ],
    integrations: patch.integrations ?? [
      { id: "microsoft-365", priority: "required" },
      { id: "slack", priority: "preferred" },
      { id: "mailchimp", priority: "preferred" },
      { id: "docusign", priority: "required" },
    ],
    selectedProductId: patch.selectedProductId ?? "pipedrive",
    shortlistProductIds: patch.shortlistProductIds ?? [
      "pipedrive",
      "hubspot",
      "salesforce",
    ],
    updatedAt: patch.updatedAt ?? "2026-08-01T00:00:00.000Z",
  };
}

describe("CRM Implementation Planner", () => {
  it("CASE 1: new CRM, 10 users, no migration, one integration", () => {
    const profile = profileFixture({
      businessContext: {
        crmUserCount: 10,
        teamIds: ["sales"],
        currentState: "no-crm",
      },
      implementation: { migrationComplexity: "none" },
      integrations: [{ id: "gmail", priority: "required" }],
      requirements: [
        {
          id: "track-pipeline",
          priority: "must-have",
          source: "user-selected",
        },
      ],
    });
    const plan = generateImplementationPlan({
      profile,
      productId: "pipedrive",
      productName: "Pipedrive",
      implementationType: "new-from-scratch",
      migrationSource: "none",
    });
    expect(plan.phases.some((p) => p.id === "data-migration")).toBe(false);
    expect(plan.phases.some((p) => p.id === "integrations")).toBe(true);
    expect(plan.complexity?.level).toMatch(/low|moderate/);
    expect(plan.assumptions.some((a) => /planning assumptions/i.test(a))).toBe(
      true,
    );
  });

  it("CASE 2: replacement with medium migration and integrations", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture(),
      productId: "pipedrive",
      productName: "Pipedrive",
      implementationType: "replace-existing",
    });
    expect(plan.phases.some((p) => p.id === "data-migration")).toBe(true);
    expect(plan.phases.some((p) => p.id === "integrations")).toBe(true);
    expect(plan.tasks.some((t) => t.id === "mig-test-import")).toBe(true);
    expect(
      plan.tasks.find((t) => t.id === "mig-final")?.dependencyIds,
    ).toContain("mig-test-import");
    expect(plan.tasks.some((t) => t.id === "cfg-multi-pipeline")).toBe(true);
    expect(plan.uatItems.length).toBeGreaterThan(0);
  });

  it("CASE 3: security-heavy financial services profile", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture({
        businessContext: {
          crmUserCount: 100,
          industrySlug: "financial-services",
          teamIds: ["sales", "cs", "ops"],
        },
        implementation: {
          migrationComplexity: "low",
          adminComplexity: "advanced",
        },
      }),
      productName: "Salesforce",
      productId: "salesforce",
    });
    expect(plan.phases.some((p) => p.id === "security")).toBe(true);
    expect(plan.tasks.some((t) => t.id === "sec-sso")).toBe(true);
    expect(plan.risks.some((r) => r.id === "risk-sso")).toBe(true);
    expect(plan.complexity?.level).toMatch(/moderate|high|very-high/);
  });

  it("CASE 4: 500 users very high complexity", () => {
    const complexity = assessImplementationComplexity({
      users: 500,
      teamCount: 6,
      regions: ["EU", "US", "APAC"],
      migrationComplexity: "high",
      integrationCount: 8,
      automationRequired: true,
      securityHeavy: true,
      reportingRequired: true,
      launchScope: "full-target-state",
      customAdmin: true,
    });
    expect(complexity.level).toBe("very-high");
    expect(complexity.drivers.length).toBeGreaterThan(3);
  });

  it("CASE 5: vendor-neutral when no product selected", () => {
    const base = profileFixture();
    const profile = {
      ...base,
      selectedProductId: undefined,
      shortlistProductIds: [],
    };
    const plan = generateImplementationPlan({
      profile,
      vendorNeutral: true,
      productId: undefined,
    });
    expect(plan.productId).toBeUndefined();
    expect(plan.vendorNeutral).toBe(true);
    expect(plan.assumptions.some((a) => /vendor-neutral/i.test(a))).toBe(true);
  });

  it("CASE 6–7: target date vs no target date wording", () => {
    const withDate = generateImplementationPlan({
      profile: profileFixture(),
      targetGoLive: "2026-10-19",
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    expect(withDate.targetGoLive).toBe("2026-10-19");
    expect(withDate.planningDurationWeeks).toBeGreaterThan(0);
    expect(
      withDate.assumptions.some((a) => /Backward schedule/i.test(a)),
    ).toBe(true);

    const noDate = generateImplementationPlan({
      profile: profileFixture(),
      targetGoLive: null,
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    expect(noDate.targetGoLive).toBeUndefined();
    expect(noDate.planningDurationWeeks).toBeGreaterThan(0);
  });

  it("surfaces migration, integration and ownership risks for a typical spreadsheet plan", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture({
        businessContext: {
          crmUserCount: 5,
          teamIds: ["sales", "ops"],
          currentState: "spreadsheet",
        },
        implementation: { migrationComplexity: "none" },
        integrations: [
          { id: "gmail", priority: "preferred" },
          { id: "slack", priority: "preferred" },
        ],
        requirements: [
          {
            id: "track-pipeline",
            priority: "must-have",
            source: "user-selected",
          },
        ],
      }),
      productId: "sugarcrm",
      productName: "SugarCRM",
      implementationType: "from-spreadsheets",
      migrationSource: "spreadsheet",
      trainingApproach: "undecided",
    });
    expect(plan.risks.length).toBeGreaterThan(0);
    expect(plan.risks.some((r) => r.id.startsWith("risk-migration"))).toBe(
      true,
    );
    expect(plan.risks.some((r) => r.id.startsWith("risk-int-"))).toBe(true);
    expect(plan.risks.some((r) => r.id === "risk-crm-owner")).toBe(true);
    expect(plan.risks.some((r) => r.id === "risk-training")).toBe(true);
  });

  it("CASE 8: unresolved must-haves become risks", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture(),
      unresolvedMustHaveIds: ["erp-integration"],
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    expect(plan.risks.some((r) => r.id === "risk-req-erp-integration")).toBe(
      true,
    );
  });

  it("CASE 9: high migration includes migration phase and cutover checklist", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture({
        implementation: { migrationComplexity: "high" },
      }),
      productId: "hubspot",
      productName: "HubSpot",
    });
    expect(plan.phases.some((p) => p.id === "data-migration")).toBe(true);
    expect(plan.goLiveChecklist.some((i) => i.id === "gl-mig")).toBe(true);
    expect(plan.risks.some((r) => r.id === "risk-migration-high")).toBe(true);
  });

  it("CASE 10: user edits survive regenerate", () => {
    const first = generateImplementationPlan({
      profile: profileFixture(),
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    let edited = setTaskStatus(first, "disc-objectives", "complete");
    edited = updateTask(edited, "disc-objectives", {
      notes: "Sponsor confirmed",
    });
    edited = addUserTask(edited, {
      phaseId: "discovery",
      title: "Custom kickoff workshop",
    });
    const regenerated = generateImplementationPlan({
      profile: profileFixture(),
      existing: edited,
      productId: "pipedrive",
      productName: "Pipedrive",
      preserveUserEdits: true,
    });
    const disc = regenerated.tasks.find((t) => t.id === "disc-objectives");
    expect(disc?.status).toBe("complete");
    expect(disc?.notes).toBe("Sponsor confirmed");
    expect(
      regenerated.tasks.some((t) => t.title === "Custom kickoff workshop"),
    ).toBe(true);
  });

  it("CASE 11: profile change detection does not wipe plan", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture({ updatedAt: "2026-08-01T00:00:00.000Z" }),
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    const drift = detectProfileChanges(
      plan,
      profileFixture({ updatedAt: "2026-08-14T00:00:00.000Z" }),
    );
    expect(drift.changed).toBe(true);
    expect(drift.message).toMatch(/may need updating/i);
    expect(plan.tasks.length).toBeGreaterThan(0);
  });

  it("omits integration phase when none required", () => {
    const phases = generatePhases({
      migrationComplexity: "none",
      integrationCount: 0,
      automationRequired: false,
      reportingRequired: false,
      securityHeavy: false,
      users: 8,
      complexity: "low",
      launchScope: "core-only",
      hasMustHaveRequirements: true,
      implementationType: "new-from-scratch",
    });
    expect(phases.some((p) => p.id === "integrations")).toBe(false);
    expect(phases.some((p) => p.id === "data-migration")).toBe(false);
  });

  it("runs configuration, migration and integrations in parallel after data-model", () => {
    const phases = generatePhases({
      migrationComplexity: "medium",
      integrationCount: 3,
      automationRequired: true,
      reportingRequired: true,
      securityHeavy: true,
      users: 40,
      complexity: "moderate",
      launchScope: "most-requirements",
      hasMustHaveRequirements: true,
      implementationType: "replace-existing",
    });
    const byId = Object.fromEntries(phases.map((p) => [p.id, p]));
    const dataModel = byId["data-model"]!;
    const config = byId.configuration!;
    const migration = byId["data-migration"]!;
    const integrations = byId.integrations!;

    expect(config.startWeek).toBeGreaterThan(dataModel.endWeek!);
    expect(migration.startWeek).toBe(config.startWeek);
    expect(integrations.startWeek).toBe(config.startWeek);
    expect(phasesOverlap(config, migration)).toBe(true);
    expect(phasesOverlap(config, integrations)).toBe(true);

    const sequentialSpan = phases.reduce(
      (sum, p) => sum + Math.ceil(p.durationWeeks),
      0,
    );
    const calendarWeeks = Math.max(...phases.map((p) => p.endWeek ?? 1));
    expect(calendarWeeks).toBeLessThan(sequentialSpan);
  });

  it("exports plain text and CSV without inventing affiliate claims", () => {
    const plan = generateImplementationPlan({
      profile: profileFixture(),
      productId: "pipedrive",
      productName: "Pipedrive",
    });
    const text = planToPlainText(plan);
    const csv = planToChecklistCsv(plan);
    expect(text).toContain("planning model");
    expect(text).toMatch(/Affiliate status does not influence/i);
    expect(csv).toContain("task");
    expect(csv).toContain("go-live");
  });

  it("empty plan schema round-trips", () => {
    const empty = createEmptyCrmImplementationPlan();
    expect(empty.version).toBe(1);
    expect(empty.phases).toEqual([]);
  });
});
