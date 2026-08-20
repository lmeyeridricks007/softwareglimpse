import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductLogo } from "@/components/software/product-logo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { getSoftwareBySlug } from "@/data";
import {
  formatMoney,
  fromMajor,
  type CurrencyCode,
} from "@/domain";
import {
  resolveComparisonDestination,
} from "@/services/compare-hub";
import { buildPageMetadata } from "@/seo/metadata";

type PageProps = {
  searchParams: Promise<{ a?: string; b?: string }>;
};

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Build a software comparison",
    description:
      "Compare two software products using verified SoftwareGlimpse recommendations when available.",
    path: "/compare/build/",
    indexable: false,
  });
}

function pricingLabel(slug: string): string {
  const product = getSoftwareBySlug(slug);
  const pricing = product?.pricing;
  if (!pricing || pricing.startingPriceMonthly == null) {
    return "Not yet verified";
  }
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/mo`;
}

export default async function CompareBuildPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const slugA = params.a?.trim();
  const slugB = params.b?.trim();

  if (!slugA || !slugB || slugA === slugB) {
    redirect("/compare/#comparison-builder");
  }

  const destination = resolveComparisonDestination(slugA, slugB);
  if (destination.kind === "published") {
    redirect(destination.href);
  }

  const productA = getSoftwareBySlug(slugA);
  const productB = getSoftwareBySlug(slugB);
  if (!productA || !productB) {
    redirect("/compare/#comparison-builder");
  }

  const sameCategory =
    productA.primaryCategorySlug === productB.primaryCategorySlug;

  const factualRows = [
    {
      label: "Category",
      left: productA.primaryCategorySlug,
      right: productB.primaryCategorySlug,
    },
    {
      label: "Starting price",
      left: pricingLabel(slugA),
      right: pricingLabel(slugB),
    },
    {
      label: "Best for",
      left: productA.bestFor[0] ?? "Not yet verified",
      right: productB.bestFor[0] ?? "Not yet verified",
    },
  ];

  const hasVerifiedPairData =
    sameCategory &&
    (Boolean(productA.bestFor[0]) ||
      productA.pricing?.startingPriceMonthly != null) &&
    (Boolean(productB.bestFor[0]) ||
      productB.pricing?.startingPriceMonthly != null);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare/" },
    {
      name: `${productA.name} vs ${productB.name}`,
      path: `/compare/build/?a=${encodeURIComponent(slugA)}&b=${encodeURIComponent(slugB)}`,
    },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

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
                  <tr
                    key={row.label}
                    className="border-b border-[var(--sg-color-border)]"
                  >
                    <th className="py-3 pr-3 font-medium text-[var(--sg-color-text)]">
                      {row.label}
                    </th>
                    <td className="py-3 pr-3 text-[var(--sg-color-text-muted)]">
                      {row.left}
                    </td>
                    <td className="py-3 text-[var(--sg-color-text-muted)]">
                      {row.right}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 p-6">
          <h2 className="font-semibold text-[var(--sg-color-navy)]">
            We don&apos;t yet have enough verified data for a complete
            comparison
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {!sameCategory
              ? "These products sit in different categories, so shared comparison criteria may not apply cleanly yet."
              : "A head-to-head page will appear once both products have enough normalized evidence."}
          </p>
        </section>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={productA.slug ? `/software/${productA.slug}/` : "/software/"}>
          Read {productA.name} review →
        </ButtonLink>
        <ButtonLink
          href={`/software/${productB.slug}/`}
          variant="outline"
        >
          Read {productB.name} review →
        </ButtonLink>
        <ButtonLink href="/compare/#comparison-builder" variant="ghost">
          Find another comparison
        </ButtonLink>
      </div>
    </>
  );
}
