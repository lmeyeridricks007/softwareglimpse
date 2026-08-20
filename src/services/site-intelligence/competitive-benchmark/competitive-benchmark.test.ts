import { describe, expect, it } from "vitest";
import {
  clusterIdForQuery,
  runCompetitorWebsiteAnalysisAgent,
  sampleCompetitorClusters,
  scorePageObservation,
} from "@/services/site-intelligence/competitive-benchmark";
import { aggregateSerpCompetitors } from "@/services/site-intelligence/serp-competitors/aggregate";
import { SERP_COMPETITOR_FIXTURES } from "@/services/site-intelligence/serp-competitors/fixtures";
import { buildCrmQuerySeeds } from "@/services/site-intelligence/serp-competitors/query-seeds";
import { getFixtureObservation } from "@/services/site-intelligence/competitive-benchmark/fixtures";

describe("CompetitorWebsiteAnalysisAgent", () => {
  it("clusters queries by intent family", () => {
    expect(clusterIdForQuery("best crm software")).toBe("best-list");
    expect(clusterIdForQuery("hubspot vs pipedrive")).toBe("comparison");
    expect(clusterIdForQuery("crm migration")).toBe("migration-implementation");
    expect(clusterIdForQuery("crm evaluation checklist")).toBe(
      "evaluation-checklist",
    );
  });

  it("samples 3–8 domains per cluster from SERP results only", () => {
    const seeds = buildCrmQuerySeeds({ max: 28 });
    const serpResults = seeds.map((s) => {
      const fix = SERP_COMPETITOR_FIXTURES[s.query];
      return (
        fix ?? {
          query: s.query,
          searchedAt: "2026-08-15T00:00:00.000Z",
          provider: "fixture",
          results: [],
        }
      );
    });
    const report = aggregateSerpCompetitors({
      cluster: "crm",
      seeds,
      serpResults,
      generatedAt: "2026-08-15T00:00:00.000Z",
      provider: "fixture",
    });
    const clusters = sampleCompetitorClusters(report);
    expect(clusters.length).toBeGreaterThan(0);
    for (const c of clusters) {
      expect(c.domains.length).toBeGreaterThanOrEqual(3);
      expect(c.domains.length).toBeLessThanOrEqual(8);
    }
    const best = clusters.find((c) => c.id === "best-list");
    expect(best?.domains.some((d) => d.domain === "g2.com")).toBe(true);
  });

  it("scores only observable dimensions and leaves unknowns null", () => {
    const obs = getFixtureObservation(
      "https://www.g2.com/categories/crm",
      "best crm software",
    );
    expect(obs).toBeTruthy();
    const scored = scorePageObservation(obs!);
    expect(scored.dimensions.length).toBeGreaterThanOrEqual(20);
    expect(
      scored.dimensions.find((d) => d.id === "search-intent-alignment")?.score,
    ).toBeGreaterThan(50);
    expect(scored.overall).not.toBeNull();
  });

  it("writes benchmark + per-domain profiles in fixture mode", async () => {
    const result = await runCompetitorWebsiteAnalysisAgent({
      fixture: true,
      write: true,
      archive: false,
      generatedAt: "2026-08-15T14:00:00.000Z",
    });
    expect(result.markdown).toMatch(/Competitive Website Benchmark/);
    expect(result.markdown).toMatch(/Page-by-page benchmarks/);
    expect(result.report.profiles.length).toBeGreaterThanOrEqual(3);
    expect(Object.keys(result.domainMarkdown).length).toBe(
      result.report.profiles.length,
    );
    expect(result.paths.latest).toBe(
      "docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md",
    );
    // Disclaims unverified metrics rather than reporting them
    expect(result.markdown).toMatch(/Do not claim traffic/);
    expect(result.markdown).toMatch(/No traffic, DA, backlinks/);
    expect(result.markdown).not.toMatch(/\bDA:\s*\d+/);
  }, 30_000);
});
