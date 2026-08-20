import { describe, expect, it } from "vitest";
import { isVideoPublicEligible } from "@/services/product-media";
import { selectIndustrySeeInActionCards } from "@/services/product-media/industry-page-media";
import {
  activateIndustryOfficialVideo,
  buildIndustryVisualCoverageReport,
  classifyIndustryOfficialVideo,
  discoverIndustryOfficialVideo,
  findDuplicateResearchMedia,
  flagIndustryMediaHealth,
  formatIndustryVisualCoverageReportText,
  isLikelyGenericBrandMarketing,
  mapIndustryResearchTags,
  mapVideoToAdditionalIndustry,
  markIndustryOfficialVideoUnavailable,
  resolveIndustryMediaStage,
  submitIndustryEditorialReview,
  verifyIndustryOfficialSource,
} from "@/services/industry-media-research";

const INDUSTRY_SPECIFIC = "https://www.youtube.com/watch?v=Kzjzo4Kdoc4";
const GENERAL_WORKFLOW = "https://www.youtube.com/watch?v=cU0FYEDRop8";
const INDUSTRY_EDITION = "https://www.youtube.com/watch?v=tRpOCQ15L7M";
const CASE_STUDY = "https://www.youtube.com/watch?v=HKaG5HN89x8";
const WEAK = "https://www.youtube.com/watch?v=abcdefghijk";
const UNOFFICIAL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
const UNAVAILABLE = "https://www.youtube.com/watch?v=wxyzzzzzzzz";

function discoverAndVerify(input: {
  sourceUrl: string;
  title: string;
  type?: "official-video" | "official-tutorial" | "official-webinar" | "official-customer-case-study";
  industryId?: string;
}) {
  const discovered = discoverIndustryOfficialVideo({
    productSlug: "salesforce",
    productId: "salesforce",
    sourceUrl: input.sourceUrl,
    title: input.title,
    industryId: input.industryId ?? "financial-services",
    type: input.type ?? "official-video",
    sourceOrganization: "Salesforce",
  });
  expect(discovered.ok).toBe(true);
  if (!discovered.ok) throw new Error("discover failed");
  const verified = verifyIndustryOfficialSource({
    media: discovered.media,
    officialSourceKind: "vendor-channel",
    sourceOrganization: "Salesforce",
    channelName: "Salesforce",
  });
  expect(verified.ok).toBe(true);
  if (!verified.ok) throw new Error("verify failed");
  return verified.media;
}

describe("isLikelyGenericBrandMarketing", () => {
  it("flags brand-only titles and allows industry demos", () => {
    expect(
      isLikelyGenericBrandMarketing({ title: "Our Brand Story" }),
    ).toBe(true);
    expect(
      isLikelyGenericBrandMarketing({
        title: "Financial Services Cloud workflow demo",
      }),
    ).toBe(false);
  });
});

describe("industry media research lifecycle", () => {
  it("registers industry-specific demo without auto-publishing", () => {
    const result = discoverIndustryOfficialVideo({
      productSlug: "salesforce",
      productId: "salesforce",
      sourceUrl: INDUSTRY_SPECIFIC,
      title: "Financial services CRM product demo",
      industryId: "financial-services",
      potentialUseCaseIds: ["advisory-relationship-management"],
      potentialCapabilityIds: ["pipeline-management"],
      type: "official-video",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.stage).toBe("discovered");
    expect(result.media.status).toBe("discovered");
    expect(result.media.officialSource).toBe(false);
    expect(result.media.industryIds).toContain("financial-services");
    expect(isVideoPublicEligible(result.media).eligible).toBe(false);

    const verified = verifyIndustryOfficialSource({
      media: result.media,
      officialSourceKind: "vendor-channel",
      sourceOrganization: "Salesforce",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;

    const classified = classifyIndustryOfficialVideo({
      media: verified.media,
      industryIds: ["financial-services"],
      mediaContext: "industry-specific",
      industryRelevance: "exact-industry-specific",
      useCaseIds: ["advisory-relationship-management"],
      capabilityIds: ["pipeline-management"],
      featureIds: ["contact-management"],
      whatThisShows: ["household client account relationships"],
      whatToNotice: ["advisor workspace layout"],
      limitations: ["regulatory compliance", "typical ROI"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.mediaContext).toBe("industry-specific");
    expect(classified.media.industryRelevance).toBe("exact-industry-specific");
    expect(classified.media.whatThisShows).toContain(
      "household client account relationships",
    );
    expect(isVideoPublicEligible(classified.media).eligible).toBe(false);

    const reviewed = submitIndustryEditorialReview({
      media: classified.media,
      editorialCommentary: "Grounded FS workflow demo",
    });
    expect(reviewed.ok).toBe(true);
    if (!reviewed.ok) return;
    expect(reviewed.media.status).toBe("needs-review");

    const active = activateIndustryOfficialVideo({ media: reviewed.media });
    expect(active.ok).toBe(true);
    if (!active.ok) return;
    expect(active.media.status).toBe("active");
    expect(isVideoPublicEligible(active.media).eligible).toBe(true);
  });

  it("classifies general workflow with strongly-relevant-general", () => {
    const media = discoverAndVerify({
      sourceUrl: GENERAL_WORKFLOW,
      title: "Pipeline management walkthrough",
    });
    const classified = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "general-workflow",
      industryRelevance: "strongly-relevant-general",
      whatThisShows: ["pipeline board stages"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.mediaContext).toBe("general-workflow");
    expect(classified.media.industryRelevance).toBe(
      "strongly-relevant-general",
    );
  });

  it("classifies industry edition with edition label", () => {
    const media = discoverAndVerify({
      sourceUrl: INDUSTRY_EDITION,
      title: "Financial Services Cloud overview",
    });
    const missing = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "industry-edition",
      industryRelevance: "exact-industry-specific",
      whatThisShows: ["FSC household model"],
    });
    expect(missing.ok).toBe(false);
    if (missing.ok) return;
    expect(missing.code).toBe("MISSING_EDITION_LABEL");

    const classified = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "industry-edition",
      industryRelevance: "exact-industry-specific",
      industryEditionLabel: "Financial Services Cloud",
      whatThisShows: ["FSC household model"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.industryEditionLabel).toBe(
      "Financial Services Cloud",
    );
  });

  it("classifies case study with vendor-reported outcomes", () => {
    const media = discoverAndVerify({
      sourceUrl: CASE_STUDY,
      title: "Customer success story",
      type: "official-customer-case-study",
    });
    const classified = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "customer-case-study",
      industryRelevance: "strongly-relevant-general",
      customerOrganization: "Acme Advisory",
      whatThisShows: ["advisor onboarding handoff"],
      reportedOutcomes: ["Product increased conversion by 40%"],
      limitations: ["typical ROI", "guaranteed results"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;
    expect(classified.media.type).toBe("official-customer-case-study");
    expect(classified.media.reportedOutcomes).toEqual([
      "Product increased conversion by 40%",
    ]);
    expect(classified.media.customerOrganization).toBe("Acme Advisory");
  });

  it("keeps weak relevance out of primary see-in-action", () => {
    const media = discoverAndVerify({
      sourceUrl: WEAK,
      title: "Generic CRM tips loosely related",
    });
    const classified = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "general-workflow",
      industryRelevance: "weak",
      whatThisShows: ["generic contact list"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;

    const reviewed = submitIndustryEditorialReview({ media: classified.media });
    expect(reviewed.ok).toBe(true);
    if (!reviewed.ok) return;
    const active = activateIndustryOfficialVideo({ media: reviewed.media });
    expect(active.ok).toBe(true);
    if (!active.ok) return;

    const seeIn = selectIndustrySeeInActionCards({
      mediaPool: [active.media],
      products: [{ slug: "salesforce", name: "Salesforce" }],
      ctx: { industrySlug: "financial-services" },
      limit: 4,
    });
    expect(seeIn).toHaveLength(0);
  });

  it("reuses canonical ResearchMedia on duplicate discovery", () => {
    const first = discoverIndustryOfficialVideo({
      id: "canonical-fs-demo",
      productSlug: "salesforce",
      sourceUrl: INDUSTRY_SPECIFIC,
      title: "FS product demo",
      industryId: "financial-services",
    });
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const dup = discoverIndustryOfficialVideo(
      {
        productSlug: "salesforce",
        sourceUrl: INDUSTRY_SPECIFIC,
        title: "Same FS demo again",
        industryId: "financial-services",
      },
      [first.media],
    );
    expect(dup.ok).toBe(false);
    if (dup.ok) return;
    expect(dup.code).toBe("DUPLICATE");
    expect(dup.duplicateOf?.id).toBe("canonical-fs-demo");

    const mapped = mapVideoToAdditionalIndustry(first.media, "real-estate");
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;
    expect(mapped.media.industryIds).toEqual(
      expect.arrayContaining(["financial-services", "real-estate"]),
    );

    const tagged = mapIndustryResearchTags(mapped.media, {
      useCaseIds: ["lead-management"],
      capabilityIds: ["contact-management"],
      featureIds: ["pipeline-management"],
    });
    expect(tagged.ok).toBe(true);
    if (!tagged.ok) return;
    expect(tagged.media.useCaseIds).toContain("lead-management");
    expect(
      findDuplicateResearchMedia(
        { id: "", provider: "youtube", sourceUrl: INDUSTRY_SPECIFIC },
        [first.media],
      )?.id,
    ).toBe("canonical-fs-demo");
  });

  it("blocks unofficial activation and requires official verification", () => {
    const discovered = discoverIndustryOfficialVideo({
      productSlug: "salesforce",
      sourceUrl: UNOFFICIAL,
      title: "Unofficial upload of FS demo",
      industryId: "financial-services",
    });
    expect(discovered.ok).toBe(true);
    if (!discovered.ok) return;
    expect(discovered.media.officialSource).toBe(false);

    const classifyWithoutVerify = classifyIndustryOfficialVideo({
      media: discovered.media,
      industryIds: ["financial-services"],
      mediaContext: "industry-specific",
      industryRelevance: "exact-industry-specific",
      whatThisShows: ["something"],
    });
    expect(classifyWithoutVerify.ok).toBe(false);
    if (classifyWithoutVerify.ok) return;
    expect(classifyWithoutVerify.code).toBe("OFFICIAL_SOURCE_REQUIRED");
  });

  it("marks unavailable / health flags without deleting history", () => {
    const media = discoverAndVerify({
      sourceUrl: UNAVAILABLE,
      title: "Industry workflow demo",
    });
    const classified = classifyIndustryOfficialVideo({
      media,
      industryIds: ["financial-services"],
      mediaContext: "industry-specific",
      industryRelevance: "exact-industry-specific",
      whatThisShows: ["workflow steps"],
    });
    expect(classified.ok).toBe(true);
    if (!classified.ok) return;

    const gone = markIndustryOfficialVideoUnavailable({
      media: classified.media,
      reason: "deleted",
    });
    expect(gone.ok).toBe(true);
    if (!gone.ok) return;
    expect(gone.media.status).toBe("unavailable");
    expect(gone.media.refreshFlags).toContain("source-unavailable");
    expect(resolveIndustryMediaStage(gone.media)).toBe("unavailable");
    expect(isVideoPublicEligible(gone.media).eligible).toBe(false);

    const health = flagIndustryMediaHealth({
      media: classified.media,
      flags: [
        "embedding-disabled",
        "stale-ui",
        "source-changed",
        "industry-relationship-needs-review",
      ],
    });
    expect(health.ok).toBe(true);
    if (!health.ok) return;
    expect(health.media.refreshFlags).toEqual(
      expect.arrayContaining([
        "embedding-disabled",
        "stale-ui",
        "source-changed",
        "industry-relationship-needs-review",
      ]),
    );
  });

  it("rejects generic brand marketing by default", () => {
    const result = discoverIndustryOfficialVideo({
      productSlug: "salesforce",
      sourceUrl: "https://www.youtube.com/watch?v=brandbrand1",
      title: "Welcome to our brand story",
      industryId: "financial-services",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("GENERIC_BRAND_MARKETING");
  });
});

describe("industry visual coverage report", () => {
  it("builds informational coverage for financial-services without ranking claims", () => {
    const report = buildIndustryVisualCoverageReport("financial-services");
    expect(report).not.toBeNull();
    if (!report) return;
    expect(report.industrySlug).toBe("financial-services");
    expect(report.note).toMatch(/must not alter industry product rankings/i);
    const text = formatIndustryVisualCoverageReportText(report);
    expect(text).toMatch(/Industry-specific videos:/i);
    expect(text).toMatch(/Case studies:/i);
    expect(text).toMatch(/Products with industry demos:/i);
  });
});
