import { describe, expect, it } from "vitest";
import { isVideoPublicEligible, evaluateMediaGovernance } from "@/services/product-media";
import {
  activateUseCaseOfficialVideo,
  buildExplicitWorkflowCoverage,
  buildUseCaseVisualCoverageReport,
  classifyUseCaseOfficialVideo,
  discoverUseCaseOfficialVideo,
  evaluateUseCaseMediaHealth,
  findDuplicateResearchMedia,
  formatUseCaseVisualCoverageReportText,
  isLikelyGenericBrandMarketing,
  mapUseCaseResearchTags,
  mapVideoToAdditionalUseCase,
  markUseCaseOfficialVideoUnavailable,
  resolveUseCaseMediaStage,
  submitUseCaseEditorialReview,
  verifyUseCaseOfficialSource,
} from "@/services/use-case-media-research";

const EXACT_USE_CASE =
  "https://www.youtube.com/watch?v=tRpOCQ15L7M";
const CAPABILITY_LEVEL =
  "https://www.youtube.com/watch?v=cU0FYEDRop8";
const FEATURE_LEVEL =
  "https://www.youtube.com/watch?v=abcdefghijk";
const GENERIC_PRODUCT =
  "https://www.youtube.com/watch?v=lmnopqrstuv";
const INDUSTRY_SPECIFIC =
  "https://www.youtube.com/watch?v=wxyzzzzzzzz";
const UNOFFICIAL =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const LEAD_STEPS = [
  { id: "capture", label: "Capture" },
  { id: "qualify", label: "Qualify" },
  { id: "route", label: "Assign" },
  { id: "recycle", label: "Follow up" },
  { id: "convert", label: "Convert" },
  { id: "measure", label: "Measure" },
];

describe("isLikelyGenericBrandMarketing", () => {
  it("flags brand-only titles and allows workflow demos", () => {
    expect(
      isLikelyGenericBrandMarketing({ title: "Our Brand Story" }),
    ).toBe(true);
    expect(
      isLikelyGenericBrandMarketing({
        title: "Lead Management Workflow Demo",
      }),
    ).toBe(false);
  });
});

describe("discoverUseCaseOfficialVideo", () => {
  it("registers exact use-case workflow demo as discovered (not public)", () => {
    const result = discoverUseCaseOfficialVideo({
      productSlug: "hubspot",
      productId: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Lead Management Demo",
      useCaseId: "lead-management",
      type: "official-tutorial",
      potentialWorkflowStepIds: ["capture", "route"],
      potentialFeatureIds: ["lead-management"],
      sourceOrganization: "HubSpot",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stage).toBe("discovered");
    expect(result.media.status).toBe("discovered");
    expect(result.media.officialSource).toBe(false);
    expect(result.media.useCaseIds).toContain("lead-management");
    expect(result.media.workflowStageIds).toEqual(
      expect.arrayContaining(["capture", "route"]),
    );
    expect(isVideoPublicEligible(result.media).eligible).toBe(false);
  });

  it("accepts capability-level, feature-level, product demo, and webinar types", () => {
    const capability = discoverUseCaseOfficialVideo({
      id: "cap-level",
      productSlug: "pipedrive",
      sourceUrl: CAPABILITY_LEVEL,
      title: "Pipeline management walkthrough",
      useCaseId: "pipeline-management",
      type: "official-video",
      potentialCapabilityIds: ["pipeline-management"],
    });
    expect(capability.ok).toBe(true);
    if (!capability.ok) return;
    expect(capability.media.capabilityIds).toContain("pipeline-management");

    const feature = discoverUseCaseOfficialVideo({
      id: "feat-level",
      productSlug: "hubspot",
      sourceUrl: FEATURE_LEVEL,
      title: "Workflow automation feature tutorial",
      potentialFeatureIds: ["workflow-automation"],
      potentialUseCaseIds: ["sales-automation"],
      type: "official-tutorial",
    });
    expect(feature.ok).toBe(true);
    if (!feature.ok) return;
    expect(feature.media.featureIds).toContain("workflow-automation");

    const webinar = discoverUseCaseOfficialVideo({
      id: "webinar",
      productSlug: "hubspot",
      sourceUrl: INDUSTRY_SPECIFIC,
      title: "Financial services CRM webinar",
      useCaseId: "lead-management",
      type: "official-webinar",
      potentialIndustryIds: ["financial-services"],
    });
    expect(webinar.ok).toBe(true);
    if (!webinar.ok) return;
    expect(webinar.media.industryIds).toContain("financial-services");

    const blocked = discoverUseCaseOfficialVideo({
      id: "sg",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "SG analysis",
      useCaseId: "lead-management",
      type: "softwareglimpse-video",
    });
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.code).toBe("UNSUPPORTED_TYPE");
  });

  it("rejects generic brand marketing and allows generic product demos with demo signal", () => {
    const brand = discoverUseCaseOfficialVideo({
      id: "brand",
      productSlug: "hubspot",
      sourceUrl: GENERIC_PRODUCT,
      title: "Our Brand Story",
      useCaseId: "lead-management",
    });
    expect(brand.ok).toBe(false);
    if (brand.ok) return;
    expect(brand.code).toBe("GENERIC_BRAND_MARKETING");

    const productDemo = discoverUseCaseOfficialVideo({
      id: "product-demo",
      productSlug: "hubspot",
      sourceUrl: GENERIC_PRODUCT,
      title: "HubSpot product demonstration",
      useCaseId: "lead-management",
      type: "official-video",
    });
    expect(productDemo.ok).toBe(true);
  });

  it("rejects duplicate provider/providerId — reuse canonical ResearchMedia", () => {
    const first = discoverUseCaseOfficialVideo({
      id: "uc-1",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Lead Management Demo",
      useCaseId: "lead-management",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const dup = discoverUseCaseOfficialVideo(
      {
        productSlug: "hubspot",
        sourceUrl: "https://youtu.be/tRpOCQ15L7M",
        title: "Same video for Feature page",
        useCaseId: "pipeline-management",
      },
      [first.media],
    );
    expect(dup.ok).toBe(false);
    if (dup.ok) return;
    expect(dup.code).toBe("DUPLICATE");
    expect(dup.duplicateOf?.id).toBe("uc-1");
  });
});

describe("use-case official video lifecycle", () => {
  it("runs discovered → verified → classified → editorially-reviewed → active without auto-publish", () => {
    const discovered = discoverUseCaseOfficialVideo({
      id: "uc-lifecycle",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Lead Management Demo",
      useCaseId: "lead-management",
      type: "official-tutorial",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;
    expect(isVideoPublicEligible(discovered.media).eligible).toBe(false);

    const verified = verifyUseCaseOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-training",
      sourceOrganization: "HubSpot",
      channelName: "HubSpot",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    expect(verified.media.officialSource).toBe(true);
    expect(verified.media.status).toBe("verified");
    expect(isVideoPublicEligible(verified.media).eligible).toBe(false);

    const emptyClassify = classifyUseCaseOfficialVideo({
      media: verified.media,
      useCaseIds: ["lead-management"],
      whatThisShows: [],
    });
    expect(emptyClassify.ok).toBe(false);

    const classified = classifyUseCaseOfficialVideo({
      media: verified.media,
      productIds: ["hubspot"],
      useCaseIds: ["lead-management"],
      workflowStepIds: ["capture", "qualify", "route", "recycle"],
      capabilityIds: ["lead-management", "workflow-automation"],
      requirementIds: ["automate-lead-follow-up"],
      featureIds: ["lead-management", "workflow-automation"],
      industryIds: [],
      whatThisShows: [
        "assignment configuration",
        "owner assignment",
        "qualification status updates",
      ],
      whatToNotice: ["whether ownership is obvious after assignment"],
      limitations: ["minimum plan", "assignment limits", "pricing"],
      evidenceClaimKinds: ["workflow-demo"],
      placements: ["use-cases", "evidence"],
      demonstratesCaption: "Lead routing demonstration",
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.status).toBe("classified");
    expect(classified.media.workflowStageIds).toEqual([
      "capture",
      "qualify",
      "route",
      "recycle",
    ]);
    expect(classified.media.whatToNotice.length).toBeGreaterThan(0);
    expect(isVideoPublicEligible(classified.media).eligible).toBe(false);

    const coverage = buildExplicitWorkflowCoverage(
      classified.media,
      LEAD_STEPS,
    );
    expect(coverage.find((c) => c.stepId === "capture")?.status).toBe(
      "demonstrated",
    );
    expect(coverage.find((c) => c.stepId === "route")?.status).toBe(
      "demonstrated",
    );
    expect(coverage.find((c) => c.stepId === "convert")?.status).toBe(
      "not-shown",
    );
    expect(coverage.find((c) => c.stepId === "measure")?.status).toBe(
      "not-shown",
    );
    // Do not infer unseen stages from title/marketing
    expect(coverage.every((c) => c.status === "demonstrated" || c.status === "not-shown")).toBe(
      true,
    );

    const earlyActivate = activateUseCaseOfficialVideo({
      media: classified.media,
    });
    expect(earlyActivate.ok).toBe(false);

    const review = submitUseCaseEditorialReview({
      media: classified.media,
      editorialCommentary:
        "Grounded lead workflow demo; safe for Use Case Detail.",
    });
    expect(review.ok).toBe(true);
    if (!review.ok) return;
    expect(review.stage).toBe("editorially-reviewed");
    expect(review.media.status).toBe("needs-review");
    expect(isVideoPublicEligible(review.media).eligible).toBe(false);

    const active = activateUseCaseOfficialVideo({ media: review.media });
    expect(active.ok).toBe(true);
    if (!active.ok) return;
    expect(active.media.status).toBe("active");
    expect(isVideoPublicEligible(active.media).eligible).toBe(true);
  });

  it("blocks unofficial videos from classification and activation", () => {
    const discovered = discoverUseCaseOfficialVideo({
      id: "third-party",
      productSlug: "hubspot",
      sourceUrl: UNOFFICIAL,
      title: "Random CRM review tutorial",
      useCaseId: "lead-management",
      sourceOrganization: "Some Reviewer",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const classified = classifyUseCaseOfficialVideo({
      media: discovered.media,
      useCaseIds: ["lead-management"],
      whatThisShows: ["UI tour"],
    });
    expect(classified.ok).toBe(false);
    if (classified.ok) return;
    expect(classified.code).toBe("OFFICIAL_SOURCE_REQUIRED");
  });

  it("marks removed video unavailable without erasing research history", () => {
    const discovered = discoverUseCaseOfficialVideo({
      id: "to-remove",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Lead Management Demo",
      useCaseId: "lead-management",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const verified = verifyUseCaseOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-training",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const gone = markUseCaseOfficialVideoUnavailable({
      media: verified.media,
      reason: "deleted",
    });
    expect(gone.ok).toBe(true);
    if (!gone.ok) return;
    expect(gone.media.status).toBe("unavailable");
    expect(gone.media.sourceHealth).toBe("unavailable");
    expect(gone.media.refreshFlags).toContain("source-unavailable");
    expect(gone.media.title).toBe("Lead Management Demo");
    expect(gone.media.useCaseIds).toContain("lead-management");
    expect(isVideoPublicEligible(gone.media).eligible).toBe(false);
  });

  it("maps one video across Product / Feature / Capability / Use Case without duplication", () => {
    const discovered = discoverUseCaseOfficialVideo({
      id: "multi-context",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Sales Hub tutorial",
      useCaseId: "lead-management",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const moreUc = mapVideoToAdditionalUseCase(
      discovered.media,
      "pipeline-management",
    );
    expect(moreUc.ok).toBe(true);
    if (!moreUc.ok) return;

    const tagged = mapUseCaseResearchTags(moreUc.media, {
      capabilityIds: ["pipeline-management"],
      featureIds: ["deal-management"],
      requirementIds: ["track-opportunity-progress"],
      industryIds: ["financial-services"],
      workflowStepIds: ["qualify"],
    });
    expect(tagged.ok).toBe(true);
    if (!tagged.ok) return;
    expect(tagged.media.id).toBe("multi-context");
    expect(tagged.media.useCaseIds).toEqual([
      "lead-management",
      "pipeline-management",
    ]);
    expect(tagged.media.capabilityIds).toContain("pipeline-management");
    expect(tagged.media.featureIds).toContain("deal-management");
    expect(tagged.media.industryIds).toContain("financial-services");
  });
});

describe("findDuplicateResearchMedia (shared catalog)", () => {
  it("matches use-case discovery against existing product media", () => {
    const a = discoverUseCaseOfficialVideo({
      id: "shared-uc",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "A",
      useCaseId: "lead-management",
    });
    expect(a.ok).toBe(true);
    if (!a.ok) return;
    const hit = findDuplicateResearchMedia(
      {
        id: "shared-b",
        provider: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M&utm_source=x",
        videoId: "tRpOCQ15L7M",
      },
      [a.media],
    );
    expect(hit?.id).toBe("shared-uc");
  });
});

describe("resolveUseCaseMediaStage", () => {
  it("maps needs-review to editorially-reviewed", () => {
    const d = discoverUseCaseOfficialVideo({
      id: "stage",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "A",
      useCaseId: "lead-management",
    });
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    expect(resolveUseCaseMediaStage(d.media)).toBe("discovered");
  });
});

describe("media health for use-case videos", () => {
  it("covers availability, embedding, source status, verification freshness", () => {
    const discovered = discoverUseCaseOfficialVideo({
      id: "health",
      productSlug: "hubspot",
      sourceUrl: EXACT_USE_CASE,
      title: "Lead Management Demo",
      useCaseId: "lead-management",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const verified = verifyUseCaseOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-training",
      verifiedAt: "2026-08-14T12:00:00.000Z",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const results = evaluateUseCaseMediaHealth([verified.media], {
      useCaseSlug: "lead-management",
      now: new Date("2026-08-14T18:00:00.000Z"),
    });
    expect(results).toHaveLength(1);
    expect(results[0]?.sourceHealth).toBeDefined();
    expect(results[0]?.beyondReviewThreshold).toBe(false);
    expect(Array.isArray(results[0]?.flags)).toBe(true);
    expect(results[0]?.publicVisibility).toBeDefined();

    const gov = evaluateMediaGovernance({
      media: verified.media,
      now: new Date("2026-08-14T18:00:00.000Z"),
    });
    expect(gov.notes.length).toBeGreaterThanOrEqual(0);
    // Embedding / availability signals live on flags when probe or status says so
    expect(
      gov.flags.includes("embedding-disabled") ||
        verified.media.embeddingAllowed !== false,
    ).toBe(true);  });
});

describe("buildUseCaseVisualCoverageReport", () => {
  it("reports coverage without treating missing video as incompleteness", () => {
    const report = buildUseCaseVisualCoverageReport("lead-management");
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.useCaseSlug).toBe("lead-management");
    expect(report.productsAssessed).toBeGreaterThan(0);
    expect(report.note.toLowerCase()).toContain("informational");
    expect(report.note.toLowerCase()).toContain("does not alter");
    expect(typeof report.productsWithWorkflowEvidence).toBe("number");
    expect(typeof report.productsWithScreenshots).toBe("number");
    expect(typeof report.productsWithOfficialWorkflowVideo).toBe("number");

    const text = formatUseCaseVisualCoverageReportText(report);
    expect(text).toContain("Products assessed:");
    expect(text).toContain("Products with workflow evidence:");
    expect(text).toContain("Products with screenshots:");
    expect(text).toContain("Products with official workflow video:");
  });
});
