import { createElement } from "react";
import Link from "next/link";
import {
  Calculator,
  ChevronRight,
  Compass,
  FileText,
  Layers,
} from "lucide-react";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type GuideSidebarLink = {
  href: string;
  label: string;
  description?: string;
};

export type GuideToolLink = {
  href: string;
  label: string;
  description?: string;
  kind?: "finder" | "calculator" | "stack" | "other";
};

export type GuideTocItem = {
  id: string;
  label: string;
};

type Props = {
  toc?: GuideTocItem[];
  relatedArticles?: GuideSidebarLink[];
  tools?: GuideToolLink[];
  supportHref?: string;
  finderHref?: string;
  /** Downloadable checklists/templates hub (CRM). */
  resourcesHref?: string | null;
  className?: string;
};

function toolIcon(kind: GuideToolLink["kind"]) {
  if (kind === "calculator") return Calculator;
  if (kind === "finder") return Compass;
  if (kind === "stack") return Layers;
  return FileText;
}

export function GuideSidebar({
  toc = [],
  relatedArticles = [],
  tools = [],
  finderHref = "/tools/crm-finder/",
  resourcesHref = null,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-4", className)}>
      {toc.length > 0 ? (
        <Card
          className="sg-guide-card"
          aria-labelledby="guide-toc-heading"
        >
          <h2
            id="guide-toc-heading"
            className="text-sm font-bold text-[var(--sg-color-text)]"
          >
            In this guide
          </h2>
          <ol className="mt-3 max-h-[min(22rem,45vh)] space-y-2 overflow-y-auto">
            {toc.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="group flex items-start gap-2.5 text-sm text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)]"
                >
                  <span className="sg-guide-icon-chip mt-0.5 inline-flex size-5 shrink-0 items-center justify-center !rounded-full bg-[var(--sg-color-primary-soft)] text-[10px] font-bold text-[var(--sg-color-primary)]">
                    {i + 1}
                  </span>
                  <span className="group-hover:underline">{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      <div
        className="sg-guide-finder-cta p-5"
        aria-labelledby="guide-finder-rail-heading"
      >
        <h2
          id="guide-finder-rail-heading"
          className="text-base font-bold leading-snug"
        >
          Not sure which CRM is right for you?
        </h2>
        <p className="mt-2 text-sm text-white/85">
          Answer a few questions and get a personalized shortlist.
        </p>
        <ButtonLink
          href={finderHref}
          className="mt-4 w-full justify-center border border-white/25 bg-[var(--sg-color-navy)] !text-white shadow-md hover:bg-[#1e293b]"
        >
          Find My CRM →
        </ButtonLink>
      </div>

      {tools.length > 0 ? (
        <Card
          className="sg-guide-card"
          aria-labelledby="guide-tools-heading"
        >
          <h2
            id="guide-tools-heading"
            className="text-sm font-bold text-[var(--sg-color-text)]"
          >
            Recommended tools
          </h2>
          <ul className="mt-3 space-y-3">
            {tools.map((item) => {
              const Icon = toolIcon(item.kind);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-3"
                  >
                    <span
                      data-tone="blue"
                      className="sg-guide-icon-chip size-9 shrink-0 rounded-lg"
                    >
                      {createElement(Icon, {
                        className: "size-4",
                        "aria-hidden": true,
                      })}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-[var(--sg-color-text)] underline-offset-2 group-hover:text-[var(--sg-color-primary)] group-hover:underline">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block text-xs text-[var(--sg-color-text-muted)]">
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}

      {resourcesHref ? (
        <Card
          className="sg-guide-card"
          aria-labelledby="guide-resources-heading"
        >
          <h2
            id="guide-resources-heading"
            className="text-sm font-bold text-[var(--sg-color-text)]"
          >
            Checklists & templates
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Free downloadable CRM evaluation, implementation, and migration
            artifacts.
          </p>
          <Link
            href={resourcesHref}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Browse CRM resources
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      {relatedArticles.length > 0 ? (
        <Card
          className="sg-guide-card"
          aria-labelledby="related-articles-heading"
        >
          <h2
            id="related-articles-heading"
            className="text-sm font-bold text-[var(--sg-color-text)]"
          >
            Related articles
          </h2>
          <ul className="mt-3 space-y-3">
            {relatedArticles.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="group flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-primary)]">
                    <FileText className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 group-hover:text-[var(--sg-color-primary)] group-hover:underline">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/guides/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all articles
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Card>
      ) : null}

      <NewsletterCard
        source="article-inline"
        className="sg-guide-card border-[var(--sg-guide-tip-info-border)] bg-[var(--sg-guide-tip-info-bg)]"
      />
    </aside>
  );
}
