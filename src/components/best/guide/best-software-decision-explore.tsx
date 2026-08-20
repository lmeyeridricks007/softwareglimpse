"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import type { BestPageModel, BestPageProductRef } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  explore: NonNullable<BestPageModel["decisionExplore"]>;
  /** Fallback shortlist preview when a priority is selected. */
  productsByPriority: Record<string, BestPageProductRef[]>;
  className?: string;
};

/**
 * Compact decision explorer. Does NOT run a separate recommendation algorithm —
 * it surfaces priority mappings and hands off to the CRM Finder.
 */
export function BestSoftwareDecisionExplore({
  explore,
  productsByPriority,
  className,
}: Props) {
  const [selected, setSelected] = useState<string | null>(
    explore.paths[0]?.priority ?? null,
  );

  const active = explore.paths.find((p) => p.priority === selected) ?? null;
  const related = useMemo(() => {
    if (!active) return [];
    const fromMap = productsByPriority[active.priority] ?? [];
    if (fromMap.length > 0) return fromMap.slice(0, 3);
    return [active.product];
  }, [active, productsByPriority]);

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {explore.heading}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        {explore.intro}
      </p>

      <p className="mt-5 text-sm font-semibold text-[var(--sg-color-text)]">
        What matters most?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {explore.paths.map((path) => {
          const isActive = path.priority === selected;
          return (
            <button
              key={path.priority}
              type="button"
              onClick={() => setSelected(path.priority)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]/50",
              )}
            >
              {path.priority}
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="mt-6 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-text-muted)]">
            Recommended shortlist
          </p>
          {active.label ? (
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Starting point: {active.label}
            </p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {related.map((product) => (
              <li key={product.slug} className="flex items-center gap-3">
                <ProductLogo
                  name={product.name}
                  logo={product.logo}
                  size="sm"
                />
                <Link
                  href={product.href}
                  className="font-semibold underline-offset-2 hover:underline"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
          {explore.finderHref ? (
            <div className="mt-5">
              <ButtonLink href={explore.finderHref}>
                {explore.finderLabel ?? "Get a detailed recommendation"} →
              </ButtonLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
