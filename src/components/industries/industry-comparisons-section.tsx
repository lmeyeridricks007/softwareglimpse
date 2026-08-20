import Link from "next/link";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Comparison = {
  href: string;
  title: string;
  products: Array<{
    name: string;
    slug: string;
    logo?: { src: string; alt: string } | null;
  }>;
};

type Props = {
  title?: string;
  items: Comparison[];
  className?: string;
};

export function IndustryComparisonsSection({
  title = "Popular CRM comparisons",
  items,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="comparisons"
      aria-labelledby="comparisons-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="comparisons-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        <Link
          href="/compare/"
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow("View all comparisons")}
        </Link>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full flex-col p-4">
                <div className="flex items-center gap-2">
                  {item.products.slice(0, 2).map((p, i) => (
                    <span
                      key={p.slug}
                      className="inline-flex items-center gap-2"
                    >
                      {i > 0 ? (
                        <span className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
                          vs
                        </span>
                      ) : null}
                      <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  Side-by-side comparison on shared CRM criteria.
                </p>
                <span className="mt-auto pt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow("Compare")}
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
