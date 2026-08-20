"use client";

import { useMemo, useState, createElement } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Check,
  Circle,
  Sparkles,
} from "lucide-react";
import { EvidenceLegend, EvidenceMark } from "@/components/industries/evidence-mark";
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
  IndustryUseCaseModel,
  IndustryUseCaseProductRow,
  UseCaseFitLabel,
} from "@/services/industry-use-case";
import type { EvidenceCell } from "@/services/industry-hub";
import { cn } from "@/lib/cn";

function fitBadgeVariant(
  label: UseCaseFitLabel,
): "success" | "primary" | "warning" | "neutral" {
  if (label === "Strong") return "success";
  if (label === "Good") return "primary";
  if (label === "Limited") return "warning";
  return "neutral";
}

function requirementIconKey(req: {
  name: string;
  featureSlug?: string;
  icon?: string;
}): string {
  if (req.icon) return req.icon;
  const haystack = `${req.featureSlug ?? ""} ${req.name}`.toLowerCase();
  if (haystack.includes("email") || haystack.includes("calendar")) return "puzzle";
  if (haystack.includes("permission") || haystack.includes("access") || haystack.includes("sso"))
    return "shield";
  if (haystack.includes("report") || haystack.includes("forecast") || haystack.includes("analytics"))
    return "chart";
  if (haystack.includes("pipeline") || haystack.includes("deal") || haystack.includes("opportunit"))
    return "funnel";
  if (haystack.includes("automat") || haystack.includes("reminder") || haystack.includes("sequence"))
    return "zap";
  if (haystack.includes("mobile")) return "trending";
  if (haystack.includes("field") || haystack.includes("custom")) return "settings";
  if (haystack.includes("contact") || haystack.includes("account") || haystack.includes("interaction") || haystack.includes("history"))
    return "users";
  if (haystack.includes("integrat")) return "puzzle";
  return "layers";
}

function PriorityRequirementList({
  items,
  variant,
}: {
  items: IndustryUseCaseModel["mustHaveRequirements"];
  variant: "must" | "nice";
}) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((req, index) => {
        const Icon = resolveIndustryIcon(requirementIconKey(req));
        const row = (
          <div
            className={cn(
              "flex h-full gap-3 rounded-[var(--sg-radius-lg)] border bg-white/95 p-3 transition-colors",
              variant === "must"
                ? "border-[var(--sg-color-success)]/20"
                : "border-[var(--sg-color-border)]",
              req.href && "group-hover:border-[var(--sg-color-primary)]/35",
            )}
          >
            <span
              className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                hubToneClass(index + (variant === "must" ? 1 : 3)),
              )}
            >
              {createElement(Icon, {
                className: "size-3.5",
                "aria-hidden": true,
              })}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-sm font-semibold text-[var(--sg-color-navy)]",
                    req.href && "group-hover:text-[var(--sg-color-primary)]",
                  )}
                >
                  {req.name}
                </p>
                {variant === "must" ? (
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="mt-0.5 size-3.5 shrink-0 text-[var(--sg-color-text-muted)]"
                    aria-hidden
                  />
                )}
              </div>
              {req.description ? (
                <p className="mt-1 text-xs leading-relaxed text-[var(--sg-color-text-muted)]">
                  {req.description}
                </p>
              ) : null}
              {req.href ? (
                <p className="mt-2 text-xs font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow(
                    req.href.includes("/requirements/")
                      ? "Explore requirement"
                      : req.href.includes("/features/")
                        ? "Explore feature"
                        : "Explore",
                  )}
                </p>
              ) : null}
            </div>
          </div>
        );

        return (
          <li key={req.id}>
            {req.href ? (
              <Link href={req.href} className="group block h-full">
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function UseCaseShortAnswer({
  picks,
  decisionNuance,
  className,
}: {
  picks: IndustryUseCaseModel["summaryPicks"];
  decisionNuance: string | null;
  className?: string;
}) {
  if (picks.length === 0) return null;
  return (
    <section
      id="short-answer"
      aria-labelledby="short-answer-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="short-answer-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        The short answer
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Scenario-based fits from capability priorities — not a single
        universal ranking.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {picks.map((pick) => {
          if (!pick.product) return null;
          return (
            <li key={pick.id}>
              <Card className="flex h-full flex-col p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                  {pick.label}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <ProductLogo
                    name={pick.product.name}
                    logo={pick.product.logo}
                    size="sm"
                  />
                  <span className="font-semibold">{pick.product.name}</span>
                </div>
                <Badge
                  variant={fitBadgeVariant(pick.product.fitLabel)}
                  className="mt-3 w-fit"
                >
                  {pick.product.fitLabel}
                  {pick.product.fitScore != null
                    ? ` · ${pick.product.fitScore}/10`
                    : ""}
                </Badge>
                {pick.rationale ? (
                  <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                    {pick.rationale}
                  </p>
                ) : null}
                <Link
                  href={pick.product.reviewHref}
                  className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow("Read review")}
                </Link>
              </Card>
            </li>
          );
        })}
      </ul>
      {decisionNuance ? (
        <Card className="mt-5 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-4">
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
            There is no universal winner.
          </p>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {decisionNuance}
          </p>
        </Card>
      ) : null}
    </section>
  );
}

export function UseCaseRequirements({
  title,
  groups,
  mustHave,
  niceToHave,
  finderHref,
  className,
}: {
  title: string;
  groups: IndustryUseCaseModel["requirementsByCapability"];
  mustHave: IndustryUseCaseModel["mustHaveRequirements"];
  niceToHave: IndustryUseCaseModel["niceToHaveRequirements"];
  finderHref: string;
  className?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  if (groups.length === 0) return null;

  return (
    <section
      id="requirements"
      aria-labelledby="requirements-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="requirements-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        <ButtonLink href={finderHref} variant="outline" size="sm">
          Use in CRM Finder
        </ButtonLink>
      </div>

      <div className="mt-5 space-y-5">
        {(showAll ? groups : groups.slice(0, 4)).map((group) => (
          <div key={group.capabilitySlug}>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                {group.capabilityName}
              </h3>
              <Badge variant="neutral">{group.importance}</Badge>
            </div>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {group.requirements.map((req) => (
                <li
                  key={req.id}
                  className="flex items-start gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-sm"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  <span>
                    {req.href ? (
                      <Link
                        href={req.href}
                        className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {req.name}
                      </Link>
                    ) : (
                      <span className="font-medium">{req.name}</span>
                    )}
                    <span className="mt-0.5 block text-[var(--sg-color-text-muted)]">
                      {req.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {groups.length > 4 ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show fewer requirements" : "Show all requirements"}
        </Button>
      ) : null}

      {(mustHave.length > 0 || niceToHave.length > 0) && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {mustHave.length > 0 ? (
            <Card className="overflow-hidden border-[var(--sg-color-success)]/25 p-0">
              <div className="border-b border-[var(--sg-color-success)]/20 bg-[var(--sg-color-success-soft)]/55 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)] bg-white/80 text-[var(--sg-color-success)]">
                        <Check className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-navy)]">
                        Must have
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      Non-negotiable for this use case — shortlist only if these
                      are covered.
                    </p>
                  </div>
                  <Badge variant="success">{mustHave.length}</Badge>
                </div>
              </div>
              <div className="bg-gradient-to-b from-white to-[var(--sg-color-success-soft)]/15 px-5 py-4">
                <PriorityRequirementList items={mustHave} variant="must" />
              </div>
            </Card>
          ) : null}

          {niceToHave.length > 0 ? (
            <Card className="overflow-hidden border-[var(--sg-color-primary)]/20 p-0">
              <div className="border-b border-[var(--sg-color-primary)]/15 bg-[var(--sg-color-primary-soft)]/45 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)] bg-white/80 text-[var(--sg-color-primary)]">
                        <Sparkles className="size-4" aria-hidden />
                      </span>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-navy)]">
                        Nice to have / advanced
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      Valuable when processes, teams, or governance get more
                      complex.
                    </p>
                  </div>
                  <Badge variant="primary">{niceToHave.length}</Badge>
                </div>
              </div>
              <div className="bg-gradient-to-b from-white to-[var(--sg-color-primary-soft)]/20 px-5 py-4">
                <PriorityRequirementList items={niceToHave} variant="nice" />
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function UseCaseProductCards({
  title,
  items,
  useCaseName,
  className,
}: {
  title: string;
  items: IndustryUseCaseProductRow[];
  useCaseName: string;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="recommendations"
      aria-labelledby="recs-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="recs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Fit labels reflect this use case’s capability priorities and
        evidence — not affiliate status.
      </p>
      <ul className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="flex h-full flex-col p-5">
              <div className="flex items-center gap-3">
                <ProductLogo name={item.name} logo={item.logo} size="md" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <Badge
                    variant={fitBadgeVariant(item.fitLabel)}
                    className="mt-1"
                  >
                    Use-case fit: {item.fitLabel}
                  </Badge>
                </div>
              </div>
              {item.bestFor ? (
                <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                  <span className="font-medium text-[var(--sg-color-text)]">
                    Best for:{" "}
                  </span>
                  {item.bestFor}
                </p>
              ) : null}
              {item.strengths.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Why it fits {useCaseName.toLowerCase()}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {item.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                          aria-hidden
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {item.limitations.length > 0 ? (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Watch out for
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {item.limitations.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <AlertTriangle
                          className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                          aria-hidden
                        />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--sg-color-text-muted)]">
                <span>Evidence: {item.evidenceConfidence}</span>
                {item.pricingTeaser ? (
                  <span>From {item.pricingTeaser}</span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={item.reviewHref} size="sm">
                  Read review
                </ButtonLink>
                <ButtonLink href={item.compareHref} variant="outline" size="sm">
                  Compare
                </ButtonLink>
                <ButtonLink href={item.pricingHref} variant="ghost" size="sm">
                  Pricing
                </ButtonLink>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function UseCaseScorecard({
  rows,
  columns,
  hasNumericScores,
  className,
}: {
  rows: IndustryUseCaseProductRow[];
  columns: IndustryUseCaseModel["scorecardColumns"];
  hasNumericScores: boolean;
  className?: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  if (rows.length === 0) return null;

  return (
    <section
      id="scorecard"
      aria-labelledby="use-case-scorecard-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="use-case-scorecard-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How the products compare for this use case
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {hasNumericScores
          ? "Overall fit uses approved criterion scores weighted by this use case’s capability priorities."
          : "Overall labels use evidence-backed capability coverage when weighted scores are not available."}
      </p>
      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left font-semibold">Use-case fit</th>
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-3 text-center font-semibold">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-t border-[var(--sg-color-border)]">
                <td className="sticky left-0 z-[1] bg-[var(--sg-color-surface)] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProductLogo name={row.name} logo={row.logo} size="sm" />
                    <span className="font-medium">{row.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() =>
                      setExpanded((prev) =>
                        prev === row.slug ? null : row.slug,
                      )
                    }
                  >
                    <Badge variant={fitBadgeVariant(row.fitLabel)}>
                      {row.fitLabel}
                      {row.fitScore != null ? ` · ${row.fitScore}/10` : ""}
                    </Badge>
                    <span className="mt-1 block text-xs text-[var(--sg-color-primary)]">
                      Why this score?
                    </span>
                  </button>
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3 text-center">
                    <Badge
                      variant={fitBadgeVariant(
                        row.capabilityCells[col.key] ?? "Unknown",
                      )}
                      className="text-xs"
                    >
                      {row.capabilityCells[col.key] ?? "Unknown"}
                    </Badge>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {expanded ? (
        <Card className="mt-4 p-4">
          {(() => {
            const row = rows.find((r) => r.slug === expanded);
            if (!row) return null;
            if (row.fitBreakdown.length > 0) {
              const weightSum = row.fitBreakdown.reduce(
                (s, b) => s + b.weight,
                0,
              );
              return (
                <div>
                  <p className="font-semibold">
                    Why {row.name} scored {row.fitScore}/10
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {row.fitBreakdown.map((b) => (
                      <li
                        key={b.capabilitySlug}
                        className="flex justify-between gap-4"
                      >
                        <span>{b.capabilityName}</span>
                        <span className="text-[var(--sg-color-text-muted)]">
                          {b.score}/10 ×{" "}
                          {weightSum > 0
                            ? `${Math.round((b.weight / weightSum) * 100)}%`
                            : b.weight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <div>
                <p className="font-semibold">
                  Why we consider this a {row.fitLabel.toLowerCase()} fit
                </p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {row.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 text-[var(--sg-color-success)]"
                        aria-hidden
                      />
                      {s}
                    </li>
                  ))}
                  {row.strengths.length === 0 ? (
                    <li className="text-[var(--sg-color-text-muted)]">
                      Based on feature-support coverage for this use
                      case’s must-have requirements.
                    </li>
                  ) : null}
                </ul>
              </div>
            );
          })()}
        </Card>
      ) : null}
    </section>
  );
}

export function UseCaseRequirementMatrix({
  products,
  features,
  className,
}: {
  products: IndustryUseCaseProductRow[];
  features: IndustryUseCaseModel["matrixFeatureSlugs"];
  className?: string;
}) {
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const routerCompareHref = useMemo(() => {
    if (selected.length < 2) return null;
    const [a, b] = selected;
    return `/compare/build/?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`;
  }, [selected]);

  if (products.length === 0 || features.length === 0) return null;

  const visibleFeatures = differencesOnly
    ? features.filter((f) => {
        const values = new Set(
          products.map((p) => p.cells[f.slug] ?? "unknown"),
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
            Compare requirements
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Cells reflect product evidence. Unknown means insufficient
            evidence — not the same as unsupported.
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
          {routerCompareHref ? (
            <ButtonLink href={routerCompareHref} size="sm">
              Compare selected
            </ButtonLink>
          ) : null}
        </div>
      </div>

      <EvidenceLegend className="mt-4" />

      <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-b from-white to-[var(--sg-color-surface-muted)]/40 shadow-[0_1px_0_rgb(15_23_42/0.03)]">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-tint)]/80">
              <th className="sticky left-0 z-[1] bg-[var(--sg-color-surface-tint)] px-4 py-4 text-left font-semibold text-[var(--sg-color-navy)]">
                Requirement
              </th>
              {products.map((p) => {
                const isSelected = selected.includes(p.slug);
                return (
                  <th key={p.slug} className="px-3 py-4 text-center font-semibold">
                    <label
                      className={cn(
                        "inline-flex cursor-pointer flex-col items-center gap-2 rounded-[var(--sg-radius-lg)] px-2 py-2 transition-colors",
                        isSelected
                          ? "bg-white ring-2 ring-[var(--sg-color-primary)]/30"
                          : "hover:bg-white/70",
                      )}
                    >
                      <span className="relative">
                        <ProductLogo name={p.name} logo={p.logo} size="sm" />
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelected((prev) => {
                              if (prev.includes(p.slug)) {
                                return prev.filter((s) => s !== p.slug);
                              }
                              if (prev.length >= 2) return [prev[1]!, p.slug];
                              return [...prev, p.slug];
                            });
                          }}
                          className="absolute -right-1 -top-1 size-3.5 rounded border-[var(--sg-color-border)] bg-white"
                          aria-label={`Select ${p.name} for compare`}
                        />
                      </span>
                      <Link
                        href={p.reviewHref}
                        className="text-xs font-semibold text-[var(--sg-color-navy)] hover:text-[var(--sg-color-primary)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {p.name}
                      </Link>
                    </label>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleFeatures.map((f, rowIndex) => {
              const Icon = resolveIndustryIcon(requirementIconKey({ name: f.name, featureSlug: f.slug }));
              return (
                <tr
                  key={f.slug}
                  className={cn(
                    "border-t border-[var(--sg-color-border)]",
                    rowIndex % 2 === 1 && "bg-white/50",
                  )}
                >
                  <td className="sticky left-0 z-[1] bg-[inherit] px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                          hubToneClass(rowIndex + 1),
                        )}
                      >
                        {createElement(Icon, {
                          className: "size-3.5",
                          "aria-hidden": true,
                        })}
                      </span>
                      {f.href ? (
                        <Link
                          href={f.href}
                          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          {f.name}
                        </Link>
                      ) : (
                        <span className="font-medium text-[var(--sg-color-navy)]">
                          {f.name}
                        </span>
                      )}
                    </div>
                  </td>
                  {products.map((p) => (
                    <td key={p.slug} className="px-3 py-3.5">
                      <span className="flex justify-center">
                        <EvidenceMark
                          variant="chip"
                          cell={(p.cells[f.slug] ?? "unknown") as EvidenceCell}
                        />
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Select up to two products to open a side-by-side compare.
      </p>
    </section>
  );
}
