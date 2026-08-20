import { describe, expect, it } from "vitest";
import {
  aggregateSerpCompetitors,
  buildCrmQuerySeeds,
  classifyCompetitorDomain,
  runSerpCompetitorDiscoveryAgent,
  SERP_COMPETITOR_DISCOVERY_AGENT,
  SERP_COMPETITOR_FIXTURES,
} from "@/services/site-intelligence/serp-competitors";

describe("SERPCompetitorDiscoveryAgent", () => {
  it("does not mutate production", () => {
    expect(SERP_COMPETITOR_DISCOVERY_AGENT.mutatesProduction).toBe(false);
  });

  it("builds a bounded CRM query set with associated pages", () => {
    const seeds = buildCrmQuerySeeds({ max: 28 });
    expect(seeds.length).toBeGreaterThan(10);
    expect(seeds.length).toBeLessThanOrEqual(28);
    expect(seeds.some((s) => s.query === "best crm software")).toBe(true);
    expect(
      seeds.some((s) => s.associatedPage === "/best/crm-software/"),
    ).toBe(true);
  });

  it("builds full CRM catalogue coverage including all product review hubs", () => {
    const seeds = buildCrmQuerySeeds({ coverage: "full" });
    const products = seeds.filter((s) => s.source === "product");
    expect(products.length).toBeGreaterThan(4);
    expect(seeds.length).toBeGreaterThan(100);
    expect(
      seeds.every((s) => s.associatedPage && s.associatedPage.startsWith("/")),
    ).toBe(true);
    expect(seeds.every((s) => !/\[[^\]]+\]/.test(s.associatedPage!))).toBe(
      true,
    );
    // One seed per page
    const pages = seeds.map((s) => s.associatedPage);
    expect(new Set(pages).size).toBe(pages.length);
    // Shared taxonomy slugs must not collapse feature vs capability
    expect(
      seeds.some((s) => s.associatedPage === "/features/contact-management/"),
    ).toBe(true);
    expect(
      seeds.some((s) => s.associatedPage === "/capabilities/contact-management/"),
    ).toBe(true);
  });

  it("classifies domains by type without a business-competitor list", () => {
    expect(classifyCompetitorDomain("g2.com")).toBe("software-marketplace");
    expect(classifyCompetitorDomain("pcmag.com")).toBe(
      "direct-review-affiliate",
    );
    expect(classifyCompetitorDomain("hubspot.com")).toBe("vendor");
    expect(classifyCompetitorDomain("reddit.com")).toBe("community");
    expect(classifyCompetitorDomain("gartner.com")).toBe("consultancy");
  });

  it("does not assume one competitor set for all queries", () => {
    const seeds = buildCrmQuerySeeds({ max: 10 });
    const report = aggregateSerpCompetitors({
      cluster: "crm",
      seeds,
      serpResults: Object.values(SERP_COMPETITOR_FIXTURES),
      generatedAt: "2026-08-15T12:00:00.000Z",
      provider: "fixture",
    });
    const best = report.byQuery.find((q) => q.query === "best crm software");
    const migration = report.byQuery.find((q) => q.query === "crm migration");
    expect(best?.competitors.some((c) => c.domain === "g2.com")).toBe(true);
    expect(migration?.competitors.some((c) => c.domain === "hubspot.com")).toBe(
      true,
    );
    // Migration SERP should not be identical to best-CRM SERP
    const bestDomains = new Set(best?.competitors.map((c) => c.domain));
    const migDomains = migration!.competitors.map((c) => c.domain);
    expect(migDomains.every((d) => bestDomains.has(d))).toBe(false);
  });

  it("runs fixture discovery and writes reports", async () => {
    const result = await runSerpCompetitorDiscoveryAgent({
      fixture: true,
      write: true,
      archive: true,
      generatedAt: "2026-08-15T12:00:00.000Z",
      maxQueries: 20,
    });
    expect(result.live).toBe(false);
    expect(result.markdown).toMatch(/SERP Competitors/);
    expect(result.markdown).toMatch(/Query-level competitors/);
    expect(result.querySetMarkdown).toMatch(/CRM Query Set/);
    expect(result.paths.latest).toBe(
      "docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md",
    );
    expect(result.paths.querySet).toBe(
      "docs/site-intelligence/competitors/CRM-QUERY-SET.md",
    );
    expect(result.paths.snapshot).toMatch(/snapshots\/2026-08-15-crm-serp\.json/);
  });
});
