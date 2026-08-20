import type { PlanPhaseId } from "@/domain";

/** Shared phase palette for Gantt bars and phase cards. */
export const PHASE_VISUAL: Record<
  PlanPhaseId,
  {
    bar: string;
    chip: string;
    accentBorder: string;
    accentBg: string;
    number: string;
  }
> = {
  discovery: {
    bar: "bg-sky-500",
    chip: "bg-sky-100 text-sky-800",
    accentBorder: "border-sky-200",
    accentBg: "bg-sky-50/80",
    number: "bg-sky-500 text-white",
  },
  "requirements-validation": {
    bar: "bg-indigo-500",
    chip: "bg-indigo-100 text-indigo-800",
    accentBorder: "border-indigo-200",
    accentBg: "bg-indigo-50/80",
    number: "bg-indigo-500 text-white",
  },
  "process-design": {
    bar: "bg-violet-500",
    chip: "bg-violet-100 text-violet-800",
    accentBorder: "border-violet-200",
    accentBg: "bg-violet-50/80",
    number: "bg-violet-500 text-white",
  },
  "data-model": {
    bar: "bg-fuchsia-500",
    chip: "bg-fuchsia-100 text-fuchsia-800",
    accentBorder: "border-fuchsia-200",
    accentBg: "bg-fuchsia-50/80",
    number: "bg-fuchsia-500 text-white",
  },
  configuration: {
    bar: "bg-[var(--sg-color-primary)]",
    chip: "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
    accentBorder: "border-[var(--sg-color-primary)]/25",
    accentBg: "bg-[var(--sg-color-primary-soft)]/50",
    number: "bg-[var(--sg-color-primary)] text-white",
  },
  "data-migration": {
    bar: "bg-amber-500",
    chip: "bg-amber-100 text-amber-900",
    accentBorder: "border-amber-200",
    accentBg: "bg-amber-50/80",
    number: "bg-amber-500 text-white",
  },
  integrations: {
    bar: "bg-teal-500",
    chip: "bg-teal-100 text-teal-900",
    accentBorder: "border-teal-200",
    accentBg: "bg-teal-50/80",
    number: "bg-teal-500 text-white",
  },
  "automation-reporting": {
    bar: "bg-cyan-600",
    chip: "bg-cyan-100 text-cyan-900",
    accentBorder: "border-cyan-200",
    accentBg: "bg-cyan-50/80",
    number: "bg-cyan-600 text-white",
  },
  security: {
    bar: "bg-slate-600",
    chip: "bg-slate-200 text-slate-800",
    accentBorder: "border-slate-300",
    accentBg: "bg-slate-50",
    number: "bg-slate-600 text-white",
  },
  "testing-uat": {
    bar: "bg-orange-500",
    chip: "bg-orange-100 text-orange-900",
    accentBorder: "border-orange-200",
    accentBg: "bg-orange-50/80",
    number: "bg-orange-500 text-white",
  },
  "training-change": {
    bar: "bg-rose-500",
    chip: "bg-rose-100 text-rose-900",
    accentBorder: "border-rose-200",
    accentBg: "bg-rose-50/80",
    number: "bg-rose-500 text-white",
  },
  "go-live": {
    bar: "bg-emerald-600",
    chip: "bg-emerald-100 text-emerald-900",
    accentBorder: "border-emerald-200",
    accentBg: "bg-emerald-50/80",
    number: "bg-emerald-600 text-white",
  },
  stabilization: {
    bar: "bg-lime-600",
    chip: "bg-lime-100 text-lime-900",
    accentBorder: "border-lime-200",
    accentBg: "bg-lime-50/80",
    number: "bg-lime-600 text-white",
  },
};

export function formatWeekRange(
  startWeek?: number,
  endWeek?: number,
): string {
  if (startWeek == null) return "Timing TBD";
  if (endWeek == null || endWeek === startWeek) return `Week ${startWeek}`;
  return `Weeks ${startWeek}–${endWeek}`;
}

export function formatDurationWeeks(weeks: number): string {
  if (weeks === 1) return "1 week";
  if (Number.isInteger(weeks)) return `${weeks} weeks`;
  return `${weeks} weeks`;
}
