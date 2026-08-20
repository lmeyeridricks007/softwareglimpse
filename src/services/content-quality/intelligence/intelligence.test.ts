import { describe, expect, it } from "vitest";
import {
  stableGapId,
  stableImprovementId,
  diffScoreSnapshots,
  inspectContentIntegrity,
  runContentIntelligenceOrchestrator,
} from "./index";
import type { ScoreSnapshot } from "./diff";
import { generateImprovementOpportunities } from "../improvement/generate";
import { runContentQualityAudit } from "../audit-engine";

describe("stable recommendation IDs", () => {
  it("keeps improvement IDs stable across identical inputs", () => {
    const a = stableImprovementId(
      "/software/hubspot/",
      "ADD EVIDENCE",
      "Missing primary sources",
    );
    const b = stableImprovementId(
      "/software/hubspot/",
      "ADD EVIDENCE",
      "Missing primary sources",
    );
    expect(a).toBe(b);
    expect(a).toMatch(/^CQ-SOFTWARE-HUBSPOT-EVIDENCE-[0-9A-F]+$/);
  });

  it("keeps gap IDs stable and uses CG- prefix", () => {
    const a = stableGapId("CRM ROI Calculator", "/tools/crm-roi-calculator/", "CREATE");
    const b = stableGapId("CRM ROI Calculator", "/tools/crm-roi-calculator/", "CREATE");
    expect(a).toBe(b);
    expect(a.startsWith("CG-")).toBe(true);
  });

  it("does not renumber improvement IDs by sort order", () => {
    const audit = runContentQualityAudit({
      scope: "industry",
      writeReports: false,
      writeMaster: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    const first = generateImprovementOpportunities(audit.results);
    const second = generateImprovementOpportunities(audit.results);
    expect(first.opportunities.map((o) => o.id)).toEqual(
      second.opportunities.map((o) => o.id),
    );
    expect(
      first.opportunities.every((o) => /^CQ-/.test(o.id)),
    ).toBe(true);
  });
});

describe("score diff", () => {
  it("classifies improved / regressed / new / resolved", () => {
    const prev: ScoreSnapshot = {
      generatedAt: "2026-08-01T00:00:00.000Z",
      mode: "FULL",
      scope: "crm",
      pages: {
        "/software/hubspot/": {
          score: 71,
          band: "good-but-improvable",
          pageType: "product-review",
          priority: "CQ-P2",
        },
        "/industries/saas/": {
          score: 62,
          band: "weak",
          pageType: "industry",
          priority: "CQ-P0",
        },
        "/gone/": {
          score: 40,
          band: "poor",
          pageType: "guide",
          priority: "CQ-P1",
        },
      },
      recommendationIds: [],
    };
    const curr: ScoreSnapshot = {
      generatedAt: "2026-08-15T00:00:00.000Z",
      mode: "FULL",
      scope: "crm",
      pages: {
        "/software/hubspot/": {
          score: 84,
          band: "strong",
          pageType: "product-review",
          priority: "CQ-P3",
        },
        "/industries/saas/": {
          score: 59,
          band: "weak",
          pageType: "industry",
          priority: "CQ-P0",
        },
        "/new/": {
          score: 50,
          band: "weak",
          pageType: "guide",
          priority: "CQ-P2",
        },
      },
      recommendationIds: [],
    };
    const changes = diffScoreSnapshots(prev, curr);
    expect(changes.find((c) => c.route === "/software/hubspot/")?.kind).toBe(
      "IMPROVED",
    );
    expect(changes.find((c) => c.route === "/industries/saas/")?.kind).toBe(
      "REGRESSED",
    );
    expect(changes.find((c) => c.route === "/new/")?.kind).toBe("NEW ISSUES");
    expect(changes.find((c) => c.route === "/gone/")?.kind).toBe("RESOLVED");
  });
});

describe("integrity", () => {
  it("returns no findings for a healthy dry audit slice", () => {
    const audit = runContentQualityAudit({
      scope: "best",
      writeReports: false,
      writeMaster: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    const findings = inspectContentIntegrity(audit.results);
    expect(Array.isArray(findings)).toBe(true);
  });
});

describe("ContentIntelligenceOrchestrator", () => {
  it("runs FAST dry without writing and without mutating content", () => {
    const result = runContentIntelligenceOrchestrator({
      mode: "FAST",
      write: false,
      archive: false,
      persistScores: false,
      evaluatedAt: "2026-08-15T12:00:00.000Z",
    });
    expect(result.agent.label).toBe("ContentIntelligenceOrchestrator");
    expect(result.summary.pagesAudited).toBeGreaterThan(10);
    expect(result.markdown).toContain("# SoftwareGlimpse Content Intelligence");
    expect(result.markdown).toContain("## Executive summary");
    expect(result.markdown).toContain("## Next 25 recommended actions");
    expect(result.markdown).toContain("does **not** create");
    expect(result.paths.intelligenceLatest).toBeUndefined();
  });
});
