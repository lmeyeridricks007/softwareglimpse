import { Check, CircleDot } from "lucide-react";
import { cn } from "@/lib/cn";

/** Compact mock for CRM Requirements Builder cards. */
export function RequirementsBuilderPreview({
  className,
}: {
  className?: string;
}) {
  const rows = [
    { label: "Pipeline stages", priority: "Must-have" },
    { label: "Email sequences", priority: "Important" },
    { label: "Native dialer", priority: "Nice-to-have" },
  ] as const;

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-sky-200/80 bg-sky-50/60 p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-800/70">
        Requirements profile
      </p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-sm)] border border-sky-200/70 bg-white px-2.5 py-1.5 text-xs"
          >
            <span className="font-medium text-[var(--sg-color-text)]">
              {row.label}
            </span>
            <span
              className={cn(
                "shrink-0 rounded-[var(--sg-radius-pill)] px-2 py-0.5 text-[10px] font-semibold",
                row.priority === "Must-have" &&
                  "bg-sky-600 text-white",
                row.priority === "Important" &&
                  "bg-sky-100 text-sky-800",
                row.priority === "Nice-to-have" &&
                  "border border-sky-200 text-sky-700",
              )}
            >
              {row.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact mock for CRM Vendor Scorecard cards. */
export function ScorecardPreview({ className }: { className?: string }) {
  const rows = [
    { label: "Pipeline fit", score: "4.5" },
    { label: "Ease of use", score: "4.2" },
    { label: "Pricing clarity", score: "3.8" },
  ] as const;

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-sky-200/80 bg-sky-50/50 p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-800/70">
        Weighted scorecard
      </p>
      <ul className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between rounded-[var(--sg-radius-sm)] border border-sky-200/70 bg-white px-2.5 py-1.5 text-xs"
          >
            <span className="font-medium text-[var(--sg-color-text)]">
              {row.label}
            </span>
            <span className="font-semibold text-sky-700">{row.score}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-sky-200 pt-2 flex items-center justify-between text-xs font-semibold text-[var(--sg-color-text)]">
        <span>Demo score</span>
        <span className="text-sky-700">Pending</span>
      </div>
    </div>
  );
}

/** Compact mock for CRM Implementation Planner cards. */
export function ImplementationPlannerPreview({
  className,
}: {
  className?: string;
}) {
  const phases = [
    { label: "Discovery", state: "done" as const },
    { label: "Configure", state: "active" as const },
    { label: "Train & go-live", state: "next" as const },
  ];

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-indigo-200/80 bg-indigo-50/50 p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-800/70">
        Rollout phases
      </p>
      <ol className="mt-2 space-y-1.5">
        {phases.map((phase, i) => (
          <li
            key={phase.label}
            className="flex items-center gap-2 rounded-[var(--sg-radius-sm)] border border-indigo-200/70 bg-white px-2.5 py-1.5 text-xs"
          >
            {phase.state === "done" ? (
              <Check className="size-3.5 shrink-0 text-[var(--sg-color-success)]" />
            ) : phase.state === "active" ? (
              <CircleDot className="size-3.5 shrink-0 text-indigo-600" />
            ) : (
              <span className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-indigo-300 text-[9px] font-semibold text-indigo-500">
                {i + 1}
              </span>
            )}
            <span
              className={cn(
                "font-medium",
                phase.state === "next"
                  ? "text-[var(--sg-color-text-muted)]"
                  : "text-[var(--sg-color-text)]",
              )}
            >
              {phase.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Compact mock for CRM Migration Planner cards. */
export function MigrationPlannerPreview({
  className,
}: {
  className?: string;
}) {
  const steps = [
    { label: "Source inventory", detail: "3 systems" },
    { label: "Field mapping", detail: "42 fields" },
    { label: "Test cutover", detail: "Queued" },
  ] as const;

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-teal-200/80 bg-teal-50/50 p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-800/70">
        Migration workspace
      </p>
      <ul className="mt-2 space-y-1.5">
        {steps.map((step) => (
          <li
            key={step.label}
            className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-sm)] border border-teal-200/70 bg-white px-2.5 py-1.5 text-xs"
          >
            <span className="font-medium text-[var(--sg-color-text)]">
              {step.label}
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-teal-700">
              {step.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
