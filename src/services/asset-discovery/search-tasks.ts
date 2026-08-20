import type {
  AssetOpportunity,
  AssetSearchTask,
  AssetSourceType,
} from "@/domain/schemas/asset-discovery";
import { AssetSearchTaskSchema } from "@/domain/schemas/asset-discovery";
import {
  allOfficialDomainsForProduct,
  getVendorOfficialSourceEntry,
} from "./vendor-registry";

/**
 * Build explicit search tasks from opportunities.
 * Queries are entity + need specific — never blind web crawls.
 */

function productLabel(opportunity: AssetOpportunity): string {
  return opportunity.productId ?? "CRM";
}

function featureLabel(opportunity: AssetOpportunity): string {
  return (
    opportunity.featureId ??
    opportunity.capabilityId ??
    opportunity.sectionTitle ??
    opportunity.needType
  );
}

function preferredSourcesForNeed(
  needType: AssetOpportunity["needType"],
): AssetSourceType[] {
  switch (needType) {
    case "overview-demo":
    case "feature-demo":
    case "workflow-demo":
    case "product-tour":
      return ["vendor-youtube", "vendor-official-site", "vendor-academy"];
    case "setup-tutorial":
    case "implementation-guide":
      return [
        "vendor-academy",
        "vendor-help-center",
        "vendor-youtube",
        "vendor-documentation",
      ];
    case "pricing-evidence":
      return ["vendor-pricing", "vendor-official-site"];
    case "ui-screenshot":
      return ["vendor-help-center", "vendor-documentation", "vendor-official-site"];
    case "brand-logo":
      return ["vendor-brand-center", "vendor-official-site"];
    case "customer-story":
      return ["vendor-customer-story", "vendor-official-site", "vendor-youtube"];
    case "webinar":
      return ["vendor-webinar", "vendor-youtube", "vendor-academy"];
    case "integration-diagram":
    case "architecture-diagram":
      return ["vendor-documentation", "vendor-official-site"];
    case "authoritative-reference":
      return ["government", "regulator", "standards-body", "authoritative-primary"];
    case "teaching-diagram":
    case "workflow-diagram":
      return [
        "authoritative-primary",
        "vendor-documentation",
        "vendor-official-site",
      ];
    case "pdf-guide":
      return ["vendor-documentation", "vendor-academy", "vendor-help-center"];
    case "reporting-visual":
      return ["vendor-youtube", "vendor-help-center", "vendor-documentation"];
    default:
      return ["vendor-official-site", "vendor-documentation"];
  }
}

function queriesForOpportunity(opportunity: AssetOpportunity): string[] {
  const product = productLabel(opportunity);
  const feature = featureLabel(opportunity);
  const industry = opportunity.industryId?.replace(/-/g, " ");

  switch (opportunity.needType) {
    case "overview-demo":
      return [
        `${product} official product overview demo`,
        `${product} product tour official`,
        `${product} official workflow automation demo`,
      ];
    case "feature-demo":
      return [
        `${product} ${feature} official demo`,
        `${product} ${feature} tutorial official`,
        `${product} ${feature} site:youtube.com`,
      ];
    case "workflow-demo":
      return [
        `${product} ${feature} workflow demo official`,
        `${product} pipeline tutorial official`,
      ];
    case "setup-tutorial":
      return [
        `${product} setup guide official`,
        `${product} onboarding tutorial official`,
        `${product} getting started academy`,
      ];
    case "implementation-guide":
      return [
        `${product} implementation guide official`,
        `${product} setup documentation`,
      ];
    case "pricing-evidence":
      return [`${product} official pricing`, `${product} pricing documentation`];
    case "ui-screenshot":
      return [
        `${product} official screenshots`,
        `${product} ${feature} help center`,
        `${product} reporting documentation`,
      ];
    case "brand-logo":
      return [`${product} brand assets`, `${product} brand kit logo`];
    case "customer-story":
      return [
        `${product} customer story official`,
        industry
          ? `${product} ${industry} customer case study official`
          : `${product} customer case study official`,
      ];
    case "webinar":
      return [
        `${product} onboarding webinar official`,
        `${product} ${feature} webinar`,
      ];
    case "integration-diagram":
      return [
        `${product} integrations directory official`,
        `${product} integration architecture`,
      ];
    case "architecture-diagram":
      return [`${product} architecture diagram official`];
    case "reporting-visual":
      return [
        `${product} reporting documentation`,
        `${product} reporting demo official`,
      ];
    case "authoritative-reference":
      return industry
        ? [
            `${industry} CRM data protection guidance site:gov`,
            `${industry} customer data standards`,
          ]
        : ["CRM data protection guidance authoritative"];
    case "teaching-diagram":
    case "workflow-diagram":
      return [
        `${feature} workflow diagram`,
        industry
          ? `${industry} ${feature} process diagram authoritative`
          : `${product} ${feature} workflow official`,
      ];
    case "pdf-guide":
      return [`${product} PDF guide official`, `${product} buyer guide PDF`];
    case "product-tour":
      return [`${product} product tour official`, `${product} interactive demo`];
    default:
      return [`${product} ${opportunity.needType} official`];
  }
}

/**
 * Generate search tasks for open opportunities only.
 * Satisfied-existing opportunities do not generate web searches.
 */
export function buildSearchTasks(
  opportunities: AssetOpportunity[],
): AssetSearchTask[] {
  const tasks: AssetSearchTask[] = [];

  for (const opportunity of opportunities) {
    if (
      opportunity.status === "satisfied-existing" ||
      opportunity.status === "closed" ||
      opportunity.status === "deferred"
    ) {
      continue;
    }

    // Original visual opportunities: search is optional; prefer create-original
    if (
      opportunity.preferredAssetTypes.length === 1 &&
      opportunity.preferredAssetTypes[0] ===
        "softwareglimpse-original-visual-opportunity"
    ) {
      tasks.push(
        AssetSearchTaskSchema.parse({
          id: `search-${opportunity.id}-original`,
          opportunityId: opportunity.id,
          query: `${featureLabel(opportunity)} teaching diagram (prefer SoftwareGlimpse original)`,
          preferredSourceTypes: preferredSourcesForNeed(opportunity.needType),
          preferredDomains: opportunity.productId
            ? allOfficialDomainsForProduct(opportunity.productId)
            : [],
          notes:
            "Prefer creating an original SoftwareGlimpse visual grounded in verified facts rather than copying vendor imagery",
        }),
      );
      continue;
    }

    const queries = queriesForOpportunity(opportunity);
    const entry = opportunity.productId
      ? getVendorOfficialSourceEntry(opportunity.productId)
      : undefined;
    const preferredDomains = opportunity.productId
      ? allOfficialDomainsForProduct(opportunity.productId)
      : [];
    const preferredSourceTypes = preferredSourcesForNeed(opportunity.needType);

    queries.forEach((query, index) => {
      const youtube =
        query.includes("site:youtube.com") ||
        preferredSourceTypes.includes("vendor-youtube");
      tasks.push(
        AssetSearchTaskSchema.parse({
          id: `search-${opportunity.id}-${index + 1}`,
          opportunityId: opportunity.id,
          query,
          preferredSourceTypes,
          preferredDomains,
          siteFilter: youtube
            ? "youtube.com"
            : preferredDomains[0],
          notes: entry
            ? `Prioritize ${entry.organizationName} official domains/channels`
            : "No vendor registry entry — require manual official verification",
        }),
      );
    });
  }

  return tasks;
}
