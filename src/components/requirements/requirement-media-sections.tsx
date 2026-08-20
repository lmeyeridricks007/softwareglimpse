"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import type { RequirementSeeSupportCard } from "@/services/product-media/requirement-page-media";
import type { RequirementProductRow } from "@/services/requirement-detail/types";
import { fitStatusLabel } from "@/services/requirement-detail/labels";

export function RequirementSeeWhatSupportLooksLike({
  requirementName,
  cards,
  className,
}: {
  requirementName: string;
  cards: RequirementSeeSupportCard[];
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <section
      id="see-support"
      aria-labelledby="see-support-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="see-support-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See what support looks like
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        See how CRM products support {requirementName.toLowerCase()}. Official
        product demonstrations can help show how supporting features work in
        practice. SoftwareGlimpse evaluates these alongside documentation,
        screenshots and plan evidence — video availability does not change
        rankings.
      </p>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        {cards.map((card) => (
          <li key={`${card.productSlug}:${card.media.id}`}>
            <RequirementVideoEvidenceCard card={card} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementVideoEvidenceCard({
  card,
}: {
  card: RequirementSeeSupportCard;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start gap-3">
          <ProductLogo name={card.productName} logo={card.logo} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Official video · {card.productName}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold">
              {card.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Source: {card.sourceOrganization}
            </p>
            {card.relevanceNote ? (
              <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                {card.relevanceNote}
              </p>
            ) : null}
          </div>
          <Badge variant="success">Primary source</Badge>
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
                <li key={line} className="flex gap-2 text-sm">
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

        {card.criteriaSupported.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Requirement criteria supported
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.criteriaSupported.map((c) => (
                <li key={c.id}>
                  <Badge variant="neutral">{c.name}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.featuresDemonstrated.some((f) => f.shown) ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Features demonstrated
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {card.featuresDemonstrated.map((f) => (
                <li key={f.slug} className="flex items-center gap-2">
                  <span aria-hidden>{f.shown ? "✓" : "○"}</span>
                  {f.shown && f.href ? (
                    <Link
                      href={f.href}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {f.name}
                    </Link>
                  ) : (
                    <span
                      className={
                        f.shown
                          ? "font-medium"
                          : "text-[var(--sg-color-text-muted)]"
                      }
                    >
                      {f.name}
                      {!f.shown ? " — not shown" : ""}
                    </span>
                  )}
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
              {card.whatNotEstablished.slice(0, 6).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.relatedUseCase ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Especially relevant to:{" "}
            <Link
              href={card.relatedUseCase.href}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {card.relatedUseCase.name} →
            </Link>
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4 text-sm">
          <p className="text-[var(--sg-color-text-muted)]">
            Verified:{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              {card.verifiedAt ?? "—"}
            </span>
          </p>
          {card.media.sourceUrl ? (
            <ExternalLink
              href={card.media.sourceUrl}
              type="evidence-source"
              className="font-medium"
            >
              Open official source ↗
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function RequirementVerificationGaps({
  gaps,
  className,
}: {
  gaps: Array<{
    productSlug: string;
    productName: string;
    criterionName: string;
    note: string;
  }>;
  className?: string;
}) {
  if (gaps.length === 0) return null;
  return (
    <section
      id="verification-gaps"
      aria-labelledby="gaps-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="gaps-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        Still needs verification
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Incomplete evidence for specific criteria — not a claim that the product
        lacks support. Missing video is never treated as missing support.
      </p>
      <ul className="mt-5 space-y-3">
        {gaps.map((g) => (
          <li key={`${g.productSlug}:${g.criterionName}`}>
            <Card className="p-4">
              <p className="font-semibold text-[var(--sg-color-text)]">
                {g.productName}
              </p>
              <p className="mt-1 text-sm font-medium">{g.criterionName}</p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {g.note}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementVerifyInDemo({
  steps,
  exampleCard,
  demoChecklistHref,
  className,
}: {
  steps: string[];
  exampleCard: RequirementSeeSupportCard | null;
  demoChecklistHref: string;
  className?: string;
}) {
  if (steps.length === 0 && !exampleCard) return null;
  return (
    <section
      id="verify-demo"
      aria-labelledby="verify-demo-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="verify-demo-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        How to verify this requirement in a vendor demo
      </h2>
      {steps.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Ask the vendor to:
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </>
      ) : null}
      {exampleCard ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Watch an official example
          </h3>
          <div className="mt-3 max-w-xl">
            <RequirementVideoEvidenceCard card={exampleCard} />
          </div>
        </div>
      ) : null}
      <ButtonLink href={demoChecklistHref} variant="outline" className="mt-5">
        Add this requirement to my demo checklist
      </ButtonLink>
    </section>
  );
}

export function RequirementCompareAgainst({
  rows,
  criteria,
  compareHref,
  videoCriteriaLabels,
  className,
}: {
  rows: RequirementProductRow[];
  criteria: Array<{ id: string; name: string }>;
  compareHref: string | null;
  videoCriteriaLabels: string[];
  className?: string;
}) {
  if (rows.length < 2) return null;
  const cols = criteria.slice(0, 5);
  const products = rows.slice(0, 3);

  return (
    <section
      id="compare-requirement"
      aria-labelledby="compare-req-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="compare-req-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        Compare products against this requirement
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Structured evaluation — not media-driven. Video helps illustrate
        implementation; it does not determine who ranks higher.
      </p>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[560px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="px-4 py-3 text-left font-semibold">Criterion</th>
              {products.map((p) => (
                <th key={p.slug} className="px-3 py-3 text-center font-semibold">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((c) => (
              <tr
                key={c.id}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="px-4 py-3 font-medium">{c.name}</td>
                {products.map((p) => (
                  <td key={p.slug} className="px-3 py-3 text-center text-xs">
                    {fitStatusLabel(
                      p.criterionCells[c.id] ?? "insufficient-evidence",
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {videoCriteriaLabels.length > 0 ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Video evidence available for: {videoCriteriaLabels.join(" / ")}
        </p>
      ) : null}
      {compareHref ? (
        <ButtonLink href={compareHref} className="mt-4">
          Compare products →
        </ButtonLink>
      ) : null}
    </section>
  );
}

export function RequirementSideBySideVideos({
  left,
  right,
  interpretation,
  className,
}: {
  left: RequirementSeeSupportCard | null;
  right: RequirementSeeSupportCard | null;
  interpretation: string | null;
  className?: string;
}) {
  if (!left || !right) return null;
  return (
    <section
      id="side-by-side"
      aria-labelledby="side-by-side-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="side-by-side-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        See how they implement it
      </h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <RequirementVideoEvidenceCard card={left} />
        <RequirementVideoEvidenceCard card={right} />
      </div>
      {interpretation ? (
        <Card className="mt-4 p-4">
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

/** Compact deep-dive “See it in action” block. */
export function RequirementDeepDiveMedia({
  card,
}: {
  card: RequirementSeeSupportCard | null;
}) {
  const [open, setOpen] = useState(false);
  if (!card) return null;
  return (
    <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        See it in action
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          ▶ Play official {card.productName} example
        </button>
      ) : (
        <div className="mt-3">
          <OfficialProductVideo
            media={card.media}
            vendorName={card.productName}
            variant="compact"
            priority="low"
          />
          {card.whatThisShows.length > 0 ? (
            <ul className="mt-3 space-y-1 text-sm">
              {card.whatThisShows.slice(0, 4).map((line) => (
                <li key={line} className="flex gap-2">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
      <Link
        href="#requirement-evidence"
        className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        View all evidence →
      </Link>
    </div>
  );
}
