import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  products: Array<{ slug: string; name: string }>;
  rows: Array<{
    featureSlug: string;
    featureName: string;
    cells: Array<"yes" | "no" | "unknown">;
  }>;
  className?: string;
};

/** Only render when every cell is verified (caller gates unknown). */
export function CategoryFeatureMatrix({
  title,
  products,
  rows,
  className,
}: Props) {
  if (products.length === 0 || rows.length === 0) return null;

  return (
    <section
      id="feature-matrix"
      aria-labelledby="feature-matrix-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="feature-matrix-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.slug}
                  className="px-4 py-3 text-center font-semibold text-[var(--sg-color-text)]"
                >
                  <Link
                    href={`/software/${p.slug}/`}
                    className="hover:text-[var(--sg-color-primary)]"
                  >
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.featureSlug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="px-4 py-3 text-[var(--sg-color-text)]">
                  {row.featureName}
                </td>
                {row.cells.map((cell, i) => (
                  <td key={`${row.featureSlug}-${i}`} className="px-4 py-3 text-center">
                    {cell === "yes" ? (
                      <Check
                        className="mx-auto size-4 text-[var(--sg-color-success)]"
                        aria-label="Available"
                      />
                    ) : cell === "no" ? (
                      <X
                        className="mx-auto size-4 text-[var(--sg-color-text-muted)]"
                        aria-label="Not available"
                      />
                    ) : (
                      <span className="text-[var(--sg-color-text-muted)]">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
