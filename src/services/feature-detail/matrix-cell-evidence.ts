import type {
  FeatureEvaluationDimension,
  ProductMedia,
  ProductScreenshot,
  ResearchSource,
} from "@/domain";
import { mediaWhatThisShows } from "@/domain";

export type MatrixCellDocSource = {
  title: string;
  url: string;
  kindLabel?: string | null;
};

export type MatrixCellScreenshot = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  checkedAt?: string;
};

export type MatrixCellEvidence = {
  /** Total countable evidence items (docs + shots + videos). */
  totalCount: number;
  documentationCount: number;
  screenshotCount: number;
  videoCount: number;
  documentation: MatrixCellDocSource[];
  screenshots: MatrixCellScreenshot[];
  videos: ProductMedia[];
  /** Structured observations from attached videos (for drawer). */
  videoDemonstrates: string[];
};

/**
 * Whether a ResearchMedia record may appear in a matrix cell for this dimension.
 * If demonstratedDimensionIds is set, only those dimensions receive the video.
 * Plan/limit rows never get video unless explicitly tagged.
 */
export function mediaMatchesEvaluationDimension(
  media: ProductMedia,
  dim: FeatureEvaluationDimension,
  featureSlug: string,
): boolean {
  if (media.demonstratedDimensionIds.length > 0) {
    return media.demonstratedDimensionIds.includes(dim.id);
  }

  if (dim.source === "min-plan" || dim.source === "notes-limit") {
    return false;
  }

  if (dim.source === "primary") {
    return media.featureIds.includes(featureSlug);
  }

  if (dim.source === "related-feature" && dim.relatedFeatureSlug) {
    return media.featureIds.includes(dim.relatedFeatureSlug);
  }

  return false;
}

function resolveDocSources(input: {
  sourceIds: string[];
  allSources: ResearchSource[];
  limit?: number;
}): MatrixCellDocSource[] {
  const limit = input.limit ?? 4;
  const out: MatrixCellDocSource[] = [];
  for (const id of input.sourceIds) {
    const src = input.allSources.find((s) => s.id === id);
    if (!src?.url || src.status === "rejected") continue;
    if (src.sourceHealth === "unavailable") continue;
    out.push({
      title: src.title ?? "Official documentation",
      url: src.url,
      kindLabel: src.sourceType ?? null,
    });
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Build per-dimension evidence for one product on a Feature Detail matrix.
 * Video availability never changes cell display/status values.
 */
export function buildMatrixCellEvidence(input: {
  dim: FeatureEvaluationDimension;
  featureSlug: string;
  supportSourceIds: string[];
  allSources: ResearchSource[];
  productVideos: ProductMedia[];
  productScreenshots: ProductScreenshot[];
  /** Attach feature-matched screenshots to primary (and related UI) dims only. */
  attachScreenshots: boolean;
}): MatrixCellEvidence {
  const videos = input.productVideos
    .filter((m) =>
      mediaMatchesEvaluationDimension(m, input.dim, input.featureSlug),
    )
    .slice(0, 2);

  const documentation =
    input.dim.source === "min-plan"
      ? []
      : resolveDocSources({
          sourceIds: input.supportSourceIds,
          allSources: input.allSources,
        });

  const screenshots: MatrixCellScreenshot[] = input.attachScreenshots
    ? input.productScreenshots.slice(0, 3).map((s) => ({
        id: s.id,
        src: s.src,
        alt: s.alt,
        caption: s.caption,
        source: s.source,
        checkedAt: s.checkedAt,
      }))
    : [];

  const videoDemonstrates = videos.flatMap((v) =>
    mediaWhatThisShows(v).slice(0, 4),
  );

  return {
    totalCount: documentation.length + screenshots.length + videos.length,
    documentationCount: documentation.length,
    screenshotCount: screenshots.length,
    videoCount: videos.length,
    documentation,
    screenshots,
    videos,
    videoDemonstrates: [...new Set(videoDemonstrates)],
  };
}

export function matrixEvidenceIndicatorLabel(
  evidence: MatrixCellEvidence | null | undefined,
): string | null {
  if (!evidence || evidence.totalCount === 0) return null;
  if (evidence.totalCount === 1) {
    if (evidence.videoCount === 1) return "Evidence";
    if (evidence.screenshotCount === 1) return "Evidence";
    return "1 source";
  }
  return `${evidence.totalCount} sources`;
}
