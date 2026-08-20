"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus, X } from "lucide-react";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { FeatureMatrixEvidenceDrawer } from "@/components/features/feature-matrix-evidence-drawer";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  FeatureDetailModel,
  FeatureProductRow,
  FeatureSupportStatus,
} from "@/services/feature-detail/types";
import { matrixEvidenceIndicatorLabel } from "@/services/feature-detail/matrix-cell-evidence";
import { cn } from "@/lib/cn";

function supportBadgeVariant(
  status: FeatureSupportStatus,
): "success" | "warning" | "primary" | "danger" | "neutral" {
  if (status === "supported") return "success";
  if (status === "plan-dependent" || status === "partially-supported") {
    return "warning";
  }
  if (status === "limited") return "primary";
  if (status === "not-supported") return "danger";
  return "neutral";
}

function supportLabel(status: FeatureSupportStatus): string {
  switch (status) {
    case "supported":
      return "Supported";
    case "partially-supported":
      return "Partially supported";
    case "plan-dependent":
      return "Plan dependent";
    case "limited":
      return "Limited";
    case "not-supported":
      return "Not supported";
    default:
      return "Not verified";
  }
}

function SupportIcon({ status }: { status: FeatureSupportStatus }) {
  if (status === "supported") {
    return (
      <Check
        className="size-4 text-[var(--sg-color-success)]"
        aria-label="Supported"
      />
    );
  }
  if (status === "not-supported") {
    return (
      <X
        className="size-4 text-[var(--sg-color-danger)]"
        aria-label="Not supported"
      />
    );
  }
  if (status === "not-evidenced") {
    return (
      <Minus
        className="size-4 text-[var(--sg-color-text-muted)]"
        aria-label="Not verified"
      />
    );
  }
  return (
    <span
      className="text-sm font-semibold text-[var(--sg-color-warning)]"
      aria-label={supportLabel(status)}
    >
      ◐
    </span>
  );
}

function DepthBar({
  label,
  segments,
}: {
  label: string;
  segments: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-[var(--sg-color-text-muted)]">Depth</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="mt-1 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < segments
                ? label === "Strong"
                  ? "bg-[var(--sg-color-success)]"
                  : label === "Good"
                    ? "bg-[var(--sg-color-primary)]"
                    : "bg-[var(--sg-color-warning)]"
                : "bg-[var(--sg-color-surface-muted)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function FeatureProductSupport({
  title,
  items,
  className,
}: {
  title: string;
  items: FeatureProductRow[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="support-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Not verified means insufficient evidence — not the same as unsupported.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} id={`product-${item.slug}`}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center gap-3">
                <ProductLogo name={item.name} logo={item.logo} size="sm" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <SupportIcon status={item.supportStatus} />
                    <Badge variant={supportBadgeVariant(item.supportStatus)}>
                      {supportLabel(item.supportStatus)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <DepthBar
                  label={item.depthLabel}
                  segments={item.depthSegments}
                />
              </div>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">From plan</dt>
                  <dd className="font-medium">
                    {item.minimumPlan ?? "Not verified"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">Known limit</dt>
                  <dd className="max-w-[12rem] text-right font-medium">
                    {item.knownLimit ?? "Not verified"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">Evidence</dt>
                  <dd className="text-right font-medium tabular-nums">
                    {item.sourceCount} sources
                    {item.screenshotCount > 0
                      ? ` · ${item.screenshotCount} screenshots`
                      : ""}
                    {item.videoCount > 0
                      ? ` · ${item.videoCount} official video${item.videoCount === 1 ? "" : "s"}`
                      : ""}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">
                    Evidence confidence
                  </dt>
                  <dd className="font-medium">{item.evidenceConfidence}</dd>
                </div>
              </dl>
              <Link
                href={`#deep-${item.slug}`}
                className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow("View details")}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeatureComparisonMatrix({
  featureName,
  products,
  dimensions,
  className,
}: {
  featureName: string;
  products: FeatureProductRow[];
  dimensions: FeatureDetailModel["profile"]["evaluationDimensions"];
  className?: string;
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [openCell, setOpenCell] = useState<{
    dimensionId: string;
    productSlug: string;
  } | null>(null);

  const compareHref = useMemo(() => {
    if (selected.length < 2) return null;
    const [a, b] = selected;
    return `/compare/build/?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`;
  }, [selected]);

  const openProduct = openCell
    ? products.find((p) => p.slug === openCell.productSlug)
    : null;
  const openDim = openCell
    ? dimensions.find((d) => d.id === openCell.dimensionId)
    : null;
  const openCellData =
    openProduct && openDim
      ? openProduct.dimensionCells[openDim.id] ?? null
      : null;

  if (products.length === 0 || dimensions.length === 0) return null;

  // Differences use display values only — video/screenshot counts never qualify a row.
  const visible = differencesOnly
    ? dimensions.filter((dim) => {
        const values = new Set(
          products.map((p) => p.dimensionCells[dim.id]?.display ?? "—"),
        );
        return values.size > 1;
      })
    : dimensions;

  return (
    <section
      id="matrix"
      aria-labelledby="matrix-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="matrix-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            Compare {featureName.toLowerCase()} support
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Cells use feature support. Unknown is never treated as
            No. Official videos open from evidence — they are never embedded in
            the matrix.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDifferencesOnly((v) => !v)}
          >
            {differencesOnly ? "Show all" : "Show differences only"}
          </Button>
          {compareHref ? (
            <ButtonLink href={compareHref} size="sm">
              Compare selected
            </ButtonLink>
          ) : null}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[780px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Dimension
              </th>
              {products.map((p) => (
                <th key={p.slug} className="px-3 py-3 text-center font-semibold">
                  <label className="inline-flex cursor-pointer flex-col items-center gap-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.slug)}
                      onChange={() => {
                        setSelected((prev) => {
                          if (prev.includes(p.slug)) {
                            return prev.filter((s) => s !== p.slug);
                          }
                          if (prev.length >= 2) return [prev[1]!, p.slug];
                          return [...prev, p.slug];
                        });
                      }}
                      className="size-3.5 rounded border-[var(--sg-color-border)]"
                      aria-label={`Select ${p.name}`}
                    />
                    {p.name}
                  </label>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((dim) => (
              <tr key={dim.id} className="border-t border-[var(--sg-color-border)]">
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3 font-medium">
                  {dim.name}
                </td>
                {products.map((p) => {
                  const cell = p.dimensionCells[dim.id];
                  const status = cell?.status ?? "not-evidenced";
                  const indicator = matrixEvidenceIndicatorLabel(cell?.evidence);
                  return (
                    <td key={p.slug} className="px-3 py-3 text-center align-top">
                      <span className="inline-flex flex-col items-center gap-1">
                        {status === "text" ? (
                          <span className="text-xs font-medium">
                            {cell?.display ?? "—"}
                          </span>
                        ) : (
                          <>
                            <SupportIcon status={status} />
                            <span className="text-[10px] text-[var(--sg-color-text-muted)]">
                              {cell?.display}
                            </span>
                          </>
                        )}
                        {indicator ? (
                          <button
                            type="button"
                            className="mt-1 rounded-full border border-[var(--sg-color-border)] px-2 py-0.5 text-[10px] font-medium text-[var(--sg-color-primary)] hover:border-[var(--sg-color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]"
                            onClick={() =>
                              setOpenCell({
                                dimensionId: dim.id,
                                productSlug: p.slug,
                              })
                            }
                            aria-label={`View evidence for ${p.name} — ${dim.name}`}
                          >
                            {indicator}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="mt-1 text-[10px] font-medium text-[var(--sg-color-text-muted)] underline-offset-2 hover:text-[var(--sg-color-primary)] hover:underline"
                            onClick={() =>
                              setOpenCell({
                                dimensionId: dim.id,
                                productSlug: p.slug,
                              })
                            }
                            aria-label={`View evidence for ${p.name} — ${dim.name}`}
                          >
                            View evidence
                          </button>
                        )}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openCell && openProduct && openDim && openCellData ? (
        <FeatureMatrixEvidenceDrawer
          open
          onClose={() => setOpenCell(null)}
          featureName={featureName}
          dimensionName={openDim.name}
          productName={openProduct.name}
          cell={openCellData}
        />
      ) : null}

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--sg-color-text-muted)]">
        <span className="inline-flex items-center gap-1">
          <Check className="size-3.5 text-[var(--sg-color-success)]" /> Supported
        </span>
        <span>◐ Partial / plan dependent</span>
        <span className="inline-flex items-center gap-1">
          <Minus className="size-3.5" /> Not verified
        </span>
        <span className="inline-flex items-center gap-1">
          <X className="size-3.5 text-[var(--sg-color-danger)]" /> Not supported
        </span>
        <span>Evidence opens documentation, screenshots, and official videos</span>
      </div>
    </section>
  );
}

export function FeaturePlanAvailability({
  rows,
  calculatorHref,
  className,
}: {
  rows: FeatureDetailModel["planRows"];
  calculatorHref: string;
  className?: string;
}) {
  if (rows.length === 0) return null;
  return (
    <section
      id="plans"
      aria-labelledby="plans-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="plans-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Which plans include this feature?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Plan names come from feature entitlements — not inferred from
        marketing tier labels alone.
      </p>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="px-4 py-3 text-left font-semibold">Product</th>
              <th className="px-4 py-3 text-left font-semibold">
                Feature starts at
              </th>
              <th className="px-4 py-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.productSlug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProductLogo
                      name={row.productName}
                      logo={row.logo}
                      size="sm"
                    />
                    {row.productName}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.featureStartsAt ?? "Not verified"}
                </td>
                <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                  {row.notes ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ButtonLink href={calculatorHref} variant="outline" className="mt-4">
        Calculate team cost
      </ButtonLink>
    </section>
  );
}
