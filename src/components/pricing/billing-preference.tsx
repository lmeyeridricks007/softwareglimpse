"use client";

import type { BillingPreference } from "@/domain";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/cn";

const OPTIONS: {
  value: BillingPreference;
  label: string;
  description: string;
}[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Show cash due each month when monthly billing exists.",
  },
  {
    value: "annual",
    label: "Annual",
    description: "Prefer annual billing; show cash vs monthly-equivalent.",
  },
  {
    value: "either",
    label: "Show both",
    description: "Surface monthly and annual figures when both are known.",
  },
];

type Props = {
  value: BillingPreference;
  onChange: (value: BillingPreference) => void;
  variant?: "cards" | "select";
  className?: string;
};

export function BillingPreferenceControl({
  value,
  onChange,
  variant = "cards",
  className,
}: Props) {
  if (variant === "select") {
    return (
      <div className={cn("space-y-2", className)}>
        <label
          htmlFor="billing-preference"
          className="text-sm font-medium text-[var(--sg-color-text)]"
        >
          Billing cycle
        </label>
        <div className="relative">
          <Calendar
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--sg-color-primary)]"
            aria-hidden
          />
          <select
            id="billing-preference"
            value={value}
            onChange={(e) => onChange(e.target.value as BillingPreference)}
            className="min-h-11 w-full appearance-none rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-2 pr-3 pl-10 text-sm"
          >
            {OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          {OPTIONS.find((o) => o.value === value)?.description}
        </p>
      </div>
    );
  }

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        Billing preference
      </legend>
      <div
        className="grid gap-2 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Billing preference"
      >
        {OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer flex-col gap-1 rounded-[var(--sg-radius-md)] border px-4 py-3",
                checked
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
              )}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="billing-preference"
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange(option.value)}
                  className="size-4 accent-[var(--sg-color-primary)]"
                />
                <span className="text-sm font-medium">{option.label}</span>
              </span>
              <span className="pl-6 text-xs text-[var(--sg-color-text-muted)]">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
