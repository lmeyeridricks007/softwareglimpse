import { formatMoney, type CostComponent, type Money } from "@/domain";
import { cn } from "@/lib/cn";

const KIND_ORDER = [
  "seat",
  "base",
  "addon",
  "minimum",
  "unit",
  "tiered",
  "usage",
  "other",
] as const;

const KIND_LABEL: Record<CostComponent["kind"], string> = {
  seat: "Seats",
  base: "Base platform",
  addon: "Required add-ons",
  minimum: "Plan minimum",
  unit: "Unit fees",
  tiered: "Tiered fees",
  usage: "Usage fees",
  other: "Other published fees",
};

type Props = {
  components: CostComponent[];
  total?: Money;
  className?: string;
  title?: string;
};

function groupComponents(components: CostComponent[]) {
  const map = new Map<CostComponent["kind"], { label: string; money: Money }>();
  for (const c of components) {
    const existing = map.get(c.kind);
    if (!existing) {
      map.set(c.kind, {
        label: KIND_LABEL[c.kind],
        money: { ...c.money },
      });
    } else if (existing.money.currency === c.money.currency) {
      existing.money = {
        amountMinor: existing.money.amountMinor + c.money.amountMinor,
        currency: existing.money.currency,
      };
    }
  }
  return KIND_ORDER.filter((k) => map.has(k)).map((k) => ({
    kind: k,
    ...map.get(k)!,
  }));
}

/**
 * Visual cost breakdown from components only.
 * Missing components are omitted — never shown as $0.
 */
export function PricingBreakdown({
  components,
  total,
  className,
  title = "Where your CRM spend goes",
}: Props) {
  if (components.length === 0) {
    return (
      <div className={cn(className)}>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          {title}
        </h4>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Component-level public pricing is not available for this configuration.
        </p>
      </div>
    );
  }

  const groups = groupComponents(components);
  const sumMinor = groups.reduce((acc, g) => acc + g.money.amountMinor, 0);
  const currency = groups[0]?.money.currency;
  const displayTotal =
    total ??
    (currency
      ? { amountMinor: sumMinor, currency }
      : undefined);

  return (
    <div className={cn(className)}>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {title}
      </h4>

      {sumMinor > 0 && currency ? (
        <div
          className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
          role="img"
          aria-label={groups
            .map((g) => `${g.label}: ${formatMoney(g.money)}`)
            .join("; ")}
        >
          {groups.map((g, i) => {
            const width = Math.max(4, (g.money.amountMinor / sumMinor) * 100);
            const tones = [
              "bg-[var(--sg-color-primary)]",
              "bg-[var(--sg-color-success)]",
              "bg-[var(--sg-color-warning)]",
              "bg-[var(--sg-color-navy)]",
            ];
            return (
              <span
                key={g.kind}
                className={cn("h-full", tones[i % tones.length])}
                style={{ width: `${width}%` }}
                title={`${g.label}: ${formatMoney(g.money)}`}
              />
            );
          })}
        </div>
      ) : null}

      <ul className="mt-3 space-y-2 text-sm">
        {groups.map((g) => (
          <li
            key={g.kind}
            className="flex items-baseline justify-between gap-3 text-[var(--sg-color-text-muted)]"
          >
            <span>{g.label}</span>
            <span className="tabular-nums font-medium text-[var(--sg-color-text)]">
              {formatMoney(g.money)}
            </span>
          </li>
        ))}
        {displayTotal ? (
          <li className="flex items-baseline justify-between gap-3 border-t border-[var(--sg-color-border)] pt-2 font-semibold text-[var(--sg-color-text)]">
            <span>Total</span>
            <span className="tabular-nums">{formatMoney(displayTotal)}</span>
          </li>
        ) : null}
      </ul>
      <p className="mt-2 text-[10px] text-[var(--sg-color-text-muted)]">
        Only verified public components are shown. Omitted lines are not
        assumed to be $0 — they may be included, unknown, or not publicly priced.
      </p>
    </div>
  );
}

/** Thin wrapper kept for older call sites. */
export function CostBreakdown({ components }: { components: CostComponent[] }) {
  return <PricingBreakdown components={components} />;
}
