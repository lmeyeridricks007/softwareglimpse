import { getSoftwareBySlug } from "@/data";
import {
  findAffiliateCatalogueEntry,
} from "@/data/seed/affiliate-catalogue";
import type {
  CategoryDefinition,
  CategoryMembership,
} from "@/domain";

/**
 * Classify seed products into primary/secondary/adjacent/uncertain.
 * Does not blindly add every seed product.
 */
export function classifyMemberships(
  definition: CategoryDefinition,
  seedSlugs: string[],
): CategoryMembership[] {
  const slugs = [...new Set([...definition.seedProductSlugs, ...seedSlugs])];
  const memberships: CategoryMembership[] = [];

  for (const productSlug of slugs) {
    const software = getSoftwareBySlug(productSlug, {
      includeUnpublished: true,
    });
    const affiliate = findAffiliateCatalogueEntry(productSlug);
    const existsInCatalogue = Boolean(software);

    // Explicit exclusion notes for deliverability-only
    if (
      productSlug === "inboxally" ||
      affiliate?.notes?.toLowerCase().includes("deliverability")
    ) {
      memberships.push({
        productSlug,
        role: "adjacent",
        confidence: "high",
        reason:
          "Deliverability-focused tooling — adjacent to Email Marketing, not core campaign platform",
        existsInCatalogue,
      });
      continue;
    }

    if (
      productSlug === "kartra" ||
      affiliate?.notes?.toLowerCase().includes("secondary") ||
      affiliate?.notes?.toLowerCase().includes("all-in-one")
    ) {
      memberships.push({
        productSlug,
        role: "secondary",
        confidence: "medium",
        reason: "All-in-one / suite — Email Marketing often secondary capability",
        existsInCatalogue,
      });
      continue;
    }

    if (
      productSlug === "freshmarketer" ||
      (affiliate?.categoryHint === "marketing" &&
        definition.slug === "email-marketing")
    ) {
      memberships.push({
        productSlug,
        role: "secondary",
        confidence: "medium",
        reason: "Broader marketing suite — Email Marketing may be secondary",
        existsInCatalogue,
      });
      continue;
    }

    if (software) {
      if (
        software.primaryCategorySlug === definition.slug ||
        software.primaryCategorySlug === "email-marketing"
      ) {
        // Prefer explicit subcategory match when classifying email-marketing
        if (software.primaryCategorySlug === definition.slug) {
          memberships.push({
            productSlug,
            role: "primary",
            confidence: "high",
            reason: "Catalogue primary category matches",
            existsInCatalogue: true,
          });
          continue;
        }
      }
      if (software.secondaryCategorySlugs.includes(definition.slug)) {
        memberships.push({
          productSlug,
          role: "secondary",
          confidence: "high",
          reason: "Catalogue secondary category matches",
          existsInCatalogue: true,
        });
        continue;
      }
      if (
        software.primaryCategorySlug === definition.parentSlug ||
        software.primaryCategorySlug === "marketing"
      ) {
        // Parent marketing → email-marketing primary candidate when seeded
        if (
          definition.slug === "email-marketing" &&
          definition.seedProductSlugs.includes(productSlug)
        ) {
          memberships.push({
            productSlug,
            role: "primary",
            confidence: "medium",
            reason: "Seed product on marketing parent — treat as Email Marketing primary pending review",
            existsInCatalogue: true,
          });
          continue;
        }
        memberships.push({
          productSlug,
          role: "uncertain",
          confidence: "low",
          reason: `On parent category ${software.primaryCategorySlug} — review subcategory membership`,
          existsInCatalogue: true,
        });
        continue;
      }
    }

    if (
      affiliate?.categoryHint === definition.slug ||
      definition.seedProductSlugs.includes(productSlug)
    ) {
      memberships.push({
        productSlug,
        role: "primary",
        confidence: existsInCatalogue ? "high" : "medium",
        reason: existsInCatalogue
          ? "Seed + catalogue alignment"
          : "Affiliate/seed hint — product not yet in catalogue",
        existsInCatalogue,
      });
      continue;
    }

    memberships.push({
      productSlug,
      role: "uncertain",
      confidence: "low",
      reason: "Insufficient evidence for membership",
      existsInCatalogue,
    });
  }

  return memberships;
}
