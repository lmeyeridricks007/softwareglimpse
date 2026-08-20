import { describe, expect, it } from "vitest";
import { loadContentMapNodes } from "./content-map";
import { generateImprovementOpportunities } from "./generate";
import { runContentImprovementOpportunityAgent } from "./agent";
import { runContentQualityAudit } from "../audit-engine";

describe("content improvement opportunity agent", () => {
  it("parses content map routes with priorities", () => {
    const map = loadContentMapNodes();
    expect(map.size).toBeGreaterThan(50);
    const best = map.get("/best/crm-software/");
    expect(best?.priority).toBe("P0");
    expect(best?.id).toMatch(/^CRM-/);
  });

  it("does not treat approved industry hubs as thin keyword-swap pages", () => {
    const audit = runContentQualityAudit({
      scope: "industry",
      writeReports: false,
      writeMaster: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    const { opportunities, patterns } = generateImprovementOpportunities(
      audit.results,
    );
    const thinKeywordSwap = opportunities.filter(
      (o) =>
        o.pageType === "industry" &&
        /generic CRM category page with industry keywords/i.test(o.problem),
    );
    expect(thinKeywordSwap).toEqual([]);
    expect(patterns.some((p) => p.id === "SYS-INDUSTRY-DEPTH")).toBe(false);
  });

  it("does not flag Best CRM for missing rationales when approved picks exist", () => {
    const audit = runContentQualityAudit({
      scope: "crm",
      pageTypes: ["best"],
      writeReports: false,
      writeMaster: false,
      evaluatedAt: "2026-08-18T00:00:00.000Z",
    });
    const { opportunities } = generateImprovementOpportunities(audit.results);
    expect(
      opportunities.some(
        (o) =>
          o.route === "/best/crm-software/" &&
          /lacks complete approved rationales/i.test(o.problem),
      ),
    ).toBe(false);
  });

  it("writes backlog summary without mutating content when requested dry", () => {
    const result = runContentImprovementOpportunityAgent({
      write: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(result.summary.total).toBeGreaterThan(20);
    expect(result.summary.top20.length).toBe(20);
    expect(result.markdown).toContain("# Content Improvement Backlog");
    expect(result.markdown).toContain("## Top 50 ranked improvements");
    expect(result.markdown).toContain("## Quick wins");
    expect(result.markdown).toContain("## Systemic patterns");
  });
});
