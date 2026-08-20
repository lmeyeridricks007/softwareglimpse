import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  variant?: "row" | "card";
};

/** Large-touch single-select option — row or mockup card grid. */
export function FinderOption({
  name,
  value,
  label,
  description,
  checked,
  onChange,
  icon: Icon,
  variant = "row",
}: Props) {
  if (variant === "card") {
    return (
      <label
        className={cn(
          "flex min-h-[5.75rem] cursor-pointer flex-col rounded-[var(--sg-radius-lg)] border p-4 transition-colors",
          checked
            ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] shadow-[var(--sg-shadow-sm)]"
            : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
        )}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only"
        />
        {Icon ? (
          <Icon
            className={cn(
              "size-5",
              checked
                ? "text-[var(--sg-color-primary)]"
                : "text-[var(--sg-color-text-muted)]",
            )}
            aria-hidden
          />
        ) : null}
        <span className="mt-3 text-sm font-semibold text-[var(--sg-color-text)]">
          {checked ? "✓ " : null}
          {label}
        </span>
        {description ? (
          <span className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            {description}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <label
      className={cn(
        "flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--sg-radius-md)] border px-4 py-3 transition-colors",
        checked
          ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
          : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 size-4 shrink-0 accent-[var(--sg-color-primary)]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[var(--sg-color-text)]">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-sm text-[var(--sg-color-text-muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
