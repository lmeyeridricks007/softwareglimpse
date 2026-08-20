import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type BestQuickPick = {
  label: string;
  productName: string;
  href: string;
  provisional?: boolean;
};

export type BestSidebarComparison = {
  href: string;
  title: string;
  products: Array<{ name: string; logo?: { src: string; alt: string } | null }>;
};

export type BestSidebarGuide = {
  href: string;
  label: string;
  description?: string;
};

type Props = {
  quickPicks: BestQuickPick[];
  comparisons: BestSidebarComparison[];
  guides: BestSidebarGuide[];
  compareAllHref?: string;
  className?: string;
};

export function BestSidebar({
  quickPicks,
  comparisons,
  guides,
  compareAllHref = "/compare/",
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {quickPicks.length > 0 ? (
        <Card aria-labelledby="best-quick-picks-heading">
          <h2
            id="best-quick-picks-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Quick picks
          </h2>
          <ul className="mt-3 space-y-3">
            {quickPicks.map((pick) => (
              <li
                key={`${pick.label}-${pick.href}`}
                className="border-b border-[var(--sg-color-border)] pb-3 last:border-0 last:pb-0"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {pick.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--sg-color-text)]">
                  {pick.productName}
                </p>
                <Link
                  href={pick.href}
                  className="mt-1 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Read review →
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {comparisons.length > 0 ? (
        <Card aria-labelledby="best-compare-heading">
          <h2
            id="best-compare-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Compare top software
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
            href={compareAllHref}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all comparisons
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      {guides.length > 0 ? (
        <Card aria-labelledby="best-resources-heading">
          <h2
            id="best-resources-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Resources
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

      <NewsletterCard source="article-inline" hideWhenDisabled />
    </aside>
  );
}
