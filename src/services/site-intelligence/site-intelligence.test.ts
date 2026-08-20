import { describe, expect, it } from "vitest";
import {
  SiteIntelligenceAssessmentSchema,
  SITE_INTELLIGENCE_VERSION,
} from "@/domain/schemas/site-intelligence";
import {
  evaluateSiteIntelligence,
  formatOverallSummary,
  getSiteIntelligenceFixture,
  listSiteIntelligenceFixtureIds,
  opportunityBandForScore,
  siteBandForScore,
  weightedContentScore,
  OVERALL_COMPONENT_WEIGHTS,
} from "@/services/site-intelligence";

describe("site intelligence framework", () => {
  it("exposes versioned evaluator and overall weights excluding opportunity/visibility", () => {
    expect(SITE_INTELLIGENCE_VERSION).toBe("1.0.0");
    expect(OVERALL_COMPONENT_WEIGHTS).toMatchObject({
      "technical-seo-health": 0.2,
      "content-quality": 0.3,
      "website-experience": 0.15,
      "content-ecosystem-strength": 0.2,
      "competitive-content-strength": 0.15,
    });
    expect(
      Object.values(OVERALL_COMPONENT_WEIGHTS).reduce((a, b) => a + b, 0),
    ).toBeCloseTo(1, 5);
  });

  it("maps bands without fake ranking probability labels", () => {
    expect(siteBandForScore(82)).toBe("strong");
    expect(opportunityBandForScore(82)).toBe("strong");
    expect(opportunityBandForScore(15)).toBe("very-low");
  });

  it("weights pillars over long-tail volume in content aggregate", () => {
    const weighted = weightedContentScore([
      {
        route: "/best/crm-software/",
        pageType: "best",
        overallScore: 40,
        importance: "pillar",
      },
      ...Array.from({ length: 50 }, (_, i) => ({
        route: `/compare/x-vs-${i}/`,
        pageType: "comparison",
        overallScore: 90,
        importance: "long-tail" as const,
      })),
    ]);
    // pillar weight 20 vs 50×1 long-tail — weak pillar still pulls aggregate down
    expect(weighted).toBeLessThan(80);
    expect(weighted).toBeGreaterThan(40);
  });

  it("covers required fixture archetypes", () => {
    expect(listSiteIntelligenceFixtureIds()).toEqual(
      expect.arrayContaining([
        "technically-strong-thin-content",
        "content-rich-technically-broken",
        "strong-site-no-authority-data",
        "cluster-stronger-than-competitors",
        "cluster-weaker-than-competitors",
      ]),
    );
  });

  it("technically strong but thin content → high A, low B, overall not excellent", () => {
    const a = evaluateSiteIntelligence(
      getSiteIntelligenceFixture("technically-strong-thin-content"),
    );
    expect(SiteIntelligenceAssessmentSchema.safeParse(a).success).toBe(true);
    expect(a.technicalSeoHealth.score).toBeGreaterThanOrEqual(85);
    expect(a.contentQuality.score).toBeLessThan(55);
    expect(a.searchVisibility.availability).toBe("data-not-available");
    expect(a.searchVisibility.score).toBeNull();
    expect(a.competitiveContentStrength.availability).toBe("unavailable");
    expect(a.pageFlags.length).toBeGreaterThan(0);
    expect(a.overallWebsiteQuality.score).toBeLessThan(80);
    expect(a.disclaimer).toMatch(/do not predict Google rankings/i);
    expect(a.rankingOpportunities[0]?.opportunityBand).toBeDefined();
    expect(formatOverallSummary(a)).toMatch(/Overall Website Quality/);
  });

  it("content-rich but technically broken → low A despite high B; flags P0 pages", () => {
    const a = evaluateSiteIntelligence(
      getSiteIntelligenceFixture("content-rich-technically-broken"),
    );
    expect(a.contentQuality.score).toBeGreaterThanOrEqual(85);
    expect(a.technicalSeoHealth.score).toBeLessThan(55);
    expect(a.pageFlags.some((f) => f.route === "/best/crm-software/")).toBe(
      true,
    );
    expect(
      a.nextImprovements.some((n) => /technical P0/i.test(n)),
    ).toBe(true);
    // Overall must not ignore technical breakage
    expect(a.overallWebsiteQuality.score).toBeLessThan(
      a.contentQuality.score!,
    );
  });

  it("strong site with no authority data → overall scored; visibility N/A; authority neutral-unknown", () => {
    const a = evaluateSiteIntelligence(
      getSiteIntelligenceFixture("strong-site-no-authority-data"),
    );
    expect(a.overallWebsiteQuality.availability).toBe("scored");
    expect(a.overallWebsiteQuality.score).toBeGreaterThanOrEqual(75);
    expect(a.searchVisibility.availability).toBe("data-not-available");
    expect(a.authorityLimitations.status).toBe("unavailable");
    expect(a.authorityLimitations.impactOnOpportunity).toBe("neutral-unknown");
    expect(a.competitiveContentStrength.confidence.level).toBe("medium");
    expect(
      a.competitiveContentStrength.confidence.reasons.some((r) =>
        /backlink data unavailable/i.test(r),
      ),
    ).toBe(true);
    const opp = a.rankingOpportunities[0]!;
    expect(opp.score).not.toBeNull();
    expect(opp.confidence.reasons.some((r) => /not a ranking probability/i.test(r))).toBe(
      true,
    );
  });

  it("cluster stronger than competitors → high competitive + strong opportunity", () => {
    const a = evaluateSiteIntelligence(
      getSiteIntelligenceFixture("cluster-stronger-than-competitors"),
    );
    expect(a.competitiveContentStrength.availability).toBe("scored");
    expect(a.competitiveContentStrength.score).toBeGreaterThanOrEqual(80);
    expect(a.competitiveContentStrength.strongerThan.length).toBeGreaterThan(0);
    expect(a.rankingOpportunities[0]?.opportunityBand).toMatch(
      /strong|good/,
    );
    expect(a.searchVisibility.availability).toBe("scored");
    expect(a.searchVisibility.confidence.reasons.some((r) => /SYNTHETIC/i.test(r))).toBe(
      true,
    );
  });

  it("cluster weaker than competitors → low competitive + constrained opportunity", () => {
    const a = evaluateSiteIntelligence(
      getSiteIntelligenceFixture("cluster-weaker-than-competitors"),
    );
    expect(a.competitiveContentStrength.score).toBeLessThan(40);
    expect(a.competitiveContentStrength.weakerThan.length).toBeGreaterThan(0);
    expect(a.authorityLimitations.impactOnOpportunity).toBe("constraining");
    const band = a.rankingOpportunities[0]?.opportunityBand;
    expect(["very-low", "low", "moderate"]).toContain(band);
  });

  it("never invents visibility from quality-only input", () => {
    const a = evaluateSiteIntelligence({
      pages: [
        {
          route: "/x/",
          pageType: "guide",
          overallScore: 99,
          importance: "pillar",
        },
      ],
      experienceDimensions: [
        {
          id: "navigation",
          score: 99,
          reason: "ok",
        },
      ],
      ecosystemDimensions: [
        {
          id: "pillar-coverage",
          score: 99,
          reason: "ok",
        },
      ],
      technicalFindings: [],
      technicalChecks: [],
      competitorPack: null,
      searchVisibility: null,
    });
    expect(a.searchVisibility.availability).toBe("data-not-available");
    expect(a.searchVisibility.score).toBeNull();
    expect(
      a.overallBreakdown.every(
        (r) =>
          r.componentId !== "search-visibility" &&
          r.componentId !== "ranking-opportunity",
      ),
    ).toBe(true);
  });
});
