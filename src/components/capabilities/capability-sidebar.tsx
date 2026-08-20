import Link from "next/link";
import { ChevronRight, FileText, Lightbulb } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type FeaturedCapability = {
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
  featured?: FeaturedCapability;
  comparisons?: SidebarComparison[];
  resources?: SidebarResource[];
  officialVideoCount?: number;
  seeInActionHref?: string | null;
  className?: string;
};

export function CapabilitySidebar({
  featured,
  comparisons = [],
  resources = [],
  officialVideoCount = 0,
  seeInActionHref,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {officialVideoCount > 0 ? (
        <Card aria-labelledby="cap-visual-evidence-heading">
          <h2
            id="cap-visual-evidence-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Visual evidence
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Official videos
              </dt>
              <dd className="font-medium tabular-nums">{officialVideoCount}</dd>
            </div>
          </dl>
          {seeInActionHref ? (
            <a
              href={seeInActionHref}
              className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              See evidence →
            </a>
          ) : null}
        </Card>
      ) : null}
      {featured ? (
        <Card aria-labelledby="featured-capability-heading">
          <div className="flex items-center justify-between gap-2">
            <h2
              id="featured-capability-heading"
              className="text-sm font-semibold text-[var(--sg-color-text)]"
            >
              Featured capability
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
            View full capability →
          </ButtonLink>
        </Card>
      ) : null}

      {comparisons.length > 0 ? (
        <Card aria-labelledby="cap-compare-heading">
          <h2
            id="cap-compare-heading"
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
        <Card aria-labelledby="cap-resources-heading">
          <h2
            id="cap-resources-heading"
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

export function CapabilityResearchCallout({
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
            Find the right capability first.
          </span>{" "}
          We map workflows from catalogue evidence — not invented buyer stories.
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        How we recommend capabilities →
      </Link>
    </aside>
  );
}
