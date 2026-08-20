"use client";

import type { ProductMedia } from "@/domain";
import { mediaWhatThisShows } from "@/domain";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { cn } from "@/lib/cn";

type Props = {
  vendorName: string;
  video: ProductMedia;
  /** Fit / editorial analysis for this use case. */
  fitAnalysis?: string | null;
  className?: string;
};

/**
 * Use-case contextual official workflow demo — not a brand promo dump.
 */
export function UseCaseWorkflowVideo({
  vendorName,
  video,
  fitAnalysis,
  className,
}: Props) {
  const shows = mediaWhatThisShows(video);
  const source =
    video.sourceOrganization?.trim() ||
    video.channelName?.trim() ||
    vendorName;

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Official vendor{" "}
        {video.type === "official-tutorial" ? "tutorial" : "workflow demo"}
      </p>
      <OfficialProductVideo
        media={video}
        vendorName={vendorName}
        variant="compact"
        priority="low"
      />
      {shows.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            What this workflow demonstrates
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
            {shows.slice(0, 5).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--sg-color-success)]" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="text-xs text-[var(--sg-color-text-muted)]">
        Source: Official {source}. This is vendor training/demo content — not
        SoftwareGlimpse instruction.
      </p>
      {fitAnalysis ? (
        <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] p-3 text-sm">
          <p className="font-medium text-[var(--sg-color-text)]">
            SoftwareGlimpse fit analysis
          </p>
          <p className="mt-1 text-[var(--sg-color-text-muted)]">{fitAnalysis}</p>
        </div>
      ) : null}
    </div>
  );
}
