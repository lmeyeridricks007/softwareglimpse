import { describe, expect, it } from "vitest";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  analyzeAiVisibility,
  canonicalizeCitedUrl,
  inferAiVisibilityPageType,
  loadAiVisibilityExport,
  loadAiVisibilitySummary,
  observeContentPatterns,
  runAiVisibilityAnalysis,
} from "@/services/seo/ai-visibility";

const FIXTURE = path.join(
  process.cwd(),
  "src/data/seo/fixtures/ai-visibility-export-sample.csv",
);

describe("AI Visibility engine", () => {
  it("infers page types and canonicalizes SG URLs", () => {
    expect(inferAiVisibilityPageType("/research/crm-pricing/")).toBe("research");
    expect(inferAiVisibilityPageType("/best/crm-software/")).toBe("best");
    const canon = canonicalizeCitedUrl(
      "https://www.softwareglimpse.com/best/crm-software/",
    );
    expect(canon.isSoftwareGlimpse).toBe(true);
    expect(canon.citedPath).toBe("/best/crm-software/");
  });

  it("loads fixture export without fabricating rows", () => {
    const loaded = loadAiVisibilityExport(FIXTURE);
    expect(loaded).toBeTruthy();
    expect(loaded!.observations.length).toBe(8);
    const cited = loaded!.observations.filter((o) => o.softwareGlimpseCited);
    expect(cited.length).toBe(7);
    const competitorOnly = loaded!.observations.find(
      (o) => o.query === "competitor only query",
    );
    expect(competitorOnly?.softwareGlimpseCited).toBe(false);
  });

  it("analyzes citations by platform/category/page type and patterns", () => {
    const loaded = loadAiVisibilityExport(FIXTURE)!;
    const report = analyzeAiVisibility(loaded, {
      cwd: mkdtempSync(path.join(tmpdir(), "ai-vis-")),
    });
    expect(report.analysis.totalCitations).toBe(7);
    expect(report.analysis.uniqueCitedPages).toBeGreaterThanOrEqual(5);
    expect(report.analysis.citationsByPlatform.chatgpt).toBeGreaterThanOrEqual(2);
    expect(report.analysis.citationsByPageType.research).toBeGreaterThanOrEqual(1);
    expect(report.analysis.competitorOverlap.length).toBeGreaterThan(0);
    expect(report.contentPatterns.length).toBeGreaterThan(0);
    expect(report.contentPatterns[0]!.caveat).toMatch(/not proof/i);
    const patterns = observeContentPatterns(report.analysis.topCitedPages);
    expect(patterns.some((p) => p.patterns.includes("research"))).toBe(true);
  });

  it("computes new/lost against a prior report and never invents an empty prior", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "ai-vis-nl-"));
    mkdirSync(path.join(cwd, "data/seo"), { recursive: true });
    const first = runAiVisibilityAnalysis({
      cwd,
      exportPath: FIXTURE,
      write: true,
    });
    expect(first.summary.newCitationCount).toBe(0);
    expect(first.summary.lostCitationCount).toBe(0);

    // Simulate a prior page that disappears from the next import
    const prior = JSON.parse(
      readFileSync(path.join(cwd, "data/seo/ai-visibility.json"), "utf8"),
    );
    prior.analysis.topCitedPages.push({
      path: "/guides/legacy-only/",
      citationCount: 1,
      platforms: ["chatgpt"],
      pageType: "guide",
      category: null,
      sampleQueries: ["legacy"],
    });
    writeFileSync(
      path.join(cwd, "data/seo/ai-visibility.json"),
      `${JSON.stringify(prior, null, 2)}\n`,
    );

    const second = runAiVisibilityAnalysis({
      cwd,
      exportPath: FIXTURE,
      write: true,
    });
    expect(second.summary.newCitationCount).toBe(0);
    expect(second.summary.lostCitationCount).toBe(1);
    expect(second.analysis.lostCitations[0]?.path).toBe("/guides/legacy-only/");

    const summary = loadAiVisibilitySummary(cwd);
    expect(summary?.exportAvailable).toBe(true);
    expect(summary?.totalCitations).toBe(7);

    const md = readFileSync(path.join(cwd, "docs/seo/AI-VISIBILITY.md"), "utf8");
    expect(md).toContain("Top cited pages");
    expect(md).toContain("Competitor overlap");
  });

  it("returns empty analysis when export is missing (no fabrication)", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "ai-vis-empty-"));
    const report = runAiVisibilityAnalysis({
      cwd,
      write: false,
    });
    expect(report.summary.exportAvailable).toBe(false);
    expect(report.analysis.totalCitations).toBe(0);
    expect(report.observations).toEqual([]);
  });

  it("writes valid JSON machine output", () => {
    const cwd = mkdtempSync(path.join(tmpdir(), "ai-vis-json-"));
    runAiVisibilityAnalysis({ cwd, exportPath: FIXTURE, write: true });
    const raw = readFileSync(path.join(cwd, "data/seo/ai-visibility.json"), "utf8");
    const parsed = JSON.parse(raw);
    expect(parsed.engineVersion).toBe("1.0.0");
    expect(parsed.complianceNotes.join(" ")).toMatch(/Do not spam/i);
  });
});
