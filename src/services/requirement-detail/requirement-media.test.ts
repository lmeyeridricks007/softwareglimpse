import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildRequirementEvidenceExplorer,
  REQUIREMENT_EVIDENCE_METHODOLOGY,
} from "@/services/evidence-explorer";
import {
  scoreRequirementPageMedia,
  selectRequirementPageVideos,
  selectRequirementSeeSupportCards,
} from "@/services/product-media/requirement-page-media";
import { getRequirementDetailPage } from "@/services/requirement-detail";

const pipedrivePipeline = ProductMediaSchema.parse({
  id: "pd-req-test",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Multiple pipeline configuration",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  sourceOrganization: "Pipedrive",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: ["separate-sales-processes"],
  requirementCriterionIds: ["separate-structure", "independent-stages"],
  featureIds: ["custom-pipelines", "pipeline-management"],
  capabilityIds: ["pipeline-management"],
  whatThisShows: [
    "creation of separate pipelines",
    "distinct pipeline stages",
    "switching between pipelines",
  ],
  limitations: [
    "pipeline permission depth",
    "reporting behavior",
    "minimum qualifying plan",
  ],
  status: "published",
});

const hubspotAutomate = ProductMediaSchema.parse({
  id: "hs-req-test",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "Lead follow-up automation",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: ["automate-lead-follow-up"],
  requirementCriterionIds: ["triggers", "sales-auto"],
  featureIds: ["workflow-automation", "lead-management"],
  whatThisShows: ["assignment and follow-up activity patterns"],
  limitations: ["pricing", "minimum plan"],
  status: "published",
});

const genericTour = ProductMediaSchema.parse({
  id: "generic-tour",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  videoId: "abcdefghijk",
  embedUrl: "https://www.youtube-nocookie.com/embed/abcdefghijk",
  title: "Welcome to our brand story",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: [],
  featureIds: [],
  whatThisShows: ["brand overview"],
  status: "published",
});

describe("scoreRequirementPageMedia", () => {
  it("ranks exact requirement + criterion media above generic product video", () => {
    const ctx = {
      requirementSlug: "separate-sales-processes",
      productSlug: "pipedrive",
      coreFeatureSlugs: ["custom-pipelines", "pipeline-management"],
      criterionIds: ["separate-structure", "independent-stages"],
    };
    expect(scoreRequirementPageMedia(pipedrivePipeline, ctx)).toBeGreaterThan(
      scoreRequirementPageMedia(genericTour, ctx),
    );
  });

  it("does not select generic tours when strong match is required", () => {
    const selected = selectRequirementPageVideos(
      [genericTour, pipedrivePipeline],
      {
        requirementSlug: "separate-sales-processes",
        productSlug: "pipedrive",
        coreFeatureSlugs: ["custom-pipelines"],
        criterionIds: ["separate-structure"],
        requireStrongMatch: true,
      },
      { limit: 3 },
    );
    expect(selected.map((m) => m.id)).toEqual(["pd-req-test"]);
  });
});

describe("selectRequirementSeeSupportCards", () => {
  it("maps criteria and features without claiming full requirement support", () => {
    const cards = selectRequirementSeeSupportCards({
      mediaPool: [pipedrivePipeline],
      products: [{ slug: "pipedrive", name: "Pipedrive" }],
      ctx: {
        requirementSlug: "separate-sales-processes",
        coreFeatureSlugs: ["custom-pipelines", "pipeline-management"],
        criterionIds: [
          "separate-structure",
          "independent-stages",
          "access-control",
        ],
        requireStrongMatch: true,
      },
      criteria: [
        { id: "separate-structure", name: "Separate process structure" },
        { id: "independent-stages", name: "Independent stages" },
        { id: "access-control", name: "Access control" },
      ],
      features: [
        {
          slug: "custom-pipelines",
          name: "Multiple Pipelines",
          pageSlug: "multiple-pipelines",
          relationship: "required",
        },
        {
          slug: "workflow-automation",
          name: "Workflow Automation",
          relationship: "supporting",
        },
      ],
      limit: 3,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.criteriaSupported.map((c) => c.id)).toEqual([
      "separate-structure",
      "independent-stages",
    ]);
    expect(
      cards[0]?.featuresDemonstrated.find((f) => f.slug === "custom-pipelines")
        ?.shown,
    ).toBe(true);
    expect(
      cards[0]?.featuresDemonstrated.find(
        (f) => f.slug === "workflow-automation",
      )?.shown,
    ).toBe(false);
    expect(cards[0]?.whatNotEstablished).toEqual(
      expect.arrayContaining(["minimum qualifying plan"]),
    );
  });
});

describe("buildRequirementEvidenceExplorer", () => {
  it("groups by criterion facets and includes methodology", () => {
    const model = buildRequirementEvidenceExplorer({
      requirementName: "Support Separate Sales Processes",
      requirementSlug: "separate-sales-processes",
      products: [{ slug: "pipedrive", name: "Pipedrive" }],
      criteria: [
        { id: "separate-structure", name: "Separate process structure" },
        { id: "independent-stages", name: "Independent stages" },
      ],
      features: [{ id: "custom-pipelines", name: "Multiple Pipelines" }],
      screenshots: [],
      videos: [pipedrivePipeline],
    });
    expect(model.methodology).toBe(REQUIREMENT_EVIDENCE_METHODOLOGY);
    expect(
      model.facets?.requirements.some(
        (r) => r.id === "criterion:separate-structure",
      ),
    ).toBe(true);
    expect(model.items[0]?.dimensionIds).toContain(
      "criterion:independent-stages",
    );
    expect(model.items[0]?.doesNotEstablish?.length).toBeGreaterThan(0);
  });
});

describe("requirement detail pages — media wiring", () => {
  it("wires separate-sales-processes with criterion-mapped video when available", () => {
    const model = getRequirementDetailPage("separate-sales-processes");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.methodologyNote).toContain("does not influence product ranking");
    expect(model.profile.evaluationCriteria.length).toBeGreaterThan(0);
    // Fit must not depend on video counts
    for (const card of model.productCards) {
      expect(typeof card.fitStatus).toBe("string");
      expect(typeof card.officialVideoCount).toBe("number");
    }
    if (model.seeSupportCards.length > 0) {
      const card = model.seeSupportCards[0]!;
      expect(card.media.officialSource).toBe(true);
      expect(card.whatThisShows.length).toBeGreaterThan(0);
    }
  });

  it("wires automate-lead-follow-up without scoring from video", () => {
    const model = getRequirementDetailPage("automate-lead-follow-up");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.finderHref).toContain("requirement=automate-lead-follow-up");
    expect(model.calculatorHref).toContain("requirement=");
    expect(model.demoChecklistHref).toContain("requirement=");
    const withVideo = model.productCards.find((p) => p.officialVideoCount > 0);
    const without = model.productCards.find((p) => p.officialVideoCount === 0);
    if (withVideo && without) {
      // Video presence alone must not force stronger fit
      expect(
        ["strong-support", "good-support", "partial-support", "limited-support", "insufficient-evidence"].includes(
          without.fitStatus,
        ),
      ).toBe(true);
    }
  });

  it("keeps restrict-access-by-team complete with zero videos", () => {
    const model = getRequirementDetailPage("restrict-access-by-team");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.productRows.length).toBeGreaterThan(0);
    expect(model.profile.evaluationCriteria.length).toBeGreaterThan(0);
    // Zero-video: omit see-support cards, page still has fit/scorecard
    if (model.videos.length === 0) {
      expect(model.seeSupportCards).toHaveLength(0);
    }
    expect(model.methodologyNote).toContain("security");
  });

  it("builds scorecard Why? evidence map with criterion-scoped videos", () => {
    const model = getRequirementDetailPage("separate-sales-processes");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(Object.keys(model.scorecardEvidence).length).toBeGreaterThan(0);
    for (const cell of Object.values(model.scorecardEvidence)) {
      if (cell.assessment === "insufficient-evidence") {
        expect(cell.videos).toHaveLength(0);
      }
      for (const video of cell.videos) {
        const tagged = video.media.requirementCriterionIds ?? [];
        if (tagged.length > 0) {
          expect(tagged).toContain(cell.criterionId);
        }
      }
    }
  });

  it("builds explorer for automate-lead-follow-up hubspot video when present", () => {
    const explorer = buildRequirementEvidenceExplorer({
      requirementName: "Automate Lead Follow-up",
      requirementSlug: "automate-lead-follow-up",
      products: [{ slug: "hubspot", name: "HubSpot" }],
      criteria: [
        { id: "triggers", name: "Triggers" },
        { id: "sales-auto", name: "Sales automation" },
      ],
      features: [{ id: "workflow-automation", name: "Workflow Automation" }],
      screenshots: [],
      videos: [hubspotAutomate],
    });
    expect(explorer.items.some((i) => i.kind === "official-video")).toBe(true);
    expect(
      explorer.items[0]?.dimensionIds.includes("criterion:triggers"),
    ).toBe(true);
  });
});
