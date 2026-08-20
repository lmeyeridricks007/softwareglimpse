import { describe, expect, it } from "vitest";
import { ProductMediaSchema, type ProductScreenshot } from "@/domain";
import {
  buildFeatureTabMediaMap,
  FEATURE_TAB_MAX_VIDEOS,
} from "@/services/product-media/feature-tab-media";
import { getSoftwareBySlug } from "@/data";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";

const videoFor = (id: string, featureIds: string[]) =>
  ProductMediaSchema.parse({
    id,
    productSlug: "hubspot",
    type: "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${id.slice(0, 11).padEnd(11, "a")}`,
    videoId: id.slice(0, 11).padEnd(11, "a"),
    title: `Demo ${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id.slice(0, 11).padEnd(11, "a")}/hqdefault.jpg`,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: "2026-08-14T18:00:00.000Z",
    featureIds,
    placements: ["features"],
    status: "published",
  });

describe("buildFeatureTabMediaMap", () => {
  it("caps prominent videos and prioritizes differentiating features", () => {
    const media = [
      videoFor("aaaaaaaaaaa", ["pipeline-management"]),
      videoFor("bbbbbbbbbbb", ["workflow-automation"]),
      videoFor("ccccccccccc", ["lead-scoring"]),
      videoFor("ddddddddddd", ["reporting"]),
      videoFor("eeeeeeeeeee", ["contact-management"]),
      videoFor("fffffffffff", ["mobile-app"]),
    ];
    const features = [
      { slug: "mobile-app", name: "Mobile app" },
      { slug: "pipeline-management", name: "Pipeline management" },
      { slug: "workflow-automation", name: "Workflow automation" },
      { slug: "lead-scoring", name: "Lead scoring" },
      { slug: "reporting", name: "Reporting" },
      { slug: "contact-management", name: "Contact management" },
    ];
    const map = buildFeatureTabMediaMap({ media, screenshots: [], features });
    const prominent = [...map.values()].filter((b) => b.prominent);
    expect(prominent.length).toBeLessThanOrEqual(FEATURE_TAB_MAX_VIDEOS);
    expect(map.get("pipeline-management")?.prominent).toBe(true);
    expect(map.get("workflow-automation")?.prominent).toBe(true);
  });

  it("does not attach video when featureIds do not match", () => {
    const media = [videoFor("aaaaaaaaaaa", ["pipeline-management"])];
    const map = buildFeatureTabMediaMap({
      media,
      screenshots: [],
      features: [{ slug: "calling", name: "Calling" }],
    });
    expect(map.get("calling")?.videos ?? []).toHaveLength(0);
  });

  it("matches screenshots by caption terms without inventing media", () => {
    const shots: ProductScreenshot[] = [
      {
        id: "s1",
        src: "/software/x/pipeline.jpg",
        alt: "Pipeline board",
        caption: "Visual pipeline management board",
      },
    ];
    const map = buildFeatureTabMediaMap({
      media: [],
      screenshots: shots,
      features: [{ slug: "pipeline-management", name: "Pipeline management" }],
    });
    expect(map.get("pipeline-management")?.screenshots).toHaveLength(1);
    expect(map.get("pipeline-management")?.prominent).toBe(false);
  });

  it("dedupes the same video across features on the Features tab", () => {
    const shared = videoFor("aaaaaaaaaaa", [
      "pipeline-management",
      "deal-management",
    ]);
    const map = buildFeatureTabMediaMap({
      media: [shared],
      screenshots: [],
      features: [
        { slug: "pipeline-management", name: "Pipeline" },
        { slug: "deal-management", name: "Deals" },
      ],
    });
    const videoCount =
      (map.get("pipeline-management")?.videos.length ?? 0) +
      (map.get("deal-management")?.videos.length ?? 0);
    expect(videoCount).toBe(1);
  });
});

describe("hubspot features tab media wiring", () => {
  it("surfaces official videos only on linked HubSpot features", () => {
    const model = buildSoftwareReviewModel(getSoftwareBySlug("hubspot")!);
    const map = buildFeatureTabMediaMap({
      media: model.media,
      screenshots: model.screenshots,
      features: model.features.map((f) => ({ slug: f.slug, name: f.name })),
    });
    const prominent = [...map.values()].filter((b) => b.prominent);
    expect(prominent.length).toBeGreaterThan(0);
    expect(prominent.length).toBeLessThanOrEqual(FEATURE_TAB_MAX_VIDEOS);
    for (const bundle of prominent) {
      expect(
        bundle.videos.every((v) => v.featureIds.includes(bundle.featureSlug)),
      ).toBe(true);
    }
  });
});
