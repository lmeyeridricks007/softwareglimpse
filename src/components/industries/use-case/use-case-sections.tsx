import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import {
  UseCaseConceptVisual,
  useCaseHowItWorksCaption,
  useCaseVisualKindForSlug,
} from "@/components/industries/use-case/use-case-visuals";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { CategoryFAQ } from "@/components/category/category-faq";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import type {
  IndustryUseCaseModel,
  IndustryUseCaseProductRow,
  UseCaseFitLabel,
} from "@/services/industry-use-case";
import { cn } from "@/lib/cn";

export { CategoryFAQ as UseCaseFaq };
export { CategoryQuickNav as UseCaseQuickNav };
export { IndustryFinalCta as UseCaseFinalCta };

export function UseCaseHowItWorks({
  useCaseName,
  useCaseSlug,
  industryName,
  className,
}: {
  useCaseName: string;
  useCaseSlug: string;
  industryName: string;
  className?: string;
}) {
  const kind = useCaseVisualKindForSlug(useCaseSlug);
  return (
    <section
      id="how-it-works"
      aria-labelledby="uc-how-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="uc-how-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How {useCaseName.toLowerCase()} typically uses CRM
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {useCaseHowItWorksCaption(useCaseName, industryName, kind)}
      </p>
      <div className="mt-5">
        <UseCaseConceptVisual kind={kind} useCaseName={useCaseName} />
      </div>
    </section>
  );
}

function fitBadgeVariant(
  label: UseCaseFitLabel,
): "success" | "primary" | "warning" | "neutral" {
  if (label === "Strong") return "success";
  if (label === "Good") return "primary";
  if (label === "Limited") return "warning";
  return "neutral";
}

export function UseCaseWhyDiffer({
  items,
  className,
}: {
  items: IndustryUseCaseModel["whyDiffer"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="why-differ"
      aria-labelledby="why-differ-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="why-differ-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Why the recommendations differ
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon("layers");
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
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
                {item.product ? (
                  <p className="mt-3 text-sm">
                    <span className="text-[var(--sg-color-text-muted)]">
                      Likely fit:{" "}
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

export function UseCaseDeepDives({
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
      id="deep-dives"
      aria-labelledby="deep-dives-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="deep-dives-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <Card key={item.slug} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ProductLogo name={item.name} logo={item.logo} size="md" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <Badge
                    variant={fitBadgeVariant(item.fitLabel)}
                    className="mt-1"
                  >
                    Fit for {useCaseName.toLowerCase()}: {item.fitLabel}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                Evidence: {item.evidenceCount} items · {item.evidenceConfidence}{" "}
                confidence
              </p>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Why it works
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
                      See the scorecard and requirement matrix for
                      coverage.
                    </li>
                  ) : null}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Where it may not fit
                </p>
                <ul className="mt-2 space-y-1.5">
                  {item.limitations.map((s) => (
                    <li key={s} className="text-sm text-[var(--sg-color-text-muted)]">
                      {s}
                    </li>
                  ))}
                  {item.limitations.length === 0 ? (
                    <li className="text-sm text-[var(--sg-color-text-muted)]">
                      No major limitations surfaced for this use
                      case’s core requirements.
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            {item.bestFor ? (
              <p className="mt-4 text-sm">
                <span className="font-medium">Best suited to: </span>
                {item.bestFor}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={item.reviewHref} size="sm">
                Full {item.name} review
              </ButtonLink>
              <ButtonLink href={item.compareHref} variant="outline" size="sm">
                Compare {item.name}
              </ButtonLink>
              <ButtonLink href={item.pricingHref} variant="ghost" size="sm">
                {item.name} pricing
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function UseCaseScenarios({
  title = "Which CRM fits your situation?",
  items,
  finderHref,
  className,
}: {
  title?: string;
  items: IndustryUseCaseModel["scenarios"];
  finderHref: string;
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
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Named buyer situations to stress-test fit. Suggested products appear
        only when evidence supports the scenario’s priority capabilities —
        never as a popularity pick.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="flex h-full flex-col p-4">
                <span
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)]",
                    hubToneClass(index + 2),
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
                      Suggested fit:{" "}
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
      <Card className="mt-5 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-5">
        <p className="font-semibold text-[var(--sg-color-navy)]">
          Adjust what matters to you
        </p>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Personalize these recommendations with the same scoring engine as CRM
          Finder — team size, budget, integrations, and priority overrides.
        </p>
        <ButtonLink href={finderHref} className="mt-4">
          Personalize these recommendations
        </ButtonLink>
      </Card>
    </section>
  );
}

export function UseCasePricingCta({
  calculatorHref,
  useCaseName,
  className,
}: {
  calculatorHref: string;
  useCaseName: string;
  className?: string;
}) {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={cn("scroll-mt-28", className)}
    >
      <Card className="bg-[var(--sg-color-surface-tint)] p-6 sm:p-8">
        <h2
          id="pricing-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]"
        >
          What might these CRM options cost?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Use verified list prices for your team size. Estimates for{" "}
          {useCaseName.toLowerCase()} should stay tied to published plans —
          custom-quote products stay labeled as custom quote.
        </p>
        <ButtonLink href={calculatorHref} size="lg" className="mt-5">
          Calculate exact CRM costs
        </ButtonLink>
      </Card>
    </section>
  );
}

export function UseCaseTradeoffs({
  items,
  className,
}: {
  items: IndustryUseCaseModel["tradeoffs"];
  className?: string;
}) {
  if (items.length === 0) return null;
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
        Trade-offs to consider
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
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

export function UseCaseImplementation({
  items,
  className,
}: {
  items: IndustryUseCaseModel["implementation"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="implementation"
      aria-labelledby="impl-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="impl-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Before choosing your CRM
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

export function UseCaseVendorQuestions({
  items,
  className,
}: {
  items: IndustryUseCaseModel["vendorQuestions"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="questions"
      aria-labelledby="vendor-q-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="vendor-q-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Questions to ask CRM vendors
      </h2>
      <div className="mt-5 space-y-3">
        {items.map((group) => (
          <details
            key={group.group}
            className="group rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] open:shadow-sm"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold">
              {group.group}
              <ChevronDown className="size-4 transition group-open:rotate-180" />
            </summary>
            <ul className="space-y-2 border-t border-[var(--sg-color-border)] px-4 py-3">
              {group.questions.map((q) => (
                <li key={q} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 inline-block size-3.5 shrink-0 rounded border border-[var(--sg-color-border)]" />
                  {q}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}

export function UseCaseRelatedCapabilities({
  items,
  className,
}: {
  items: IndustryUseCaseModel["relatedCapabilities"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="related-capabilities"
      aria-labelledby="related-caps-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="related-caps-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Explore the capabilities behind this use case
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold">{item.name}</p>
                {item.importance ? (
                  <Badge variant="neutral">{item.importance}</Badge>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              ) : null}
              <Link
                href={item.href}
                className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow("Explore")}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function UseCaseRelatedUseCases({
  title,
  items,
  className,
}: {
  title: string;
  items: IndustryUseCaseModel["relatedUseCases"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="related-use-cases"
      aria-labelledby="related-uc-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="related-uc-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const content = (
            <>
              <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                {item.name}
              </p>
              {item.description ? (
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
              ) : null}
              <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                {withSingleArrow("Explore use case")}
              </span>
            </>
          );
          return (
            <li key={item.slug}>
              <Link href={item.href} className="group block h-full">
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
    </section>
  );
}

export function UseCaseComparisons({
  items,
  className,
}: {
  items: IndustryUseCaseModel["comparisons"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="comparisons"
      aria-labelledby="comparisons-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="comparisons-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Popular comparisons for this use case
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center gap-2">
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

export function UseCaseFinderBanner({
  useCaseName,
  finderHref,
  className,
}: {
  useCaseName: string;
  finderHref: string;
  className?: string;
}) {
  return (
    <section
      id="finder"
      aria-labelledby="finder-heading"
      className={cn("scroll-mt-28", className)}
    >
      <Card className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/50 p-6 sm:p-8">
        <h2
          id="finder-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]"
        >
          Not sure which one fits your team?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          We&apos;ve shown the general recommendation for{" "}
          {useCaseName.toLowerCase()} teams. Now personalize it for team size,
          budget, integrations, and your priorities.
        </p>
        <ButtonLink href={finderHref} size="lg" className="mt-5">
          Find My CRM
        </ButtonLink>
      </Card>
    </section>
  );
}

export function UseCaseMethodology({
  useCaseName,
  research,
  decisionFlow,
  methodologyHref,
  className,
}: {
  useCaseName: string;
  research: IndustryUseCaseModel["research"];
  decisionFlow: IndustryUseCaseModel["decisionFlow"];
  methodologyHref: string;
  className?: string;
}) {
  return (
    <section
      id="methodology"
      aria-labelledby="methodology-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="methodology-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Research behind these recommendations
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Products evaluated", value: research.productCount },
          { label: "Capabilities", value: research.capabilityCount },
          { label: "Requirements", value: research.requirementCount },
          { label: "Evidence items", value: research.evidenceItemCount },
          { label: "Screenshots", value: research.screenshotCount },
          { label: "Pricing records", value: research.pricingRecordCount },
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
          How this recommendation was built
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
        <p className="mt-4 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          {useCaseName} recommendations start from industry context, capability
          priorities, and requirement mapping — then apply product evidence and
          approved assessments consistently.
        </p>
        <ButtonLink href={methodologyHref} variant="outline" className="mt-4">
          View methodology
        </ButtonLink>
      </div>
    </section>
  );
}

export function UseCaseSidebar({
  navItems,
  finderHref,
  calculatorHref,
  compareHref,
  relatedCapabilities,
  className,
}: {
  navItems: IndustryUseCaseModel["navItems"];
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  relatedCapabilities: IndustryUseCaseModel["relatedCapabilities"];
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
            {navItems.slice(0, 12).map((item) => (
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
              href={finderHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("Find My CRM")}
            </Link>
          </li>
          <li>
            <Link
              href={calculatorHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("CRM Cost Calculator")}
            </Link>
          </li>
          <li>
            <Link
              href={compareHref}
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {withSingleArrow("Compare CRM")}
            </Link>
          </li>
        </ul>
      </Card>
      {relatedCapabilities.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Related capabilities
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {relatedCapabilities.slice(0, 5).map((cap) => (
              <li key={cap.slug}>
                <Link
                  href={cap.href}
                  className="text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
                >
                  {cap.name}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </aside>
  );
}
