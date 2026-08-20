"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type { CapabilitySeeInActionCard } from "@/services/product-media/capability-page-media";

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

export function CapabilityVideoEvidenceCard({
  card,
}: {
  card: CapabilitySeeInActionCard;
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
            {card.focusLabel ? (
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Focus: {card.focusLabel}
              </p>
            ) : null}
          </div>
          <Badge variant="success" className="shrink-0">
            Official vendor video
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
              What this shows
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

        {card.whatToNotice.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What to notice
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {card.whatToNotice.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.whatNotEstablished.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What this does not establish
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {card.whatNotEstablished.slice(0, 5).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.relatedFeatures.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Features visible in this demo
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedFeatures.map((f) => (
                <li key={f.slug}>
                  {f.href ? (
                    <Link
                      href={f.href}
                      className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-primary)] hover:border-[var(--sg-color-primary)]"
                    >
                      {f.label}
                    </Link>
                  ) : (
                    <Badge variant="neutral">{f.label}</Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.relatedRequirements.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Requirements illustrated
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedRequirements.map((r) => (
                <li key={r.slug}>
                  {r.href ? (
                    <Link
                      href={r.href}
                      className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-primary)] hover:border-[var(--sg-color-primary)]"
                    >
                      {r.label}
                    </Link>
                  ) : (
                    <Badge variant="neutral">{r.label}</Badge>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              Visual presence does not by itself confirm requirement
              satisfaction — see the product assessment.
            </p>
          </div>
        ) : null}

        {card.relatedUseCases.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Particularly relevant to
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedUseCases.map((uc) => (
                <li key={uc.slug}>
                  <Link
                    href={uc.href ?? `/use-cases/${uc.slug}/`}
                    className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {uc.label} →
                  </Link>
                </li>
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
          <div className="flex flex-wrap gap-3">
            <ExternalLink
              href={card.media.sourceUrl}
              type="evidence-source"
              className="font-medium"
            >
              Open source ↗
            </ExternalLink>
            <Link
              href={`/software/${card.productSlug}/`}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Read {card.productName} review
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Comparative official vendor workflow demos for a Capability page.
 * Broader than Feature “see in action” — emphasizes end-to-end capability workflows.
 */
export function CapabilitySeeInAction({
  capabilityName,
  cards,
  evidenceHref = "#capability-evidence",
  className,
}: {
  capabilityName: string;
  cards: CapabilitySeeInActionCard[];
  evidenceHref?: string;
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <section
      id="see-in-action"
      aria-labelledby="cap-see-in-action-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cap-see-in-action-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See {capabilityName.toLowerCase()} in action
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Official vendor demonstrations help show how different CRM platforms
        approach the workflows, features and interactions that make up{" "}
        {capabilityName.toLowerCase()}. Absence of a video does not mean a
        product lacks the capability.
      </p>

      <ul className="mt-6 grid gap-5 md:grid-cols-1 lg:grid-cols-2">
        {cards.map((card) => (
          <li key={card.productSlug}>
            <CapabilityVideoEvidenceCard card={card} />
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm">
        <a
          href={evidenceHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View all capability evidence →
        </a>
      </p>
    </section>
  );
}

export function CapabilityApproachComparison({
  capabilityName,
  cards,
  interpretation,
  className,
}: {
  capabilityName: string;
  cards: CapabilitySeeInActionCard[];
  interpretation?: string | null;
  className?: string;
}) {
  if (cards.length < 2) return null;
  const [a, b] = cards;

  return (
    <section
      id="approach-differences"
      aria-labelledby="cap-approach-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cap-approach-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How CRM products approach {capabilityName.toLowerCase()} differently
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Paired official demos highlight different workflow emphases — not a
        ranking. Comparative statements stay within what the evidence shows.
      </p>

      <ul className="mt-6 grid gap-5 lg:grid-cols-2">
        {[a!, b!].map((card) => (
          <li key={card.productSlug}>
            <CapabilityVideoEvidenceCard card={card} compact />
          </li>
        ))}
      </ul>

      {interpretation ? (
        <Card className="mt-5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            SoftwareGlimpse interpretation
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text)]">
            {interpretation}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

export function CapabilityWorkflowMediaBridge({
  capabilityName,
  cards,
  className,
}: {
  capabilityName: string;
  cards: CapabilitySeeInActionCard[];
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <div className={cn("mt-8", className)}>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
        See how CRM products implement this workflow
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Broader capability workflow demos for {capabilityName.toLowerCase()} —
        distinct from narrow feature walkthroughs.
      </p>
      <ul className="mt-3 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
        {cards.slice(0, 4).map((card) => (
          <li key={`wf-teaser-${card.productSlug}`}>
            {card.productName}: {card.media.title}
          </li>
        ))}
      </ul>
      <a
        href="#see-in-action"
        className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        ▶ Watch official workflow demos
      </a>
    </div>
  );
}
