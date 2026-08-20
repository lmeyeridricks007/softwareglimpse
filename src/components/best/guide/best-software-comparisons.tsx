import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: BestPageModel["comparisons"];
  className?: string;
};

export function BestSoftwareComparisons({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Head-to-head pages use product evidence. When priorities differ, we
        do not invent a universal winner.
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center gap-2">
                {item.products.slice(0, 2).map((p) => (
                  <ProductLogo
                    key={p.slug}
                    name={p.name}
                    logo={p.logo}
                    size="sm"
                  />
                ))}
              </div>
              <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
                {item.title}
              </p>
              {item.summary ? (
                <p className="mt-1 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.summary}
                </p>
              ) : (
                <p className="mt-1 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  Winner depends on priorities — compare fit, pricing, and
                  capabilities.
                </p>
              )}
              <Link
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Compare →
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
