import { Card } from "@/components/ui/card";
import {
  ReviewCriterionScore,
  type ReviewVerdictLabel,
} from "@/components/software/review-criterion-score";
import { cn } from "@/lib/cn";

export type ScoreBreakdownItem = {
  criterionSlug: string;
  name: string;
  score: number | null;
  rationale: string | null;
  showScore: boolean;
  verdictLabel?: ReviewVerdictLabel;
};

type Props = {
  productName: string;
  items: ScoreBreakdownItem[];
  className?: string;
};

export function SoftwareScoreBreakdownPanel({
  productName,
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="score-breakdown-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="score-breakdown-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How we scored {productName}
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const showNumeric =
            item.showScore && typeof item.score === "number";
          const pct =
            showNumeric && typeof item.score === "number"
              ? Math.max(0, Math.min(100, (item.score / 10) * 100))
              : null;

          return (
            <li key={item.criterionSlug}>
              <Card className="p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {item.name}
                  </h3>
                  <ReviewCriterionScore
                    score={item.score}
                    scoreApproved={item.showScore}
                    verdictLabel={item.verdictLabel}
                  />
                </div>

                {showNumeric && pct !== null ? (
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-[var(--sg-color-primary)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : null}

                {item.rationale ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                    {item.rationale}
                  </p>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
