import type { ApprovedAssetCandidate } from "@/domain";
import { listPlacementRecommendations } from "./store";
import { stageIndex } from "./lifecycle";
import { evaluateMediaGovernance } from "@/services/product-media/governance";
import { listEnrichmentMedia } from "@/services/feature-media-research/persist";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";
import { parseVideoSourceUrl } from "@/services/product-media";

/**
 * Human-readable inspection of an approval-queue candidate.
 * Does not mutate anything.
 */
export function inspectApprovedAssetCandidate(
  candidate: ApprovedAssetCandidate,
): {
  candidate: ApprovedAssetCandidate;
  placements: ReturnType<typeof listPlacementRecommendations>;
  nextGate: string;
  dedupeHint: string | null;
  healthHint: string | null;
  checklist: string[];
} {
  const placements = listPlacementRecommendations({
    candidateId: candidate.id,
  });

  const order = [
    "DISCOVERED",
    "SOURCE_VERIFIED",
    "RELEVANCE_REVIEWED",
    "USAGE_REVIEWED",
    "MAPPED",
    "EDITORIALLY_APPROVED",
    "ACTIVE",
  ] as const;
  const idx = stageIndex(candidate.stage);
  const nextGate =
    candidate.stage === "REJECTED"
      ? "none (rejected)"
      : idx >= 0 && idx < order.length - 1
        ? order[idx + 1]!
        : "none (complete or active)";

  let dedupeHint: string | null = null;
  const productSlug = candidate.mapping.productIds[0];
  if (productSlug) {
    const parsed = parseVideoSourceUrl(candidate.sourceUrl);
    if (parsed) {
      const dup = findDuplicateResearchMedia(
        {
          id: "",
          provider: parsed.provider,
          sourceUrl: parsed.sourceUrl,
          videoId: parsed.videoId,
          providerId: parsed.videoId,
        },
        listEnrichmentMedia(productSlug),
      );
      if (dup) {
        dedupeHint = `Would reuse ResearchMedia ${dup.id} (${dup.title}) — status=${dup.status}`;
      }
    }
  }

  let healthHint: string | null = null;
  if (candidate.importedMediaId && productSlug) {
    const media = listEnrichmentMedia(productSlug).find(
      (m) => m.id === candidate.importedMediaId,
    );
    if (media) {
      const gov = evaluateMediaGovernance({ media });
      healthHint = `visibility=${gov.publicVisibility}; flags=${gov.flags.join(",") || "none"}; needsRefresh=${gov.needsResearchRefresh}`;
    }
  }

  const checklist = [
    `Stage: ${candidate.stage}`,
    `Usage state: ${candidate.usageState}`,
    `Official: ${candidate.officialSource ? "yes" : "no"}`,
    `whatThisShows: ${candidate.whatThisShows.length} observation(s)`,
    `Products: ${candidate.mapping.productIds.join(", ") || "—"}`,
    `Features: ${candidate.mapping.featureIds.join(", ") || "—"}`,
    `Placements: ${placements.length}`,
    `Import media: ${candidate.importedMediaId ?? candidate.reusedMediaId ?? "—"}`,
    `Import source: ${candidate.importedSourceId ?? "—"}`,
  ];

  return {
    candidate,
    placements,
    nextGate,
    dedupeHint,
    healthHint,
    checklist,
  };
}
