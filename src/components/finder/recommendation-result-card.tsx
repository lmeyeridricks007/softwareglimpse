"use client";

import Link from "next/link";
import { AlertTriangle, Check } from "lucide-react";
import type { FinderRecommendationResult } from "@/domain";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "./confidence-badge";
import { FitBreakdownBars } from "./fit-breakdown-bars";
import { trackAffiliateClick } from "@/analytics/affiliate-click";
import { cn } from "@/lib/cn";

type Props = {
  result: FinderRecommendationResult;
  rank: number;
  selected: boolean;
  onToggleSelect: (slug: string) => void;
  onResultClick: (slug: string, action: string) => void;
  selectable: boolean;
  logo?: { src: string; alt: string } | null;
  requiredCount?: number;
  matchedRequiredCount?: number;
  visitCta?: {
    href: string;
    isAffiliate: boolean;
    rel: string[];
    label: string;
  };
};

function fitLabel(score: number): string {
  if (score >= 90) return "Excellent match";
  if (score >= 80) return "Strong match";
  if (score >= 70) return "Good match";
  if (score >= 55) return "Partial match";
  return "Limited match";
}

export function RecommendationResultCard({
  result,
  rank,
  selected,
  onToggleSelect,
  onResultClick,
  selectable,
  logo,
  requiredCount,
  matchedRequiredCount,
  visitCta,
}: Props) {
  const reviewHref = `/software/${result.productSlug}/`;
  const positiveReasons = result.reasons.filter((r) => r.positive).slice(0, 5);
  const tradeoffs = result.tradeoffs.slice(0, 4);

  return (
    <Card as="article" className="overflow-hidden p-0">
      <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/60 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-xs font-bold text-white">
              #{rank}
            </span>
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-white text-xs font-bold text-[var(--sg-color-text-muted)]">
                {logo?.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logo.src}
                    alt=""
                    width={44}
                    height={44}
                    className="size-full object-contain p-1"
                  />
                ) : (
                  result.name.slice(0, 2).toUpperCase()
                )}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
                    {result.name}
                  </h3>
                  {result.labels?.map((label) => (
                    <Badge key={label} variant="primary">
                      {label}
                    </Badge>
                  ))}
                </div>
                <p className="mt-1 text-sm font-medium text-[var(--sg-color-success)]">
                  {fitLabel(result.matchScore)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold tabular-nums text-[var(--sg-color-primary)]">
                {Math.round(result.matchScore)}%
              </p>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Fit
              </p>
            </div>
            <ConfidenceBadge confidence={result.confidence} compact />
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          {positiveReasons.length > 0 ? (
            <section aria-label="Why it matches">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
                Why it matches you
              </h4>
              <ul className="mt-2 space-y-1.5">
                {positiveReasons.map((reason) => (
                  <li
                    key={`${reason.code}-${reason.text}`}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-hidden
                    />
                    {reason.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {tradeoffs.length > 0 ? (
            <section aria-label="Trade-offs">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
                Trade-offs
              </h4>
              <ul className="mt-2 space-y-1.5">
                {tradeoffs.map((item) => (
                  <li
                    key={`${item.code}-${item.text}`}
                    className="flex items-start gap-2 text-sm text-[var(--sg-color-text)]"
                  >
                    <AlertTriangle
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                      aria-hidden
                    />
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {typeof requiredCount === "number" &&
          typeof matchedRequiredCount === "number" &&
          requiredCount > 0 ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Your requirements{" "}
              <span className="font-semibold text-[var(--sg-color-text)]">
                {matchedRequiredCount} / {requiredCount} matched
              </span>
            </p>
          ) : null}

          {result.unknowns.length > 0 ? (
            <p className="text-xs text-[var(--sg-color-text-muted)]">
              Limited evidence on: {result.unknowns.slice(0, 3).join("; ")}
              {result.unknowns.length > 3 ? "…" : ""}
            </p>
          ) : null}

          {(result.estimatedMonthlyTotal != null || result.budgetFit) && (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              {result.estimatedMonthlyTotal != null
                ? `Estimated ~${result.estimatedCurrency ?? "EUR"} ${Math.round(result.estimatedMonthlyTotal)}/month for your seat count`
                : null}
              {result.estimatedMonthlyTotal != null && result.budgetFit
                ? " · "
                : null}
              {result.budgetFit ? `Budget fit: ${result.budgetFit}` : null}
            </p>
          )}
        </div>

        <FitBreakdownBars breakdown={result.breakdown} />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--sg-color-border)] px-5 py-4 sm:px-6">
        <Link
          href={reviewHref}
          onClick={() => onResultClick(result.productSlug, "review")}
          className="inline-flex min-h-11 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-primary-fg)]"
        >
          Read {result.name} review
        </Link>
        {visitCta ? (
          <a
            href={visitCta.href}
            rel={visitCta.rel.join(" ")}
            target="_blank"
            onClick={() => {
              onResultClick(result.productSlug, "visit");
              trackAffiliateClick({
                software_id: result.productSlug,
                vendor: result.name,
                placement: "finder-result",
                page_type: "finder",
                destination_url: visitCta.href,
                is_affiliate: visitCta.isAffiliate,
              });
            }}
            className="inline-flex min-h-11 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] px-4 py-2.5 text-sm font-medium"
          >
            Visit {result.name} →
          </a>
        ) : null}
        {selectable ? (
          <label
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--sg-radius-md)] border px-3 text-sm",
              selected
                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                : "border-[var(--sg-color-border)]",
            )}
          >
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect(result.productSlug)}
              className="size-4 accent-[var(--sg-color-primary)]"
            />
            Compare
          </label>
        ) : null}
      </div>
    </Card>
  );
}
