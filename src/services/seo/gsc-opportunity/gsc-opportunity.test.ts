import { describe, expect, it } from "vitest";
import {
  improvePromotionBoostScore,
  improvementLikelihoodScore,
  scorePageOpportunity,
} from "@/services/seo/gsc-opportunity/score";
import { resolveOpportunityQueueBucket } from "@/services/seo/gsc-opportunity/estate";
import { resolveCreateCandidate } from "@/services/seo/gsc-opportunity/existing-page";
import {
  gateQuerySpecificActions,
  inferPageQueryMapping,
  mapQueriesFromPageQueryMatrix,
} from "@/services/seo/gsc-opportunity/query-map";
import {
  aggregatePageQueryMatrix,
  parsePageQueryCsv,
} from "@/services/seo/gsc-opportunity/ingest";

describe("GSC opportunity scoring — IMPROVE promotion", () => {
  it("does not crush likelihood for improve-promotion pages with demand", () => {
    const improve = improvementLikelihoodScore({
      position: 18,
      impressions: 80,
      qualityGap: 0.7,
      rootCauseCount: 3,
      indexable: false,
      improvePromotion: true,
    });
    const crushedLegacy = improvementLikelihoodScore({
      position: 18,
      impressions: 80,
      qualityGap: 0.7,
      rootCauseCount: 3,
      indexable: false,
      improvePromotion: false,
    });
    expect(improve).toBeGreaterThan(crushedLegacy);
    expect(improve).toBeGreaterThan(0.6);
  });

  it("boosts Queue B pages with positions 8–35 and impressions", () => {
    expect(
      improvePromotionBoostScore({
        improvePromotion: true,
        impressions: 120,
        position: 15,
      }),
    ).toBe(1);

    const scored = scorePageOpportunity({
      impressions: 120,
      position: 15,
      ctr: 0.01,
      queryCount: 3,
      commercialIntent: "buying_guide",
      pageType: "guide",
      qualityScore: 55,
      completenessSignals: 2,
      inboundLinks: 1,
      outboundLinks: 2,
      lastUpdated: null,
      topicalMatch: 0.6,
      cannibalizationRisk: 0.1,
      rootCauseCount: 2,
      indexable: false,
      improvePromotion: true,
    });
    const indexed = scorePageOpportunity({
      impressions: 120,
      position: 15,
      ctr: 0.01,
      queryCount: 3,
      commercialIntent: "buying_guide",
      pageType: "guide",
      qualityScore: 55,
      completenessSignals: 2,
      inboundLinks: 1,
      outboundLinks: 2,
      lastUpdated: null,
      topicalMatch: 0.6,
      cannibalizationRisk: 0.1,
      rootCauseCount: 2,
      indexable: true,
      improvePromotion: false,
    });
    expect(scored.opportunityScore).toBeGreaterThanOrEqual(
      indexed.opportunityScore - 5,
    );
    expect(scored.scoreBreakdown.improvePromotionBoost).toBeGreaterThan(0);
  });
});

describe("queue buckets", () => {
  it("routes IMPROVE lifecycle to improve_promotion", () => {
    expect(
      resolveOpportunityQueueBucket({
        seoIndexable: false,
        lifecycleState: "IMPROVE",
      }),
    ).toBe("improve_promotion");
    expect(
      resolveOpportunityQueueBucket({
        seoIndexable: true,
        lifecycleState: "INDEXABLE",
      }),
    ).toBe("indexed_improvement");
  });
});

describe("existing-page-first", () => {
  it("prefers an existing software hub when the query names a known product", () => {
    const resolution = resolveCreateCandidate({
      query: "hubspot crm",
      impressions: 200,
      intent: "review",
      reason: "no strong page match",
      scoredPaths: ["/guides/how-to-choose-crm/", "/software/hubspot/"],
    });
    expect(resolution.createCandidateSuggested).toBe(false);
    expect(resolution.improveExisting?.path).toContain("/software/");
  });
});

const SITE_QUERIES = [
  {
    query: "software seo",
    clicks: 0,
    impressions: 5000,
    ctr: 0,
    position: 40,
  },
  {
    query: "pipedrive vs hubspot",
    clicks: 0,
    impressions: 400,
    ctr: 0,
    position: 55,
  },
  {
    query: "plumber crm",
    clicks: 0,
    impressions: 300,
    ctr: 0,
    position: 50,
  },
  {
    query: "microsoft dynamics crm",
    clicks: 1,
    impressions: 1900,
    ctr: 0.0005,
    position: 80,
  },
  {
    query: "hubspot crm",
    clicks: 5,
    impressions: 800,
    ctr: 0.006,
    position: 12,
  },
  {
    query: "diginius crm",
    clicks: 0,
    impressions: 40,
    ctr: 0,
    position: 35,
  },
];

describe("query provenance — suppress known false mappings", () => {
  it("does not assign 'software seo' as target query for unrelated software pages", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/software/diginius/",
        title: "Diginius CRM Review",
        pageType: "product-review",
        productSlugs: ["diginius"],
        categorySlugs: ["crm"],
      },
      SITE_QUERIES,
    );

    expect(mapping.provenance).toBe("INFERRED");
    expect(mapping.relationshipSource).not.toBe("DIRECT_GSC");
    expect(mapping.targetQuery).not.toBe("software seo");
    expect(mapping.actionConfidence).not.toBe("EVIDENCED");
    // Generic query must not become HIGH primary
    const softwareSeo = mapping.inferredQueryCandidates.find(
      (c) => c.query === "software seo",
    );
    if (softwareSeo) {
      expect(["LOW", "UNKNOWN", "MEDIUM"]).toContain(
        softwareSeo.mappingConfidence,
      );
      expect(softwareSeo.mappingConfidence).not.toBe("HIGH");
      expect(softwareSeo.relationshipSource).not.toBe("INFERRED_HIGH");
      expect(softwareSeo.evidence.length).toBeGreaterThan(0);
    }
    expect(mapping.mappingReason).toMatch(/INFERRED — NOT DIRECT GSC DATA/);
  });

  it("does not assign 'pipedrive vs hubspot' to an unrelated Salesforce comparison", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/compare/salesforce-vs-sugarcrm/",
        title: "Salesforce vs SugarCRM",
        pageType: "comparison",
        productSlugs: ["salesforce", "sugarcrm"],
        categorySlugs: [],
      },
      SITE_QUERIES,
    );

    expect(mapping.targetQuery).not.toBe("pipedrive vs hubspot");
    expect(
      mapping.mappedQueries.some((m) => m.query === "pipedrive vs hubspot"),
    ).toBe(false);
    const bad = mapping.inferredQueryCandidates.find(
      (c) => c.query === "pipedrive vs hubspot",
    );
    if (bad) {
      expect(bad.mappingConfidence).not.toBe("HIGH");
    }
  });

  it("does not assign 'plumber crm' to pega-vs-salesforce", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/compare/pega-vs-salesforce/",
        title: "Pega vs Salesforce",
        pageType: "comparison",
        productSlugs: ["pega", "salesforce"],
        categorySlugs: [],
      },
      SITE_QUERIES,
    );

    expect(mapping.targetQuery).not.toBe("plumber crm");
    expect(["SUPPRESSED", "PAGE_LEVEL", "REVIEW_REQUIRED"]).toContain(
      mapping.actionConfidence,
    );
  });

  it("does not treat single-product queries as HIGH on comparison pages", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/compare/pega-vs-salesforce/",
        title: "Pega vs Salesforce",
        pageType: "comparison",
        productSlugs: ["pega", "salesforce"],
        categorySlugs: [],
      },
      [
        ...SITE_QUERIES,
        {
          query: "salesforce crm review",
          clicks: 0,
          impressions: 200,
          ctr: 0,
          position: 40,
        },
      ],
    );
    expect(mapping.targetQuery).not.toBe("salesforce crm review");
    const single = mapping.inferredQueryCandidates.find(
      (c) => c.query === "salesforce crm review",
    );
    if (single) expect(single.mappingConfidence).not.toBe("HIGH");
  });

  it("does not HIGH-match salesforce-only queries onto monday-vs-salesforce", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/compare/monday-sales-crm-vs-salesforce/",
        title: "Monday Sales CRM vs Salesforce",
        pageType: "comparison",
        productSlugs: ["monday-sales-crm", "salesforce"],
        categorySlugs: [],
      },
      [
        {
          query: "salesforce crm review",
          clicks: 0,
          impressions: 200,
          ctr: 0,
          position: 40,
        },
        {
          query: "monday vs salesforce",
          clicks: 0,
          impressions: 100,
          ctr: 0,
          position: 35,
        },
      ],
    );
    expect(mapping.targetQuery).not.toBe("salesforce crm review");
  });

  it("allows HIGH inference only with strong entity match (still not DIRECT_GSC)", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/software/hubspot/",
        title: "HubSpot CRM Review",
        pageType: "product-review",
        productSlugs: ["hubspot"],
        categorySlugs: ["crm"],
      },
      SITE_QUERIES,
    );

    if (mapping.targetQuery === "hubspot crm") {
      expect(mapping.provenance).toBe("INFERRED");
      expect(mapping.mappingConfidence).toBe("HIGH");
      expect(mapping.actionConfidence).toBe("REVIEW_REQUIRED");
      expect(mapping.requiresHumanReview).toBe(true);
      expect(mapping.mappingReason).toMatch(/INFERRED — NOT DIRECT GSC DATA/);
    } else {
      // If threshold still rejects, must not invent a wrong primary
      expect(mapping.targetQuery).toBeNull();
    }
  });

  it("marks DIRECT_GSC from page×query matrix", () => {
    const mapping = mapQueriesFromPageQueryMatrix([
      {
        query: "diginius crm",
        clicks: 1,
        impressions: 90,
        ctr: 0.011,
        position: 18,
      },
    ]);
    expect(mapping.provenance).toBe("DIRECT_GSC");
    expect(mapping.relationshipSource).toBe("DIRECT_GSC");
    expect(mapping.targetQuery).toBe("diginius crm");
    expect(mapping.actionConfidence).toBe("EVIDENCED");
    expect(mapping.requiresHumanReview).toBe(false);
    expect(mapping.mappedQueries[0]?.evidence.some((e) => e.label.includes("direct"))).toBe(
      true,
    );
  });
});

describe("page×query API ingest", () => {
  it("parses Search Console API keys=[page,query] rows as DIRECT matrix", async () => {
    const { parseGscApiPageQueryPayload } = await import(
      "@/services/seo/gsc-opportunity/ingest"
    );
    const rows = parseGscApiPageQueryPayload(
      {
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        rows: [
          {
            keys: [
              "https://softwareglimpse.com/software/hubspot/",
              "hubspot crm",
            ],
            clicks: 2,
            impressions: 80,
            ctr: 0.025,
            position: 14.1,
          },
        ],
      },
      { startDate: "2026-07-01", endDate: "2026-07-31" },
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]!.page).toContain("hubspot");
    expect(rows[0]!.query).toBe("hubspot crm");
  });
});

describe("gateQuerySpecificActions", () => {
  it("suppresses query-scoped rewrite actions when mapping is weak", () => {
    const gated = gateQuerySpecificActions({
      recommendedActions: [
        "OPTIMIZE_TITLE",
        "OPTIMIZE_TITLE_FOR_QUERY",
        "REWRITE_H1_FOR_QUERY",
        "SEARCH_INTENT_MISMATCH",
        "QUERY_CLUSTER_CONSOLIDATION",
        "ADD_INTERNAL_LINKS",
      ],
      primaryAction: "OPTIMIZE_TITLE_FOR_QUERY",
      rootCauses: ["INTENT_MISMATCH", "CANNIBALIZATION", "TITLE_WEAK"],
      actionConfidence: "SUPPRESSED",
      relationshipSource: "INFERRED_LOW",
      targetQuery: "software seo",
      keepPageLevelTitleOpt: true,
    });
    expect(gated.recommendedActions).not.toContain("OPTIMIZE_TITLE_FOR_QUERY");
    expect(gated.recommendedActions).not.toContain("REWRITE_H1_FOR_QUERY");
    expect(gated.recommendedActions).not.toContain("SEARCH_INTENT_MISMATCH");
    expect(gated.recommendedActions).not.toContain("QUERY_CLUSTER_CONSOLIDATION");
    expect(gated.rootCauses).not.toContain("INTENT_MISMATCH");
    expect(gated.rootCauses).not.toContain("CANNIBALIZATION");
    expect(gated.recommendedActions).toContain("OPTIMIZE_TITLE");
    expect(gated.primaryAction).not.toBe("OPTIMIZE_TITLE_FOR_QUERY");
    expect(gated.notes.some((n) => /INFERRED — NOT DIRECT GSC DATA/.test(n))).toBe(
      true,
    );
  });

  it("forces MANUAL_REVIEW for INFERRED_HIGH before rewrite actions", () => {
    const gated = gateQuerySpecificActions({
      recommendedActions: ["OPTIMIZE_TITLE", "IMPROVE_INTRO"],
      primaryAction: "OPTIMIZE_TITLE",
      rootCauses: ["TITLE_WEAK"],
      actionConfidence: "REVIEW_REQUIRED",
      relationshipSource: "INFERRED_HIGH",
      targetQuery: "hubspot crm",
      keepPageLevelTitleOpt: true,
    });
    expect(gated.recommendedActions).toContain("MANUAL_REVIEW");
    expect(gated.recommendedActions).toContain("OPTIMIZE_TITLE_FOR_QUERY");
    expect(gated.primaryAction).toBe("MANUAL_REVIEW");
  });

  it("allows OPTIMIZE_TITLE_FOR_QUERY auto-primary only for DIRECT_GSC", () => {
    const gated = gateQuerySpecificActions({
      recommendedActions: ["OPTIMIZE_TITLE", "IMPROVE_INTRO"],
      primaryAction: "OPTIMIZE_TITLE",
      rootCauses: ["TITLE_WEAK", "POOR_CTR"],
      actionConfidence: "EVIDENCED",
      relationshipSource: "DIRECT_GSC",
      targetQuery: "hubspot crm",
      keepPageLevelTitleOpt: true,
    });
    expect(gated.recommendedActions).toContain("OPTIMIZE_TITLE_FOR_QUERY");
    expect(gated.primaryAction).toBe("OPTIMIZE_TITLE_FOR_QUERY");
  });

  it("never lets INFERRED_MEDIUM false pairings trigger title/H1 rewrite actions", () => {
    const mapping = inferPageQueryMapping(
      {
        path: "/compare/salesforce-vs-sugarcrm/",
        title: "Salesforce vs SugarCRM",
        pageType: "comparison",
        productSlugs: ["salesforce", "sugarcrm"],
        categorySlugs: [],
      },
      SITE_QUERIES,
    );
    expect(mapping.relationshipSource).not.toBe("DIRECT_GSC");
    expect(["INFERRED_MEDIUM", "INFERRED_LOW", "UNKNOWN", "INFERRED_HIGH"]).toContain(
      mapping.relationshipSource,
    );
    const gated = gateQuerySpecificActions({
      recommendedActions: [
        "OPTIMIZE_TITLE_FOR_QUERY",
        "REWRITE_H1_FOR_QUERY",
        "SEARCH_INTENT_MISMATCH",
      ],
      primaryAction: "OPTIMIZE_TITLE_FOR_QUERY",
      rootCauses: ["TITLE_WEAK"],
      actionConfidence: mapping.actionConfidence,
      relationshipSource: mapping.relationshipSource,
      targetQuery: mapping.targetQuery,
      keepPageLevelTitleOpt: true,
    });
    if (
      mapping.relationshipSource === "INFERRED_MEDIUM" ||
      mapping.relationshipSource === "INFERRED_LOW" ||
      mapping.relationshipSource === "UNKNOWN"
    ) {
      expect(gated.recommendedActions).not.toContain("OPTIMIZE_TITLE_FOR_QUERY");
      expect(gated.recommendedActions).not.toContain("REWRITE_H1_FOR_QUERY");
      expect(gated.primaryAction).not.toBe("OPTIMIZE_TITLE_FOR_QUERY");
      expect(gated.primaryAction).not.toBe("REWRITE_H1_FOR_QUERY");
    }
  });
});

describe("page×query import", () => {
  it("parses CSV into page×query rows", () => {
    const csv = `page,query,clicks,impressions,ctr,position,startDate,endDate
https://softwareglimpse.com/software/hubspot/,hubspot crm,2,80,0.025,14.1,2026-07-16,2026-08-13
`;
    const rows = parsePageQueryCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.query).toBe("hubspot crm");
    expect(rows[0]!.page).toContain("hubspot");
  });

  it("aggregates matrix by path", () => {
    const map = aggregatePageQueryMatrix([
      {
        dateRange: { startDate: "2026-07-01", endDate: "2026-07-31" },
        page: "https://softwareglimpse.com/software/hubspot/",
        query: "hubspot crm",
        clicks: 2,
        impressions: 80,
        ctr: 0.025,
        position: 14,
      },
      {
        dateRange: { startDate: "2026-07-01", endDate: "2026-07-31" },
        page: "https://softwareglimpse.com/software/hubspot/",
        query: "hubspot",
        clicks: 1,
        impressions: 40,
        ctr: 0.025,
        position: 10,
      },
    ]);
    const list = map.get("/software/hubspot/");
    expect(list?.length).toBe(2);
    expect(list?.[0]?.query).toBe("hubspot crm");
  });
});
