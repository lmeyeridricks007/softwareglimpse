"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TcoStepHeader({
  id,
  title,
  description,
  eyebrow,
}: {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
}) {
  return (
    <header className="space-y-2">
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--sg-color-navy)]"
      >
        {title}
      </h2>
      <p className="max-w-2xl text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
        {description}
      </p>
    </header>
  );
}

export function TcoFieldCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]",
        className,
      )}
    >
      {title ? (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: number | "" | undefined;
  onChange: (value: number | undefined) => void;
  hint?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
};

/** Polished numeric field used across TCO assumption steps. */
export function TcoNumberField({
  id,
  label,
  value,
  onChange,
  hint,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
  placeholder,
  className,
}: NumberFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--sg-color-text)]"
      >
        {label}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-[var(--sg-color-text-muted)]">
          {hint}
        </p>
      ) : null}
      <div className="flex min-h-12 items-stretch overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] focus-within:border-[var(--sg-color-primary)] focus-within:ring-2 focus-within:ring-[var(--sg-color-primary)]/20">
        {prefix ? (
          <span className="flex items-center bg-[var(--sg-color-surface-muted)]/80 px-3 text-sm font-medium text-[var(--sg-color-text-muted)]">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value === undefined || value === "" ? "" : value}
          onChange={(e) => {
            const raw = e.target.value.trim();
            if (raw === "") {
              onChange(undefined);
              return;
            }
            const n = Number(raw);
            if (!Number.isFinite(n) || n < min) return;
            if (max != null && n > max) return;
            onChange(n);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm tabular-nums text-[var(--sg-color-text)] outline-none"
        />
        {suffix ? (
          <span className="flex items-center px-3 text-xs font-medium text-[var(--sg-color-text-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

type PillOption<T extends string> = { value: T; label: string; hint?: string };

export function TcoChoicePills<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-[var(--sg-color-navy)]">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              title={o.hint}
              className={cn(
                "rounded-[var(--sg-radius-pill)] border px-3.5 py-2 text-sm font-medium transition",
                active
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)] shadow-[var(--sg-shadow-sm)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]/40 hover:bg-[var(--sg-color-primary-soft)]/40",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function TcoLiveCalcBanner({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50 px-4 py-3 text-sm text-[var(--sg-color-navy)]",
        className,
      )}
      role="status"
    >
      {children}
    </div>
  );
}

type QuickChip = { id: string; label: string; value: number };

export function TcoQuickValueChips({
  label,
  chips,
  activeValue,
  onSelect,
  formatValue,
}: {
  label: string;
  chips: QuickChip[];
  activeValue?: number;
  onSelect: (value: number) => void;
  formatValue?: (value: number) => string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {chips.map((chip) => {
          const active = activeValue === chip.value;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelect(chip.value)}
              aria-pressed={active}
              className={cn(
                "rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-xs font-medium tabular-nums transition",
                active
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]/40",
              )}
            >
              {chip.label}
              {formatValue ? (
                <span className="ml-1 text-[var(--sg-color-text-muted)]">
                  ({formatValue(chip.value)})
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
