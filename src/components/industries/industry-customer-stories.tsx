"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import type { IndustryCustomerStoryCard } from "@/services/industry-customer-stories";
import { cn } from "@/lib/cn";

function CustomerStoryCard({ story }: { story: IndustryCustomerStoryCard }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start gap-3">
          <ProductLogo
            name={story.productName}
            logo={story.logo}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <Badge variant="warning">{story.label}</Badge>
            <p className="mt-2 font-semibold text-[var(--sg-color-text)]">
              {story.title}
            </p>
          </div>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Company
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {story.companyName ?? "Not disclosed in research record"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Industry
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {story.industryLabel}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Product
            </dt>
            <dd className="mt-0.5 text-[var(--sg-color-text)]">
              {story.productName}
            </dd>
          </div>
        </dl>

        <OfficialProductVideo
          media={story.media}
          vendorName={story.productName}
          variant="compact"
          priority="low"
        />

        {story.whatThisStoryIllustrates.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What this story illustrates
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text)]">
              {story.whatThisStoryIllustrates.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

/**
 * Lower-page industry section for vendor customer stories.
 * Never placed in primary ranking / product-fit sections.
 */
export function IndustryCustomerStoriesSection({
  stories,
  className,
}: {
  stories: IndustryCustomerStoryCard[];
  className?: string;
}) {
  if (stories.length === 0) return null;

  return (
    <section
      id="real-world-examples"
      aria-labelledby="real-world-examples-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="real-world-examples-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Real-world examples
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Vendor-published customer stories can show real-world context. They are
        not independent SoftwareGlimpse recommendations and do not prove typical
        outcomes, ROI, or product superiority.
      </p>
      <ul className="mt-6 grid gap-5 lg:grid-cols-2">
        {stories.map((story) => (
          <li key={story.id}>
            <CustomerStoryCard story={story} />
          </li>
        ))}
      </ul>
    </section>
  );
}
