import type { ProductMedia } from "@/domain";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { cn } from "@/lib/cn";

type Props = {
  vendorName: string;
  videos: ProductMedia[];
  heading?: string;
  headingId?: string;
  className?: string;
  /** First video may use higher image priority when above the fold. */
  priorityFirst?: boolean;
  emptyHidden?: boolean;
};

/**
 * Contextual official video section — not a dump of every product video.
 * Callers should pre-filter via selectProductVideos.
 */
export function OfficialProductVideoSection({
  vendorName,
  videos,
  heading = "Official product video",
  headingId = "official-product-video",
  className,
  priorityFirst = false,
  emptyHidden = true,
}: Props) {
  if (videos.length === 0) {
    if (emptyHidden) return null;
    return null;
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("scroll-mt-28 space-y-5", className)}
    >
      <div>
        <h2
          id={headingId}
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          Vendor-published demonstrations that illustrate product surfaces.
          They supplement screenshots and documentation — they are not
          independent SoftwareGlimpse testing.
        </p>
      </div>
      <div className="space-y-6">
        {videos.map((video, index) => (
          <OfficialProductVideo
            key={video.id}
            media={video}
            vendorName={vendorName}
            priority={priorityFirst && index === 0 ? "high" : "low"}
          />
        ))}
      </div>
    </section>
  );
}
