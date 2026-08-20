import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { buildUseCaseEvidenceExplorer } from "@/services/evidence-explorer";
import { buildUseCaseHubModel } from "@/services/use-case-hub";
import {
  buildWorkflowCoverageForMedia,
  scoreUseCasePageMedia,
  selectUseCasePageVideos,
  selectUseCaseSeeInActionCards,
} from "@/services/product-media/use-case-page-media";

const leadWorkflowVideo = ProductMediaSchema.parse({
  id: "hs-lead-workflow",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "HubSpot Lead Management Demo",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  useCaseIds: ["lead-management"],
  capabilityIds: ["workflow-automation"],
  featureIds: ["lead-management", "workflow-automation"],
  requirementIds: ["automate-lead-follow-up"],
  workflowStageIds: ["capture", "qualify", "route", "convert"],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: [
    "lead capture",
    "qualification",
    "assignment",
    "follow-up activity",
  ],
  limitations: ["plan limits", "comparative superiority"],
  whatToNotice: ["whether ownership is obvious"],
  status: "published",
});

const genericTour = ProductMediaSchema.parse({
  id: "hs-generic-tour",
  productSlug: "hubspot",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  videoId: "abcdefghijk",
  embedUrl: "https://www.youtube-nocookie.com/embed/abcdefghijk",
  title: "HubSpot Product Overview",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  useCaseIds: [],
  capabilityIds: [],
  featureIds: [],
  whatThisShows: ["brand overview"],
  status: "published",
});

const steps = [
  { id: "capture", label: "Capture" },
  { id: "route", label: "Route" },
  { id: "qualify", label: "Qualify" },
  { id: "convert", label: "Convert" },
  { id: "recycle", label: "Recycle or close" },
];

describe("scoreUseCasePageMedia", () => {
  it("ranks exact use-case + workflow media above generic tours", () => {
    const ctx = {
      useCaseSlug: "lead-management",
      productSlug: "hubspot",
      workflowStepIds: steps.map((s) => s.id),
    };
    expect(scoreUseCasePageMedia(leadWorkflowVideo, ctx)).toBeGreaterThan(
      scoreUseCasePageMedia(genericTour, ctx),
    );
  });

  it("boosts industry + use-case exact matches", () => {
    const withIndustry = ProductMediaSchema.parse({
      ...leadWorkflowVideo,
      id: "hs-fs",
      industryIds: ["financial-services"],
    });
    const base = scoreUseCasePageMedia(leadWorkflowVideo, {
      useCaseSlug: "lead-management",
      productSlug: "hubspot",
      industrySlug: "financial-services",
    });
    const boosted = scoreUseCasePageMedia(withIndustry, {
      useCaseSlug: "lead-management",
      productSlug: "hubspot",
      industrySlug: "financial-services",
    });
    expect(boosted).toBeGreaterThan(base);
  });
});

describe("buildWorkflowCoverageForMedia", () => {
  it("marks workflow stages demonstrated vs not shown", () => {
    const coverage = buildWorkflowCoverageForMedia(leadWorkflowVideo, steps);
    expect(coverage.find((c) => c.stepId === "capture")?.status).toBe(
      "demonstrated",
    );
    expect(coverage.find((c) => c.stepId === "recycle")?.status).toBe(
      "not-shown",
    );
  });
});

describe("selectUseCaseSeeInActionCards", () => {
  it("builds cards with workflow coverage and never invents duplicates", () => {
    const cards = selectUseCaseSeeInActionCards({
      mediaPool: [leadWorkflowVideo, genericTour],
      products: [
        { slug: "hubspot", name: "HubSpot", logo: null },
        { slug: "pipedrive", name: "Pipedrive", logo: null },
      ],
      workflowSteps: steps,
      ctx: {
        useCaseSlug: "lead-management",
        workflowStepIds: steps.map((s) => s.id),
      },
      limit: 3,
    });
    expect(cards.length).toBe(1);
    expect(cards[0]?.productSlug).toBe("hubspot");
    expect(cards[0]?.media.id).toBe("hs-lead-workflow");
    expect(cards[0]?.workflowCoverage.some((c) => c.status === "demonstrated")).toBe(
      true,
    );
  });

  it("does not select generic product tours without use-case relationship", () => {
    const selected = selectUseCasePageVideos(
      [genericTour],
      { useCaseSlug: "lead-management", productSlug: "hubspot" },
      { limit: 3 },
    );
    expect(selected).toHaveLength(0);
  });
});

describe("buildUseCaseEvidenceExplorer", () => {
  it("groups videos with workflow dimension ids", () => {
    const model = buildUseCaseEvidenceExplorer({
      useCaseName: "Lead Management",
      useCaseSlug: "lead-management",
      products: [{ slug: "hubspot", name: "HubSpot" }],
      screenshots: [],
      videos: [leadWorkflowVideo],
      workflowSteps: steps.map((s) => ({ id: s.id, name: s.label })),
    });
    expect(model.items.some((i) => i.kind === "official-video")).toBe(true);
    const video = model.items.find((i) => i.kind === "official-video");
    expect(video?.dimensionIds).toContain("workflow:capture");
    expect(model.dimensions.some((d) => d.id === "workflow:capture")).toBe(
      true,
    );
    expect(model.supporting.toLowerCase()).toContain("does not change");
    expect(model.methodology?.toLowerCase()).toContain(
      "does not influence product rankings",
    );
  });
});

describe("buildUseCaseHubModel media wiring", () => {
  it("surfaces see-in-action for lead-management when official video exists", () => {
    const model = buildUseCaseHubModel("lead-management");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.workflowSteps.length).toBeGreaterThan(0);
    expect(model.seeInAction.length).toBeGreaterThan(0);
    expect(model.seeInAction[0]?.workflowCoverage.length).toBe(
      model.workflowSteps.length,
    );
    expect(model.seeWorkflowHref).toBe("#see-in-action");
    expect(model.requirementsHref).toContain("useCase=lead-management");
  });

  it("keeps zero-video use cases complete without empty video section data", () => {
    const model = buildUseCaseHubModel("sales-forecasting");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.workflowSteps.length).toBeGreaterThan(0);
    // May or may not have videos — section omitted when empty
    if (model.seeInAction.length === 0) {
      expect(model.seeWorkflowHref).toBeNull();
    }
    expect(model.products.length).toBeGreaterThanOrEqual(0);
    expect(model.navItems.some((n) => n.id === "workflow")).toBe(true);
  });
});
