import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import type { RequirementDetailModel } from "@/services/requirement-detail";
import { fitStatusLabel } from "@/services/requirement-detail";
import { cn } from "@/lib/cn";

const TRUST = [
  "Evidence-backed evaluations",
  "Same criteria across products",
  "Affiliate relationships never affect scores",
] as const;

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

export function RequirementHero({
  model,
  className,
}: {
  model: RequirementDetailModel;
  className?: string;
}) {
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
            {model.eyebrow}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold leading-[var(--sg-leading-tight)] text-[var(--sg-color-navy)]">
            {model.displayTitle}
          </h1>
          <p className="mt-3 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {model.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href={model.compareHref} size="lg">
              Compare CRM options
            </ButtonLink>
            <ButtonLink href={model.finderHref} variant="outline" size="lg">
              Add to CRM Finder
            </ButtonLink>
            <ButtonLink
              href={`/tools/crm-requirements-builder/?requirement=${model.profile.slug}&start=1`}
              variant="outline"
              size="lg"
            >
              Add to my requirements
            </ButtonLink>
            {model.capabilityHref ? (
              <Link
                href={model.capabilityHref}
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow(
                  `Explore ${model.profile.primaryCapabilityName ?? "capability"}`,
                )}
              </Link>
            ) : null}
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

        {model.profile.heroVisual ? (
          <figure className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[0_12px_40px_rgb(15_23_42/0.08)]">
            <Image
              src={model.profile.heroVisual.src}
              alt={model.profile.heroVisual.alt}
              width={720}
              height={540}
              className="h-auto w-full object-contain"
              sizes="(min-width: 1024px) 22rem, 100vw"
              priority
              unoptimized
          />
            {model.profile.heroVisual.caption ? (
              <figcaption className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)]">
                {model.profile.heroVisual.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : (
          <Card className="overflow-hidden border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-surface)] p-0 shadow-[0_1px_0_rgb(15_23_42/0.03)]">
            <div className="border-b border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-primary-soft)]/50 via-white to-white px-5 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(1),
                  )}
                >
                  {createElement(resolveIndustryIcon("target"), {
                    className: "size-4",
                    "aria-hidden": true,
                  })}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                    At a glance
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--sg-color-navy)]">
                    Buyer need
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                    {model.profile.buyerNeedDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 px-5 py-4 sm:px-6">
              {model.profile.primaryCapabilityName ? (
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                      hubToneClass(2),
                    )}
                  >
                    {createElement(resolveIndustryIcon("shield"), {
                      className: "size-3.5",
                      "aria-hidden": true,
                    })}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Primary capability
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {model.capabilityHref ? (
                        <Link
                          href={model.capabilityHref}
                          className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          {model.profile.primaryCapabilityName}
                        </Link>
                      ) : (
                        <span className="text-[var(--sg-color-navy)]">
                          {model.profile.primaryCapabilityName}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ) : null}

              {model.coreFeatures.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                        hubToneClass(3),
                      )}
                    >
                      {createElement(resolveIndustryIcon("star"), {
                        className: "size-3.5",
                        "aria-hidden": true,
                      })}
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Critical supporting features
                    </p>
                  </div>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {model.coreFeatures.map((f, index) => {
                      const href = f.featurePageSlug
                        ? `/features/${f.featurePageSlug}/`
                        : null;
                      const chip = (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-[var(--sg-color-navy)]",
                            hubToneClass(index + 1),
                            href && "transition-opacity hover:opacity-80",
                          )}
                        >
                          {f.name}
                        </span>
                      );
                      return (
                        <li key={f.featureSlug}>
                          {href ? <Link href={href}>{chip}</Link> : chip}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {model.supportingFeatures.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                        hubToneClass(4),
                      )}
                    >
                      {createElement(resolveIndustryIcon("layers"), {
                        className: "size-3.5",
                        "aria-hidden": true,
                      })}
                    </span>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      Supporting features
                    </p>
                  </div>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {model.supportingFeatures.map((f) => {
                      const href = f.featurePageSlug
                        ? `/features/${f.featurePageSlug}/`
                        : null;
                      const chip = (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border border-[var(--sg-color-border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--sg-color-navy)]",
                            href && "hover:border-[var(--sg-color-primary)]/40",
                          )}
                        >
                          {f.name}
                        </span>
                      );
                      return (
                        <li key={f.featureSlug}>
                          {href ? <Link href={href}>{chip}</Link> : chip}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/40 px-4 py-4 text-center sm:px-5">
              {[
                {
                  value: model.useCaseLinks.length,
                  label: "Use cases",
                  icon: "handshake",
                },
                {
                  value: model.research.productCount,
                  label: "Products",
                  icon: "star",
                },
                {
                  value: model.research.evidenceItemCount,
                  label: "Evidence",
                  icon: "chart",
                },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white px-2 py-3"
                >
                  <span
                    className={cn(
                      "mx-auto inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                      hubToneClass(index + 2),
                    )}
                  >
                    {createElement(resolveIndustryIcon(stat.icon), {
                      className: "size-3.5",
                      "aria-hidden": true,
                    })}
                  </span>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-[var(--sg-color-text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            {model.research.lastUpdated ? (
              <p className="border-t border-[var(--sg-color-border)] px-5 py-2.5 text-center text-xs text-[var(--sg-color-text-muted)]">
                Updated {formatDate(model.research.lastUpdated)}
              </p>
            ) : null}
          </Card>
        )}
      </div>
    </header>
  );
}

export function RequirementGlanceStrip({
  glance,
  className,
}: {
  glance: RequirementDetailModel["glance"];
  className?: string;
}) {
  const narrative = [
    glance.requirementTypeLabel
      ? {
          label: "Requirement type",
          value: glance.requirementTypeLabel,
          icon: "layers",
        }
      : null,
    glance.primaryCapabilityName
      ? {
          label: "Primary capability",
          value: glance.primaryCapabilityName,
          icon: "shield",
        }
      : null,
    glance.typicalImportanceLabel
      ? {
          label: "Typical importance",
          value: glance.typicalImportanceLabel,
          icon: "star",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: string }>;

  const metrics = [
    {
      label: "Core features",
      value: glance.coreFeatureCount,
      icon: "check",
    },
    {
      label: "Supporting features",
      value: glance.supportingFeatureCount,
      icon: "puzzle",
    },
    {
      label: "Products covered",
      value: glance.researchedProductCount,
      icon: "users",
    },
  ];

  return (
    <section
      aria-label="Requirement at a glance"
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-white to-[var(--sg-color-primary-soft)]/35",
        className,
      )}
    >
      <div className="border-b border-[var(--sg-color-border)]/70 bg-white/60 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Requirement at a glance
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.85fr)]">
        <ul className="grid gap-3 sm:grid-cols-3">
          {narrative.map((item, index) => {
            const Icon = resolveIndustryIcon(item.icon);
            return (
              <li key={item.label}>
                <div className="flex h-full gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white/90 p-3.5">
                  <span
                    className={cn(
                      "inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)]",
                      hubToneClass(index + 1),
                    )}
                  >
                    {createElement(Icon, {
                      className: "size-3.5",
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

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
          {metrics.map((item, index) => (
            <div
              key={item.label}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-3 text-center lg:flex lg:items-center lg:justify-between lg:gap-3 lg:text-left"
            >
              <div className="lg:order-2">
                <span
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index + 3),
                  )}
                >
                  {createElement(resolveIndustryIcon(item.icon), {
                    className: "size-3.5",
                    "aria-hidden": true,
                  })}
                </span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                  {item.value}
                </p>
                <p className="text-[11px] text-[var(--sg-color-text-muted)]">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {glance.lastReviewedAt ? (
        <p className="border-t border-[var(--sg-color-border)] px-4 py-2.5 text-xs text-[var(--sg-color-text-muted)] sm:px-6">
          Last reviewed{" "}
          {formatDate(glance.lastReviewedAt) ?? glance.lastReviewedAt}
        </p>
      ) : null}
    </section>
  );
}

export function RequirementShortAnswer({
  shortAnswer,
  picks,
  className,
}: {
  shortAnswer: string | null;
  picks: RequirementDetailModel["summaryPicks"];
  className?: string;
}) {
  if (!shortAnswer && picks.length === 0) return null;
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
      {shortAnswer ? (
        <p className="mt-3 max-w-3xl text-[var(--sg-color-text-muted)]">
          {shortAnswer}
        </p>
      ) : null}
      {picks.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((pick) =>
            pick.product ? (
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
                  <Badge variant="success" className="mt-3 w-fit">
                    {fitStatusLabel(pick.product.fitStatus)}
                  </Badge>
                  <Link
                    href={pick.product.reviewHref}
                    className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {withSingleArrow("View details")}
                  </Link>
                </Card>
              </li>
            ) : null,
          )}
        </ul>
      ) : null}
    </section>
  );
}

export function RequirementNeedSection({
  needIf,
  mayNotNeedIf,
  finderHref,
  className,
}: {
  needIf: string[];
  mayNotNeedIf: string[];
  finderHref: string;
  className?: string;
}) {
  if (needIf.length === 0 && mayNotNeedIf.length === 0) return null;
  return (
    <section
      id="need"
      aria-labelledby="need-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="need-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Do you need this requirement?
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--sg-color-success)]/20 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            You probably need this if
          </p>
          <ul className="mt-3 space-y-2">
            {needIf.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border-[var(--sg-color-danger)]/15 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
            You may not need this if
          </p>
          <ul className="mt-3 space-y-2">
            {mayNotNeedIf.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <X
                  className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-danger)]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Link
        href={finderHref}
        className="mt-4 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        {withSingleArrow("Not sure? Answer this in CRM Finder")}
      </Link>
    </section>
  );
}

export function RequirementWhy({
  items,
  className,
}: {
  items: RequirementDetailModel["profile"]["whyItMatters"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="why-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Why this requirement matters
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="h-full p-4">
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
                <p className="mt-3 text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RequirementFitModel({
  model,
  className,
}: {
  model: RequirementDetailModel;
  className?: string;
}) {
  const steps = [
    {
      label: "Use cases",
      value: `${model.useCaseLinks.length} linked`,
      href: "#use-cases",
    },
    {
      label: "Capability",
      value: model.profile.primaryCapabilityName ?? "—",
      href: model.capabilityHref,
    },
    {
      label: "Requirement",
      value: model.requirementName,
      href: "#overview",
    },
    {
      label: "Features",
      value: `${model.relatedFeatures.length} related`,
      href: "#features",
    },
    {
      label: "Products",
      value: `${model.research.productCount} evaluated`,
      href: "#support",
    },
  ];

  return (
    <section
      id="fit-model"
      aria-labelledby="fit-model-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="fit-model-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Where this requirement fits
      </h2>
      <ol className="mt-5 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2">
            <Card className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                {step.label}
              </p>
              {step.href ? (
                <Link
                  href={step.href}
                  className="text-sm font-medium text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {step.value}
                </Link>
              ) : (
                <p className="text-sm font-medium">{step.value}</p>
              )}
            </Card>
            {index < steps.length - 1 ? (
              <span className="text-[var(--sg-color-text-muted)]" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
