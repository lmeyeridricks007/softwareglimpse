import { Badge } from "@/components/ui/badge";
import type { RoiAssumptionType, RoiConfidence } from "@/domain";

const TYPE_CONFIG: Record<
  RoiAssumptionType,
  { label: string; variant: "success" | "primary" | "warning" | "neutral"; className?: string }
> = {
  verified: { label: "Verified", variant: "success" },
  estimated: { label: "Estimated", variant: "primary" },
  scenario: {
    label: "Scenario",
    variant: "primary",
    className:
      "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-200",
  },
  unknown: { label: "Unknown", variant: "neutral" },
};

const CONFIDENCE_LABEL: Record<RoiConfidence, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function RoiTypeBadge({
  type,
  className,
}: {
  type: RoiAssumptionType;
  className?: string;
}) {
  const cfg = TYPE_CONFIG[type];
  return (
    <Badge variant={cfg.variant} className={cfg.className ?? className}>
      {cfg.label}
    </Badge>
  );
}

export function RoiConfidenceDot({
  confidence,
}: {
  confidence: RoiConfidence;
}) {
  const color =
    confidence === "high"
      ? "bg-[var(--sg-color-success)]"
      : confidence === "medium"
        ? "bg-[var(--sg-color-warning)]"
        : "bg-[var(--sg-color-danger)]";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--sg-color-text-muted)]">
      <span
        className={`size-2 rounded-full ${color}`}
        aria-hidden
      />
      <span>{CONFIDENCE_LABEL[confidence]} confidence</span>
    </span>
  );
}
