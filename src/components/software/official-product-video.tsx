"use client";

import { useId, useState } from "react";
import type { ProductMedia } from "@/domain";
import {
  isSoftwareGlimpseAnalysisVideo,
  mediaWhatThisShows,
} from "@/domain";
import { ExternalLink } from "@/components/outbound/external-link";
import { useConsentOptional } from "@/components/site/consent-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
  providerConsentLabel,
  shouldShowWatchOfficialFallback,
} from "@/services/product-media";
import { evaluateMediaGovernance } from "@/services/product-media/governance";

type Props = {
  media: ProductMedia;
  /** Product / vendor display name for player labeling. */
  vendorName: string;
  className?: string;
  /** When true, load below-fold with loading=lazy on iframe once activated. */
  priority?: "high" | "low";
  /**
   * `full` may place meta beside the player when the component is wide enough.
   * `compact` always stacks. Prefer `showDetails={false}` when a parent card
   * already renders title / “what this shows”.
   */
  variant?: "full" | "compact";
  /** When false, render the player only (no title / caption / checklist chrome). */
  showDetails?: boolean;
};

function resolveEmbedUrl(media: ProductMedia): string | null {
  const enriched = enrichMediaFromSourceUrl(media);
  const eligibility = isVideoPublicEligible(enriched);
  if (eligibility.linkOnly) return null;
  if (enriched.embeddingAllowed === false) return null;
  if (enriched.status === "embedding-disabled") return null;
  if (enriched.embedUrl) return enriched.embedUrl;
  return null;
}

/**
 * Lazy official vendor (or SoftwareGlimpse analysis) video player.
 * Thumbnail + play first; iframe loads only after consent + user activation.
 * Never autoplays. Does not store or inject raw third-party iframe HTML.
 */
export function OfficialProductVideo({
  media,
  vendorName,
  className,
  priority = "low",
  variant = "full",
  showDetails = true,
}: Props) {
  const consent = useConsentOptional();
  const titleId = useId();
  const [activated, setActivated] = useState(false);
  const [marketingUnlocked, setMarketingUnlocked] = useState(false);
  const enriched = enrichMediaFromSourceUrl(media);
  const governance = evaluateMediaGovernance({ media: enriched });
  const embedUrl = resolveEmbedUrl(enriched);
  const consentLabel = providerConsentLabel(enriched.provider);
  const isSg = isSoftwareGlimpseAnalysisVideo(enriched);
  const badgeLabel = isSg
    ? "SoftwareGlimpse analysis"
    : enriched.type === "official-tutorial"
      ? "Official vendor tutorial"
      : enriched.type === "official-webinar"
        ? "Official vendor webinar"
        : "Official vendor video";
  const shows = mediaWhatThisShows(enriched);
  const linkOnlyFallback =
    shouldShowWatchOfficialFallback(enriched) || !embedUrl;

  const marketingAllowed =
    marketingUnlocked || (consent?.allows("marketing") ?? false);
  const needsConsent =
    Boolean(consent) && !marketingAllowed && Boolean(embedUrl) && !linkOnlyFallback;
  const showPlayer =
    activated && marketingAllowed && Boolean(embedUrl) && !linkOnlyFallback;
  const embeddingUnavailable = linkOnlyFallback;

  // Source failed → hide from active public display (parent should also filter).
  if (governance.publicVisibility === "hidden") {
    return null;
  }

  function handleAllowAndPlay() {
    consent?.savePreferences({ marketing: true });
    setMarketingUnlocked(true);
    setActivated(true);
  }

  function handlePlayClick() {
    if (needsConsent) return;
    if (!embedUrl) return;
    setActivated(true);
  }

  return (
    <article
      className={cn(
        "@container overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
        className,
      )}
      aria-labelledby={titleId}
    >
      {/*
        Split beside the player only when THIS component is wide enough.
        Viewport `lg:` was wrong inside 2-column card grids (cramped text).
      */}
      <div
        className={cn(
          "grid gap-0",
          variant === "full" &&
            showDetails &&
            "@min-[36rem]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]",
        )}
      >
        <div className="min-w-0">
          <div className="relative aspect-video w-full overflow-hidden bg-[var(--sg-color-surface-muted)]">
            {showPlayer && embedUrl ? (
              <iframe
                title={`${enriched.title} — ${isSg ? "SoftwareGlimpse" : `official ${vendorName}`} video`}
                src={embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading={priority === "high" ? "eager" : "lazy"}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <>
                {enriched.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote vendor/YouTube thumbs; avoid layout shift via aspect-video
                  <img
                    src={enriched.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={priority === "high" ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : (
                  <div
                    className="absolute inset-0 bg-[linear-gradient(135deg,var(--sg-color-surface-muted),var(--sg-color-border))]"
                    aria-hidden
                  />
                )}
                <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--sg-color-navy)_35%,transparent)]" />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                  {needsConsent ? (
                    <>
                      <p className="max-w-sm text-sm font-medium text-white">
                        {consentLabel}
                      </p>
                      <p className="max-w-sm text-xs text-white/85">
                        This content is hosted by{" "}
                        {enriched.provider === "youtube"
                          ? "YouTube"
                          : enriched.provider === "vimeo"
                            ? "Vimeo"
                            : "the vendor"}
                        . The player loads only after you allow marketing cookies.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="onDark"
                          size="md"
                          onClick={handleAllowAndPlay}
                          aria-label={`Allow cookies and play ${enriched.title}`}
                        >
                          Allow and play
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/15 hover:text-white"
                          onClick={() => consent?.openPreferences()}
                        >
                          Cookie settings
                        </Button>
                      </div>
                    </>
                  ) : embeddingUnavailable ? (
                    <>
                      <p className="max-w-sm text-sm font-medium text-white">
                        Embedding unavailable
                      </p>
                      <ExternalLink
                        href={enriched.sourceUrl}
                        type="vendor-official"
                        className="text-sm font-medium text-white underline underline-offset-2"
                      >
                        Watch official video ↗
                      </ExternalLink>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="onDark"
                      size="lg"
                      onClick={handlePlayClick}
                      aria-label={`Play video: ${enriched.title}`}
                      className="gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <span
                        className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-white"
                        aria-hidden
                      >
                        ▶
                      </span>
                      Play video
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {showDetails ? (
          <div
            className={cn(
              "flex min-w-0 flex-col gap-3 border-t border-[var(--sg-color-border)] p-5",
              variant === "full" &&
                "@min-[36rem]:border-l @min-[36rem]:border-t-0",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                isSg
                  ? "text-[var(--sg-color-primary)]"
                  : "text-[var(--sg-color-text-muted)]",
              )}
            >
              {badgeLabel}
            </p>
            <h3
              id={titleId}
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
            >
              {enriched.title}
            </h3>
            {enriched.demonstratesCaption ? (
              <p className="text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                {enriched.demonstratesCaption}
              </p>
            ) : null}

            {shows.length > 0 ? (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  What this shows
                </h4>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                  {shows.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        className="text-[var(--sg-color-success)]"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <h3 id={titleId} className="sr-only">
            {enriched.title}
          </h3>
        )}
      </div>
    </article>
  );
}
