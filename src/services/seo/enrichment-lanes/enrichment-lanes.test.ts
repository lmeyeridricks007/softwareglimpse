import { describe, expect, it } from "vitest";
import {
  allocateEnrichmentBatch,
  classifyEnrichmentLane,
  compareByLaneThenScore,
  hasProvenSearchDemand,
  scoreGscEvidence,
} from "@/services/seo/enrichment-lanes";

describe("enrichment lanes", () => {
  it("puts real GSC demand in Lane A", () => {
    const result = classifyEnrichmentLane({
      gsc: { impressions: 250, clicks: 2, position: 28, opportunityScore: 55 },
      strategic: {
        categoryImportance: 20,
        productPopularity: 0,
        commercialRelevance: 8,
        internalJourneyStrength: 4,
        competitorRelationship: false,
        importantBuyerQuestion: false,
      },
      qualityGap: 20,
    });
    expect(result.lane).toBe("A");
    expect(result.hasProvenDemand).toBe(true);
    expect(result.gscEvidenceScore).toBeGreaterThan(20);
  });

  it("does not invent Lane A for zero-impression affiliate-heavy pages", () => {
    const result = classifyEnrichmentLane({
      gsc: { impressions: 0, clicks: 0, position: null, opportunityScore: 0 },
      strategic: {
        categoryImportance: 100,
        productPopularity: 30,
        commercialRelevance: 40,
        internalJourneyStrength: 25,
        competitorRelationship: false,
        importantBuyerQuestion: true,
      },
      qualityGap: 35,
    });
    expect(result.lane).toBe("B");
    expect(result.strategicOverrideReasons.length).toBeGreaterThan(0);
    expect(hasProvenSearchDemand({ impressions: 0 })).toBe(false);
  });

  it("routes low-signal pages to Lane C without deleting them", () => {
    const result = classifyEnrichmentLane({
      gsc: { impressions: 0 },
      strategic: {
        categoryImportance: 20,
        productPopularity: 5,
        commercialRelevance: 8,
        internalJourneyStrength: 4,
        competitorRelationship: false,
        importantBuyerQuestion: false,
      },
      qualityGap: 22,
    });
    expect(result.lane).toBe("C");
  });

  it("sorts Lane A ahead of high-strategy zero-GSC Lane B", () => {
    const a = classifyEnrichmentLane({
      gsc: { impressions: 120, position: 22, opportunityScore: 50 },
      strategic: {
        categoryImportance: 20,
        productPopularity: 0,
        commercialRelevance: 8,
        internalJourneyStrength: 4,
        competitorRelationship: false,
        importantBuyerQuestion: false,
      },
      qualityGap: 10,
    });
    const b = classifyEnrichmentLane({
      gsc: { impressions: 0 },
      strategic: {
        categoryImportance: 100,
        productPopularity: 40,
        commercialRelevance: 50,
        internalJourneyStrength: 25,
        competitorRelationship: true,
        importantBuyerQuestion: true,
      },
      qualityGap: 40,
    });
    expect(a.lane).toBe("A");
    expect(b.lane).toBe("B");
    expect(
      compareByLaneThenScore(
        { lane: a.lane, priorityScore: a.priorityScore, gscEvidenceScore: a.gscEvidenceScore },
        { lane: b.lane, priorityScore: b.priorityScore, gscEvidenceScore: b.gscEvidenceScore },
      ),
    ).toBeLessThan(0);
    // Even if B's raw score were higher, lane order wins.
    expect(
      compareByLaneThenScore(
        { lane: "A", priorityScore: 10, gscEvidenceScore: 10 },
        { lane: "B", priorityScore: 999, gscEvidenceScore: 0 },
      ),
    ).toBeLessThan(0);
  });

  it("exposes overallScore aliases and strategicOverride boolean on Lane B", () => {
    const result = classifyEnrichmentLane({
      gsc: { impressions: 0 },
      strategic: {
        categoryImportance: 100,
        productPopularity: 30,
        commercialRelevance: 40,
        internalJourneyStrength: 25,
        competitorRelationship: false,
        importantBuyerQuestion: true,
      },
      qualityGap: 35,
    });
    expect(result.lane).toBe("B");
    expect(result.strategicOverride).toBe(true);
    expect(result.overallScore).toBe(result.priorityScore);
    expect(result.gscDemandScore).toBe(result.gscEvidenceScore);
    expect(result.qualityGapScore).toBe(result.qualityGap);
    expect(result.commercialScore).toBeGreaterThan(0);
    expect(result.reason).toBe(result.orderingReason);
  });

  it("does not set strategicOverride on Lane A", () => {
    const result = classifyEnrichmentLane({
      gsc: { impressions: 250, clicks: 2, position: 28 },
      strategic: {
        categoryImportance: 100,
        productPopularity: 40,
        commercialRelevance: 50,
        internalJourneyStrength: 25,
        competitorRelationship: true,
        importantBuyerQuestion: true,
      },
      qualityGap: 10,
    });
    expect(result.lane).toBe("A");
    expect(result.strategicOverride).toBe(false);
  });

  it("allocates batch slots ~65/25/10 with backfill", () => {
    const items = [
      ...Array.from({ length: 20 }, (_, i) => ({
        lane: "A" as const,
        priorityScore: 100 - i,
        gscEvidenceScore: 50,
        id: `a${i}`,
      })),
      ...Array.from({ length: 20 }, (_, i) => ({
        lane: "B" as const,
        priorityScore: 80 - i,
        gscEvidenceScore: 0,
        id: `b${i}`,
      })),
      ...Array.from({ length: 20 }, (_, i) => ({
        lane: "C" as const,
        priorityScore: 40 - i,
        gscEvidenceScore: 0,
        id: `c${i}`,
      })),
    ];
    const batch = allocateEnrichmentBatch(items, 20);
    expect(batch).toHaveLength(20);
    const counts = { A: 0, B: 0, C: 0 };
    for (const item of batch) counts[item.lane] += 1;
    expect(counts.A).toBeGreaterThanOrEqual(12);
    expect(counts.B).toBeGreaterThanOrEqual(4);
    expect(counts.C).toBeGreaterThanOrEqual(1);
  });

  it("scores GSC evidence from impressions without fabricating", () => {
    expect(scoreGscEvidence({ impressions: 0 })).toBe(0);
    expect(scoreGscEvidence({ impressions: 200, position: 15 })).toBeGreaterThan(
      scoreGscEvidence({ impressions: 10 }),
    );
  });
});
