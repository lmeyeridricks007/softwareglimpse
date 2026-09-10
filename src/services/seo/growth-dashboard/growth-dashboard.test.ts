import { describe, expect, it } from "vitest";
import { buildGrowthDashboard } from "@/services/seo/growth-dashboard";
import { buildOrganicSearchSection } from "@/services/seo/growth-dashboard/organic";
import { buildIndexingSection } from "@/services/seo/growth-dashboard/indexing";
import { buildCommercialSection } from "@/services/seo/growth-dashboard/quality-authority";
import { formatGrowthDashboardMarkdown } from "@/services/seo/growth-dashboard/report";
import { classifyDataValidity, validityAllowsNorthStar } from "@/services/seo/growth-dashboard/validity";

describe("Growth Dashboard", () => {
  it(
    "builds v2 report without fabricating commercial clicks/revenue",
    () => {
      const report = buildGrowthDashboard();
      expect(report.engineVersion).toBe("2.3.0");
      expect(report.strategyLabel).toMatch(/PRESERVE/);
      expect(report.scorecard).toHaveLength(6);
      expect(report.scorecard.map((p) => p.id)).toEqual(
        expect.arrayContaining([
          "high_quality_pages",
          "promoted_pages",
          "page_one_rankings",
          "organic_clicks",
          "evidence",
          "relevant_links",
        ]),
      );
      expect(["not_connected", "number"]).toContain(
        report.commercial.affiliateClicks.kind,
      );
      expect(report.commercial.revenue.kind).toBe("not_connected");
      expect(report.commercial.conversions.kind).toBe("not_connected");
      expect(report.commercial.validity).not.toBe("FIXTURE");
      expect(report.authority.validity).not.toBe("FIXTURE");
      expect(Array.isArray(report.authority.sampleLinks)).toBe(true);
      expect(report.organicSearch.trend.note).toMatch(
        /prior|comparable|REAL GSC|No paired|Only one/i,
      );
      expect(report.contentEstate.totals.total).toBeGreaterThan(0);
      expect(report.improvementVelocity.windowLabel).toMatch(/7/);
      expect(report.organicSearch.discovery).toBeDefined();
      expect(report.organicSearch.ranking.top10).toBeDefined();
      expect(report.organicSearch.ctrDetail).toBeDefined();
      expect(report.organicSearch.traffic).toBeDefined();
    },
    90_000,
  );

  it("does not label search on_track from Top-10 count or impressions alone", () => {
    const report = buildGrowthDashboard();
    const pageOne = report.scorecard.find((p) => p.id === "page_one_rankings");
    const clicks = report.scorecard.find((p) => p.id === "organic_clicks");
    // With low real clicks, organic_clicks must not be on_track
    if (
      report.organicSearch.validity === "REAL" &&
      report.organicSearch.clicks.kind === "number" &&
      report.organicSearch.clicks.value < 100
    ) {
      expect(clicks?.status).not.toBe("on_track");
      expect(clicks?.status).not.toBe("strong");
    }
    // Thin absolute volume must not read as strong
    if (
      report.organicSearch.validity === "REAL" &&
      report.organicSearch.clicks.kind === "number" &&
      report.organicSearch.clicks.value < 50
    ) {
      expect(clicks?.evidence.join(" ")).toMatch(/too thin|not strong/i);
      expect(["insufficient_trend", "behind", "building"]).toContain(
        clicks?.status,
      );
    }
    expect(pageOne?.status).not.toBe("strong");
    expect(pageOne?.status).not.toBe("on_track");
    // Missing historical trend → insufficient_trend (not on_track from Top-10 count)
    if (
      report.organicSearch.validity === "REAL" &&
      report.organicSearch.trend.status === "not_connected"
    ) {
      expect(pageOne?.status).toBe("insufficient_trend");
      expect(pageOne?.trendAvailability).toBe("unavailable");
      expect(pageOne?.confidence).toBe("low");
    }
  }, 90_000);

  it("attaches confidence, freshness, trend, and evidence to every objective", () => {
    const report = buildGrowthDashboard();
    for (const objective of report.scorecard) {
      expect(["high", "medium", "low"]).toContain(objective.confidence);
      expect(["available", "partial", "unavailable"]).toContain(
        objective.trendAvailability,
      );
      expect(objective).toHaveProperty("dataFreshness");
      expect(objective.evidence.length).toBeGreaterThan(0);
      expect(objective.status).toBeDefined();
    }
    expect(report.engineVersion).toBe("2.3.0");
    expect(report.organicSearch.pageOneQuality.top10Clicks.kind).not.toBe(
      undefined,
    );
  }, 90_000);

  it("exposes page-one quality mix beyond Top-10 page count", () => {
    const organic = buildOrganicSearchSection();
    expect(organic.pageOneQuality.top10PagesWith100PlusImpressions.kind).toBe(
      "number",
    );
    expect(organic.pageOneQuality.top10PagesWithClicks.kind).toBe("number");
    expect(organic.pageOneQuality.top10CommercialPages.kind).toBe("number");
    expect(organic.pageOneQuality.top10ShareOfImpressions.kind).toBe("percent");
    expect(organic.pageOneQuality.siteCtr.kind).toBe("percent");
    expect(organic.pageOneQuality.note).toMatch(/not page count alone/i);
  });

  it("connects organic search with discovery/ranking/ctr/traffic", () => {
    const organic = buildOrganicSearchSection();
    expect(organic.status).toBe("connected");
    expect(organic.discovery.impressions.kind).toBe("number");
    expect(organic.ranking.band11to20.kind).toBe("number");
    expect(organic.traffic.organicClicks.kind).toBe("number");
    expect(["REAL", "FIXTURE", "STALE"]).toContain(organic.validity);
  });

  it("uses sitemap URL count as indexable denominator — not guides+compare proxy ratio", () => {
    const indexing = buildIndexingSection();
    expect(indexing.sitemapUrlCount.kind).toBe("number");
    if (indexing.sitemapUrlCount.kind === "number") {
      expect(indexing.sitemapUrlCount.value).toBeGreaterThan(100);
    }
    // Ratio must not be a false proxy percentage
    expect(indexing.indexationRatio.kind).toBe("not_connected");
    expect(
      indexing.indexationRatio.kind === "not_connected"
        ? indexing.indexationRatio.label
        : "",
    ).toMatch(/not comparable|Need both|comparable/i);
  }, 60_000);

  it("classifies fixture paths as FIXTURE and never allows FIXTURE for north-star", () => {
    expect(
      classifyDataValidity({
        connected: true,
        sourcePath: "src/data/seo/fixtures/ai-visibility-export-sample.csv",
      }),
    ).toBe("FIXTURE");
    expect(classifyDataValidity({ connected: false })).toBe("NOT_CONNECTED");
    expect(validityAllowsNorthStar("FIXTURE")).toBe(false);
    expect(validityAllowsNorthStar("STALE")).toBe(false);
    expect(validityAllowsNorthStar("NOT_CONNECTED")).toBe(false);
    expect(validityAllowsNorthStar("REAL")).toBe(true);
  });

  it("never fabricates commercial revenue; clicks optional until store exists", () => {
    const commercial = buildCommercialSection();
    expect(commercial.revenue.kind).toBe("not_connected");
    expect(commercial.conversions.kind).toBe("not_connected");
    expect(commercial.validity).not.toBe("FIXTURE");
    if (commercial.affiliateClicks.kind === "not_connected") {
      expect(commercial.validity).toBe("NOT_CONNECTED");
    } else {
      // Clicks alone without network conversions → PARTIAL (never fake conversion zeros)
      expect(["REAL", "STALE", "PARTIAL"]).toContain(commercial.validity);
      expect(commercial.conversions.kind).toBe("not_connected");
    }
  });

  it(
    "formats markdown with strategy, estate, and validity language",
    () => {
      const report = buildGrowthDashboard();
      const md = formatGrowthDashboardMarkdown(report);
      expect(md).toContain("PRESERVE");
      expect(md).toContain("North-star objectives");
      expect(md).toContain("Content estate");
      expect(md).toContain("Improvement velocity");
      expect(md).toContain("Sitemap URL count");
      expect(md).toContain("not connected");
      expect(md).toContain("Top-10 pages ≥100 impressions");
      expect(md).toContain("Top-10 share of impressions");
      expect(md).not.toMatch(/Revenue \| \$0/);
      expect(md).toMatch(/REAL|FIXTURE|NOT_CONNECTED|STALE/);
    },
    90_000,
  );

  it(
    "exposes source inventory with validity",
    () => {
      const report = buildGrowthDashboard();
      const affiliate = report.sourceInventory.find(
        (s) => s.id === "affiliate_analytics",
      );
      expect(affiliate?.validity).not.toBe("FIXTURE");
      expect(["not_connected", "partial", "connected"]).toContain(
        affiliate?.status,
      );
      expect(report.aiVisibility.validity).toBe("NOT_CONNECTED");
      expect(report.aiVisibility.citations.kind).toBe("not_connected");
      expect(report.contentQuality.evidenceTrend.length).toBeGreaterThan(0);
    },
    90_000,
  );
});
