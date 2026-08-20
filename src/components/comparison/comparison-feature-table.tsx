import { Check, Minus, X } from "lucide-react";
import type { ComparisonTableRow } from "@/components/editorial/comparison-table";
import { cn } from "@/lib/cn";

type Strength = "strong" | "limited" | "weak" | "tie" | "depends" | "pending";

function classify(value: string): Strength {
  const v = value.toLowerCase();
  if (v.includes("pending")) return "pending";
  if (v.includes("stronger") || v === "yes" || v.includes("excellent")) {
    return "strong";
  }
  if (v.includes("weaker") || v.includes("no ")) return "weak";
  if (v.includes("tie") || v.includes("comparable")) return "tie";
  if (v.includes("depend") || v.includes("situation")) return "depends";
  if (v.includes("limited") || v.includes("basic")) return "limited";
  return "limited";
}

function StrengthIcon({ strength }: { strength: Strength }) {
  if (strength === "strong") {
    return (
      <Check
        className="size-4 shrink-0 text-[var(--sg-color-success)]"
        aria-hidden
      />
    );
  }
  if (strength === "weak") {
    return (
      <X
        className="size-4 shrink-0 text-[var(--sg-color-danger)]"
        aria-hidden
      />
    );
  }
  if (strength === "pending") {
    return (
      <Minus
        className="size-4 shrink-0 text-[var(--sg-color-border-strong)]"
        aria-hidden
      />
    );
  }
  return (
    <Minus
      className="size-4 shrink-0 text-[var(--sg-color-warning)]"
      aria-hidden
    />
  );
}

type Props = {
  productAName: string;
  productBName: string;
  rows: ComparisonTableRow[];
  caption?: string;
  className?: string;
};

/**
 * Feature-style comparison table with status icons (mockup layout).
 */
export function ComparisonFeatureTable({
  productAName,
  productBName,
  rows,
  caption = "Criterion-by-criterion comparison",
  className,
}: Props) {
  if (rows.length === 0) return null;

  return (
    <section
      id="features"
      aria-labelledby="feature-compare-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="feature-compare-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Feature comparison
        </h2>
        <ul className="flex flex-wrap gap-3 text-xs text-[var(--sg-color-text-muted)]">
          <li className="inline-flex items-center gap-1">
            <StrengthIcon strength="strong" /> Stronger
          </li>
          <li className="inline-flex items-center gap-1">
            <StrengthIcon strength="limited" /> Limited / depends
          </li>
          <li className="inline-flex items-center gap-1">
            <StrengthIcon strength="weak" /> Weaker
          </li>
        </ul>
      </div>

      <ul className="mt-4 space-y-4 md:hidden">
        {rows.map((row) => (
          <li
            key={row.criterionSlug}
            id={row.criterionSlug}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
          >
            <h3 className="font-medium text-[var(--sg-color-text)]">
              {row.criterionName}
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-[var(--sg-color-text-muted)]">
                  {productAName}
                </dt>
                <dd className="mt-1 flex gap-2">
                  <StrengthIcon strength={classify(row.productAValue)} />
                  <span>{row.productAValue}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--sg-color-text-muted)]">
                  {productBName}
                </dt>
                <dd className="mt-1 flex gap-2">
                  <StrengthIcon strength={classify(row.productBValue)} />
                  <span>{row.productBValue}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--sg-color-text-muted)]">Winner</dt>
                <dd className="mt-1 font-medium">{row.winnerLabel}</dd>
              </div>
              {row.notes ? (
                <div>
                  <dt className="text-[var(--sg-color-text-muted)]">Notes</dt>
                  <dd className="mt-1 text-[var(--sg-color-text-muted)]">
                    {row.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </li>
        ))}
      </ul>

      <div className="mt-5 hidden overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] md:block">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-[var(--sg-color-border)]">
              <th
                scope="col"
                className="bg-[var(--sg-color-surface-muted)] px-4 py-3 font-medium"
              >
                Criterion
              </th>
              <th
                scope="col"
                className="bg-[var(--sg-color-primary-soft)]/60 px-4 py-3 font-medium"
              >
                {productAName}
              </th>
              <th
                scope="col"
                className="bg-[var(--sg-color-danger-soft)]/50 px-4 py-3 font-medium"
              >
                {productBName}
              </th>
              <th
                scope="col"
                className="bg-[var(--sg-color-surface-muted)] px-4 py-3 font-medium"
              >
                Winner
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.criterionSlug}
                id={row.criterionSlug}
                className="border-b border-[var(--sg-color-border)] align-top last:border-0"
              >
                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-[var(--sg-color-text)]"
                >
                  {row.criterionName}
                  {row.notes ? (
                    <p className="mt-1 text-xs font-normal text-[var(--sg-color-text-muted)]">
                      {row.notes}
                    </p>
                  ) : null}
                </th>
                <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                  <span className="inline-flex gap-2">
                    <StrengthIcon strength={classify(row.productAValue)} />
                    {row.productAValue}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                  <span className="inline-flex gap-2">
                    <StrengthIcon strength={classify(row.productBValue)} />
                    {row.productBValue}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                  {row.winnerLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
