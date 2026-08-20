import { cn } from "@/lib/cn";

const EXAMPLE_ROWS = [
  { label: "CRM", value: "Pipedrive" },
  { label: "Users", value: "25" },
  { label: "Migration", value: "Medium" },
  { label: "Integrations", value: "4" },
  { label: "Target", value: "10 weeks" },
  { label: "Phases", value: "8" },
  { label: "Tasks", value: "42" },
  { label: "Risks", value: "3" },
] as const;

type Props = { className?: string };

/** Static hero example — labelled until real plan data exists. */
export function ImplementationHeroPreview({ className }: Props) {
  return (
    <aside
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-md)]",
        className,
      )}
      aria-label="Example implementation summary"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Your implementation
        </p>
        <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-surface-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Example
        </span>
      </div>
      <p className="mt-1 text-[11px] text-[var(--sg-color-text-muted)]">
        Illustrative only — replaced by your plan when generated.
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {EXAMPLE_ROWS.map((row) => (
          <div key={row.label}>
            <dt className="text-[11px] text-[var(--sg-color-text-muted)]">
              {row.label}
            </dt>
            <dd className="font-semibold text-[var(--sg-color-navy)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
