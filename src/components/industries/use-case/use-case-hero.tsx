import Link from "next/link";
import { Check } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import {
  UseCaseConceptVisual,
  useCaseVisualKindForSlug,
} from "@/components/industries/use-case/use-case-visuals";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import type { IndustryUseCaseModel } from "@/services/industry-use-case";
import { cn } from "@/lib/cn";

const TRUST = [
  "Evidence-backed evaluations",
  "Same criteria across products",
  "Affiliate-independent rankings",
] as const;

function importanceBadgeVariant(
  importance: string,
): "danger" | "warning" | "primary" | "neutral" {
  const v = importance.toLowerCase();
  if (v === "critical") return "danger";
  if (v === "high") return "warning";
  if (v === "important") return "primary";
  return "neutral";
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type HeroProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  useCaseName: string;
  useCaseSlug: string;
  capabilities: IndustryUseCaseModel["capabilities"];
  hasNumericWeights: boolean;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  textLink: { href: string; label: string };
  researchCoverage: {
    productCount: number;
    requirementCount: number;
    evidenceItemCount: number;
    lastUpdated: string | null;
  };
  className?: string;
};

export function UseCaseHero({
  eyebrow,
  title,
  tagline,
  useCaseName,
  useCaseSlug,
  capabilities,
  hasNumericWeights,
  primaryCta,
  secondaryCta,
  textLink,
  researchCoverage,
  className,
}: HeroProps) {
  const maxWeight = Math.max(
    ...capabilities.map((c) => c.weight ?? 0),
    1,
  );
  const visualKind = useCaseVisualKindForSlug(useCaseSlug);

  return (
    <header
      id="overview"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-tint)] px-5 py-8 sm:px-8 sm:py-10",
        className,
      )}
    >
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {tagline}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={primaryCta.href} size="lg">
              {primaryCta.label}
            </ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="outline" size="lg">
              {secondaryCta.label}
            </ButtonLink>
            <Link
              href={textLink.href}
              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              ← {textLink.label}
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--sg-color-text-muted)]"
              >
                <Check
                  className="size-4 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <UseCaseConceptVisual kind={visualKind} useCaseName={useCaseName} />
          <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {useCaseName}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--sg-color-navy)]">
            Critical capabilities
          </p>
          <ul className="mt-4 space-y-3">
            {capabilities.slice(0, 4).map((cap) => {
              const label =
                cap.importance === "critical"
                  ? "Critical"
                  : cap.importance === "high"
                    ? "High"
                    : cap.importance === "optional"
                      ? "Optional"
                      : "Important";
              const fill = hasNumericWeights && cap.weight != null
                ? Math.round((cap.weight / maxWeight) * 100)
                : cap.importance === "critical"
                  ? 100
                  : cap.importance === "high"
                    ? 80
                    : 60;
              return (
                <li key={cap.capabilitySlug}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-[var(--sg-color-text)]">
                      {cap.name}
                    </span>
                    <Badge variant={importanceBadgeVariant(label)} className="shrink-0">
                      {label}
                    </Badge>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--sg-color-primary)]"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--sg-color-border)] pt-4 text-center">
            <div>
              <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
                {researchCoverage.productCount}
              </p>
              <p className="text-xs text-[var(--sg-color-text-muted)]">Products</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
                {researchCoverage.requirementCount}
              </p>
              <p className="text-xs text-[var(--sg-color-text-muted)]">Requirements</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--sg-color-navy)]">
                {researchCoverage.evidenceItemCount}
              </p>
              <p className="text-xs text-[var(--sg-color-text-muted)]">Evidence</p>
            </div>
          </div>
          {researchCoverage.lastUpdated ? (
            <p className="mt-3 text-center text-xs text-[var(--sg-color-text-muted)]">
              Updated {formatDate(researchCoverage.lastUpdated)}
            </p>
          ) : null}
        </Card>
        </div>
      </div>
    </header>
  );
}

export function UseCaseGlanceStrip({
  glance,
  className,
}: {
  glance: IndustryUseCaseModel["glance"];
  className?: string;
}) {
  const considerationChips = glance.topPriorityLabels.slice(0, 6);
  const confidence = glance.researchConfidence?.toLowerCase() ?? "";
  const confidenceTone =
    confidence === "high"
      ? "success"
      : confidence === "medium"
        ? "warning"
        : confidence === "low"
          ? "danger"
          : "neutral";
  const confidenceFill =
    confidence === "high" ? 100 : confidence === "medium" ? 62 : confidence === "low" ? 28 : 45;

  const narrative = [
    glance.typicalObjective
      ? {
          label: "Typical objective",
          value: glance.typicalObjective,
          icon: "target",
        }
      : null,
    glance.highestPriorityCapability
      ? {
          label: "Highest-priority capability",
          value: glance.highestPriorityCapability,
          icon: "funnel",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: string }>;

  return (
    <section
      aria-label="Use case at a glance"
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-white to-[var(--sg-color-primary-soft)]/35",
        className,
      )}
    >
      <div className="border-b border-[var(--sg-color-border)]/70 bg-white/60 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Use case at a glance
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.85fr)] lg:gap-5">
        <div className="space-y-3">
          <ul className="grid gap-3 sm:grid-cols-2">
            {narrative.map((item, index) => {
              const Icon = resolveIndustryIcon(item.icon);
              return (
                <li key={item.label}>
                  <div className="flex h-full gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white/90 p-3.5 shadow-[0_1px_0_rgb(15_23_42/0.03)]">
                    <span
                      className={cn(
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                        hubToneClass(index + 1),
                      )}
                    >
                      {createElement(Icon, {
                        className: "size-4",
                        "aria-hidden": true,
                      })}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-[var(--sg-color-navy)]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {considerationChips.length > 0 ? (
            <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white/90 p-3.5">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(3),
                  )}
                >
                  {createElement(resolveIndustryIcon("layers"), {
                    className: "size-3.5",
                    "aria-hidden": true,
                  })}
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Important considerations
                </p>
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {considerationChips.map((chip, index) => (
                  <li key={chip}>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-[var(--sg-color-navy)]",
                        hubToneClass(index + 2),
                      )}
                    >
                      {chip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Products evaluated
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                  {glance.researchedProductCount}
                </p>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  Compared on this use case’s priority capabilities
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(4),
                )}
              >
                {createElement(resolveIndustryIcon("star"), {
                  className: "size-4",
                  "aria-hidden": true,
                })}
              </span>
            </div>
          </div>

          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Research confidence
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={confidenceTone}>{glance.researchConfidence}</Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      confidenceTone === "success"
                        ? "bg-[var(--sg-color-success)]"
                        : confidenceTone === "warning"
                          ? "bg-[var(--sg-color-warning)]"
                          : confidenceTone === "danger"
                            ? "bg-[var(--sg-color-danger)]"
                            : "bg-[var(--sg-color-primary)]",
                    )}
                    style={{ width: `${confidenceFill}%` }}
                  />
                </div>
                {glance.lastReviewedAt ? (
                  <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                    Reviewed{" "}
                    {formatDate(glance.lastReviewedAt) ?? glance.lastReviewedAt}
                  </p>
                ) : null}
              </div>
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(5),
                )}
              >
                {createElement(resolveIndustryIcon("shield"), {
                  className: "size-4",
                  "aria-hidden": true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CapabilityPriorityProfile({
  title = "What matters most",
  capabilities,
  hasNumericWeights,
  className,
}: {
  title?: string;
  capabilities: IndustryUseCaseModel["capabilities"];
  hasNumericWeights: boolean;
  className?: string;
}) {
  if (capabilities.length === 0) return null;
  const maxWeight = Math.max(
    ...capabilities.map((c) => c.weight ?? 0),
    1,
  );
  const weightSum = capabilities.reduce((s, c) => s + (c.weight ?? 0), 0);

  return (
    <section
      id="priorities"
      aria-labelledby="priority-profile-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="priority-profile-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <Card className="mt-5 p-5 sm:p-6">
        <ul className="space-y-4">
          {capabilities.map((cap) => {
            const label =
              cap.importance === "critical"
                ? "Critical"
                : cap.importance === "high"
                  ? "High"
                  : cap.importance === "optional"
                    ? "Optional"
                    : "Important";
            const fill =
              hasNumericWeights && cap.weight != null
                ? Math.round((cap.weight / maxWeight) * 100)
                : cap.importance === "critical"
                  ? 100
                  : cap.importance === "high"
                    ? 80
                    : 60;
            const pct =
              hasNumericWeights && cap.weight != null && weightSum > 0
                ? Math.round((cap.weight / weightSum) * 100)
                : null;
            return (
              <li key={cap.capabilitySlug}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">{cap.name}</span>
                  <span className="text-sm text-[var(--sg-color-text-muted)]">
                    {pct != null ? `${pct}% · ` : ""}
                    {label}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                  <div
                    className="h-full rounded-full bg-[var(--sg-color-primary)]"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        {!hasNumericWeights ? (
          <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
            Priority levels come from this industry × use-case profile — not
            invented percentages.
          </p>
        ) : null}
      </Card>
    </section>
  );
}

export function UseCaseNeeds({
  title,
  capabilities,
  className,
}: {
  title: string;
  capabilities: IndustryUseCaseModel["capabilities"];
  className?: string;
}) {
  if (capabilities.length === 0) return null;
  return (
    <section
      id="needs"
      aria-labelledby="needs-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="needs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap, index) => {
          const Icon = resolveIndustryIcon(cap.icon);
          const label =
            cap.importance === "critical"
              ? "Critical"
              : cap.importance === "high"
                ? "High"
                : "Important";
          const content = (
            <>
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
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="text-sm font-semibold uppercase tracking-wide group-hover:text-[var(--sg-color-primary)]">
                  {cap.name}
                </p>
                <Badge variant={importanceBadgeVariant(label)}>
                  {label}
                </Badge>
              </div>
              <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {cap.description}
              </p>
              {cap.href ? (
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {withSingleArrow("Explore capability")}
                </span>
              ) : null}
            </>
          );
          return (
            <li key={cap.capabilitySlug}>
              {cap.href ? (
                <Link href={cap.href} className="group block h-full">
                  <Card
                    variant="interactive"
                    className="flex h-full flex-col p-4"
                  >
                    {content}
                  </Card>
                </Link>
              ) : (
                <Card className="flex h-full flex-col p-4">{content}</Card>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
