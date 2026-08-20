"use client";

import { formatMoney, type CurrencyCode } from "@/domain";
import type { RoiComputeResult } from "@/services/roi";
import { formatPaybackMonths, formatRoiPercent } from "@/services/roi";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Props = {
  result: RoiComputeResult;
  analysisName: string;
  className?: string;
  onJumpToResults?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

function Money({
  minor,
  currency,
}: {
  minor: number | null | undefined;
  currency: string;
}) {
  if (minor == null) {
    return <span className="text-[var(--sg-color-text-muted)]">Pending</span>;
  }
  return (
    <span className="tabular-nums">
      {formatMoney(
        { amountMinor: minor, currency: currency as CurrencyCode },
        { maximumFractionDigits: 0 },
      )}
    </span>
  );
}

export function RoiLiveSummary({
  result,
  analysisName,
  className,
  onJumpToResults,
  collapsed,
  onToggleCollapsed,
}: Props) {
  const incomplete = result.status === "incomplete";
  const materialMissing = result.unknowns.filter((u) => u.material).length;

  return (
    <Card
      className={cn("sticky top-4", className)}
      aria-labelledby="roi-live-summary-heading"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="roi-live-summary-heading"
              className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
            >
              Live Summary ({result.scenario} scenario)
            </h2>
            <span
              className="relative flex size-2"
              aria-hidden
              title="Updates as you edit"
            >
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--sg-color-success)] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--sg-color-success)]" />
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-[var(--sg-color-text-muted)]">
            {analysisName}
          </p>
        </div>
        {onToggleCollapsed ? (
          <button
            type="button"
            className="text-xs font-medium text-[var(--sg-color-primary)] lg:hidden"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
        ) : null}
      </div>

      {!collapsed ? (
        <>
          {incomplete ? (
            <div className="mt-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/50 px-3 py-2 text-xs text-[var(--sg-color-text)]">
              ROI pending — {materialMissing} material cost input
              {materialMissing === 1 ? "" : "s"} missing
            </div>
          ) : null}

          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Year 1 investment</dt>
              <dd className="font-semibold text-[var(--sg-color-navy)]">
                <Money minor={result.year1InvestmentMinor} currency={result.currency} />
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Annual benefit</dt>
              <dd className="font-semibold text-[var(--sg-color-success)]">
                <Money minor={result.annualBenefitMinor} currency={result.currency} />
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">3-year net value</dt>
              <dd
                className={cn(
                  "font-semibold",
                  (result.netThreeYearValueMinor ?? 0) < 0
                    ? "text-[var(--sg-color-danger)]"
                    : "text-[var(--sg-color-navy)]",
                )}
              >
                <Money
                  minor={result.netThreeYearValueMinor}
                  currency={result.currency}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">
                {incomplete ? "ROI" : "Provisional ROI"}
              </dt>
              <dd className="font-semibold tabular-nums text-[var(--sg-color-navy)]">
                {formatRoiPercent(result.roiPercent)}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Payback</dt>
              <dd className="tabular-nums">
                {formatPaybackMonths(
                  result.paybackMonths,
                  result.paybackApproximate,
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Confidence</dt>
              <dd>
                <Badge
                  variant={
                    result.assessment.benefitConfidence === "high"
                      ? "success"
                      : result.assessment.benefitConfidence === "medium"
                        ? "warning"
                        : "danger"
                  }
                >
                  {result.assessment.benefitConfidence}
                </Badge>
              </dd>
            </div>
          </dl>

          {/* Confidence mix */}
          {result.annualBenefitMinor > 0 ? (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Benefit quality mix
              </p>
              <div
                className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                role="img"
                aria-label={result.benefitByType
                  .filter((t) => t.sharePercent > 0)
                  .map((t) => `${t.assumptionType} ${t.sharePercent}%`)
                  .join(", ")}
              >
                {result.benefitByType.map((t) => {
                  if (t.sharePercent <= 0) return null;
                  const color =
                    t.assumptionType === "verified"
                      ? "bg-[var(--sg-color-success)]"
                      : t.assumptionType === "estimated"
                        ? "bg-[var(--sg-color-primary)]"
                        : t.assumptionType === "scenario"
                          ? "bg-violet-500"
                          : "bg-[var(--sg-color-border)]";
                  return (
                    <span
                      key={t.assumptionType}
                      className={color}
                      style={{ width: `${t.sharePercent}%` }}
                      title={`${t.assumptionType} ${t.sharePercent}%`}
                    />
                  );
                })}
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-[var(--sg-color-text-muted)]">
                {result.benefitByType
                  .filter((t) => t.sharePercent > 0)
                  .map((t) => (
                    <li key={t.assumptionType}>
                      {t.assumptionType}: {t.sharePercent}%
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 space-y-2 border-t border-[var(--sg-color-border)] pt-4">
            {onJumpToResults ? (
              <Button type="button" className="w-full" onClick={onJumpToResults}>
                View results
              </Button>
            ) : null}
            <ButtonLink
              href="/resources/crm-business-case-template/"
              variant="secondary"
              className="w-full"
            >
              Use in Business Case
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-cost-calculator/"
              variant="ghost"
              className="w-full"
            >
              Compare CRM Costs →
            </ButtonLink>
          </div>
        </>
      ) : null}
    </Card>
  );
}

export function RoiMobileSummaryBar({
  result,
  onOpen,
}: {
  result: RoiComputeResult;
  onOpen: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 p-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/50 px-4 py-3 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Live ROI preview
          </p>
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
            {formatRoiPercent(result.roiPercent)} ·{" "}
            {formatMoney(
              {
                amountMinor: result.netThreeYearValueMinor ?? 0,
                currency: result.currency as CurrencyCode,
              },
              { maximumFractionDigits: 0 },
            )}{" "}
            net
          </p>
        </div>
        <span className="text-xs font-medium text-[var(--sg-color-primary)]">
          Details
        </span>
      </button>
    </div>
  );
}
