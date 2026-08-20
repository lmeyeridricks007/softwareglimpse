import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import type { CompareHubCard } from "@/services/compare-hub";
import { cn } from "@/lib/cn";

type Props = {
  items: CompareHubCard[];
  className?: string;
};

export function RecentlyUpdatedComparisons({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Recently updated
      </h2>
      <ul className="mt-4 divide-y divide-[var(--sg-color-border)] overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 px-3.5 py-3 transition hover:bg-[var(--sg-color-surface-muted)]/50"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="inline-flex items-center -space-x-1.5">
                  <ProductLogo
                    name={item.productA.name}
                    logo={item.productA.logo}
                    size="sm"
                    className="!size-6"
                  />
                  <ProductLogo
                    name={item.productB.name}
                    logo={item.productB.logo}
                    size="sm"
                    className="!size-6"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--sg-color-text)]">
                    {item.title}
                  </span>
                  <span className="block text-xs text-[var(--sg-color-text-muted)]">
                    Recommendations updated
                  </span>
                </span>
              </div>
              <span className="shrink-0 text-xs text-[var(--sg-color-text-muted)]">
                {item.updatedLabel ?? "Updated"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
