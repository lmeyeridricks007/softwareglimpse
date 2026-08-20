import { describe, expect, it } from "vitest";
import {
  analyzeDemoQuality,
  buildDemoMarkdown,
  buildVendorComparison,
  computeRequirementsCoverage,
  countDemoTasks,
  countMustHaveChecks,
  createSeededCrmDemoChecklistSession,
  detectVagueTask,
  estimateAgendaMinutes,
  includedScenarios,
  moveAgendaBlock,
  newDemoId,
  previewScorecardHandoff,
  rebuildAgendaFromDraft,
  reorderScenarios,
  resolveDemoDurationMinutes,
  touchCrmDemoChecklistSession,
} from "@/services/demo-checklist-builder";
import type { CrmDecisionProfile } from "@/domain";
import { createEmptyCrmDecisionProfile } from "@/services/decision-profile/persistence";

describe("demo-checklist-builder", () => {
  it("creates a seeded session with starter scenarios", () => {
    const session = createSeededCrmDemoChecklistSession();
    expect(session.version).toBe(1);
    expect(session.wizardStepId).toBe("setup");
    expect(session.draft.scenarios.length).toBeGreaterThanOrEqual(8);
    expect(session.draft.questions.length).toBeGreaterThan(0);
    expect(session.draft.demoGuidelines).toContain("DEMO GUIDELINES");
  });

  it("counts tasks, must-haves and duration", () => {
    const session = createSeededCrmDemoChecklistSession();
    expect(countDemoTasks(session.draft)).toBeGreaterThan(10);
    expect(countMustHaveChecks(session.draft)).toBeGreaterThan(0);
    expect(resolveDemoDurationMinutes(session.draft.setup)).toBe(90);
    expect(estimateAgendaMinutes(session.draft)).toBeGreaterThan(30);
  });

  it("duplicates and reorders scenarios without losing identity", () => {
    const session = createSeededCrmDemoChecklistSession();
    const first = session.draft.scenarios[0]!;
    const clone = {
      ...first,
      id: newDemoId("SCN"),
      name: `${first.name} (copy)`,
      sortOrder: session.draft.scenarios.length,
    };
    const withClone = touchCrmDemoChecklistSession(session, {
      draft: {
        ...session.draft,
        scenarios: [...session.draft.scenarios, clone],
      },
    });
    expect(withClone.draft.scenarios).toHaveLength(
      session.draft.scenarios.length + 1,
    );

    const reordered = reorderScenarios(withClone.draft.scenarios, 0, 2);
    expect(reordered.find((s) => s.id === first.id)?.sortOrder).toBe(2);
  });

  it("rebuilds agenda and supports block reordering", () => {
    const session = createSeededCrmDemoChecklistSession();
    const agenda = rebuildAgendaFromDraft(session.draft);
    expect(agenda[0]?.kind).toBe("intro");
    expect(agenda.some((b) => b.kind === "scenario")).toBe(true);
    const moved = moveAgendaBlock(agenda, 1, 2);
    expect(moved[2]?.id).toBe(agenda[1]?.id);
  });

  it("detects vague tasks and quality gaps", () => {
    expect(detectVagueTask("Show reporting")).toBeTruthy();
    expect(detectVagueTask("Create a pipeline-by-owner report")).toBeNull();

    const session = createSeededCrmDemoChecklistSession();
    const broken = touchCrmDemoChecklistSession(session, {
      draft: {
        ...session.draft,
        scenarios: session.draft.scenarios.map((s, i) =>
          i === 0
            ? {
                ...s,
                persona: "",
                successCriteria: [],
                evidenceRequired: [],
                vendorTasks: ["Show pipeline management"],
              }
            : s,
        ),
      },
    });
    const quality = analyzeDemoQuality(broken.draft);
    expect(quality.issues.some((i) => i.kind === "missing-persona")).toBe(true);
    expect(quality.issues.some((i) => i.kind === "missing-success")).toBe(true);
    expect(quality.issues.some((i) => i.kind === "vague-task")).toBe(true);
  });

  it("computes requirements coverage from a decision profile", () => {
    const profile: CrmDecisionProfile = {
      ...createEmptyCrmDecisionProfile(),
      requirements: [
        { id: "forecast-revenue", priority: "must-have", source: "user-selected" },
        {
          id: "manage-integrations",
          priority: "important",
          source: "user-selected",
        },
        {
          id: "separate-sales-processes",
          priority: "nice-to-have",
          source: "user-selected",
        },
      ],
    };
    const session = createSeededCrmDemoChecklistSession();
    const withCoverage = touchCrmDemoChecklistSession(session, {
      draft: {
        ...session.draft,
        scenarios: session.draft.scenarios.map((s, i) =>
          i === 0
            ? { ...s, requirementIds: ["forecast-revenue"], included: true }
            : s,
        ),
      },
    });
    const coverage = computeRequirementsCoverage(withCoverage.draft, profile);
    expect(coverage.buckets.find((b) => b.priority === "must-have")?.covered).toBe(
      1,
    );
    expect(coverage.uncovered.map((u) => u.requirementId)).toEqual(
      expect.arrayContaining(["manage-integrations", "separate-sales-processes"]),
    );
  });

  it("builds markdown export with scenarios", () => {
    const session = createSeededCrmDemoChecklistSession();
    const md = buildDemoMarkdown(session, { vendorName: "Example CRM" });
    expect(md).toContain("CRM Vendor Demo Checklist");
    expect(md).toContain("Example CRM");
    expect(md).toContain("Ask the vendor to:");
    expect(includedScenarios(session.draft)[0]?.name).toBeTruthy();
  });

  it("isolates vendor comparison scores and gates", () => {
    const session = createSeededCrmDemoChecklistSession();
    const scenarioId = session.draft.scenarios[0]!.id;
    const withVendors = touchCrmDemoChecklistSession(session, {
      draft: {
        ...session.draft,
        vendorEvaluations: [
          {
            vendorId: "pipedrive",
            vendorLabel: "Pipedrive",
            productId: "pipedrive",
            demoDate: "",
            evaluator: "",
            results: [
              {
                itemId: scenarioId,
                itemType: "scenario",
                score: 5,
                evidenceStatus: "verified-in-demo",
                evaluatorNotes: "",
                vendorExplanation: "",
                followUpRequired: false,
                evidenceReference: "",
                documentationUrl: "",
                mustHaveGate: "pass",
              },
            ],
            overallNotes: "",
          },
          {
            vendorId: "hubspot",
            vendorLabel: "HubSpot",
            productId: "hubspot",
            demoDate: "",
            evaluator: "",
            results: [
              {
                itemId: scenarioId,
                itemType: "scenario",
                score: 3,
                evidenceStatus: "vendor-stated",
                evaluatorNotes: "",
                vendorExplanation: "",
                followUpRequired: true,
                evidenceReference: "",
                documentationUrl: "",
                mustHaveGate: "fail",
              },
            ],
            overallNotes: "",
          },
        ],
      },
    });

    const comparison = buildVendorComparison(withVendors);
    expect(comparison.vendors).toHaveLength(2);
    expect(comparison.mustHaveFails.hubspot).toBe(1);
    expect(comparison.mustHaveFails.pipedrive).toBe(0);
    expect(comparison.notVerified.pipedrive ?? 0).toBe(0);

    const preview = previewScorecardHandoff(withVendors, {
      vendorId: "pipedrive",
    });
    // No requirement IDs on default starter scenario → empty or only linked ones
    expect(Array.isArray(preview)).toBe(true);
  });

  it("flags agenda overrun against available duration", () => {
    const session = createSeededCrmDemoChecklistSession();
    const short = touchCrmDemoChecklistSession(session, {
      draft: {
        ...session.draft,
        setup: {
          ...session.draft.setup,
          durationOption: "30",
        },
        agenda: rebuildAgendaFromDraft({
          ...session.draft,
          setup: { ...session.draft.setup, durationOption: "30" },
        }),
      },
    });
    // Force oversized agenda
    const oversized = touchCrmDemoChecklistSession(short, {
      draft: {
        ...short.draft,
        agenda: short.draft.agenda.map((b) => ({
          ...b,
          minutes: b.minutes + 20,
        })),
      },
    });
    const quality = analyzeDemoQuality(oversized.draft);
    expect(quality.issues.some((i) => i.kind === "time-overrun")).toBe(true);
  });
});
