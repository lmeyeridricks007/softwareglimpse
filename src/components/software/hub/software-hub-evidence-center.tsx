"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { cn } from "@/lib/cn";
import {
  EVIDENCE_CENTER_PAGE_SIZE,
  filterEvidenceItems,
  type EvidenceCenterFilter,
  type EvidenceCenterItem,
  type EvidenceCenterModel,
  type EvidenceFreshness,
} from "@/services/software-review/evidence-center";

const FILTER_LABELS: { id: EvidenceCenterFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "documentation", label: "Documentation" },
  { id: "pricing", label: "Pricing" },
  { id: "screenshots", label: "Screenshots" },
  { id: "videos", label: "Videos" },
  { id: "features", label: "Features" },
  { id: "use-cases", label: "Use Cases" },
  { id: "implementation", label: "Implementation" },
];

type Props = {
  model: EvidenceCenterModel;
  vendorName: string;
};

function formatDisplayDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function freshnessBadge(freshness: EvidenceFreshness): {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
} {
  if (freshness === "verified") return { label: "Verified", tone: "success" };
  if (freshness === "needs-refresh")
    return { label: "Needs refresh", tone: "warning" };
  return { label: "Unavailable", tone: "danger" };
}

function badgeLabel(
  badge: EvidenceCenterItem["badge"],
): { label: string; tone: "success" | "neutral" } {
  if (badge === "primary-source") {
    return { label: "Primary source", tone: "success" };
  }
  return { label: "SoftwareGlimpse analysis", tone: "neutral" };
}

function EvidenceCoverageSummary({
  summary,
}: {
  summary: EvidenceCenterModel["summary"];
}) {
  const cells = [
    { label: "Official sources", value: String(summary.officialSources) },
    { label: "Screenshots", value: String(summary.screenshots) },
    { label: "Official videos", value: String(summary.officialVideos) },
    { label: "Feature claims", value: String(summary.featureClaims) },
    { label: "Pricing records", value: String(summary.pricingRecords) },
    {
      label: "Last verified",
      value: formatDisplayDate(summary.lastVerified),
    },
  ];

  return (
    <section aria-labelledby="research-coverage-heading">
      <h2
        id="research-coverage-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Catalogue coverage
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-3"
          >
            <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {cell.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--sg-color-text)]">
              {cell.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EvidenceItemCard({
  item,
  vendorName,
}: {
  item: EvidenceCenterItem;
  vendorName: string;
}) {
  const freshness = freshnessBadge(item.freshness);
  const provenance = badgeLabel(item.badge);
  const isVideo =
    item.kind === "video" ||
    item.kind === "webinar" ||
    item.kind === "tutorial";

  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            {item.kindLabel}
          </p>
          <Badge variant={provenance.tone}>{provenance.label}</Badge>
          <Badge variant={freshness.tone}>{freshness.label}</Badge>
        </div>

        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          {item.title}
        </h3>

        {item.summary ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            {item.summary}
          </p>
        ) : null}

        {item.supportsLabels.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What it supports
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {item.supportsLabels.map((label) => (
                <li key={label}>
                  <Badge variant="neutral">{label}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.demonstrates.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              What this demonstrates
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {item.demonstrates.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.claimConnections.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Used to support
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
              {item.claimConnections.map((c) => (
                <li key={c.label}>{c.label}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.screenshot ? (
          <div className="overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.screenshot.src}
              alt={item.screenshot.alt}
              className="aspect-video h-auto w-full object-contain"
            />
          </div>
        ) : null}

        {isVideo && item.media ? (
          <OfficialProductVideo
            media={item.media}
            vendorName={vendorName}
            variant="compact"
            priority="low"
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4">
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Verified:{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              {formatDisplayDate(item.verifiedAt)}
            </span>
          </p>
          {item.sourceUrl ? (
            <ExternalLink
              href={item.sourceUrl}
              type="evidence-source"
              className="text-sm font-medium"
            >
              Open source ↗
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

/**
 * Unified public evidence center — filters, cards, load more.
 * Shows what SoftwareGlimpse based its product analysis on.
 */
export function SoftwareHubEvidenceCenter({ model, vendorName }: Props) {
  const [filter, setFilter] = useState<EvidenceCenterFilter>("all");
  const [visibleCount, setVisibleCount] = useState(EVIDENCE_CENTER_PAGE_SIZE);

  const filtered = useMemo(
    () => filterEvidenceItems(model.items, filter),
    [model.items, filter],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const grouped = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, EvidenceCenterItem[]>();
    for (const item of visible) {
      const key = item.kindLabel;
      if (!map.has(key)) {
        order.push(key);
        map.set(key, []);
      }
      map.get(key)!.push(item);
    }
    return order.map((label) => ({ label, items: map.get(label)! }));
  }, [visible]);

  function onFilterChange(next: EvidenceCenterFilter) {
    setFilter(next);
    setVisibleCount(EVIDENCE_CENTER_PAGE_SIZE);
  }

  return (
    <div className="space-y-8">
      <EvidenceCoverageSummary summary={model.summary} />

      <section aria-labelledby="evidence-library-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="evidence-library-heading"
              className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
            >
              Evidence library
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Primary sources and SoftwareGlimpse recommendations used for this
              product analysis.
            </p>
          </div>
          <p className="text-sm tabular-nums text-[var(--sg-color-text-muted)]">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div
          className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1"
          role="tablist"
          aria-label="Evidence filters"
        >
          {FILTER_LABELS.map((f) => {
            const count = model.filterCounts[f.id];
            const active = filter === f.id;
            const disabled = f.id !== "all" && count === 0;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={disabled}
                onClick={() => onFilterChange(f.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                    : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-border-strong)] hover:text-[var(--sg-color-text)]",
                  disabled && "cursor-not-allowed opacity-40",
                )}
              >
                {f.label}
                <span className="ml-1.5 tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-5 p-6 text-sm text-[var(--sg-color-text-muted)]">
            No evidence in this category yet.
          </Card>
        ) : (
          <div className="mt-5 space-y-8">
            {grouped.map((group) => (
              <div key={group.label}>
                {filter === "all" && grouped.length > 1 ? (
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {group.label}
                  </h3>
                ) : null}
                <ul className="grid gap-4">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <EvidenceItemCard item={item} vendorName={vendorName} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {hasMore ? (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={() =>
                setVisibleCount((n) => n + EVIDENCE_CENTER_PAGE_SIZE)
              }
            >
              Load more ({filtered.length - visibleCount} remaining)
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
