import type {
  AssetContentCluster,
  GuideAssetGuideKind,
  SoftwareHubSectionId,
} from "@/domain/schemas/asset-discovery";

export function clusterForSoftwareSection(
  sectionId: SoftwareHubSectionId | string | undefined,
): AssetContentCluster {
  switch (sectionId) {
    case "features":
      return "Features";
    case "use-cases":
      return "Use Cases";
    case "implementation":
      return "Implementation";
    case "industry":
      return "Industries";
    case "overview":
    case "pricing":
    case "comparisons":
    case "alternatives":
    case "evidence":
    case "methodology":
    case "faq":
    case "screenshots":
    default:
      return "CRM Product Reviews";
  }
}

export function clusterForGuideKind(
  kind: GuideAssetGuideKind,
): AssetContentCluster {
  switch (kind) {
    case "product-implementation":
    case "product-setup":
      return "Implementation";
    case "product-migration":
      return "Migration";
    case "industry-guide":
      return "Industries";
    case "use-case-guide":
      return "Use Cases";
    case "feature-guide":
      return "Features";
    case "requirement-guide":
      return "Requirements";
    case "product-guide":
      return "CRM Product Reviews";
    case "vendor-neutral-fundamental":
    case "vendor-neutral-selection":
    case "vendor-neutral-pricing":
    case "strategy-guide":
    case "checklist-guide":
    case "comparison-education":
    case "other":
    default:
      return "CRM Guides";
  }
}

export function clusterFromRoute(route: string): AssetContentCluster | null {
  if (route.startsWith("/software/")) return "CRM Product Reviews";
  if (route.startsWith("/industries/")) return "Industries";
  if (route.startsWith("/use-cases/")) return "Use Cases";
  if (route.startsWith("/capabilities/")) return "Capabilities";
  if (route.startsWith("/requirements/")) return "Requirements";
  if (route.startsWith("/features/")) return "Features";
  if (route.includes("migration")) return "Migration";
  if (route.includes("implementation") || route.includes("setup")) {
    return "Implementation";
  }
  if (route.startsWith("/guides/")) return "CRM Guides";
  return null;
}
