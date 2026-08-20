import Link from "next/link";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import type { FinderRecommendationResult } from "@/domain";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type LiveProps = {
  results: FinderRecommendationResult[];
  logos?: Record<string, { src: string; alt: string } | undefined>;
  ready: boolean;
  onViewResults?: () => void;
  onRetake?: () => void;
  className?: string;
};

export function FinderLiveMatches({
  results,
  logos = {},
  ready,
  onViewResults,
  onRetake,
  className,
}: LiveProps) {
  const top = results.slice(0, 3);

  return (
    <Card className={cn(className)} aria-labelledby="live-matches-heading">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="live-matches-heading"
          className="text-sm font-semibold text-[var(--sg-color-text)]"
        >
          Your top CRM matches
        </h2>
        {ready && top.length > 0 ? (
          <Badge variant="success">Live results</Badge>
        ) : (
          <Badge variant="neutral">Waiting</Badge>
        )}
      </div>

      {!ready ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Answer company size, seats, and primary goal to unlock live fit
          scores.
        </p>
      ) : top.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          No strong matches yet — keep answering or broaden requirements.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {top.map((result) => (
            <li
              key={result.productSlug}
              className="flex items-start gap-3 border-b border-[var(--sg-color-border)] pb-3 last:border-0 last:pb-0"
            >
              <ProductLogo
                name={result.name}
                logo={logos[result.productSlug]}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                  {result.name}
                </p>
                {result.labels?.[0] ? (
                  <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                    {result.labels[0]}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--sg-color-primary)]">
                {Math.round(result.matchScore)}%
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 space-y-2">
        {onViewResults ? (
          <button
            type="button"
            onClick={onViewResults}
            disabled={!ready || top.length === 0}
            className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)] text-sm font-medium text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            View full results
            <ArrowRight className="size-4" aria-hidden />
          </button>
        ) : null}
        {onRetake ? (
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex w-full items-center justify-center gap-1.5 text-sm text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]"
          >
            <RefreshCw className="size-3.5" aria-hidden />
            Retake the quiz
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Fit % is a deterministic model score — not a probability or star rating.
      </p>
    </Card>
  );
}

export function FinderWhyCard({ className }: { className?: string }) {
  const items = [
    "Affiliate status never changes rankings",
    "Scores use structured catalogue evidence",
    "Unknown capabilities lower confidence — they are not invented",
    "Answers stay on this device",
  ];
  return (
    <Card className={cn(className)} aria-labelledby="why-finder-heading">
      <h2
        id="why-finder-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Why use our finder?
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm text-[var(--sg-color-text-muted)]"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
              aria-hidden
            />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function FinderResourcesCard({
  items,
  className,
}: {
  items: Array<{ href: string; label: string }>;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Card className={cn(className)} aria-labelledby="finder-resources-heading">
      <h2
        id="finder-resources-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Popular resources
      </h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink
        href="/guides/"
        variant="ghost"
        size="sm"
        className="mt-3 px-0 text-[var(--sg-color-primary)]"
      >
        View all guides →
      </ButtonLink>
    </Card>
  );
}
