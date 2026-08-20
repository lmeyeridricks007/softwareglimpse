import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestHubPageCard } from "@/services/best-hub";
import { cn } from "@/lib/cn";

type Props = {
  featured: BestHubPageCard | null;
  previewCategories: Array<{ slug: string; name: string; href: string }>;
  decisionPaths: Array<{ title: string; href: string }>;
  finderHref?: string | null;
  finderLabel?: string;
  className?: string;
};

/**
 * Hero decision visual — matches Best hub mockup:
 * FIND SOFTWARE FOR (colored category icons) + TOP DECISION PATHS + optional Finder box.
 */
export function BestDecisionPreview({
  featured,
  previewCategories,
  decisionPaths,
  finderHref,
  finderLabel = "Find My CRM",
  className,
}: Props) {
  const paths =
    decisionPaths.length > 0
      ? decisionPaths
      : featured
        ? [{ title: featured.title, href: featured.href }]
        : [];

  return (
    <Card
      className={cn(
        "flex flex-col gap-5 border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-6 shadow-[0_16px_40px_rgb(15_23_42/0.08)] sm:p-7",
        className,
      )}
    >
      <div className="grid gap-5 sm:grid-cols-[1.1fr_0.9fr] sm:gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Find software for
          </p>
          <ul className="mt-3 space-y-2">
            {previewCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={c.href}
                  className="flex items-center gap-3 rounded-[var(--sg-radius-md)] px-1 py-1.5 text-sm font-medium text-[var(--sg-color-text)] transition hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-primary)]"
                >
                  <CategoryIcon categoryId={c.slug} size="sm" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Top decision paths
          </p>
          <ul className="mt-3 space-y-2.5">
            {paths.map((path) => (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group text-sm font-semibold text-[var(--sg-color-text)] hover:text-[var(--sg-color-primary)]"
                >
                  {path.title}
                  <ArrowRight
                    className="ml-1 inline size-3.5 align-[-0.1em] transition group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          {featured && featured.topProducts.length > 0 ? (
            <div className="mt-4">
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                {featured.productCount} products covered
              </p>
              <ul className="mt-2 flex flex-wrap items-center gap-2">
                {featured.topProducts.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {finderHref ? (
        <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/40 px-4 py-4">
          <p className="text-sm font-semibold text-[var(--sg-color-text)]">
            Not sure where to start?
          </p>
          <ButtonLink href={finderHref} size="sm" className="mt-3">
            {finderLabel}
            <ArrowRight className="ml-1 size-3.5" aria-hidden />
          </ButtonLink>
        </div>
      ) : featured ? (
        <ButtonLink href={featured.href} className="w-full sm:w-auto">
          Explore {featured.title}
          <ArrowRight className="ml-1 size-4" aria-hidden />
        </ButtonLink>
      ) : null}
    </Card>
  );
}
