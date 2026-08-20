import { describe, expect, it } from "vitest";
import { composeWebsiteIntelligence } from "./compose";
import { formatWebsiteIntelligenceMarkdown } from "./report";
import { compareScorecards } from "./history";
import type { CollectedIntelligence } from "./collect";
import type { WebsiteOverviewModel } from "../overview/report";
import type { SiteIntelligenceAssessment } from "@/domain/schemas/site-intelligence";

function stubAssessment(): SiteIntelligenceAssessment {
  return {
    assessedAt: "2026-08-15T12:00:00.000Z",
    scope: { level: "site", id: "softwareglimpse", label: "SoftwareGlimpse" },
    technicalSeoHealth: {
      id: "technical-seo-health",
      label: "Technical SEO Health",
      score: 88,
      availability: "scored",
      confidence: { level: "high", reasons: ["seo health"] },
      evidence: [],
      notes: [],
    },
    contentQuality: {
      id: "content-quality",
      label: "Content Quality",
      score: 82,
      availability: "scored",
      confidence: { level: "high", reasons: ["cq"] },
      evidence: [],
      notes: [],
    },
    websiteExperience: {
      id: "website-experience",
      label: "Website Experience",
      score: 75,
      availability: "scored",
      confidence: { level: "medium", reasons: ["tools"] },
      evidence: [],
      notes: [],
    },
    contentEcosystemStrength: {
      id: "content-ecosystem-strength",
      label: "Content Ecosystem Strength",
      score: 78,
      availability: "scored",
      confidence: { level: "medium", reasons: ["map"] },
      evidence: [],
      notes: [],
    },
    competitiveContentStrength: {
      id: "competitive-content-strength",
      label: "Competitive Content Strength",
      score: null,
      availability: "unavailable",
      confidence: { level: "low", reasons: ["no pack"] },
      evidence: [],
      notes: ["No competitor pack"],
    },
    searchVisibility: {
      id: "search-visibility",
      label: "Search Visibility",
      score: null,
      availability: "unavailable",
      confidence: { level: "low", reasons: ["gsc"] },
      evidence: [],
      notes: ["NOT CONNECTED"],
    },
    overallWebsiteQuality: {
      id: "overall-website-quality",
      label: "Overall Website Quality",
      score: 80,
      availability: "scored",
      band: "strong",
      confidence: { level: "medium", reasons: ["partial competitive"] },
      evidence: [],
      notes: [],
    },
    rankingOpportunities: [],
    authorityLimitations: {
      measured: false,
      summary: "NOT MEASURED",
      constraints: ["Backlink authority NOT MEASURED"],
      notes: [],
    },
    disclaimer:
      "Scores are readiness/usefulness assessments — not Google ranking probabilities.",
  } as SiteIntelligenceAssessment;
}

function stubOverview(): WebsiteOverviewModel {
  return {
    generatedAt: "2026-08-15T12:00:00.000Z",
    agentVersion: "1.0.0",
    inventory: {
      software: 20,
      publishedSoftware: 20,
      comparisons: 120,
      indexableComparisons: 100,
      guides: 40,
      resources: 12,
      useCases: 12,
      capabilities: 15,
      toolsAvailable: 6,
    } as WebsiteOverviewModel["inventory"],
    assessment: stubAssessment(),
    journey: { stages: [], gaps: [], notes: [] },
    strengths: ["Deep CRM comparison library", "Interactive decision tools"],
    weaknesses: ["Search Console not connected"],
    differentiators: ["Implementation-oriented guides"],
    advantages: ["Decision tooling depth"],
    risks: [
      {
        area: "Visibility",
        title: "GSC not connected",
        evidence: "No live search performance",
      },
    ],
    recommendations: [
      {
        priority: "P0",
        area: "Search",
        problem: "No live visibility",
        whyItMatters: "Cannot prioritize near-wins",
        action: "Connect approved GSC import",
        effort: "medium",
        expectedImpact: "Unlock visibility scoring",
        relatedReportIds: ["SEARCH-PERFORMANCE"],
      },
    ],
    sources: [],
    missingInputs: [],
    disclaimer: "test",
  } as unknown as WebsiteOverviewModel;
}

function emptyCollected(): CollectedIntelligence {
  return {
    mode: "FULL",
    sources: [
      {
        id: "SEO-HEALTH-LATEST.md",
        path: "docs/seo/reports/SEO-HEALTH-LATEST.md",
        status: "available",
      },
    ],
    texts: {
      seoHealth: null,
      performance: null,
      internalLinks: null,
      contentIntelligence: null,
      contentQuality: null,
      assetIntelligence: null,
      resourceAudit: null,
      mapCoverage: null,
      serpCompetitors: null,
      competitiveBenchmark: null,
      competitiveGaps: null,
      rankingOpportunities: null,
      searchPerformance: null,
      websiteOverview: null,
    },
    json: {
      competitorPack: null,
      competitiveGaps: null,
      rankingOpportunities: {
        authorityMeasured: false,
        topStrongest: [
          {
            query: "crm implementation checklist",
            targetPage: "/resources/crm-implementation-checklist/",
            opportunityScore: 72,
            feasibility: "GOOD OPPORTUNITY",
            recommendedAction: "Strengthen internal links from category hub",
          },
        ],
        topHardest: [
          {
            query: "crm software",
            targetPage: "/best/crm-software/",
            opportunityScore: 28,
            feasibility: "VERY DIFFICULT",
          },
        ],
        clusters: [
          {
            label: "CRM evaluation",
            avgScore: 65,
            feasibility: "GOOD OPPORTUNITY",
          },
        ],
      },
      searchPerformance: { live: false, synthetic: true },
      contentScores: null,
    },
  };
}

describe("WebsiteIntelligenceOrchestrator compose", () => {
  it("marks Search Console NOT CONNECTED and authority NOT MEASURED", () => {
    const model = composeWebsiteIntelligence({
      generatedAt: "2026-08-15T12:00:00.000Z",
      mode: "FULL",
      cluster: "crm",
      overview: stubOverview(),
      collected: emptyCollected(),
      refreshNotes: ["test"],
    });

    expect(model.scorecard.find((c) => c.id === "visibility")?.display).toBe(
      "NOT CONNECTED",
    );
    expect(model.measurementStatus.some((m) => /NOT MEASURED/.test(m.status))).toBe(
      true,
    );
    expect(model.authorityLimitations.join(" ")).toMatch(/NOT MEASURED/);
    expect(model.executiveVerdict.growthLimits).toMatch(/authority-constrained|NOT MEASURED|NOT CONNECTED/i);
    expect(model.topActions.length).toBeGreaterThan(0);
    expect(model.topActions[0]?.id).toMatch(/^WI-/);
  });

  it("formats required report sections", () => {
    const model = composeWebsiteIntelligence({
      generatedAt: "2026-08-15T12:00:00.000Z",
      mode: "LIGHT",
      cluster: "crm",
      overview: stubOverview(),
      collected: emptyCollected(),
      refreshNotes: [],
    });
    const md = formatWebsiteIntelligenceMarkdown(model);
    expect(md).toContain("# SoftwareGlimpse Website Intelligence");
    expect(md).toContain("## Executive verdict");
    expect(md).toContain("## Scorecard");
    expect(md).toContain("## Top 30 recommended actions");
    expect(md).toContain("## Score history");
    expect(md).not.toMatch(/will rank #1/i);
  });

  it("compares score history with IMPROVED / REGRESSED / UNCHANGED", () => {
    const rows = compareScorecards(
      {
        generatedAt: "2026-08-01T00:00:00.000Z",
        mode: "FULL",
        cluster: "crm",
        scores: { overall: 78, technical: 88, content: 72 },
        displays: { overall: "78 / 100", technical: "88", content: "72" },
      },
      {
        generatedAt: "2026-08-15T00:00:00.000Z",
        mode: "FULL",
        cluster: "crm",
        scores: { overall: 82, technical: 91, content: 72 },
        displays: { overall: "82 / 100", technical: "91", content: "72" },
      },
      {
        overall: "Overall",
        technical: "Technical SEO",
        content: "Content Quality",
      },
    );
    expect(rows.find((r) => r.id === "overall")?.change).toBe("IMPROVED");
    expect(rows.find((r) => r.id === "technical")?.change).toBe("IMPROVED");
    expect(rows.find((r) => r.id === "content")?.change).toBe("UNCHANGED");
  });
});
