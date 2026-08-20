import { describe, expect, it } from "vitest";
import {
  createEmptyCrmDecisionProfile,
  type CrmDecisionProfile,
} from "@/domain";
import {
  applyProfileToDraft,
  assessRfpReadiness,
  buildRfpMarkdown,
  buildRfpWorkbookSheets,
  bumpMinorVersion,
  countByPriority,
  createDefaultDraft,
  createSeededCrmRfpSession,
  detectVagueRequirement,
  fingerprintRequirements,
  generateNextVersion,
  markIssued,
  parseVendorResponsePackage,
  requirementsFromLibrary,
  requirementsFromProfile,
  stepsForMode,
  toScorecardEvidenceHandoff,
} from "./index";

function profileWithRequirements(): CrmDecisionProfile {
  const base = createEmptyCrmDecisionProfile();
  return {
    ...base,
    businessContext: {
      ...base.businessContext,
      crmUserCount: 12,
      currentState: "spreadsheet",
    },
    requirements: [
      {
        id: "forecast-revenue",
        priority: "must-have",
        source: "user-selected",
      },
      {
        id: "integrate-with-email",
        priority: "important",
        source: "user-selected",
      },
      {
        id: "support-multiple-currencies",
        priority: "nice-to-have",
        source: "user-selected",
      },
      {
        id: "customize-record-fields",
        priority: "not-needed",
        source: "user-selected",
      },
    ],
    integrations: [
      { id: "microsoft-365", priority: "required" },
      { id: "none", priority: "optional" },
    ],
  };
}

describe("CRM RFP Builder", () => {
  it("A: vendor brief skips security step", () => {
    const steps = stepsForMode("vendor-brief");
    expect(steps).not.toContain("security-support");
    expect(steps).toContain("requirements");
    expect(steps[steps.length - 1]).toBe("review");
  });

  it("B: formal RFP includes security and all core steps", () => {
    const steps = stepsForMode("formal-rfp");
    expect(steps).toContain("security-support");
    expect(steps).toContain("integrations");
    expect(steps.length).toBe(10);
  });

  it("C: import requirements preserves stable pillar IDs", () => {
    const rows = requirementsFromProfile(profileWithRequirements());
    const forecast = rows.find((r) => r.sourceSlug === "forecast-revenue");
    expect(forecast?.id).toBe("CRM-REQ-004");
    expect(forecast?.priority).toBe("must-have");
    expect(rows.some((r) => r.sourceSlug === "customize-record-fields")).toBe(
      false,
    );
  });

  it("D: vague requirement quality warning", () => {
    const hit = detectVagueRequirement("We need good reporting for managers");
    expect(hit).not.toBeNull();
    expect(hit?.suggestion.toLowerCase()).toContain("pipeline");
  });

  it("E: no requirements → incomplete readiness", () => {
    const draft = createDefaultDraft();
    const readiness = assessRfpReadiness(draft, "vendor-brief");
    expect(readiness.status).toBe("incomplete");
    expect(readiness.blockers.length).toBeGreaterThan(0);
  });

  it("F: incomplete pricing assumptions warn rather than invent figures", () => {
    const draft = createDefaultDraft();
    draft.requirements = requirementsFromLibrary().slice(0, 3);
    draft.project.projectName = "CRM Replacement";
    draft.project.responseDeadline = "2026-09-12";
    draft.businessContext.businessProblem = "Pipeline visibility is poor";
    draft.businessContext.currentSituation = "Spreadsheets";
    draft.scope = [
      {
        id: "pipeline-management",
        label: "Pipeline management",
        phase: "phase-1",
      },
    ];
    const readiness = assessRfpReadiness(draft, "vendor-brief");
    expect(
      readiness.warnings.some((w) =>
        w.toLowerCase().includes("pricing assumptions"),
      ),
    ).toBe(true);
    const md = buildRfpMarkdown({
      ...createSeededCrmRfpSession(),
      mode: "vendor-brief",
      draft,
    });
    expect(md).not.toMatch(/\$\d{2,}/);
  });

  it("G: version bump / change log works", () => {
    expect(bumpMinorVersion("1.0")).toBe("1.1");
    let session = createSeededCrmRfpSession();
    session = {
      ...session,
      mode: "vendor-brief",
      draft: {
        ...session.draft,
        requirements: requirementsFromLibrary().slice(0, 2),
      },
    };
    session = markIssued(session);
    const previous = session.draft.requirements;
    const nextReqs = [
      ...previous,
      {
        ...previous[0]!,
        id: "REQ-NEW-001",
        requirement: "Added later",
        sortOrder: 99,
      },
    ];
    session = {
      ...session,
      draft: { ...session.draft, requirements: nextReqs },
    };
    session = generateNextVersion(session, previous);
    expect(session.versionMeta.version).toBe("1.1");
    expect(session.changeLog.some((c) => c.kind === "added")).toBe(true);
    expect(fingerprintRequirements(nextReqs)).toBe(
      session.lastIssuedRequirementFingerprint,
    );
  });

  it("maps profile into draft without inventing user counts beyond profile", () => {
    const draft = applyProfileToDraft(
      createDefaultDraft(),
      profileWithRequirements(),
    );
    expect(draft.users.currentUsers).toBe(12);
    expect(draft.requirements.length).toBe(3);
    expect(draft.integrations.some((i) => i.system === "Microsoft 365")).toBe(
      true,
    );
    expect(draft.integrations.every((i) => i.sourceId !== "none")).toBe(true);
  });

  it("counts MoSCoW priorities", () => {
    const counts = countByPriority(requirementsFromLibrary());
    expect(counts.total).toBeGreaterThan(10);
    expect(counts.mustHave).toBeGreaterThan(0);
  });

  it("workbook includes requirements sheet and omits security for brief", () => {
    const session = createSeededCrmRfpSession();
    session.mode = "vendor-brief";
    session.draft.requirements = requirementsFromLibrary().slice(0, 5);
    const sheets = buildRfpWorkbookSheets(session);
    const names = sheets.map((s) => s.name);
    expect(names).toContain("04_REQUIREMENTS");
    expect(names).not.toContain("07_SECURITY");
  });

  it("formal workbook includes security and pricing formulas", () => {
    const session = createSeededCrmRfpSession();
    session.mode = "formal-rfp";
    session.draft.requirements = requirementsFromLibrary().slice(0, 5);
    const sheets = buildRfpWorkbookSheets(session);
    expect(sheets.map((s) => s.name)).toContain("07_SECURITY");
    const pricing = sheets.find((s) => s.name === "10_PRICING");
    expect(pricing?.aoa.some((row) => row.some((c) => typeof c === "string" && c.startsWith("=")))).toBe(true);
  });

  it("vendor response import contract maps to scorecard evidence", () => {
    const pkg = parseVendorResponsePackage({
      contractVersion: 1,
      rfpVersion: "1.0",
      vendorName: "ExampleCRM",
      requirements: [
        {
          requirementId: "CRM-REQ-004",
          vendorResponse: "Supported",
          deliveryMethod: "native",
          evidenceUrl: "https://example.com/docs",
        },
      ],
    });
    expect(pkg).not.toBeNull();
    const handoff = toScorecardEvidenceHandoff(pkg!);
    expect(handoff.evidenceByRequirementId["CRM-REQ-004"]?.deliveryMethod).toBe(
      "native",
    );
  });
});
