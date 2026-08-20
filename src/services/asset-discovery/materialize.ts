import type {
  AssetOpportunity,
  AssetSearchTask,
  DiscoveredAsset,
} from "@/domain/schemas/asset-discovery";
import { DiscoveredAssetSchema } from "@/domain/schemas/asset-discovery";
import { scoreAssetQuality } from "./quality";
import {
  createSeededSearchProvider,
  inferAssetTypeFromOpportunity,
  inferMediaFormat,
  noopSearchProvider,
  type AssetSearchProvider,
  type SeededCandidate,
} from "./search";
import { classifyUsageRights } from "./usage";
import { verifyOfficialSource } from "./verify";

function slugId(parts: string[]): string {
  return parts
    .map((p) =>
      p
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("-")
    .slice(0, 120);
}

export type MaterializeCandidatesOptions = {
  opportunities: AssetOpportunity[];
  searchTasks: AssetSearchTask[];
  provider?: AssetSearchProvider;
  /** Explicit candidates (never invent). */
  seededCandidates?: SeededCandidate[];
  /** ISO timestamp for lastVerifiedAt. */
  verifiedAt?: string;
};

/**
 * Run search tasks against a provider and materialize DiscoveredAsset recommendations.
 * Skips inventing URLs — empty provider results yield no assets.
 */
export async function materializeDiscoveredAssets(
  options: MaterializeCandidatesOptions,
): Promise<DiscoveredAsset[]> {
  const provider =
    options.provider ??
    (options.seededCandidates?.length
      ? createSeededSearchProvider(options.seededCandidates)
      : noopSearchProvider);

  const byOpportunity = new Map(
    options.opportunities.map((o) => [o.id, o] as const),
  );
  const discovered: DiscoveredAsset[] = [];
  const seenUrls = new Set<string>();
  const now = options.verifiedAt ?? new Date().toISOString();

  for (const task of options.searchTasks) {
    const opportunity = byOpportunity.get(task.opportunityId);
    if (!opportunity) continue;

    const hits = await provider.search(task);
    for (const hit of hits) {
      if (!hit.url?.startsWith("http")) continue;
      if (seenUrls.has(hit.url)) continue;
      seenUrls.add(hit.url);

      const verification = verifyOfficialSource({
        sourceUrl: hit.url,
        productSlug: opportunity.productId,
        claimedChannelName: hit.channelName,
        researcherConfirmedOfficialChannel: Boolean(hit.channelName),
      });

      const assetType = inferAssetTypeFromOpportunity(opportunity, hit);
      const mediaFormat = inferMediaFormat(hit.url, assetType);
      const usage = classifyUsageRights({
        assetType,
        mediaFormat,
        sourceType: verification.sourceType,
        officialSource: verification.officialSource,
        sourceUrl: hit.url,
        embedEnabled:
          verification.sourceType === "vendor-youtube" ||
          verification.sourceType === "vendor-vimeo"
            ? true
            : undefined,
      });

      const quality = scoreAssetQuality({
        assetType,
        officialSource: verification.officialSource,
        officialConfidence: verification.confidence,
        title: hit.title,
        whatItShows: [],
        freshnessStatus: hit.publishedAt ? "acceptable" : "unknown",
        embeddingUsability: usage.embedAvailable ? 5 : usage.directLinkAvailable ? 3 : 0,
        evidenceUsefulness: verification.officialSource ? 4 : 1,
      });

      const researchMediaBridgeSuggested =
        verification.officialSource &&
        (mediaFormat === "video" || mediaFormat === "embed") &&
        (usage.recommendation === "embed" || usage.recommendation === "link");

      discovered.push(
        DiscoveredAssetSchema.parse({
          id: slugId([
            "asset",
            opportunity.pageId,
            opportunity.needType,
            hit.url,
          ]),
          opportunityId: opportunity.id,
          title: hit.title,
          sourceUrl: hit.url,
          canonicalSourceUrl: hit.url,
          assetType,
          mediaFormat,
          sourceType: verification.sourceType,
          sourceOrganization: opportunity.productId,
          officialSource: verification.officialSource,
          officialVerificationNotes: [
            ...verification.notes,
            ...verification.checks.map(
              (c) => `${c.passed ? "PASS" : "FAIL"} ${c.id}: ${c.detail}`,
            ),
          ],
          productIds: opportunity.productId ? [opportunity.productId] : [],
          featureIds: opportunity.featureId ? [opportunity.featureId] : [],
          capabilityIds: opportunity.capabilityId
            ? [opportunity.capabilityId]
            : [],
          requirementIds: opportunity.requirementId
            ? [opportunity.requirementId]
            : [],
          useCaseIds: opportunity.useCaseId ? [opportunity.useCaseId] : [],
          industryIds: opportunity.industryId ? [opportunity.industryId] : [],
          whatItShows: [],
          potentialUses: [
            opportunity.description,
            `Supports need: ${opportunity.needType}`,
          ],
          embedAvailable: usage.embedAvailable,
          directLinkAvailable: usage.directLinkAvailable,
          usageRightsStatus: usage.usageRightsStatus,
          publishedAt: hit.publishedAt,
          lastVerifiedAt: verification.officialSource ? now : undefined,
          freshnessStatus: hit.publishedAt ? "acceptable" : "unknown",
          qualityAssessment: quality,
          recommendation: usage.recommendation,
          reason: usage.reason,
          researchMediaBridgeSuggested,
        }),
      );
    }
  }

  return discovered;
}
