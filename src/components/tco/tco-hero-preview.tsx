import { cn } from "@/lib/cn";

const EXAMPLE_ROWS = [
  { label: "Software", amount: "€43,200", share: "48%" },
  { label: "Implementation", amount: "€12,000", share: null },
  { label: "Migration", amount: "€4,500", share: null },
  { label: "Integrations", amount: "€8,000", share: null },
  { label: "Training", amount: "€3,500", share: null },
  { label: "Administration", amount: "€18,000", share: null },
] as const;

type Props = {
  className?: string;
};

/**
 * Static hero example — labelled as example, not market averages.
 */
export function TcoHeroPreview({ className }: Props) {
  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)]",
        className,
      )}
      aria-label="Example 3-year CRM cost breakdown"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          3-year CRM cost
        </p>
        <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Example
        </span>
      </div>
      <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
        Illustrative only — not market averages.
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        {EXAMPLE_ROWS.map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <dt className="text-[var(--sg-color-text-muted)]">{row.label}</dt>
            <dd className="tabular-nums font-medium text-[var(--sg-color-text)]">
              {row.amount}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 border-t border-[var(--sg-color-border)] pt-2 font-semibold">
          <dt className="text-[var(--sg-color-navy)]">Total</dt>
          <dd className="tabular-nums text-[var(--sg-color-navy)]">€89,200</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Software: <span className="font-medium text-[var(--sg-color-text)]">48%</span>{" "}
        of total
      </p>
    </aside>
  );
}
