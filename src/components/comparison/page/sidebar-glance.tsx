"use client";

import { ComparisonTabLink } from "@/components/comparison/page/comparison-page-client";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  COMPARISON_PAGE_TABS,
  type ComparisonPageTabId,
} from "@/services/comparison-page/tabs";

export type ComparisonSidebarGlanceData = {
  overallLabel: string;
  productA: {
    name: string;
    logo?: { src: string; alt: string } | null;
  };
  productB: {
    name: string;
    logo?: { src: string; alt: string } | null;
  };
  winsACount: number;
  winsBCount: number;
  tiesCount: number;
  finderHref: string;
  finderLabel: string;
  availableTabs: ComparisonPageTabId[];
  guides: Array<{ href: string; title: string }>;
};

type Props = {
  glance: ComparisonSidebarGlanceData;
};

export function ComparisonSidebarGlance({ glance }: Props) {
  const tabs = COMPARISON_PAGE_TABS.filter((t) =>
    glance.availableTabs.includes(t.id),
  );

  return (
    <aside className="space-y-5">
      <Card className="overflow-hidden p-0 ring-1 ring-[var(--sg-color-primary)]/15">
        <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            At a glance
          </h2>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            {glance.overallLabel}
          </p>
        </div>
        <div className="space-y-3 px-5 py-4">
          <div className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-success-soft)]/70 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <ProductLogo
                name={glance.productA.name}
                logo={glance.productA.logo}
                size="sm"
              />
              <span className="truncate text-sm text-[var(--sg-color-text)]">
                {glance.productA.name} leads
              </span>
            </div>
            <Badge variant="success">{glance.winsACount}</Badge>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-danger-soft)]/60 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <ProductLogo
                name={glance.productB.name}
                logo={glance.productB.logo}
                size="sm"
              />
              <span className="truncate text-sm text-[var(--sg-color-text)]">
                {glance.productB.name} leads
              </span>
            </div>
            <Badge variant="danger">{glance.winsBCount}</Badge>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)]/50 px-3 py-2 text-sm">
            <span className="text-[var(--sg-color-text-muted)]">Ties</span>
            <Badge variant="primary">{glance.tiesCount}</Badge>
          </div>
          <ButtonLink href={glance.finderHref} className="w-full" size="sm">
            {glance.finderLabel}
          </ButtonLink>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
          Jump to
        </h2>
        <ul className="mt-3 space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <ComparisonTabLink
                tab={tab.id as ComparisonPageTabId}
                className="flex items-center justify-between rounded-[var(--sg-radius-md)] px-2.5 py-2 text-sm text-[var(--sg-color-text)] hover:bg-[var(--sg-color-primary-soft)]/60 hover:text-[var(--sg-color-primary)]"
              >
                {tab.label}
                <span aria-hidden className="text-[var(--sg-color-primary)]">
                  →
                </span>
              </ComparisonTabLink>
            </li>
          ))}
        </ul>
      </Card>

      {glance.guides.length > 0 ? (
        <Card className="border-[var(--sg-color-primary)]/15 bg-[var(--sg-color-surface-tint)] p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Related guides
          </h2>
          <ul className="mt-3 space-y-2">
            {glance.guides.map((guide) => (
              <li key={guide.href}>
                <a
                  href={guide.href}
                  className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {guide.title}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </aside>
  );
}
