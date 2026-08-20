import { describe, expect, it } from "vitest";
import { listCategoryDefinitionSeeds } from "@/data/category-onboarding/seed";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import { useCasesSeed } from "@/data/seed/dimensions";
import { validateContentRepository } from "@/data/validation/validate-content";
import { validateCategorySeedAlignment } from "@/services/category-onboarding/validate";

describe("taxonomy integrity", () => {
  it("keeps category-definition use cases and features in the catalogue", () => {
    const useCases = new Set(useCasesSeed.map((item) => item.slug));
    const features = new Set(canonicalFeaturesSeed.map((item) => item.slug));
    const missingUseCases: string[] = [];
    const missingFeatures: string[] = [];

    for (const definition of listCategoryDefinitionSeeds()) {
      for (const useCase of definition.useCases) {
        if (!useCases.has(useCase.slug)) {
          missingUseCases.push(`${definition.slug}:${useCase.slug}`);
        }
      }
      for (const feature of definition.features) {
        if (!features.has(feature.slug)) {
          missingFeatures.push(`${definition.slug}:${feature.slug}`);
        }
      }
    }

    expect(missingUseCases).toEqual([]);
    expect(missingFeatures).toEqual([]);
    expect(validateCategorySeedAlignment().filter((i) => i.severity === "error")).toEqual(
      [],
    );
  });

  it("rejects unknown product / use-case / category refs on seeded software", () => {
    const report = validateContentRepository();
    const broken = report.issues.filter((issue) =>
      [
        "unknown-product-ref",
        "unknown-use-case-ref",
        "unknown-category-ref",
        "unknown-primary-category",
      ].includes(issue.code),
    );
    expect(broken).toEqual([]);
  });
});
