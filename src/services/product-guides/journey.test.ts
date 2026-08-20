import { describe, expect, it } from "vitest";
import { getSoftwareBySlug } from "@/data";
import {
  buildCrmProductGuide,
  buildEcommerceProductGuide,
  buildSiProductGuide,
} from "@/services/product-guides/build";

describe("product-guide pack journeys", () => {
  it("directs each Pipedrive kind to a different next step and related set", () => {
    const setup = buildCrmProductGuide("pipedrive", "setup");
    const implementation = buildCrmProductGuide("pipedrive", "implementation");
    const migration = buildCrmProductGuide("pipedrive", "migration");
    const plans = buildCrmProductGuide("pipedrive", "plans");
    const worthIt = buildCrmProductGuide("pipedrive", "worth-it");

    expect(setup?.nextAction?.contentId).toBe(
      "content:guide:pipedrive-implementation",
    );
    expect(migration?.nextAction?.contentId).toBe(
      "content:guide:pipedrive-setup",
    );
    expect(implementation?.nextAction?.contentId).toBe(
      "content:software:pipedrive",
    );
    expect(plans?.nextAction?.contentId).toBe(
      "content:tool:crm-cost-calculator",
    );
    expect(worthIt?.nextAction?.contentId).toBe("content:tool:crm-finder");

    expect(setup?.relatedGuideSlugs).toContain("pipedrive-implementation");
    expect(setup?.relatedGuideSlugs).not.toContain("pipedrive-plans");
    expect(setup?.relatedGuideSlugs).not.toContain("is-pipedrive-worth-it");

    expect(plans?.relatedGuideSlugs).toContain("is-pipedrive-worth-it");
    expect(plans?.relatedGuideSlugs).toContain("crm-pricing-guide");
    expect(plans?.relatedGuideSlugs).not.toContain("pipedrive-setup");

    expect(worthIt?.relatedGuideSlugs).toContain("how-to-choose-crm");
    expect(worthIt?.relatedGuideSlugs).not.toEqual(setup?.relatedGuideSlugs);
    expect(implementation?.relatedGuideSlugs).not.toEqual(
      migration?.relatedGuideSlugs,
    );
  });

  it("keeps the same kind unique per product via siblings, not a shared sibling dump", () => {
    const pipedrive = buildCrmProductGuide("pipedrive", "setup");
    const hubspot = buildCrmProductGuide("hubspot", "setup");
    expect(pipedrive?.relatedGuideSlugs).toContain("pipedrive-implementation");
    expect(hubspot?.relatedGuideSlugs).toContain("hubspot-implementation");
    expect(pipedrive?.relatedGuideSlugs).not.toContain("hubspot-implementation");
    expect(hubspot?.relatedGuideSlugs).not.toContain("pipedrive-implementation");
  });

  it("sends SI worth-it to the SI finder and SI setup to implementation", () => {
    const apollo = getSoftwareBySlug("apollo");
    expect(apollo?.primaryCategorySlug).toBe("sales-intelligence");
    const worthIt = buildSiProductGuide("apollo", "worth-it");
    const setup = buildSiProductGuide("apollo", "setup");
    expect(worthIt?.nextAction?.contentId).toBe(
      "content:tool:sales-intelligence-finder",
    );
    expect(setup?.nextAction?.contentId).toBe(
      "content:guide:apollo-implementation",
    );
    expect(setup?.relatedGuideSlugs).toContain("apollo-implementation");
    expect(worthIt?.relatedGuideSlugs).toContain(
      "how-to-choose-sales-intelligence",
    );
  });

  it("ecommerce worth-it/plans packs use decision-support blocks, not leftover HR copy", () => {
    const worthIt = buildEcommerceProductGuide("tiendanube", "worth-it");
    const plans = buildEcommerceProductGuide("tiendanube", "plans");
    expect(worthIt).toBeTruthy();
    expect(plans).toBeTruthy();

    const worthTypes = new Set((worthIt!.blocks ?? []).map((b) => b.type));
    const planTypes = new Set((plans!.blocks ?? []).map((b) => b.type));
    expect([...worthTypes]).toEqual(
      expect.arrayContaining([
        "decision-framework",
        "trial-plan",
        "product-shortlist",
        "scorecard",
        "size-match",
      ]),
    );
    expect([...planTypes]).toEqual(
      expect.arrayContaining([
        "decision-framework",
        "product-shortlist",
        "size-match",
        "cost-breakdown",
      ]),
    );
    expect(
      (plans!.blocks ?? []).filter((b) => b.type === "step").length,
    ).toBeGreaterThanOrEqual(4);

    const blob = JSON.stringify([worthIt!.blocks, plans!.blocks]);
    expect(blob).not.toMatch(/HR\/ops|workforce & training|employee IDs/i);

    const shortlist = (worthIt!.blocks ?? []).find(
      (b) => b.type === "product-shortlist",
    );
    expect(shortlist && "productSlugs" in shortlist).toBe(true);
    const slugs =
      shortlist && "productSlugs" in shortlist ? shortlist.productSlugs : [];
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs).toEqual(expect.arrayContaining(["shopify"]));
    for (const slug of slugs) {
      expect(getSoftwareBySlug(slug, { includeUnpublished: true }), slug).toBeTruthy();
    }

    const hrefs = blob.match(/href":"([^"]+)"/g) ?? [];
    expect(hrefs.join("\n")).not.toMatch(/ecommerce-finder/);
  });
});
