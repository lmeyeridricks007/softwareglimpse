"use client";

import { useState } from "react";
import Link from "next/link";
import { EvidenceMark } from "@/components/industries/evidence-mark";
import { ProductLogo } from "@/components/software/product-logo";
import type { EvidenceCell } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

type Group = {
  id: string;
  title: string;
  rows: Array<{
    featureSlug: string;
    featureName: string;
    href?: string | null;
    cells: EvidenceCell[];
  }>;
};

type Product = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  title?: string;
  products: Product[];
  groups: Group[];
  className?: string;
};

export function IndustryCapabilityMatrix({
  title = "Key CRM capabilities to compare",
  products,
  groups,
  className,
}: Props) {
  const [active, setActive] = useState(groups[0]?.id ?? "");
  const current = groups.find((g) => g.id === active) ?? groups[0];

  if (products.length === 0 || groups.length === 0 || !current) return null;

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="capabilities-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Cells reflect product evidence. Unknown support is shown as a dash —
        never as a hard “no”.
      </p>

      <div
        role="tablist"
        aria-label="Capability groups"
        className="mt-5 flex flex-wrap gap-2"
      >
        {groups.map((group) => {
          const selected = group.id === current.id;
          return (
            <button
              key={group.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(group.id)}
              className={cn(
                "rounded-[var(--sg-radius-pill)] px-3 py-1.5 text-sm font-medium transition-colors",
                selected
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
              )}
            >
              {group.title}
            </button>
          );
        })}
      </div>

      <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Capability
              </th>
              {products.map((p) => (
                <th key={p.slug} className="px-4 py-3 text-center font-semibold">
                  <Link
                    href={`/software/${p.slug}/`}
                    className="inline-flex flex-col items-center gap-1 hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    <span>{p.name}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row) => (
              <tr
                key={row.featureSlug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {row.featureName}
                    </Link>
                  ) : (
                    row.featureName
                  )}
                </td>
                {row.cells.map((cell, i) => (
                  <td
                    key={`${row.featureSlug}-${products[i]?.slug ?? i}`}
                    className="px-4 py-3"
                  >
                    <span className="flex justify-center">
                      <EvidenceMark cell={cell} />
                    </span>
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
