import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import type { CategoryGuideMediaBundle } from "@/services/guides/category-guide-media";
import { cn } from "@/lib/cn";

type Props = {
  bundle: CategoryGuideMediaBundle;
  className?: string;
};

/**
 * Collapsed-by-default example vendor videos for category CRM guides.
 * Supplementary — never a ranked shortlist; sits after the main teaching body.
 */
export function GuideCategoryMediaSection({ bundle, className }: Props) {
  const count = bundle.examples.length;

  return (
    <section
      id="example-vendor-videos"
      aria-labelledby="example-vendor-videos-heading"
      className={cn("scroll-mt-28", className)}
    >
      <details
        open
        className="group rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 px-4 py-4 marker:content-none sm:items-center sm:px-5 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <h2
              id="example-vendor-videos-heading"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)] sm:text-[length:var(--sg-text-h2)]"
            >
              {bundle.heading}
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Optional · {count} example{count === 1 ? "" : "s"} · collapse if
              you don’t need them
            </p>
          </div>
          <ChevronDown
            className="mt-1 size-5 shrink-0 text-[var(--sg-color-text-muted)] transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>

        <div className="space-y-5 border-t border-[var(--sg-color-border)] px-4 py-5 sm:px-5">
          <p className="max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
            {bundle.body}
          </p>

          <ul className="space-y-3">
            {bundle.examples.map((example, index) => (
              <li key={example.video.id}>
                <details
                  open={index === 0}
                  className="group/item rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]"
                >                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                        {example.mode === "implementation"
                          ? "Official vendor tutorial"
                          : "Official vendor video"}{" "}
                        · example
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-[var(--sg-color-text)]">
                        {example.productName}
                        {example.video.title
                          ? ` — ${example.video.title}`
                          : ""}
                      </p>
                    </div>
                    <ChevronDown
                      className="size-4 shrink-0 text-[var(--sg-color-text-muted)] transition-transform group-open/item:rotate-180"
                      aria-hidden
                    />
                  </summary>
                  <div className="space-y-3 border-t border-[var(--sg-color-border)] px-4 py-4">
                    <OfficialProductVideo
                      media={example.video}
                      vendorName={example.productName}
                      variant="compact"
                      priority="low"
                    />
                    <Link
                      href={example.productHref}
                      className="inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {example.productName} research →
                    </Link>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </section>
  );
}
