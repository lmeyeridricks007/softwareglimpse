import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  mediaMatchesRequirementCriterion,
  selectCriterionScopedVideos,
} from "@/services/product-media/requirement-page-media";
import {
  buildRequirementCriterionCellEvidence,
  buildRequirementScorecardEvidenceMap,
  scorecardEvidenceKey,
} from "@/services/requirement-detail/scorecard-cell-evidence";

const stagesVideo = ProductMediaSchema.parse({
  id: "pd-stages-video",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Multiple pipeline setup",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  sourceOrganization: "Pipedrive",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: ["separate-sales-processes"],
  requirementCriterionIds: ["separate-structure", "independent-stages"],
  featureIds: ["custom-pipelines", "pipeline-management"],
  whatThisShows: ["distinct stage configuration"],
  limitations: ["access control depth"],
  status: "published",
});

const accessFeatureFallback = ProductMediaSchema.parse({
  id: "pd-access-fallback",
  productSlug: "pipedrive",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  videoId: "abcdefghijk",
  embedUrl: "https://www.youtube-nocookie.com/embed/abcdefghijk",
  title: "Visibility groups walkthrough",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: ["restrict-access-by-team"],
  requirementCriterionIds: [],
  featureIds: ["visibility-permissions"],
  whatThisShows: ["team visibility settings"],
  status: "published",
});

const secondStagesDocStyle = ProductMediaSchema.parse({
  id: "pd-stages-alt",
  productSlug: "pipedrive",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=lmnopqrstuv",
  videoId: "lmnopqrstuv",
  embedUrl: "https://www.youtube-nocookie.com/embed/lmnopqrstuv",
  title: "Pipeline stages deep dive",
  thumbnailUrl: "https://i.ytimg.com/vi/lmnopqrstuv/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  requirementIds: ["separate-sales-processes"],
  requirementCriterionIds: ["independent-stages"],
  featureIds: ["custom-pipelines"],
  whatThisShows: ["stage editing"],
  status: "published",
});

describe("mediaMatchesRequirementCriterion", () => {
  it("matches exact criterion tags only", () => {
    expect(
      mediaMatchesRequirementCriterion(stagesVideo, {
        requirementSlug: "separate-sales-processes",
        criterionId: "independent-stages",
        criterionFeatureSlugs: ["custom-pipelines"],
      }),
    ).toBe(true);

    expect(
      mediaMatchesRequirementCriterion(stagesVideo, {
        requirementSlug: "separate-sales-processes",
        criterionId: "access-control",
        criterionFeatureSlugs: ["visibility-permissions", "custom-pipelines"],
      }),
    ).toBe(false);
  });

  it("allows feature+requirement fallback when criterion tags are absent", () => {
    expect(
      mediaMatchesRequirementCriterion(accessFeatureFallback, {
        requirementSlug: "restrict-access-by-team",
        criterionId: "access-control",
        criterionFeatureSlugs: ["visibility-permissions"],
      }),
    ).toBe(true);

    expect(
      mediaMatchesRequirementCriterion(accessFeatureFallback, {
        requirementSlug: "restrict-access-by-team",
        criterionId: "access-control",
        criterionFeatureSlugs: ["custom-pipelines"],
      }),
    ).toBe(false);
  });
});

describe("selectCriterionScopedVideos", () => {
  it("does not place Independent-stages video under Access control", () => {
    const selected = selectCriterionScopedVideos({
      mediaPool: [stagesVideo, accessFeatureFallback],
      requirementSlug: "separate-sales-processes",
      criterionId: "access-control",
      productSlug: "pipedrive",
      criterionFeatureSlugs: ["visibility-permissions"],
    });
    expect(selected.map((m) => m.id)).not.toContain("pd-stages-video");
    expect(selected.map((m) => m.id)).toEqual([]);
  });

  it("returns exact criterion-mapped video for Independent stages", () => {
    const selected = selectCriterionScopedVideos({
      mediaPool: [stagesVideo, accessFeatureFallback],
      requirementSlug: "separate-sales-processes",
      criterionId: "independent-stages",
      productSlug: "pipedrive",
      criterionFeatureSlugs: ["custom-pipelines"],
    });
    expect(selected.map((m) => m.id)).toEqual(["pd-stages-video"]);
  });
});

describe("buildRequirementCriterionCellEvidence", () => {
  it("surfaces multi-evidence counts for a Strong cell", () => {
    const cell = buildRequirementCriterionCellEvidence({
      requirementSlug: "separate-sales-processes",
      criterion: {
        id: "independent-stages",
        name: "Independent stages",
        featureSlugs: ["custom-pipelines"],
      },
      productSlug: "pipedrive",
      productName: "Pipedrive",
      assessment: "strong-support",
      featureStatuses: { "custom-pipelines": "supported" },
      mediaPool: [stagesVideo, secondStagesDocStyle],
    });
    expect(cell.videos.map((v) => v.media.id)).toEqual(
      expect.arrayContaining(["pd-stages-video", "pd-stages-alt"]),
    );
    expect(cell.counts.videos).toBe(2);
    expect(cell.assessment).toBe("strong-support");
    expect(cell.videos[0]?.demonstrates.length).toBeGreaterThan(0);
  });

  it("keeps Partial assessment and criterion-scoped video together", () => {
    const cell = buildRequirementCriterionCellEvidence({
      requirementSlug: "separate-sales-processes",
      criterion: {
        id: "independent-stages",
        name: "Independent stages",
        featureSlugs: ["custom-pipelines"],
      },
      productSlug: "pipedrive",
      productName: "Pipedrive",
      assessment: "partial-support",
      featureStatuses: { "custom-pipelines": "partially-supported" },
      mediaPool: [stagesVideo],
    });
    expect(cell.assessment).toBe("partial-support");
    expect(cell.videos).toHaveLength(1);
    expect(cell.supportingFeatures[0]?.status).toBe("partially-supported");
  });

  it("shows Insufficient evidence and hides unrelated product videos", () => {
    const cell = buildRequirementCriterionCellEvidence({
      requirementSlug: "separate-sales-processes",
      criterion: {
        id: "access-control",
        name: "Access control",
        featureSlugs: ["visibility-permissions"],
      },
      productSlug: "pipedrive",
      productName: "Pipedrive",
      assessment: "insufficient-evidence",
      featureStatuses: { "visibility-permissions": "not-evidenced" },
      mediaPool: [stagesVideo],
    });
    expect(cell.assessment).toBe("insufficient-evidence");
    expect(cell.videos).toHaveLength(0);
    expect(cell.counts.videos).toBe(0);
  });
});

describe("buildRequirementScorecardEvidenceMap", () => {
  it("keys cells by product::criterion and isolates video evidence", () => {
    const map = buildRequirementScorecardEvidenceMap({
      requirementSlug: "separate-sales-processes",
      criteria: [
        {
          id: "independent-stages",
          name: "Independent stages",
          featureSlugs: ["custom-pipelines"],
        },
        {
          id: "access-control",
          name: "Access control",
          featureSlugs: ["visibility-permissions"],
        },
      ],
      products: [
        {
          slug: "pipedrive",
          name: "Pipedrive",
          criterionCells: {
            "independent-stages": "strong-support",
            "access-control": "insufficient-evidence",
          },
          featureCells: {
            "custom-pipelines": "supported",
            "visibility-permissions": "not-evidenced",
          },
        },
      ],
      mediaPool: [stagesVideo],
    });

    const stagesKey = scorecardEvidenceKey("pipedrive", "independent-stages");
    const accessKey = scorecardEvidenceKey("pipedrive", "access-control");
    expect(map[stagesKey]?.videos).toHaveLength(1);
    expect(map[accessKey]?.videos).toHaveLength(0);
    expect(map[accessKey]?.assessment).toBe("insufficient-evidence");
  });
});
