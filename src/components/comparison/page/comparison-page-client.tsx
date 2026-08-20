"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import { ComparisonPageHeader } from "@/components/comparison/page/comparison-page-header";
import { ComparisonPageTabs } from "@/components/comparison/page/comparison-page-tabs";
import {
  comparisonTabHref,
  type ComparisonPageTabId,
} from "@/services/comparison-page/tabs";

/** Chrome-only props — keep full comparison models off the client boundary. */
export type ComparisonPageChrome = {
  slug: string;
  title: string;
  subtitle: string;
  lastUpdated: string | null;
  evidenceSourceCount: number;
  screenshotCount: number;
  howWeReviewHref: string;
  provisional: boolean;
  researched: boolean;
  availableTabs: ComparisonPageTabId[];
  productAName: string;
  productBName: string;
};

type ComparisonTabContextValue = {
  activeTab: ComparisonPageTabId;
  slug: string;
};

const ComparisonTabContext = createContext<ComparisonTabContextValue | null>(
  null,
);

export function useComparisonTab(): ComparisonTabContextValue | null {
  return useContext(ComparisonTabContext);
}

export { comparisonTabHref } from "@/services/comparison-page/tabs";

/** Soft tab link — navigates so only the requested tab panel is server-rendered. */
export function ComparisonTabLink({
  tab,
  className,
  children,
}: {
  tab: ComparisonPageTabId;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(ComparisonTabContext);
  const href = ctx ? comparisonTabHref(ctx.slug, tab) : "#";

  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}

export type ComparisonPageClientProps = {
  chrome: ComparisonPageChrome;
  initialTab: ComparisonPageTabId;
  panels: Partial<Record<ComparisonPageTabId, ReactNode>>;
  /** Server-rendered product vs product hero (with CTAs). */
  hero: ReactNode;
  sidebar?: ReactNode;
};

/**
 * Client chrome for comparison detail: stable title + Link-based ?tab= navigation.
 * Tab bodies are passed in from the server page as React nodes (active tab only).
 */
export function ComparisonPageClient({
  chrome,
  initialTab,
  panels,
  hero,
  sidebar = null,
}: ComparisonPageClientProps) {
  const available = chrome.availableTabs;
  const safeInitial =
    available.includes(initialTab) ? initialTab : available[0] ?? "overview";

  const ctx = {
    activeTab: safeInitial,
    slug: chrome.slug,
  };

  const pairTitle = `${chrome.productAName} vs ${chrome.productBName}`;

  return (
    <ComparisonTabContext.Provider value={ctx}>
      {chrome.provisional ? (
        <ResearchStatusBanner
          message={
            chrome.researched
              ? "Some criterion outcomes on this page are still being verified. Treat conclusions as provisional until research is fully approved."
              : "This comparison is still being added. Criterion outcomes may be incomplete and should not be treated as a finished approved review."
          }
        />
      ) : null}

      <ComparisonPageHeader chrome={chrome} />

      <div className="mt-8">{hero}</div>

      <ComparisonPageTabs
        activeTab={safeInitial}
        availableTabs={available}
        slug={chrome.slug}
        title={pairTitle}
        className="mt-8"
      />

      <div
        className={
          sidebar
            ? "mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)] lg:items-start lg:gap-10"
            : "mt-8"
        }
        key={safeInitial}
      >
        <div className="min-w-0">{panels[safeInitial] ?? null}</div>
        {sidebar ? (
          <div className="min-w-0 lg:sticky lg:top-24">{sidebar}</div>
        ) : null}
      </div>
    </ComparisonTabContext.Provider>
  );
}
