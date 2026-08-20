import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";
import Link from "next/link";

type Props = {
  items: BestPageModel["topPicks"];
  className?: string;
};

/** Award-style top picks — only approved use-case mappings. */
export function BestSoftwareTopPicks({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        Our top picks
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.category}-${item.product.slug}`}>
            <Card className="h-full border-[var(--sg-color-border)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sg-color-primary)]">
                {item.category}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ProductLogo
                  name={item.product.name}
                  logo={item.product.logo}
                  size="md"
                />
                <Link
                  href={item.product.href}
                  className="font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {item.product.name}
                </Link>
              </div>
              {item.summary ? (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  {item.summary}
                </p>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
