import { describe, expect, it } from "vitest";
import {
  analyzeContentGaps,
  isMissingStatus,
  loadMapRegister,
  programmaticDoNotCreate,
  runContentGapOpportunityAgent,
  selectTop50,
} from "./index";

describe("content gap opportunity agent", () => {
  it("parses CRM content map register rows", () => {
    const rows = loadMapRegister();
    expect(rows.length).toBeGreaterThan(50);
    const tools = rows.filter((r) => r.id.startsWith("CRM-TOOL-"));
    expect(tools.some((t) => t.id === "CRM-TOOL-004")).toBe(true);
    expect(
      rows.filter((r) => isMissingStatus(r.statusRaw)).map((r) => r.id),
    ).toEqual([]);
  });

  it("flags programmatic permutations as DO NOT CREATE", () => {
    const dnc = programmaticDoNotCreate();
    expect(dnc.every((o) => o.decision === "DO NOT CREATE")).toBe(true);
    expect(
      dnc.some((o) => /every industry|product×industry|× every industry/i.test(o.title)),
    ).toBe(true);
  });

  it("classifies missing tools and thin industries without inventing mass pages", () => {
    const { opportunities, counts, duplicates } = analyzeContentGaps();
    expect(opportunities.length).toBeGreaterThan(15);
    expect(counts["DO NOT CREATE"]).toBeGreaterThanOrEqual(3);
    expect(
      opportunities.filter(
        (o) =>
          o.decision === "CREATE" &&
          o.type === "TOOL" &&
          /roi calculator|rfp \/ vendor|plan selector|migration cost|adoption \/ health|multi-product compare/i.test(
            o.title,
          ),
      ),
    ).toEqual([]);
    expect(
      opportunities.some(
        (o) =>
          o.decision === "RESEARCH FIRST" &&
          /industry|best crm/i.test(o.title + o.suggestedRoute),
      ),
    ).toBe(true);
    expect(duplicates.some((d) => d.id === "DUP-SMB")).toBe(true);
    // No mass HubSpot-for-each-industry CREATE recommendations
    expect(
      opportunities.filter(
        (o) =>
          o.decision === "CREATE" &&
          o.type === "PRODUCT × INDUSTRY",
      ).length,
    ).toBe(0);
  });

  it("writes opportunities report without mutating content when dry", () => {
    const result = runContentGapOpportunityAgent({
      write: false,
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(result.summary.total).toBeGreaterThan(15);
    expect(selectTop50(analyzeContentGaps().opportunities).length).toBeLessThanOrEqual(
      50,
    );
    expect(result.markdown).toContain("# New Content Opportunities");
    expect(result.markdown).toContain("## Top 50 new content opportunities");
    expect(result.markdown).toContain("## Duplicate / cannibalization report");
    expect(result.markdown).toContain("## Pillar support analysis");
    expect(result.markdown).toContain("ContentGapOpportunityAgent");
    expect(result.summary.documentPath).toBe(
      "docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md",
    );
    expect(
      analyzeContentGaps().opportunities.every((o) => o.id.startsWith("CG-")),
    ).toBe(true);
  });
});
