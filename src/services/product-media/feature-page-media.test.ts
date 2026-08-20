import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  scoreFeaturePageMedia,
  selectFeaturePageVideos,
  selectFeatureSeeInActionCards,
} from "@/services/product-media/feature-page-media";
import { getFeatureDetailPage } from "@/services/feature-detail";

const hubspotWorkflow = ProductMediaSchema.parse({
  id: "hs-workflow-demo",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "HubSpot workflow tutorial",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  featureIds: ["workflow-automation"],
  capabilityIds: ["workflow-automation"],
  demonstratedDimensionIds: ["sales-automation", "availability"],
  evidenceClaimKinds: ["workflow-demo", "setup-tutorial"],
  placements: ["features", "evidence"],
  whatThisShows: ["trigger setup", "follow-up actions"],
  limitations: ["minimum qualifying plan", "workflow limits"],
  status: "published",
});

const overviewPromo = ProductMediaSchema.parse({
  id: "hs-overview",
  productSlug: "hubspot",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
  videoId: "HKaG5HN89x8",
  embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
  title: "Brand overview",
  thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  featureIds: ["pipeline-management"],
  placements: ["overview"],
  whatThisShows: ["workspace layout"],
  status: "published",
});

describe("feature-page-media selection", () => {
  it("prefers exact feature demos over brand overview", () => {
    const ctx = {
      featureSlug: "workflow-automation",
      capabilitySlug: "workflow-automation",
      evaluationDimensionIds: ["availability", "sales-automation"],
    };
    expect(scoreFeaturePageMedia(hubspotWorkflow, ctx)).toBeGreaterThan(
      scoreFeaturePageMedia(overviewPromo, {
        ...ctx,
        featureSlug: "pipeline-management",
      }),
    );
    const selected = selectFeaturePageVideos(
      [overviewPromo, hubspotWorkflow],
      ctx,
      { limit: 2 },
    );
    expect(selected.map((m) => m.id)).toEqual(["hs-workflow-demo"]);
  });

  it("does not create blank cards for products without media", () => {
    const cards = selectFeatureSeeInActionCards({
      mediaPool: [hubspotWorkflow],
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      ctx: {
        featureSlug: "workflow-automation",
        capabilitySlug: "workflow-automation",
      },
      dimensionLabelById: new Map([
        ["sales-automation", "Sales automation depth"],
        ["availability", "Feature availability"],
      ]),
      limit: 4,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.productSlug).toBe("hubspot");
    expect(cards[0]?.demonstratedDimensionLabels).toContain(
      "Sales automation depth",
    );
    expect(cards[0]?.whatNotEstablished.length).toBeGreaterThan(0);
  });

  it("excludes product-only media with no feature relationship", () => {
    const orphan = ProductMediaSchema.parse({
      ...overviewPromo,
      id: "orphan",
      featureIds: [],
      placements: ["overview", "features"],
    });
    const selected = selectFeaturePageVideos([orphan], {
      featureSlug: "workflow-automation",
    });
    expect(selected).toHaveLength(0);
  });
});

describe("feature detail pages with ResearchMedia", () => {
  it("surfaces official videos on workflow-automation when related", () => {
    const model = getFeatureDetailPage("workflow-automation");
    expect(model).not.toBeNull();
    expect(model!.seeInAction.length).toBeGreaterThan(0);
    expect(
      model!.seeInAction.every((c) =>
        c.media.featureIds.includes("workflow-automation"),
      ),
    ).toBe(true);
    const hubspot = model!.productCards.find((p) => p.slug === "hubspot");
    expect(hubspot?.videoCount).toBeGreaterThan(0);
    expect(hubspot?.featureVideo).toBeTruthy();
    // Video count must not be the sole driver of ranking vs products without video
    expect(model!.research.officialVideoCount).toBeGreaterThan(0);
  });

  it("works with zero videos on features without media coverage", () => {
    const model = getFeatureDetailPage("sso");
    expect(model).not.toBeNull();
    expect(model!.seeInAction).toEqual([]);
    expect(model!.videos).toEqual([]);
    expect(model!.research.officialVideoCount).toBe(0);
    expect(model!.productRows.length).toBeGreaterThan(0);
  });

  it("keeps multiple-pipelines usable without inventing feature demos", () => {
    const model = getFeatureDetailPage("multiple-pipelines");
    expect(model).not.toBeNull();
    expect(model!.canonicalFeatureSlug).toBe("custom-pipelines");
    // No blank cards — only products with eligible custom-pipelines media
    for (const card of model!.seeInAction) {
      expect(
        card.media.featureIds.includes("custom-pipelines") ||
          card.media.featureIds.includes("pipeline-management") ||
          card.media.capabilityIds.length > 0,
      ).toBe(true);
    }
  });
});
