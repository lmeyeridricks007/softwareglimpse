import { describe, expect, it } from "vitest";
import {
  ProductMediaSchema,
  mediaWhatThisShows,
  mediaLimitations,
} from "@/domain";
import {
  enrichMediaFromSourceUrl,
  formatDurationLabel,
  isVideoPublicEligible,
  parseVideoSourceUrl,
  selectProductVideos,
  videoMaySupportClaim,
  youtubePrivacyEmbedUrl,
} from "@/services/product-media";
import { videoObjectJsonLd } from "@/seo/structured-data";
import { getSoftwareBySlug } from "@/data";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";

const baseMedia = ProductMediaSchema.parse({
  id: "test-video-1",
  productSlug: "hubspot",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
  videoId: "HKaG5HN89x8",
  embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
  title: "HubSpot Sales Hub Overview Demo",
  thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
  channelName: "HubSpot",
  sourceOrganization: "HubSpot",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  embeddingAllowed: true,
  featureIds: ["pipeline-management", "deal-management"],
  placements: ["overview", "features", "evidence"],
  demonstratesCaption: "Pipeline and deal surfaces.",
  whatThisShows: ["pipeline board", "deal movement"],
  limitations: ["pricing", "comparative superiority"],
  status: "published",
});

describe("parseVideoSourceUrl", () => {
  it("parses YouTube watch URLs into privacy-enhanced embeds", () => {
    const parsed = parseVideoSourceUrl(
      "https://www.youtube.com/watch?v=HKaG5HN89x8",
    );
    expect(parsed?.provider).toBe("youtube");
    expect(parsed?.videoId).toBe("HKaG5HN89x8");
    expect(parsed?.embedUrl).toBe(youtubePrivacyEmbedUrl("HKaG5HN89x8"));
    expect(parsed?.embedUrl).toContain("youtube-nocookie.com");
  });

  it("parses youtu.be short links", () => {
    const parsed = parseVideoSourceUrl("https://youtu.be/HKaG5HN89x8");
    expect(parsed?.videoId).toBe("HKaG5HN89x8");
  });

  it("parses Vimeo URLs", () => {
    const parsed = parseVideoSourceUrl("https://vimeo.com/123456789");
    expect(parsed?.provider).toBe("vimeo");
    expect(parsed?.videoId).toBe("123456789");
  });

  it("parses Loom share URLs without inventing hashed thumbnails", () => {
    const id = "2fe0fb8589414a459cefb383635710d6";
    const parsed = parseVideoSourceUrl(`https://www.loom.com/share/${id}`);
    expect(parsed?.provider).toBe("vendor-hosted");
    expect(parsed?.videoId).toBe(id);
    expect(parsed?.embedUrl).toBe(`https://www.loom.com/embed/${id}`);
    expect(parsed?.embeddingSupported).toBe(true);
    expect(parsed?.thumbnailUrl).toBeUndefined();
  });

  it("treats unknown hosts as vendor-hosted without inventing embeds", () => {
    const parsed = parseVideoSourceUrl(
      "https://www.hubspot.com/products/sales/demo.mp4",
    );
    expect(parsed?.provider).toBe("vendor-hosted");
    expect(parsed?.embeddingSupported).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(parseVideoSourceUrl("not-a-url")).toBeNull();
  });
});

describe("eligibility + selection", () => {
  it("requires official verified published media", () => {
    expect(isVideoPublicEligible(baseMedia).eligible).toBe(true);
    expect(
      isVideoPublicEligible({ ...baseMedia, officialSource: false }).eligible,
    ).toBe(false);
    expect(
      isVideoPublicEligible({ ...baseMedia, status: "draft" }).eligible,
    ).toBe(false);
    expect(
      isVideoPublicEligible({ ...baseMedia, status: "unavailable" }).eligible,
    ).toBe(false);
  });

  it("allows embedding-disabled as link-only public media", () => {
    const result = isVideoPublicEligible({
      ...baseMedia,
      status: "embedding-disabled",
      embeddingAllowed: false,
      embedUrl: undefined,
    });
    expect(result.eligible).toBe(true);
    expect(result.linkOnly).toBe(true);
  });

  it("excludes SoftwareGlimpse analysis videos from official vendor layer", () => {
    expect(
      isVideoPublicEligible({
        ...baseMedia,
        type: "softwareglimpse-video",
        officialSource: false,
      }).eligible,
    ).toBe(false);
  });

  it("prefers feature-specific videos and dedupes", () => {
    const generic = ProductMediaSchema.parse({
      ...baseMedia,
      id: "generic-promo",
      title: "Brand promo",
      featureIds: [],
      placements: ["overview"],
    });
    const specific = ProductMediaSchema.parse({
      ...baseMedia,
      id: "pipeline-demo",
      title: "Pipeline demo",
      featureIds: ["pipeline-management"],
      placements: ["features"],
    });
    const selected = selectProductVideos([generic, specific, specific], {
      featureSlug: "pipeline-management",
      preferSpecific: true,
      limit: 2,
    });
    expect(selected.map((v) => v.id)[0]).toBe("pipeline-demo");
    expect(new Set(selected.map((v) => v.id)).size).toBe(selected.length);
  });

  it("does not repeat excluded ids on the same page", () => {
    const selected = selectProductVideos([baseMedia], {
      placement: "overview",
      excludeIds: [baseMedia.id],
    });
    expect(selected).toHaveLength(0);
  });
});

describe("commentary helpers", () => {
  it("prefers whatThisShows over whatToNotice", () => {
    expect(mediaWhatThisShows(baseMedia)).toEqual([
      "pipeline board",
      "deal movement",
    ]);
  });

  it("returns explicit limitations", () => {
    expect(mediaLimitations(baseMedia)).toContain("pricing");
  });
});

describe("evidence + helpers", () => {
  it("allows workflow demos", () => {
    expect(videoMaySupportClaim(baseMedia, "workflow-demo")).toBe(true);
  });

  it("formats duration only when known", () => {
    expect(formatDurationLabel(168)).toBe("2:48");
    expect(formatDurationLabel(undefined)).toBeNull();
  });

  it("enriches missing embed metadata from source URL", () => {
    const enriched = enrichMediaFromSourceUrl({
      ...baseMedia,
      embedUrl: undefined,
      videoId: undefined,
      thumbnailUrl: undefined,
    });
    expect(enriched.videoId).toBe("HKaG5HN89x8");
    expect(enriched.embedUrl).toContain("youtube-nocookie.com");
  });
});

describe("videoObjectJsonLd", () => {
  it("omits structured data without thumbnail", () => {
    expect(
      videoObjectJsonLd({
        name: "Demo",
        contentUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      }),
    ).toBeNull();
  });

  it("includes only known fields", () => {
    const ld = videoObjectJsonLd({
      name: "Demo",
      description: "Official demo",
      thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
      contentUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
    });
    expect(ld?.["@type"]).toBe("VideoObject");
    expect(ld).not.toHaveProperty("uploadDate");
  });
});

describe("product enrichment media integration", () => {
  it("exposes published official videos on HubSpot review model", () => {
    const software = getSoftwareBySlug("hubspot");
    expect(software).toBeTruthy();
    const model = buildSoftwareReviewModel(software!);
    expect(model.media.length).toBeGreaterThanOrEqual(2);
    expect(model.overviewVideos.length).toBeGreaterThanOrEqual(1);
    expect(model.overviewVideos[0]?.officialSource).toBe(true);
  });

  it("exposes Pipedrive official overview video for See in action", () => {
    const software = getSoftwareBySlug("pipedrive");
    expect(software).toBeTruthy();
    const model = buildSoftwareReviewModel(software!);
    expect(model.overviewVideos.length).toBe(1);
    expect(model.overviewVideos[0]?.id).toBe("pd-video-product-overview");
    expect(model.overviewVideos[0]?.officialSourceKind).toBe("vendor-channel");
  });
});
