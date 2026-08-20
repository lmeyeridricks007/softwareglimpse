import { describe, expect, it } from "vitest";
import {
  runWebsiteOverviewAgent,
  WEBSITE_OVERVIEW_AGENT,
  buildSiteInventory,
  listOverviewReportSources,
} from "@/services/site-intelligence/overview";

describe("WebsiteOverviewAgent", () => {
  it("does not mutate production (contract)", () => {
    expect(WEBSITE_OVERVIEW_AGENT.mutatesProduction).toBe(false);
  });

  it("lists expected report sources", () => {
    const sources = listOverviewReportSources();
    expect(sources.some((s) => s.id === "seo-health")).toBe(true);
    expect(sources.some((s) => s.id === "content-intelligence")).toBe(true);
    expect(sources.some((s) => s.id === "asset-intelligence")).toBe(true);
    expect(sources.some((s) => s.id === "content-map")).toBe(true);
  });

  it(
    "builds a non-empty site inventory without writing",
    () => {
      const inv = buildSiteInventory();
      expect(inv.sitemapUrls).toBeGreaterThan(0);
      expect(inv.publishedSoftware).toBeGreaterThan(0);
      expect(inv.clusters.length).toBeGreaterThan(5);
    },
    30_000,
  );

  it(
    "produces executive overview markdown from existing reports",
    () => {
      const result = runWebsiteOverviewAgent({
        write: false,
        archive: false,
        generatedAt: "2026-08-15T10:30:00.000Z",
      });
      expect(result.markdown).toMatch(/OVERALL WEBSITE QUALITY/);
      expect(result.markdown).toMatch(/Executive scorecard/);
      expect(result.markdown).toMatch(/User journey assessment/);
      expect(result.markdown).toMatch(/Top 25 recommendations/);
      expect(result.model.assessment.searchVisibility.availability).toBe(
        "data-not-available",
      );
      expect(
        result.model.assessment.competitiveContentStrength.availability,
      ).toBe("unavailable");
      expect(result.model.recommendations.length).toBeGreaterThan(0);
      expect(result.model.recommendations.length).toBeLessThanOrEqual(25);
      expect(result.model.journey.length).toBeGreaterThanOrEqual(10);
      expect(result.markdown).toMatch(/do not predict Google rankings/i);
    },
    60_000,
  );

  it(
    "writes latest + archive when requested",
    () => {
      const result = runWebsiteOverviewAgent({
        write: true,
        archive: true,
        generatedAt: "2026-08-15T10:30:00.000Z",
      });
      expect(result.paths.latest).toBe(
        "docs/site-intelligence/WEBSITE-OVERVIEW-LATEST.md",
      );
      expect(result.paths.archive).toMatch(
        /docs\/site-intelligence\/archive\/2026-08-15-website-overview\.md/,
      );
    },
    60_000,
  );
});
