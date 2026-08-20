import type { ScoreBreakdown } from "@/domain";
import { cn } from "@/lib/cn";

const DIMENSIONS: Array<{
  key: keyof ScoreBreakdown;
  label: string;
}> = [
  { key: "useCaseFit", label: "Primary goal" },
  { key: "requiredFeatures", label: "Must-have features" },
  { key: "businessSizeFit", label: "Team / business size" },
  { key: "integrations", label: "Integrations" },
  { key: "priorities", label: "Setup preference" },
  { key: "budgetFit", label: "Budget" },
  { key: "businessTypeFit", label: "Business type" },
];

type Props = {
  breakdown: ScoreBreakdown;
  className?: string;
};

/** Horizontal fit bars from engine breakdown (0–1 → %). */
export function FitBreakdownBars({ breakdown, className }: Props) {
  const rows = DIMENSIONS.map((d) => {
    const raw = breakdown[d.key];
    if (typeof raw !== "number") return null;
    return { label: d.label, pct: Math.round(raw * 100) };
  }).filter(Boolean) as Array<{ label: string; pct: number }>;

  if (rows.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--sg-color-text-muted)]">
        Your fit
      </p>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="text-[var(--sg-color-text)]">{row.label}</span>
              <span className="tabular-nums text-[var(--sg-color-text-muted)]">
                {row.pct}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-[var(--sg-color-primary)]"
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[11px] leading-snug text-[var(--sg-color-text-muted)]">
        Fit is calculated from your requirements and SoftwareGlimpse structured
        research. It is not a probability or user-review score.
      </p>
    </div>
  );
}
