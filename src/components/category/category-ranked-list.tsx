import type { ReactNode } from "react";
import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { FeatureChecklist } from "@/components/software/software-card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

export type CategoryRankedItem = {
  rank?: number;
  name: string;
  slug: string;
  logo?: { src: string; alt: string } | null;
  score?: number | null;
  scoreApproved?: boolean;
  bestFor?: string | null;
  pricingTeaser?: string | null;
  strengths?: string[];
  badge?: string | null;
  provisional?: boolean;
  visitCta?: ReactNode;
};

type Props = {
  title: string;
  items: CategoryRankedItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  provisionalNote?: string;
  /** When false, omit numbered rank circles (catalogue listing, not editorial ranking). */
  showRank?: boolean;
  className?: string;
};

export function CategoryRankedList({
  title,
  items,
  viewAllHref,
  viewAllLabel,
  provisionalNote,
  showRank = true,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="ranked-list-heading" className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="ranked-list-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        {provisionalNote ? (
          <Badge variant="warning">{provisionalNote}</Badge>
        ) : null}
      </div>

      <ol className="mt-5 space-y-3">
        {items.map((item, index) => {
          const rank = item.rank ?? index + 1;
          return (
            <li key={item.slug}>
              <Card className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    {showRank ? (
                      <span
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-[var(--sg-color-primary-fg)]"
                        aria-label={`Position ${rank}`}
                      >
                        {rank}
                      </span>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ProductLogo
                          name={item.name}
                          logo={item.logo}
                          size="md"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[var(--sg-color-text)]">
                            {item.name}
                          </p>
                          {item.scoreApproved && item.score != null ? (
                            <Rating score={item.score} className="mt-0.5" />
                          ) : null}
                        </div>
                        {item.badge && !item.provisional ? (
                          <Badge variant="editorial-choice">{item.badge}</Badge>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                            Best for
                          </p>
                          <p className="mt-1 text-sm text-[var(--sg-color-text)]">
                            {item.bestFor ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                            Starting at
                          </p>
                          <p className="mt-1 text-sm font-medium text-[var(--sg-color-text)]">
                            {item.pricingTeaser ?? "See pricing"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                            Key strengths
                          </p>
                          <FeatureChecklist
                            items={(item.strengths ?? []).slice(0, 3)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col lg:items-stretch">
                    <ButtonLink
                      href={`/software/${item.slug}/`}
                      size="md"
                      className="justify-center"
                    >
                      {withSingleArrow("View review")}
                    </ButtonLink>
                    {item.visitCta}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>

      {viewAllHref ? (
        <div className="mt-6 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
          >
            {withSingleArrow(viewAllLabel ?? "View all software")}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
