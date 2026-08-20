import { describe, expect, it } from "vitest";
import { getCategoryBySlug, getPrimarySoftwareByCategory } from "@/data";
import { getCategoryHubProfile } from "@/data/category-hub";
import { buildCategoryHubModel } from "@/services/category-hub";
import {
  isInternalEditorialCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";

describe("category hub", () => {
  it("loads CRM hub profile without fabricating rankings", () => {
    const profile = getCategoryHubProfile("crm");
    expect(profile).not.toBeNull();
    expect(profile!.types.some((t) => t.href === "/categories/crm/startup/")).toBe(
      true,
    );
    expect(profile!.faq.length).toBeGreaterThan(0);
    expect(profile!.explorePaths.map((p) => p.id)).toEqual(
      expect.arrayContaining([
        "best",
        "finder",
        "compare",
        "calculator",
        "guides",
        "resources",
      ]),
    );
  });

  it("uses primary CRM products only (excludes Apollo as core CRM)", () => {
    const primary = getPrimarySoftwareByCategory("crm");
    expect(primary.every((p) => p.primaryCategorySlug === "crm")).toBe(true);
    expect(primary.some((p) => p.slug === "apollo")).toBe(false);
  });

  it("builds CRM hub model without ranked preview when rankings unapproved", () => {
    const category = getCategoryBySlug("crm");
    expect(category).toBeDefined();
    const model = buildCategoryHubModel(category!);
    // Rankings preview depends on Best CRM editorial approval status in seed.
    if (!model.rankingsApproved) {
      expect(model.bestPreview).toEqual([]);
      expect(model.explorePaths.some((p) => p.id === "best")).toBe(false);
      expect(
        model.explorePaths.every((p) => !p.href.startsWith("/best/")),
      ).toBe(true);
    }
    expect(model.productCards.length).toBe(
      getPrimarySoftwareByCategory("crm").length,
    );
    expect(model.catalogueHref).toBe("/software/#crm");
    expect(
      model.productCards.every(
        (p) =>
          typeof p.isBestPick === "boolean" &&
          ("overallScore" in p) &&
          ("updatedAt" in p),
      ),
    ).toBe(true);
    // Migration-gap CRM systems must appear on the category hub grid.
    for (const slug of [
      "affinity",
      "agile-crm",
      "apptivo",
      "cloze",
      "mailchimp",
      "netsuite",
      "nimble",
      "pega",
      "pipelinepro",
      "podio",
      "wealthbox",
      "zendesk",
      "marketo",
      "pardot",
      "act",
      "sap",
      "siebel",
      "tidio",
    ]) {
      expect(model.productCards.some((p) => p.slug === slug)).toBe(true);
    }
    expect(model.explorePaths.length).toBeGreaterThan(0);
    expect(model.finderHref).toBeTruthy();
    expect(model.featureMatrix).toBeNull();
    expect(model.capabilities.length).toBeGreaterThan(0);
    expect(model.capabilities.every((c) => c.href.startsWith("/capabilities/"))).toBe(
      true,
    );
    expect(model.navItems.some((item) => item.id === "capabilities")).toBe(true);
    expect(model.resources.length).toBeGreaterThan(0);
    expect(model.resources.every((r) => r.href.startsWith("/resources/"))).toBe(
      true,
    );
    expect(
      model.decisionTools.some((t) => t.href === "/tools/crm-plan-selector/"),
    ).toBe(true);
    expect(model.navItems.some((item) => item.id === "resources")).toBe(true);
    expect(
      model.reviews.every(
        (r) => !r.bestFor || !isInternalEditorialCopy(r.bestFor),
      ),
    ).toBe(true);
  });

  it("applies shared hub defaults for non-CRM categories", () => {
    const category = getCategoryBySlug("sales-intelligence");
    expect(category).toBeDefined();
    const model = buildCategoryHubModel(category!);
    expect(model.explorePaths.length).toBeGreaterThan(0);
    expect(model.explorePaths.every((p) => p.href && p.ctaLabel)).toBe(true);
    expect(model.finderHref).toBe("/tools/sales-intelligence-finder/");
    expect(model.decisionCriteria.length).toBeGreaterThan(0);
    expect(model.popularNeeds.length).toBeGreaterThan(0);
    expect(model.faq.length).toBeGreaterThan(0);
    expect(model.pricingModel).not.toBeNull();
    expect(model.buyingFramework.length).toBeGreaterThan(0);
    expect(model.glance).not.toBeNull();
    expect(
      model.productCards.every((p) => p.slug !== "pipedrive"),
    ).toBe(true);
  });

  it("keeps CRM-parity quick nav on thin category hubs", () => {
    const category = getCategoryBySlug("project-management");
    expect(category).toBeDefined();
    const model = buildCategoryHubModel(category!);
    const ids = model.navItems.map((item) => item.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "overview",
        "explore",
        "software",
        "compare",
        "use-cases",
        "capabilities",
        "business-types",
        "industries",
        "pricing",
        "guides",
        "tools",
        "faq",
      ]),
    );
    expect(model.decisionCriteria.length).toBeGreaterThan(0);
    expect(model.popularNeeds.length).toBeGreaterThan(0);
    expect(model.shortLabel).toBe("Project Management");
  });

  it("strips internal editorial copy", () => {
    expect(
      publicCopy(
        "Apollo.io has structured research available for editorial assessment",
      ),
    ).toBeNull();
    expect(publicCopy("Pipeline-focused SMB sales teams")).toBe(
      "Pipeline-focused SMB sales teams",
    );
    expect(isInternalEditorialCopy("Provisional candidates")).toBe(true);
  });
});
