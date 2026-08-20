import { describe, expect, it } from "vitest";
import {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
  AssetEnrichmentBacklogReportSchema,
} from "@/domain/schemas/asset-discovery";
import {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT,
  bandFromScore,
  scoreImpact,
  runAssetOpportunityPrioritizationAgent,
} from "@/services/asset-discovery/prioritization-agent";
import type { ImpactFactors } from "@/services/asset-discovery/prioritization-agent/scoring";

describe("AssetOpportunityPrioritizationAgent", () => {
  it("exposes stable identity and never implements assets", () => {
    expect(ASSET_OPPORTUNITY_PRIORITIZATION_AGENT.id).toBe(
      ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
    );
    expect(ASSET_OPPORTUNITY_PRIORITIZATION_AGENT.name).toBe(
      "AssetOpportunityPrioritizationAgent",
    );
    expect(ASSET_OPPORTUNITY_PRIORITIZATION_AGENT.implementsAssets).toBe(false);
  });

  it("scores impact qualitatively — not by asset count", () => {
    const excellentWorkflow: ImpactFactors = {
      mapPriority: "P0",
      pageLeverage: "flagship",
      qualityWeakness: "high",
      assetRelevance: "critical",
      buyerUsefulness: "high",
      evidenceValue: "medium",
      differentiationValue: "medium",
      easeOfUse: "high",
      sourceQuality: "verified-official",
      freshnessUrgency: "ok",
      effort: "trivial",
      recommendationLevel: "reuse-existing",
      hasCqLink: true,
      isTemplate: false,
    };
    const manyLowValueScreenshots: ImpactFactors = {
      mapPriority: "P3",
      pageLeverage: "low",
      qualityWeakness: "low",
      assetRelevance: "low",
      buyerUsefulness: "low",
      evidenceValue: "low",
      differentiationValue: "low",
      easeOfUse: "low",
      sourceQuality: "unknown",
      freshnessUrgency: "unknown",
      effort: "large",
      recommendationLevel: "optional",
      hasCqLink: false,
      isTemplate: false,
    };
    expect(scoreImpact(excellentWorkflow)).toBeGreaterThan(
      scoreImpact(manyLowValueScreenshots) * 2,
    );
    expect(bandFromScore(scoreImpact(excellentWorkflow), excellentWorkflow)).toBe(
      "A0",
    );

    const template: ImpactFactors = {
      ...excellentWorkflow,
      isTemplate: true,
      easeOfUse: "medium",
    };
    expect(bandFromScore(scoreImpact(template), template)).toBe("A0");
  });

  it("produces a valid backlog with template + page-specific bands", () => {
    const result = runAssetOpportunityPrioritizationAgent({
      writeDocs: false,
      softwareLimit: 8,
      guideLimit: 12,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });

    const report = AssetEnrichmentBacklogReportSchema.parse(result.report);
    expect(report.items.length).toBeGreaterThan(0);
    expect(report.topActions.length).toBeGreaterThan(0);
    expect(report.topActions.length).toBeLessThanOrEqual(30);
    expect(
      report.summary.a0 +
        report.summary.a1 +
        report.summary.a2 +
        report.summary.a3,
    ).toBe(report.items.length);
    expect(report.summary.templateOpportunities).toBe(
      report.systemicOpportunities.length,
    );
  });
});
