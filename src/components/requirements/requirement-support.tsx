"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus, X } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import type {
  RequirementDetailModel,
  RequirementFeatureCellStatus,
  RequirementFitStatus,
  RequirementProductRow,
} from "@/services/requirement-detail/types";
import {
  fitStatusLabel,
  fitStatusShortLabel,
} from "@/services/requirement-detail/labels";
import type { RequirementCriterionCellEvidence } from "@/services/requirement-detail/scorecard-keys";
import { scorecardEvidenceKey } from "@/services/requirement-detail/scorecard-keys";
import { RequirementScorecardEvidenceDrawer } from "@/components/requirements/requirement-scorecard-evidence-drawer";
import { cn } from "@/lib/cn";

function fitBadgeVariant(
  status: RequirementFitStatus,
): "success" | "primary" | "warning" | "danger" | "neutral" {
  if (status === "strong-support") return "success";
  if (status === "good-support") return "primary";
  if (status === "partial-support") return "warning";
  if (status === "limited-support") return "warning";
  if (status === "does-not-satisfy") return "danger";
  return "neutral";
}

function CellIcon({ status }: { status: RequirementFeatureCellStatus }) {
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
      aria-label="Partial / plan dependent"
    >
      ◐
    </span>
  );
}

function relationLabel(rel: string): string {
  if (rel === "required") return "Critical";
  if (rel === "strongly-supporting") return "Important";
  if (rel === "optional") return "Optional";
  return "Supporting";
}

export function RequirementCriteria({
  items,
  className,
}: {
  items: RequirementDetailModel["profile"]["evaluationCriteria"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="criteria"
      aria-labelledby="criteria-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="criteria-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What good support looks like
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="h-full p-4">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                      hubToneClass(index),
                    )}
                  >
                    {createElement(Icon, {
                      className: "size-4",
                      "aria-hidden": true,
                    })}
                  </span>
                  <Badge variant="neutral">{item.importance}</Badge>
                </div>
                <p className="mt-3 text-sm font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--sg-color-text-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[var(--sg-color-primary)]" />{" "}
          Required
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-[var(--sg-color-warning)]" />{" "}
          Important
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-[var(--sg-color-border)]" />{" "}
          Supporting
        </span>
      </div>
    </section>
  );
}

export function RequirementFeatures({
  core,
  supporting,
  className,
}: {
  core: RequirementDetailModel["coreFeatures"];
  supporting: RequirementDetailModel["supportingFeatures"];
  className?: string;
}) {
  if (core.length === 0 && supporting.length === 0) return null;

  const renderCard = (
    f: RequirementDetailModel["coreFeatures"][number],
    variant: "primary" | "neutral",
  ) => {
    const href =
      f.featurePageSlug
        ? `/features/${f.featurePageSlug}/`
        : f.featureSlug === "custom-pipelines"
          ? "/features/multiple-pipelines/"
          : f.featureSlug === "workflow-automation"
            ? "/features/workflow-automation/"
            : null;
    const content = (
      <>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
            {f.name}
          </p>
          <Badge variant={variant}>{relationLabel(f.relationship)}</Badge>
        </div>
        <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
          {f.rationale}
        </p>
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          Evidence across catalogue products: Docs · Screenshots · Official
          demos
        </p>
        {href ? (
          <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
            {withSingleArrow("Explore feature")}
          </span>
        ) : null}
      </>
    );
    return href ? (
      <Link href={href} className="group block h-full">
        <Card variant="interactive" className="flex h-full flex-col p-4">
          {content}
        </Card>
      </Link>
    ) : (
      <Card className="flex h-full flex-col p-4">{content}</Card>
    );
  };

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="features-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Features that satisfy this requirement
      </h2>
      {core.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Core features
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {core.map((f) => (
              <li key={f.featureSlug} className="space-y-2">
                {renderCard(f, "primary")}
                <a
                  href="#see-support"
                  className="inline-block text-xs font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  ▶ See examples
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {supporting.length > 0 ? (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Supporting features
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supporting.map((f) => (
              <li key={f.featureSlug}>{renderCard(f, "neutral")}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RequirementProductFit({
  title,
  items,
  className,
}: {
  title: string;
  items: RequirementProductRow[];
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
        Fit reflects feature support for this requirement — not
        affiliate status. Insufficient evidence is never treated as failure.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center gap-3">
                <ProductLogo name={item.name} logo={item.logo} size="sm" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <Badge
                    variant={fitBadgeVariant(item.fitStatus)}
                    className="mt-1"
                  >
                    {fitStatusLabel(item.fitStatus)}
                  </Badge>
                </div>
              </div>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">
                    Core features
                  </dt>
                  <dd className="font-medium">
                    {item.coreSatisfied}/{item.coreTotal || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">
                    Supporting
                  </dt>
                  <dd className="font-medium">
                    {item.supportingSatisfied}/{item.supportingTotal || "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">Evidence</dt>
                  <dd className="font-medium text-right text-xs">
                    {item.evidenceCount} sources
                    {item.screenshotCount > 0
                      ? ` · ${item.screenshotCount} screenshots`
                      : ""}
                    {item.officialVideoCount > 0
                      ? ` · ${item.officialVideoCount} official video`
                      : ""}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">Plan</dt>
                  <dd className="font-medium">
                    {item.minimumPlan ?? "Not verified"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[var(--sg-color-text-muted)]">
                    Confidence
                  </dt>
                  <dd className="font-medium">{item.evidenceConfidence}</dd>
                </div>
              </dl>
              {(item.officialVideoCount > 0 || item.screenshotCount > 0) && (
                <p className="mt-2 text-xs font-medium text-[var(--sg-color-primary)]">
                  Visual evidence available
                </p>
              )}
              {item.keyStrength ? (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  <span className="font-medium text-[var(--sg-color-text)]">
                    Key strength:{" "}
                  </span>
                  {item.keyStrength}
                </p>
              ) : null}
              <Link
                href={`#deep-${item.slug}`}
                className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Why this fit?
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementScorecard({
  rows,
  criteria,
  evidenceByKey,
  className,
}: {
  rows: RequirementProductRow[];
  criteria: RequirementDetailModel["profile"]["evaluationCriteria"];
  evidenceByKey?: Record<string, RequirementCriterionCellEvidence>;
  className?: string;
}) {
  const [drawerKey, setDrawerKey] = useState<string | null>(null);

  if (rows.length === 0) return null;
  const cols = criteria.slice(0, 5);
  const products = rows.slice(0, 6);
  const activeCell = drawerKey ? (evidenceByKey?.[drawerKey] ?? null) : null;

  return (
    <section
      id="scorecard"
      aria-labelledby="scorecard-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="scorecard-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Requirement scorecard
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Each cell reflects feature support for that criterion. Open
        Why? for documentation, screenshots, and official videos mapped to that
        criterion only — video counts never change the assessment.
      </p>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Criterion
              </th>
              {products.map((p) => (
                <th key={p.slug} className="px-3 py-3 text-center font-semibold">
                  <div className="flex flex-col items-center gap-1">
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    <span>{p.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cols.map((c) => (
              <tr
                key={c.id}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3 font-medium">
                  {c.name}
                </td>
                {products.map((row) => {
                  const status =
                    row.criterionCells[c.id] ?? "insufficient-evidence";
                  const key = scorecardEvidenceKey(row.slug, c.id);
                  const evidence = evidenceByKey?.[key];
                  const counts = evidence?.counts;
                  return (
                    <td key={row.slug} className="px-3 py-3 text-center align-top">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant={fitBadgeVariant(status)}>
                          {fitStatusShortLabel(status)}
                        </Badge>
                        {counts &&
                        (counts.docs > 0 ||
                          counts.screenshots > 0 ||
                          counts.videos > 0) ? (
                          <p className="text-[10px] tabular-nums text-[var(--sg-color-text-muted)]">
                            {counts.docs > 0 ? `${counts.docs} docs` : null}
                            {counts.docs > 0 &&
                            (counts.screenshots > 0 || counts.videos > 0)
                              ? " · "
                              : null}
                            {counts.screenshots > 0
                              ? `${counts.screenshots} screenshots`
                              : null}
                            {counts.screenshots > 0 && counts.videos > 0
                              ? " · "
                              : null}
                            {counts.videos > 0
                              ? `${counts.videos} video${counts.videos === 1 ? "" : "s"}`
                              : null}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => setDrawerKey(key)}
                          className="text-[10px] font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          Why?
                        </button>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-[var(--sg-color-border)]">
              <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Overall / plan
              </td>
              {products.map((row) => (
                <td key={row.slug} className="px-3 py-3 text-center text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <Badge variant={fitBadgeVariant(row.fitStatus)}>
                      {fitStatusShortLabel(row.fitStatus)}
                    </Badge>
                    <span className="text-[var(--sg-color-text-muted)]">
                      {row.minimumPlan ?? "Plan not verified"}
                    </span>
                    <span className="text-[var(--sg-color-text-muted)]">
                      Confidence: {row.evidenceConfidence}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <RequirementScorecardEvidenceDrawer
        open={Boolean(drawerKey && activeCell)}
        onClose={() => setDrawerKey(null)}
        cell={activeCell}
      />
    </section>
  );
}

export function RequirementMatrix({
  products,
  features,
  className,
}: {
  products: RequirementProductRow[];
  features: RequirementDetailModel["matrixFeatures"];
  className?: string;
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const compareHref = useMemo(() => {
    if (selected.length < 2) return null;
    const [a, b] = selected;
    return `/compare/build/?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`;
  }, [selected]);

  if (products.length === 0 || features.length === 0) return null;

  const visible = differencesOnly
    ? features.filter((f) => {
        const values = new Set(
          products.map((p) => p.featureCells[f.slug] ?? "not-evidenced"),
        );
        return values.size > 1;
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
            Compare how products meet this requirement
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Unknown / not verified is never treated as unsupported.
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
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Feature
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
            {visible.map((f) => (
              <tr
                key={f.slug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3 font-medium">
                  {f.name}
                </td>
                {products.map((p) => (
                  <td key={p.slug} className="px-3 py-3">
                    <span className="flex justify-center">
                      <CellIcon
                        status={p.featureCells[f.slug] ?? "not-evidenced"}
                      />
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
