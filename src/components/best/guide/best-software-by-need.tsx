import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  items: BestPageModel["byNeed"];
  className?: string;
};

export function BestSoftwareByNeed({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Best CRM by need
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
        Scenario awards use product fit from approved CRM
        recommendations and use-case mappings.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--sg-color-text-muted)]">
              {item.title}
            </p>
            {item.product ? (
              <div className="mt-3 flex items-center gap-2.5">
                <ProductLogo
                  name={item.product.name}
                  logo={item.product.logo}
                  size="sm"
                />
                <Link
                  href={item.product.href}
                  className="font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {item.product.name}
                </Link>
              </div>
            ) : null}
            <p className="mt-2 text-sm leading-snug text-[var(--sg-color-text-muted)]">
              {item.why ?? item.description}
            </p>
            {item.href ? (
              <Link
                href={item.href}
                className="mt-3 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                View picks →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
