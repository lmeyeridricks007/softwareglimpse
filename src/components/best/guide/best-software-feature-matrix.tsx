import Link from "next/link";
import { Check, Minus, HelpCircle } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

type Cell = "yes" | "limited" | "no" | "higher-plan" | "unknown";

type Props = {
  heading: string;
  products: Array<{
    slug: string;
    name: string;
    href: string;
    logo?: { src: string; alt: string } | null;
  }>;
  rows: Array<{
    featureSlug: string;
    featureName: string;
    featureHref?: string;
    cells: Cell[];
  }>;
  className?: string;
};

export function BestSoftwareFeatureMatrix({
  heading,
  products,
  rows,
  className,
}: Props) {
  if (products.length === 0 || rows.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Cells reflect feature support. Incomplete evidence stays
        marked as incomplete — never converted into “No”.
      </p>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[40rem] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-10 bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Capability
              </th>
              {products.map((p) => (
                <th key={p.slug} className="px-4 py-3 text-center font-semibold">
                  <Link
                    href={p.href}
                    className="inline-flex flex-col items-center gap-1.5 hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    <span>{p.name}</span>
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
                <td className="sticky left-0 z-10 bg-[var(--sg-color-surface)] px-4 py-3">
                  {row.featureHref ? (
                    <Link
                      href={row.featureHref}
                      className="font-medium underline-offset-2 hover:underline"
                    >
                      {row.featureName}
                    </Link>
                  ) : (
                    row.featureName
                  )}
                </td>
                {row.cells.map((cell, i) => (
                  <td
                    key={`${row.featureSlug}-${i}`}
                    className="px-4 py-3 text-center"
                  >
                    <CellIcon cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--sg-color-text-muted)]">
        <li>✓ Strong / supported</li>
        <li>~ Limited / depends</li>
        <li>$ Higher plan</li>
        <li>× Not supported</li>
        <li>? Evidence incomplete</li>
      </ul>
    </div>
  );
}

function CellIcon({ cell }: { cell: Cell }) {
  if (cell === "yes") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5 text-[var(--sg-color-success)]">
        <Check className="size-4" aria-hidden />
        <span className="text-[10px]">Strong</span>
      </span>
    );
  }
  if (cell === "limited") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5 text-amber-700">
        <span aria-hidden>~</span>
        <span className="text-[10px]">Limited</span>
      </span>
    );
  }
  if (cell === "higher-plan") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5 text-[var(--sg-color-text-muted)]">
        <span aria-hidden>$</span>
        <span className="text-[10px]">Higher plan</span>
      </span>
    );
  }
  if (cell === "no") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5 text-[var(--sg-color-text-muted)]">
        <Minus className="size-4" aria-hidden />
        <span className="text-[10px]">Not supported</span>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-center gap-0.5 text-[var(--sg-color-text-muted)]">
      <HelpCircle className="size-3.5" aria-hidden />
      <span className="text-[10px]">Incomplete</span>
    </span>
  );
}
