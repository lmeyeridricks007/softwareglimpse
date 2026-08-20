import { formatScoreWithLabel, scoreLabel } from "@/services/editorial/score-labels";

type Props = {
  score: number;
  label?: string;
  rationale?: string;
  /** When false, renders a provisional note instead of a public score. */
  approved?: boolean;
};

/**
 * Overall editorial score with an explicit text label (not color-alone).
 */
export function EditorialScore({
  score,
  label = "SoftwareGlimpse score",
  rationale,
  approved = false,
}: Props) {
  if (!approved) {
    return (
      <p
        role="status"
        className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm text-[var(--color-fg-muted)]"
      >
        Editorial score is provisional and hidden until approved.
      </p>
    );
  }

  const text = formatScoreWithLabel(score);
  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5"
      aria-label={`${label}: ${text}`}
    >
      <p className="text-sm text-[var(--color-fg-muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums">
        <span aria-hidden="true">{Math.round(score * 10) / 10}</span>
        <span className="text-lg font-normal text-[var(--color-fg-muted)]">
          {" "}
          / 10
        </span>
      </p>
      <p className="mt-1 text-sm font-medium">
        {scoreLabel(score)}
        <span className="sr-only"> — {text}</span>
      </p>
      {rationale ? (
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{rationale}</p>
      ) : null}
    </div>
  );
}
