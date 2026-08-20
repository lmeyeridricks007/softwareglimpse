"use client";

import type { McComputeResult } from "@/services/migration-cost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  McComplexityBadge,
  McConfidenceBadge,
  McMoney,
} from "./mc-helpers";

type Props = {
  result: McComputeResult;
  projectName: string;
  className?: string;
  onJumpToResults?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export function McLiveSummary({
  result,
  projectName,
  className,
  onJumpToResults,
  collapsed,
  onToggleCollapsed,
}: Props) {
  const incomplete = result.status === "incomplete";

  return (
    <Card
      className={cn("sticky top-4", className)}
      aria-labelledby="mc-live-summary-heading"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="mc-live-summary-heading"
              className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
            >
              Migration cost estimate
            </h2>
            <span className="relative flex size-2" aria-hidden title="Live">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--sg-color-success)] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--sg-color-success)]" />
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-[var(--sg-color-text-muted)]">
            {projectName}
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
            <div className="mt-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/50 px-3 py-2 text-xs">
              Enter quotes, rates or hours × loaded cost to model migration cost.
            </div>
          ) : null}

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Expected modelled cost
          </p>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
            <McMoney
              minor={result.expectedTotalMinor}
              currency={result.currency}
              fallback="Pending"
            />
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <McConfidenceBadge confidence={result.confidence} />
            <McComplexityBadge band={result.complexity.overall} />
          </div>
          {result.coveragePercent != null ? (
            <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
              Known / estimated coverage: {result.coveragePercent}%
              {result.materialUnknownCount > 0
                ? ` · ${result.materialUnknownCount} material unknown${result.materialUnknownCount === 1 ? "" : "s"}`
                : ""}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-2">
            {(
              [
                ["External", result.externalMinor],
                ["Internal", result.internalLabourMinor],
                ["Tooling", result.toolingMinor],
                ["Contingency", result.contingencyMinor],
              ] as const
            ).map(([label, minor]) => (
              <div
                key={label}
                className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-2.5 py-2"
              >
                <p className="text-[10px] text-[var(--sg-color-text-muted)]">
                  {label}
                </p>
                <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                  <McMoney minor={minor} currency={result.currency} />
                </p>
              </div>
            ))}
          </div>

          {result.drivers.length > 0 ? (
            <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Key cost drivers
              </p>
              <ol className="mt-2 space-y-1.5 text-xs">
                {result.drivers.slice(0, 4).map((d, i) => (
                  <li key={d.id} className="flex justify-between gap-2">
                    <span className="text-[var(--sg-color-text)]">
                      {i + 1}. {d.label}
                    </span>
                    <Badge variant="neutral">{d.sharePercent}%</Badge>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {onJumpToResults ? (
            <Button
              type="button"
              variant="secondary"
              className="mt-4 w-full"
              onClick={onJumpToResults}
            >
              View full results
            </Button>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}

export function McMobileSummaryBar({
  result,
  onOpen,
}: {
  result: McComputeResult;
  onOpen: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 shadow-[var(--sg-shadow-lg)] lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Expected modelled cost
          </p>
          <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
            <McMoney
              minor={result.expectedTotalMinor}
              currency={result.currency}
              fallback="Pending"
            />
          </p>
        </div>
        <span className="text-sm font-medium text-[var(--sg-color-primary)]">
          Details
        </span>
      </button>
    </div>
  );
}
