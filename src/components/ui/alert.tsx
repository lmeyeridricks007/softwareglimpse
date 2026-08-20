import { cn } from "@/lib/cn";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

const variants = {
  info: {
    className:
      "border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] text-[var(--sg-color-text)]",
    Icon: Info,
  },
  success: {
    className:
      "border-[var(--sg-color-success)]/20 bg-[var(--sg-color-success-soft)] text-[var(--sg-color-text)]",
    Icon: CheckCircle2,
  },
  warning: {
    className:
      "border-[var(--sg-color-warning)]/20 bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-text)]",
    Icon: TriangleAlert,
  },
  danger: {
    className:
      "border-[var(--sg-color-danger)]/20 bg-[var(--sg-color-danger-soft)] text-[var(--sg-color-text)]",
    Icon: AlertCircle,
  },
} as const;

type Props = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  title?: string;
  className?: string;
};

export function Alert({
  children,
  variant = "info",
  title,
  className,
}: Props) {
  const { className: tone, Icon } = variants[variant];
  return (
    <div
      role="status"
      className={cn(
        "flex gap-3 rounded-[var(--sg-radius-lg)] border p-4 text-sm",
        tone,
        className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0 opacity-80" aria-hidden />
      <div>
        {title ? <p className="font-medium">{title}</p> : null}
        <div className={cn(title && "mt-1", "text-[var(--sg-color-text-muted)]")}>
          {children}
        </div>
      </div>
    </div>
  );
}
