import { describe, expect, it } from "vitest";
import {
  assembleSoftwareGlimpseWeekly,
  buildDistributionPack,
  buildVisualSpecs,
  campaignFromCrmPricingResearch,
  campaignsFromConfirmedPriceChanges,
  channelUtm,
  generateChannelDrafts,
  withUtm,
} from "@/services/distribution";

describe("content distribution workflow", () => {
  it("builds a research campaign from catalogue metrics only", () => {
    const campaign = campaignFromCrmPricingResearch();
    expect(campaign).toBeTruthy();
    expect(campaign!.campaignType).toBe("research_insight");
    expect(campaign!.supportingData.length).toBeGreaterThan(0);
    expect(campaign!.sourceURL).toContain("/research/crm-pricing");
    expect(campaign!.keyFinding.toLowerCase()).not.toContain(
      "check out my latest blog",
    );
  });

  it("generates insight-first personal LinkedIn and never auto-posts", () => {
    const campaign = campaignFromCrmPricingResearch();
    expect(campaign).toBeTruthy();
    const drafts = generateChannelDrafts(campaign!);
    const channels = drafts.map((d) => d.channel);
    expect(channels).toContain("linkedin_personal");
    expect(channels).toContain("linkedin_company");
    expect(channels).toContain("instagram_carousel");
    expect(channels).toContain("newsletter");
    expect(channels).toContain("reddit");
    expect(channels).toContain("short_video");

    for (const d of drafts) {
      expect(d.autoPost).toBe(false);
      expect(d.requiresHumanApproval).toBe(true);
    }

    const personal = drafts.find((d) => d.channel === "linkedin_personal")!;
    expect(personal.body.toLowerCase()).toContain("analys");
    expect(personal.body.toLowerCase()).not.toContain(
      "check out my latest blog post",
    );
  });

  it("builds visual specs from supporting data without banned affiliate lectures on-pixel", () => {
    const campaign = campaignFromCrmPricingResearch()!;
    const specs = buildVisualSpecs(campaign);
    expect(specs.length).toBeGreaterThan(0);
    for (const spec of specs) {
      expect(spec.bannedOnPixel.length).toBeGreaterThan(0);
      const onPixel = spec.onPixelLines.join(" ").toLowerCase();
      expect(onPixel).not.toContain("commission");
      expect(onPixel).not.toContain("affiliate availability");
    }
  });

  it("attaches UTM campaign ids", () => {
    const url = withUtm("/research/crm-pricing/", channelUtm("crm-pricing-2026", "linkedin_personal"));
    expect(url).toContain("utm_campaign=crm-pricing-2026");
    expect(url).toContain("utm_source=linkedin-personal");
    expect(url).toContain("utm_medium=social");
  });

  it("assembles newsletter with omitted filler sections", () => {
    const campaign = campaignFromCrmPricingResearch()!;
    const edition = assembleSoftwareGlimpseWeekly([campaign]);
    expect(edition.title).toBe("SoftwareGlimpse Weekly");
    expect(edition.includedSectionIds.length).toBeGreaterThan(0);
    const omitted = edition.sections.filter((s) => s.omittedReason);
    expect(omitted.length).toBeGreaterThan(0);
  });

  it("builds a pack without inventing price-change claims when none confirmed", () => {
    const pack = buildDistributionPack({
      recordTracking: false,
      includePriceChanges: false,
      includeTesting: false,
      includeResearch: true,
    });
    expect(pack.campaigns.some((c) => c.campaignType === "research_insight")).toBe(
      true,
    );
    expect(
      pack.campaigns.every((c) => c.campaignType !== "verified_price_change"),
    ).toBe(true);
    expect(pack.newsletterMarkdown).toContain("SoftwareGlimpse Weekly");
  }, 20_000);

  it("only emits verified_price_change campaigns for CONFIRMED rows", () => {
    const campaigns = campaignsFromConfirmedPriceChanges({ limit: 5 });
    for (const c of campaigns) {
      expect(c.campaignType).toBe("verified_price_change");
      expect(c.supportingData.some((d) => d.value === "CONFIRMED")).toBe(true);
    }
  }, 60_000);
});
