"use client";

import type { CrmImplementationPlan, PlanPhase } from "@/domain";
import { cn } from "@/lib/cn";
import {
  PHASE_VISUAL,
  formatDurationWeeks,
  formatWeekRange,
} from "./phase-visuals";

function phaseTaskStats(plan: CrmImplementationPlan, phaseId: PlanPhase["id"]) {
  const tasks = plan.tasks.filter((t) => t.phaseId === phaseId);
  const done = tasks.filter((t) => t.status === "complete").length;
  return { total: tasks.length, done };
}

function isParallelWithPeers(
  phase: PlanPhase,
  phases: PlanPhase[],
): boolean {
  return phases.some((other) => {
    if (other.id === phase.id || !other.included) return false;
    const aStart = phase.startWeek ?? 0;
    const aEnd = phase.endWeek ?? aStart;
    const bStart = other.startWeek ?? 0;
    const bEnd = other.endWeek ?? bStart;
    return aStart <= bEnd && bStart <= aEnd;
  });
}

type Props = {
  plan: CrmImplementationPlan;
  onSelectPhase?: (phaseId: PlanPhase["id"]) => void;
};

/**
 * Colored phase overview cards under the Gantt — shows week range,
 * duration, task progress, and parallel timing.
 */
export function PhaseOverviewCards({ plan, onSelectPhase }: Props) {
  const phases = plan.phases.filter((p) => p.included);

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Implementation phases
          </h3>
          <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
            Colored by phase · week ranges reflect parallel work where planned
          </p>
        </div>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {phases.map((phase, i) => {
          const visual = PHASE_VISUAL[phase.id];
          const { total, done } = phaseTaskStats(plan, phase.id);
          const parallel = isParallelWithPeers(phase, phases);
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          const interactive = Boolean(onSelectPhase);

          const body = (
            <>
              <div
                className={cn("absolute inset-y-0 left-0 w-1 rounded-l-[var(--sg-radius-md)]", visual.bar)}
                aria-hidden
              />
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    visual.number,
                  )}
                >
                  {i + 1}
                </span>
                {parallel ? (
                  <span
                    className={cn(
                      "rounded-[var(--sg-radius-pill)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      visual.chip,
                    )}
                  >
                    Parallel
                  </span>
                ) : null}
              </div>

              <p className="mt-3 font-semibold leading-snug text-[var(--sg-color-navy)]">
                {phase.name}
              </p>

              <p className="mt-1 text-xs font-medium text-[var(--sg-color-text)]">
                {formatWeekRange(phase.startWeek, phase.endWeek)}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--sg-color-text-muted)]">
                ≈ {formatDurationWeeks(phase.durationWeeks)}
                {phase.rationale ? ` · ${phase.rationale}` : ""}
              </p>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px] text-[var(--sg-color-text-muted)]">
                  <span>
                    {done}/{total} tasks
                  </span>
                  <span>{progress}%</span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${phase.name} task progress`}
                >
                  <div
                    className={cn("h-full rounded-full transition-all", visual.bar)}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          );

          const className = cn(
            "relative overflow-hidden rounded-[var(--sg-radius-md)] border py-3 pr-3 pl-4 text-left shadow-[var(--sg-shadow-sm)] transition",
            visual.accentBorder,
            visual.accentBg,
            interactive &&
              "cursor-pointer hover:shadow-[var(--sg-shadow-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
          );

          return (
            <li key={phase.id}>
              {interactive ? (
                <button
                  type="button"
                  className={cn(className, "w-full")}
                  onClick={() => onSelectPhase?.(phase.id)}
                >
                  {body}
                </button>
              ) : (
                <div className={className}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
