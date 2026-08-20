"use client";

import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/domain";
import type { PlanSelectorAnalysis } from "@/services/plan-selector";

type Props = {
  analysis: PlanSelectorAnalysis | null;
  productName?: string;
  mustHaveCount: number;
  className?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export function PlanSelectorLiveSummary({
  analysis,
  productName,
  mustHaveCount,
  className,
  collapsed,
  onToggleCollapsed,
}: Props) {
  const recommended = analysis?.recommendedPlan;
  const cost = analysis?.pricingNow;

  return (
    <Card
      className={cn("sticky top-4", className)}
      aria-labelledby="plan-analysis-heading"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            id="plan-analysis-heading"
            className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
          >
            Your plan analysis
          </h2>
          <p className="mt-1 text-xs font-medium text-[var(--sg-color-navy)]">
            {productName ?? "Select a CRM"}
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
          {recommended && analysis?.kind === "recommended" ? (
            <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-success)]/40 bg-[var(--sg-color-success)]/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                Recommended
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
                {recommended.name}
              </p>
              {cost ? (
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {formatMoney(cost.monthlyEquivalent, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  / mo est.
                </p>
              ) : null}
              <ul className="mt-2 space-y-1 text-xs text-[var(--sg-color-text-muted)]">
                <li className="flex gap-1.5">
                  <Check
                    className="size-3.5 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  Meets all {mustHaveCount} must-have
                  {mustHaveCount === 1 ? "" : "s"}
                </li>
                <li className="flex gap-1.5">
                  <Check
                    className="size-3.5 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  Lowest plan that qualifies
                </li>
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
              {analysis?.explanation ??
                "Answer the steps to see the lowest qualifying plan."}
            </p>
          )}

          {analysis && analysis.planLadder.length > 0 ? (
            <ol className="mt-4 space-y-2" aria-label="Plan ladder">
              {analysis.planLadder.map((entry) => (
                <li
                  key={entry.plan.slug}
                  className={cn(
                    "flex items-start gap-2 rounded-[var(--sg-radius-md)] px-2 py-1.5 text-sm",
                    entry.status === "recommended" &&
                      "bg-[var(--sg-color-success)]/5",
                  )}
                >
                  {entry.status === "failed" ? (
                    <X
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                      aria-label="Missing requirements"
                    />
                  ) : entry.status === "recommended" ? (
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                      aria-label="Recommended"
                    />
                  ) : (
                    <span
                      className="mt-0.5 size-4 shrink-0 rounded-full border border-[var(--sg-color-border)]"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--sg-color-navy)]">
                      {entry.plan.name}
                    </p>
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      {entry.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          {analysis?.pricingNow && analysis.pricingGrowth ? (
            <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3 text-xs">
              <p className="font-semibold text-[var(--sg-color-navy)]">
                Estimated cost
              </p>
              <dl className="mt-2 space-y-1 text-[var(--sg-color-text-muted)]">
                <div className="flex justify-between gap-2">
                  <dt>Now</dt>
                  <dd className="tabular-nums font-medium text-[var(--sg-color-navy)]">
                    {formatMoney(analysis.pricingNow.monthlyEquivalent, {
                      maximumFractionDigits: 0,
                    })}
                    /mo
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>In 12 months</dt>
                  <dd className="tabular-nums font-medium text-[var(--sg-color-navy)]">
                    {formatMoney(analysis.pricingGrowth.monthlyEquivalent, {
                      maximumFractionDigits: 0,
                    })}
                    /mo
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}
