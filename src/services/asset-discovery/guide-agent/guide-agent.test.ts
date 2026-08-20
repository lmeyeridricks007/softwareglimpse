import { describe, expect, it } from "vitest";
import {
  GUIDE_ASSET_DISCOVERY_AGENT_ID,
  GuideAssetAuditSchema,
} from "@/domain/schemas/asset-discovery";
import { getGuideBySlug } from "@/data/repositories/guides";
import {
  GUIDE_ASSET_DISCOVERY_AGENT,
  auditGuideAssets,
  classifyGuideKind,
  runGuideAssetDiscoveryAgent,
} from "@/services/asset-discovery/guide-agent";

describe("GuideAssetDiscoveryAgent", () => {
  it("exposes stable identity and never mutates guides", () => {
    expect(GUIDE_ASSET_DISCOVERY_AGENT.id).toBe(GUIDE_ASSET_DISCOVERY_AGENT_ID);
    expect(GUIDE_ASSET_DISCOVERY_AGENT.name).toBe("GuideAssetDiscoveryAgent");
    expect(GUIDE_ASSET_DISCOVERY_AGENT.mutatesGuides).toBe(false);
  });

  it("classifies vendor-neutral vs product vs industry guides", () => {
    const choose = getGuideBySlug("how-to-choose-crm", {
      includeUnpublished: true,
    });
    const fs = getGuideBySlug("financial-services-crm", {
      includeUnpublished: true,
    });
    const migration = getGuideBySlug("crm-data-migration", {
      includeUnpublished: true,
    });
    expect(choose).toBeTruthy();
    expect(classifyGuideKind(choose!)).toMatch(/vendor-neutral|selection/);
    expect(classifyGuideKind(fs!)).toBe("industry-guide");
    expect(
      ["product-migration", "product-implementation", "other"].includes(
        classifyGuideKind(migration!),
      ) || classifyGuideKind(migration!).includes("migration"),
    ).toBe(true);
  });

  it("audits how-to-choose-crm with original journey diagram, not forced vendor media in concept sections", () => {
    const guide = getGuideBySlug("how-to-choose-crm", {
      includeUnpublished: true,
    })!;
    const audit = auditGuideAssets({
      guide,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    GuideAssetAuditSchema.parse(audit);
    expect(audit.summary.originalVisualOpportunities).toBeGreaterThan(0);
    expect(
      audit.recommendations.some((r) =>
        /buying journey|concept diagram|original/i.test(r.title),
      ),
    ).toBe(true);
    // Section-derived searches when present
    expect(audit.sections.length).toBeGreaterThan(0);
  });

  it("audits financial-services industry guide for original architecture + authoritative caution", () => {
    const guide = getGuideBySlug("financial-services-crm", {
      includeUnpublished: true,
    })!;
    const audit = auditGuideAssets({
      guide,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(audit.guideKind).toBe("industry-guide");
    expect(
      audit.assetsToAvoid.some((a) => /regulatory|GDPR|promo/i.test(a)),
    ).toBe(true);
    expect(
      audit.recommendations.some(
        (r) =>
          r.category === "original-softwareglimpse-diagram" ||
          r.category === "government-regulatory-diagram" ||
          r.category === "standards-body-diagram",
      ),
    ).toBe(true);
  });

  it("audits product-ish implementation/migration guides with section-specific import searches", () => {
    const guide =
      getGuideBySlug("crm-data-migration", { includeUnpublished: true }) ??
      getGuideBySlug("crm-field-mapping", { includeUnpublished: true }) ??
      getGuideBySlug("crm-implementation", { includeUnpublished: true })!;
    const audit = auditGuideAssets({
      guide,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    const queries = audit.searchTasks.map((t) => t.query).join(" ");
    // Prefer section-derived queries over only page title
    expect(
      /import|field mapping|setup|pipeline|workflow|pricing|diagram/i.test(
        queries + audit.recommendations.map((r) => r.title).join(" "),
      ),
    ).toBe(true);
  });

  it("connects low CQ visual scores to Resolves issue ids", () => {
    // Thin guides with few figures should get CQ issue ids when score <= 2
    const guide = getGuideBySlug("what-is-crm", { includeUnpublished: true })!;
    const audit = auditGuideAssets({
      guide,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    if (
      audit.contentQualityVisualScore !== undefined &&
      audit.contentQualityVisualScore <= 2
    ) {
      expect(audit.contentQualityIssueIds[0]).toMatch(/^CQ-GUIDE-/);
      expect(
        audit.recommendations.some((r) => r.resolvesContentQualityIds.length > 0),
      ).toBe(true);
    } else {
      // Even when score is higher, agent still returns a score
      expect(audit.contentQualityVisualScore).toBeGreaterThanOrEqual(0);
    }
  });

  it("runs catalog sample without writing", () => {
    const result = runGuideAssetDiscoveryAgent({
      writeDocs: false,
      includeUnpublished: true,
      limit: 25,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(result.audits.length).toBe(25);
    expect(result.master.topRecommendations.length).toBeGreaterThan(0);
    expect(result.master.topRecommendations.length).toBeLessThanOrEqual(30);
    expect(result.writtenPaths).toHaveLength(0);
  });
});
