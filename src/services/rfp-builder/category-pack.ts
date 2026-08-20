import { getCategoryContentPack } from "@/data/config/tools/category-content-packs";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import type { RfpContentPack } from "./pack-context";

/**
 * Buyer-authored RFP pack. Scope / triggers / users come from the category
 * content catalog (real use-case and capability slugs). Does not invent
 * vendor capabilities.
 */
export function buildCategoryRfpPack(
  kit: CategoryFinderClientKit,
): RfpContentPack {
  const authored = getCategoryContentPack(kit.categorySlug)?.rfp;

  return {
    id: kit.categorySlug,
    productLabel: kit.shortName,
    scopeCatalog: authored?.scopeCatalog?.length
      ? [...authored.scopeCatalog]
      : [{ id: "core", label: `${kit.shortName} core workflows` }],
    changeTriggers: authored?.changeTriggers ?? [
      "Outgrown current process / tool",
      "Too many disconnected tools",
      "Reporting gaps",
      "Team is growing",
      "Compliance / security requirement",
    ],
    userGroups: authored?.userGroups ?? [
      "Primary operators",
      "Team leads / managers",
      "Admins",
      "IT / security",
    ],
    integrationCategories: authored?.integrationCategories ?? [
      "Core systems",
      "Identity / SSO",
      "Other",
    ],
    migrationObjects: authored?.migrationObjects ?? [
      "Users and roles",
      "Historical records",
      "Integrations",
      "Reports / dashboards",
    ],
    requirementsBuilderHref: kit.requirementsHref,
    requirementsBuilderLabel: `${kit.shortName} Requirements Builder`,
    scopeStepDescription: `Use the ${kit.shortName} scope checklist. Mark phase — do not invent volumes or vendor facts.`,
  };
}
