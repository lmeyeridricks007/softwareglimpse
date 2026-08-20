import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { PageAffiliateDisclosure } from "@/components/site/page-affiliate-disclosure";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

export type AlternativesTableRow = {
  rank: number;
  name: string;
  slug: string;
  logo?: { src: string; alt: string } | null;
  description?: string | null;
  bestFor?: string | null;
  pricingTeaser?: string | null;
  score?: number | null;
  scoreApproved?: boolean;
  badge?: string | null;
  provisional?: boolean;
  visitCta?: ReactNode;
};

type Props = {
  title: string;
  rows: AlternativesTableRow[];
  compareAllHref?: string;
  className?: string;
};

export function AlternativesTable({
  title,
  rows,
  compareAllHref,
  className,
}: Props) {
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="alt-table-heading" className={cn(className)}>
      <h2
        id="alt-table-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>

      {/* Mobile cards */}
      <ul className="mt-5 space-y-3 lg:hidden">
        {rows.map((row) => (
          <li
            key={row.slug}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
          >
            <RowIdentity row={row} />
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Best for
                </dt>
                <dd className="mt-0.5 font-medium">{row.bestFor ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Starting price
                </dt>
                <dd className="mt-0.5 font-medium">
                  {row.pricingTeaser ?? "See pricing"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-col gap-2">
              <ButtonLink
                href={`/software/${row.slug}/`}
                variant="outline"
                size="md"
                className="justify-center gap-1"
              >
                View review
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              {row.visitCta}
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="mt-5 hidden overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)] lg:block">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Software</th>
              <th className="px-4 py-3 font-medium">Best for</th>
              <th className="px-4 py-3 font-medium">Starting price</th>
              <th className="px-4 py-3 font-medium">Overall score</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.slug}
                className="border-t border-[var(--sg-color-border)] align-top"
              >
                <td className="px-4 py-4">
                  <RowIdentity row={row} />
                </td>
                <td className="px-4 py-4 text-[var(--sg-color-text)]">
                  {row.bestFor ?? "—"}
                </td>
                <td className="px-4 py-4 font-medium text-[var(--sg-color-text)]">
                  {row.pricingTeaser ?? "See pricing"}
                </td>
                <td className="px-4 py-4">
                  {row.scoreApproved && row.score != null ? (
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums">
                        {Math.round(row.score * 10) / 10}
                        <span className="text-sm font-normal text-[var(--sg-color-text-muted)]">
                          /10
                        </span>
                      </p>
                      <Rating
                        score={row.score}
                        showNumeric={false}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      Score pending
                    </p>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/software/${row.slug}/`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      View review
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                    {row.visitCta ?? (
                      <span className="inline-flex items-center gap-1 text-sm text-[var(--sg-color-text-muted)]">
                        Visit unavailable
                        <ExternalLink className="size-3.5" aria-hidden />
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compareAllHref ? (
        <p className="mt-5 text-center">
          <Link
            href={compareAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Compare alternatives side by side
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      ) : null}

      <PageAffiliateDisclosure className="mt-4 text-xs text-[var(--sg-color-text-muted)]" />
    </section>
  );
}

function RowIdentity({ row }: { row: AlternativesTableRow }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-xs font-semibold text-[var(--sg-color-primary-fg)]"
        aria-label={`Rank ${row.rank}`}
      >
        {row.rank}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <ProductLogo name={row.name} logo={row.logo} size="sm" />
          <p className="font-semibold text-[var(--sg-color-text)]">{row.name}</p>
          {row.badge ? (
            <Badge variant={row.provisional ? "warning" : "success"}>
              {row.badge}
            </Badge>
          ) : null}
        </div>
        {row.description ? (
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {row.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
