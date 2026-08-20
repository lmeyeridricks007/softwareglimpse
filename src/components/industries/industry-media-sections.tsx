"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import type { EvidenceExplorerModel } from "@/services/evidence-explorer/types";
import type { IndustrySeeInActionCard } from "@/services/product-media/industry-page-media";
import type { IndustryHubModel } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

function contextBadgeVariant(
  kind: IndustrySeeInActionCard["contextKind"],
): "success" | "primary" | "warning" | "neutral" {
  if (kind === "industry-specific" || kind === "industry-edition") {
    return "success";
  }
  if (kind === "customer-case-study") return "warning";
  return "neutral";
}

export function IndustryVideoEvidenceCard({
  card,
}: {
  card: IndustrySeeInActionCard;
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
              {card.title}
            </p>
            {card.industryEditionLabel ? (
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Edition: {card.industryEditionLabel}
              </p>
            ) : null}
          </div>
          <Badge
            variant={contextBadgeVariant(card.contextKind)}
            className="shrink-0"
          >
            {card.contextLabel}
          </Badge>
        </div>

        {card.relevanceNote ? (
          <p className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-3 py-2 text-xs text-[var(--sg-color-text-muted)]">
            {card.relevanceNote}
          </p>
        ) : null}

        <OfficialProductVideo
          media={card.media}
          vendorName={card.productName}
          variant="compact"
          showDetails={false}
          priority="low"
        />

        {card.industryContext.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Industry context
            </p>
            <ul className="mt-2 space-y-1.5">
              {card.industryContext.map((line) => (
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
              What to notice for this industry
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {card.whatToNotice.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.relatedCapabilities.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Capabilities demonstrated
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedCapabilities.map((cap) =>
                cap.href ? (
                  <li key={cap.slug}>
                    <Link
                      href={cap.href}
                      className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {cap.label} →
                    </Link>
                  </li>
                ) : (
                  <li key={cap.slug} className="text-sm">
                    {cap.label}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : null}

        {card.relatedRequirements.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Requirements visible / relevant
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedRequirements.map((req) =>
                req.href ? (
                  <li key={req.slug}>
                    <Link
                      href={req.href}
                      className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {req.label} →
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ) : null}

      </div>
    </Card>
  );
}

export function IndustrySeeCrmInIndustry({
  industryLabel,
  industrySlug,
  cards,
  methodologyNote,
  requirementsHref,
  finderHref,
  className,
}: {
  industryLabel: string;
  industrySlug: string;
  cards: IndustrySeeInActionCard[];
  methodologyNote?: string;
  requirementsHref?: string;
  finderHref?: string;
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <section
      id="see-in-industry"
      aria-labelledby="see-in-industry-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="see-in-industry-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See CRM in {industryLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Official vendor demonstrations can help show how CRM products are used
        in {industryLabel.toLowerCase()} workflows. SoftwareGlimpse evaluates
        these alongside independent research, documentation and product
        evidence.
      </p>
      {methodologyNote ? (
        <p className="mt-2 max-w-3xl text-xs text-[var(--sg-color-text-muted)]">
          {methodologyNote}
        </p>
      ) : null}

      <ul className="mt-6 grid gap-5 lg:grid-cols-2">
        {cards.map((card) => (
          <li key={card.media.id}>
            <IndustryVideoEvidenceCard card={card} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        {requirementsHref ? (
          <ButtonLink href={requirementsHref} size="sm">
            Build requirements
          </ButtonLink>
        ) : null}
        {finderHref ? (
          <ButtonLink href={finderHref} variant="outline" size="sm">
            Find CRM for {industryLabel}
          </ButtonLink>
        ) : null}
        <ButtonLink
          href={`/industries/${industrySlug}/#industry-evidence`}
          variant="ghost"
          size="sm"
        >
          Browse evidence
        </ButtonLink>
      </div>
    </section>
  );
}

export function IndustryScreenshotWorkflowFallback({
  industryLabel,
  shots,
  className,
}: {
  industryLabel: string;
  shots: IndustryHubModel["screenshotFallback"];
  className?: string;
}) {
  if (shots.length === 0) return null;
  return (
    <section
      id="see-in-industry"
      aria-labelledby="see-in-industry-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="see-in-industry-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See CRM workflows
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        No suitable official industry video is on record yet. These catalogue
        screenshots show product surfaces relevant to{" "}
        {industryLabel.toLowerCase()} evaluation.
      </p>
      <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shots.slice(0, 4).map((shot, index) => (
          <li key={shot.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {index + 1}. {shot.productName}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.alt}
              className="aspect-video w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] object-cover bg-[var(--sg-color-surface-muted)]"
              loading="lazy"
            />
            {shot.caption ? (
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                {shot.caption}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function IndustryWorkflowVideoCompare({
  industryLabel,
  compare,
  className,
}: {
  industryLabel: string;
  compare: IndustryHubModel["workflowCompare"];
  className?: string;
}) {
  if (!compare?.left || !compare.right) return null;
  return (
    <section
      id="workflow-compare"
      aria-labelledby="workflow-compare-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="workflow-compare-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Compare how products support {industryLabel.toLowerCase()} workflows
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {compare.interpretation}
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <IndustryVideoEvidenceCard card={compare.left} compact />
        <IndustryVideoEvidenceCard card={compare.right} compact />
      </div>
    </section>
  );
}

export function IndustryEvidenceSection({
  model,
  className,
}: {
  model: EvidenceExplorerModel | null;
  className?: string;
}) {
  if (!model || model.items.length === 0) return null;
  return (
    <section
      id="industry-evidence"
      aria-labelledby="industry-evidence-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="industry-evidence-heading"
        className="sr-only"
      >
        Industry evidence
      </h2>
      <DynamicEvidenceExplorer model={model} />
    </section>
  );
}

export function IndustryVisualEvidenceAside({
  counts,
  className,
}: {
  counts: IndustryHubModel["visualEvidenceCounts"];
  className?: string;
}) {
  const total =
    counts.industrySpecificDemos +
    counts.generalWorkflowDemos +
    counts.customerCaseStudies +
    counts.screenshots;
  if (total === 0) return null;
  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm",
        className,
      )}
      aria-label="Visual evidence counts"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Visual evidence
      </p>
      <ul className="mt-2 space-y-1 text-[var(--sg-color-text-muted)]">
        <li>Industry-specific demos: {counts.industrySpecificDemos}</li>
        <li>General workflow demos: {counts.generalWorkflowDemos}</li>
        {counts.customerCaseStudies > 0 ? (
          <li>Customer case studies: {counts.customerCaseStudies}</li>
        ) : null}
        <li>Screenshots: {counts.screenshots}</li>
      </ul>
    </aside>
  );
}
