import { Check } from "lucide-react";
import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { SoftwareEditorialScoreCard } from "@/components/software/software-editorial-score-card";
import type { CriterionBar } from "@/components/software/software-editorial-score-card";
import { PageAffiliateDisclosure } from "@/components/site/page-affiliate-disclosure";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type CategoryChip = {
  name: string;
  href: string;
};

type HeroFact = {
  label: string;
  value: string;
};

type ScoreCardProps = {
  score?: number;
  criteria?: CriterionBar[];
  pendingCriteriaNames?: string[];
  approved: boolean;
  bestFor?: string;
  methodologyHref?: string;
};

type Props = ScoreCardProps & {
  name: string;
  h1: string;
  tagline?: string | null;
  logo?: { src: string; alt: string } | null;
  categoryBadge?: string | null;
  categoryChips?: CategoryChip[];
  heroFacts?: HeroFact[];
  primaryCta?: React.ReactNode;
  secondaryCta?: React.ReactNode;
  tertiaryCta?: React.ReactNode;
  showDisclosure?: boolean;
  lastUpdated?: string | null;
  independentLabel?: string | null;
  /** When true, omit duplicate logo/title and use h2 (hub chrome already owns the page h1). */
  embeddedInHub?: boolean;
  className?: string;
};

export function SoftwareReviewHero({
  name,
  h1,
  tagline,
  logo,
  categoryBadge,
  categoryChips = [],
  heroFacts = [],
  primaryCta,
  secondaryCta,
  tertiaryCta,
  showDisclosure = false,
  lastUpdated,
  independentLabel,
  embeddedInHub = false,
  className,
  ...scoreCardProps
}: Props) {
  const showScoreCard =
    !embeddedInHub &&
    (scoreCardProps.approved ||
      (scoreCardProps.pendingCriteriaNames?.length ?? 0) > 0 ||
      (scoreCardProps.criteria?.length ?? 0) > 0);

  const TitleTag = embeddedInHub ? "h2" : "h1";

  return (
    <header
      className={cn(
        "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-8 lg:items-start lg:gap-10",
          showScoreCard
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]"
            : "lg:grid-cols-1",
        )}
      >
        <div className="min-w-0">
          {!embeddedInHub ? (
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="shrink-0 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]">
                <ProductLogo
                  name={name}
                  logo={logo}
                  size="xl"
                  className="border-0"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                  {name}
                </p>
                {categoryBadge ? (
                  <Badge variant="primary" className="mt-2">
                    {categoryBadge}
                  </Badge>
                ) : null}
                <TitleTag className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-text)]">
                  {h1}
                </TitleTag>
                {tagline ? (
                  <p className="mt-2 max-w-2xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
                    {tagline}
                  </p>
                ) : null}
                {independentLabel ? (
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {independentLabel}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div>
              <TitleTag className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
                Editorial verdict
              </TitleTag>
              {tagline ? (
                <p className="mt-2 max-w-2xl text-[var(--sg-color-text-muted)]">
                  {tagline}
                </p>
              ) : null}
            </div>
          )}

          {heroFacts.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {heroFacts.map((fact) => (
                <li
                  key={fact.label}
                  className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]"
                >
                  <Check
                    className="size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>
                    <span className="font-medium text-[var(--sg-color-text)]">
                      {fact.label}:
                    </span>{" "}
                    {fact.value}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {categoryChips.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {categoryChips.map((cat) => (
                <li key={cat.href}>
                  <Link href={cat.href}>
                    <Badge variant="neutral">{cat.name}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {(primaryCta || secondaryCta || tertiaryCta) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {primaryCta}
              {secondaryCta}
              {tertiaryCta}
            </div>
          )}

          {showDisclosure ? (
            <PageAffiliateDisclosure className="mt-4 max-w-xl text-xs text-[var(--sg-color-text-muted)]" />
          ) : null}

          {lastUpdated ? (
            <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
              Last updated {lastUpdated.slice(0, 10)}
            </p>
          ) : null}
        </div>

        {showScoreCard ? (
          <SoftwareEditorialScoreCard {...scoreCardProps} />
        ) : null}
      </div>
    </header>
  );
}
