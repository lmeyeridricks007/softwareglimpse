import Link from "next/link";
import { ChevronRight, FileText, Lightbulb } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FeaturedUseCase = {
  title: string;
  description: string;
  href: string;
  bestFor?: string;
  keyBenefit?: string;
  topProducts?: string[];
  provisional?: boolean;
};

export type SidebarComparison = {
  href: string;
  title: string;
  products: Array<{ name: string; logo?: { src: string; alt: string } | null }>;
};

export type SidebarResource = {
  href: string;
  label: string;
};

type Props = {
  featured?: FeaturedUseCase;
  comparisons?: SidebarComparison[];
  resources?: SidebarResource[];
  visualEvidence?: {
    officialDemoCount: number;
    screenshotCount: number;
    evidenceHref?: string;
  } | null;
  className?: string;
};

export function UseCaseSidebar({
  featured,
  comparisons = [],
  resources = [],
  visualEvidence,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {featured ? (
        <Card aria-labelledby="featured-use-case-heading">
          <div className="flex items-center justify-between gap-2">
            <h2
              id="featured-use-case-heading"
              className="text-sm font-semibold text-[var(--sg-color-text)]"
            >
              Featured use case
            </h2>
            <Badge variant={featured.provisional ? "warning" : "success"}>
              {featured.provisional ? "Provisional" : "Popular"}
            </Badge>
          </div>
          <p className="mt-3 font-semibold text-[var(--sg-color-text)]">
            {featured.title}
          </p>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {featured.description}
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            {featured.bestFor ? (
              <div>
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Best for
                </dt>
                <dd className="font-medium">{featured.bestFor}</dd>
              </div>
            ) : null}
            {featured.keyBenefit ? (
              <div>
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Key benefit
                </dt>
                <dd className="font-medium">{featured.keyBenefit}</dd>
              </div>
            ) : null}
            {featured.topProducts && featured.topProducts.length > 0 ? (
              <div>
                <dt className="text-xs text-[var(--sg-color-text-muted)]">
                  Catalogue examples
                </dt>
                <dd className="font-medium">
                  {featured.topProducts.join(", ")}
                </dd>
              </div>
            ) : null}
          </dl>
          <ButtonLink href={featured.href} className="mt-4 w-full justify-center">
            View full use case →
          </ButtonLink>
        </Card>
      ) : null}

      {visualEvidence &&
      (visualEvidence.officialDemoCount > 0 ||
        visualEvidence.screenshotCount > 0) ? (
        <Card aria-labelledby="uc-visual-evidence-heading">
          <h2
            id="uc-visual-evidence-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Visual evidence
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
            <li>
              {visualEvidence.officialDemoCount} official demo
              {visualEvidence.officialDemoCount === 1 ? "" : "s"}
            </li>
            <li>
              {visualEvidence.screenshotCount} screenshot
              {visualEvidence.screenshotCount === 1 ? "" : "s"}
            </li>
          </ul>
          <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
            Counts are display-only — they do not change product ranking.
          </p>
          {visualEvidence.evidenceHref ? (
            <a
              href={visualEvidence.evidenceHref}
              className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              View evidence →
            </a>
          ) : null}
        </Card>
      ) : null}

      {comparisons.length > 0 ? (
        <Card aria-labelledby="uc-compare-heading">
          <h2
            id="uc-compare-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Popular comparisons
          </h2>
          <ul className="mt-3 space-y-3">
            {comparisons.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group block">
                  <span className="flex items-center gap-1">
                    {item.products.slice(0, 2).map((p) => (
                      <ProductLogo
                        key={p.name}
                        name={p.name}
                        logo={p.logo}
                        size="sm"
                      />
                    ))}
                  </span>
                  <span className="mt-1.5 block text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:underline">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/compare/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all comparisons
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      {resources.length > 0 ? (
        <Card aria-labelledby="uc-resources-heading">
          <h2
            id="uc-resources-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Helpful resources
          </h2>
          <ul className="mt-3 space-y-2">
            {resources.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-start gap-2 text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                >
                  <FileText
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                    aria-hidden
                  />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <NewsletterCard source="article-inline" />
    </aside>
  );
}

export function UseCaseResearchCallout({
  href = "/company/how-we-review-software/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex gap-3">
        <Lightbulb
          className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
          aria-hidden
        />
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          <span className="font-medium text-[var(--sg-color-text)]">
            Find the right use case first.
          </span>{" "}
          We map workflows from catalogue evidence — not invented buyer stories.
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        How we recommend use cases →
      </Link>
    </aside>
  );
}
