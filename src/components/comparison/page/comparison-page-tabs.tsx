"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  COMPARISON_PAGE_TABS,
  getComparisonPageTab,
  type ComparisonPageTabId,
} from "@/services/comparison-page/tabs";
import { comparisonTabHref } from "@/services/comparison-page/tabs";

type Props = {
  activeTab: ComparisonPageTabId;
  availableTabs: ComparisonPageTabId[];
  slug: string;
  /** Shown on the right when space allows (e.g. "Product A vs Product B"). */
  title?: string;
  className?: string;
};

function TabIcon({ id, active }: { id: string; active: boolean }) {
  const stroke = active
    ? "var(--sg-color-primary)"
    : "var(--sg-color-text-muted)";
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "overview":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "scorecard":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16M8 15V9M12 15V7M16 15v-4" />
        </svg>
      );
    case "features":
      return (
        <svg {...common}>
          <path d="M12 2l2.2 6.6H21l-5.4 4 2.1 6.5L12 15.8 6.3 19l2.1-6.5L3 8.6h6.8L12 2z" />
        </svg>
      );
    case "pricing":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9.5 9.5c.5-1 1.5-1.5 2.5-1.5s2 .6 2 1.8c0 2.2-4 1.4-4 4 0 1.1.9 1.7 2 1.7s1.9-.4 2.4-1.2" />
        </svg>
      );
    case "pros-cons":
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      );
    case "screenshots":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="8.5" cy="10.5" r="1.5" />
          <path d="M21 16l-5-5-4 4-2-2-5 5" />
        </svg>
      );
    case "evidence":
      return (
        <svg {...common}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      );
    case "faq":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 014.2 1.8c0 1.7-2.2 2.2-2.2 3.2M12 17h.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

/**
 * Sticky horizontal comparison tabs — Link navigation loads only the active panel.
 */
export function ComparisonPageTabs({
  activeTab,
  availableTabs,
  slug,
  title,
  className,
}: Props) {
  const tabs = COMPARISON_PAGE_TABS.filter((t) =>
    availableTabs.includes(t.id),
  );

  return (
    <nav
      aria-label="Comparison sections"
      className={cn(
        "sticky top-0 z-30 -mx-1 overflow-x-auto border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 px-1 shadow-[var(--sg-shadow-sm)] backdrop-blur supports-[backdrop-filter]:bg-[var(--sg-color-surface)]/90",
        className,
      )}
    >
      <div className="flex min-w-max items-end justify-between gap-4">
        <ul className="flex items-end gap-1" role="tablist">
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            const label = getComparisonPageTab(tab.id).label;
            const href = comparisonTabHref(slug, tab.id);
            return (
              <li key={tab.id} role="presentation">
                <Link
                  href={href}
                  prefetch={false}
                  role="tab"
                  aria-selected={active}
                  aria-current={active ? "page" : undefined}
                  data-comparison-tab={tab.id}
                  title={label}
                  className={cn(
                    "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "border-[var(--sg-color-primary)] text-[var(--sg-color-primary)]"
                      : "border-transparent text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
                  )}
                >
                  <TabIcon id={tab.icon} active={active} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {title ? (
          <p className="hidden shrink-0 pb-3 text-sm text-[var(--sg-color-text-muted)] xl:block">
            {title}
          </p>
        ) : null}
      </div>
    </nav>
  );
}
