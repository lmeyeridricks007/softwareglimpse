import type {
  AssetOpportunity,
  AssetSearchTask,
  AssetType,
  MediaFormat,
} from "@/domain/schemas/asset-discovery";

/**
 * Search provider interface for asset discovery.
 * Prefer existing search integrations / curated candidates over scraping hacks.
 * Providers must never invent URLs.
 */

export type AssetSearchHit = {
  title: string;
  url: string;
  snippet?: string;
  /** Optional channel name when known from the provider (not from title guess). */
  channelName?: string;
  publishedAt?: string;
};

export type AssetSearchProvider = {
  id: string;
  /**
   * Execute a search task. Return only real results.
   * Empty array is valid when no API / no matches.
   */
  search: (task: AssetSearchTask) => Promise<AssetSearchHit[]>;
};

/**
 * Default provider: does not hit the network.
 * Returns empty results so audits still emit opportunities + search tasks.
 */
export const noopSearchProvider: AssetSearchProvider = {
  id: "noop",
  async search() {
    return [];
  },
};

/**
 * Candidate bag provider — only returns URLs explicitly supplied by the caller
 * (fixtures, researcher paste, or prior ResearchMedia / ResearchSource records).
 * Matches candidates to tasks by opportunityId and optional query keywords.
 */
export type SeededCandidate = {
  opportunityId?: string;
  title: string;
  url: string;
  channelName?: string;
  publishedAt?: string;
  assetTypeHint?: AssetType;
  mediaFormatHint?: MediaFormat;
  keywords?: string[];
};

export function createSeededSearchProvider(
  candidates: SeededCandidate[],
): AssetSearchProvider {
  const genericKeywords = new Set([
    "official",
    "demo",
    "tutorial",
    "guide",
    "product",
    "crm",
  ]);

  return {
    id: "seeded-candidates",
    async search(task) {
      const q = task.query.toLowerCase();
      return candidates
        .filter((c) => {
          if (c.opportunityId && c.opportunityId === task.opportunityId) return true;
          if (!c.keywords?.length) return false;
          const distinctive = c.keywords.filter(
            (k) => !genericKeywords.has(k.toLowerCase()),
          );
          // Require a distinctive keyword hit so product name alone does not
          // attach a pricing URL to every task for that product.
          return distinctive.some((k) => q.includes(k.toLowerCase()));
        })
        .map((c) => ({
          title: c.title,
          url: c.url,
          channelName: c.channelName,
          publishedAt: c.publishedAt,
          snippet: undefined,
        }));
    },
  };
}

export function inferMediaFormat(
  url: string,
  assetType?: AssetType,
): MediaFormat {
  const lower = url.toLowerCase();
  if (
    lower.includes("youtube.com") ||
    lower.includes("youtu.be") ||
    lower.includes("vimeo.com")
  ) {
    return "video";
  }
  if (lower.endsWith(".pdf")) return "pdf";
  if (assetType === "official-product-tour") return "interactive";
  if (
    assetType === "official-diagram" ||
    assetType === "official-architecture-diagram" ||
    assetType === "official-workflow-diagram" ||
    assetType === "official-integration-diagram"
  ) {
    return "diagram";
  }
  if (
    assetType === "official-screenshot" ||
    assetType === "official-ui-image" ||
    assetType === "official-logo" ||
    assetType === "official-brand-asset"
  ) {
    return "image";
  }
  // Pricing visuals / reference visuals / original opportunities are usually pages
  // or editorial redraws — do not treat "*visual*" as a binary image file.
  if (
    assetType === "official-pricing-visual" ||
    assetType === "authoritative-reference-visual" ||
    assetType === "softwareglimpse-original-visual-opportunity" ||
    assetType === "official-pdf-guide"
  ) {
    return assetType === "official-pdf-guide" ? "pdf" : "page";
  }
  return "page";
}

export function inferAssetTypeFromOpportunity(
  opportunity: AssetOpportunity,
  hit: AssetSearchHit,
): AssetType {
  const preferred = opportunity.preferredAssetTypes[0];
  if (preferred && preferred !== "softwareglimpse-original-visual-opportunity") {
    const lower = `${hit.title} ${hit.url}`.toLowerCase();
    if (lower.includes("webinar")) return "official-webinar";
    if (lower.includes("tutorial") || lower.includes("how to")) {
      return "official-tutorial";
    }
    if (lower.includes("case stud") || lower.includes("customer")) {
      return "official-customer-story";
    }
    return preferred;
  }
  return preferred ?? "official-product-video";
}
