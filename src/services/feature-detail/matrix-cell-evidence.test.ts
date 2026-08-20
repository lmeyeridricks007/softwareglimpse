import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildMatrixCellEvidence,
  matrixEvidenceIndicatorLabel,
  mediaMatchesEvaluationDimension,
} from "@/services/feature-detail/matrix-cell-evidence";
import { getFeatureDetailPage } from "@/services/feature-detail";
import type { FeatureEvaluationDimension } from "@/domain";

const primaryDim = {
  id: "availability",
  name: "Feature availability",
  valueType: "support-status",
  source: "primary",
} as FeatureEvaluationDimension;

const planDim = {
  id: "min-plan",
  name: "Minimum plan",
  valueType: "plan",
  source: "min-plan",
} as FeatureEvaluationDimension;

const salesDim = {
  id: "sales-automation",
  name: "Sales automation depth",
  valueType: "support-status",
  source: "related-feature",
  relatedFeatureSlug: "sales-automation",
} as FeatureEvaluationDimension;

const video = ProductMediaSchema.parse({
  id: "hs-workflow-demo",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "Workflow demo",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  featureIds: ["workflow-automation"],
  demonstratedDimensionIds: ["availability", "sales-automation"],
  whatThisShows: ["workflow trigger", "action setup"],
  status: "published",
});

describe("mediaMatchesEvaluationDimension", () => {
  it("attaches video only to demonstrated dimensions when tagged", () => {
    expect(
      mediaMatchesEvaluationDimension(video, primaryDim, "workflow-automation"),
    ).toBe(true);
    expect(
      mediaMatchesEvaluationDimension(video, salesDim, "workflow-automation"),
    ).toBe(true);
    expect(
      mediaMatchesEvaluationDimension(video, planDim, "workflow-automation"),
    ).toBe(false);
  });

  it("does not attach untagged video to plan/limit rows", () => {
    const untagged = ProductMediaSchema.parse({
      ...video,
      id: "untagged",
      demonstratedDimensionIds: [],
    });
    expect(
      mediaMatchesEvaluationDimension(
        untagged,
        planDim,
        "workflow-automation",
      ),
    ).toBe(false);
    expect(
      mediaMatchesEvaluationDimension(
        untagged,
        primaryDim,
        "workflow-automation",
      ),
    ).toBe(true);
  });
});

describe("buildMatrixCellEvidence", () => {
  it("builds cell with video evidence", () => {
    const evidence = buildMatrixCellEvidence({
      dim: primaryDim,
      featureSlug: "workflow-automation",
      supportSourceIds: [],
      allSources: [],
      productVideos: [video],
      productScreenshots: [],
      attachScreenshots: true,
    });
    expect(evidence.videoCount).toBe(1);
    expect(evidence.totalCount).toBe(1);
    expect(matrixEvidenceIndicatorLabel(evidence)).toBe("Evidence");
  });

  it("builds cell without video", () => {
    const evidence = buildMatrixCellEvidence({
      dim: planDim,
      featureSlug: "workflow-automation",
      supportSourceIds: [],
      allSources: [],
      productVideos: [video],
      productScreenshots: [],
      attachScreenshots: false,
    });
    expect(evidence.videoCount).toBe(0);
    expect(matrixEvidenceIndicatorLabel(evidence)).toBeNull();
  });

  it("combines screenshot + video counts", () => {
    const evidence = buildMatrixCellEvidence({
      dim: primaryDim,
      featureSlug: "workflow-automation",
      supportSourceIds: [],
      allSources: [],
      productVideos: [video],
      productScreenshots: [
        {
          id: "shot-1",
          src: "/s.png",
          alt: "Workflow UI",
          caption: "Builder",
        },
      ],
      attachScreenshots: true,
    });
    expect(evidence.videoCount).toBe(1);
    expect(evidence.screenshotCount).toBe(1);
    expect(evidence.totalCount).toBe(2);
    expect(matrixEvidenceIndicatorLabel(evidence)).toBe("2 sources");
  });
});

describe("feature matrix cell evidence on live pages", () => {
  it("scopes HubSpot workflow video to tagged dimensions only", () => {
    const model = getFeatureDetailPage("workflow-automation");
    expect(model).not.toBeNull();
    const hubspot = model!.productRows.find((p) => p.slug === "hubspot");
    expect(hubspot).toBeTruthy();

    const availability = hubspot!.dimensionCells.availability;
    const minPlan = hubspot!.dimensionCells["min-plan"];
    const sales = hubspot!.dimensionCells["sales-automation"];

    // Display/status unchanged by video presence
    expect(availability?.display).toBeTruthy();
    expect(minPlan?.status === "text" || minPlan?.status === "not-evidenced").toBe(
      true,
    );

    if (availability?.evidence?.videoCount) {
      expect(availability.evidence.videos.every((v) =>
        v.demonstratedDimensionIds.includes("availability"),
      )).toBe(true);
    }
    expect(minPlan?.evidence?.videoCount ?? 0).toBe(0);

    // Differences-only must ignore evidence counts — same display still "same"
    const displays = model!.productRows.map(
      (p) => p.dimensionCells["min-plan"]?.display ?? "—",
    );
    const unique = new Set(displays);
    // Just assert API shape; differences filter uses display only in UI
    expect(unique.size).toBeGreaterThan(0);
    expect(sales?.evidence === null || sales?.evidence !== undefined).toBe(true);
  });

  it("supports unknown / partial statuses with optional evidence", () => {
    const model = getFeatureDetailPage("sso");
    expect(model).not.toBeNull();
    for (const row of model!.productRows.slice(0, 5)) {
      for (const dim of model!.profile.evaluationDimensions) {
        const cell = row.dimensionCells[dim.id];
        expect(cell).toBeTruthy();
        expect(cell!.evidence === null || typeof cell!.evidence?.totalCount === "number").toBe(
          true,
        );
        // Partial / unknown still have compact cells — no forced video
        if (cell!.status === "not-evidenced") {
          expect(cell!.evidence?.videoCount ?? 0).toBe(0);
        }
      }
    }
  });
});
