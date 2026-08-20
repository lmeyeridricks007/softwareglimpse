import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CategoryComparisonCardItem = {
  href: string;
  title: string;
  products: Array<{
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
};

type Props = {
  title: string;
  items: CategoryComparisonCardItem[];
  className?: string;
};

export function CategoryComparisonsRow({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="category-comparisons-heading" className={cn(className)}>
      <h2
        id="category-comparisons-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full items-center gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {item.products.slice(0, 2).map((p, i) => (
                    <span key={p.name} className="inline-flex items-center gap-2">
                      {i > 0 ? (
                        <span className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
                          vs
                        </span>
                      ) : null}
                      <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    </span>
                  ))}
                  <span className="min-w-0 truncate text-sm font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {item.title}
                  </span>
                </div>
                <ChevronRight
                  className="size-4 shrink-0 text-[var(--sg-color-text-muted)] group-hover:text-[var(--sg-color-primary)]"
                  aria-hidden
                />
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
