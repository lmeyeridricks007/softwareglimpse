import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { scoreLabel } from "@/services/editorial/score-labels";
import type { ReviewVerdictLabel } from "@/domain/schemas/deep-review";

export type { ReviewVerdictLabel };

const VERDICT_DISPLAY: Record<ReviewVerdictLabel, string> = {
  excellent: "Excellent",
  strong: "Strong",
  good: "Good",
  mixed: "Mixed",
  limited: "Limited",
};

const VERDICT_BADGE_VARIANT: Record<
  ReviewVerdictLabel,
  "success" | "primary" | "warning" | "neutral" | "editorial-choice"
> = {
  excellent: "editorial-choice",
  strong: "primary",
  good: "success",
  mixed: "warning",
  limited: "neutral",
};

export function formatVerdictLabel(label: ReviewVerdictLabel): string {
  return VERDICT_DISPLAY[label];
}

export function verdictBadgeVariant(
  label: ReviewVerdictLabel,
): "success" | "primary" | "warning" | "neutral" | "editorial-choice" {
  return VERDICT_BADGE_VARIANT[label];
}

export type ReviewCriterionScoreProps = {
  score?: number | null;
  scoreApproved?: boolean;
  verdictLabel?: ReviewVerdictLabel;
  className?: string;
};

export function ReviewCriterionScore({
  score,
  scoreApproved = false,
  verdictLabel,
  className,
}: ReviewCriterionScoreProps) {
  if (scoreApproved && typeof score === "number") {
    const display = Math.round(score * 10) / 10;
    const label = scoreLabel(score);

    return (
      <p
        className={cn(
          "flex flex-wrap items-center gap-2 text-sm tabular-nums text-[var(--sg-color-text-muted)]",
          className,
        )}
        aria-label={`Score: ${display} out of 10, ${label}`}
      >
        <span className="font-semibold text-[var(--sg-color-text)]">
          {display} / 10
        </span>
        <span aria-hidden>·</span>
        <span>{label}</span>
      </p>
    );
  }

  if (verdictLabel) {
    return (
      <Badge
        variant={verdictBadgeVariant(verdictLabel)}
        className={className}
      >
        {formatVerdictLabel(verdictLabel)}
      </Badge>
    );
  }

  return null;
}
