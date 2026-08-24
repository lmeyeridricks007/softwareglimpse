import type { ProductScreenshot } from "@/domain";

type ScreenshotLike = Pick<
  ProductScreenshot,
  "alt" | "caption" | "annotation" | "source"
>;

const INTERNAL_CAPTION_PATTERNS = [
  /overview frame from/i,
  /vendor video thumbnail/i,
  /product visual from vendor/i,
  /from vendor video/i,
  /from the official .+ vendor video/i,
];

function isInternalPipelineCaption(text: string): boolean {
  return INTERNAL_CAPTION_PATTERNS.some((pattern) => pattern.test(text));
}

/** Screenshot sourced from a YouTube thumbnail backfill — not a first-party UI capture. */
export function isYoutubeScreenshotBackfill(shot: ScreenshotLike): boolean {
  const source = shot.source ?? "";
  if (/youtube\.com|youtu\.be/i.test(source)) return true;
  const blob = `${shot.caption ?? ""} ${shot.annotation ?? ""}`.toLowerCase();
  return (
    blob.includes("vendor video") ||
    blob.includes("youtube") ||
    blob.includes("video thumbnail")
  );
}

/**
 * Buyer-facing caption for product screenshots. Omits pipeline metadata
 * (YouTube URLs, checked dates, thumbnail-backfill copy).
 */
export function publicScreenshotCaption(shot: ScreenshotLike): string | null {
  const caption = shot.caption?.trim();
  if (caption && !isInternalPipelineCaption(caption)) {
    return caption;
  }

  const alt = shot.alt?.trim();
  if (!alt) return null;

  if (isYoutubeScreenshotBackfill(shot)) {
    return null;
  }

  return alt;
}

/** Whether a public “source” link is appropriate (never for YouTube thumbnail backfills). */
export function publicScreenshotSourceUrl(shot: ScreenshotLike): string | null {
  if (isYoutubeScreenshotBackfill(shot)) return null;
  const source = shot.source?.trim();
  if (!source || !/^https?:\/\//i.test(source)) return null;
  return source;
}
