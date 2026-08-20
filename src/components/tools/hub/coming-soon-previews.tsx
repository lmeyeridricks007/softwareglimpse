import { Check } from "lucide-react";
import type { ToolsHubCalculatorPreview } from "@/services/tools-hub";
import { cn } from "@/lib/cn";

/** Static coming-soon stack cost illustration — not interactive. */
export function ComingSoonCostPreview({
  className,
}: {
  className?: string;
}) {
  const rows = [
    { label: "CRM", amount: "—" },
    { label: "Project management", amount: "—" },
    { label: "Email marketing", amount: "—" },
    { label: "Customer support", amount: "—" },
  ];

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-orange-200/80 bg-orange-50/50 p-3",
        className,
      )}
      aria-hidden
    >
      <ul className="space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between text-xs text-[var(--sg-color-text-muted)]"
          >
            <span>{row.label}</span>
            <span className="font-medium">{row.amount}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 border-t border-orange-200 pt-2 flex items-center justify-between text-xs font-semibold text-[var(--sg-color-text)]">
        <span>Estimated monthly</span>
        <span>—</span>
      </div>
    </div>
  );
}

export function ComingSoonFinderPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-md)] border border-violet-200/80 bg-violet-50/40 p-3",
        className,
      )}
      aria-hidden
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700/70">
        Describe your needs
      </p>
      <div className="mt-2 h-16 rounded-[var(--sg-radius-sm)] border border-dashed border-violet-300 bg-white/80" />
      <ul className="mt-2 space-y-1">
        {["Categories", "Products", "Next steps"].map((step) => (
          <li
            key={step}
            className="flex items-center gap-1.5 text-xs text-violet-800/80"
          >
            <Check className="size-3 opacity-50" />
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Re-export type usage helper for tool cards that need calculator props. */
export type CalculatorPreviewProps = ToolsHubCalculatorPreview;
