import type { ToolsHubCalculatorPreview } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

type Props = {
  preview: ToolsHubCalculatorPreview;
  className?: string;
};

export function CalculatorPreview({ preview, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-emerald-200/80 bg-emerald-50/60 p-3",
        className,
      )}
      aria-hidden
    >
      <label className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
        Team members
      </label>
      <div className="mt-1 flex h-9 items-center rounded-[var(--sg-radius-sm)] border border-emerald-200 bg-white px-3 text-sm font-semibold text-[var(--sg-color-text)]">
        {preview.teamSize}
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
        Billing
      </p>
      <div className="mt-1 flex gap-1 rounded-[var(--sg-radius-sm)] border border-emerald-200 bg-white p-0.5 text-xs">
        <span
          className={cn(
            "flex-1 rounded-[var(--sg-radius-sm)] px-2 py-1.5 text-center font-medium",
            preview.billing === "monthly"
              ? "bg-emerald-600 text-white"
              : "text-[var(--sg-color-text-muted)]",
          )}
        >
          Monthly
        </span>
        <span
          className={cn(
            "flex-1 rounded-[var(--sg-radius-sm)] px-2 py-1.5 text-center font-medium",
            preview.billing === "annual"
              ? "bg-emerald-600 text-white"
              : "text-[var(--sg-color-text-muted)]",
          )}
        >
          Annual
        </span>
      </div>
      <div className="mt-3 rounded-[var(--sg-radius-sm)] border border-emerald-200 bg-white px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800/70">
          Estimated cost
        </p>
        {preview.estimatedLabel ? (
          <p className="mt-0.5 text-lg font-bold text-emerald-700">
            {preview.estimatedLabel}
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
            Open calculator to estimate
          </p>
        )}
        {preview.productName && preview.isLiveSample ? (
          <p className="mt-0.5 text-[11px] text-[var(--sg-color-text-muted)]">
            Example: {preview.productName}
          </p>
        ) : null}
      </div>
    </div>
  );
}
