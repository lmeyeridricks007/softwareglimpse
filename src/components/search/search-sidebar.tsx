import Link from "next/link";
import { ArrowRight, Headset } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SearchSidebarModel } from "@/services/search/types";

type Props = {
  sidebar: SearchSidebarModel;
  query?: string;
};

export function SearchSidebar({ sidebar, query }: Props) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      {sidebar.entityExplore ? (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Explore {sidebar.entityExplore.productName}
          </h2>
          <ul className="mt-3 space-y-1.5">
            {sidebar.entityExplore.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between rounded-[var(--sg-radius-md)] px-2 py-1.5 text-sm text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]"
                >
                  {link.label}
                  <ArrowRight className="size-3.5 opacity-60" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href={`/software/${sidebar.entityExplore.productSlug}/`}
            variant="outline"
            size="sm"
            className="mt-3 w-full"
          >
            View {sidebar.entityExplore.productName} review →
          </ButtonLink>
        </Card>
      ) : null}

      {sidebar.popularComparisons.length > 0 ? (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Popular comparisons
          </h2>
          <ul className="mt-3 space-y-2">
            {sidebar.popularComparisons.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="flex items-center gap-2 rounded-[var(--sg-radius-md)] px-1 py-1.5 text-sm hover:bg-[var(--sg-color-surface-muted)]"
                >
                  <ProductLogo name="A" logo={c.logoA} size="sm" className="!size-6" />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {c.title}
                  </span>
                  <ArrowRight className="size-3.5 shrink-0 text-[var(--sg-color-text-muted)]" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {sidebar.toolPromo ? (
        <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/50 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Try a tool
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--sg-color-navy)]">
            {sidebar.toolPromo.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {sidebar.toolPromo.summary}
          </p>
          <ButtonLink href={sidebar.toolPromo.href} size="sm" className="mt-3">
            {sidebar.toolPromo.ctaLabel.includes("→")
              ? sidebar.toolPromo.ctaLabel
              : `${sidebar.toolPromo.ctaLabel} →`}
          </ButtonLink>
        </Card>
      ) : null}

      {sidebar.relatedSearches.length > 0 ? (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Related searches
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {sidebar.relatedSearches.map((term) => (
              <Link
                key={term}
                href={`/search/?q=${encodeURIComponent(term)}`}
                className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] px-2.5 py-1 text-xs text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
              >
                {term}
              </Link>
            ))}
          </div>
        </Card>
      ) : null}

      <Card className="p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]">
            <Headset className="size-4" aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
              Can&apos;t find what you need?
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {query
                ? "Tell us what you were looking for and we’ll help point you in the right direction."
                : "Browse categories or contact us if something is missing."}
            </p>
            <Link
              href="/company/contact/"
              className="mt-2 inline-block text-sm font-medium text-[var(--sg-color-primary)]"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </Card>
    </aside>
  );
}
