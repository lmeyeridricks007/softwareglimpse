import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  /** Editorial score 0–10. Only pass approved scores. */
  score: number;
  max?: number;
  className?: string;
  showNumeric?: boolean;
};

/**
 * Accessible rating display. Never call with fabricated scores.
 */
export function Rating({
  score,
  max = 10,
  className,
  showNumeric = true,
}: Props) {
  const clamped = Math.max(0, Math.min(max, score));
  const stars = Math.round((clamped / max) * 5 * 2) / 2;

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Score ${clamped} out of ${max}`}
    >
      <span className="inline-flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = stars >= i ? 1 : stars >= i - 0.5 ? 0.5 : 0;
          return (
            <Star
              key={i}
              className={cn(
                "size-4",
                fill > 0
                  ? "fill-[var(--sg-color-rating)] text-[var(--sg-color-rating)]"
                  : "text-[var(--sg-color-border-strong)]",
              )}
              strokeWidth={1.5}
            />
          );
        })}
      </span>
      {showNumeric ? (
        <span className="text-sm font-semibold tabular-nums text-[var(--sg-color-text)]">
          {Math.round(clamped * 10) / 10}
          <span className="font-normal text-[var(--sg-color-text-muted)]">
            /{max}
          </span>
        </span>
      ) : null}
    </div>
  );
}
