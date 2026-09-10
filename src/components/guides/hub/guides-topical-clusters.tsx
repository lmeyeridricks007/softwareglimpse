import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { Section } from "@/components/layout/section";
import type { GuidesHubTopicalCluster } from "@/services/guides-hub";
import { cn } from "@/lib/cn";

type Props = {
  clusters: GuidesHubTopicalCluster[];
  className?: string;
};

/** Category topical clusters — cornerstone guides, not a flat dump of every pack. */
export function GuidesTopicalClusters({ clusters, className }: Props) {
  if (clusters.length === 0) return null;

  return (
    <Section
      padding="md"
      background="surface"
      container="wide"
      className={className}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Guide clusters by category
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Start from cornerstone buying, pricing, implementation, and learning
        guides — then branch into comparisons, reviews, and decision tools.
      </p>

      <ul className="mt-8 grid gap-4 lg:grid-cols-2">
        {clusters.map((cluster) => (
          <li key={cluster.categorySlug}>
            <article
              className={cn(
                "h-full rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]",
              )}
            >
              <div className="flex items-start gap-3">
                <CategoryIcon categoryId={cluster.categorySlug} size="sm" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {cluster.categoryLabel}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {cluster.description}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {cluster.cornerstone.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-baseline justify-between gap-3 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                          {item.kind}
                        </span>
                        <span className="mt-0.5 block font-medium text-[var(--sg-color-primary)] group-hover:underline">
                          {item.title}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-3.5 shrink-0 text-[var(--sg-color-primary)] opacity-0 transition group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              {cluster.related.length > 0 ? (
                <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
                  Also:{" "}
                  {cluster.related.map((r, i) => (
                    <span key={r.href}>
                      {i > 0 ? " · " : null}
                      <Link
                        href={r.href}
                        className="font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                      >
                        {r.title}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}

              <Link
                href={cluster.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]"
              >
                Browse {cluster.categoryLabel} guides
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
