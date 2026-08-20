import { describe, expect, it } from "vitest";
import {
  POSITION_METHODOLOGY,
  analyzeSearchPerformance,
  runSearchPerformanceAgent,
} from "@/services/site-intelligence/search-performance";
import { loadFixtureSnapshot } from "@/data/seo/store";
import { isGscConfigured } from "@/services/seo/providers/resolve";

describe("SearchPerformanceAgent / GSC connector", () => {
  it("documents that average position is not a fixed SERP rank", () => {
    expect(POSITION_METHODOLOGY.some((n) => /not a fixed SERP rank/i.test(n))).toBe(
      true,
    );
  });

  it("does not invent GSC credentials as configured when env unset", () => {
    const prevUrl = process.env.GSC_PROPERTY_URL;
    const prevEmail = process.env.GSC_CLIENT_EMAIL;
    const prevCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    delete process.env.GSC_PROPERTY_URL;
    delete process.env.GSC_CLIENT_EMAIL;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
    expect(isGscConfigured()).toBe(false);
    if (prevUrl) process.env.GSC_PROPERTY_URL = prevUrl;
    if (prevEmail) process.env.GSC_CLIENT_EMAIL = prevEmail;
    if (prevCreds) process.env.GOOGLE_APPLICATION_CREDENTIALS = prevCreds;
  });

  it("analyzes fixture snapshots into near-win / CTR signals without claiming live GSC", () => {
    const current = loadFixtureSnapshot("synthetic-28d-current.json");
    const previous = loadFixtureSnapshot("synthetic-28d-previous.json");
    const report = analyzeSearchPerformance({
      generatedAt: "2026-08-15T16:30:00.000Z",
      sourceMode: "fixture",
      current,
      previous,
    });
    expect(report.synthetic).toBe(true);
    expect(report.live).toBe(false);
    expect(report.visibilityMetrics?.synthetic).toBe(true);
    expect(report.methodologyNotes.join(" ")).toMatch(/not a fixed SERP rank/i);
    expect(
      report.nearWins.length +
        report.ctrOpportunities.length +
        report.refreshCandidates.length +
        report.emergingTopics.length,
    ).toBeGreaterThan(0);
  });

  it("writes SEARCH-PERFORMANCE-LATEST from fixture mode", async () => {
    const result = await runSearchPerformanceAgent({
      fixture: true,
      write: true,
      archive: false,
      generatedAt: "2026-08-15T16:30:00.000Z",
    });
    expect(result.markdown).toMatch(/Search Performance/);
    expect(result.markdown).toMatch(/Methodology — average position/);
    expect(result.markdown).toMatch(/Near-win/);
    expect(result.markdown).not.toMatch(/\d+%\s*chance to rank/i);
    expect(result.markdown).not.toMatch(/will rank in \d+ months/i);
    expect(result.report.synthetic).toBe(true);
    expect(result.paths.latest).toBe(
      "docs/site-intelligence/SEARCH-PERFORMANCE-LATEST.md",
    );
  }, 30_000);
});
