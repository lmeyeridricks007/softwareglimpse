import { Check } from "lucide-react";
import type { FinderMatchCriterion } from "@/components/finder/framework/types";
import { cn } from "@/lib/cn";

type Props = {
  stepLabel: string;
  stepCurrent: number;
  stepTotal: number;
  progressPct: number;
  criteria: FinderMatchCriterion[];
  className?: string;
};

/** In-wizard progress + matching criteria — replaces premature live-rank sidebar. */
export function FinderProgressPanel({
  stepLabel,
  stepCurrent,
  stepTotal,
  progressPct,
  criteria,
  className,
}: Props) {
  return (
    <aside
      className={cn(
        "space-y-4 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]",
        className,
      )}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
          Your progress
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--sg-color-text)]">
          Step {stepCurrent} of {stepTotal} · {stepLabel}
        </p>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Finder progress"
        >
          <div
            className="h-full rounded-full bg-[var(--sg-color-primary)] transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-[var(--sg-color-text-muted)]">
          {progressPct}% complete
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
          What we&apos;ll match
        </p>
        <ul className="mt-2 space-y-1.5">
          {criteria.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-2 text-sm text-[var(--sg-color-text)]"
            >
              <Check
                className="size-3.5 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/60 px-3 py-3">
        <p className="text-xs font-semibold text-[var(--sg-color-primary-hover)]">
          Privacy
        </p>
        <p className="mt-1 text-xs leading-snug text-[var(--sg-color-text-muted)]">
          Your answers stay on this device. We don&apos;t store them on our
          servers or use them for marketing.
        </p>
      </div>
    </aside>
  );
}
