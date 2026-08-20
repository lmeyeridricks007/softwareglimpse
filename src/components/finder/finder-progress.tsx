type Props = {
  stepIndex: number;
  totalSteps: number;
  label?: string;
};

/** Linear progress for the finder wizard (not color-alone). */
export function FinderProgress({ stepIndex, totalSteps, label }: Props) {
  const current = Math.min(stepIndex + 1, totalSteps);
  const pct = totalSteps > 0 ? Math.round((current / totalSteps) * 100) : 0;

  return (
    <div className="mb-6" role="status" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-[var(--color-fg)]">
          {label ?? `Step ${current} of ${totalSteps}`}
        </span>
        <span className="text-[var(--color-fg-muted)]">{pct}%</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-border)]"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
