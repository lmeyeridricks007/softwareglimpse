import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  categoryShortName: string;
  groups: BestPageModel["landscape"];
  className?: string;
};

/** Qualitative positioning — not a quantitative plot. */
export function BestSoftwareLandscape({
  categoryShortName,
  groups,
  className,
}: Props) {
  if (groups.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {categoryShortName} landscape
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Qualitative groupings to help you understand product positioning — not a
        scored chart.
      </p>
      <ul className="mt-5 grid gap-4 md:grid-cols-3">
        {groups.map((group) => (
          <li key={group.id}>
            <Card className="h-full p-4">
              <p className="font-semibold text-[var(--sg-color-text)]">
                {group.label}
              </p>
              {group.description ? (
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  {group.description}
                </p>
              ) : null}
              <ul className="mt-4 space-y-2">
                {group.products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-2 text-sm font-medium underline-offset-2 hover:underline"
                    >
                      <ProductLogo name={p.name} logo={p.logo} size="sm" />
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
