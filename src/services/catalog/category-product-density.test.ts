import { describe, expect, it } from "vitest";
import { getCategories, getSoftware } from "../../data/repositories/catalog";

const MIN_PRODUCTS_PER_CATEGORY = 5;

describe("category product density", () => {
  it("assigns at least five products to every category", () => {
    const products = getSoftware({ includeUnpublished: true });
    const thin = getCategories({ includeUnpublished: true })
      .map((category) => {
        const count = products.filter(
          (p) =>
            p.primaryCategorySlug === category.slug ||
            p.secondaryCategorySlugs?.includes(category.slug) ||
            p.subcategorySlugs?.includes(category.slug),
        ).length;
        return { slug: category.slug, count };
      })
      .filter((row) => row.count < MIN_PRODUCTS_PER_CATEGORY);

    expect(thin).toEqual([]);
  });
});
