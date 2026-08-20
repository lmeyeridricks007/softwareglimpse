import { describe, expect, it } from "vitest";
import {
  getFeatureDetailProfile,
  listFeatureDetailParams,
  listIndustryFeatureParams,
} from "@/data/feature-detail";
import {
  getFeatureDetailPage,
  validateFeatureDetailPage,
} from "@/services/feature-detail";

describe("feature detail pages", () => {
  it("registers multiple-pipelines and workflow-automation", () => {
    const params = listFeatureDetailParams();
    expect(params).toEqual(
      expect.arrayContaining([
        { slug: "multiple-pipelines" },
        { slug: "workflow-automation" },
      ]),
    );
  });

  it("builds multiple-pipelines from custom-pipelines enrichment evidence", () => {
    const model = getFeatureDetailPage("multiple-pipelines");
    expect(model).not.toBeNull();
    expect(model!.canonicalFeatureSlug).toBe("custom-pipelines");
    expect(model!.displayTitle).toMatch(/Multiple Pipelines/i);
    expect(model!.profile.evaluationDimensions.length).toBeGreaterThan(3);
    expect(model!.productRows.length).toBeGreaterThan(0);
    expect(
      model!.productRows.some((p) => p.supportStatus !== "not-evidenced"),
    ).toBe(true);
    for (const row of model!.productRows) {
      expect([
        "supported",
        "partially-supported",
        "plan-dependent",
        "limited",
        "not-supported",
        "not-evidenced",
      ]).toContain(row.supportStatus);
    }
    const gate = validateFeatureDetailPage(model);
    expect(gate.ok).toBe(true);
  });

  it("builds workflow-automation with materially different feature type", () => {
    const pipelines = getFeatureDetailProfile("multiple-pipelines");
    const automation = getFeatureDetailPage("workflow-automation");
    expect(automation).not.toBeNull();
    expect(automation!.featureSlug).toBe("workflow-automation");
    expect(automation!.profile.featureType).not.toBe(pipelines!.featureType);
    expect(automation!.profile.evaluationDimensions[0]?.id).toBe("availability");
    expect(
      automation!.profile.evaluationDimensions.some(
        (d) => d.relatedFeatureSlug === "sales-automation",
      ),
    ).toBe(true);
  });

  it("builds financial-services contextual variant", () => {
    const params = listIndustryFeatureParams();
    expect(params).toEqual(
      expect.arrayContaining([
        {
          industrySlug: "financial-services",
          featureSlug: "multiple-pipelines",
        },
      ]),
    );
    const model = getFeatureDetailPage(
      "multiple-pipelines",
      "financial-services",
    );
    expect(model).not.toBeNull();
    expect(model!.industry?.slug).toBe("financial-services");
    expect(model!.displayTitle).toMatch(/Financial Services/i);
    expect(model!.industryContext?.importanceSummary).toBeTruthy();
  });

  it("registers CRM Features pillar pages with depth visuals", () => {
    const params = listFeatureDetailParams();
    for (const slug of [
      "calling",
      "reporting-dashboards",
      "lead-scoring",
      "custom-pipeline-stages",
      "api-access",
    ]) {
      expect(params).toEqual(expect.arrayContaining([{ slug }]));
      const model = getFeatureDetailPage(slug);
      expect(model).not.toBeNull();
      expect(model!.profile.heroVisual?.src).toContain(`/features/${slug}-hero.png`);
      expect(model!.workedExamples.length).toBeGreaterThanOrEqual(2);
      expect(validateFeatureDetailPage(model).ok).toBe(true);
    }
  });

  it("returns null for unknown features", () => {
    expect(getFeatureDetailPage("not-a-feature")).toBeNull();
    expect(
      getFeatureDetailPage("multiple-pipelines", "not-an-industry"),
    ).toBeNull();
  });
});
