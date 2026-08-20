import { describe, expect, it } from "vitest";
import { analyzePageRankingReadiness } from "./analyze";
import { formatPageRankingReadinessMarkdown } from "./report";
import { resolvePageInput } from "./resolve-page";
import { normalizeRoute, routeToSlug } from "./types";
import type { PageReadinessContext } from "./load-context";
import type { ResolvedPage } from "./resolve-page";

describe("PageRankingReadinessAgent helpers", () => {
  it("normalizes routes and content ids", () => {
    expect(normalizeRoute("/best/crm-software")).toBe("/best/crm-software/");
    expect(normalizeRoute("software:pipedrive")).toBe("/software/pipedrive/");
    expect(normalizeRoute("guide:how-to-choose-crm")).toBe(
      "/guides/how-to-choose-crm/",
    );
    expect(routeToSlug("/resources/crm-evaluation-checklist/")).toBe(
      "resources-crm-evaluation-checklist",
    );
  });

  it("resolves known catalog pages", () => {
    const page = resolvePageInput("/guides/how-to-choose-crm/");
    expect(page.route).toBe("/guides/how-to-choose-crm/");
    expect(page.existsInCatalog).toBe(true);
    expect(page.title).toBeTruthy();
  });
});

describe("PageRankingReadinessAgent analyze", () => {
  it("scores readiness without promising rankings and marks authority NOT MEASURED", () => {
    const page: ResolvedPage = {
      input: "/best/crm-software/",
      route: "/best/crm-software/",
      slug: "best-crm-software",
      contentId: "best-crm",
      title: "Best CRM Software",
      pageType: "best",
      existsInCatalog: true,
      indexableHint: true,
      indexableReason: "indexable",
      publishedHint: true,
      relatedToolIds: [],
    };

    const ctx: PageReadinessContext = {
      page,
      cq: {
        score: 88,
        band: "strong",
        pageType: "best",
        priority: "CQ-P0",
        title: "Best CRM Software",
      },
      scoresAvailable: true,
      seeds: [],
      relatedSeeds: [
        {
          query: "best crm software",
          intent: "commercial",
          cluster: "crm",
          associatedPage: "/best/crm-software/",
          source: "pillar",
        },
      ],
      ranking: null,
      relatedOpportunities: [
        {
          query: "best crm software",
          intent: "commercial",
          intentClass: "commercial",
          targetPage: "/best/crm-software/",
          currentRank: null,
          opportunityScore: 55,
          feasibility: "MODERATE",
          confidence: "medium",
          competitorStrength: 72,
          dimensions: [
            {
              id: "intent-match",
              score: 90,
              reason: "match",
              available: true,
            },
            {
              id: "evidence-quality",
              score: 60,
              reason: "ok",
              available: true,
            },
            {
              id: "internal-link-support",
              score: 50,
              reason: "thin",
              available: true,
            },
          ],
          strengths: ["intent"],
          weaknesses: ["authority"],
          requiredImprovements: ["Deepen comparison modules"],
          internalLinksRequired: ["Link from category hub"],
          supportingContentNeeded: [],
          researchNeeded: [],
          authorityCaveat: "NOT MEASURED",
          recommendedAction: "Improve existing page",
          clusterIds: ["crm-buying"],
        },
      ],
      gaps: null,
      pageGaps: { advantages: [], weaker: [], missing: [] },
      benchmark: null,
      relatedBenchmarks: [
        {
          query: "best crm software",
          clusterId: "best-list",
          softwareGlimpsePage: "/best/crm-software/",
          rows: [
            {
              label: "SoftwareGlimpse",
              domain: "softwareglimpse.com",
              url: "https://softwareglimpse.com/best/crm-software/",
              dimensions: {
                "content-depth": 78,
                "original-value": 70,
                evidence: 70,
                tools: 20,
                "product-screenshots": 45,
                freshness: 75,
              },
              notes: [],
            },
            {
              label: "zapier.com",
              domain: "zapier.com",
              url: "https://zapier.com/blog/best-crm-app/",
              dimensions: {
                "content-depth": 80,
                "original-value": 60,
                evidence: 65,
                tools: 40,
                "product-screenshots": 70,
                freshness: 80,
              },
              notes: [],
            },
          ],
        },
      ],
      searchPerf: { live: false, synthetic: true, rows: [] },
      technicalFindings: [],
      linkingNotes: ["Site-wide internal linking report available"],
      assetNotes: ["No page-specific asset excerpt"],
      sources: [],
    };

    const report = analyzePageRankingReadiness(ctx, "2026-08-15T12:00:00.000Z");
    expect(report.rankingReadiness).toBeGreaterThan(40);
    expect(report.rankingReadiness).toBeLessThanOrEqual(100);
    expect(report.feasibility).toBeTruthy();
    expect(report.authorityLimitation).toMatch(/NOT MEASURED/);
    expect(
      report.dimensions.find((d) => d.id === "authority-limitation")?.status,
    ).toBe("not-measured");
    expect(
      report.dimensions.find((d) => d.id === "search-performance")?.status,
    ).toBe("not-connected");
    expect(report.improvements.mustDo.length).toBeGreaterThan(0);
    expect(report.improvements.avoid.some((a) => /ranking/i.test(a))).toBe(
      true,
    );
    expect(report.competitors.length).toBeGreaterThan(0);

    const md = formatPageRankingReadinessMarkdown(report);
    expect(md).toContain("## RANKING READINESS");
    expect(md).toContain("## WHY");
    expect(md).toContain("## REQUIRED IMPROVEMENTS");
    expect(md).toContain("## COMPETITOR BENCHMARK");
    expect(md).not.toMatch(/will rank #1/i);
    expect(md).not.toMatch(/\d+% chance/i);
  });
});
