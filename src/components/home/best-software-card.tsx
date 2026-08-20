import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type BestSoftwareCardProps = {
  title: string;
  href: string;
  categorySlug: string;
  categoryLabel: string;
  /** Public buying context — never internal provisional language. */
  buyingContext: string;
  evaluatedCount?: number;
  fitScenarios?: string[];
  topProducts?: Array<{
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  className?: string;
};

export function BestSoftwareCard({
  title,
  href,
  categorySlug,
  categoryLabel,
  buyingContext,
  evaluatedCount,
  fitScenarios = [],
  topProducts = [],
  className,
}: BestSoftwareCardProps) {
  return (
    <Card
      variant="highlighted"
      className={cn(
        "grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center",
        className,
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <CategoryIcon categoryId={categorySlug} size="lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              Best software · {categoryLabel}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]">
              {title}
            </h3>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          {buyingContext}
        </p>
        {evaluatedCount != null ? (
          <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
            {evaluatedCount} products evaluated
          </p>
        ) : null}
        {fitScenarios.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {fitScenarios.slice(0, 3).map((s) => (
              <li
                key={s}
                className="rounded-full bg-[var(--sg-color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--sg-color-text-muted)]"
              >
                {s}
              </li>
            ))}
          </ul>
        ) : null}
        <ButtonLink href={href} className="mt-5">
          View {title}
          <ArrowRight className="ml-1 size-4" aria-hidden />
        </ButtonLink>
      </div>

      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/70 p-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--sg-color-text)]">
          <Trophy className="size-4 text-[var(--sg-color-primary)]" aria-hidden />
          Featured shortlist
        </p>
        {topProducts.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {topProducts.slice(0, 3).map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <ProductLogo name={p.name} logo={p.logo} size="sm" />
                <span className="text-sm font-medium">{p.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
            Compare options using our category methodology.
          </p>
        )}
        <Link
          href={href}
          className="mt-4 inline-block text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Open the full list →
        </Link>
      </div>
    </Card>
  );
}
