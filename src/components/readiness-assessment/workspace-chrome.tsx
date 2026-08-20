"use client";

import { Check, Circle } from "lucide-react";
import type { CrmReadinessSession } from "@/domain";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { READINESS_DIMENSIONS, type ReadinessDimensionDef } from "@/services/readiness-assessment/catalog";
import type { AssessCrmReadinessResult } from "@/services/readiness-assessment/score";
import { scoreBandLabel } from "@/services/readiness-assessment/score";

type Props = {
  session: CrmReadinessSession;
  dimensionIndex: number;
  completedDims: boolean[];
  minutesRemaining: number;
  provisional: AssessCrmReadinessResult | null;
  onSelectDimension: (index: number) => void;
  onRestart: () => void;
  children: React.ReactNode;
  /** Defaults to CRM catalog; SI readiness passes SI dimensions. */
  dimensions?: ReadinessDimensionDef[];
  productNoun?: string;
};

export function WorkspaceChrome({
  session,
  dimensionIndex,
  completedDims,
  minutesRemaining,
  provisional,
  onSelectDimension,
  onRestart,
  children,
  dimensions = READINESS_DIMENSIONS,
  productNoun = "CRM",
}: Props) {
  const progress = Math.round(
    ((dimensionIndex + (completedDims[dimensionIndex] ? 1 : 0.35)) /
      dimensions.length) *
      100,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Assessment progress
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--sg-color-navy)]">
              {Math.min(100, progress)}% complete
            </p>
            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
              role="progressbar"
              aria-valuenow={Math.min(100, progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Assessment progress"
            >
              <div
                className="h-full rounded-full bg-[var(--sg-color-primary)]"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          <nav aria-label="Assessment dimensions">
            <ol className="space-y-1">
              {dimensions.map((dim, i) => {
                const done = completedDims[i];
                const current = i === dimensionIndex;
                return (
                  <li key={dim.id}>
                    <button
                      type="button"
                      onClick={() => onSelectDimension(i)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-[var(--sg-radius-md)] px-2 py-1.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]",
                        current
                          ? "bg-[var(--sg-color-primary-soft)] font-medium text-[var(--sg-color-navy)]"
                          : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)]",
                      )}
                    >
                      {done ? (
                        <Check
                          className="size-4 shrink-0 text-[var(--sg-color-success)]"
                          aria-hidden
                        />
                      ) : (
                        <Circle
                          className="size-4 shrink-0 opacity-40"
                          aria-hidden
                        />
                      )}
                      <span className="min-w-0 truncate">
                        <span className="mr-1 text-xs opacity-60">{i + 1}.</span>
                        {dim.shortTitle}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-3 text-xs text-[var(--sg-color-text-muted)]">
            <p className="font-semibold text-[var(--sg-color-navy)]">
              Why assess readiness?
            </p>
            <p className="mt-1">
              Wanting {productNoun === "CRM" ? "a CRM" : productNoun} is not the
              same as being ready to select or implement one.
            </p>
            <a
              href="#how-scoring-works"
              className="mt-2 inline-block font-medium text-[var(--sg-color-primary)]"
            >
              Learn more
            </a>
          </div>
        </div>
      </aside>

      <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Step {dimensionIndex + 1}/{dimensions.length} · ~
            {minutesRemaining} min left
          </p>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            Restart
          </Button>
        </div>
        {children}
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Live indicators
            </p>
            {provisional ? (
              <ul className="mt-3 space-y-3 text-sm">
                <li>
                  <p className="text-[var(--sg-color-text-muted)]">
                    Selection (provisional)
                  </p>
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {provisional.selectionScore} ·{" "}
                    {scoreBandLabel(provisional.selectionScore)}
                  </p>
                </li>
                <li>
                  <p className="text-[var(--sg-color-text-muted)]">
                    Implementation (provisional)
                  </p>
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {provisional.implementationScore} ·{" "}
                    {scoreBandLabel(provisional.implementationScore)}
                  </p>
                </li>
              </ul>
            ) : (
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Scores appear after a few answers.
              </p>
            )}
            <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
              ~{minutesRemaining} minutes remaining
            </p>
            {session.context.projectName ? (
              <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                Project: {session.context.projectName}
              </p>
            ) : null}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={onRestart}>
            Restart assessment
          </Button>
        </div>
      </aside>
    </div>
  );
}
