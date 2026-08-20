import { describe, expect, it } from "vitest";
import {
  inspectSeoDataAvailability,
  scoreImportance,
  scoreMigrationRisk,
} from "@/services/legacy-url-migration/seo-priority";
import type { UrlMappingRow } from "@/services/legacy-url-migration/mapping-agent/types";

function stubRow(partial: Partial<UrlMappingRow>): UrlMappingRow {
  return {
    legacyUrl: "https://www.softwareglimpse.com/pipedrive-crm-review/",
    legacyPath: "/pipedrive-crm-review/",
    legacyTitle: "Pipedrive CRM Review",
    legacyPageType: "product_review",
    legacyIntent: "product_review",
    newUrl: "https://www.softwareglimpse.com/software/pipedrive/",
    newPath: "/software/pipedrive/",
    newTitle: "Pipedrive",
    relationship: "EQUIVALENT",
    recommendedAction: "301_REDIRECT",
    confidence: "HIGH",
    seoRisk: "HIGH",
    highRiskFlags: [],
    matchBasis: "same_product",
    reason: "test",
    notes: [],
    ...partial,
  };
}

describe("SeoPriorityMigrationAgent", () => {
  it("reports GSC/analytics/backlinks unavailable without inventing data", () => {
    const a = inspectSeoDataAvailability();
    expect(a.searchConsole.available).toBe(false);
    expect(a.analytics.available).toBe(false);
    expect(a.backlinks.available).toBe(false);
    expect(a.proxySignals.available).toBe(true);
  });

  it("caps CRITICAL without live traffic/backlinks", () => {
    const scored = scoreImportance({
      row: stubRow({}),
      clicks: null,
      impressions: null,
      referringDomains: null,
      destinationInbound: 20,
      hasLiveTraffic: false,
      hasLiveBacklinks: false,
    });
    expect(scored.importance).toBe("HIGH");
    expect(scored.metricConfidence).toBe("LOW");
    expect(scored.dataSources).toContain("url-mapping-plan");
  });

  it("assigns CRITICAL when live GSC thresholds are met", () => {
    const scored = scoreImportance({
      row: stubRow({}),
      clicks: 150,
      impressions: 8000,
      referringDomains: null,
      destinationInbound: null,
      hasLiveTraffic: true,
      hasLiveBacklinks: false,
    });
    expect(scored.importance).toBe("CRITICAL");
    expect(scored.metricConfidence).toBe("HIGH");
    expect(scored.dataSources).toContain("search-console");
  });

  it("flags migration risk for unmapped valuable URLs", () => {
    const importance = scoreImportance({
      row: stubRow({
        newPath: null,
        newUrl: null,
        recommendedAction: "REVIEW",
        legacyIntent: "product_review",
      }),
      clicks: null,
      impressions: null,
      referringDomains: null,
      destinationInbound: null,
      hasLiveTraffic: false,
      hasLiveBacklinks: false,
    });
    const risk = scoreMigrationRisk({
      importance: importance.importance,
      row: stubRow({
        newPath: null,
        newUrl: null,
        recommendedAction: "REVIEW",
      }),
      hasLiveTraffic: false,
      clicks: null,
    });
    expect(["HIGH", "CRITICAL"]).toContain(risk.risk);
  });
});
