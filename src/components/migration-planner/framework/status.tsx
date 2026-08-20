import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const FIELD_STATUS: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "neutral" | "primary" }
> = {
  mapped: { label: "Mapped", variant: "success" },
  "needs-review": { label: "Needs review", variant: "warning" },
  "no-target-field": { label: "No target field", variant: "danger" },
  "transformation-needed": {
    label: "Transformation needed",
    variant: "warning",
  },
  "do-not-migrate": { label: "Do not migrate", variant: "neutral" },
  suggested: { label: "Suggested", variant: "primary" },
  unknown: { label: "Unknown", variant: "neutral" },
};

const SEVERITY: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "neutral" }
> = {
  low: { label: "Low", variant: "neutral" },
  medium: { label: "Medium", variant: "warning" },
  high: { label: "High", variant: "danger" },
  blocker: { label: "Blocker", variant: "danger" },
};

export function FieldStatusChip({ status }: { status: string }) {
  const meta = FIELD_STATUS[status] ?? FIELD_STATUS.unknown;
  return (
    <Badge variant={meta.variant} className="whitespace-nowrap">
      <span className="sr-only">Status: </span>
      {meta.label}
    </Badge>
  );
}

export function SeverityChip({ severity }: { severity: string }) {
  const meta = SEVERITY[severity] ?? SEVERITY.medium;
  return (
    <Badge variant={meta.variant}>
      <span className="sr-only">Severity: </span>
      {meta.label}
    </Badge>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number | null;
  label: string;
  className?: string;
}) {
  const pct = value ?? 0;
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2 text-[11px] text-[var(--sg-color-text-muted)]">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums" aria-live="polite">
          {value === null ? "—" : `${value}%`}
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
        role="progressbar"
        aria-valuenow={value ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-[var(--sg-color-primary)] transition-[width] duration-300"
          style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        />
      </div>
    </div>
  );
}
