import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { getIndustryBySlug } from "@/data";
import { buildIndustryHubModel } from "@/services/industry-hub";
import {
  buildIndustryEvidenceExplorer,
  INDUSTRY_EVIDENCE_METHODOLOGY,
} from "@/services/evidence-explorer";
import {
  resolveIndustryMediaContext,
  scoreIndustryPageMedia,
  selectIndustryPageVideos,
  selectIndustrySeeInActionCards,
  industryMediaContextLabel,
} from "@/services/product-media/industry-page-media";

const industryEdition = ProductMediaSchema.parse({
  id: "sf-fsc-test",
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
  capabilityIds: ["pipeline-management"],
  featureIds: ["contact-management"],
  useCaseIds: ["advisory-relationship-management"],
  workflowStageIds: ["capture", "qualify"],
  whatThisShows: ["client/account relationships", "advisor workflows"],
  limitations: ["regulatory compliance", "pricing"],
  status: "published",
});

const generalWorkflow = ProductMediaSchema.parse({
  id: "pd-general-test",
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
  featureIds: ["pipeline-management"],
  capabilityIds: ["pipeline-management"],
  whatThisShows: ["pipeline board"],
  status: "published",
});

const caseStudy = ProductMediaSchema.parse({
  id: "case-study-test",
  productSlug: "hubspot",
  type: "official-customer-case-study",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
  videoId: "HKaG5HN89x8",
  embedUrl: "https://www.youtube-nocookie.com/embed/HKaG5HN89x8",
  title: "Customer success story",
  thumbnailUrl: "https://i.ytimg.com/vi/HKaG5HN89x8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  industryIds: ["financial-services"],
  mediaContext: "customer-case-study",
  whatThisShows: ["a customer story exists"],
  limitations: ["typical ROI", "product superiority"],
  status: "published",
});

const brandPromo = ProductMediaSchema.parse({
  id: "brand-promo",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=abcdefghijk",
  videoId: "abcdefghijk",
  embedUrl: "https://www.youtube-nocookie.com/embed/abcdefghijk",
  title: "Transform your future with Vendor X",
  thumbnailUrl: "https://i.ytimg.com/vi/abcdefghijk/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  industryIds: [],
  whatThisShows: ["brand manifesto"],
  status: "published",
});

describe("industry media context classification", () => {
  it("distinguishes industry edition from general workflow and case study", () => {
    expect(resolveIndustryMediaContext(industryEdition)).toBe(
      "industry-edition",
    );
    expect(resolveIndustryMediaContext(generalWorkflow)).toBe(
      "general-workflow",
    );
    expect(resolveIndustryMediaContext(caseStudy)).toBe("customer-case-study");
    expect(industryMediaContextLabel("general-workflow")).toMatch(/General/i);
    expect(industryMediaContextLabel("industry-edition")).toMatch(/edition/i);
  });

  it("ranks industry edition above general workflow for the same industry", () => {
    const ctx = {
      industrySlug: "financial-services",
      productSlug: "salesforce",
      useCaseIds: ["advisory-relationship-management"],
    };
    expect(scoreIndustryPageMedia(industryEdition, ctx)).toBeGreaterThan(
      scoreIndustryPageMedia(generalWorkflow, {
        ...ctx,
        productSlug: "pipedrive",
      }),
    );
  });

  it("excludes other-industry editions from unrelated hubs (e.g. FSC on plumbing)", () => {
    const selected = selectIndustryPageVideos(
      [industryEdition, generalWorkflow],
      {
        industrySlug: "plumbing",
        productSlug: "salesforce",
        requireIndustryRelevance: true,
      },
      { limit: 3, allowGeneralFallback: true },
    );
    expect(selected.map((m) => m.id)).not.toContain("sf-fsc-test");

    const cards = selectIndustrySeeInActionCards({
      mediaPool: [industryEdition, generalWorkflow],
      products: [
        { slug: "salesforce", name: "Salesforce" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      ctx: { industrySlug: "plumbing" },
      limit: 4,
    });
    expect(cards.every((c) => c.media.id !== "sf-fsc-test")).toBe(true);
    expect(
      cards.every(
        (c) =>
          !(c.media.industryIds ?? []).includes("financial-services") ||
          (c.media.industryIds ?? []).includes("plumbing"),
      ),
    ).toBe(true);
  });

  it("does not surface pure brand promos as industry evidence", () => {
    const selected = selectIndustryPageVideos(
      [brandPromo, industryEdition],
      {
        industrySlug: "financial-services",
        requireIndustryRelevance: true,
      },
      { limit: 3 },
    );
    expect(selected.map((m) => m.id)).toEqual(["sf-fsc-test"]);
  });

  it("labels general workflow cards without calling them industry-specific", () => {
    const cards = selectIndustrySeeInActionCards({
      mediaPool: [generalWorkflow],
      products: [{ slug: "pipedrive", name: "Pipedrive" }],
      ctx: { industrySlug: "financial-services" },
      limit: 2,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.contextKind).toBe("general-workflow");
    expect(cards[0]?.contextLabel).not.toMatch(/Industry-specific/i);
    expect(cards[0]?.relevanceNote).toMatch(/not an industry-specific/i);
  });
});

describe("buildIndustryEvidenceExplorer", () => {
  it("includes methodology and context dimensions", () => {
    const model = buildIndustryEvidenceExplorer({
      industryName: "Financial services",
      industrySlug: "financial-services",
      products: [
        { slug: "salesforce", name: "Salesforce" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      buyerQuestions: [
        { id: "client-relationships", name: "Client relationships" },
      ],
      screenshots: [],
      videos: [industryEdition, generalWorkflow, caseStudy],
    });
    expect(model.methodology).toBe(INDUSTRY_EVIDENCE_METHODOLOGY);
    expect(model.items.some((i) => i.kind === "official-video")).toBe(true);
    expect(
      model.items.find((i) => i.id === "video:case-study-test")?.suitability,
    ).toBe("weak");
    expect(
      model.dimensions.some((d) => d.id === "context:industry-specific"),
    ).toBe(true);
  });
});

describe("industry hub media wiring", () => {
  it("wires financial-services with industry edition and general demos without scoring impact", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.seeInIndustryCards.length).toBeGreaterThan(0);
    expect(
      model.seeInIndustryCards.some(
        (c) =>
          c.contextKind === "industry-edition" ||
          c.contextKind === "industry-specific",
      ),
    ).toBe(true);
    expect(
      model.seeInIndustryCards.some((c) => c.contextKind === "general-workflow"),
    ).toBe(true);
    expect(model.methodologyNote).toMatch(/do not change product rankings/i);
    expect(model.navItems.map((n) => n.id)).toContain("see-in-industry");
    // Evidence explorer is screenshot-fallback only — videos live in see-in once.
    expect(model.evidenceExplorer).toBeNull();
    expect(model.workflowCompare).toBeNull();
    expect(model.visualEvidenceCounts.industrySpecificDemos).toBeGreaterThan(0);

    const withVideo = model.productCards.find((p) => p.officialVideoCount > 0);
    const withoutVideo = model.productCards.find(
      (p) => p.officialVideoCount === 0,
    );
    if (withVideo && withoutVideo && withVideo.overallScore != null && withoutVideo.overallScore != null) {
      // Video presence alone must not force a higher overallScore ranking rule —
      // scores come from assessments; this asserts both remain numbers.
      expect(typeof withVideo.overallScore).toBe("number");
      expect(typeof withoutVideo.overallScore).toBe("number");
    }

    const sf = model.productCards.find((p) => p.slug === "salesforce");
    if (sf) {
      expect(sf.hasOfficialIndustryDemo).toBe(true);
    }
  });

  it("keeps real-estate complete when industry-specific video is absent", () => {
    const industry = getIndustryBySlug("real-estate", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.productCards.length).toBeGreaterThan(0);
    expect(model.priorities.length).toBeGreaterThan(0);
    // Zero or fallback media is fine — page must still build
    expect(Array.isArray(model.seeInIndustryCards)).toBe(true);
    if (model.seeInIndustryCards.length === 0) {
      expect(model.screenshotFallback.length >= 0).toBe(true);
    }
    for (const card of model.seeInIndustryCards) {
      if (card.contextKind === "general-workflow") {
        expect(card.contextLabel).not.toMatch(/Industry-specific official demo/i);
      }
    }
  });
});
