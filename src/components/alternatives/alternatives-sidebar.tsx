import Link from "next/link";
import { CheckCircle2, ChevronRight, FileText, Lock } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type AlternativesWhyItem = string;

export type AlternativesSidebarComparison = {
  href: string;
  title: string;
  products: Array<{ name: string; logo?: { src: string; alt: string } | null }>;
};

export type AlternativesSidebarGuide = {
  href: string;
  label: string;
  description?: string;
};

type Props = {
  sourceName: string;
  whyItems: AlternativesWhyItem[];
  finder?: {
    href: string;
    title: string;
    body: string;
    ctaLabel: string;
  };
  comparisons: AlternativesSidebarComparison[];
  guides: AlternativesSidebarGuide[];
  className?: string;
};

export function AlternativesSidebar({
  sourceName,
  whyItems,
  finder,
  comparisons,
  guides,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {whyItems.length > 0 ? (
        <Card aria-labelledby="alt-why-heading">
          <h2
            id="alt-why-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Why look for an alternative?
          </h2>
          <ul className="mt-3 space-y-2.5">
            {whyItems.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]">
                <CheckCircle2
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                <span>
                  <span className="sr-only">{sourceName}: </span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {finder ? (
        <Card
          className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/60"
          aria-labelledby="alt-finder-heading"
        >
          <div className="flex gap-2">
            <Lock
              className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
              aria-hidden
            />
            <div>
              <h2
                id="alt-finder-heading"
                className="text-sm font-semibold text-[var(--sg-color-text)]"
              >
                {finder.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {finder.body}
              </p>
              <ButtonLink href={finder.href} className="mt-4 w-full justify-center">
                {finder.ctaLabel}
              </ButtonLink>
              <p className="mt-2 text-center text-xs text-[var(--sg-color-text-muted)]">
                Takes a few minutes · no signup required
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {comparisons.length > 0 ? (
        <Card aria-labelledby="alt-compare-heading">
          <h2
            id="alt-compare-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Popular comparisons
          </h2>
          <ul className="mt-3 space-y-3">
            {comparisons.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block">
                  <span className="flex items-center gap-1">
                    {item.products.slice(0, 2).map((p) => (
                      <ProductLogo
                        key={p.name}
                        name={p.name}
                        logo={p.logo}
                        size="sm"
                      />
                    ))}
                  </span>
                  <span className="mt-1.5 block text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/compare/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all comparisons
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      {guides.length > 0 ? (
        <Card aria-labelledby="alt-guides-heading">
          <h2
            id="alt-guides-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Buying guides
          </h2>
          <ul className="mt-3 space-y-3">
            {guides.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-start gap-2">
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  <span>
                    <span className="block text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/guides/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all guides
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}
    </aside>
  );
}
