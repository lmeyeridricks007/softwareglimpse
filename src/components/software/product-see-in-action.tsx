import type { ProductMedia } from "@/domain";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ExternalLink } from "@/components/outbound/external-link";
import { cn } from "@/lib/cn";
import {
  formatDurationLabel,
  providerWatchLabel,
} from "@/services/product-media";

type SeeInActionProps = {
  productName: string;
  video: ProductMedia | null | undefined;
  className?: string;
};

/**
 * Overview section: See [Product] in action — placed after verdict / who-it's-for.
 */
export function ProductSeeInAction({
  productName,
  video,
  className,
}: SeeInActionProps) {
  if (!video) return null;

  return (
    <section
      id="see-in-action"
      aria-labelledby="see-in-action-heading"
      className={cn("scroll-mt-28 space-y-5", className)}
    >
      <div>
        <h2
          id="see-in-action-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          See {productName} in action
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          Official vendor demonstration of product surfaces. It supplements
          screenshots and editorial analysis — it is not independent
          SoftwareGlimpse testing.
        </p>
      </div>
      <OfficialProductVideo
        media={video}
        vendorName={productName}
        priority="low"
      />
    </section>
  );
}

type MediaStripItem = {
  id: string;
  kind: "video" | "screenshots" | "docs";
  label: string;
  href: string;
  external?: boolean;
};

type MediaStripProps = {
  productName: string;
  overviewVideo?: ProductMedia | null;
  featureVideos?: ProductMedia[];
  screenshotCount: number;
  docsHref?: string | null;
  className?: string;
};

/**
 * Compact jump strip for existing product media only.
 */
export function ProductMediaStrip({
  productName,
  overviewVideo,
  featureVideos = [],
  screenshotCount,
  docsHref,
  className,
}: MediaStripProps) {
  const items: MediaStripItem[] = [];

  if (overviewVideo) {
    const duration = formatDurationLabel(overviewVideo.durationSeconds);
    items.push({
      id: `video-${overviewVideo.id}`,
      kind: "video",
      label: duration
        ? `Watch ${duration} product tour`
        : "Watch product tour",
      href: "#see-in-action",
    });
  }

  if (screenshotCount > 0) {
    items.push({
      id: "screenshots",
      kind: "screenshots",
      label: `${screenshotCount} screenshot${screenshotCount === 1 ? "" : "s"}`,
      href: "#screenshots-heading",
    });
  }

  for (const video of featureVideos.slice(0, 2)) {
    items.push({
      id: `feature-${video.id}`,
      kind: "video",
      label: video.title.length > 36 ? `${video.title.slice(0, 34)}…` : video.title,
      href: `#official-feature-video`,
    });
  }

  if (docsHref) {
    items.push({
      id: "docs",
      kind: "docs",
      label: "Official docs",
      href: docsHref,
      external: true,
    });
  }

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={`${productName} product media`}
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Product media
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => {
          const prefix =
            item.kind === "video" ? "▶ " : item.kind === "screenshots" ? "▣ " : "↗ ";
          if (item.external) {
            return (
              <li key={item.id}>
                <ExternalLink
                  href={item.href}
                  type="documentation"
                  className="inline-flex items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                >
                  {prefix}
                  {item.label}
                </ExternalLink>
              </li>
            );
          }
          return (
            <li key={item.id}>
              <a
                href={item.href}
                className="inline-flex items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]"
              >
                {prefix}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      {overviewVideo ? (
        <p className="sr-only">
          Official source: {providerWatchLabel(overviewVideo.provider)}{" "}
          {overviewVideo.sourceUrl}
        </p>
      ) : null}
    </nav>
  );
}

type HeroTourLinkProps = {
  productName: string;
  video: ProductMedia | null | undefined;
  className?: string;
};

/** Compact hero jump link — never a live iframe. */
export function ProductHeroTourLink({
  productName,
  video,
  className,
}: HeroTourLinkProps) {
  if (!video) return null;
  const duration = formatDurationLabel(video.durationSeconds);
  return (
    <a
      href="#see-in-action"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 text-base font-medium text-[var(--sg-color-text)] transition-colors hover:border-[var(--sg-color-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
        className,
      )}
    >
      <span aria-hidden>▶</span>
      {duration
        ? `Watch ${duration} ${productName} tour`
        : `Watch ${productName} product tour`}
    </a>
  );
}
