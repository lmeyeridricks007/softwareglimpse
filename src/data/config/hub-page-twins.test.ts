import { describe, expect, it } from "vitest";
import {
  hubPageTwinSiblingsForPath,
  isMergedFeatureSlug,
  mergedFeatureHref,
} from "@/data/config/hub-page-twins";
import { indexabilityForFeaturePage } from "@/seo/indexability";
import { resolveCanonicalPath } from "@/seo/canonical";

describe("hub-page-twins", () => {
  it("merges pipeline-management feature into capability", () => {
    expect(mergedFeatureHref("pipeline-management")).toBe(
      "/capabilities/pipeline-management/",
    );
    expect(isMergedFeatureSlug("pipeline-management")).toBe(true);
    expect(isMergedFeatureSlug("forecasting")).toBe(false);
  });

  it("keeps forecast and AI twins as distinct siblings", () => {
    const forecast = hubPageTwinSiblingsForPath("/use-cases/sales-forecasting/");
    expect(forecast.map((s) => s.href)).toEqual(
      expect.arrayContaining([
        "/capabilities/forecasting/",
        "/features/forecasting/",
      ]),
    );

    const aiCap = hubPageTwinSiblingsForPath("/capabilities/ai-assistance/");
    expect(aiCap).toHaveLength(1);
    expect(aiCap[0]?.href).toBe("/features/ai-assistance/");
  });

  it("excludes merged feature from pipeline sibling cards", () => {
    const siblings = hubPageTwinSiblingsForPath(
      "/use-cases/pipeline-management/",
    );
    expect(siblings.some((s) => s.slug === "pipeline-management" && s.pageType === "feature")).toBe(
      false,
    );
    expect(siblings.some((s) => s.href === "/features/multiple-pipelines/")).toBe(
      true,
    );
  });

  it("noindexes merged feature pages", () => {
    const decision = indexabilityForFeaturePage({
      featureSlug: "pipeline-management",
      hasModel: true,
      hasOverview: true,
      hasTagline: true,
    });
    expect(decision.indexable).toBe(false);
    expect(decision.reason).toBe("hub-twin-merged-into-capability");
  });

  it("canonicalizes merged feature URL to capability", () => {
    expect(resolveCanonicalPath("/features/pipeline-management/")).toBe(
      "/capabilities/pipeline-management/",
    );
  });
});
