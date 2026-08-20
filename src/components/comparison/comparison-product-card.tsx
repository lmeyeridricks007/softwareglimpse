import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  slug: string;
  logo?: { src: string; alt: string } | null;
  /** Approved editorial score only. */
  score?: number | null;
  scoreApproved?: boolean;
  highlights?: string[];
  pricingTeaser?: string | null;
  /** Visit / trial CTA (affiliate-aware). Prefer mid-page budget if header is capped. */
  visitCta?: ReactNode;
  accent?: "default" | "a" | "b";
  className?: string;
};

export function ComparisonProductCard({
  name,
  slug,
  logo,
  score,
  scoreApproved = false,
  highlights = [],
  pricingTeaser,
  visitCta,
  accent = "default",
  className,
}: Props) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col",
        accent === "a" && "ring-1 ring-[var(--sg-color-primary-soft)]",
        accent === "b" && "ring-1 ring-[var(--sg-color-danger-soft)]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <ProductLogo name={name} logo={logo} size="lg" />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-[var(--sg-color-text)]">
            {name}
          </h2>
          {scoreApproved && score != null ? (
            <Rating score={score} className="mt-1" />
          ) : (
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              Score pending approval
            </p>
          )}
        </div>
      </div>

      {highlights.length > 0 ? (
        <ul className="mt-4 flex-1 space-y-2">
          {highlights.slice(0, 4).map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex-1" />
      )}

      {pricingTeaser ? (
        <p className="mt-4 text-sm font-semibold text-[var(--sg-color-text)]">
          From {pricingTeaser}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2">
        {visitCta}
        <Link
          href={`/software/${slug}/`}
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Read full review
        </Link>
      </div>
    </Card>
  );
}

export function ComparisonVerdictCard({
  overallLabel,
  verdict,
  categoryWinners = [],
  provisional = false,
  className,
}: {
  overallLabel?: string;
  verdict?: string;
  categoryWinners?: { criterion: string; winner: string }[];
  provisional?: boolean;
  className?: string;
}) {
  return (
    <Card
      variant="highlighted"
      className={cn("flex h-full flex-col", className)}
      aria-labelledby="comparison-verdict-heading"
    >
      <div className="flex items-center gap-2">
        <Badge variant="editorial-choice">Our verdict</Badge>
        {provisional ? <Badge variant="warning">Coverage in progress</Badge> : null}
      </div>
      <h2
        id="comparison-verdict-heading"
        className="sr-only"
      >
        Our verdict
      </h2>

      {overallLabel ? (
        <div className="mt-4 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-success-soft)] px-3 py-2 text-sm font-semibold text-[var(--sg-color-text)]">
          {overallLabel}
        </div>
      ) : null}

      {verdict ? (
        <p className="mt-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
          {verdict}
        </p>
      ) : (
        <p className="mt-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
          Criterion research is still in progress for this pair.
        </p>
      )}

      {categoryWinners.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-[var(--sg-color-border)] pt-4">
          {categoryWinners.slice(0, 6).map((row) => (
            <li
              key={row.criterion}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="text-[var(--sg-color-text-muted)]">
                {row.criterion}
              </span>
              <span className="font-medium text-[var(--sg-color-text)]">
                {row.winner}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <a
        href="#features"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] px-4 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
      >
        See full comparison ↓
      </a>
    </Card>
  );
}
