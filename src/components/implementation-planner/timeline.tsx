"use client";

import type { CrmImplementationPlan, PlanPhase } from "@/domain";
import { cn } from "@/lib/cn";
import {
  PHASE_VISUAL,
  formatDurationWeeks,
  formatWeekRange,
} from "./phase-visuals";

type Props = {
  plan: CrmImplementationPlan;
  view?: "gantt" | "list";
};

function statusLabel(phase: PlanPhase, taskStatuses: string[]): string {
  if (
    phase.status === "complete" ||
    (taskStatuses.length > 0 &&
      taskStatuses.every((s) => s === "complete" || s === "not-applicable"))
  ) {
    return "Complete";
  }
  if (
    phase.status === "in-progress" ||
    taskStatuses.some((s) => s === "in-progress" || s === "complete")
  ) {
    return "In progress";
  }
  return "Not started";
}

function phaseBarClass(phase: PlanPhase, taskStatuses: string[]): string {
  const palette = PHASE_VISUAL[phase.id];
  const complete =
    phase.status === "complete" ||
    (taskStatuses.length > 0 &&
      taskStatuses.every((s) => s === "complete" || s === "not-applicable"));
  if (complete) {
    return "bg-emerald-500 ring-1 ring-emerald-700/30";
  }
  const inProgress =
    phase.status === "in-progress" ||
    taskStatuses.some((s) => s === "in-progress" || s === "complete");
  if (inProgress) {
    return cn(
      palette.bar,
      "ring-2 ring-offset-1 ring-[var(--sg-color-navy)]/25",
    );
  }
  return cn(palette.bar, "opacity-85");
}

function hasOverlap(phases: PlanPhase[]): boolean {
  for (let i = 0; i < phases.length; i++) {
    for (let j = i + 1; j < phases.length; j++) {
      const a = phases[i]!;
      const b = phases[j]!;
      const aStart = a.startWeek ?? 0;
      const aEnd = a.endWeek ?? aStart;
      const bStart = b.startWeek ?? 0;
      const bEnd = b.endWeek ?? bStart;
      if (aStart <= bEnd && bStart <= aEnd) return true;
    }
  }
  return false;
}

/**
 * Lightweight week-based timeline — not a full project-management Gantt.
 */
export function ImplementationTimeline({ plan, view = "gantt" }: Props) {
  const phases = plan.phases.filter((p) => p.included);
  const totalWeeks = plan.planningDurationWeeks ?? 1;
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const overlapping = hasOverlap(phases);

  if (view === "list") {
    return (
      <ol className="space-y-3" aria-label="Implementation timeline list">
        {phases.map((phase) => {
          const palette = PHASE_VISUAL[phase.id];
          return (
            <li
              key={phase.id}
              className={cn(
                "rounded-[var(--sg-radius-md)] border px-4 py-3",
                palette.accentBorder,
                palette.accentBg,
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn("mt-1 size-3 shrink-0 rounded-sm", palette.bar)}
                  aria-hidden
                />
                <div>
                  <p className="font-medium text-[var(--sg-color-navy)]">
                    {formatWeekRange(phase.startWeek, phase.endWeek)}:{" "}
                    {phase.name}
                  </p>
                  <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                    ≈ {formatDurationWeeks(phase.durationWeeks)} · planning
                    assumption
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      role="region"
      aria-label="Implementation Gantt timeline"
    >
      <table className="min-w-[640px] w-full border-collapse text-sm">
        <caption className="sr-only">
          Phase timeline across {totalWeeks} planning weeks
          {overlapping ? ", with some phases running in parallel" : ""}.
          Durations are planning assumptions derived from scope. Each phase has
          a distinct color; green bars mean complete.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 bg-[var(--sg-color-surface)] px-3 py-2 text-left font-medium text-[var(--sg-color-text-muted)]"
            >
              Phase
            </th>
            {weeks.map((w) => (
              <th
                key={w}
                scope="col"
                className="px-1 py-2 text-center text-[11px] font-medium text-[var(--sg-color-text-muted)]"
              >
                W{w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {phases.map((phase) => {
            const tasks = plan.tasks.filter((t) => t.phaseId === phase.id);
            const statuses = tasks.map((t) => t.status);
            const start = phase.startWeek ?? 1;
            const end = phase.endWeek ?? start;
            const palette = PHASE_VISUAL[phase.id];
            const status = statusLabel(phase, statuses);
            return (
              <tr
                key={phase.id}
                className="border-t border-[var(--sg-color-border)]"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-[var(--sg-color-surface)] px-3 py-2 text-left font-medium text-[var(--sg-color-text)]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-block size-2.5 shrink-0 rounded-sm",
                        palette.bar,
                      )}
                      aria-hidden
                    />
                    <span className="block">{phase.name}</span>
                  </span>
                  <span className="mt-0.5 block pl-[18px] text-[11px] font-normal text-[var(--sg-color-text-muted)]">
                    {tasks.filter((t) => t.status === "complete").length}/
                    {tasks.length} tasks · {status}
                  </span>
                </th>
                {weeks.map((w) => {
                  const inRange = w >= start && w <= end;
                  return (
                    <td key={w} className="relative px-0.5 py-2">
                      {inRange ? (
                        <div
                          className={cn(
                            "h-6 shadow-sm",
                            phaseBarClass(phase, statuses),
                            w === start && "rounded-l-md",
                            w === end && "rounded-r-md",
                            w !== start && w !== end && "rounded-none",
                            start === end && "rounded-md",
                          )}
                          title={`${phase.name} · week ${w} · ${status}`}
                        />
                      ) : (
                        <div className="h-6 rounded-sm bg-[var(--sg-color-surface-muted)]/40" />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[var(--sg-color-text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-500" aria-hidden />
          Complete
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm bg-[var(--sg-color-primary)] ring-2 ring-[var(--sg-color-navy)]/25"
            aria-hidden
          />
          In progress
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm bg-amber-500 opacity-85"
            aria-hidden
          />
          Not started (phase color)
        </span>
        {overlapping ? (
          <span className="font-medium text-[var(--sg-color-text)]">
            Overlapping bars = work planned in parallel
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
        Based on the scope entered, this plan currently spans approximately{" "}
        {totalWeeks} week{totalWeeks === 1 ? "" : "s"}
        {overlapping
          ? ", with configuration, migration and integrations overlapping where safe"
          : ""}
        . This is a planning model, not a vendor-certified estimate.
      </p>
    </div>
  );
}
