import Image from "next/image";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { FeatureConceptVisual } from "@/components/features/feature-visuals";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import type { FeatureDetailModel } from "@/services/feature-detail";
import { cn } from "@/lib/cn";

const TRUST = [
  "Verified product evidence",
  "Same feature definition across products",
  "Affiliate-independent comparisons",
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

export function FeatureHero({
  model,
  className,
}: {
  model: FeatureDetailModel;
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
              Compare CRM software
            </ButtonLink>
            <ButtonLink href={model.finderHref} variant="outline" size="lg">
              Find My CRM
            </ButtonLink>
            <ButtonLink
              href={`/tools/crm-requirements-builder/?feature=${model.profile.canonicalFeatureSlug ?? model.profile.slug}&start=1`}
              variant="outline"
              size="lg"
            >
              Require this feature
            </ButtonLink>
            {model.seeInAction.length > 0 ? (
              <a
                href="#see-in-action"
                className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                ▶ See feature demonstrations
              </a>
            ) : null}
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

        <div className="space-y-4">
          {model.profile.heroVisual ? (
            <figure className="overflow-hidden rounded-[var(--sg-radius-xl)] border border-white bg-[var(--sg-color-surface)] shadow-[0_12px_40px_rgb(15_23_42/0.08)]">
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
            <FeatureConceptVisual
              kind={model.visualKind}
              featureName={model.featureName}
              compact
            />
          )}
        </div>
      </div>
    </header>
  );
}

export function FeatureGlanceStrip({
  glance,
  className,
}: {
  glance: FeatureDetailModel["glance"];
  className?: string;
}) {
  const narrative = [
    glance.featureTypeLabel
      ? { label: "Feature type", value: glance.featureTypeLabel, icon: "settings" }
      : null,
    glance.primaryCapabilityName
      ? {
          label: "Primary capability",
          value: glance.primaryCapabilityName,
          icon: "funnel",
        }
      : null,
    glance.typicalBuyerNeed
      ? {
          label: "Typical buyer need",
          value: glance.typicalBuyerNeed,
          icon: "users",
        }
      : null,
    glance.commonLimitation
      ? {
          label: "Common limitation",
          value: glance.commonLimitation,
          icon: "shield",
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: string }>;

  return (
    <section
      aria-label="Feature at a glance"
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-surface)] via-white to-[var(--sg-color-primary-soft)]/35",
        className,
      )}
    >
      <div className="border-b border-[var(--sg-color-border)]/70 bg-white/60 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Feature at a glance
        </p>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(14rem,0.7fr)]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {narrative.map((item, index) => {
            const Icon = resolveIndustryIcon(item.icon);
            return (
              <li key={item.label}>
                <div className="flex h-full gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white/90 p-3.5">
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Products covered
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                  {glance.researchedProductCount}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex size-10 items-center justify-center rounded-[var(--sg-radius-md)]",
                  hubToneClass(4),
                )}
              >
                {createElement(resolveIndustryIcon("layers"), {
                  className: "size-4",
                  "aria-hidden": true,
                })}
              </span>
            </div>
          </div>
          <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Evidence records
                </p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                  {glance.evidenceItemCount}
                </p>
                {glance.lastReviewedAt ? (
                  <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
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
                {createElement(resolveIndustryIcon("chart"), {
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

export function FeatureDefinition({
  name,
  definition,
  notTheSameAs,
  className,
}: {
  name: string;
  definition: string;
  notTheSameAs: string[];
  className?: string;
}) {
  return (
    <section
      id="definition"
      aria-labelledby="definition-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="definition-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What is {name.toLowerCase()}?
      </h2>
      <p className="mt-3 max-w-3xl text-[length:var(--sg-text-body)] text-[var(--sg-color-text-muted)]">
        {definition}
      </p>
      {notTheSameAs.length > 0 ? (
        <Card className="mt-5 border-[var(--sg-color-danger)]/15 bg-[var(--sg-color-surface)] p-4">
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
            {name} is NOT the same as
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {notTheSameAs.map((item) => (
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
      ) : null}
    </section>
  );
}

export function FeatureNeedSection({
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
        Do you actually need this feature?
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card className="border-[var(--sg-color-success)]/20 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            You probably need it if
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
        <Card className="border-[var(--sg-color-warning)]/20 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-warning)]">
            You may not need it if
          </p>
          <ul className="mt-3 space-y-2">
            {mayNotNeedIf.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 inline-block size-3.5 shrink-0 rounded-full border border-[var(--sg-color-warning)]" />
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
        {withSingleArrow("Use this requirement in CRM Finder")}
      </Link>
    </section>
  );
}

export function FeatureContextFlow({
  model,
  className,
}: {
  model: FeatureDetailModel;
  className?: string;
}) {
  const steps = [
    model.profile.primaryCapabilityName
      ? { label: "Capability", value: model.profile.primaryCapabilityName }
      : null,
    model.profile.relatedRequirementName
      ? { label: "Requirement", value: model.profile.relatedRequirementName }
      : null,
    { label: "Feature", value: model.featureName },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <section
      id="criteria"
      aria-labelledby="context-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="context-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Where this feature fits
      </h2>
      <ol className="mt-5 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2">
            <Card className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                {step.label}
              </p>
              <p className="text-sm font-medium">{step.value}</p>
            </Card>
            {index < steps.length - 1 ? (
              <span className="text-[var(--sg-color-text-muted)]" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      {model.profile.evaluationDimensions.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            How we evaluate this feature
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {model.profile.evaluationDimensions.map((dim, index) => {
              const Icon = resolveIndustryIcon("puzzle");
              return (
                <li key={dim.id}>
                  <Card className="h-full p-4">
                    <span
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded-[var(--sg-radius-md)]",
                        hubToneClass(index),
                      )}
                    >
                      {createElement(Icon, {
                        className: "size-3.5",
                        "aria-hidden": true,
                      })}
                    </span>
                    <p className="mt-2 text-sm font-semibold">{dim.name}</p>
                    {dim.description ? (
                      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                        {dim.description}
                      </p>
                    ) : null}
                    {dim.importance ? (
                      <Badge variant="neutral" className="mt-2">
                        {dim.importance}
                      </Badge>
                    ) : null}
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {model.profile.requirementMappings.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Which requirements does this feature help satisfy?
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {model.profile.requirementMappings.map((req) => {
              const href =
                req.href ??
                (req.requirementSlug
                  ? `/requirements/${req.requirementSlug}/`
                  : undefined);
              const content = (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                      {req.name}
                    </p>
                    <Badge variant="neutral">{req.supportLevel}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {req.description}
                  </p>
                  {href ? (
                    <span className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                      {withSingleArrow("Explore requirement")}
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={req.id}>
                  {href ? (
                    <Link href={href} className="group block h-full">
                      <Card variant="interactive" className="h-full p-4">
                        {content}
                      </Card>
                    </Link>
                  ) : (
                    <Card className="h-full p-4">{content}</Card>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
