"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type { FeatureSeeInActionCard } from "@/services/product-media/feature-page-media";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Comparative official vendor demos for a Feature Detail page.
 * Only products with eligible ResearchMedia — no blank cards / no forced symmetry.
 */
export function FeatureSeeInAction({
  featureName,
  cards,
  className,
}: {
  featureName: string;
  cards: FeatureSeeInActionCard[];
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <section
      id="see-in-action"
      aria-labelledby="see-in-action-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="see-in-action-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See {featureName.toLowerCase()} in action
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Official product demonstrations can help show how vendors implement the
        same feature differently. SoftwareGlimpse evaluates these alongside
        documentation, screenshots and other product evidence. Absence of a
        video does not mean a product lacks the feature.
      </p>

      <ul className="mt-6 grid gap-5 md:grid-cols-1 lg:grid-cols-2">
        {cards.map((card) => (
          <li key={card.productSlug}>
            <FeatureVideoEvidenceCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeatureVideoEvidenceCard({
  card,
}: {
  card: FeatureSeeInActionCard;
  /** @deprecated Layout is always player-first; kept for call-site compatibility. */
  compact?: boolean;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <ProductLogo name={card.productName} logo={card.logo} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {card.productName}
            </p>
            <p className="font-semibold text-[var(--sg-color-text)]">
              {card.media.title}
            </p>
          </div>
          <Badge variant="success" className="ml-auto shrink-0">
            Primary source
          </Badge>
        </div>

        <OfficialProductVideo
          media={card.media}
          vendorName={card.productName}
          variant="compact"
          showDetails={false}
          priority="low"
        />

        {card.whatThisShows.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What this demonstrates
            </p>
            <ul className="mt-2 space-y-1.5">
              {card.whatThisShows.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.demonstratedDimensionLabels.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Evaluation dimensions shown
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.demonstratedDimensionLabels.map((label) => (
                <li key={label}>
                  <Badge variant="neutral">{label}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.whatNotEstablished.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Not established by this video
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {card.whatNotEstablished.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4 text-sm">
          <p className="text-[var(--sg-color-text-muted)]">
            Source:{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              {card.sourceOrganization}
            </span>
            {" · "}
            Verified {formatDate(card.verifiedAt)}
          </p>
          <ExternalLink
            href={card.media.sourceUrl}
            type="evidence-source"
            className="font-medium"
          >
            Open source ↗
          </ExternalLink>
        </div>
      </div>
    </Card>
  );
}
