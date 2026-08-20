import { describe, expect, it } from "vitest";
import {
  AUTHORITY_CAVEAT,
  classifyIntent,
  feasibilityLabel,
  runRankingOpportunityAgent,
} from "@/services/site-intelligence/ranking-opportunities";
import { opportunityBandForScore } from "@/services/site-intelligence/bands";

describe("RankingOpportunityAgent", () => {
  it("classifies intent types for weight overlays", () => {
    expect(classifyIntent("crm evaluation checklist", "resource", "/resources/x/")).toBe(
      "tool-resource",
    );
    expect(classifyIntent("best crm software", "best", "/best/crm-software/")).toBe(
      "commercial",
    );
    expect(classifyIntent("hubspot review", "review", "/software/hubspot/")).toBe(
      "product",
    );
    expect(classifyIntent("what is crm", "guide", "/guides/what-is-crm/")).toBe(
      "informational",
    );
  });

  it("maps bands to feasibility labels without probability language", () => {
    expect(feasibilityLabel(opportunityBandForScore(85))).toBe("STRONG OPPORTUNITY");
    expect(feasibilityLabel(opportunityBandForScore(65))).toBe("GOOD OPPORTUNITY");
    expect(feasibilityLabel(opportunityBandForScore(50))).toBe("MODERATE");
    expect(feasibilityLabel(opportunityBandForScore(30))).toBe("DIFFICULT");
    expect(feasibilityLabel(opportunityBandForScore(10))).toBe("VERY DIFFICULT");
  });

  it("writes relative opportunities with authority caveat", async () => {
    const result = await runRankingOpportunityAgent({
      fixture: true,
      write: false,
      archive: false,
      generatedAt: "2026-08-15T16:00:00.000Z",
    });
    expect(result.markdown).toMatch(/Ranking Opportunities/);
    expect(result.markdown).toMatch(/Top 25 strongest opportunities/);
    expect(result.markdown).toMatch(/Cluster opportunities/);
    expect(result.markdown).toMatch(/Low-value topics to avoid/);
    expect(result.markdown).toMatch(AUTHORITY_CAVEAT);
    expect(result.markdown).not.toMatch(/% chance to rank/i);
    expect(result.markdown).not.toMatch(/will rank in \d+ months/i);
    expect(result.report.authorityMeasured).toBe(false);
    expect(result.markdown).toMatch(/Complete CRM ranking opportunity inventory/);
    expect(result.report.opportunities.length).toBeGreaterThan(100);
    expect(
      result.report.opportunities.filter((o) =>
        o.targetPage?.startsWith("/software/"),
      ).length,
    ).toBeGreaterThan(4);
    // Feature + capability pages with shared slugs must both be present
    expect(
      result.report.opportunities.some(
        (o) => o.targetPage === "/features/contact-management/",
      ),
    ).toBe(true);
    expect(
      result.report.opportunities.some(
        (o) => o.targetPage === "/capabilities/contact-management/",
      ),
    ).toBe(true);
    expect(result.report.notes.some((n) => /Full CRM catalogue coverage/i.test(n))).toBe(
      true,
    );
    expect(result.report.clusters.length).toBeGreaterThan(0);
  }, 60_000);
});
