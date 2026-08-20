"use client";

import { User } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  /** Soft UI cap for the slider; number input can still go higher up to max. */
  sliderMax?: number;
  onChange: (value: number) => void;
  label?: string;
  description?: string;
  className?: string;
};

/** Seat count with slider + numeric input (mockup-style). */
export function UserCountInput({
  id = "crm-users",
  value,
  min = 1,
  max = 5000,
  sliderMax = 100,
  onChange,
  label = "Number of users",
  description = "How many people will need a paid seat.",
  className,
}: Props) {
  const sliderValue = Math.min(sliderMax, Math.max(min, value));
  const overSlider = value > sliderMax;

  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium text-[var(--sg-color-text)]">
        {label}
      </legend>
      {description ? (
        <p id={`${id}-hint`} className="text-sm text-[var(--sg-color-text-muted)]">
          {description}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
          <User className="size-4" aria-hidden />
        </span>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isFinite(value) ? value : ""}
          aria-describedby={description ? `${id}-hint` : undefined}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (!Number.isFinite(next)) return;
            onChange(Math.min(max, Math.max(min, Math.round(next))));
          }}
          className="min-h-11 w-24 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 text-sm font-semibold tabular-nums"
        />
        <span className="text-sm text-[var(--sg-color-text-muted)]">
          {overSlider ? `${sliderMax}+` : null}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={sliderMax}
        value={sliderValue}
        aria-label={`${label} slider`}
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Math.min(max, Math.max(min, Math.round(next))));
        }}
        className="w-full accent-[var(--sg-color-primary)]"
      />
      <div className="flex justify-between text-xs text-[var(--sg-color-text-muted)]">
        <span>{min}</span>
        <span>{sliderMax}+</span>
      </div>
    </fieldset>
  );
}
