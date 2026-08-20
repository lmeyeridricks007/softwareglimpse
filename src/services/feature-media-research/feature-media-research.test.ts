import { describe, expect, it } from "vitest";
import { isVideoPublicEligible } from "@/services/product-media";
import {
  activateOfficialVideo,
  buildFeatureVisualCoverageReport,
  classifyOfficialVideo,
  discoverOfficialVideo,
  findDuplicateResearchMedia,
  mapVideoToAdditionalFeature,
  markOfficialVideoUnavailable,
  resolveFeatureMediaStage,
  submitEditorialReview,
  verifyOfficialSource,
} from "@/services/feature-media-research";

const SOURCE =
  "https://www.youtube.com/watch?v=tRpOCQ15L7M";

describe("discoverOfficialVideo", () => {
  it("registers potential official video as discovered (not public)", () => {
    const result = discoverOfficialVideo({
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "Workflow automation demo",
      featureId: "workflow-automation",
      potentialDimensionIds: ["triggers", "paths"],
      sourceOrganization: "HubSpot",
      publishedAt: "2024-06-01T00:00:00.000Z",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stage).toBe("discovered");
    expect(result.media.status).toBe("discovered");
    expect(result.media.officialSource).toBe(false);
    expect(result.media.featureIds).toEqual(["workflow-automation"]);
    expect(result.media.demonstratedDimensionIds).toEqual([
      "triggers",
      "paths",
    ]);
    expect(result.media.provider).toBe("youtube");
    expect(result.media.videoId).toBe("tRpOCQ15L7M");
    expect(isVideoPublicEligible(result.media).eligible).toBe(false);
  });

  it("rejects duplicate provider/providerId before creating a record", () => {
    const first = discoverOfficialVideo({
      id: "hs-wf-1",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "Workflow automation demo",
      featureId: "workflow-automation",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const dup = discoverOfficialVideo(
      {
        productSlug: "hubspot",
        sourceUrl: "https://youtu.be/tRpOCQ15L7M",
        title: "Same video different URL shape",
        featureId: "workflow-automation",
      },
      [first.media],
    );
    expect(dup.ok).toBe(false);
    if (dup.ok) return;
    expect(dup.code).toBe("DUPLICATE");
    expect(dup.duplicateOf?.id).toBe("hs-wf-1");
  });
});

describe("official video lifecycle", () => {
  it("runs discovered → verified → classified → editorial review → active without auto-publish", () => {
    const discovered = discoverOfficialVideo({
      id: "hs-lifecycle",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "Workflow automation demo",
      featureId: "workflow-automation",
      sourceOrganization: "HubSpot",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;
    expect(isVideoPublicEligible(discovered.media).eligible).toBe(false);

    const verified = verifyOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-training",
      sourceOrganization: "HubSpot",
      channelName: "HubSpot Academy",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    expect(verified.media.officialSource).toBe(true);
    expect(verified.media.status).toBe("verified");
    expect(isVideoPublicEligible(verified.media).eligible).toBe(false);

    // Cannot classify without grounded observations
    const emptyClassify = classifyOfficialVideo({
      media: verified.media,
      featureIds: ["workflow-automation"],
      demonstratedDimensionIds: ["triggers"],
      whatThisShows: [],
    });
    expect(emptyClassify.ok).toBe(false);

    const classified = classifyOfficialVideo({
      media: verified.media,
      featureIds: ["workflow-automation", "sales-automation"],
      demonstratedDimensionIds: ["triggers", "paths"],
      requirementIds: ["automate-follow-ups"],
      capabilityIds: ["workflow-engine"],
      useCaseIds: ["outbound-sales"],
      whatThisShows: [
        "Trigger configuration",
        "Conditional paths",
        "Automated actions",
      ],
      placements: ["features", "evidence"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.status).toBe("classified");
    expect(classified.media.featureIds).toContain("sales-automation");
    expect(isVideoPublicEligible(classified.media).eligible).toBe(false);

    // Cannot skip editorial review
    const earlyActivate = activateOfficialVideo({ media: classified.media });
    expect(earlyActivate.ok).toBe(false);

    const review = submitEditorialReview({
      media: classified.media,
      editorialCommentary: "Clear feature demo; safe for Feature Detail.",
    });
    expect(review.ok).toBe(true);
    if (!review.ok) return;
    expect(review.media.status).toBe("needs-review");
    expect(isVideoPublicEligible(review.media).eligible).toBe(false);

    const active = activateOfficialVideo({ media: review.media });
    expect(active.ok).toBe(true);
    if (!active.ok) return;
    expect(active.media.status).toBe("active");
    expect(isVideoPublicEligible(active.media).eligible).toBe(true);
  });

  it("blocks unofficial videos from classification and activation", () => {
    const discovered = discoverOfficialVideo({
      id: "third-party-review",
      productSlug: "hubspot",
      sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Random CRM review",
      featureId: "workflow-automation",
      sourceOrganization: "Some Reviewer",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    // Researcher refuses to set officialSource — classify blocked
    const classified = classifyOfficialVideo({
      media: discovered.media,
      featureIds: ["workflow-automation"],
      whatThisShows: ["UI tour"],
    });
    expect(classified.ok).toBe(false);
    if (classified.ok) return;
    expect(classified.code).toBe("OFFICIAL_SOURCE_REQUIRED");
  });

  it("marks deleted video unavailable without erasing history", () => {
    const discovered = discoverOfficialVideo({
      id: "to-delete",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "Workflow demo",
      featureId: "workflow-automation",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const verified = verifyOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-channel",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const gone = markOfficialVideoUnavailable({
      media: verified.media,
      reason: "deleted",
    });
    expect(gone.ok).toBe(true);
    if (!gone.ok) return;
    expect(gone.media.status).toBe("unavailable");
    expect(gone.media.sourceHealth).toBe("unavailable");
    expect(gone.media.refreshFlags).toContain("source-unavailable");
    expect(gone.media.title).toBe("Workflow demo");
    expect(isVideoPublicEligible(gone.media).eligible).toBe(false);
  });

  it("maps one video to multiple Features without duplicating the record", () => {
    const discovered = discoverOfficialVideo({
      id: "multi-feature",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "Workflow demo",
      featureId: "workflow-automation",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const mapped = mapVideoToAdditionalFeature(
      discovered.media,
      "sales-automation",
      ["availability"],
    );
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(mapped.media.featureIds).toEqual([
      "workflow-automation",
      "sales-automation",
    ]);
    expect(mapped.media.demonstratedDimensionIds).toContain("availability");
    expect(mapped.media.id).toBe("multi-feature");
  });
});

describe("findDuplicateResearchMedia", () => {
  it("matches on provider + providerId", () => {
    const a = discoverOfficialVideo({
      id: "a",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "A",
      featureId: "workflow-automation",
    });
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    const hit = findDuplicateResearchMedia(
      {
        id: "b",
        provider: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M&utm_source=x",
        videoId: "tRpOCQ15L7M",
      },
      [a.media],
    );
    expect(hit?.id).toBe("a");
  });
});

describe("resolveFeatureMediaStage", () => {
  it("maps statuses to pipeline stages", () => {
    const d = discoverOfficialVideo({
      id: "stage",
      productSlug: "hubspot",
      sourceUrl: SOURCE,
      title: "A",
      featureId: "workflow-automation",
    });
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    expect(resolveFeatureMediaStage(d.media)).toBe("discovered");
  });
});

describe("buildFeatureVisualCoverageReport", () => {
  it("reports coverage without treating missing video as failure", () => {
    const report = buildFeatureVisualCoverageReport("workflow-automation");
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.featureSlug).toBe("workflow-automation");
    expect(report.productsResearched).toBeGreaterThan(0);
    expect(report.note.toLowerCase()).toContain("not a research failure");
    expect(Array.isArray(report.productsMissingOfficialVideo)).toBe(true);
    // products lacking video are listed diagnostically, not as errors
    expect(report.productsLackingVisualEvidence).not.toContain(
      "__research_failed__",
    );
  });

  it("builds report for features with little media (sso)", () => {
    const report = buildFeatureVisualCoverageReport("sso");
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.productsWithOfficialVideos).toBeGreaterThanOrEqual(0);
    expect(report.note).toContain("ProductFeatureAssessment");
  });
});
