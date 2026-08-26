"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  SOFTWARE_HUB_TABS,
  getSoftwareHubTab,
  softwareHubPath,
  type SoftwareHubTabId,
} from "@/services/software-review/hub-tabs";

type Props = {
  productSlug: string;
  activeTab: SoftwareHubTabId;
  alternativesHref?: string | null;
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
    case "guides":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          <path d="M8 7h8M8 11h6" />
        </svg>
      );
    case "use-cases":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16M8 15V9M12 15V7M16 15v-4" />
        </svg>
      );
    case "comparisons":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "alternatives":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M10.5 10.5l3 3" />
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
    case "methodology":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4l2.5 2.5" />
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
 * Product hub tabs — Link navigation so each tab route only ships its panel.
 */
export function SoftwareProductHubTabs({
  productSlug,
  activeTab,
  alternativesHref = null,
  className,
}: Props) {
  return (
    <nav
      aria-label="Product sections"
      className={cn(
        "sticky top-0 z-30 -mx-1 overflow-x-auto border-b border-[var(--sg-color-border)] bg-[var(--sg-color-bg)]/95 px-1 backdrop-blur supports-[backdrop-filter]:bg-[var(--sg-color-bg)]/80",
        className,
      )}
    >
      <ul className="flex min-w-max items-end gap-1" role="tablist">
        {SOFTWARE_HUB_TABS.map((tab) => {
          const href =
            tab.id === "alternatives" && alternativesHref
              ? alternativesHref
              : softwareHubPath(productSlug, tab.id);
          const active = tab.id === activeTab;
          const label = getSoftwareHubTab(tab.id).label;
          const classNameTab = cn(
            "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
            active
              ? "border-[var(--sg-color-primary)] text-[var(--sg-color-primary)]"
              : "border-transparent text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
          );

          return (
            <li key={tab.id} role="presentation">
              <Link
                href={href}
                prefetch={false}
                role="tab"
                aria-selected={active}
                aria-current={active ? "page" : undefined}
                data-hub-tab={tab.id}
                data-hub-href={href}
                title={label}
                className={classNameTab}
              >
                <TabIcon id={tab.icon} active={active} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
