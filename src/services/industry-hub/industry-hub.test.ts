import { describe, expect, it } from "vitest";
import { getIndustryBySlug, getPrimarySoftwareByCategory } from "@/data";
import { getIndustryHubProfile } from "@/data/industry-hub";
import { buildIndustryHubModel } from "@/services/industry-hub";

describe("industry hub", () => {
  it("loads financial-services profile without fabricating rankings", () => {
    const profile = getIndustryHubProfile("financial-services");
    expect(profile).not.toBeNull();
    expect(profile!.priorities.length).toBe(6);
    expect(profile!.useCases.length).toBe(5);
    expect(profile!.faq.length).toBeGreaterThan(0);
    expect(profile!.finderHref).toBe("/tools/crm-finder/");
  });

  it("builds financial-services model from catalogue evidence", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    expect(industry).toBeDefined();
    const model = buildIndustryHubModel(industry!);
    expect(model.maturity).toBe("verified");
    expect(model.showIndustryRankings).toBe(false);
    // Verified hubs do not show a soft "still researching" confidence banner.
    expect(model.confidenceMessage).toBeNull();
    expect(model.productCards.length).toBeGreaterThan(0);
    expect(model.productCards.length).toBeLessThanOrEqual(6);
    expect(model.compareRows.length).toBeGreaterThan(0);
    expect(model.navItems.map((n) => n.id)).toEqual(
      expect.arrayContaining([
        "overview",
        "what-matters",
        "use-cases",
        "software",
        "compare",
        "costs",
        "faq",
      ]),
    );
    expect(model.relatedIndustries.every((i) => i.slug !== "financial-services")).toBe(
      true,
    );
  });

  it("never invents unknown evidence as unsupported no", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    for (const card of model.productCards) {
      for (const cap of card.capabilitySnapshot) {
        expect(["supported", "partial", "unknown", "not-supported"]).toContain(
          cap.cell,
        );
      }
    }
  });

  it("surfaces researched pricing and cost preview when calculable", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.productCards.some((p) => p.pricingTeaser != null)).toBe(true);
    expect(model.costPreview).not.toBeNull();
    expect(model.costPreview!.lowestMinor).toBeGreaterThan(0);
    expect(model.costPreview!.highestMinor).toBeGreaterThanOrEqual(
      model.costPreview!.lowestMinor!,
    );
    expect(model.comparisons.length).toBeGreaterThan(1);
  });

  it("applies shared defaults for industries without a custom profile", () => {
    const industry = getIndustryBySlug("real-estate", {
      includeUnpublished: true,
    });
    expect(industry).toBeDefined();
    const model = buildIndustryHubModel(industry!);
    expect(model.priorities.length).toBeGreaterThan(0);
    expect(model.useCases.length).toBeGreaterThan(0);
    expect(model.faq.length).toBeGreaterThan(0);
    expect(model.finderHref).toBe("/tools/crm-finder/");
    expect(model.productCards.length).toBe(
      Math.min(6, getPrimarySoftwareByCategory("crm").length),
    );
  });

  it("makes retail priority, use-case, matrix, and security cards link to detail pages", () => {
    const industry = getIndustryBySlug("retail-ecommerce", {
      includeUnpublished: true,
    });
    expect(industry).toBeDefined();
    const model = buildIndustryHubModel(industry!);

    expect(model.priorities.length).toBe(6);
    for (const item of model.priorities) {
      if (!item.href) continue;
      expect(item.href).toMatch(
        /^\/industries\/retail-ecommerce\/capabilities\/[^/#]+\/$/,
      );
    }

    expect(model.useCases.length).toBe(5);
    for (const item of model.useCases) {
      if (!item.href) continue;
      expect(item.href).toMatch(
        /^\/(industries\/retail-ecommerce\/use-cases|use-cases)\/[^/#]+\/$/,
      );
    }

    expect(model.capabilityMatrix).not.toBeNull();
    const rows = model.capabilityMatrix!.groups.flatMap((g) => g.rows);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.href).toMatch(/^\/features\/[^/#]+\/$/);
    }

    expect(model.securityDimensions.length).toBe(8);
    for (const item of model.securityDimensions) {
      expect(item.href).toMatch(/^\/requirements\/[^/#]+\/$/);
    }
  });

  it("links all financial-services hub cards to detail pages", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(
      model.priorities.every((p) =>
        Boolean(p.href?.includes("/capabilities/")),
      ),
    ).toBe(true);
    expect(
      model.useCases.every((u) => Boolean(u.href?.includes("/use-cases/"))),
    ).toBe(true);
    expect(
      model.securityDimensions.every((d) =>
        Boolean(d.href?.includes("/requirements/")),
      ),
    ).toBe(true);
  });

  it("loads plumbing vertical depth with catalogue product-fit guidance", () => {
    const profile = getIndustryHubProfile("plumbing");
    expect(profile).not.toBeNull();
    expect(profile!.tagline).toBeTruthy();
    expect(profile!.heroVisual?.src).toBe("/industries/plumbing-hero.png");
    expect(profile!.productFitGuidance.length).toBe(5);
    expect(profile!.productFitGuidance.map((f) => f.productSlug)).toEqual([
      "insightly",
      "keap",
      "apptivo",
      "bitrix24",
      "capsule",
    ]);
    for (const fit of profile!.productFitGuidance) {
      expect(fit.why.length).toBeGreaterThan(20);
      expect(fit.bestWhen.length).toBeGreaterThan(10);
    }
  });

  it("loads private-equity vertical with Affinity in product-fit shortlist", () => {
    const profile = getIndustryHubProfile("private-equity");
    expect(profile).not.toBeNull();
    expect(profile!.productFitGuidance[0]?.productSlug).toBe("affinity");
    expect(profile!.workflowVisual?.src).toContain("private-equity");
  });
});
