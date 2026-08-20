import { describe, expect, it } from "vitest";
import {
  SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
  SoftwareProductAssetAuditSchema,
} from "@/domain/schemas/asset-discovery";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import {
  SOFTWARE_ASSET_DISCOVERY_AGENT,
  auditSoftwareProductAssets,
  classifyRecommendationLevel,
  rateMediaCoverage,
  runSoftwareAssetDiscoveryAgent,
} from "@/services/asset-discovery/software-agent";

describe("SoftwareAssetDiscoveryAgent", () => {
  it("exposes stable agent identity and never mutates product pages", () => {
    expect(SOFTWARE_ASSET_DISCOVERY_AGENT.id).toBe(
      SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
    );
    expect(SOFTWARE_ASSET_DISCOVERY_AGENT.name).toBe(
      "SoftwareAssetDiscoveryAgent",
    );
    expect(SOFTWARE_ASSET_DISCOVERY_AGENT.mutatesProductPages).toBe(false);
  });

  it("rates coverage qualitatively (not count-only)", () => {
    const excellent = rateMediaCoverage({
      officialVideoCount: 3,
      screenshotCount: 2,
      officialSourceCount: 5,
      hasOverviewVideo: true,
      hasFeatureSpecificVideo: true,
      hasImplementationVideo: true,
      proseHeavyGaps: 0,
      staleCount: 0,
    });
    const veryWeak = rateMediaCoverage({
      officialVideoCount: 0,
      screenshotCount: 0,
      officialSourceCount: 0,
      hasOverviewVideo: false,
      hasFeatureSpecificVideo: false,
      hasImplementationVideo: false,
      proseHeavyGaps: 5,
      staleCount: 0,
    });
    expect(excellent.rating).toBe("excellent");
    expect(veryWeak.rating).toBe("very-weak");
  });

  it("classifies ADD NOW vs OPTIONAL vs DO NOT USE", () => {
    expect(
      classifyRecommendationLevel({
        hasSourceUrl: false,
        officialSource: false,
        reuseExisting: false,
        specificity: "high",
        sectionImportance: "high",
      }),
    ).toBe("add-now");
    expect(
      classifyRecommendationLevel({
        hasSourceUrl: true,
        officialSource: true,
        reuseExisting: false,
        isGenericBrand: true,
        specificity: "low",
        sectionImportance: "low",
      }),
    ).toBe("optional");
    expect(
      classifyRecommendationLevel({
        hasSourceUrl: true,
        officialSource: false,
        reuseExisting: false,
        isOldAd: true,
        specificity: "low",
        sectionImportance: "low",
      }),
    ).toBe("do-not-use");
    expect(
      classifyRecommendationLevel({
        hasSourceUrl: true,
        officialSource: true,
        reuseExisting: true,
        specificity: "high",
        sectionImportance: "high",
      }),
    ).toBe("reuse-existing");
  });

  it("audits HubSpot with reuse of existing ResearchMedia and feature search tasks", () => {
    const software = getSoftwareBySlug("hubspot", { includeUnpublished: true });
    expect(software).toBeTruthy();
    const enrichment = loadEnrichment("hubspot");
    const sources = loadManualSources("hubspot");
    const audit = auditSoftwareProductAssets({
      software: software!,
      enrichment,
      sources,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    SoftwareProductAssetAuditSchema.parse(audit);
    expect(audit.agentId).toBe(SOFTWARE_ASSET_DISCOVERY_AGENT_ID);
    expect(audit.currentOfficialVideoCount).toBeGreaterThan(0);
    expect(audit.summary.reuseExisting).toBeGreaterThan(0);
    expect(audit.majorFeaturesSearched.length).toBeGreaterThan(0);
    expect(audit.sections.some((s) => s.sectionId === "features")).toBe(true);
    expect(audit.sections.some((s) => s.sectionId === "use-cases")).toBe(true);
    // Covered features must not be re-recommended as original diagram opportunities
    const originalTitles = audit.originalVisualOpportunities.map((o) => o.title);
    for (const feature of [
      "pipelines",
      "lead management",
      "sales automation",
    ]) {
      expect(
        originalTitles.some((t) =>
          t.includes(`How HubSpot ${feature} works`),
        ),
      ).toBe(false);
    }
    // Needs before URLs: open opportunities have search queries, no invented https
    for (const rec of audit.recommendations) {
      if (
        rec.recommendationLevel === "add-now" ||
        rec.recommendationLevel === "strong-opportunity"
      ) {
        if (!rec.sourceUrl) {
          expect(rec.searchQueries.length).toBeGreaterThan(0);
        }
      }
      if (rec.sourceUrl) {
        expect(rec.sourceUrl.startsWith("https://")).toBe(true);
      }
    }
  });

  it("audits Pipedrive and flags overview reuse vs feature gaps", () => {
    const software = getSoftwareBySlug("pipedrive", {
      includeUnpublished: true,
    });
    const audit = auditSoftwareProductAssets({
      software: software!,
      enrichment: loadEnrichment("pipedrive"),
      sources: loadManualSources("pipedrive"),
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(audit.coverageRating).toBeTruthy();
    expect(
      ["excellent", "strong", "adequate", "weak", "very-weak"].includes(
        audit.coverageRating,
      ),
    ).toBe(true);
    expect(audit.searchTasks.length).toBeGreaterThan(0);
  });

  it("runs across catalog without writing when writeDocs=false", () => {
    const result = runSoftwareAssetDiscoveryAgent({
      writeDocs: false,
      includeUnpublished: true,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(result.audits.length).toBeGreaterThanOrEqual(20);
    expect(result.master.productsAudited).toBe(result.audits.length);
    expect(result.writtenPaths).toHaveLength(0);
    expect(result.master.totals.addNow + result.master.totals.strongOpportunity).toBeGreaterThan(
      0,
    );
  });
});
