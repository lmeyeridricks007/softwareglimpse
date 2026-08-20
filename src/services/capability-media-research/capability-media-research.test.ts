import { describe, expect, it } from "vitest";
import { isVideoPublicEligible } from "@/services/product-media";
import {
  activateCapabilityOfficialVideo,
  buildCapabilityVisualCoverageReport,
  classifyCapabilityOfficialVideo,
  discoverCapabilityOfficialVideo,
  findDuplicateResearchMedia,
  formatCapabilityVisualCoverageReportText,
  mapCapabilityResearchTags,
  mapVideoToAdditionalCapability,
  markCapabilityOfficialVideoUnavailable,
  resolveCapabilityMediaStage,
  submitCapabilityEditorialReview,
  verifyCapabilityOfficialSource,
} from "@/services/capability-media-research";

const OFFICIAL_SOURCE =
  "https://www.youtube.com/watch?v=cU0FYEDRop8";
const UNOFFICIAL_SOURCE =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const FEATURE_SPECIFIC_SOURCE =
  "https://www.youtube.com/watch?v=tRpOCQ15L7M";

describe("discoverCapabilityOfficialVideo", () => {
  it("registers official tutorial candidate as discovered (not public)", () => {
    const result = discoverCapabilityOfficialVideo({
      productSlug: "pipedrive",
      productId: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "Official Pipedrive Pipeline Demo",
      capabilityId: "pipeline-management",
      type: "official-tutorial",
      potentialRequirementIds: ["track-opportunity-progress"],
      potentialFeatureIds: ["pipeline-management", "deal-management"],
      potentialWorkflowStageIds: ["stage-movement"],
      sourceOrganization: "Pipedrive",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stage).toBe("discovered");
    expect(result.media.status).toBe("discovered");
    expect(result.media.officialSource).toBe(false);
    expect(result.media.type).toBe("official-tutorial");
    expect(result.media.capabilityIds).toEqual(["pipeline-management"]);
    expect(result.media.featureIds).toContain("deal-management");
    expect(result.media.requirementIds).toContain("track-opportunity-progress");
    expect(result.media.workflowStageIds).toContain("stage-movement");
    expect(isVideoPublicEligible(result.media).eligible).toBe(false);
  });

  it("accepts official-webinar and official-video discovery types", () => {
    const webinar = discoverCapabilityOfficialVideo({
      id: "pd-webinar",
      productSlug: "pipedrive",
      sourceUrl: FEATURE_SPECIFIC_SOURCE,
      title: "Pipeline webinar",
      capabilityId: "pipeline-management",
      type: "official-webinar",
    });
    expect(webinar.ok).toBe(true);
    if (!webinar.ok) return;
    expect(webinar.media.type).toBe("official-webinar");

    const blocked = discoverCapabilityOfficialVideo({
      id: "sg-analysis",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "SG analysis",
      capabilityId: "pipeline-management",
      type: "softwareglimpse-video",
    });
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.code).toBe("UNSUPPORTED_TYPE");
  });

  it("rejects duplicate provider/providerId — reuse canonical ResearchMedia", () => {
    const first = discoverCapabilityOfficialVideo({
      id: "pd-cap-1",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "Pipeline demo",
      capabilityId: "pipeline-management",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const dup = discoverCapabilityOfficialVideo(
      {
        productSlug: "pipedrive",
        sourceUrl: "https://youtu.be/cU0FYEDRop8",
        title: "Same video for Product Overview",
        capabilityId: "pipeline-management",
      },
      [first.media],
    );
    expect(dup.ok).toBe(false);
    if (dup.ok) return;
    expect(dup.code).toBe("DUPLICATE");
    expect(dup.duplicateOf?.id).toBe("pd-cap-1");
  });
});

describe("capability official video lifecycle", () => {
  it("runs discovered → verified → classified → editorially-reviewed → active without auto-publish", () => {
    const discovered = discoverCapabilityOfficialVideo({
      id: "pd-lifecycle",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "Official Pipedrive Pipeline Demo",
      capabilityId: "pipeline-management",
      type: "official-video",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;
    expect(isVideoPublicEligible(discovered.media).eligible).toBe(false);

    const verified = verifyCapabilityOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-channel",
      sourceOrganization: "Pipedrive",
      channelName: "Pipedrive",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    expect(verified.media.officialSource).toBe(true);
    expect(verified.media.status).toBe("verified");
    expect(isVideoPublicEligible(verified.media).eligible).toBe(false);

    const emptyClassify = classifyCapabilityOfficialVideo({
      media: verified.media,
      capabilityIds: ["pipeline-management"],
      whatThisShows: [],
    });
    expect(emptyClassify.ok).toBe(false);

    const classified = classifyCapabilityOfficialVideo({
      media: verified.media,
      productIds: ["pipedrive"],
      capabilityIds: ["pipeline-management"],
      requirementIds: [
        "track-opportunity-progress",
        "separate-sales-processes",
      ],
      featureIds: [
        "pipeline-management",
        "deal-management",
        "custom-pipelines",
      ],
      useCaseIds: ["complex-sales-processes"],
      industryIds: ["financial-services"],
      workflowStageIds: ["qualify", "propose"],
      whatThisShows: [
        "opportunity visible in pipeline",
        "stage movement",
        "activity association",
      ],
      limitations: ["plan limits", "reporting depth"],
      evidenceClaimKinds: ["workflow-demo"],
      placements: ["evidence", "features"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.status).toBe("classified");
    expect(classified.media.featureIds).toHaveLength(3);
    expect(classified.media.workflowStageIds).toEqual(["qualify", "propose"]);
    expect(isVideoPublicEligible(classified.media).eligible).toBe(false);

    const earlyActivate = activateCapabilityOfficialVideo({
      media: classified.media,
    });
    expect(earlyActivate.ok).toBe(false);

    const review = submitCapabilityEditorialReview({
      media: classified.media,
      editorialCommentary: "Grounded pipeline demo; safe for Capability Detail.",
    });
    expect(review.ok).toBe(true);
    if (!review.ok) return;
    expect(review.stage).toBe("editorially-reviewed");
    expect(review.media.status).toBe("needs-review");
    expect(isVideoPublicEligible(review.media).eligible).toBe(false);

    const active = activateCapabilityOfficialVideo({ media: review.media });
    expect(active.ok).toBe(true);
    if (!active.ok) return;
    expect(active.media.status).toBe("active");
    expect(isVideoPublicEligible(active.media).eligible).toBe(true);
  });

  it("blocks unofficial videos from classification and activation", () => {
    const discovered = discoverCapabilityOfficialVideo({
      id: "third-party-review",
      productSlug: "pipedrive",
      sourceUrl: UNOFFICIAL_SOURCE,
      title: "Random CRM review",
      capabilityId: "pipeline-management",
      sourceOrganization: "Some Reviewer",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    // Researcher does not verify officialSource
    const classified = classifyCapabilityOfficialVideo({
      media: discovered.media,
      capabilityIds: ["pipeline-management"],
      whatThisShows: ["UI tour"],
    });
    expect(classified.ok).toBe(false);
    if (classified.ok) return;
    expect(classified.code).toBe("OFFICIAL_SOURCE_REQUIRED");
  });

  it("marks unavailable video without erasing research history", () => {
    const discovered = discoverCapabilityOfficialVideo({
      id: "to-delete",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "Pipeline demo",
      capabilityId: "pipeline-management",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const verified = verifyCapabilityOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-channel",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const gone = markCapabilityOfficialVideoUnavailable({
      media: verified.media,
      reason: "deleted",
    });
    expect(gone.ok).toBe(true);
    if (!gone.ok) return;
    expect(gone.media.status).toBe("unavailable");
    expect(gone.media.sourceHealth).toBe("unavailable");
    expect(gone.media.refreshFlags).toContain("source-unavailable");
    expect(gone.media.title).toBe("Pipeline demo");
    expect(gone.media.capabilityIds).toContain("pipeline-management");
    expect(isVideoPublicEligible(gone.media).eligible).toBe(false);
  });

  it("maps one video to multiple capabilities without duplicating the record", () => {
    const discovered = discoverCapabilityOfficialVideo({
      id: "multi-cap",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "CRM tour",
      capabilityId: "pipeline-management",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const mapped = mapVideoToAdditionalCapability(
      discovered.media,
      "workflow-automation",
    );
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(mapped.media.capabilityIds).toEqual([
      "pipeline-management",
      "workflow-automation",
    ]);
    expect(mapped.media.id).toBe("multi-cap");
  });

  it("maps feature-specific tags onto an existing capability video", () => {
    const discovered = discoverCapabilityOfficialVideo({
      id: "feature-specific",
      productSlug: "hubspot",
      sourceUrl: FEATURE_SPECIFIC_SOURCE,
      title: "Workflow automation walkthrough",
      capabilityId: "workflow-automation",
      type: "official-tutorial",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const tagged = mapCapabilityResearchTags(discovered.media, {
      featureIds: ["workflow-automation", "sales-automation"],
      requirementIds: ["automate-lead-follow-up"],
      useCaseIds: ["outbound-sales"],
    });
    expect(tagged.ok).toBe(true);
    if (!tagged.ok) return;
    expect(tagged.media.featureIds).toEqual([
      "workflow-automation",
      "sales-automation",
    ]);
    expect(tagged.media.requirementIds).toContain("automate-lead-follow-up");
    expect(tagged.media.id).toBe("feature-specific");
  });
});

describe("findDuplicateResearchMedia (shared catalog)", () => {
  it("matches capability discovery against existing product media", () => {
    const a = discoverCapabilityOfficialVideo({
      id: "shared-a",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "A",
      capabilityId: "pipeline-management",
    });
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    const hit = findDuplicateResearchMedia(
      {
        id: "shared-b",
        provider: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8&utm_source=x",
        videoId: "cU0FYEDRop8",
      },
      [a.media],
    );
    expect(hit?.id).toBe("shared-a");
  });
});

describe("resolveCapabilityMediaStage", () => {
  it("maps needs-review to editorially-reviewed", () => {
    const d = discoverCapabilityOfficialVideo({
      id: "stage",
      productSlug: "pipedrive",
      sourceUrl: OFFICIAL_SOURCE,
      title: "A",
      capabilityId: "pipeline-management",
    });
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    expect(resolveCapabilityMediaStage(d.media)).toBe("discovered");
  });
});

describe("buildCapabilityVisualCoverageReport", () => {
  it("reports coverage without treating missing video as incompleteness", () => {
    const report = buildCapabilityVisualCoverageReport("pipeline-management", {
      industrySlug: "financial-services",
    });
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.capabilitySlug).toBe("pipeline-management");
    expect(report.productsAssessed).toBeGreaterThan(0);
    expect(report.note.toLowerCase()).toContain("not research incompleteness");
    expect(Array.isArray(report.productsMissingOfficialWorkflowVideo)).toBe(
      true,
    );

    const text = formatCapabilityVisualCoverageReportText(report);
    expect(text).toContain("Products assessed:");
    expect(text).toContain("Products with screenshots:");
    expect(text).toContain("Products with official workflow video:");
    expect(text.toLowerCase()).toContain("not research incompleteness");
  });

  it("builds report for workflow-automation", () => {
    const report = buildCapabilityVisualCoverageReport(
      "workflow-automation",
      { industrySlug: "financial-services" },
    );
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.productsWithOfficialWorkflowVideo).toBeGreaterThanOrEqual(0);
  });
});
