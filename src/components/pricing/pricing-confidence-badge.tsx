"use client";

import type { RecommendationConfidence } from "@/domain";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const COPY: Record<
  RecommendationConfidence,
  { label: string; title: string; body: string; variant: "success" | "warning" | "neutral" }
> = {
  high: {
    label: "High confidence",
    title: "High confidence",
    body: "Pricing is based on public list prices with relatively complete plan data for this configuration.",
    variant: "success",
  },
  medium: {
    label: "Medium confidence",
    title: "Medium confidence",
    body: "Pricing is based on public information, but one or more pricing components may vary or require vendor confirmation.",
    variant: "warning",
  },
  low: {
    label: "Low confidence",
    title: "Low confidence",
    body: "Public pricing evidence is limited, incomplete, or stale for this configuration. Confirm with the vendor before deciding.",
    variant: "neutral",
  },
};

type Props = {
  confidence: RecommendationConfidence;
  className?: string;
  /** Show short label only (tooltip still available). */
  compact?: boolean;
};

/**
 * Clickable/hoverable confidence badge with methodology explanation.
 */
export function PricingConfidenceBadge({
  confidence,
  className,
  compact = false,
}: Props) {
  const copy = COPY[confidence] ?? COPY.medium;

  return (
    <details className={cn("group relative inline-block", className)}>
      <summary
        className="list-none cursor-pointer [&::-webkit-details-marker]:hidden"
        aria-label={`${copy.title}. Activate for explanation.`}
      >
        <Badge variant={copy.variant}>
          {compact
            ? copy.label.replace(" confidence", "")
            : copy.label}
        </Badge>
      </summary>
      <div
        role="note"
        className="absolute z-20 mt-2 w-64 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 text-left shadow-[var(--sg-shadow-md)]"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text)]">
          {copy.title}
        </p>
        <p className="mt-1.5 text-xs text-[var(--sg-color-text-muted)]">
          {copy.body}
        </p>
        <a
          href="#pricing-methodology"
          className="mt-2 inline-block text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          How pricing confidence works →
        </a>
      </div>
    </details>
  );
}

/** @deprecated Prefer PricingConfidenceBadge — kept for existing imports. */
export function PricingConfidence({
  confidence,
  className,
}: {
  confidence: RecommendationConfidence;
  className?: string;
}) {
  return (
    <PricingConfidenceBadge confidence={confidence} className={className} />
  );
}
