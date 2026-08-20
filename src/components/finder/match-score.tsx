/**
 * Fit score display — percentage match from the recommendation engine.
 */
export function MatchScore({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex flex-col">
      <span className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums tracking-tight text-[var(--sg-color-text)]">
        {clamped}% match
      </span>
      <span className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
        Fit score based on your answers — not a probability
      </span>
    </div>
  );
}
