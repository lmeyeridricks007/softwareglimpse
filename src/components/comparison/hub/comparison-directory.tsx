import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { cn } from "@/lib/cn";

export type ComparisonDirectoryGroup = {
  categoryLabel: string;
  categorySlug: string;
  items: Array<{ title: string; href: string }>;
};

type Props = {
  directory: ComparisonDirectoryGroup[];
  className?: string;
};

export function ComparisonDirectory({ directory, className }: Props) {
  if (directory.length === 0) return null;

  const total = directory.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            Comparison directory
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Browse every head-to-head by category.
          </p>
        </div>
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          {total} {total === 1 ? "comparison" : "comparisons"}
        </p>
      </div>

      <ul className="mt-6 space-y-4">
        {directory.map((group) => (
          <li
            key={group.categorySlug}
            className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]"
          >
            <div className="flex flex-wrap items-center gap-3 border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-4 py-3.5 sm:px-5">
              <CategoryIcon categoryId={group.categorySlug} size="sm" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  {group.categoryLabel} comparisons
                </h3>
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  {group.items.length}{" "}
                  {group.items.length === 1 ? "comparison" : "comparisons"}
                </p>
              </div>
              <Link
                href={`/compare/?category=${encodeURIComponent(group.categorySlug)}#published-comparisons`}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                View cards
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>

            <ul className="grid gap-px bg-[var(--sg-color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <li key={item.href} className="bg-[var(--sg-color-surface)]">
                  <Link
                    href={item.href}
                    className="group flex h-full items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-[var(--sg-color-primary-soft)]/50 sm:px-5"
                  >
                    <span className="min-w-0 font-medium text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {item.title}
                    </span>
                    <ArrowRight
                      className="size-3.5 shrink-0 text-[var(--sg-color-text-muted)] opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[var(--sg-color-primary)]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
