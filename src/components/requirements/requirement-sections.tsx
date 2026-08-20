import Link from "next/link";
import { Check } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { CapabilityScreenshots } from "@/components/industries/capability/capability-screenshots";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { CategoryFAQ } from "@/components/category/category-faq";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import type {
  RequirementDetailModel,
  RequirementProductRow,
} from "@/services/requirement-detail";
import { fitStatusLabel } from "@/services/requirement-detail";
import { cn } from "@/lib/cn";
import { RequirementDeepDiveMedia } from "@/components/requirements/requirement-media-sections";

export { CategoryFAQ as RequirementFaq };
export { CategoryQuickNav as RequirementQuickNav };
export { IndustryFinalCta as RequirementFinalCta };

export function RequirementDeepDives({
  requirementName,
  items,
  mediaByProduct,
  className,
}: {
  requirementName: string;
  items: RequirementProductRow[];
  mediaByProduct?: Record<
    string,
    import("@/services/product-media/requirement-page-media").RequirementSeeSupportCard | null
  >;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="deep-dives"
      aria-labelledby="deep-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="deep-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How each CRM meets this requirement
      </h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.slug} id={`deep-${item.slug}`} className="scroll-mt-28">
            <Card className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <ProductLogo name={item.name} logo={item.logo} size="md" />
                  <div>
                    <p className="font-semibold">
                      {item.name} for {requirementName.toLowerCase()}
                    </p>
                    <Badge variant="neutral" className="mt-1">
                      {fitStatusLabel(item.fitStatus)}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-[var(--sg-color-text-muted)]">
                  Evidence confidence: {item.evidenceConfidence}
                </p>
              </div>
              {item.minimumPlan ? (
                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Plan required: </span>
                    {item.minimumPlan}
                  </p>
                  <p className="text-xs text-[var(--sg-color-text-muted)]">
                    Plan availability comes from official pricing / plan
                    documentation — not from feature demos.
                  </p>
                </div>
              ) : null}
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Why
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {item.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm">
                        <Check
                          className="mt-0.5 size-4 text-[var(--sg-color-success)]"
                          aria-hidden
                        />
                        {s}
                      </li>
                    ))}
                    {item.strengths.length === 0 ? (
                      <li className="text-sm text-[var(--sg-color-text-muted)]">
                        See scorecard for coverage.
                      </li>
                    ) : null}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Trade-offs
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {item.limitations.map((s) => (
                      <li
                        key={s}
                        className="text-sm text-[var(--sg-color-text-muted)]"
                      >
                        {s}
                      </li>
                    ))}
                    {item.limitations.length === 0 ? (
                      <li className="text-sm text-[var(--sg-color-text-muted)]">
                        No major limitations surfaced for this requirement.
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
              <RequirementDeepDiveMedia
                card={mediaByProduct?.[item.slug] ?? null}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href={item.reviewHref} size="sm">
                  Read {item.name} review
                </ButtonLink>
                <ButtonLink href={item.compareHref} variant="outline" size="sm">
                  Compare {item.name}
                </ButtonLink>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RequirementScenarios({
  items,
  className,
}: {
  items: RequirementDetailModel["scenarios"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="scenarios"
      aria-labelledby="scenarios-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="scenarios-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Best fit depends on your scenario
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="flex h-full flex-col p-4">
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
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
                {item.priorities.length > 0 ? (
                  <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                    Priorities: {item.priorities.join(" · ")}
                  </p>
                ) : null}
                {item.product ? (
                  <p className="mt-3 text-sm">
                    <span className="text-[var(--sg-color-text-muted)]">
                      Best recommended fit:{" "}
                    </span>
                    <Link
                      href={item.product.reviewHref}
                      className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </p>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RequirementScreenshots({
  requirementName,
  items,
}: {
  requirementName: string;
  items: RequirementDetailModel["screenshots"];
}) {
  return (
    <CapabilityScreenshots
      capabilityName={requirementName}
      items={items}
      title="See how products handle this requirement"
    />
  );
}

export function RequirementTradeoffs({
  items,
  industryTradeoffs,
  className,
}: {
  items: RequirementDetailModel["profile"]["tradeoffs"];
  industryTradeoffs?: NonNullable<
    RequirementDetailModel["industryContext"]
  >["tradeoffs"];
  className?: string;
}) {
  const all = [...items, ...(industryTradeoffs ?? [])];
  if (all.length === 0) return null;
  return (
    <section
      id="tradeoffs"
      aria-labelledby="tradeoffs-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="tradeoffs-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        What to watch out for
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((item, index) => {
          const iconKey =
            "icon" in item && typeof item.icon === "string"
              ? item.icon
              : "settings";
          const Icon = resolveIndustryIcon(iconKey);
          return (
            <li key={item.id}>
              <Card className="h-full p-4">
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index + 1),
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

export function RequirementUseCases({
  items,
  className,
}: {
  items: RequirementDetailModel["useCaseLinks"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="use-cases"
      aria-labelledby="uc-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Use cases where this requirement matters
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
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
              <p className="mt-3 text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                {item.title}
              </p>
              <Badge variant="neutral" className="mt-2 w-fit">
                {item.importanceLabel}
              </Badge>
              <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.description}
              </p>
              {item.href ? (
                <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                  {withSingleArrow("Explore use case")}
                </span>
              ) : null}
            </>
          );
          return (
            <li key={item.id}>
              {item.href ? (
                <Link href={item.href} className="group block h-full">
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

export function RequirementIndustry({
  items,
  className,
}: {
  items: RequirementDetailModel["profile"]["industryContexts"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="industries"
      aria-labelledby="ind-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="ind-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Where this requirement matters by industry
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.industrySlug}>
            <Card className="flex h-full flex-col p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.summary}
              </p>
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {withSingleArrow(`Explore ${item.title} context`)}
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementVendorQuestions({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="questions"
      aria-labelledby="vq-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="vq-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Questions to ask CRM vendors
      </h2>
      <ul className="mt-5 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        {items.map((q) => (
          <li key={q} className="flex items-start gap-3 px-4 py-3 text-sm">
            <span className="mt-0.5 inline-block size-3.5 shrink-0 rounded border border-[var(--sg-color-border)]" />
            {q}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementRelated({
  requirements,
  capabilities,
  features,
  className,
}: {
  requirements: RequirementDetailModel["relatedRequirements"];
  capabilities: RequirementDetailModel["relatedCapabilities"];
  features: RequirementDetailModel["relatedFeatures"];
  className?: string;
}) {
  return (
    <section
      id="related"
      className={cn("scroll-mt-28 space-y-10", className)}
    >
      {requirements.length > 0 ? (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
            Requirements often evaluated together
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {requirements.map((r) => {
              const content = (
                <>
                  <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                    {r.name}
                  </p>
                  {r.description ? (
                    <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)] line-clamp-3">
                      {r.description}
                    </p>
                  ) : null}
                  <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                    {withSingleArrow("Explore requirement")}
                  </span>
                </>
              );
              return (
                <li key={r.slug}>
                  <Link href={r.href} className="group block h-full">
                    <Card
                      variant="interactive"
                      className="flex h-full flex-col p-4"
                    >
                      {content}
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      {capabilities.length > 0 ? (
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h3)] font-semibold">
            Related capabilities
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {capabilities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={c.href}
                  className="inline-flex rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm font-medium hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {features.length > 0 ? (
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h3)] font-semibold">
            Related features
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                      {f.name}
                    </p>
                    <Badge variant="neutral">{f.relationship}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {f.rationale}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                    {withSingleArrow("Explore")}
                  </span>
                </>
              );
              return (
                <li key={f.slug}>
                  <Link href={f.href} className="group block h-full">
                    <Card variant="interactive" className="p-4">
                      {content}
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RequirementComparisons({
  items,
  className,
}: {
  items: RequirementDetailModel["comparisons"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="comparisons"
      aria-labelledby="cmp-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="cmp-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        Compare CRMs for this requirement
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex flex-wrap items-center gap-2">
                {item.products.slice(0, 2).map((p, i) => (
                  <span key={p.slug} className="flex items-center gap-2">
                    {i > 0 ? (
                      <span className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
                        VS
                      </span>
                    ) : null}
                    <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    <span className="text-sm font-medium">{p.name}</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.title}
              </p>
              <Link
                href={item.href}
                className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow("Compare")}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequirementFinderBanner({
  requirementName,
  finderHref,
  className,
}: {
  requirementName: string;
  finderHref: string;
  className?: string;
}) {
  return (
    <section id="finder" className={cn("scroll-mt-28", className)}>
      <Card className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/50 p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Need your CRM to {requirementName.toLowerCase()}?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Add this requirement to CRM Finder and personalize for team size,
          budget, and other priorities.
        </p>
        <ButtonLink href={finderHref} size="lg" className="mt-5">
          Add this requirement to CRM Finder
        </ButtonLink>
      </Card>
    </section>
  );
}

export function RequirementMethodology({
  research,
  decisionFlow,
  methodologyHref,
  methodologyNote,
  className,
}: {
  research: RequirementDetailModel["research"];
  decisionFlow: RequirementDetailModel["decisionFlow"];
  methodologyHref: string;
  methodologyNote?: string;
  className?: string;
}) {
  return (
    <section
      id="methodology"
      aria-labelledby="method-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="method-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        Evidence behind this requirement
      </h2>
      {methodologyNote ? (
        <p className="mt-3 max-w-3xl text-sm text-[var(--sg-color-text)]">
          {methodologyNote}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Products covered", value: research.productCount },
          { label: "Supporting features", value: research.featureCount },
          { label: "Evidence records", value: research.evidenceItemCount },
          { label: "Screenshots", value: research.screenshotCount },
          {
            label: "Official videos",
            value: research.officialVideoCount ?? 0,
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="text-2xl font-semibold text-[var(--sg-color-navy)]">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          How we evaluate this requirement
        </h3>
        <ol className="mt-4 flex flex-wrap items-center gap-2">
          {decisionFlow.map((step, index) => (
            <li key={step.label} className="flex items-center gap-2">
              <Card className="px-3 py-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                  {step.label}
                </p>
                <p className="mt-0.5 text-sm font-medium">{step.value}</p>
              </Card>
              {index < decisionFlow.length - 1 ? (
                <span className="text-[var(--sg-color-text-muted)]" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <ButtonLink href={methodologyHref} variant="outline" className="mt-4">
          Read our recommendations methodology
        </ButtonLink>
      </div>
    </section>
  );
}

export function RequirementSidebar({
  model,
  className,
}: {
  model: RequirementDetailModel;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden space-y-4 lg:sticky lg:top-24 lg:block",
        className,
      )}
    >
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          On this page
        </p>
        <nav className="mt-3">
          <ul className="space-y-1.5 text-sm">
            {model.navItems.slice(0, 14).map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Quick tools
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              href={model.finderHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("Find My CRM")}
            </Link>
          </li>
          <li>
            <Link
              href={model.calculatorHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("CRM Cost Calculator")}
            </Link>
          </li>
          <li>
            <Link
              href={model.compareHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("Compare products")}
            </Link>
          </li>
        </ul>
      </Card>
      {model.capabilityHref && model.profile.primaryCapabilityName ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Related capability
          </p>
          <Link
            href={model.capabilityHref}
            className="mt-2 block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {model.profile.primaryCapabilityName}
          </Link>
        </Card>
      ) : null}
      {model.relatedFeatures.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Related features
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {model.relatedFeatures.slice(0, 5).map((f) => (
              <li key={f.slug}>
                <Link
                  href={f.href}
                  className="text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
                >
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {model.useCaseLinks.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Related use cases
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {model.useCaseLinks.slice(0, 4).map((u) => (
              <li key={u.id}>
                {u.href ? (
                  <Link
                    href={u.href}
                    className="text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
                  >
                    {u.title}
                  </Link>
                ) : (
                  <span className="text-[var(--sg-color-text-muted)]">
                    {u.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </aside>
  );
}
