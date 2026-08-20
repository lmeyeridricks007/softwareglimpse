import {
  getAllCategoriesUnfiltered,
  getCategoryBySlug,
} from "@/data";
import type { CategoryDuplicateOutcome } from "@/domain";
import {
  findCategoryDefinitionSeedByName,
  getCategoryDefinitionSeed,
} from "@/data/category-onboarding/seed";
import { isCategoryActivated } from "@/data/category-onboarding/store";

export type CategoryDuplicateResult = {
  outcome: CategoryDuplicateOutcome;
  matchedSlug?: string;
  reason: string;
};

function norm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function slugifyCategoryName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Detect NEW / EXISTING / ALIAS / SUBCATEGORY / POSSIBLE_DUPLICATE.
 */
export function checkDuplicateCategory(input: {
  name: string;
  slug: string;
  parentSlug?: string | null;
  forceReconcile?: boolean;
}): CategoryDuplicateResult {
  const slug = input.slug.toLowerCase();
  const nameKey = norm(input.name);

  const existing = getCategoryBySlug(slug, { includeUnpublished: true });
  if (existing) {
    return {
      outcome: "EXISTING",
      matchedSlug: existing.slug,
      reason: `Category slug already exists: ${existing.slug}`,
    };
  }

  if (getCategoryDefinitionSeed(slug) || isCategoryActivated(slug)) {
    return {
      outcome: input.forceReconcile ? "EXISTING" : "EXISTING",
      matchedSlug: slug,
      reason: `Category definition seed/activation exists for ${slug}`,
    };
  }

  const all = getAllCategoriesUnfiltered();
  for (const cat of all) {
    const keys = [cat.name, cat.slug, ...(cat.aliases ?? [])].map(norm);
    if (keys.includes(nameKey) && cat.slug !== slug) {
      if (cat.aliases?.some((a) => norm(a) === nameKey)) {
        return {
          outcome: "ALIAS",
          matchedSlug: cat.slug,
          reason: `"${input.name}" is an alias of existing category ${cat.slug}`,
        };
      }
      return {
        outcome: "POSSIBLE_DUPLICATE",
        matchedSlug: cat.slug,
        reason: `Name overlaps existing category ${cat.slug}`,
      };
    }
  }

  // Parent + child pattern: Email Marketing under Marketing
  if (input.parentSlug) {
    const parent = getCategoryBySlug(input.parentSlug, {
      includeUnpublished: true,
    });
    if (parent && slug.includes(parent.slug)) {
      // fine — subcategory naming
    }
  }

  const seed = findCategoryDefinitionSeedByName(input.name);
  if (seed && seed.slug !== slug) {
    return {
      outcome: "POSSIBLE_DUPLICATE",
      matchedSlug: seed.slug,
      reason: `Definition seed matches under slug ${seed.slug}`,
    };
  }

  return { outcome: "NEW", reason: "No matching category found" };
}

export function resolveCategorySlug(name: string, slug?: string): string {
  if (slug) return slug;
  const seed = findCategoryDefinitionSeedByName(name);
  if (seed) return seed.slug;
  return slugifyCategoryName(name);
}
