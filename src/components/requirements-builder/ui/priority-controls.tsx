"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRIORITY_LABELS } from "../crm/definition";

type Priority =
  | "must-have"
  | "important"
  | "nice-to-have"
  | "not-needed"
  | "required"
  | "preferred"
  | "optional"
  | "primary"
  | "relevant"
  | "critical"
  | "high";

const VARIANT: Record<string, string> = {
  "must-have":
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
  required:
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
  primary:
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
  critical:
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
  important:
    "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  preferred:
    "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  high: "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  "nice-to-have":
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
  optional:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
  relevant:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
  "not-needed":
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--sg-radius-pill)] px-2.5 py-0.5 text-[var(--sg-text-caption)] font-medium",
        VARIANT[priority] ?? VARIANT.optional,
        className,
      )}
    >
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}

type SelectProps = {
  id: string;
  label: string;
  value: string;
  options: Array<{ value: Priority | string; label: string }>;
  onChange: (value: string) => void;
  className?: string;
};

export function PrioritySelect({
  id,
  label,
  value,
  options,
  onChange,
  className,
}: SelectProps) {
  return (
    <label className={cn("inline-flex flex-col gap-1 text-xs", className)}>
      <span className="sr-only">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-10 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2.5 text-sm text-[var(--sg-color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type SelectableCardProps = {
  selected: boolean;
  title: string;
  description?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  multi?: boolean;
};

export function SelectableCard({
  selected,
  title,
  description,
  onClick,
  icon,
  badge,
  multi,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex min-h-[5.5rem] w-full flex-col items-start gap-2 rounded-[var(--sg-radius-lg)] border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
        selected
          ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]/50 ring-1 ring-[var(--sg-color-primary)]"
          : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] hover:border-[var(--sg-color-primary)]/40",
      )}
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-[var(--sg-color-navy)]">
            {title}
          </span>
        </span>
        {selected ? (
          <Check
            className="size-5 shrink-0 text-[var(--sg-color-primary)]"
            aria-hidden
          />
        ) : multi ? (
          <span
            className="size-5 shrink-0 rounded border border-[var(--sg-color-border)]"
            aria-hidden
          />
        ) : null}
      </span>
      {description ? (
        <span className="text-sm text-[var(--sg-color-text-muted)]">
          {description}
        </span>
      ) : null}
      {badge}
    </button>
  );
}
