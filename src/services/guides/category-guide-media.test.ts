import { describe, expect, it } from "vitest";
import { buildCategoryGuideMediaBundle } from "@/services/guides/category-guide-media";

describe("category CRM guide media", () => {
  it("surfaces example implementation videos on crm-implementation", () => {
    const bundle = buildCategoryGuideMediaBundle({
      slug: "crm-implementation",
      productSlugs: [],
      topicType: "implementation",
      categorySlugs: ["crm"],
    });
    expect(bundle).not.toBeNull();
    expect(bundle!.examples.length).toBeGreaterThan(0);
    expect(bundle!.examples.length).toBeLessThanOrEqual(2);
    expect(bundle!.heading.toLowerCase()).toContain("setup");
  });

  it("surfaces example overview videos on how-to-choose-crm", () => {
    const bundle = buildCategoryGuideMediaBundle({
      slug: "how-to-choose-crm",
      productSlugs: ["hubspot", "pipedrive", "salesforce", "zoho-crm", "freshsales", "close"],
      topicType: "selection",
      categorySlugs: ["crm"],
    });
    expect(bundle).not.toBeNull();
    expect(bundle!.examples.length).toBeLessThanOrEqual(2);
    expect(bundle!.examples.every((e) => e.mode === "overview")).toBe(true);
  });

  it("skips product-guide pages", () => {
    expect(
      buildCategoryGuideMediaBundle({
        slug: "hubspot-implementation",
        productSlugs: ["hubspot"],
        topicType: "implementation",
        categorySlugs: ["crm"],
      }),
    ).toBeNull();
  });
});
