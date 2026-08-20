import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildUseCaseTabMediaMap,
  isLikelyBrandPromo,
  selectImplementationContextVideos,
} from "@/services/product-media/context-tab-media";
import { getSoftwareBySlug } from "@/data";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";

const overview = ProductMediaSchema.parse({
  id: "brand-overview",
  productSlug: "hubspot",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
  videoId: "aaaaaaaaaaa",
  title: "Meet Product",
  thumbnailUrl: "https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  featureIds: ["pipeline-management"],
  placements: ["overview", "evidence"],
  status: "published",
});

const tutorial = ProductMediaSchema.parse({
  id: "workflow-tutorial",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=bbbbbbbbbbb",
  videoId: "bbbbbbbbbbb",
  title: "Workflow tutorial",
  thumbnailUrl: "https://i.ytimg.com/vi/bbbbbbbbbbb/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  featureIds: ["pipeline-management", "lead-management"],
  useCaseIds: ["lead-management", "pipeline-management"],
  evidenceClaimKinds: ["setup-tutorial", "workflow-demo"],
  placements: ["implementation", "use-cases", "features"],
  whatThisShows: ["lead capture", "qualification", "assignment"],
  status: "published",
});

describe("context tab media selection", () => {
  it("flags brand overview promos", () => {
    expect(isLikelyBrandPromo(overview)).toBe(true);
    expect(isLikelyBrandPromo(tutorial)).toBe(false);
  });

  it("prefers workflow tutorials over overview promos for use cases", () => {
    const map = buildUseCaseTabMediaMap({
      media: [overview, tutorial],
      useCaseSlugs: ["lead-management", "pipeline-management"],
      overviewVideoIds: ["brand-overview"],
      maxVideos: 2,
    });
    expect(map.get("lead-management")?.video?.id).toBe("workflow-tutorial");
    // Deduped — second use case does not repeat the same video
    expect(map.get("pipeline-management")?.video).toBeNull();
  });

  it("does not attach overview promo to use cases without explicit useCaseIds", () => {
    const map = buildUseCaseTabMediaMap({
      media: [overview],
      useCaseSlugs: ["pipeline-management"],
      overviewVideoIds: ["brand-overview"],
    });
    expect(map.get("pipeline-management")?.video).toBeNull();
  });

  it("selects implementation tutorials excluding overview ids", () => {
    const videos = selectImplementationContextVideos({
      media: [overview, tutorial],
      overviewVideoIds: ["brand-overview"],
      limit: 1,
    });
    expect(videos).toHaveLength(1);
    expect(videos[0]?.id).toBe("workflow-tutorial");
  });

  it("keeps dual-tagged overview+implementation videos for Guides", () => {
    const dual = ProductMediaSchema.parse({
      ...overview,
      id: "dual-setup-demo",
      videoId: "ccccccccccc",
      sourceUrl: "https://www.youtube.com/watch?v=ccccccccccc",
      thumbnailUrl: "https://i.ytimg.com/vi/ccccccccccc/hqdefault.jpg",
      placements: ["overview", "implementation", "evidence"],
    });
    const videos = selectImplementationContextVideos({
      media: [dual],
      overviewVideoIds: ["dual-setup-demo"],
      limit: 1,
    });
    expect(videos[0]?.id).toBe("dual-setup-demo");
  });

  it("falls back to overview demo when no setup tutorial exists", () => {
    const videos = selectImplementationContextVideos({
      media: [overview],
      overviewVideoIds: ["brand-overview"],
      limit: 1,
    });
    // pure overview promo is brand-promo filtered from impl path, but
    // overview fallback still returns published overview placements
    expect(videos[0]?.id).toBe("brand-overview");
  });
});

describe("live product wiring", () => {
  it("HubSpot use cases get tutorial not overview when linked", () => {
    const model = buildSoftwareReviewModel(getSoftwareBySlug("hubspot")!);
    const map = buildUseCaseTabMediaMap({
      media: model.media,
      useCaseSlugs: model.useCases.map((u) => u.slug),
      overviewVideoIds: model.overviewVideos.map((v) => v.id),
    });
    const withVideo = [...map.values()].filter((b) => b.video);
    expect(withVideo.length).toBeGreaterThan(0);
    expect(
      withVideo.every((b) => b.video && !model.overviewVideos.some((o) => o.id === b.video!.id)),
    ).toBe(true);
    expect(withVideo.every((b) => b.video?.type === "official-tutorial")).toBe(
      true,
    );
  });

  it("Pipedrive overview only attaches to explicitly linked use cases", () => {
    const model = buildSoftwareReviewModel(getSoftwareBySlug("pipedrive")!);
    const map = buildUseCaseTabMediaMap({
      media: model.media,
      screenshots: model.screenshots,
      useCaseSlugs: model.useCases.map((u) => u.slug),
      overviewVideoIds: model.overviewVideos.map((v) => v.id),
    });
    const overviewIds = new Set(model.overviewVideos.map((v) => v.id));
    // No use-case slot should reuse a pure overview promo unless explicitly linked
    for (const bundle of map.values()) {
      if (!bundle.video) continue;
      if (overviewIds.has(bundle.video.id)) {
        expect(bundle.video.useCaseIds.length).toBeGreaterThan(0);
      }
    }
    expect(map.get("lead-management")?.video?.useCaseIds).toContain(
      "lead-management",
    );
    // SG original workflow diagram is available for pipeline management
    expect(map.get("pipeline-management")?.diagram?.kind).toBe(
      "original-diagram",
    );
  });

  it("HubSpot guides get implementation tutorial excluding overview", () => {
    const model = buildSoftwareReviewModel(getSoftwareBySlug("hubspot")!);
    const videos = selectImplementationContextVideos({
      media: model.media,
      overviewVideoIds: model.overviewVideos.map((v) => v.id),
      limit: 1,
    });
    expect(videos[0]?.type).toBe("official-tutorial");
    expect(videos[0]?.id).not.toBe(model.overviewVideos[0]?.id);
  });
});
