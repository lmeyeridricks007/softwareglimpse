import { scoreLabel } from "@/services/editorial/score-labels";

export type ScoreBreakdownItem = {
  criterionSlug: string;
  name: string;
  score: number;
  rationale: string;
  confidence?: string;
};

type Props = {
  items: ScoreBreakdownItem[];
  /** Hide numeric scores unless assessment is approved. */
  showScores?: boolean;
  title?: string;
};

export function ScoreBreakdown({
  items,
  showScores = false,
  title = "Score breakdown",
}: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="score-breakdown-heading" className="mb-8">
      <h2
        id="score-breakdown-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold"
      >
        {title}
      </h2>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li
            key={item.criterionSlug}
            className="border-b border-[var(--color-border)] pb-4 last:border-b-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium">{item.name}</h3>
              {showScores ? (
                <p
                  className="text-sm tabular-nums"
                  aria-label={`${item.name} score: ${item.score} out of 10, ${scoreLabel(item.score)}`}
                >
                  {item.score}/10 · {scoreLabel(item.score)}
                </p>
              ) : (
                <p className="text-sm text-[var(--color-fg-muted)]">
                  Score pending approval
                </p>
              )}
            </div>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              {item.rationale}
            </p>
            {item.confidence ? (
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                Confidence: {item.confidence}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
