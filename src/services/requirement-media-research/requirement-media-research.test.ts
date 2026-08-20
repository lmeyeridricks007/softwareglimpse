import { describe, expect, it } from "vitest";
import { isVideoPublicEligible } from "@/services/product-media";
import {
  activateRequirementOfficialVideo,
  buildExplicitCriterionCoverage,
  buildRequirementVisualCoverageReport,
  classifyRequirementOfficialVideo,
  discoverRequirementOfficialVideo,
  findDuplicateResearchMedia,
  formatRequirementVisualCoverageReportText,
  isLikelyGenericBrandMarketing,
  mapRequirementResearchTags,
  mapVideoToAdditionalRequirement,
  markRequirementOfficialVideoUnavailable,
  resolveRequirementMediaStage,
  submitRequirementEditorialReview,
  verifyRequirementOfficialSource,
} from "@/services/requirement-media-research";

const ONE_CRITERION = "https://www.youtube.com/watch?v=cU0FYEDRop8";
const TWO_CRITERIA = "https://www.youtube.com/watch?v=tRpOCQ15L7M";
const FEATURE_ONLY = "https://www.youtube.com/watch?v=abcdefghijk";
const GENERIC_PRODUCT = "https://www.youtube.com/watch?v=lmnopqrstuv";
const UNOFFICIAL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const UNAVAILABLE = "https://www.youtube.com/watch?v=wxyzzzzzzzz";

const CRITERIA = [
  { id: "separate-structure", label: "Separate process structure" },
  { id: "independent-stages", label: "Independent stages" },
  { id: "access-control", label: "Access control" },
  { id: "automation", label: "Process-specific automation" },
  { id: "reporting", label: "Separate reporting" },
];

describe("isLikelyGenericBrandMarketing", () => {
  it("flags brand-only titles and allows requirement demos", () => {
    expect(
      isLikelyGenericBrandMarketing({ title: "Our Brand Story" }),
    ).toBe(true);
    expect(
      isLikelyGenericBrandMarketing({
        title: "Multiple pipeline setup walkthrough",
      }),
    ).toBe(false);
  });
});

describe("discoverRequirementOfficialVideo", () => {
  it("registers discovered media without auto-publishing", () => {
    const result = discoverRequirementOfficialVideo({
      productSlug: "pipedrive",
      productId: "pipedrive",
      sourceUrl: ONE_CRITERION,
      title: "Multiple pipeline setup",
      requirementId: "separate-sales-processes",
      potentialCriterionIds: ["independent-stages"],
      potentialFeatureIds: ["custom-pipelines"],
      type: "official-video",
      sourceOrganization: "Pipedrive",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stage).toBe("discovered");
    expect(result.media.status).toBe("discovered");
    expect(result.media.officialSource).toBe(false);
    expect(result.media.requirementIds).toContain("separate-sales-processes");
    expect(result.media.requirementCriterionIds).toContain(
      "independent-stages",
    );
    expect(isVideoPublicEligible(result.media).eligible).toBe(false);
  });

  it("rejects generic product / brand marketing by default", () => {
    const result = discoverRequirementOfficialVideo({
      productSlug: "pipedrive",
      sourceUrl: GENERIC_PRODUCT,
      title: "Welcome to our brand story",
      requirementId: "separate-sales-processes",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("GENERIC_BRAND_MARKETING");
  });

  it("prevents duplicate ResearchMedia by provider ID / source URL", () => {
    const first = discoverRequirementOfficialVideo({
      id: "canonical-pd",
      productSlug: "pipedrive",
      sourceUrl: ONE_CRITERION,
      title: "Pipeline demo",
      requirementId: "separate-sales-processes",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const dup = discoverRequirementOfficialVideo(
      {
        productSlug: "pipedrive",
        sourceUrl: ONE_CRITERION,
        title: "Same pipeline demo again",
        requirementId: "separate-sales-processes",
      },
      [first.media],
    );
    expect(dup.ok).toBe(false);
    if (dup.ok) return;
    expect(dup.code).toBe("DUPLICATE");
    expect(dup.duplicateOf?.id).toBe("canonical-pd");

    const viaHelper = findDuplicateResearchMedia(
      {
        id: "other",
        provider: "youtube",
        sourceUrl: ONE_CRITERION,
        videoId: "cU0FYEDRop8",
        providerId: "cU0FYEDRop8",
      },
      [first.media],
    );
    expect(viaHelper?.id).toBe("canonical-pd");
  });
});

describe("classifyRequirementOfficialVideo", () => {
  function verifiedBase(sourceUrl: string, title: string) {
    const discovered = discoverRequirementOfficialVideo({
      productSlug: "pipedrive",
      sourceUrl,
      title,
      requirementId: "separate-sales-processes",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) throw new Error("discover failed");
    const verified = verifyRequirementOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-channel",
      sourceOrganization: "Pipedrive",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) throw new Error("verify failed");
    return verified.media;
  }

  it("classifies video supporting one criterion", () => {
    const media = verifiedBase(ONE_CRITERION, "Independent stages demo");
    const classified = classifyRequirementOfficialVideo({
      media,
      productIds: ["pipedrive"],
      requirementIds: ["separate-sales-processes"],
      requirementCriterionIds: ["independent-stages"],
      featureIds: ["custom-pipelines"],
      capabilityIds: ["pipeline-management"],
      whatThisShows: [
        "multiple pipeline selector",
        "distinct stage configuration",
      ],
      limitations: ["pipeline permissions", "reporting configuration"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.requirementCriterionIds).toEqual([
      "independent-stages",
    ]);
    expect(classified.media.whatThisShows).toEqual([
      "multiple pipeline selector",
      "distinct stage configuration",
    ]);
    expect(classified.media.limitations).toEqual(
      expect.arrayContaining([
        "pipeline permissions",
        "reporting configuration",
      ]),
    );
    expect(classified.media.status).toBe("classified");
    expect(isVideoPublicEligible(classified.media).eligible).toBe(false);

    const coverage = buildExplicitCriterionCoverage(
      classified.media,
      CRITERIA,
    );
    expect(
      coverage.find((c) => c.criterionId === "independent-stages")?.status,
    ).toBe("demonstrated");
    expect(
      coverage.find((c) => c.criterionId === "access-control")?.status,
    ).toBe("not-shown");
  });

  it("classifies video supporting two criteria", () => {
    const media = verifiedBase(TWO_CRITERIA, "Separate processes walkthrough");
    const classified = classifyRequirementOfficialVideo({
      media,
      requirementIds: ["separate-sales-processes"],
      requirementCriterionIds: ["separate-structure", "independent-stages"],
      featureIds: ["custom-pipelines", "pipeline-management"],
      whatThisShows: [
        "creation of separate pipelines",
        "distinct pipeline stages",
      ],
      limitations: ["access control depth"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.requirementCriterionIds).toEqual([
      "separate-structure",
      "independent-stages",
    ]);
    const coverage = buildExplicitCriterionCoverage(
      classified.media,
      CRITERIA,
    );
    expect(
      coverage.filter((c) => c.status === "demonstrated").map((c) => c.criterionId),
    ).toEqual(["separate-structure", "independent-stages"]);
  });

  it("allows feature mapping without claiming whole-requirement criteria", () => {
    const media = verifiedBase(FEATURE_ONLY, "Custom pipelines feature tutorial");
    const classified = classifyRequirementOfficialVideo({
      media,
      requirementIds: ["separate-sales-processes"],
      requirementCriterionIds: [],
      featureIds: ["custom-pipelines"],
      whatThisShows: ["pipeline list UI"],
      limitations: [
        "does not demonstrate independent stages",
        "does not establish full requirement support",
      ],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.featureIds).toContain("custom-pipelines");
    expect(classified.media.requirementCriterionIds).toEqual([]);
    expect(classified.media.requirementIds).toContain(
      "separate-sales-processes",
    );
    const coverage = buildExplicitCriterionCoverage(
      classified.media,
      CRITERIA,
    );
    expect(coverage.every((c) => c.status === "not-shown")).toBe(true);
  });

  it("blocks classification of unofficial media", () => {
    const discovered = discoverRequirementOfficialVideo({
      productSlug: "pipedrive",
      sourceUrl: UNOFFICIAL,
      title: "Pipeline demo from random channel",
      requirementId: "separate-sales-processes",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;
    expect(discovered.media.officialSource).toBe(false);

    const classified = classifyRequirementOfficialVideo({
      media: discovered.media,
      requirementIds: ["separate-sales-processes"],
      requirementCriterionIds: ["independent-stages"],
      whatThisShows: ["something visible"],
    });
    expect(classified.ok).toBe(false);
    if (classified.ok) return;
    expect(classified.code).toBe("OFFICIAL_SOURCE_REQUIRED");
  });
});

describe("lifecycle activation + unavailable", () => {
  it("requires editorial review before activation and never auto-publishes discovery", () => {
    const discovered = discoverRequirementOfficialVideo({
      productSlug: "pipedrive",
      sourceUrl: UNAVAILABLE,
      title: "Pipeline permissions tutorial",
      requirementId: "separate-sales-processes",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const earlyActivate = activateRequirementOfficialVideo({
      media: discovered.media,
    });
    expect(earlyActivate.ok).toBe(false);
    if (!earlyActivate.ok) {
      expect(earlyActivate.code).toBe("NOT_IN_REVIEW");
    }

    const verified = verifyRequirementOfficialSource({
      media: discovered.media,
      officialSourceKind: "vendor-training",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const classified = classifyRequirementOfficialVideo({
      media: verified.media,
      requirementIds: ["separate-sales-processes"],
      requirementCriterionIds: ["access-control"],
      featureIds: ["custom-fields"],
      whatThisShows: ["visibility settings panel"],
      limitations: ["plan-level enforcement"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;

    const reviewed = submitRequirementEditorialReview({
      media: classified.media,
      editorialCommentary: "Useful partial evidence for access-control only",
    });
    expect(reviewed.ok).toBe(true);
    if (!reviewed.ok) return;
    expect(reviewed.media.status).toBe("needs-review");

    const active = activateRequirementOfficialVideo({
      media: reviewed.media,
    });
    expect(active.ok).toBe(true);
    if (!active.ok) return;
    expect(active.stage).toBe("active");
    expect(isVideoPublicEligible(active.media).eligible).toBe(true);
  });

  it("marks unavailable without deleting research history", () => {
    const discovered = discoverRequirementOfficialVideo({
      id: "gone-video",
      productSlug: "hubspot",
      sourceUrl: "https://www.youtube.com/watch?v=zzzzzzzzzzz",
      title: "Lead automation demo",
      requirementId: "automate-lead-follow-up",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const gone = markRequirementOfficialVideoUnavailable({
      media: discovered.media,
      reason: "source-unavailable",
    });
    expect(gone.ok).toBe(true);
    if (!gone.ok) return;
    expect(gone.stage).toBe("unavailable");
    expect(gone.media.status).toBe("unavailable");
    expect(gone.media.sourceHealth).toBe("unavailable");
    expect(gone.media.refreshFlags).toContain("source-unavailable");
    expect(isVideoPublicEligible(gone.media).eligible).toBe(false);
    expect(resolveRequirementMediaStage(gone.media)).toBe("unavailable");
  });

  it("reuses canonical media across Product / Feature / Requirement tags", () => {
    const discovered = discoverRequirementOfficialVideo({
      id: "multi-context",
      productSlug: "pipedrive",
      sourceUrl: "https://www.youtube.com/watch?v=bbbbbbbbbbb",
      title: "Pipeline management demo",
      requirementId: "separate-sales-processes",
      potentialFeatureIds: ["custom-pipelines"],
      potentialCapabilityIds: ["pipeline-management"],
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;

    const tagged = mapRequirementResearchTags(discovered.media, {
      useCaseIds: ["lead-management"],
      requirementCriterionIds: ["separate-structure"],
      industryIds: ["financial-services"],
    });
    expect(tagged.ok).toBe(true);
    if (!tagged.ok) return;
    expect(tagged.media.useCaseIds).toContain("lead-management");
    expect(tagged.media.requirementCriterionIds).toContain(
      "separate-structure",
    );
    expect(tagged.media.industryIds).toContain("financial-services");

    const extraReq = mapVideoToAdditionalRequirement(
      tagged.media,
      "restrict-access-by-team",
    );
    expect(extraReq.ok).toBe(true);
    if (!extraReq.ok) return;
    expect(extraReq.media.requirementIds).toEqual(
      expect.arrayContaining([
        "separate-sales-processes",
        "restrict-access-by-team",
      ]),
    );
  });
});

describe("buildRequirementVisualCoverageReport", () => {
  it("reports criteria, products, evidence coverage, and video counts without scoring", () => {
    const report = buildRequirementVisualCoverageReport(
      "separate-sales-processes",
    );
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.requirementName).toMatch(/Separate Sales Processes/i);
    expect(report.criteriaCount).toBeGreaterThanOrEqual(5);
    expect(report.productsAssessed).toBeGreaterThan(0);
    expect(["High", "Medium", "Low", "Unknown"]).toContain(
      report.evidenceCoverage,
    );
    expect(typeof report.productsWithOfficialVideo).toBe("number");
    expect(report.note).toContain("must not alter requirement fit");

    const text = formatRequirementVisualCoverageReportText(report);
    expect(text).toContain("Criteria:");
    expect(text).toContain("Products assessed:");
    expect(text).toContain("Evidence coverage:");
    expect(text).toContain("Products with official video:");
  });
});
