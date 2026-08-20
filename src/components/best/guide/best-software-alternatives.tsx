import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: BestPageModel["alternatives"];
  className?: string;
};

export function BestSoftwareAlternatives({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Exploring alternatives is part of a healthy CRM shortlist. Open a page
        to see catalogue substitutes and switching considerations.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <ProductLogo
                  name={item.product.name}
                  logo={item.product.logo}
                  size="sm"
                />
                <div className="min-w-0">
                  <Link
                    href={item.href}
                    className="font-semibold underline-offset-2 hover:underline"
                  >
                    {item.label}
                  </Link>
                  <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                    Switching from {item.product.name}
                  </p>
                </div>
              </div>
              <Link
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Explore alternatives →
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
