"use client";

import { cn } from "@/lib/cn";
import type { CriterionImportance } from "@/domain";
import { IMPORTANCE_WEIGHT } from "@/domain/schemas/vendor-scorecard";

const OPTIONS: { value: CriterionImportance; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "ignore", label: "Ignore" },
];

export function ImportanceControl({
  id,
  label,
  importance,
  normalizedWeight,
  onChange,
}: {
  id: string;
  label: string;
  importance: CriterionImportance;
  normalizedWeight?: number;
  onChange: (importance: CriterionImportance) => void;
}) {
  const pct =
    normalizedWeight != null && importance !== "ignore"
      ? Math.round(normalizedWeight * 100)
      : null;
  const barPct =
    importance === "ignore"
      ? 0
      : (IMPORTANCE_WEIGHT[importance] / IMPORTANCE_WEIGHT.critical) * 100;

  return (
    <div className="grid gap-2 border-b border-[var(--sg-color-border)] py-3.5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-[var(--sg-color-text)]">
          {label}
        </label>
        <div className="mt-1.5 h-1.5 max-w-xs overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--sg-color-primary)] transition-[width]"
            style={{ width: `${barPct}%` }}
            aria-hidden
          />
        </div>
        {pct != null ? (
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            Display weight {pct}% (normalized automatically)
          </p>
        ) : null}
      </div>
      <select
        id={id}
        value={importance}
        onChange={(e) => onChange(e.target.value as CriterionImportance)}
        className={cn(
          "h-9 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)]",
          "bg-[var(--sg-color-surface)] px-2 text-sm text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]",
        )}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
