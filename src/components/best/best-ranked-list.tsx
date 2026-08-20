import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { PageAffiliateDisclosure } from "@/components/site/page-affiliate-disclosure";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { scoreLabel } from "@/services/editorial/score-labels";
import { cn } from "@/lib/cn";

export type BestRankedItem = {
  rank: number;
  name: string;
  slug: string;
  logo?: { src: string; alt: string } | null;
  description?: string | null;
  score?: number | null;
  scoreApproved?: boolean;
  bestFor?: string | null;
  pricingTeaser?: string | null;
  badge?: string | null;
  provisional?: boolean;
  editorsChoice?: boolean;
  visitCta?: ReactNode;
};

type Props = {
  title?: string;
  items: BestRankedItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  provisionalNote?: string;
  className?: string;
};

export function BestRankedList({
  title = "How we rank software",
  items,
  viewAllHref,
  viewAllLabel,
  provisionalNote,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="best-ranked-heading" className={cn(className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="best-ranked-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        {provisionalNote ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--sg-color-text-muted)]">
            <Info className="size-3.5" aria-hidden />
            {provisionalNote}
          </span>
        ) : null}
      </div>

      <ol className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="p-4 sm:p-5">
              {item.editorsChoice && !item.provisional ? (
                <Badge variant="editorial-choice" className="mb-3">
                  Editor’s choice
                </Badge>
              ) : null}
              {item.badge ? (
                <Badge
                  variant={item.provisional ? "neutral" : "editorial-choice"}
                  className="mb-3"
                >
                  {item.badge}
                </Badge>
              ) : null}

              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-[var(--sg-color-primary-fg)]"
                    aria-label={`Rank ${item.rank}`}
                  >
                    {item.rank}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
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
                          <Rating
                            score={item.score}
                            className="mt-0.5"
                            showNumeric
                          />
                        ) : (
                          <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                            Score pending approval
                          </p>
                        )}
                      </div>
                    </div>

                    {item.description ? (
                      <p className="mt-3 max-w-prose text-sm text-[var(--sg-color-text-muted)]">
                        {item.description}
                      </p>
                    ) : null}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row xl:w-44 xl:flex-col">
                  {item.scoreApproved && item.score != null ? (
                    <div className="text-center xl:order-first">
                      <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-text)]">
                        {Math.round(item.score * 10) / 10}
                      </p>
                      <p className="text-xs font-medium text-[var(--sg-color-success)]">
                        {scoreLabel(item.score)}
                      </p>
                    </div>
                  ) : null}

                  <ButtonLink
                    href={`/software/${item.slug}/`}
                    variant="outline"
                    size="md"
                    className="justify-center gap-1"
                  >
                    View review
                    <ArrowRight className="size-4" aria-hidden />
                  </ButtonLink>
                  {item.visitCta}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      {viewAllHref ? (
        <div className="mt-6 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
          >
            {viewAllLabel ?? "View all software"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : null}

      <PageAffiliateDisclosure className="mt-4 text-xs text-[var(--sg-color-text-muted)]" />
    </section>
  );
}
