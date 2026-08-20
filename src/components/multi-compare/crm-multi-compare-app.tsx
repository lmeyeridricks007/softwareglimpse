"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { canonicalizeComparisonSlug } from "@/domain";
import { cn } from "@/lib/cn";

export type MultiCompareProduct = {
  slug: string;
  name: string;
  href: string;
  shortDescription?: string;
  bestFor?: string;
  logo?: { src: string; alt: string } | null;
};

type Props = {
  products: MultiCompareProduct[];
  publishedPairHrefs: Record<string, string>;
};

const MAX_SELECTED = 4;

export function CrmMultiCompareApp({ products, publishedPairHrefs }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const chosen = useMemo(
    () =>
      selected
        .map((slug) => products.find((p) => p.slug === slug))
        .filter((p): p is MultiCompareProduct => Boolean(p)),
    [products, selected],
  );

  const pairs = useMemo(() => {
    const out: Array<{
      a: MultiCompareProduct;
      b: MultiCompareProduct;
      href: string | null;
    }> = [];
    for (let i = 0; i < chosen.length; i += 1) {
      for (let j = i + 1; j < chosen.length; j += 1) {
        const a = chosen[i]!;
        const b = chosen[j]!;
        const key = canonicalizeComparisonSlug([a.slug, b.slug]);
        out.push({
          a,
          b,
          href: publishedPairHrefs[key] ?? null,
        });
      }
    }
    return out;
  }, [chosen, publishedPairHrefs]);

  function toggle(slug: string) {
    setError(null);
    setSelected((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= MAX_SELECTED) {
        setError(`Select up to ${MAX_SELECTED} CRMs — this is a matrix, not a ranked list.`);
        return current;
      }
      return [...current, slug];
    });
  }

  return (
    <div className="mt-8 space-y-8">
      <fieldset>
        <legend className="font-semibold text-[var(--sg-color-navy)]">
          Select 2–4 published CRM products
        </legend>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Pairwise pages stay the editorial comparison. This matrix does not invent
          a 3- or 4-way winner.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const on = selected.includes(product.slug);
            return (
              <li key={product.slug}>
                <button
                  type="button"
                  onClick={() => toggle(product.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--sg-radius-lg)] border px-3 py-2 text-left text-sm",
                    on
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)]"
                      : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
                  )}
                >
                  <ProductLogo
                    name={product.name}
                    logo={product.logo}
                    size="sm"
                  />
                  <span className="font-medium text-[var(--sg-color-navy)]">
                    {product.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {error ? (
          <p className="mt-3 text-sm text-[var(--sg-color-danger)]">{error}</p>
        ) : null}
      </fieldset>

      {chosen.length >= 2 ? (
        <section className="overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
          <h2 className="font-semibold text-[var(--sg-color-navy)]">
            Job-fit snapshot
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Catalogue positioning only. Affiliate relationships never set order.
          </p>
          <table className="mt-4 w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--sg-color-border)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                <th className="py-2 pr-3 font-semibold">Product</th>
                <th className="py-2 font-semibold">Published fit note</th>
              </tr>
            </thead>
            <tbody>
              {chosen.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-[var(--sg-color-border)]"
                >
                  <th className="py-3 pr-3 font-medium">
                    <Link
                      href={product.href}
                      className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </th>
                  <td className="py-3 text-[var(--sg-color-text-muted)]">
                    {product.bestFor ??
                      product.shortDescription ??
                      "See the product hub — no invented fit line."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="mt-6 font-semibold text-[var(--sg-color-navy)]">
            Existing pairwise comparisons
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {pairs.map((pair) => (
              <li key={`${pair.a.slug}-${pair.b.slug}`}>
                {pair.href ? (
                  <Link
                    href={pair.href}
                    className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {pair.a.name} vs {pair.b.name}
                  </Link>
                ) : (
                  <span className="text-[var(--sg-color-text-muted)]">
                    {pair.a.name} vs {pair.b.name} — no published pairwise page
                    yet. Use the{" "}
                    <Link
                      href="/compare/#comparison-builder"
                      className="underline-offset-2 hover:underline"
                    >
                      comparison builder
                    </Link>
                    .
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/tools/crm-vendor-scorecard/">
              Score vendors with your weights
            </ButtonLink>
            <ButtonLink href="/compare/" variant="outline">
              Comparisons hub
            </ButtonLink>
            <Button type="button" variant="ghost" onClick={() => setSelected([])}>
              Clear selection
            </Button>
          </div>
        </section>
      ) : (
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Choose at least two CRMs to see the matrix.
        </p>
      )}
    </div>
  );
}
