import { cn } from "@/lib/cn";

const variants = {
  neutral:
    "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]",
  primary:
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
  success:
    "bg-[var(--sg-color-success-soft)] text-[var(--sg-color-success)]",
  warning:
    "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  danger: "bg-[var(--sg-color-danger-soft)] text-[var(--sg-color-danger)]",
  promotion:
    "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
  "editorial-choice":
    "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]",
} as const;

type Props = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--sg-radius-pill)] px-2.5 py-0.5 text-[var(--sg-text-caption)] font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
