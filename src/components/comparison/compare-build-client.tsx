"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductLogo } from "@/components/software/product-logo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";

export type CompareBuildProduct = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  primaryCategorySlug: string;
  bestFor: string | null;
  priceLabel: string;
};

type Props = {
  products: CompareBuildProduct[];
  publishedSlugs: string[];
};

export function CompareBuildClient({ products, publishedSlugs }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const slugA = params.get("a")?.trim() ?? "";
  const slugB = params.get("b")?.trim() ?? "";
  const published = useMemo(() => new Set(publishedSlugs), [publishedSlugs]);
  const bySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );

  const destination = useMemo(() => {
    if (!slugA || !slugB || slugA === slugB) return { kind: "builder" as const };
    const canonical = canonicalizeComparisonSlug([slugA, slugB]);
    if (published.has(canonical)) {
      return { kind: "published" as const, href: `/compare/${canonical}/` };
    }
    const productA = bySlug.get(slugA);
    const productB = bySlug.get(slugB);
    if (!productA || !productB) return { kind: "builder" as const };
    return { kind: "pair" as const, productA, productB };
  }, [bySlug, published, slugA, slugB]);

  useEffect(() => {
    if (destination.kind === "builder") {
      router.replace("/compare/#comparison-builder");
      return;
    }
    if (destination.kind === "published") {
      router.replace(destination.href);
    }
  }, [destination, router]);

  if (destination.kind !== "pair") {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]" role="status">
        Opening comparison…
      </p>
    );
  }

  const { productA, productB } = destination;
  const sameCategory = productA.primaryCategorySlug === productB.primaryCategorySlug;
  const factualRows = [
    {
      label: "Category",
      left: productA.primaryCategorySlug,
      right: productB.primaryCategorySlug,
    },
    {
      label: "Starting price",
      left: productA.priceLabel,
      right: productB.priceLabel,
    },
    {
      label: "Best for",
      left: productA.bestFor ?? "Not yet verified",
      right: productB.bestFor ?? "Not yet verified",
    },
  ];
  const hasVerifiedPairData =
    sameCategory &&
    (Boolean(productA.bestFor) || productA.priceLabel !== "Not yet verified") &&
    (Boolean(productB.bestFor) || productB.priceLabel !== "Not yet verified");

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare/" },
          {
            name: `${productA.name} vs ${productB.name}`,
            path: `/compare/build/?a=${encodeURIComponent(productA.slug)}&b=${encodeURIComponent(productB.slug)}`,
          },
        ]}
      />
      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-primary)]">
          Comparison builder
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold text-[var(--sg-color-navy)]">
          {productA.name} vs {productB.name}
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--sg-color-text-muted)]">
          We don&apos;t invent comparison winners. Below is only verified
          catalogue data we currently have for this pair.
        </p>
      </header>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        <span className="inline-flex items-center gap-3 text-lg font-semibold">
          <ProductLogo name={productA.name} logo={productA.logo} size="md" />
          {productA.name}
        </span>
        <span className="text-sm font-bold uppercase text-[var(--sg-color-text-muted)]">
          vs
        </span>
        <span className="inline-flex items-center gap-3 text-lg font-semibold">
          <ProductLogo name={productB.name} logo={productB.logo} size="md" />
          {productB.name}
        </span>
      </div>
      {hasVerifiedPairData ? (
        <section className="mt-8 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
          <h2 className="font-semibold text-[var(--sg-color-navy)]">
            Here&apos;s the verified data we currently have
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            This is not a finished editorial comparison — no overall winner is
            claimed.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--sg-color-border)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  <th className="py-2 pr-3 font-semibold">Criterion</th>
                  <th className="py-2 pr-3 font-semibold">{productA.name}</th>
                  <th className="py-2 font-semibold">{productB.name}</th>
                </tr>
              </thead>
              <tbody>
                {factualRows.map((row) => (
                  <tr key={row.label} className="border-b border-[var(--sg-color-border)]">
                    <th className="py-3 pr-3 font-medium text-[var(--sg-color-text)]">
                      {row.label}
                    </th>
                    <td className="py-3 pr-3 text-[var(--sg-color-text-muted)]">{row.left}</td>
                    <td className="py-3 text-[var(--sg-color-text-muted)]">{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 p-6">
          <h2 className="font-semibold text-[var(--sg-color-navy)]">
            We don&apos;t yet have enough verified data for a complete comparison
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {!sameCategory
              ? "These products sit in different categories, so shared comparison criteria may not apply cleanly yet."
              : "A head-to-head page will appear once both products have enough normalized evidence."}
          </p>
        </section>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`/software/${productA.slug}/`}>
          Read {productA.name} review →
        </ButtonLink>
        <ButtonLink href={`/software/${productB.slug}/`} variant="outline">
          Read {productB.name} review →
        </ButtonLink>
        <ButtonLink href="/compare/#comparison-builder" variant="ghost">
          Find another comparison
        </ButtonLink>
      </div>
    </>
  );
}
