"use client";

import { useId, useState } from "react";
import type { ProductMedia, ProductScreenshot } from "@/domain";
import { mediaWhatThisShows } from "@/domain";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ExternalLink } from "@/components/outbound/external-link";
import {
  publicScreenshotCaption,
  publicScreenshotSourceUrl,
} from "@/services/product-media/public-screenshot-copy";
import { cn } from "@/lib/cn";

type MediaTab =
  | { id: string; kind: "video"; label: string; video: ProductMedia }
  | { id: string; kind: "screenshot"; label: string; shot: ProductScreenshot };

type Props = {
  vendorName: string;
  videos: ProductMedia[];
  screenshots: ProductScreenshot[];
  className?: string;
};

/**
 * Compact media control for one feature: prefer screenshots + one video
 * over many live iframes. Tabs switch poster/content without loading all players.
 */
export function FeatureMediaCarousel({
  vendorName,
  videos,
  screenshots,
  className,
}: Props) {
  const baseId = useId();
  const tabs: MediaTab[] = [];

  // Prefer one video first, then up to 2 screenshots
  for (const video of videos.slice(0, 1)) {
    tabs.push({
      id: `video-${video.id}`,
      kind: "video",
      label: "Official demo",
      video,
    });
  }
  for (const shot of screenshots.slice(0, 2)) {
    const label =
      shot.caption?.slice(0, 28) ||
      shot.alt.slice(0, 28) ||
      "Screenshot";
    tabs.push({
      id: `shot-${shot.id}`,
      kind: "screenshot",
      label: label.length < (shot.caption?.length ?? shot.alt.length) ? `${label}…` : label,
      shot,
    });
  }

  // Extra videos as tabs (still only one player when selected)
  for (const video of videos.slice(1, 3)) {
    tabs.push({
      id: `video-${video.id}`,
      kind: "video",
      label:
        video.title.length > 24 ? `${video.title.slice(0, 22)}…` : video.title,
      video,
    });
  }

  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (!active || tabs.length === 0) return null;

  return (
    <div className={cn("min-w-0 space-y-3", className)}>
      {tabs.length > 1 ? (
        <div
          role="tablist"
          aria-label={`${vendorName} feature media`}
          className="flex flex-wrap gap-1.5"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                className={cn(
                  "rounded-[var(--sg-radius-md)] px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
                  selected
                    ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                    : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
                )}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.kind === "video" ? "▶ " : "▣ "}
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-${active.id}`}
      >
        {active.kind === "video" ? (
          <div className="space-y-2">
            <OfficialProductVideo
              media={active.video}
              vendorName={vendorName}
              variant="compact"
              priority="low"
            />
            {mediaWhatThisShows(active.video).length > 0 ? (
              <ul className="space-y-1 text-xs text-[var(--sg-color-text-muted)] lg:hidden">
                {mediaWhatThisShows(active.video)
                  .slice(0, 3)
                  .map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.shot.src}
              alt={active.shot.alt}
              className="aspect-video w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] object-cover"
              loading="lazy"
              decoding="async"
            />
            {(() => {
              const caption = publicScreenshotCaption(active.shot);
              return caption ? (
                <figcaption className="mt-1.5 text-xs text-[var(--sg-color-text-muted)]">
                  {caption}
                </figcaption>
              ) : null;
            })()}
            {publicScreenshotSourceUrl(active.shot) ? (
              <ExternalLink
                href={publicScreenshotSourceUrl(active.shot)!}
                type="vendor-official"
                className="mt-1 inline-flex text-xs font-medium text-[var(--sg-color-primary)]"
              >
                Screenshot source ↗
              </ExternalLink>
            ) : null}
          </figure>
        )}
      </div>
    </div>
  );
}
