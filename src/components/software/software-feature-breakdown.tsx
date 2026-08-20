import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

export type FeatureBreakdownRow = {
  slug: string;
  name: string;
  available: "yes" | "limited" | "no" | "unknown";
  planLabel?: string | null;
  take?: string | null;
};

type Props = {
  productName: string;
  rows: FeatureBreakdownRow[];
  className?: string;
};

function AvailabilityCell({ value }: { value: FeatureBreakdownRow["available"] }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sg-color-success)]">
        <Check className="size-4" aria-hidden />
        Yes
      </span>
    );
  }
  if (value === "limited") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sg-color-warning)]">
        <Minus className="size-4" aria-hidden />
        Limited
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="text-sm text-[var(--sg-color-text-muted)]" aria-label="Not available">
        —
      </span>
    );
  }
  return (
    <span className="text-sm text-[var(--sg-color-text-muted)]">Unknown</span>
  );
}

export function SoftwareFeatureBreakdown({
  productName,
  rows,
  className,
}: Props) {
  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="feature-breakdown-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="feature-breakdown-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Feature breakdown
      </h2>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        How key capabilities map across {productName} plans and availability.
      </p>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
        <table className="min-w-full divide-y divide-[var(--sg-color-border)] text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]"
              >
                Feature
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]"
              >
                Available
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]"
              >
                Starting plan
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]"
              >
                Our take
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
            {rows.map((row) => (
              <tr key={row.slug}>
                <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                  {row.name}
                </td>
                <td className="px-4 py-3">
                  <AvailabilityCell value={row.available} />
                </td>
                <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                  {row.planLabel ?? "—"}
                </td>
                <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                  {row.take ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
