"use client";

import { formatMoney, type CurrencyCode } from "@/domain";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function McMoney({
  minor,
  currency,
  fallback = "—",
}: {
  minor: number | null | undefined;
  currency: string;
  fallback?: string;
}) {
  if (minor == null) {
    return <span className="text-[var(--sg-color-text-muted)]">{fallback}</span>;
  }
  return (
    <span className="tabular-nums">
      {formatMoney(
        { amountMinor: minor, currency: currency as CurrencyCode },
        { maximumFractionDigits: 0 },
      )}
    </span>
  );
}

export function McComplexityBadge({ band }: { band: string }) {
  const label =
    band === "very-high"
      ? "Very high"
      : band.charAt(0).toUpperCase() + band.slice(1);
  const variant =
    band === "low"
      ? "success"
      : band === "moderate"
        ? "primary"
        : band === "unknown"
          ? "neutral"
          : "warning";
  return <Badge variant={variant}>{label}</Badge>;
}

export function McConfidenceBadge({ confidence }: { confidence: string }) {
  const variant =
    confidence === "high"
      ? "success"
      : confidence === "medium"
        ? "warning"
        : "danger";
  return (
    <Badge variant={variant}>
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)} confidence
    </Badge>
  );
}

export function McSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function McFieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[var(--sg-color-text)]"
      >
        {children}
      </label>
      {hint ? (
        <p className="text-xs text-[var(--sg-color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function McChoiceGrid<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  options: Array<{ value: T; label: string; hint?: string }>;
  value: T | undefined;
  onChange: (v: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        {legend}
      </legend>
      <div
        className={cn(
          "mt-2 grid gap-2",
          columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
        )}
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={selected}
              className={cn(
                "rounded-[var(--sg-radius-md)] border px-3 py-2.5 text-left text-sm transition",
                selected
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
              )}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.hint ? (
                <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                  {opt.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function toMajorOrNull(
  minor: number | null | undefined,
): number | null | undefined {
  if (minor === undefined) return undefined;
  if (minor === null) return null;
  return minor / 100;
}

export function fromMajorOrNull(
  major: number | null | undefined,
): number | null | undefined {
  if (major === undefined) return undefined;
  if (major === null) return null;
  return Math.round(major * 100);
}
