import type { EvidenceCell } from "@/services/industry-hub";
import { Check, Minus, CircleDashed } from "lucide-react";
import { cn } from "@/lib/cn";

const LABELS: Record<EvidenceCell, string> = {
  supported: "Supported",
  partial: "Partial / depends",
  unknown: "Unknown",
  "not-supported": "Not supported",
};

/**
 * Evidence-aware cell: never treat unknown as a hard "No".
 */
export function EvidenceMark({
  cell,
  className,
  variant = "icon",
}: {
  cell: EvidenceCell;
  className?: string;
  /** `chip` adds a tinted pill for matrix tables. */
  variant?: "icon" | "chip";
}) {
  if (variant === "chip") {
    return <EvidenceChip cell={cell} className={className} />;
  }

  if (cell === "supported") {
    return (
      <Check
        className={cn("size-4 text-[var(--sg-color-success)]", className)}
        aria-label={LABELS.supported}
      />
    );
  }
  if (cell === "partial") {
    return (
      <span
        className={cn(
          "text-sm font-semibold text-[var(--sg-color-warning)]",
          className,
        )}
        aria-label={LABELS.partial}
      >
        ~
      </span>
    );
  }
  return (
    <Minus
      className={cn("size-4 text-[var(--sg-color-text-muted)]", className)}
      aria-label={LABELS[cell]}
    />
  );
}

function EvidenceChip({
  cell,
  className,
}: {
  cell: EvidenceCell;
  className?: string;
}) {
  if (cell === "supported") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[var(--sg-color-success-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sg-color-success)]",
          className,
        )}
        aria-label={LABELS.supported}
      >
        <Check className="size-3.5" aria-hidden />
        Yes
      </span>
    );
  }
  if (cell === "partial") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[var(--sg-color-warning-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sg-color-warning)]",
          className,
        )}
        aria-label={LABELS.partial}
      >
        <CircleDashed className="size-3.5" aria-hidden />
        Partial
      </span>
    );
  }
  if (cell === "not-supported") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[var(--sg-color-danger-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--sg-color-danger)]",
          className,
        )}
        aria-label={LABELS["not-supported"]}
      >
        <Minus className="size-3.5" aria-hidden />
        No
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--sg-color-text-muted)]",
        className,
      )}
      aria-label={LABELS.unknown}
      title="Insufficient evidence — not the same as unsupported"
    >
      <Minus className="size-3.5" aria-hidden />
      Unknown
    </span>
  );
}

export function EvidenceLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--sg-color-text-muted)]",
        className,
      )}
    >
      <li className="inline-flex items-center gap-1.5">
        <EvidenceMark cell="supported" variant="chip" />
        <span>Supported</span>
      </li>
      <li className="inline-flex items-center gap-1.5">
        <EvidenceMark cell="partial" variant="chip" />
        <span>Partial / depends</span>
      </li>
      <li className="inline-flex items-center gap-1.5">
        <EvidenceMark cell="unknown" variant="chip" />
        <span>Insufficient evidence</span>
      </li>
      <li className="inline-flex items-center gap-1.5">
        <EvidenceMark cell="not-supported" variant="chip" />
        <span>Not supported</span>
      </li>
    </ul>
  );
}
