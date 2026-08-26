"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ProductLogo } from "@/components/software/product-logo";
import { SoftwareHubHeroFacts } from "@/components/software/hub/software-hub-hero-facts";
import { SoftwareProductHubTabs } from "@/components/software/hub/software-product-hub-tabs";
import type { SoftwareHubChrome } from "@/components/software/hub/software-product-hub-client";
import {
  getSoftwareHubTab,
  type SoftwareHubTabId,
} from "@/services/software-review/hub-tabs";

type BreadcrumbItem = { name: string; path: string };

type Props = {
  chrome: SoftwareHubChrome;
  activeTab: SoftwareHubTabId;
  heroAside?: ReactNode;
  /** CTAs + disclosure under header facts (typically overview). */
  heroActions?: ReactNode;
  children: ReactNode;
  previewBanner?: ReactNode;
  researchBanner?: ReactNode;
};

export function SoftwareProductHubShell({
  chrome,
  activeTab,
  heroAside,
  heroActions,
  children,
  previewBanner,
  researchBanner,
}: Props) {
  const software = chrome.software;
  const tab = getSoftwareHubTab(activeTab);
  // Stable product title — tab switches must not rename the H1.
  const title = `${software.name} Review`;
  const tagline =
    chrome.tagline ??
    `${software.name} product hub — features, pricing, comparisons, and editorial review.`;

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", path: "/" },
    ...(chrome.primaryCategory
      ? [
          {
            name: chrome.primaryCategory.name,
            path: `/categories/${chrome.primaryCategory.path.join("/")}/`,
          },
        ]
      : [{ name: "Software", path: "/software/" }]),
    {
      name: `${software.name} Review`,
      path: `/software/${software.slug}/`,
    },
    ...(activeTab !== "overview"
      ? [
          {
            name: tab.label,
            path: `/software/${software.slug}/${tab.slug}/`,
          },
        ]
      : []),
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      {previewBanner}
      {researchBanner}

      <header
        className={
          heroAside
            ? "mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start lg:gap-8"
            : "mt-2"
        }
      >
        <div className="flex min-w-0 gap-4 sm:gap-5">
          <ProductLogo
            name={software.name}
            logo={software.logo}
            size="xl"
            className="!rounded-[var(--sg-radius-lg)]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-text)]">
                {title}
              </h1>
              {chrome.categoryBadge ? (
                <Badge variant="success" className="uppercase tracking-wide">
                  {chrome.categoryBadge}
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 max-w-2xl text-[var(--sg-color-text-muted)]">
              {tagline}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--sg-color-text-muted)]">
              {chrome.lastUpdated ? (
                <span>Last updated {chrome.lastUpdated.slice(0, 10)}</span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full bg-[var(--sg-color-success)]"
                  aria-hidden
                />
                {chrome.scoresApproved
                  ? "Independent editorial review"
                  : "Product profile · Editorial review in progress"}
              </span>
            </div>

            <SoftwareHubHeroFacts facts={chrome.heroFacts} className="mt-5" />
            {heroActions ? <div className="mt-5">{heroActions}</div> : null}
          </div>
        </div>

        {heroAside ? (
          <div className="min-w-0 lg:sticky lg:top-24">{heroAside}</div>
        ) : null}
      </header>

      <SoftwareProductHubTabs
        productSlug={software.slug}
        activeTab={activeTab}
        alternativesHref={chrome.alternativesHref}
        className="mt-8"
      />

      <div className="mt-8" key={activeTab}>
        {children}
      </div>
    </>
  );
}

type HeroAsideCardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function SoftwareHubHeroAsideCard({
  title,
  children,
  footer,
  className,
}: HeroAsideCardProps) {
  return (
    <aside
      className={
        className ??
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]"
      }
    >
      <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <div className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        {children}
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </aside>
  );
}

export function SoftwareHubPopularComparisons({
  items,
  allHref = "/compare/",
}: {
  items: Array<{ href: string; label: string }>;
  allHref?: string;
}) {
  if (items.length === 0) return null;
  return (
    <aside className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
      <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
        Popular comparisons
      </h2>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 5).map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-2 text-sm text-[var(--sg-color-text)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
            >
              <span>{item.label}</span>
              <span aria-hidden className="text-[var(--sg-color-text-muted)]">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={allHref}
        className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        View all comparisons →
      </Link>
    </aside>
  );
}
