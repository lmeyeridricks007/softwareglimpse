import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  VENDOR_CUSTOMER_STORY_LABEL,
  buildIndustryCustomerStoryCards,
  evaluateCustomerStoryPublicEligibility,
  sanitizeVendorCaseStudyClaim,
} from "@/services/industry-customer-stories";
import { selectIndustrySeeInActionCards } from "@/services/product-media/industry-page-media";

const baseOfficialStory = {
  id: "sf-customer-story-official",
  productSlug: "salesforce",
  type: "official-customer-case-study" as const,
  provider: "youtube" as const,
  sourceUrl: "https://www.youtube.com/watch?v=Kzjzo4Kdoc4",
  videoId: "Kzjzo4Kdoc4",
  embedUrl: "https://www.youtube-nocookie.com/embed/Kzjzo4Kdoc4",
  title: "Financial services customer story",
  thumbnailUrl: "https://i.ytimg.com/vi/Kzjzo4Kdoc4/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel" as const,
  sourceOrganization: "Salesforce",
  verifiedAt: "2026-08-14T20:00:00.000Z",
  industryIds: ["financial-services"],
  mediaContext: "customer-case-study" as const,
  customerOrganization: "Acme Advisory",
  whatThisShows: [
    "advisor workflow for household client accounts",
    "Financial Services Cloud relationship views",
  ],
  limitations: ["typical ROI"],
  status: "published" as const,
};

describe("sanitizeVendorCaseStudyClaim", () => {
  it("attributes strong marketing metrics instead of restating as SG facts", () => {
    const out = sanitizeVendorCaseStudyClaim(
      "Product increased conversion by 40%",
      { vendorName: "Salesforce" },
    );
    expect(out).toBe(
      "The Salesforce case study reports a 40% improvement in conversion.",
    );
    expect(out).not.toMatch(/^Salesforce increases/i);
  });

  it("leaves non-metric workflow observations unchanged", () => {
    expect(
      sanitizeVendorCaseStudyClaim("advisor workflow for household accounts"),
    ).toBe("advisor workflow for household accounts");
  });
});

describe("buildIndustryCustomerStoryCards", () => {
  const products = [
    { slug: "salesforce", name: "Salesforce" },
    { slug: "hubspot", name: "HubSpot" },
  ];

  it("surfaces an official customer story with vendor-published labeling", () => {
    const media = ProductMediaSchema.parse(baseOfficialStory);
    const cards = buildIndustryCustomerStoryCards({
      mediaPool: [media],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.label).toBe(VENDOR_CUSTOMER_STORY_LABEL);
    expect(cards[0]?.label).not.toMatch(/Independent/i);
    expect(cards[0]?.companyName).toBe("Acme Advisory");
    expect(cards[0]?.industryLabel).toBe("Financial Services");
    expect(cards[0]?.productName).toBe("Salesforce");
    expect(cards[0]?.whatThisStoryIllustrates.length).toBeGreaterThan(0);
    expect(cards[0]?.whatItDoesNotEstablish.some((l) => /ROI/i.test(l))).toBe(
      true,
    );
    expect(cards[0]?.whatItDoesNotEstablish.some((l) => /guaranteed/i.test(l)))
      .toBe(true);
    expect(cards[0]?.sourceOrganization).toMatch(/Salesforce/i);
  });

  it("handles missing metrics without inventing ROI claims", () => {
    const media = ProductMediaSchema.parse({
      ...baseOfficialStory,
      id: "story-no-metrics",
      customerOrganization: undefined,
      whatThisShows: ["client onboarding handoff in the CRM"],
      limitations: [],
    });
    const cards = buildIndustryCustomerStoryCards({
      mediaPool: [media],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.companyName).toBeNull();
    expect(cards[0]?.whatThisStoryIllustrates).toEqual([
      "client onboarding handoff in the CRM",
    ]);
    expect(
      cards[0]?.whatThisStoryIllustrates.every(
        (line) => !/\d+%|ROI/i.test(line),
      ),
    ).toBe(true);
    expect(cards[0]?.whatItDoesNotEstablish.length).toBeGreaterThan(0);
  });

  it("sanitizes strong marketing claims on the card", () => {
    const media = ProductMediaSchema.parse({
      ...baseOfficialStory,
      id: "story-marketing",
      whatThisShows: ["Product increased conversion by 40%"],
    });
    const cards = buildIndustryCustomerStoryCards({
      mediaPool: [media],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(cards[0]?.whatThisStoryIllustrates[0]).toMatch(
      /vendor case study reports|Salesforce case study reports/i,
    );
    expect(cards[0]?.whatThisStoryIllustrates[0]).not.toBe(
      "Salesforce increases conversion by 40%.",
    );
  });

  it("excludes unofficial uploads", () => {
    const media = ProductMediaSchema.parse({
      ...baseOfficialStory,
      id: "story-unofficial",
      officialSource: false,
      officialSourceKind: undefined,
      sourceOrganization: "Random Uploader",
    });
    expect(evaluateCustomerStoryPublicEligibility(media).ok).toBe(false);
    expect(evaluateCustomerStoryPublicEligibility(media).reason).toBe(
      "unofficial-source",
    );
    const cards = buildIndustryCustomerStoryCards({
      mediaPool: [media],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(cards).toHaveLength(0);
  });

  it("excludes deleted / unavailable videos", () => {
    const deleted = ProductMediaSchema.parse({
      ...baseOfficialStory,
      id: "story-deleted",
      status: "unavailable",
      sourceHealth: "unavailable",
    });
    expect(evaluateCustomerStoryPublicEligibility(deleted).ok).toBe(false);
    const cards = buildIndustryCustomerStoryCards({
      mediaPool: [deleted],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(cards).toHaveLength(0);
  });

  it("keeps customer stories out of primary see-in-action ranking", () => {
    const media = ProductMediaSchema.parse(baseOfficialStory);
    const seeIn = selectIndustrySeeInActionCards({
      mediaPool: [media],
      products: [{ slug: "salesforce", name: "Salesforce" }],
      ctx: { industrySlug: "financial-services" },
      limit: 4,
    });
    expect(seeIn).toHaveLength(0);
    const stories = buildIndustryCustomerStoryCards({
      mediaPool: [media],
      industrySlug: "financial-services",
      industryLabel: "Financial Services",
      products,
    });
    expect(stories).toHaveLength(1);
  });
});
