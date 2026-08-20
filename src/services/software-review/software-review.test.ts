import { describe, expect, it } from "vitest";
import { getSoftwareBySlug } from "@/data";
import { isInternalEditorialCopy } from "@/services/category-hub/public-copy";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";
import {
  getSoftwareHubTab,
  isSoftwareHubTabSlug,
  SOFTWARE_HUB_TAB_SLUGS,
  softwareHubPath,
} from "@/services/software-review";

function collectPublicStrings(model: ReturnType<typeof buildSoftwareReviewModel>): string[] {
  const d = model.deepReview;
  return [
    model.verdict,
    model.tagline,
    ...model.pros,
    ...model.cons,
    ...model.whyWeLike,
    d.productExperience?.summary,
    d.productExperience?.evidenceNote,
    ...d.detailedSections.flatMap((s) => [
      s.summary,
      ...s.body,
      ...s.strengths,
      ...s.weaknesses,
    ]),
    ...d.limitations.flatMap((l) => [l.title, l.explanation]),
    ...d.whyWeLike,
    d.keyTakeaway,
    ...(d.finalVerdict?.body ?? []),
    ...(d.finalVerdict?.chooseIf ?? []),
    ...(d.finalVerdict?.considerOtherIf ?? []),
    ...d.competitorDeepDives.flatMap((c) => [
      c.headline,
      c.keyDifference,
      c.summary,
      ...c.chooseCurrentIf,
      ...c.chooseCompetitorIf,
    ]),
  ].filter(Boolean) as string[];
}

describe("software review model", () => {
  it("pipedrive review model exposes approved scores, screenshots, and safe public copy", () => {
    const software = getSoftwareBySlug("pipedrive");
    expect(software).toBeTruthy();

    const model = buildSoftwareReviewModel(software!);

    expect(model.scoresApproved).toBe(true);
    expect(model.overallScore).toBe(7.5);
    expect(model.pendingCriteriaNames.length).toBe(0);
    expect(model.features.length).toBeGreaterThan(0);
    expect(model.pricing).toBeTruthy();
    expect(model.pricing?.plans.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["lite", "growth", "premium", "ultimate"]),
    );
    expect(model.screenshots.length).toBeGreaterThanOrEqual(6);
    expect(model.integrations.length).toBeGreaterThan(0);
    expect(model.deepReview.productExperience?.workflowSteps.length).toBeGreaterThan(3);
    expect(model.deepReview.detailedSections.length).toBe(10);
    expect(model.deepReview.planRecommendations.length).toBe(4);
    expect(model.deepReview.finalVerdict).toBeTruthy();
    expect(model.deepReview.competitorDeepDives.length).toBeGreaterThan(0);
    expect(model.research.handsOnTesting).toBe(false);

    for (const text of collectPublicStrings(model)) {
      expect(isInternalEditorialCopy(text)).toBe(false);
      expect(text).not.toMatch(/we tested|our testing|when we used/i);
    }

    const blob = JSON.stringify(collectPublicStrings(model));
    expect(blob).not.toMatch(/fixture/i);
    expect(blob).not.toMatch(/\bfact-/i);
    expect(blob).not.toMatch(/pending approval/i);
  });

  it("freshsales deep review adapts without Pipedrive hardcoding", () => {
    const software = getSoftwareBySlug("freshsales");
    expect(software).toBeTruthy();
    const model = buildSoftwareReviewModel(software!);
    expect(model.deepReview.detailedSections.length).toBeGreaterThan(0);
    expect(model.deepReview.productExperience).toBeTruthy();
    expect(
      model.deepReview.detailedSections.every((s) => s.id.startsWith("criterion-")),
    ).toBe(true);
    for (const text of collectPublicStrings(model)) {
      expect(isInternalEditorialCopy(text)).toBe(false);
    }
  });

  it("does not invent scores or hands-on claims for low-research products", () => {
    const software = getSoftwareBySlug("folk");
    expect(software).toBeTruthy();
    const model = buildSoftwareReviewModel(software!);
    expect(model.scoresApproved).toBe(false);
    expect(model.overallScore).toBeNull();
    expect(model.deepReview.detailedSections.every((s) => !s.scoreApproved)).toBe(
      true,
    );
    const blob = JSON.stringify(collectPublicStrings(model));
    expect(blob).not.toMatch(/we tested|in our testing|when we used/i);
  });

  it("surfaces Workday quote pricing, official screenshots, and overview video", () => {
    const software = getSoftwareBySlug("workday");
    expect(software).toBeTruthy();
    const model = buildSoftwareReviewModel(software!);
    expect(model.pricing).toBeTruthy();
    expect(model.pricing?.plans.some((p) => p.contactSales)).toBe(true);
    expect(
      model.heroFacts.some(
        (f) => f.label === "Starting price" && /custom quote/i.test(f.value),
      ),
    ).toBe(true);
    expect(
      model.screenshots.filter((s) => s.kind === "vendor-ui").length,
    ).toBeGreaterThanOrEqual(5);
    expect(model.overviewVideos[0]?.videoId).toBe("SVguFcK8LWg");
  });
});

describe("software product hub tabs", () => {
  it("maps tab slugs to nested product hub paths", () => {
    expect(softwareHubPath("pipedrive")).toBe("/software/pipedrive/");
    expect(softwareHubPath("pipedrive", "pricing")).toBe(
      "/software/pipedrive/pricing/",
    );
    expect(softwareHubPath("pipedrive", "evidence")).toBe(
      "/software/pipedrive/evidence/",
    );
    expect(isSoftwareHubTabSlug("features")).toBe(true);
    expect(isSoftwareHubTabSlug("overview")).toBe(false);
    expect(getSoftwareHubTab("pricing").label).toBe("Pricing");
    expect(SOFTWARE_HUB_TAB_SLUGS).toContain("methodology");
  });

  it("keeps hub plan names on current packaging for Pipedrive", () => {
    const model = buildSoftwareReviewModel(getSoftwareBySlug("pipedrive")!);
    const planNames = model.pricing?.plans.map((p) => p.name) ?? [];
    expect(planNames).toEqual(
      expect.arrayContaining(["Lite", "Growth", "Premium", "Ultimate"]),
    );
    expect(planNames.join(" ")).not.toMatch(/Essential|Advanced|Enterprise/i);
  });
});
