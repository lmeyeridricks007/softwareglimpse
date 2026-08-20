"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { CrmRfpSession, RfpMode } from "@/domain";
import {
  READINESS_LABELS,
  countByPriority,
  assessRfpReadiness,
} from "@/services/rfp-builder";

type Props = {
  session: CrmRfpSession;
  className?: string;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onReview?: () => void;
};

export function RfpLiveSummary({
  session,
  className,
  collapsed,
  onToggleCollapsed,
  onReview,
}: Props) {
  const mode: RfpMode | undefined = session.mode;
  const draft = session.draft;
  const counts = countByPriority(draft.requirements);
  const readiness = assessRfpReadiness(draft, mode);
  const securityCount = draft.securityQuestions.filter((q) => q.required).length;
  const users =
    draft.users.currentUsers ??
    draft.pricingAssumptions.usersYear1 ??
    null;

  const readinessColor =
    readiness.status === "ready"
      ? "text-[var(--sg-color-success)]"
      : readiness.status === "ready-with-gaps"
        ? "text-[var(--sg-color-warning)]"
        : "text-[var(--sg-color-danger)]";

  return (
    <Card
      className={cn("sticky top-4", className)}
      aria-labelledby="rfp-live-summary-heading"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2
            id="rfp-live-summary-heading"
            className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
          >
            RFP summary
          </h2>
          <p className="mt-1 text-xs font-medium text-[var(--sg-color-navy)]">
            {mode === "formal-rfp"
              ? "Formal RFP"
              : mode === "vendor-brief"
                ? "Vendor Brief"
                : "Choose a mode"}
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
              <dt className="text-[var(--sg-color-text-muted)]">Project</dt>
              <dd className="truncate font-medium text-[var(--sg-color-navy)]">
                {draft.project.projectName || "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Vendors</dt>
              <dd className="tabular-nums font-medium">
                {draft.project.vendorsExpected ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Users</dt>
              <dd className="tabular-nums font-medium">{users ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Requirements</dt>
              <dd className="text-right font-medium">
                <span className="tabular-nums">{counts.total}</span>
                <span className="mt-0.5 block text-[10px] font-normal text-[var(--sg-color-text-muted)]">
                  {counts.mustHave} must-have
                </span>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Integrations</dt>
              <dd className="tabular-nums font-medium">
                {draft.integrations.length}
              </dd>
            </div>
            {mode === "formal-rfp" ? (
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--sg-color-text-muted)]">Security</dt>
                <dd className="tabular-nums font-medium">{securityCount}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Response date</dt>
              <dd className="font-medium">
                {draft.project.responseDeadline ||
                  draft.responseRules.responseDeadline ||
                  "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--sg-color-text-muted)]">Readiness</dt>
              <dd className={cn("font-semibold", readinessColor)}>
                {READINESS_LABELS[readiness.status]}
              </dd>
            </div>
          </dl>

          {onReview ? (
            <Button className="mt-4 w-full" size="sm" onClick={onReview}>
              Review RFP
            </Button>
          ) : null}

          <p className="mt-3 text-[10px] leading-relaxed text-[var(--sg-color-text-muted)]">
            After generation you can export PDF, Excel or Markdown and import
            responses for scoring in Vendor Scorecard.
          </p>
        </>
      ) : null}
    </Card>
  );
}
