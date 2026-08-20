import { describe, expect, it } from "vitest";
import {
  createEmptyCrmMigrationPlan,
  type CrmMigrationPlan,
} from "@/domain";
import {
  applyFieldSuggestions,
  applyImplementationHandoff,
  applyMigrationRules,
  assessFieldTypeRisk,
  assessMigrationComplexity,
  generateMigrationPlan,
  generateMigrationRisks,
  mergeRuleTasks,
  previewImplementationHandoff,
  previewTcoHandoff,
  seedPlanFromContext,
  suggestTargetField,
  fieldMappingProgress,
  migrationWorkbookCsv,
  fieldMappingToCsv,
} from "@/services/migration-planner";
import { createEmptyCrmImplementationPlan } from "@/domain";

function basePlan(overrides: Partial<CrmMigrationPlan> = {}): CrmMigrationPlan {
  const empty = createEmptyCrmMigrationPlan("2026-08-14T12:00:00.000Z");
  return {
    ...empty,
    sourceSystems: [
      {
        id: "src-sf",
        name: "Salesforce",
        type: "existing-crm",
        exportAvailable: "unknown",
        apiAvailable: "unknown",
        formatKnown: "unknown",
      },
    ],
    objects: [
      {
        id: "obj-contacts",
        sourceSystemId: "src-sf",
        objectKey: "contacts",
        sourceObjectLabel: "Contacts",
        targetObjectLabel: "Person",
        recordCount: 18420,
        priority: "must-migrate",
        historyDepth: "all-history",
        status: "ready",
        required: true,
      },
      {
        id: "obj-companies",
        sourceSystemId: "src-sf",
        objectKey: "companies",
        sourceObjectLabel: "Accounts",
        priority: "must-migrate",
        historyDepth: "unknown",
        status: "not-started",
        required: true,
      },
      {
        id: "obj-deals",
        sourceSystemId: "src-sf",
        objectKey: "deals",
        sourceObjectLabel: "Opportunities",
        priority: "must-migrate",
        historyDepth: "current-open-only",
        status: "not-started",
        required: true,
      },
    ],
    ...overrides,
  };
}

describe("suggestTargetField", () => {
  it("suggests Email for email aliases without confirming", () => {
    expect(suggestTargetField("Email")).toEqual({
      targetObject: "Person",
      targetField: "Email",
      confidence: "exact-name",
    });
    expect(suggestTargetField("Lead_Source__c")).toBeNull();
  });
});

describe("applyFieldSuggestions", () => {
  it("marks suggestions as suggested, not mapped", () => {
    const { mappings, suggestedCount } = applyFieldSuggestions([
      {
        id: "1",
        sourceField: "Email",
        status: "unknown",
      },
      {
        id: "2",
        sourceField: "FirstName",
        status: "mapped",
        targetField: "First name",
      },
    ]);
    expect(suggestedCount).toBe(1);
    expect(mappings[0]?.status).toBe("suggested");
    expect(
      (mappings[0] as { suggestionPending?: boolean } | undefined)
        ?.suggestionPending,
    ).toBe(true);
    expect(mappings[1]?.status).toBe("mapped");
  });
});

describe("assessFieldTypeRisk", () => {
  it("flags free text → dropdown as transformation required", () => {
    expect(assessFieldTypeRisk("Free text", "Dropdown")).toBe(
      "transformation-required",
    );
  });

  it("does not invent risk when types are unknown", () => {
    expect(assessFieldTypeRisk(undefined, "Email")).toBe("ok");
  });
});

describe("assessMigrationComplexity", () => {
  it("rates multi-source + custom fields as at least moderate", () => {
    const plan = basePlan({
      sourceSystems: [
        {
          id: "a",
          name: "Salesforce",
          type: "existing-crm",
          exportAvailable: "unknown",
          apiAvailable: "unknown",
          formatKnown: "unknown",
        },
        {
          id: "b",
          name: "Excel",
          type: "spreadsheet",
          exportAvailable: "yes",
          apiAvailable: "no",
          formatKnown: "unknown",
        },
        {
          id: "c",
          name: "Access",
          type: "database",
          exportAvailable: "unknown",
          apiAvailable: "unknown",
          formatKnown: "unknown",
        },
      ],
      customFields: { sourceCount: 38 },
      pipelineMappings: [
        {
          id: "p1",
          sourcePipelineName: "Enterprise",
          stageMaps: [],
          targetSupportStatus: "unknown",
        },
        {
          id: "p2",
          sourcePipelineName: "SMB",
          stageMaps: [],
          targetSupportStatus: "unknown",
        },
      ],
    });
    const result = assessMigrationComplexity(plan);
    expect(["moderate", "high", "very-high"]).toContain(result.level);
    expect(result.drivers.some((d) => d.id.startsWith("sources"))).toBe(true);
    expect(result.drivers.some((d) => d.id.startsWith("custom-fields"))).toBe(
      true,
    );
  });
});

describe("migration rules", () => {
  it("adds consolidation tasks for multiple sources", () => {
    const plan = basePlan({
      sourceSystems: [
        {
          id: "a",
          name: "A",
          type: "existing-crm",
          exportAvailable: "unknown",
          apiAvailable: "unknown",
          formatKnown: "unknown",
        },
        {
          id: "b",
          name: "B",
          type: "spreadsheet",
          exportAvailable: "unknown",
          apiAvailable: "unknown",
          formatKnown: "unknown",
        },
      ],
    });
    const tasks = applyMigrationRules(plan);
    expect(tasks.some((t) => t.ruleId === "multi-source-consolidation")).toBe(
      true,
    );
  });

  it("requires inactive owner decision", () => {
    const plan = basePlan({
      userMappings: [
        {
          id: "u1",
          sourceUser: "Former Employee",
          email: "old@example.com",
          active: "no",
          status: "needs-decision",
        },
      ],
      inactiveOwnerStrategy: "unknown",
    });
    const tasks = applyMigrationRules(plan);
    expect(tasks.some((t) => t.ruleId === "inactive-owners")).toBe(true);
  });

  it("preserves user task status when merging rules", () => {
    const generated = applyMigrationRules(
      basePlan({
        sourceSystems: [
          {
            id: "a",
            name: "A",
            type: "existing-crm",
            exportAvailable: "unknown",
            apiAvailable: "unknown",
            formatKnown: "unknown",
          },
          {
            id: "b",
            name: "B",
            type: "spreadsheet",
            exportAvailable: "unknown",
            apiAvailable: "unknown",
            formatKnown: "unknown",
          },
        ],
      }),
    );
    const existing = generated.map((t) =>
      t.id === "rule-consolidate-sources"
        ? { ...t, status: "complete" as const }
        : t,
    );
    const merged = mergeRuleTasks(existing, generated);
    expect(
      merged.find((t) => t.id === "rule-consolidate-sources")?.status,
    ).toBe("complete");
  });
});

describe("generateMigrationPlan", () => {
  it("surfaces unmapped required fields as high risk", () => {
    const plan = generateMigrationPlan(
      basePlan({
        fieldMappings: [
          {
            id: "f1",
            sourceSystemId: "src-sf",
            sourceObject: "Contact",
            sourceField: "Email",
            required: true,
            status: "unknown",
            transformation: "none",
            suggestionPending: false,
          },
        ],
      }),
    );
    expect(plan.risks.some((r) => r.id === "risk-unmapped-required")).toBe(
      true,
    );
    expect(plan.complexity).toBeDefined();
    expect(plan.testMigration.steps.length).toBeGreaterThan(5);
    expect(plan.cutoverSteps.length).toBeGreaterThan(3);
  });

  it("warns when attachments selected without verified support", () => {
    const plan = generateMigrationPlan(
      basePlan({
        attachments: {
          needed: "yes",
          targetSupportStatus: "not-researched",
        },
      }),
    );
    expect(plan.risks.some((r) => r.id === "risk-attachments")).toBe(true);
  });

  it("adds delta tasks when source remains active", () => {
    const plan = generateMigrationPlan(
      basePlan({
        deltaMigration: {
          sourceRemainsActive: "yes",
          secondImportIfSupported: "unknown",
          incrementalImportSupport: "unknown",
        },
      }),
    );
    expect(
      plan.migrationTasks.some((t) => t.ruleId === "source-remains-active"),
    ).toBe(true);
  });
});

describe("fieldMappingProgress", () => {
  it("derives percentage from counts only", () => {
    const plan = basePlan({
      fieldMappings: [
        {
          id: "1",
          sourceSystemId: "src-sf",
          sourceObject: "Contact",
          sourceField: "A",
          status: "mapped",
          transformation: "none",
          required: false,
          suggestionPending: false,
        },
        {
          id: "2",
          sourceSystemId: "src-sf",
          sourceObject: "Contact",
          sourceField: "B",
          status: "needs-review",
          transformation: "none",
          required: false,
          suggestionPending: false,
        },
      ],
    });
    expect(fieldMappingProgress(plan)).toMatchObject({
      total: 2,
      mapped: 1,
      percentMapped: 50,
    });
  });
});

describe("seedPlanFromContext", () => {
  it("builds vendor-neutral plan when no product selected", () => {
    const seeded = seedPlanFromContext({
      teamLabels: [],
      implementationMigrationObjects: ["contacts", "deals"],
      tcoMigrationScopes: [],
      hasProfile: false,
      hasImplementationPlan: false,
      hasTcoSession: false,
      profileSummary: [],
      currentState: "spreadsheet",
    });
    expect(seeded.vendorNeutral).toBe(true);
    expect(seeded.migrationType).toBe("spreadsheet");
    expect(seeded.objects.some((o) => o.objectKey === "contacts")).toBe(true);
  });
});

describe("handoffs", () => {
  it("previews implementation tasks without mutating", () => {
    const migration = generateMigrationPlan(
      basePlan({
        sourceSystems: [
          {
            id: "a",
            name: "A",
            type: "existing-crm",
            exportAvailable: "unknown",
            apiAvailable: "unknown",
            formatKnown: "unknown",
          },
          {
            id: "b",
            name: "B",
            type: "spreadsheet",
            exportAvailable: "unknown",
            apiAvailable: "unknown",
            formatKnown: "unknown",
          },
        ],
      }),
    );
    const preview = previewImplementationHandoff(migration);
    expect(preview.taskCount).toBeGreaterThan(0);
    expect(preview.message).toMatch(/confirm/i);
  });

  it("applies implementation handoff into data-migration phase", () => {
    const migration = generateMigrationPlan(basePlan());
    const impl = createEmptyCrmImplementationPlan("2026-08-14T12:00:00.000Z");
    const next = applyImplementationHandoff(impl, migration);
    expect(next.tasks.some((t) => t.sourceType === "migration-derived")).toBe(
      true,
    );
    expect(next.scope.migrationObjects).toContain("contacts");
  });

  it("builds TCO suggestion without inventing costs", () => {
    const migration = {
      ...generateMigrationPlan(basePlan()),
      complexity: {
        level: "high" as const,
        score: 10,
        drivers: [],
      },
    };
    const preview = previewTcoHandoff(migration);
    expect(preview.needed).toBe("complex");
    expect(preview.scopes).toContain("contacts");
    expect(preview.message).toMatch(/confirm/i);
  });
});

describe("export", () => {
  it("exports field mapping CSV without executing migration", () => {
    const plan = basePlan({
      fieldMappings: [
        {
          id: "1",
          sourceSystemId: "src-sf",
          sourceObject: "Contact",
          sourceField: "Email",
          exampleValue: "anna@acme.com",
          targetObject: "Person",
          targetField: "Email",
          status: "mapped",
          transformation: "none",
          required: true,
          suggestionPending: false,
        },
      ],
    });
    const csv = fieldMappingToCsv(plan);
    expect(csv).toContain("source_field");
    expect(csv).toContain("Email");
    const workbook = migrationWorkbookCsv(plan);
    expect(workbook).toContain("### Field Mapping");
    expect(workbook).toContain("### Risks");
  });

  it("builds a real Excel workbook with planning sheets", async () => {
    const { buildMigrationPlanWorkbook } = await import(
      "@/services/migration-planner"
    );
    const plan = basePlan({
      fieldMappings: [
        {
          id: "1",
          sourceSystemId: "src-sf",
          sourceObject: "Contact",
          sourceField: "Email",
          targetObject: "Person",
          targetField: "Email",
          status: "mapped",
          transformation: "none",
          required: true,
          suggestionPending: false,
        },
      ],
      risks: [
        {
          id: "r1",
          title: "Export format unknown",
          severity: "medium",
          reason: "Source export format not confirmed",
          recommendedAction: "Confirm CSV/API export before cutover",
          status: "open",
          sourceRefs: [],
        },
      ],
    });
    const wb = await buildMigrationPlanWorkbook(plan);
    expect(wb.SheetNames).toEqual(
      expect.arrayContaining([
        "Summary",
        "Sources",
        "Objects",
        "Field Mapping",
        "Risks",
        "Cutover",
        "Rollback",
      ]),
    );
    const XLSX = await import("xlsx");
    const summary = XLSX.utils.sheet_to_json<string[]>(wb.Sheets.Summary!, {
      header: 1,
    });
    expect(JSON.stringify(summary)).toContain("does not execute migration");
    const fields = XLSX.utils.sheet_to_json<string[]>(
      wb.Sheets["Field Mapping"]!,
      { header: 1 },
    );
    expect(JSON.stringify(fields)).toContain("Email");
  });
});

describe("generateMigrationRisks — pipelines", () => {
  it("flags many-to-one stage collapses", () => {
    const risks = generateMigrationRisks(
      basePlan({
        pipelineMappings: [
          {
            id: "p1",
            sourcePipelineName: "Enterprise Sales",
            targetPipelineName: "Enterprise Sales",
            targetSupportStatus: "unknown",
            stageMaps: [
              { sourceStage: "Legal", targetStage: "Negotiation", warnings: [] },
              {
                sourceStage: "Negotiation",
                targetStage: "Negotiation",
                warnings: [],
              },
            ],
          },
        ],
      }),
    );
    expect(risks.some((r) => r.title.includes("many-to-one"))).toBe(true);
  });
});
