/**
 * Category-aware decision-profile helpers for shared Requirements Builder UI/export.
 */

import type { DecisionProfile } from "@/domain";
import {
  CATEGORY_TOOL_META,
  isNewToolCategorySlug,
  type NewToolCategorySlug,
} from "@/data/config/tools/category-tool-meta";
import {
  listSelectableCrmCapabilities,
  listSelectableCrmUseCases,
  resolveRequirementMeta,
  type RequirementMeta,
  type SelectableCapability,
  type SelectableUseCase,
} from "./derive";
import {
  listSelectableSiCapabilities,
  listSelectableSiUseCases,
  resolveSiRequirementMeta,
} from "./si-derive";

export function isSiProfile(profile: DecisionProfile): boolean {
  return profile.categorySlug === "sales-intelligence";
}

export function productNounForProfile(profile: DecisionProfile): string {
  if (profile.categorySlug === "sales-intelligence") return "sales intelligence";
  if (profile.categorySlug === "crm") return "CRM";
  if (isNewToolCategorySlug(profile.categorySlug)) {
    return CATEGORY_TOOL_META[profile.categorySlug].productNoun;
  }
  return "software";
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isGenericCategoryProfile(
  profile: DecisionProfile,
): profile is DecisionProfile & { categorySlug: NewToolCategorySlug } {
  return isNewToolCategorySlug(profile.categorySlug);
}

export function listSelectableUseCasesForProfile(
  profile: DecisionProfile,
): SelectableUseCase[] {
  if (isSiProfile(profile)) return listSelectableSiUseCases();
  if (isGenericCategoryProfile(profile)) {
    return profile.useCases.map((useCase) => ({
      slug: useCase.id,
      name: humanizeSlug(useCase.id),
      tagline: "",
      teamTypes: [],
    }));
  }
  return listSelectableCrmUseCases();
}

export function listSelectableCapabilitiesForProfile(
  profile: DecisionProfile,
): SelectableCapability[] {
  if (isSiProfile(profile)) return listSelectableSiCapabilities();
  if (isGenericCategoryProfile(profile)) {
    const fromCapabilities = profile.capabilities.map((capability) => ({
      slug: capability.id,
      name: humanizeSlug(capability.id),
      icon: "",
      importanceLabel: capability.priority,
      coreObjective: "",
    }));
    const fromFeatures = profile.features.map((feature) => ({
      slug: feature.id,
      name: humanizeSlug(feature.id),
      icon: "",
      importanceLabel: feature.priority,
      coreObjective: "",
    }));
    const seen = new Set<string>();
    return [...fromCapabilities, ...fromFeatures].filter((item) => {
      if (seen.has(item.slug)) return false;
      seen.add(item.slug);
      return true;
    });
  }
  return listSelectableCrmCapabilities();
}

export function resolveRequirementMetaForProfile(
  profile: DecisionProfile,
  requirementSlug: string,
): RequirementMeta | null {
  if (isSiProfile(profile)) {
    return resolveSiRequirementMeta(requirementSlug);
  }
  if (isGenericCategoryProfile(profile)) {
    return {
      slug: requirementSlug,
      name: humanizeSlug(requirementSlug),
      shortExplanation: "",
      capabilitySlug: "",
      capabilityName: "",
      featureCount: 0,
      href: null,
      featureLinks: [],
    };
  }
  return resolveRequirementMeta(requirementSlug);
}

export function profileTitleForExport(profile: DecisionProfile): string {
  if (isSiProfile(profile)) return "Sales Intelligence Requirements Profile";
  if (isGenericCategoryProfile(profile)) {
    return `${CATEGORY_TOOL_META[profile.categorySlug].shortName} Requirements Profile`;
  }
  return "CRM Requirements Profile";
}

export function usersLabelForProfile(profile: DecisionProfile): string {
  if (isSiProfile(profile)) return "Seats / users";
  if (isGenericCategoryProfile(profile)) return "Users / seats";
  return "CRM users";
}
