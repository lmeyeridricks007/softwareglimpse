import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import type { BestHubPageCard } from "@/services/best-hub";
import { cn } from "@/lib/cn";

type Props = {
  featured: BestHubPageCard;
  finderHref?: string | null;
  finderLabel?: string;
  className?: string;
};

export function FeaturedBestGuide({
  featured,
  finderHref,
  finderLabel = "Find My CRM",
  className,
}: Props) {
  return (
    <Section padding="md" background="default" container="wide" className={className}>
      <Card
        className={cn(
          "grid gap-6 border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-6 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-8 lg:p-8",
        )}
      >
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
            <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden />
            Featured buying guide
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-text)] md:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--sg-color-text-muted)]">
            {featured.buyingContext}
          </p>
          <p className="mt-4 text-sm font-medium text-[var(--sg-color-text)]">
            {featured.productCount} products covered
            {featured.updatedLabel ? (
              <span className="font-normal text-[var(--sg-color-text-muted)]">
                {" "}
                · Updated {featured.updatedLabel}
              </span>
            ) : null}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={featured.href}>
              See {featured.title}
              <ArrowRight className="ml-1 size-4" aria-hidden />
            </ButtonLink>
            {finderHref ? (
              <ButtonLink href={finderHref} variant="outline">
                {finderLabel}
              </ButtonLink>
            ) : null}
          </div>

          {featured.popularNeeds.length > 0 ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Popular needs
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {featured.popularNeeds.map((need) => (
                  <li key={need}>
                    <Link
                      href={featured.href}
                      className="inline-flex rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                    >
                      {need}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          {featured.topProducts.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {featured.topProducts.slice(0, 6).map((p) => (
                <li
                  key={p.slug}
                  className="flex flex-col items-center gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-4 shadow-[var(--sg-shadow-sm)]"
                >
                  <ProductLogo name={p.name} logo={p.logo} size="md" />
                  <span className="text-center text-xs font-medium text-[var(--sg-color-text)]">
                    {p.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Card>
    </Section>
  );
}
