import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { getIndustryBySlug } from "@/data";
import { buildIndustryHubModel } from "@/services/industry-hub";
import {
  buildProductIndustryAssessment,
  selectProductIndustryAssessmentTargets,
} from "@/services/product-industry-assessment";
import type { IndustrySeeInActionCard } from "@/services/product-media/industry-page-media";

function cardFromMedia(
  media: ReturnType<typeof ProductMediaSchema.parse>,
  overrides: Partial<IndustrySeeInActionCard> & {
    contextKind: IndustrySeeInActionCard["contextKind"];
    contextLabel: string;
  },
): IndustrySeeInActionCard {
  return {
    productSlug: media.productSlug,
    productName: overrides.productName ?? media.productSlug,
    logo: null,
    media,
    title: media.title,
    contextKind: overrides.contextKind,
    contextLabel: overrides.contextLabel,
    industryEditionLabel: overrides.industryEditionLabel ?? null,
    industryContext: media.whatThisShows ?? [],
    whatThisShows: media.whatThisShows ?? [],
    whatToNotice: [],
    whatNotEstablished: media.limitations ?? [],
    relatedCapabilities: [],
    relatedFeatures: [],
    relatedRequirements: [],
    relatedUseCases: [],
    workflowStepsShown: [],
    verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
    sourceOrganization: media.sourceOrganization ?? "Vendor",
    relevanceNote: null,
    ...overrides,
  };
}

const editionMedia = ProductMediaSchema.parse({
  id: "sf-fsc",
  productSlug: "salesforce",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=Kzjzo4Kdoc4",
  videoId: "Kzjzo4Kdoc4",
  embedUrl: "https://www.youtube-nocookie.com/embed/Kzjzo4Kdoc4",
  title: "Financial Services Cloud overview",
  thumbnailUrl: "https://i.ytimg.com/vi/Kzjzo4Kdoc4/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  sourceOrganization: "Salesforce",
  verifiedAt: "2026-08-14T20:00:00.000Z",
  industryIds: ["financial-services"],
  mediaContext: "industry-edition",
  industryEditionLabel: "Financial Services Cloud",
  whatThisShows: ["client/account relationships", "advisor workflows"],
  limitations: ["regulatory compliance", "pricing"],
  status: "published",
});

const generalMedia = ProductMediaSchema.parse({
  id: "pd-general",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Pipeline demo",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  industryIds: ["financial-services"],
  mediaContext: "general-workflow",
  whatThisShows: ["pipeline board"],
  limitations: ["pricing"],
  status: "published",
});

describe("buildProductIndustryAssessment", () => {
  it("surfaces industry edition with base product relationship", () => {
    const assessment = buildProductIndustryAssessment({
      productSlug: "salesforce",
      productName: "Salesforce",
      industrySlug: "financial-services",
      industryLabel: "Financial services",
      overallScore: 8.8,
      reviewHref: "/software/salesforce/",
      compareHref: "/compare/",
      useCases: [
        {
          id: "advisory-relationship-management",
          label: "Advisory",
          href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        },
      ],
      capabilities: [
        {
          id: "contact-management",
          label: "Client relationships",
          href: "/industries/financial-services/capabilities/contact-management/",
        },
      ],
      requirements: [
        {
          id: "track-client-interactions",
          label: "Track client interactions",
          href: "/requirements/track-client-interactions/",
        },
      ],
      mediaCard: cardFromMedia(editionMedia, {
        productName: "Salesforce",
        contextKind: "industry-edition",
        contextLabel: "Industry edition official demo",
        industryEditionLabel: "Financial Services Cloud",
      }),
      featureEvidenceCount: 6,
      screenshotCount: 4,
    });

    expect(assessment.displayTitle).toBe("Financial Services Cloud");
    expect(assessment.fitLabel).toBe("Strong");
    expect(assessment.researchStateLabel).toMatch(/Recommended/i);
    expect(assessment.demo?.contextLabel).toMatch(/Industry edition/i);
    expect(assessment.demo?.baseProductName).toBe("Salesforce");
    expect(assessment.demo?.displayProductName).toBe(
      "Financial Services Cloud",
    );
    expect(assessment.bestAlignedUseCases).toHaveLength(1);
    expect(assessment.evidenceConfidence).toBe("High");
  });

  it("labels general product demos without implying industry-specific implementation", () => {
    const assessment = buildProductIndustryAssessment({
      productSlug: "pipedrive",
      productName: "Pipedrive",
      industrySlug: "financial-services",
      industryLabel: "Financial services",
      overallScore: 7.6,
      reviewHref: "/software/pipedrive/",
      compareHref: "/compare/",
      useCases: [],
      capabilities: [],
      requirements: [],
      mediaCard: cardFromMedia(generalMedia, {
        productName: "Pipedrive",
        contextKind: "general-workflow",
        contextLabel: "General product workflow",
      }),
      featureEvidenceCount: 4,
      screenshotCount: 2,
    });

    expect(assessment.demo?.contextLabel).toBe("General product demo");
    expect(assessment.demo?.relevantTo).toMatch(/Financial services/i);
    expect(assessment.demo?.relevantTo).toMatch(/workflow/i);
    expect(assessment.demo?.contextKind).toBe("general-workflow");
    expect(assessment.displayTitle).toBe("Pipedrive");
  });

  it("stays complete with no video and no empty demo block", () => {
    const assessment = buildProductIndustryAssessment({
      productSlug: "zoho-crm",
      productName: "Zoho CRM",
      industrySlug: "financial-services",
      industryLabel: "Financial services",
      overallScore: null,
      reviewHref: "/software/zoho-crm/",
      compareHref: "/compare/",
      useCases: [
        { id: "pipeline-led-sales", label: "B2B sales", href: null },
      ],
      capabilities: [
        { id: "pipeline-management", label: "Pipeline", href: null },
      ],
      requirements: [],
      mediaCard: null,
      featureEvidenceCount: 3,
      screenshotCount: 0,
    });

    expect(assessment.demo).toBeNull();
    expect(assessment.fitLabel).not.toBe("Unknown");
    expect(assessment.evidenceConfidence).not.toBe("Unknown");
    expect(assessment.evidenceSummary).toMatch(/evidence items backing this recommendation/i);
    expect(assessment.reviewHref).toContain("zoho-crm");
  });

  it("marks partial research when evidence is thin", () => {
    const assessment = buildProductIndustryAssessment({
      productSlug: "folk",
      productName: "folk",
      industrySlug: "real-estate",
      industryLabel: "Real estate",
      overallScore: null,
      reviewHref: "/software/folk/",
      compareHref: "/compare/",
      useCases: [],
      capabilities: [],
      requirements: [],
      mediaCard: null,
      featureEvidenceCount: 1,
      screenshotCount: 0,
    });
    expect(assessment.fitLabel).toBe("Emerging");
    expect(assessment.researchStateLabel).toMatch(/Emerging|Under review|Insufficient/i);
    expect(assessment.evidenceConfidence).toBe("Low");
  });
});

describe("selectProductIndustryAssessmentTargets", () => {
  it("prefers catalogue products over video-only soft preference", () => {
    const slugs = selectProductIndustryAssessmentTargets({
      products: [
        { slug: "a", name: "A", overallScore: 9, featureEvidenceCount: 0 },
        { slug: "b", name: "B", overallScore: 7, featureEvidenceCount: 8 },
        { slug: "c", name: "C", overallScore: 8, featureEvidenceCount: 2 },
      ],
      mediaByProduct: new Map([
        ["a", [cardFromMedia(editionMedia, {
          productName: "A",
          contextKind: "industry-edition",
          contextLabel: "Industry edition",
        })]],
      ]),
      limit: 2,
    });
    expect(slugs[0]).toBe("b");
    expect(slugs).toContain("c");
  });
});

describe("industry hub product × industry modules", () => {
  it("wires financial-services assessments as text-led research cards", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.productIndustryAssessments.length).toBeGreaterThan(0);
    expect(model.productIndustryAssessments.length).toBeLessThanOrEqual(3);

    for (const a of model.productIndustryAssessments) {
      expect(a.fitLabel).toBeTruthy();
      expect(a.evidenceConfidence).toBeTruthy();
      expect(a.evidenceSummary.length).toBeGreaterThan(0);
      expect(a.reviewHref).toContain("/software/");
      // Hub pages keep demos in #see-in-industry — assessments stay text-led.
      expect(a.demo).toBeNull();
    }
  });

  it("keeps real-estate assessments complete when industry video is sparse", () => {
    const industry = getIndustryBySlug("real-estate", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.productIndustryAssessments.length).toBeGreaterThan(0);
    for (const a of model.productIndustryAssessments) {
      expect(a.industrySlug).toBe("real-estate");
      expect(typeof a.fitLabel).toBe("string");
      expect(a.methodologyNote).toMatch(/do not determine rankings/i);
    }
  });
});
