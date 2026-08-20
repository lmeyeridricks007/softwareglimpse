"use client";

import Link from "next/link";
import type { CrmDemoChecklistDraft } from "@/domain";
import type { DemoQualityReport } from "@/services/demo-checklist-builder/quality";
import type { RequirementsCoverage } from "@/services/demo-checklist-builder/coverage";
import {
  buildTimeBreakdown,
  countDemoTasks,
  countMustHaveChecks,
  estimateAgendaMinutes,
  includedScenarios,
  resolveDemoDurationMinutes,
} from "@/services/demo-checklist-builder";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  draft: CrmDemoChecklistDraft;
  quality: DemoQualityReport;
  coverage: RequirementsCoverage;
  className?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onReview?: () => void;
};

const READINESS_LABELS: Record<DemoQualityReport["status"], string> = {
  good: "Good",
  "needs-work": "Needs work",
  incomplete: "Incomplete",
};

function readinessVariant(
  status: DemoQualityReport["status"],
): "success" | "warning" | "danger" {
  if (status === "good") return "success";
  if (status === "needs-work") return "warning";
  return "danger";
}

export function DemoLiveSummary({
  draft,
  quality,
  coverage,
  className,
  collapsed,
  onToggleCollapsed,
  onReview,
}: Props) {
  const setup = draft.setup;
  const duration = resolveDemoDurationMinutes(setup);
  const estimated = estimateAgendaMinutes(draft);
  const scenarios = includedScenarios(draft).length;
  const tasks = countDemoTasks(draft);
  const mustHaves = countMustHaveChecks(draft);
  const breakdown = buildTimeBreakdown(draft);

  const nextSteps = [
    scenarios === 0 && "Add at least one demo scenario",
    quality.mustHaveCoveragePct < 100 && "Cover remaining must-have requirements",
    estimated > duration && "Trim agenda to fit available time",
    quality.status === "good" && "Review and generate checklist",
  ].filter(Boolean) as string[];

  return (
    <Card
      className={cn("sticky top-4", className)}
      aria-labelledby="demo-live-summary-heading"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            id="demo-live-summary-heading"
            className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
          >
            Demo plan summary
          </h2>
          <p className="mt-1 truncate text-xs font-medium text-[var(--sg-color-navy)]">
            {setup.projectName || "Untitled project"}
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
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Vendors</dt>
              <dd className="tabular-nums font-medium">
                {setup.expectedVendors ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Duration</dt>
              <dd className="tabular-nums font-medium">{duration} min</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Estimated time</dt>
              <dd
                className={cn(
                  "tabular-nums font-medium",
                  estimated > duration && "text-[var(--sg-color-warning)]",
                )}
              >
                {estimated} min
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Readiness</dt>
              <dd>
                <Badge variant={readinessVariant(quality.status)}>
                  {READINESS_LABELS[quality.status]}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Requirements</dt>
              <dd className="tabular-nums font-medium">
                {coverage.overallPct}%
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Must-haves</dt>
              <dd className="tabular-nums font-medium">
                {quality.mustHaveCoveragePct}%
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Scenarios</dt>
              <dd className="tabular-nums font-medium">{scenarios}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Demo tasks</dt>
              <dd className="tabular-nums font-medium">{tasks}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Must-have checks</dt>
              <dd className="tabular-nums font-medium">{mustHaves}</dd>
            </div>
          </dl>

          {breakdown.length > 0 ? (
            <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Time breakdown
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                {breakdown.map((row) => (
                  <li
                    key={row.label}
                    className="flex justify-between gap-2 text-[var(--sg-color-text-muted)]"
                  >
                    <span>{row.label}</span>
                    <span className="tabular-nums font-medium text-[var(--sg-color-navy)]">
                      {row.minutes} min
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {nextSteps.length > 0 ? (
            <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Next steps
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-[var(--sg-color-text-muted)]">
                {nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {onReview ? (
            <Button className="mt-4 w-full" size="sm" onClick={onReview}>
              Review checklist
            </Button>
          ) : null}

          <div className="mt-3 space-y-2">
            <ButtonLink
              href="/tools/crm-vendor-scorecard/"
              variant="secondary"
              className="w-full"
              size="sm"
            >
              Go to Vendor Scorecard
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-rfp-builder/"
              variant="ghost"
              className="w-full"
              size="sm"
            >
              Back to RFP Builder
            </ButtonLink>
            <Link
              href="/tools/crm-requirements-builder/"
              className="block text-center text-xs font-medium text-[var(--sg-color-primary)] underline"
            >
              CRM Requirements Builder
            </Link>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-[var(--sg-color-text-muted)]">
            Same script for every vendor. Vendor stated ≠ demonstrated.
          </p>
        </>
      ) : null}
    </Card>
  );
}

export function DemoMobileSummaryBar({
  draft,
  quality,
  onOpen,
}: {
  draft: CrmDemoChecklistDraft;
  quality: DemoQualityReport;
  onOpen: () => void;
}) {
  const estimated = estimateAgendaMinutes(draft);
  const duration = resolveDemoDurationMinutes(draft.setup);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 p-3 backdrop-blur lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full items-center justify-between gap-3 rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/50 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Demo plan
          </p>
          <p className="truncate text-sm font-semibold text-[var(--sg-color-navy)]">
            {draft.setup.projectName || "Untitled"} · {estimated}/{duration} min
          </p>
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            {READINESS_LABELS[quality.status]} · {quality.mustHaveCoveragePct}% must-haves
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--sg-color-primary)]">
          Details
        </span>
      </button>
    </div>
  );
}
