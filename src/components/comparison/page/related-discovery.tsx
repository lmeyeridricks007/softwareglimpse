import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

export function RelatedDiscovery({ model }: Props) {
  const hasRelated = model.relatedComparisons.length > 0;
  const hasAlts = model.alternatives.length > 0;
  if (!hasRelated && !hasAlts) return null;

  return (
    <section className="space-y-10">
      {hasRelated ? (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Related comparisons
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {model.relatedComparisons.map((item) => (
              <li key={item.slug}>
                <Link href={item.href} className="group block h-full">
                  <Card variant="interactive" className="h-full p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold">
                        <ProductLogo
                          name={item.productAName}
                          logo={item.logoA}
                          size="sm"
                          className="!size-6"
                        />
                        <span className="truncate">{item.productAName}</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[var(--sg-color-text-muted)]">
                        vs
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold">
                        <ProductLogo
                          name={item.productBName}
                          logo={item.logoB}
                          size="sm"
                          className="!size-6"
                        />
                        <span className="truncate">{item.productBName}</span>
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {item.title}
                    </p>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {hasAlts ? (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Alternatives to consider
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {model.alternatives.map((alt) => (
              <li key={alt.slug}>
                <Link href={alt.href} className="group block h-full">
                  <Card variant="interactive" className="flex h-full gap-3 p-4">
                    <ProductLogo name={alt.name} logo={alt.logo} size="md" />
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                        {alt.name}
                      </p>
                      {alt.bestFor ? (
                        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                          Best for: {alt.bestFor}
                        </p>
                      ) : alt.why ? (
                        <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                          {alt.why}
                        </p>
                      ) : null}
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
