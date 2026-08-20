"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EvidenceMark } from "@/components/industries/evidence-mark";
import { withSingleArrow } from "@/components/industries/industry-hub-icons";
import { CapabilityFitWhyButton } from "@/components/industries/capability/capability-assessment-drawer";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type {
  CapabilityFitLabel,
  IndustryCapabilityProductRow,
} from "@/services/industry-capability";
import type { EvidenceCell } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

function fitBadgeVariant(
  label: CapabilityFitLabel,
): "success" | "primary" | "warning" | "neutral" {
  if (label === "Strong") return "success";
  if (label === "Good") return "primary";
  if (label === "Limited") return "warning";
  return "neutral";
}

type ScorecardProps = {
  title?: string;
  capabilityName: string;
  rows: IndustryCapabilityProductRow[];
  scorecardColumns: Array<{ key: string; label: string }>;
  screenshotsHref?: string;
  whyRequirementLabels?: string[];
  whyFeatureLabels?: string[];
  /** Per-product requirement evidence summaries for the Why? drawer. */
  requirementEvidenceByProduct?: Record<
    string,
    Array<{
      requirementName: string;
      documentationCount: number;
      screenshotCount: number;
      officialVideoCount: number;
      videoTitles: string[];
    }>
  >;
  className?: string;
};

export function CapabilityScorecard({
  title,
  capabilityName,
  rows,
  scorecardColumns,
  screenshotsHref = "#screenshots",
  whyRequirementLabels = [],
  whyFeatureLabels = [],
  requirementEvidenceByProduct = {},
  className,
}: ScorecardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const compareHref = useMemo(() => {
    if (selected.length < 2) return null;
    const [a, b] = selected;
    return `/compare/build/?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`;
  }, [selected]);

  if (rows.length === 0) return null;

  return (
    <section
      id="products"
      aria-labelledby="scorecard-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="scorecard-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title ?? `How CRM products compare for ${capabilityName.toLowerCase()}`}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Overall labels use approved criterion assessments when available;
            otherwise they reflect feature-support coverage — not an
            industry ranking.
          </p>
        </div>
        <Link
          href={screenshotsHref}
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow(`See ${capabilityName.toLowerCase()} evidence`)}
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[820px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold">Overall</th>
              {scorecardColumns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-center font-semibold">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold">Best suited to</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const checked = selected.includes(row.slug);
              return (
                <tr
                  key={row.slug}
                  className="border-t border-[var(--sg-color-border)]"
                >
                  <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelected((prev) => {
                            if (prev.includes(row.slug)) {
                              return prev.filter((s) => s !== row.slug);
                            }
                            if (prev.length >= 2) return [prev[1]!, row.slug];
                            return [...prev, row.slug];
                          });
                        }}
                        className="size-4 rounded border-[var(--sg-color-border)]"
                        aria-label={`Select ${row.name}`}
                      />
                      <ProductLogo name={row.name} logo={row.logo} size="sm" />
                      <span className="font-medium">{row.name}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge variant={fitBadgeVariant(row.fitLabel)}>
                        {row.fitLabel}
                        {row.fitScore != null ? ` · ${row.fitScore}/10` : ""}
                      </Badge>
                      <p className="text-[11px] tabular-nums text-[var(--sg-color-text-muted)]">
                        Evidence: {row.evidenceCount} sources ·{" "}
                        {row.screenshotCount} screenshots ·{" "}
                        {row.officialVideoCount} official videos
                      </p>
                      <CapabilityFitWhyButton
                        capabilityName={capabilityName}
                        row={row}
                        requirementLabels={whyRequirementLabels}
                        featureLabels={whyFeatureLabels}
                        requirementEvidenceRows={
                          requirementEvidenceByProduct[row.slug]
                        }
                      />
                    </div>
                  </td>
                  {scorecardColumns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <span className="flex justify-center">
                        <EvidenceMark
                          cell={(row.cells[col.key] ?? "unknown") as EvidenceCell}
                        />
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                    {row.positioning ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={selected.length < 2}
          onClick={() => {
            if (compareHref) router.push(compareHref);
          }}
        >
          {withSingleArrow("Compare selected products")}
        </Button>
        <p className="text-xs text-[var(--sg-color-text-muted)]">
          Select two products for a side-by-side comparison.
        </p>
      </div>
    </section>
  );
}

type MatrixProps = {
  title?: string;
  products: IndustryCapabilityProductRow[];
  features: Array<{ slug: string; name: string }>;
  className?: string;
};

export function CapabilityRequirementMatrix({
  title = "Requirement-by-requirement matrix",
  products,
  features,
  className,
}: MatrixProps) {
  const [differencesOnly, setDifferencesOnly] = useState(false);

  if (products.length === 0 || features.length === 0) return null;

  const visibleFeatures = differencesOnly
    ? features.filter((f) => {
        const values = products.map((p) => p.cells[f.slug] ?? "unknown");
        return new Set(values).size > 1;
      })
    : features;

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
            {title}
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            ✓ Supported · ~ Partial / plan dependent · — Not evidenced. Unknown
            is never shown as “No”.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
          <input
            type="checkbox"
            checked={differencesOnly}
            onChange={(e) => setDifferencesOnly(e.target.checked)}
            className="size-4 rounded border-[var(--sg-color-border)]"
          />
          Show differences only
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Requirement
              </th>
              {products.map((p) => (
                <th key={p.slug} className="px-4 py-3 text-center font-semibold">
                  <Link
                    href={p.reviewHref}
                    className="inline-flex flex-col items-center gap-1 hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleFeatures.map((feature) => (
              <tr
                key={feature.slug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3">
                  {feature.name}
                </td>
                {products.map((p) => (
                  <td key={`${feature.slug}-${p.slug}`} className="px-4 py-3">
                    <span className="flex justify-center">
                      <EvidenceMark cell={p.cells[feature.slug] ?? "unknown"} />
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type CardsProps = {
  title?: string;
  capabilityName: string;
  items: IndustryCapabilityProductRow[];
  finderHref?: string;
  className?: string;
};

export function CapabilityProductCards({
  title,
  capabilityName,
  items,
  finderHref = "/tools/crm-finder/",
  className,
}: CardsProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="product-cards-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)]">
        <div>
          <h2
            id="product-cards-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title ?? `CRM options for ${capabilityName.toLowerCase()}`}
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <Card className="flex h-full flex-col p-4">
                  <div className="flex items-start gap-3">
                    <ProductLogo name={item.name} logo={item.logo} size="md" />
                    <div className="min-w-0">
                      <p className="font-semibold">{item.name}</p>
                      {item.pricingTeaser ? (
                        <p className="mt-0.5 text-xs text-[var(--sg-color-text-muted)]">
                          {item.pricingTeaser}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <Badge
                    variant={fitBadgeVariant(item.fitLabel)}
                    className="mt-3 w-fit"
                  >
                    {item.fitLabel} {capabilityName.toLowerCase()}
                  </Badge>
                  {item.fitRationale ? (
                    <p className="mt-3 line-clamp-4 text-sm text-[var(--sg-color-text-muted)]">
                      {item.fitRationale}
                    </p>
                  ) : item.bestFor ? (
                    <p className="mt-3 line-clamp-3 text-sm text-[var(--sg-color-text-muted)]">
                      {item.bestFor}
                    </p>
                  ) : null}
                  {item.strengths.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                      {item.strengths.map((s) => (
                        <li
                          key={s}
                          className="flex gap-2 text-xs text-[var(--sg-color-text)]"
                        >
                          <span className="text-[var(--sg-color-success)]">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.limitations.length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {item.limitations.map((s) => (
                        <li
                          key={s}
                          className="flex gap-2 text-xs text-[var(--sg-color-text-muted)]"
                        >
                          <span>△</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                    Evidence confidence:{" "}
                    <span className="font-medium text-[var(--sg-color-text)]">
                      {item.evidenceConfidence}
                    </span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <ButtonLink href={item.reviewHref} variant="outline" size="sm">
                      Read review
                    </ButtonLink>
                    <ButtonLink href={item.compareHref} variant="ghost" size="sm">
                      Compare
                    </ButtonLink>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <Card className="h-fit border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/60 p-5">
          <p className="text-sm font-semibold text-[var(--sg-color-text)]">
            Need help choosing?
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Answer a few questions about team size, requirements, integrations
            and budget for a personalized CRM shortlist.
          </p>
          <ButtonLink href={finderHref} className="mt-4 w-full justify-center">
            {withSingleArrow("Find My CRM")}
          </ButtonLink>
        </Card>
      </div>
    </section>
  );
}
