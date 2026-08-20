import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { getFeatureDetailProfile } from "@/data/feature-detail";
import { selectCriterionScopedVideos } from "@/services/product-media/requirement-page-media";
import type {
  RequirementConfidence,
  RequirementFeatureCellStatus,
  RequirementFitStatus,
} from "@/services/requirement-detail/labels";
import type {
  RequirementCriterionCellEvidence,
  RequirementCriterionDocEvidence,
  RequirementCriterionShotEvidence,
  RequirementCriterionVideoEvidence,
} from "@/services/requirement-detail/scorecard-keys";

export type {
  RequirementCriterionCellEvidence,
  RequirementCriterionDocEvidence,
  RequirementCriterionShotEvidence,
  RequirementCriterionVideoEvidence,
} from "@/services/requirement-detail/scorecard-keys";
export { scorecardEvidenceKey } from "@/services/requirement-detail/scorecard-keys";


function featurePageHref(featureSlug: string): string | null {
  const profile = getFeatureDetailProfile(featureSlug);
  if (profile) return `/features/${profile.slug}/`;
  if (featureSlug === "custom-pipelines") return "/features/multiple-pipelines/";
  if (featureSlug === "workflow-automation") {
    return "/features/workflow-automation/";
  }
  return null;
}

function featureDisplayName(slug: string, fallback?: string): string {
  return (
    fallback ??
    getFeatureDetailProfile(slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

export {
  mediaMatchesRequirementCriterion,
  selectCriterionScopedVideos,
} from "@/services/product-media/requirement-page-media";

function screenshotMatchesCriterion(
  shot: { id: string; alt: string; caption?: string; annotation?: string },
  criterion: { name: string; featureSlugs: string[] },
): boolean {
  const hay = `${shot.id} ${shot.alt} ${shot.caption ?? ""} ${shot.annotation ?? ""}`.toLowerCase();
  if (criterion.featureSlugs.some((f) => hay.includes(f.replace(/-/g, " ")) || hay.includes(f))) {
    return true;
  }
  const words = criterion.name.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  return words.some((w) => hay.includes(w));
}

function confidenceFromEvidence(counts: {
  docs: number;
  screenshots: number;
  videos: number;
  featureEvidence: number;
}): RequirementConfidence {
  const total =
    counts.docs + counts.screenshots + counts.videos + counts.featureEvidence;
  if (total >= 4) return "High";
  if (total >= 2) return "Medium";
  if (total >= 1) return "Low";
  return "Unknown";
}

/**
 * Build precise evidence for one scorecard cell:
 * requirementId + criterionId + productId.
 */
export function buildRequirementCriterionCellEvidence(input: {
  requirementSlug: string;
  criterion: {
    id: string;
    name: string;
    featureSlugs: string[];
  };
  productSlug: string;
  productName: string;
  assessment: RequirementFitStatus | "insufficient-evidence";
  featureStatuses: Record<string, RequirementFeatureCellStatus>;
  featureNames?: Record<string, string>;
  mediaPool: ProductMedia[];
}): RequirementCriterionCellEvidence {
  const enrichment = loadEnrichment(input.productSlug);
  const featureSlugs = input.criterion.featureSlugs;

  const supportingFeatures = featureSlugs.map((slug) => ({
    slug,
    name: featureDisplayName(slug, input.featureNames?.[slug]),
    status: input.featureStatuses[slug] ?? "not-evidenced",
    href: featurePageHref(slug),
  }));

  const documentation: RequirementCriterionDocEvidence[] = [];
  for (const slug of featureSlugs) {
    const row = enrichment?.featureSupport.find((f) => f.featureSlug === slug);
    if (!row?.sourceIds?.length) continue;
    for (const sourceId of row.sourceIds.slice(0, 2)) {
      documentation.push({
        id: `doc:${input.productSlug}:${slug}:${sourceId}`,
        title: `Official documentation — ${featureDisplayName(slug, input.featureNames?.[slug])}`,
        featureSlug: slug,
        featureName: featureDisplayName(slug, input.featureNames?.[slug]),
        sourceUrl: null,
      });
    }
  }

  const screenshots: RequirementCriterionShotEvidence[] = [];
  for (const shot of enrichment?.screenshots ?? []) {
    if (!screenshotMatchesCriterion(shot, input.criterion)) continue;
    screenshots.push({
      id: shot.id,
      src: shot.src,
      alt: shot.alt,
      caption: shot.caption,
      source: shot.source,
    });
    if (screenshots.length >= 3) break;
  }

  const videos = selectCriterionScopedVideos({
    mediaPool: input.mediaPool,
    requirementSlug: input.requirementSlug,
    criterionId: input.criterion.id,
    productSlug: input.productSlug,
    criterionFeatureSlugs: featureSlugs,
    limit: 2,
  }).map((media) => ({
    media,
    title: media.demonstratesCaption?.trim() || media.title,
    demonstrates: mediaWhatThisShows(media),
    doesNotEstablish: mediaLimitations(media),
    sourceOrganization:
      media.sourceOrganization?.trim() || media.channelName?.trim() || null,
    verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
  }));

  // Unknown assessment: never surface unrelated video as if it filled the gap
  const videosForCell =
    input.assessment === "insufficient-evidence" ? [] : videos;

  const featureEvidence = featureSlugs.reduce((sum, slug) => {
    const row = enrichment?.featureSupport.find((f) => f.featureSlug === slug);
    return sum + (row?.sourceIds?.length ?? 0);
  }, 0);

  const counts = {
    docs: documentation.length,
    screenshots: screenshots.length,
    videos: videosForCell.length,
  };

  return {
    requirementSlug: input.requirementSlug,
    criterionId: input.criterion.id,
    criterionName: input.criterion.name,
    productSlug: input.productSlug,
    productName: input.productName,
    assessment: input.assessment,
    confidence: confidenceFromEvidence({
      ...counts,
      featureEvidence,
    }),
    supportingFeatures,
    documentation,
    screenshots,
    videos: videosForCell,
    counts,
  };
}

export function buildRequirementScorecardEvidenceMap(input: {
  requirementSlug: string;
  criteria: Array<{ id: string; name: string; featureSlugs: string[] }>;
  products: Array<{
    slug: string;
    name: string;
    criterionCells: Record<
      string,
      RequirementFitStatus | "insufficient-evidence"
    >;
    featureCells: Record<string, RequirementFeatureCellStatus>;
  }>;
  featureNames?: Record<string, string>;
  mediaPool: ProductMedia[];
}): Record<string, RequirementCriterionCellEvidence> {
  const map: Record<string, RequirementCriterionCellEvidence> = {};
  for (const product of input.products) {
    for (const criterion of input.criteria) {
      const key = `${product.slug}::${criterion.id}`;
      map[key] = buildRequirementCriterionCellEvidence({
        requirementSlug: input.requirementSlug,
        criterion,
        productSlug: product.slug,
        productName: product.name,
        assessment:
          product.criterionCells[criterion.id] ?? "insufficient-evidence",
        featureStatuses: product.featureCells,
        featureNames: input.featureNames,
        mediaPool: input.mediaPool,
      });
    }
  }
  return map;
}
