import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: BestPageModel["useCases"];
  className?: string;
};

export function BestSoftwareUseCases({ title, items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="h-full p-4 transition-colors hover:border-[var(--sg-color-primary)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                {item.title}
              </p>
              {item.product ? (
                <div className="mt-3 flex items-center gap-2">
                  <ProductLogo
                    name={item.product.name}
                    logo={item.product.logo}
                    size="sm"
                  />
                  <span className="text-sm font-medium">{item.product.name}</span>
                </div>
              ) : null}
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Explore →
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
