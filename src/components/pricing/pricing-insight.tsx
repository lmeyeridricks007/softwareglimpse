import { Lightbulb } from "lucide-react";
import { buildPricingInsights } from "@/services/pricing";
import type { ProductCostEstimate } from "@/domain";
import { cn } from "@/lib/cn";

type Props = {
  estimates: ProductCostEstimate[];
  className?: string;
};

/**
 * Deterministic insights derived from calculated result data only.
 */
export function PricingInsightPanel({ estimates, className }: Props) {
  const insights = buildPricingInsights(estimates);
  if (insights.length === 0) return null;

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/50 p-5 sm:p-8",
        className,
      )}
      aria-labelledby="insights-heading"
    >
      <div className="flex items-center gap-2">
        <Lightbulb
          className="size-5 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <h2
          id="insights-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
        >
          What these numbers mean
        </h2>
      </div>
      <ul className="mt-4 space-y-3">
        {insights.map((insight) => (
          <li
            key={insight.id}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm text-[var(--sg-color-text)]"
          >
            {insight.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
