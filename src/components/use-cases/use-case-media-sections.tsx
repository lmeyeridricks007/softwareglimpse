"use client";

import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import {
  useCaseCategoryPlatformsLabel,
  useCaseCategoryRequirementsLabel,
} from "@/components/use-cases/use-case-depth-sections";
import type {
  UseCaseSeeInActionCard,
  WorkflowStepCoverage,
} from "@/services/product-media/use-case-page-media";

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

function CoverageRow({ row }: { row: WorkflowStepCoverage }) {
  const icon =
    row.status === "demonstrated" ? (
      <Check
        className="size-4 shrink-0 text-[var(--sg-color-success)]"
        aria-hidden
      />
    ) : row.status === "partial" ? (
      <span className="text-sm font-semibold text-[var(--sg-color-warning)]" aria-hidden>
        △
      </span>
    ) : (
      <Minus
        className="size-4 shrink-0 text-[var(--sg-color-text-muted)]"
        aria-hidden
      />
    );
  const statusLabel =
    row.status === "demonstrated"
      ? "Demonstrated"
      : row.status === "partial"
        ? "Partially shown"
        : "Not shown";
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-[var(--sg-color-text)]">
        {icon}
        {row.label}
      </span>
      <span className="text-xs text-[var(--sg-color-text-muted)]">
        {statusLabel}
      </span>
    </li>
  );
}

export function UseCaseVideoEvidenceCard({
  card,
}: {
  card: UseCaseSeeInActionCard;
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
                {card.focusLabel}
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

        {card.workflowCoverage.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Workflow coverage
            </p>
            <ul className="mt-2 space-y-1.5" aria-label="Workflow step coverage">
              {card.workflowCoverage.map((row) => (
                <CoverageRow key={row.stepId} row={row} />
              ))}
            </ul>
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              Coverage describes what the demo shows — not product support
              status.
            </p>
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
              This demonstration does not establish
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {card.whatNotEstablished.slice(0, 5).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.relatedCapabilities.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Related capabilities
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {card.relatedCapabilities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href ?? `/capabilities/${c.slug}/`}
                    className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-2.5 py-1 text-xs font-medium text-[var(--sg-color-primary)] hover:border-[var(--sg-color-primary)]"
                  >
                    {c.label}
                  </Link>
                </li>
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
              Open official source ↗
            </ExternalLink>
            <Link
              href={`/software/${card.productSlug}/#use-cases`}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How {card.productName} handles this →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Official vendor workflow demos for a Use Case page.
 * Omitted entirely when zero qualifying videos (no empty-state message).
 */
export function UseCaseSeeInAction({
  useCaseLabel,
  cards,
  evidenceHref = "#use-case-evidence",
  categorySlug = "crm",
  className,
}: {
  useCaseLabel: string;
  cards: UseCaseSeeInActionCard[];
  evidenceHref?: string;
  categorySlug?: string;
  className?: string;
}) {
  if (cards.length === 0) return null;
  const platformsLabel = useCaseCategoryPlatformsLabel(categorySlug);

  return (
    <section
      id="see-in-action"
      aria-labelledby="uc-see-in-action-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-see-in-action-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        See {useCaseLabel.toLowerCase()} in action
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Official product demonstrations can help show how different{" "}
        {platformsLabel} handle the {useCaseLabel.toLowerCase()} workflow.
        Absence of a video does not mean a product lacks support for this use
        case.
      </p>

      <ul className="mt-6 grid gap-5 md:grid-cols-1 lg:grid-cols-2">
        {cards.map((card) => (
          <li key={card.productSlug}>
            <UseCaseVideoEvidenceCard card={card} />
          </li>
        ))}
      </ul>

      <p className="mt-5 text-sm">
        <a
          href={evidenceHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View all workflow evidence →
        </a>
      </p>
    </section>
  );
}

export function UseCaseWorkflowComparison({
  useCaseLabel,
  cards,
  interpretation,
  compareHref,
  categorySlug = "crm",
  className,
}: {
  useCaseLabel: string;
  cards: UseCaseSeeInActionCard[];
  interpretation?: string | null;
  compareHref?: string | null;
  categorySlug?: string;
  className?: string;
}) {
  if (cards.length < 2) return null;
  const [a, b] = cards;
  if (!a || !b) return null;
  const platformsLabel = useCaseCategoryPlatformsLabel(categorySlug);

  const steps =
    a.workflowCoverage.length > 0
      ? a.workflowCoverage
      : b.workflowCoverage;

  return (
    <section
      id="compare-approaches"
      aria-labelledby="uc-compare-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-compare-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Compare how {platformsLabel} handle {useCaseLabel.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Side-by-side official demonstrations. Do not infer product quality from
        video production — use product assessments for fit.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {[a, b].map((card) => (
          <UseCaseVideoEvidenceCard key={card.productSlug} card={card} compact />
        ))}
      </div>

      {steps.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm">
            <caption className="sr-only">
              Workflow step coverage in {a.productName} and {b.productName}{" "}
              demos
            </caption>
            <thead>
              <tr className="border-b border-[var(--sg-color-border)] text-left">
                <th className="py-2 pr-3 font-semibold">Workflow step</th>
                <th className="py-2 px-3 font-semibold">{a.productName}</th>
                <th className="py-2 pl-3 font-semibold">{b.productName}</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => {
                const aStatus =
                  a.workflowCoverage.find((s) => s.stepId === step.stepId)
                    ?.status ?? "not-shown";
                const bStatus =
                  b.workflowCoverage.find((s) => s.stepId === step.stepId)
                    ?.status ?? "not-shown";
                return (
                  <tr
                    key={step.stepId}
                    className="border-b border-[var(--sg-color-border)]"
                  >
                    <th scope="row" className="py-2 pr-3 font-medium text-left">
                      {step.label}
                    </th>
                    <td className="py-2 px-3 text-[var(--sg-color-text-muted)]">
                      {aStatus === "demonstrated"
                        ? "Demonstrated"
                        : aStatus === "partial"
                          ? "Partially shown"
                          : "Not shown"}
                    </td>
                    <td className="py-2 pl-3 text-[var(--sg-color-text-muted)]">
                      {bStatus === "demonstrated"
                        ? "Demonstrated"
                        : bStatus === "partial"
                          ? "Partially shown"
                          : "Not shown"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {interpretation ? (
        <p className="mt-4 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
          {interpretation}
        </p>
      ) : (
        <p className="mt-4 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
          SoftwareGlimpse analysis of meaningful differences comes from
          structured product research — not from comparing demo production
          quality.
        </p>
      )}

      {compareHref ? (
        <p className="mt-4 text-sm">
          <Link
            href={compareHref}
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Compare {a.productName} vs {b.productName} →
          </Link>
        </p>
      ) : null}
    </section>
  );
}

export function UseCaseRequirementsBuilderCta({
  useCaseLabel,
  useCaseSlug,
  checklist,
  requirementsHref,
  finderHref,
  implementationHref,
  categorySlug = "crm",
  className,
}: {
  useCaseLabel: string;
  useCaseSlug: string;
  checklist: string[];
  requirementsHref: string;
  finderHref: string;
  implementationHref?: string | null;
  categorySlug?: string;
  className?: string;
}) {
  const reqLabel = useCaseCategoryRequirementsLabel(categorySlug);
  const isCrm = reqLabel === "CRM";

  return (
    <section
      id="build-requirements"
      aria-labelledby="uc-build-req-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-build-req-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Turn this use case into {reqLabel} requirements
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Based on the {useCaseLabel.toLowerCase()} workflow, buyers commonly
        evaluate the checklist below. Nothing is written to your decision
        profile until you confirm in the tool.
      </p>
      {checklist.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-[var(--sg-color-text)]"
            >
              <span aria-hidden className="text-[var(--sg-color-text-muted)]">
                □
              </span>
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={requirementsHref}
          className="inline-flex rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          {isCrm ? "Add to my CRM requirements" : "Add to my requirements"}
        </Link>
        <Link
          href={finderHref}
          className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 py-2 text-sm font-semibold text-[var(--sg-color-primary)]"
        >
          {isCrm
            ? "Find CRMs for this use case"
            : `Find ${reqLabel} software for this use case`}
        </Link>
        {implementationHref ? (
          <Link
            href={implementationHref}
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 py-2 text-sm font-semibold text-[var(--sg-color-primary)]"
          >
            Preview implementation plan
          </Link>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Context: useCase={useCaseSlug} — tools apply this only after your
        confirmation.
      </p>
    </section>
  );
}
