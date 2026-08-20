import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  applyMediaGovernanceResult,
  evaluateMediaGovernance,
  isMediaActivePublicDisplay,
  shouldShowWatchOfficialFallback,
  structuralMediaLinkChecks,
} from "@/services/product-media/governance";
import {
  buildProductMediaHealthReport,
  formatProductMediaHealthReportText,
} from "@/services/product-media/media-health-report";
import { validateOutboundLinks } from "@/services/outbound/validate-links";
import { buildEvidenceCenterModel } from "@/services/software-review/evidence-center";

const now = new Date("2026-08-14T18:00:00.000Z");

const freshVideo = ProductMediaSchema.parse({
  id: "gov-fresh",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
  videoId: "HKaG5HN89x8",
  embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
  title: "Pipedrive Pipeline Management",
  thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
  channelName: "Pipedrive",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T12:00:00.000Z",
  lastCheckedAt: "2026-08-14T12:00:00.000Z",
  sourceHealth: "live",
  embeddingAllowed: true,
  featureIds: ["pipeline-management"],
  placements: ["features", "evidence"],
  status: "published",
});

describe("evaluateMediaGovernance", () => {
  it("keeps fresh official media active", () => {
    const result = evaluateMediaGovernance({ media: freshVideo, now });
    expect(result.publicVisibility).toBe("active");
    expect(result.needsResearchRefresh).toBe(false);
    expect(result.flags).not.toContain("beyond-review-threshold");
    expect(isMediaActivePublicDisplay(freshVideo)).toBe(true);
  });

  it("flags beyond-review-threshold without deleting history", () => {
    const stale = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-stale",
      verifiedAt: "2020-01-01T00:00:00.000Z",
      lastCheckedAt: "2020-01-01T00:00:00.000Z",
    });
    const result = evaluateMediaGovernance({ media: stale, now });
    expect(result.flags).toContain("beyond-review-threshold");
    expect(result.needsResearchRefresh).toBe(true);
    expect(result.recommendedStatus).toBe("needs-review");
    const applied = applyMediaGovernanceResult(stale, result, now.toISOString());
    expect(applied.id).toBe("gov-stale");
    expect(applied.refreshFlags).toContain("beyond-review-threshold");
    expect(applied.lastCheckedAt).toBeTruthy();
  });

  it("hides unavailable sources and flags refresh", () => {
    const dead = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-dead",
      status: "unavailable",
      sourceHealth: "unavailable",
    });
    const result = evaluateMediaGovernance({ media: dead, now });
    expect(result.publicVisibility).toBe("hidden");
    expect(result.flags).toContain("source-unavailable");
    expect(result.needsResearchRefresh).toBe(true);
    expect(isMediaActivePublicDisplay(dead)).toBe(false);
  });

  it("uses Watch official video fallback when embed fails but source live", () => {
    const embedOff = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-embed-off",
      status: "embedding-disabled",
      embeddingAllowed: false,
      embedUrl: undefined,
      sourceHealth: "live",
    });
    const result = evaluateMediaGovernance({ media: embedOff, now });
    expect(result.publicVisibility).toBe("link-only");
    expect(result.flags).toContain("embedding-disabled");
    expect(shouldShowWatchOfficialFallback(embedOff)).toBe(true);
    expect(isMediaActivePublicDisplay(embedOff)).toBe(true);
  });

  it("flags product and linked feature changes", () => {
    const result = evaluateMediaGovernance({
      media: freshVideo,
      now,
      productMateriallyChanged: true,
      changedFeatureSlugs: ["pipeline-management"],
    });
    expect(result.flags).toContain("product-materially-changed");
    expect(result.flags).toContain("linked-feature-changed");
    expect(result.needsResearchRefresh).toBe(true);
  });

  it("flags source-no-longer-official from probe", () => {
    const result = evaluateMediaGovernance({
      media: freshVideo,
      now,
      probe: {
        mediaId: freshVideo.id,
        stillOfficial: false,
        sourceLive: true,
      },
    });
    expect(result.flags).toContain("source-no-longer-official");
  });

  it("hides when probe reports source dead", () => {
    const result = evaluateMediaGovernance({
      media: freshVideo,
      now,
      probe: { mediaId: freshVideo.id, sourceLive: false },
    });
    expect(result.publicVisibility).toBe("hidden");
    expect(result.sourceHealth).toBe("unavailable");
  });
});

describe("structuralMediaLinkChecks + LinkValidationAgent media", () => {
  it("detects invalid provider id and missing thumbnail", () => {
    const badId = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-bad-id",
      videoId: "not-a-youtube",
      providerId: "not-a-youtube",
    });
    expect(structuralMediaLinkChecks(badId)).toContain("provider-id-invalid");

    const noThumb = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-no-thumb",
      sourceUrl: "https://vimeo.com/123456789",
      provider: "vimeo",
      videoId: "123456789",
      embedUrl: "https://player.vimeo.com/video/123456789",
      thumbnailUrl: undefined,
    });
    expect(structuralMediaLinkChecks(noThumb)).toContain("thumbnail-missing");
  });

  it("emits media validation issues from probes", () => {
    const issues = validateOutboundLinks({
      productSlug: "pipedrive",
      now,
      mediaProbes: [
        {
          mediaId: "does-not-exist",
          sourceLive: false,
        },
      ],
    });
    expect(Array.isArray(issues)).toBe(true);
    // Live Pipedrive media may or may not produce beyond-threshold; ensure no throw
    // and media codes are part of the union.
    const mediaCodes = issues.filter((i) => i.code.startsWith("MEDIA_"));
    expect(mediaCodes.every((i) => i.productSlug === "pipedrive")).toBe(true);
  });

  it("flags unavailable media via probe on known id when present", () => {
    const issues = validateOutboundLinks({
      productSlug: "hubspot",
      now,
      mediaProbes: [
        {
          mediaId: "hs-video-sales-hub-overview",
          sourceLive: false,
          embedAvailable: false,
          thumbnailLive: false,
          stillOfficial: false,
        },
      ],
    });
    const unavailable = issues.filter(
      (i) => i.code === "MEDIA_SOURCE_UNAVAILABLE",
    );
    // Only asserts when that media id exists in enrichment
    if (issues.some((i) => i.mediaId === "hs-video-sales-hub-overview")) {
      expect(unavailable.length).toBeGreaterThan(0);
    }
  });
});

describe("Product Media Health report", () => {
  it("builds an internal report with required columns", () => {
    const report = buildProductMediaHealthReport({
      productSlug: "hubspot",
      now,
    });
    expect(report.title).toBe("Product Media Health");
    expect(report.products).toHaveLength(1);
    const row = report.products[0]!;
    expect(row.productSlug).toBe("hubspot");
    expect(typeof row.activeVideos).toBe("number");
    expect(typeof row.needsReview).toBe("number");
    expect(typeof row.unavailable).toBe("number");
    expect(row.oldestVerification === null || /^\d{4}-\d{2}-\d{2}$/.test(row.oldestVerification)).toBe(
      true,
    );
    expect(typeof row.missingMajorMediaCoverage).toBe("boolean");

    const text = formatProductMediaHealthReportText(report);
    expect(text).toContain("PRODUCT MEDIA HEALTH (internal)");
    expect(text).toContain("Active videos");
  });

  it("does not flag vendor-ui screenshots as missing major coverage", () => {
    const report = buildProductMediaHealthReport({
      productSlug: "freshchat",
      now: new Date("2026-08-18T12:00:00.000Z"),
    });
    expect(report.products).toHaveLength(1);
    expect(report.products[0]!.missingMajorMediaCoverage).toBe(false);
  });

  it("does not count archived dead URLs as unavailable when a replacement is active", () => {
    const report = buildProductMediaHealthReport({
      productSlug: "hive",
      now: new Date("2026-08-18T12:00:00.000Z"),
    });
    expect(report.products).toHaveLength(1);
    expect(report.products[0]!.activeVideos).toBeGreaterThan(0);
    expect(report.products[0]!.unavailable).toBe(0);
  });

  it("does not emit outbound health issues for Hive's archived 404 video", () => {
    const issues = validateOutboundLinks({
      productSlug: "hive",
      now: new Date("2026-08-18T12:00:00.000Z"),
    });
    expect(issues.some((i) => i.url?.includes("6v0_sWngFSM"))).toBe(false);
  });

  it("covers previously flagged HR, marketing, email, and CS products with official media", () => {
    const slugs = [
      "7shifts",
      "marketo",
      "adp-workforce-now",
      "agorapulse",
      "ashby",
      "bamboohr",
      "beehiiv",
      "brandwatch",
      "braze",
      "brevo",
      "clickfunnels",
      "constant-contact",
      "customer-io",
      "dayforce",
      "deputy",
      "drip",
      "flodesk",
      "gong",
      "greenhouse",
      "gusto",
      "hibob",
      "hootsuite",
      "instantly",
      "intercom",
      "iterable",
      "kit",
      "klaviyo",
      "later",
      "leadpages",
      "lemlist",
      "lever",
      "mailerlite",
      "mailjet",
      "manychat",
      "meltwater",
      "motion",
      "omnisend",
      "oracle-hcm",
      "outreach",
      "paycor",
      "paylocity",
      "personio",
      "rippling",
      "salesloft",
      "smartlead",
      "sprout-social",
      "twilio",
      "ukg-pro",
      "directadmin",
      "squadcast",
      "when-i-work",
      "workable",
      "workday",
    ];
    const missing = slugs.filter((productSlug) => {
      const report = buildProductMediaHealthReport({
        productSlug,
        now: new Date("2026-08-18T12:00:00.000Z"),
      });
      return report.products[0]?.missingMajorMediaCoverage !== false;
    });
    expect(missing).toEqual([]);
  });

  it("covers DirectAdmin with first-party vendor UI, not reseller YouTube", () => {
    const report = buildProductMediaHealthReport({
      productSlug: "directadmin",
      now: new Date("2026-08-18T12:00:00.000Z"),
    });
    const row = report.products[0]!;
    expect(row.missingMajorMediaCoverage).toBe(false);
    expect(row.activeVideos).toBe(0);
  });
});

describe("public evidence center hides unavailable media", () => {
  it("does not list unavailable videos in the public evidence library", () => {
    const unavailable = ProductMediaSchema.parse({
      ...freshVideo,
      id: "gov-hidden",
      status: "unavailable",
      sourceHealth: "unavailable",
    });
    const model = buildEvidenceCenterModel({
      sources: [],
      screenshots: [],
      media: [freshVideo, unavailable],
      featureSupport: [],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: false,
      now,
    });
    expect(model.items.some((i) => i.id === "video-gov-hidden")).toBe(false);
    expect(model.items.some((i) => i.id === "video-gov-fresh")).toBe(true);
    expect(model.summary.officialVideos).toBe(1);
  });
});
