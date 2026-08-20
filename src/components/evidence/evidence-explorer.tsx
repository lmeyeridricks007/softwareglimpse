"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import {
  DEFAULT_EVIDENCE_EXPLORER_FILTERS,
  availableEvidenceKinds,
  filterEvidenceExplorerItems,
  groupEvidenceExplorerItems,
  type EvidenceExplorerFilters,
  type EvidenceExplorerItem,
  type EvidenceExplorerKind,
  type EvidenceExplorerModel,
} from "@/services/evidence-explorer/types";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const KIND_LABELS: Record<EvidenceExplorerKind, string> = {
  documentation: "Official documentation",
  screenshot: "Screenshot",
  "official-video": "Official video",
};

function suitabilityBadge(
  suitability: EvidenceExplorerItem["suitability"],
): { label: string; variant: "success" | "primary" | "warning" | "neutral" } {
  if (suitability === "strong") return { label: "Strong for claim type", variant: "success" };
  if (suitability === "supporting")
    return { label: "Supporting evidence", variant: "primary" };
  if (suitability === "weak") return { label: "Weak for claim type", variant: "warning" };
  if (suitability === "inappropriate")
    return { label: "Not suitable for claim type", variant: "warning" };
  return { label: "Primary source", variant: "success" };
}

function EvidenceExplorerCard({ item }: { item: EvidenceExplorerItem }) {
  const badge = suitabilityBadge(item.suitability);

  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start gap-3">
          {item.productName ? (
            <ProductLogo
              name={item.productName}
              logo={item.logo}
              size="sm"
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {KIND_LABELS[item.kind]}
              {item.productName ? ` · ${item.productName}` : ""}
            </p>
            <h3 className="mt-1 font-[family-name:var(--font-display)] text-base font-semibold text-[var(--sg-color-text)]">
              {item.title}
            </h3>
            {item.sourceOrganization ? (
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Source: {item.sourceOrganization}
              </p>
            ) : null}
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        {item.traceTrail && item.traceTrail.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Evidence chain
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text)]">
              {item.traceTrail.join(" → ")}
            </p>
          </div>
        ) : null}

        {item.supportsLabels.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Supports
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
              Demonstrates
            </p>
            <ul className="mt-2 space-y-1.5">
              {item.demonstrates.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.doesNotEstablish && item.doesNotEstablish.length > 0 ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Does not establish
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--sg-color-text-muted)]">
              {item.doesNotEstablish.slice(0, 6).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.suitabilityNote ? (
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            {item.suitabilityNote}
          </p>
        ) : null}

        {item.kind === "official-video" && item.media ? (
          <OfficialProductVideo
            media={item.media}
            vendorName={item.productName ?? "vendor"}
            variant="compact"
            priority="low"
          />
        ) : null}

        {item.kind === "screenshot" && item.screenshotSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.screenshotSrc}
            alt={item.screenshotAlt ?? item.title}
            className="aspect-video w-full rounded-[var(--sg-radius-md)] object-contain bg-[var(--sg-color-surface-muted)]"
            loading="lazy"
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--sg-color-border)] pt-4 text-sm">
          <p className="text-[var(--sg-color-text-muted)]">
            Verified:{" "}
            <span className="font-medium text-[var(--sg-color-text)]">
              {formatDate(item.verifiedAt)}
            </span>
          </p>
          {item.sourceUrl ? (
            <ExternalLink
              href={item.sourceUrl}
              type={
                item.kind === "documentation"
                  ? "documentation"
                  : "evidence-source"
              }
              className="font-medium"
            >
              Open source ↗
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

type Props = {
  model: EvidenceExplorerModel;
  /** DOM id for in-page anchors (Feature Detail uses feature-evidence). */
  sectionId?: string;
  className?: string;
  /** Hide dimension filter when page has no dimensions. */
  showDimensionFilter?: boolean;
};

/**
 * Reusable evidence explorer — docs, screenshots, official videos.
 * Designed for Feature / Requirement / Capability / Comparison / Product pages.
 * Not a generic media gallery: filters + grouping for research inspection.
 */
export function EvidenceExplorer({
  model,
  sectionId = "evidence-explorer",
  className,
  showDimensionFilter = true,
}: Props) {
  const [filters, setFilters] = useState<EvidenceExplorerFilters>(
    DEFAULT_EVIDENCE_EXPLORER_FILTERS,
  );

  const kindsPresent = useMemo(
    () => availableEvidenceKinds(model.items),
    [model.items],
  );

  const hasFacets =
    Boolean(model.facets) &&
    ((model.facets?.workflows.length ?? 0) > 0 ||
      (model.facets?.requirements.length ?? 0) > 0 ||
      (model.facets?.features.length ?? 0) > 0);

  const filtered = useMemo(
    () => filterEvidenceExplorerItems(model.items, filters),
    [model.items, filters],
  );

  const groups = useMemo(
    () =>
      groupEvidenceExplorerItems(filtered, filters.groupBy, {
        products: model.products,
        dimensions: model.dimensions,
      }),
    [filtered, filters.groupBy, model.products, model.dimensions],
  );

  if (model.items.length === 0) return null;

  const typeFilters: Array<{
    id: EvidenceExplorerKind | "all";
    label: string;
  }> = [
    { id: "all", label: "All types" },
    ...kindsPresent.map((k) => ({
      id: k,
      label:
        k === "official-video"
          ? "Official video"
          : k === "screenshot"
            ? "Screenshot"
            : "Documentation",
    })),
  ];

  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-heading`}
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id={`${sectionId}-heading`}
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {model.heading}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {model.supporting}
      </p>
      {model.methodology ? (
        <p className="mt-3 max-w-2xl text-sm text-[var(--sg-color-text)]">
          {model.methodology}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Product
            </span>
            <select
              className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
              value={filters.productSlug}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  productSlug: e.target.value as EvidenceExplorerFilters["productSlug"],
                }))
              }
            >
              <option value="all">All products</option>
              {model.products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Evidence type
            </span>
            <select
              className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
              value={filters.kind}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  kind: e.target.value as EvidenceExplorerFilters["kind"],
                }))
              }
            >
              {typeFilters.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                  {t.id === "all"
                    ? ` (${model.typeCounts.all})`
                    : ` (${model.typeCounts[t.id as EvidenceExplorerKind]})`}
                </option>
              ))}
            </select>
          </label>

          {hasFacets ? (
            <>
              {(model.facets?.workflows.length ?? 0) > 0 ? (
                <label className="block text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Workflow
                  </span>
                  <select
                    className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
                    value={filters.workflowId}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        workflowId: e.target
                          .value as EvidenceExplorerFilters["workflowId"],
                        dimensionId: "all",
                      }))
                    }
                  >
                    <option value="all">All workflow steps</option>
                    {model.facets!.workflows.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {(model.facets?.requirements.length ?? 0) > 0 ? (
                <label className="block text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {model.facets!.requirements.every((d) =>
                      d.id.startsWith("criterion:"),
                    )
                      ? "Requirement criterion"
                      : "Requirement"}
                  </span>
                  <select
                    className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
                    value={filters.requirementId}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        requirementId: e.target
                          .value as EvidenceExplorerFilters["requirementId"],
                        dimensionId: "all",
                      }))
                    }
                  >
                    <option value="all">
                      {model.facets!.requirements.every((d) =>
                        d.id.startsWith("criterion:"),
                      )
                        ? "All criteria"
                        : "All requirements"}
                    </option>
                    {model.facets!.requirements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {(model.facets?.features.length ?? 0) > 0 ? (
                <label className="block text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Feature
                  </span>
                  <select
                    className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
                    value={filters.featureId}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        featureId: e.target
                          .value as EvidenceExplorerFilters["featureId"],
                        dimensionId: "all",
                      }))
                    }
                  >
                    <option value="all">All features</option>
                    {model.facets!.features.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </>
          ) : showDimensionFilter && model.dimensions.length > 0 ? (
            <label className="block text-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Evaluation dimension
              </span>
              <select
                className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
                value={filters.dimensionId}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    dimensionId: e.target
                      .value as EvidenceExplorerFilters["dimensionId"],
                  }))
                }
              >
                <option value="all">All dimensions</option>
                {model.dimensions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Group by
            </span>
            <select
              className="mt-1 block w-full min-w-[10rem] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-sm sm:w-auto"
              value={filters.groupBy}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  groupBy: e.target
                    .value as EvidenceExplorerFilters["groupBy"],
                }))
              }
            >
              <option value="none">No grouping</option>
              <option value="product">Group by product</option>
              {model.dimensions.length > 0 ? (
                <option value="dimension">
                  {hasFacets
                    ? "Group by workflow / criterion"
                    : "Group by evaluation criterion"}
                </option>
              ) : null}
            </select>
          </label>
        </div>

        <p className="text-sm tabular-nums text-[var(--sg-color-text-muted)]">
          {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-5 p-6 text-sm text-[var(--sg-color-text-muted)]">
          No evidence matches these filters.
        </Card>
      ) : (
        <div className="mt-5 space-y-8">
          {groups.map((group) => (
            <div key={group.id}>
              {filters.groupBy !== "none" ? (
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {group.label}
                </h3>
              ) : null}
              <ul className="grid gap-4">
                {group.items.map((item) => (
                  <li key={`${group.id}:${item.id}`}>
                    <EvidenceExplorerCard item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
