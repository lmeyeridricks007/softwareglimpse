"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EvidenceMark } from "@/components/industries/evidence-mark";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Button } from "@/components/ui/button";
import type { EvidenceCell } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

export type IndustryCompareRow = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  pricingTeaser: string | null;
  pipeline: EvidenceCell;
  automation: EvidenceCell;
  reporting: EvidenceCell;
  integrations: EvidenceCell;
  positioning: string | null;
};

type Props = {
  title?: string;
  rows: IndustryCompareRow[];
  className?: string;
};

export function IndustryCompareTable({
  title = "Compare CRM options",
  rows,
  className,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const canCompare = selected.length >= 2;

  const compareHref = useMemo(() => {
    if (selected.length < 2) return null;
    const [a, b] = selected;
    return `/compare/build/?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`;
  }, [selected]);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 2) return [prev[1]!, slug];
      return [...prev, slug];
    });
  }

  if (rows.length === 0) return null;

  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="compare-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Select products to compare
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold">Starting price</th>
              <th className="px-4 py-3 text-center font-semibold">Pipeline</th>
              <th className="px-4 py-3 text-center font-semibold">Automation</th>
              <th className="px-4 py-3 text-center font-semibold">Reporting</th>
              <th className="px-4 py-3 text-center font-semibold">Integrations</th>
              <th className="px-4 py-3 text-left font-semibold">Best suited to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const checked = selected.includes(row.slug);
              return (
                <tr
                  key={row.slug}
                  className="border-t border-[var(--sg-color-border)]"
                >
                  <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(row.slug)}
                        className="size-4 rounded border-[var(--sg-color-border)]"
                        aria-label={`Select ${row.name} to compare`}
                      />
                      <ProductLogo name={row.name} logo={row.logo} size="sm" />
                      <span className="font-medium">{row.name}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                    {row.pricingTeaser ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex justify-center">
                      <EvidenceMark cell={row.pipeline} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex justify-center">
                      <EvidenceMark cell={row.automation} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex justify-center">
                      <EvidenceMark cell={row.reporting} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex justify-center">
                      <EvidenceMark cell={row.integrations} />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                    {row.positioning ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={!canCompare}
          onClick={() => {
            if (compareHref) router.push(compareHref);
          }}
        >
          {withSingleArrow("Compare selected CRMs")}
        </Button>
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          {selected.length === 0
            ? "Select two products to open a side-by-side comparison."
            : selected.length === 1
              ? "Select one more product."
              : "Ready to compare."}
        </p>
      </div>
    </section>
  );
}
