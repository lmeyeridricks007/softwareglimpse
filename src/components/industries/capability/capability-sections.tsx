import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { CategoryFAQ } from "@/components/category/category-faq";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import type { IndustryCapabilityModel } from "@/services/industry-capability";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { cn } from "@/lib/cn";

export { CategoryFAQ as CapabilityFaq };
export { CategoryQuickNav as CapabilityQuickNav };
export { IndustryFinalCta as CapabilityFinalCta };

export function CapabilityOutcomes({
  title = "What good looks like",
  items,
  className,
}: {
  title?: string;
  items: IndustryCapabilityModel["outcomes"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn("scroll-mt-28", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-sm"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
              aria-hidden
            />
            {item.label}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
        Your exact requirements depend on your sales or advisory process.
      </p>
    </section>
  );
}

export function CapabilityTradeoffs({
  title = "Common trade-offs",
  items,
  className,
}: {
  title?: string;
  items: IndustryCapabilityModel["tradeoffs"];
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
        {title}
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

export function CapabilityUseCaseFit({
  title,
  items,
  className,
}: {
  title: string;
  items: IndustryCapabilityModel["useCaseFits"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="use-cases"
      aria-labelledby="capability-use-cases-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="capability-use-cases-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
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
              {item.importanceLabel ? (
                <Badge variant="neutral" className="mt-2 w-fit">
                  {item.importanceLabel}
                </Badge>
              ) : null}
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

export function CapabilityVendorQuestions({
  title = "Questions to ask vendors",
  items,
  className,
}: {
  title?: string;
  items: string[];
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
        {title}
      </h2>
      <ul className="mt-5 divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        {items.map((q) => (
          <li key={q}>
            <details className="group px-4 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown
                  className="size-4 shrink-0 text-[var(--sg-color-text-muted)] transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-4 text-sm text-[var(--sg-color-text-muted)]">
                Ask the vendor to demonstrate this with your workflow, plans,
                and data requirements — and request documentation where
                relevant.
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityImplementation({
  title = "Before implementing",
  items,
  className,
}: {
  title?: string;
  items: IndustryCapabilityModel["implementation"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn("scroll-mt-28", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item, index) => {
          const Icon = resolveIndustryIcon(item.icon);
          return (
            <li key={item.id}>
              <Card className="h-full p-4">
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
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
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

export function CapabilityRelated({
  title = "Related capabilities",
  items,
  className,
}: {
  title?: string;
  items: IndustryCapabilityModel["relatedCapabilities"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn("scroll-mt-28", className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={item.href} className="group block h-full">
              <Card variant="interactive" className="h-full p-4">
                <p className="font-semibold group-hover:text-[var(--sg-color-primary)]">
                  {item.name}
                </p>
                {item.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
                <span className="mt-3 inline-block text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow("Explore")}
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityComparisons({
  title = "Compare products",
  items,
  className,
}: {
  title?: string;
  items: IndustryCapabilityModel["comparisons"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={cn("scroll-mt-28", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
          {title}
        </h2>
        <Link
          href="/compare/"
          className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow("View all comparisons")}
        </Link>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="group block h-full">
              <Card variant="interactive" className="flex h-full flex-col p-4">
                <div className="flex items-center gap-2">
                  {item.products.slice(0, 2).map((p, i) => (
                    <span key={p.slug} className="inline-flex items-center gap-2">
                      {i > 0 ? (
                        <span className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
                          vs
                        </span>
                      ) : null}
                      <ProductLogo name={p.name} logo={p.logo} size="sm" />
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-semibold group-hover:text-[var(--sg-color-primary)]">
                  {item.title}
                </p>
                <span className="mt-auto pt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                  {withSingleArrow("Compare")}
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CapabilityMethodology({
  capabilityName,
  research,
  methodologyHref = COMPANY_ROUTES.methodology,
  calculatorHref = "/tools/crm-cost-calculator/",
  className,
}: {
  capabilityName: string;
  research: IndustryCapabilityModel["research"];
  methodologyHref?: string;
  calculatorHref?: string;
  className?: string;
}) {
  return (
    <section
      id="methodology"
      aria-labelledby="methodology-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-muted)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2
        id="methodology-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold"
      >
        How we evaluate {capabilityName.toLowerCase()}
      </h2>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--sg-color-text-muted)]">
        <div>
          <dt className="inline font-medium text-[var(--sg-color-text)]">
            Products reviewed:{" "}
          </dt>
          <dd className="inline">{research.productCount}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-[var(--sg-color-text)]">
            Evidence items:{" "}
          </dt>
          <dd className="inline">{research.evidenceItemCount}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-[var(--sg-color-text)]">
            Screenshots:{" "}
          </dt>
          <dd className="inline">{research.screenshotCount}</dd>
        </div>
        {research.lastUpdated ? (
          <div>
            <dt className="inline font-medium text-[var(--sg-color-text)]">
              Last updated:{" "}
            </dt>
            <dd className="inline">{research.lastUpdated.slice(0, 10)}</dd>
          </div>
        ) : null}
      </dl>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Define requirements",
          "Map product evidence",
          "Compare consistently",
          "Editorially assess differences",
        ].map((step, i) => (
          <li
            key={step}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2.5 text-sm"
          >
            <span className="font-semibold text-[var(--sg-color-primary)]">
              {i + 1}.
            </span>{" "}
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={methodologyHref} variant="outline">
          {withSingleArrow("View full methodology")}
        </ButtonLink>
        <ButtonLink href={calculatorHref} variant="ghost">
          {withSingleArrow("Calculate CRM costs")}
        </ButtonLink>
      </div>
    </section>
  );
}

export function CapabilityFinderBanner({
  capabilityName,
  finderHref = "/tools/crm-finder/",
  className,
}: {
  capabilityName: string;
  finderHref?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-primary-soft)] px-5 py-8 sm:px-8",
        className,
      )}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold">
        Need {capabilityName.toLowerCase()} in your CRM?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Tell us your team size, requirements, integrations and budget. We will
        use structured answers — not affiliate incentives — to build your
        shortlist.
      </p>
      <ButtonLink href={finderHref} size="lg" className="mt-5">
        {withSingleArrow("Find My CRM")}
      </ButtonLink>
    </section>
  );
}
