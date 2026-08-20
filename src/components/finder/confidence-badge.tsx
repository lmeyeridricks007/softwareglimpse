import type { RecommendationConfidence } from "@/domain";
import { cn } from "@/lib/cn";

type Props = {
  confidence: RecommendationConfidence;
  compact?: boolean;
};

const LABELS: Record<RecommendationConfidence, string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Limited evidence",
};

const HINTS: Record<RecommendationConfidence, string> = {
  high: "Most scoring dimensions have product evidence.",
  medium: "Some dimensions rely on partial research.",
  low: "Limited evidence — treat this as a starting shortlist.",
};

const TONE: Record<RecommendationConfidence, string> = {
  high: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  low: "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
};

/** Evidence confidence — separate from fit %. */
export function ConfidenceBadge({ confidence, compact }: Props) {
  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex rounded-[var(--sg-radius-pill)] border px-2.5 py-0.5 text-[11px] font-semibold",
          TONE[confidence],
        )}
        title={HINTS[confidence]}
      >
        Evidence: {LABELS[confidence].replace(" confidence", "").replace("Limited evidence", "Limited")}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex max-w-full flex-col gap-0.5 rounded-[var(--sg-radius-md)] border px-3 py-2",
        TONE[confidence],
      )}
      role="status"
    >
      <span className="text-sm font-medium">{LABELS[confidence]}</span>
      <span className="text-xs opacity-80">{HINTS[confidence]}</span>
    </div>
  );
}
