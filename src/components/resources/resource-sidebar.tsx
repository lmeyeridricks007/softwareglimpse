import Link from "next/link";
import { CalendarDays, Download } from "lucide-react";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import type { ResourceJourneyNode } from "@/services/resource-hub";
import { cn } from "@/lib/cn";

type DownloadItem = { href: string; label: string; format?: string };

type Props = {
  downloads?: DownloadItem[];
  journey?: ResourceJourneyNode[];
  tools?: Array<{ href: string; label: string }>;
  guides?: Array<{ href: string; title: string }>;
  lastReviewedAt?: string | null;
  className?: string;
};

export function ResourceSidebar({
  downloads = [],
  journey = [],
  tools = [],
  guides = [],
  lastReviewedAt,
  className,
}: Props) {
  return (
    <aside className={cn("space-y-5", className)}>
      {downloads.length > 0 ? (
        <Card aria-labelledby="res-download-heading">
          <h2
            id="res-download-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Download this resource
          </h2>
          <ul className="mt-3 space-y-2">
            {downloads.map((item) => (
              <li key={item.href}>
                <ButtonLink
                  href={item.href}
                  variant={item.format === "xlsx" ? "primary" : "outline"}
                  size="sm"
                  className="w-full justify-center gap-1.5"
                >
                  <Download className="size-3.5" aria-hidden />
                  {item.label.replace(/^Download\s+/i, "")}
                </ButtonLink>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            100% free · No signup
          </p>
        </Card>
      ) : null}

      {journey.length > 0 ? (
        <Card aria-labelledby="res-journey-heading">
          <h2
            id="res-journey-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Resource journey
          </h2>
          <ol className="mt-4 space-y-0">
            {journey.map((node, index) => (
              <li key={node.slug} className="relative flex gap-3 pb-4 last:pb-0">
                {index < journey.length - 1 ? (
                  <span
                    className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-px bg-[var(--sg-color-border)]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-[1] mt-1 size-3.5 shrink-0 rounded-full border-2",
                    node.current
                      ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)]"
                      : "border-[var(--sg-color-border)] bg-white",
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  {node.current ? (
                    <p className="text-sm font-semibold text-[var(--sg-color-primary)]">
                      {node.name}
                      <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                        Current step
                      </span>
                    </p>
                  ) : (
                    <Link
                      href={node.href}
                      className="text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                    >
                      {node.name}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      {tools.length > 0 ? (
        <Card aria-labelledby="res-tools-heading">
          <h2
            id="res-tools-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Related tools
          </h2>
          <ul className="mt-3 space-y-2">
            {tools.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {guides.length > 0 ? (
        <Card aria-labelledby="res-guides-heading">
          <h2
            id="res-guides-heading"
            className="text-sm font-semibold text-[var(--sg-color-text)]"
          >
            Related guides
          </h2>
          <ul className="mt-3 space-y-2">
            {guides.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {lastReviewedAt ? (
        <div className="flex items-center gap-2 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <span>
            Last updated{" "}
            <time dateTime={lastReviewedAt}>{formatReviewDate(lastReviewedAt)}</time>
          </span>
        </div>
      ) : null}

      <NewsletterCard source="article-inline" />
    </aside>
  );
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
