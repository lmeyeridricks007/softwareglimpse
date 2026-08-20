import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarClock,
  Package,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

export type AlternativesHeroStat = {
  label: string;
  href?: string;
  icon?: "products" | "updated" | "independent" | "methodology";
};

type ProductSnippet = {
  name: string;
  slug: string;
  logo?: { src: string; alt: string } | null;
  summary?: string | null;
  score?: number | null;
  scoreApproved?: boolean;
};

type Props = {
  title: string;
  summary?: string;
  provisional?: boolean;
  updatedLabel?: string;
  stats?: AlternativesHeroStat[];
  source: ProductSnippet;
  bestAlternative?: ProductSnippet & {
    label?: string;
    visitCta?: ReactNode;
    compareHref?: string;
  };
  className?: string;
};

const ICONS = {
  products: Package,
  updated: CalendarClock,
  independent: ShieldCheck,
  methodology: Scale,
} as const;

export function AlternativesHero({
  title,
  summary,
  provisional = false,
  updatedLabel,
  stats = [],
  source,
  bestAlternative,
  className,
}: Props) {
  return (
    <header className={cn("space-y-8", className)}>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {updatedLabel ? (
            <Badge variant="success">Updated {updatedLabel}</Badge>
          ) : null}
          {provisional ? (
            <Badge variant="warning">Provisional list</Badge>
          ) : null}
        </div>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
          {title}
        </h1>
        {summary ? (
          <p className="mt-3 max-w-3xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {summary}
          </p>
        ) : null}

        {stats.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon ? ICONS[stat.icon] : Package;
              const body = (
                <span className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)]">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {stat.label}
                </span>
              );
              return (
                <li key={stat.label}>
                  {stat.href ? (
                    <Link
                      href={stat.href}
                      className="underline-offset-2 hover:text-[var(--sg-color-text)] hover:underline"
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      <Card className="grid gap-6 p-5 shadow-[var(--sg-shadow-md)] lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[var(--sg-color-border)] lg:p-0">
        <div className="lg:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Looking beyond
          </p>
          <div className="mt-3 flex items-start gap-3">
            <ProductLogo name={source.name} logo={source.logo} size="lg" />
            <div className="min-w-0">
              <p className="font-semibold text-[var(--sg-color-text)]">
                {source.name}
              </p>
              {source.scoreApproved && source.score != null ? (
                <Rating score={source.score} className="mt-1" />
              ) : (
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  Score pending approval
                </p>
              )}
            </div>
          </div>
          {source.summary ? (
            <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
              {source.summary}
            </p>
          ) : null}
          <Link
            href={`/software/${source.slug}/`}
            className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Read our full {source.name} review →
          </Link>
        </div>

        {bestAlternative ? (
          <div className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/40 lg:rounded-none lg:rounded-r-[var(--sg-radius-lg)] lg:p-6 lg:bg-[var(--sg-color-primary-soft)]/35">
            <div className="max-lg:mt-2 lg:contents">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-primary)]">
                {bestAlternative.label ??
                  (provisional
                    ? "Provisional top alternative"
                    : "Best overall alternative")}
              </p>
              <div className="mt-3 flex items-start gap-3">
                <ProductLogo
                  name={bestAlternative.name}
                  logo={bestAlternative.logo}
                  size="lg"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {bestAlternative.name}
                  </p>
                  {bestAlternative.scoreApproved &&
                  bestAlternative.score != null ? (
                    <Rating score={bestAlternative.score} className="mt-1" />
                  ) : (
                    <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                      Score pending approval
                    </p>
                  )}
                </div>
              </div>
              {bestAlternative.summary ? (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  {bestAlternative.summary}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {bestAlternative.visitCta ?? (
                  <ButtonLink href={`/software/${bestAlternative.slug}/`}>
                    View {bestAlternative.name}
                  </ButtonLink>
                )}
                {bestAlternative.compareHref ? (
                  <Link
                    href={bestAlternative.compareHref}
                    className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    See how we compare →
                  </Link>
                ) : (
                  <Link
                    href={`/software/${bestAlternative.slug}/`}
                    className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    Read review →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Card>
    </header>
  );
}
