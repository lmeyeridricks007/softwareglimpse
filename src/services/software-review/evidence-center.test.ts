import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildEvidenceCenterModel,
  filterEvidenceItems,
  EVIDENCE_CENTER_PAGE_SIZE,
} from "@/services/software-review/evidence-center";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";
import { getSoftwareBySlug } from "@/data";

const freshVideo = ProductMediaSchema.parse({
  id: "pipedrive-pipeline-video",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
  videoId: "HKaG5HN89x8",
  embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
  title: "Pipedrive Pipeline Management",
  thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
  channelName: "Pipedrive",
  sourceOrganization: "Pipedrive",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T12:00:00.000Z",
  embeddingAllowed: true,
  featureIds: ["pipeline-management", "multiple-pipelines"],
  placements: ["features", "evidence"],
  evidenceClaimKinds: ["workflow-demo", "ui-layout"],
  demonstratesCaption: "Pipeline board and deal movement.",
  whatThisShows: ["Pipeline board", "Deal movement across stages"],
  status: "published",
});

const staleVideo = ProductMediaSchema.parse({
  ...freshVideo,
  id: "stale-video",
  title: "Stale vendor tour",
  verifiedAt: "2020-01-01T00:00:00.000Z",
});

const unavailableVideo = ProductMediaSchema.parse({
  ...freshVideo,
  id: "unavailable-video",
  title: "Removed vendor webinar",
  status: "unavailable",
});

const now = new Date("2026-08-14T18:00:00.000Z");

describe("buildEvidenceCenterModel", () => {
  it("builds research coverage from actual data only", () => {
    const model = buildEvidenceCenterModel({
      sources: [
        {
          id: "docs-1",
          title: "Pipedrive help center",
          url: "https://support.pipedrive.com/",
          checkedAt: "2026-08-14T10:00:00.000Z",
          kindLabel: "Help center",
          sourceType: "official-docs",
        },
        {
          id: "pricing-1",
          title: "Pipedrive pricing",
          url: "https://www.pipedrive.com/en/pricing",
          checkedAt: "2026-08-14T10:00:00.000Z",
          kindLabel: "Pricing page",
          sourceType: "official-pricing",
        },
      ],
      screenshots: [
        {
          id: "shot-1",
          src: "/screenshots/pipedrive-pipeline.png",
          alt: "Pipeline board",
          caption: "Pipeline board UI",
          checkedAt: "2026-08-14T10:00:00.000Z",
        },
      ],
      media: [freshVideo],
      featureSupport: [
        {
          featureSlug: "pipeline-management",
          availability: "native",
          sourceIds: ["docs-1"],
        },
      ],
      pricingPlanCount: 5,
      pricingVerifiedAt: "2026-08-14T10:00:00.000Z",
      handsOnTesting: false,
      now,
    });

    expect(model.summary).toEqual({
      officialSources: 2,
      screenshots: 1,
      officialVideos: 1,
      featureClaims: 1,
      pricingRecords: 5,
      lastVerified: "2026-08-14",
    });
    expect(model.filterCounts.documentation).toBeGreaterThan(0);
    expect(model.filterCounts.pricing).toBeGreaterThan(0);
    expect(model.filterCounts.screenshots).toBe(1);
    expect(model.filterCounts.videos).toBe(1);
    expect(model.filterCounts.features).toBeGreaterThan(0);
  });

  it("includes documentation, screenshots, and video evidence cards", () => {
    const model = buildEvidenceCenterModel({
      sources: [
        {
          id: "docs-1",
          title: "Docs",
          url: "https://example.com/docs",
          checkedAt: "2026-08-14T10:00:00.000Z",
          kindLabel: "Official documentation",
          sourceType: "official-docs",
        },
      ],
      screenshots: [
        {
          id: "shot-1",
          src: "/s.png",
          alt: "UI",
          checkedAt: "2026-08-14T10:00:00.000Z",
        },
      ],
      media: [freshVideo],
      featureSupport: [],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: false,
      now,
    });

    const docs = model.items.find((i) => i.kind === "documentation");
    const shot = model.items.find((i) => i.kind === "screenshot");
    const video = model.items.find((i) => i.id === "video-pipedrive-pipeline-video");

    expect(docs?.badge).toBe("primary-source");
    expect(shot?.badge).toBe("primary-source");
    expect(video?.kindLabel).toBe("Official video");
    expect(video?.badge).toBe("primary-source");
    expect(video?.supportsLabels.some((l) => /pipeline management/i.test(l))).toBe(
      true,
    );
    expect(video?.demonstrates.length).toBeGreaterThan(0);
    expect(video?.claimConnections.some((c) => c.label.includes("→"))).toBe(
      true,
    );
    expect(video?.claimConnections.every((c) => !/\b[a-z]+-\d+\b/.test(c.label))).toBe(
      true,
    );
    expect(video?.freshness).toBe("verified");
    expect(video?.media?.id).toBe("pipedrive-pipeline-video");
  });

  it("marks stale videos as needs-refresh", () => {
    const model = buildEvidenceCenterModel({
      sources: [],
      screenshots: [],
      media: [staleVideo],
      featureSupport: [],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: false,
      now,
    });
    const video = model.items.find((i) => i.id === "video-stale-video");
    expect(video?.freshness).toBe("needs-refresh");
  });

  it("includes unavailable videos with unavailable freshness", () => {
    const model = buildEvidenceCenterModel({
      sources: [],
      screenshots: [],
      media: [unavailableVideo],
      featureSupport: [],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: false,
      now,
    });
    // Public evidence center hides unavailable — governance retains history internally.
    expect(model.items.find((i) => i.id === "video-unavailable-video")).toBeUndefined();
    expect(model.summary.officialVideos).toBe(0);
  });

  it("supports products with no videos", () => {
    const model = buildEvidenceCenterModel({
      sources: [
        {
          id: "docs-1",
          title: "Docs",
          url: "https://example.com/docs",
          checkedAt: "2026-08-14T10:00:00.000Z",
          kindLabel: "Official documentation",
        },
      ],
      screenshots: [],
      media: [],
      featureSupport: [],
      pricingPlanCount: 2,
      pricingVerifiedAt: "2026-08-14T10:00:00.000Z",
      handsOnTesting: false,
      now,
    });

    expect(model.summary.officialVideos).toBe(0);
    expect(model.filterCounts.videos).toBe(0);
    expect(filterEvidenceItems(model.items, "videos")).toHaveLength(0);
    expect(filterEvidenceItems(model.items, "documentation")).toHaveLength(1);
  });

  it("filters and paginates without dumping every item at once", () => {
    const manyShots = Array.from({ length: 12 }, (_, i) => ({
      id: `shot-${i}`,
      src: `/s-${i}.png`,
      alt: `Shot ${i}`,
      checkedAt: "2026-08-14T10:00:00.000Z",
    }));
    const model = buildEvidenceCenterModel({
      sources: [],
      screenshots: manyShots,
      media: [freshVideo],
      featureSupport: [],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: false,
      now,
    });

    const shots = filterEvidenceItems(model.items, "screenshots");
    expect(shots).toHaveLength(12);
    expect(shots.slice(0, EVIDENCE_CENTER_PAGE_SIZE)).toHaveLength(
      EVIDENCE_CENTER_PAGE_SIZE,
    );
    expect(filterEvidenceItems(model.items, "videos")).toHaveLength(1);
  });

  it("distinguishes SoftwareGlimpse analysis from primary sources", () => {
    const sg = ProductMediaSchema.parse({
      ...freshVideo,
      id: "sg-analysis",
      type: "softwareglimpse-video",
      officialSource: false,
      status: "published",
    });
    const model = buildEvidenceCenterModel({
      sources: [],
      screenshots: [],
      media: [freshVideo, sg],
      featureSupport: [
        {
          featureSlug: "pipeline-management",
          availability: "native",
          sourceIds: ["x"],
        },
      ],
      pricingPlanCount: 0,
      pricingVerifiedAt: null,
      handsOnTesting: true,
      now,
    });

    const feature = model.items.find((i) => i.kind === "feature-claim");
    const handsOn = model.items.find((i) => i.kind === "hands-on");
    const official = model.items.find(
      (i) => i.id === "video-pipedrive-pipeline-video",
    );
    const analysis = model.items.find((i) => i.id === "video-sg-analysis");

    expect(feature?.badge).toBe("softwareglimpse-analysis");
    expect(handsOn?.badge).toBe("softwareglimpse-analysis");
    expect(official?.badge).toBe("primary-source");
    expect(analysis?.badge).toBe("softwareglimpse-analysis");
    expect(analysis?.kindLabel).toBe("SoftwareGlimpse analysis video");
    expect(model.summary.officialVideos).toBe(1);
  });
});

describe("evidence center on live review models", () => {
  it("attaches evidenceCenter to HubSpot and Pipedrive review models", () => {
    for (const slug of ["hubspot", "pipedrive"] as const) {
      const software = getSoftwareBySlug(slug);
      expect(software).toBeTruthy();
      const review = buildSoftwareReviewModel(software!);
      expect(review.evidenceCenter).toBeTruthy();
      expect(review.evidenceCenter.summary.officialSources).toBe(
        review.sources.length,
      );
      expect(review.evidenceCenter.summary.officialVideos).toBeGreaterThanOrEqual(
        0,
      );
      expect(review.evidenceCenter.items.every((i) => i.badge !== undefined)).toBe(
        true,
      );
    }
  });
});
