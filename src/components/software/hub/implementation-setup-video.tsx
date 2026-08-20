import Link from "next/link";
import type { ProductMedia } from "@/domain";
import { mediaWhatThisShows } from "@/domain";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import type { ImplementationRelatedLinks } from "@/services/product-media/context-tab-media";
import { cn } from "@/lib/cn";

type Props = {
  productName: string;
  video: ProductMedia;
  related: ImplementationRelatedLinks;
  className?: string;
};

/**
 * Setup / implementation official tutorial block for Guides tab.
 */
export function ImplementationSetupVideo({
  productName,
  video,
  related,
  className,
}: Props) {
  const shows = mediaWhatThisShows(video);
  const source =
    video.sourceOrganization?.trim() ||
    video.channelName?.trim() ||
    productName;

  const guide =
    related.setupGuide ??
    related.implementationGuide ??
    related.migrationGuide;

  const isSetupTutorial =
    video.type === "official-tutorial" ||
    video.evidenceClaimKinds.includes("setup-tutorial") ||
    video.placements.includes("implementation");

  const heading = isSetupTutorial
    ? "Setting up your first pipeline"
    : `See ${productName} in action`;
  const blurb = isSetupTutorial
    ? "Official vendor tutorial for onboarding and configuration. It is not a SoftwareGlimpse implementation plan — use our independent guides for rollout judgment."
    : "Official vendor product video. Treat it as UI/workflow evidence — not SoftwareGlimpse scoring or plan advice.";
  const badge = isSetupTutorial
    ? "Official vendor tutorial"
    : "Official vendor video";

  return (
    <section
      id="official-implementation-video"
      aria-labelledby="implementation-setup-heading"
      className={cn("scroll-mt-28 space-y-5", className)}
    >
      <div>
        <h2
          id="implementation-setup-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {heading}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          {blurb}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
        <div className="min-w-0 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {badge}
          </p>
          <OfficialProductVideo
            media={video}
            vendorName={productName}
            variant="compact"
            priority="low"
          />
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            Source: Official {source}
          </p>
        </div>

        <div className="min-w-0 space-y-4 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5">
          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              What to prepare before this step
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
              <li>• Agree pipeline stages that match how your team sells</li>
              <li>• Decide who owns deals, activities, and reporting</li>
              <li>• List must-have fields before importing contacts</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              What this video covers
            </h3>
            {shows.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                {shows.slice(0, 5).map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {video.demonstratesCaption ??
                  video.editorialCommentary ??
                  "Vendor-led product navigation and workflows."}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Related SoftwareGlimpse content
            </h3>
            <ul className="mt-2 space-y-2 text-sm">
              {guide ? (
                <li>
                  <Link
                    href={guide.href}
                    className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    Read our independent guide: {guide.title}
                  </Link>
                </li>
              ) : null}
              {related.requirementHref ? (
                <li>
                  <Link
                    href={related.requirementHref}
                    className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    Explore requirement: Support separate sales processes
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/requirements/"
                    className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    Explore CRM requirements
                  </Link>
                </li>
              )}
              {related.migrationGuide &&
              related.migrationGuide.href !== guide?.href ? (
                <li>
                  <Link
                    href={related.migrationGuide.href}
                    className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {related.migrationGuide.title}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
