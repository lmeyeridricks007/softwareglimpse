"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import { SoftwareProductHubShell } from "@/components/software/hub/software-product-hub-shell";
import type { ReviewQuickFact } from "@/services/software-review";
import {
  softwareHubPath,
  type SoftwareHubTabId,
} from "@/services/software-review/hub-tabs";

/** Chrome-only props — keep tab bodies off the client serialization boundary. */
export type SoftwareHubChrome = {
  software: {
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  };
  tagline: string | null;
  categoryBadge: string | null;
  primaryCategory: {
    name: string;
    path: string[];
  } | null;
  lastUpdated: string | null;
  scoresApproved: boolean;
  heroFacts: ReviewQuickFact[];
};

type HubTabContextValue = {
  activeTab: SoftwareHubTabId;
  productSlug: string;
};

const SoftwareHubTabContext = createContext<HubTabContextValue | null>(null);

export function useSoftwareHubTab(): HubTabContextValue | null {
  return useContext(SoftwareHubTabContext);
}

/** Soft hub link — navigates to the tab route (only the active tab is server-rendered). */
export function SoftwareHubTabLink({
  tab,
  className,
  children,
}: {
  tab: SoftwareHubTabId;
  className?: string;
  children: ReactNode;
}) {
  const hub = useContext(SoftwareHubTabContext);
  const href = hub
    ? softwareHubPath(hub.productSlug, tab)
    : "#";

  return (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}

export type SoftwareProductHubClientProps = {
  chrome: SoftwareHubChrome;
  initialTab: SoftwareHubTabId;
  /** Server-rendered panels — only the active tab should be supplied. */
  panels: Partial<Record<SoftwareHubTabId, ReactNode>>;
  /** Stable header aside (score card) — must not change with tabs. */
  heroAside?: ReactNode;
  /** Stable header actions under facts — must not change with tabs. */
  heroActions?: ReactNode;
  previewEnabled?: boolean;
  researchIncomplete?: boolean;
};

/**
 * Client chrome for the product hub: stable title + Link-based tab navigation.
 * Tab bodies are passed in from the server page as React nodes (active tab only).
 */
export function SoftwareProductHubClient({
  chrome,
  initialTab,
  panels,
  heroAside = null,
  heroActions = null,
  previewEnabled = false,
  researchIncomplete = false,
}: SoftwareProductHubClientProps) {
  const software = chrome.software;
  const hubCtx = {
    activeTab: initialTab,
    productSlug: software.slug,
  };

  return (
    <SoftwareHubTabContext.Provider value={hubCtx}>
      <SoftwareProductHubShell
        chrome={chrome}
        activeTab={initialTab}
        heroAside={heroAside}
        heroActions={heroActions}
        previewBanner={
          previewEnabled ? (
            <div
              role="status"
              className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm"
            >
              Preview mode is on — this response is noindex and bypasses caches.{" "}
              <Link
                href={`/api/preview/disable?slug=/software/${software.slug}/`}
                className="font-medium underline-offset-2 hover:underline"
              >
                Exit preview
              </Link>
            </div>
          ) : null
        }
        researchBanner={
          researchIncomplete ? (
            <ResearchStatusBanner message="Editorial research is not complete for this product. Identity and taxonomy are available; detailed claims stay limited until verified." />
          ) : null
        }
      >
        {panels[initialTab] ?? null}
      </SoftwareProductHubShell>
    </SoftwareHubTabContext.Provider>
  );
}
