import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { createElement } from "react";
import {
  resolveIndustryIcon,
  withSingleArrow,
} from "@/components/industries/industry-hub-icons";
import { CapabilityScreenshots } from "@/components/industries/capability/capability-screenshots";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import {
  FeatureConceptVisual,
  type FeatureVisualKind,
} from "@/components/features/feature-visuals";
import { ProductLogo } from "@/components/software/product-logo";
import { OfficialProductVideo } from "@/components/software/official-product-video";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { hubToneClass } from "@/components/category/hub-icons";
import { CategoryFAQ } from "@/components/category/category-faq";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import type {
  FeatureDetailModel,
  FeatureProductRow,
  FeatureSupportStatus,
} from "@/services/feature-detail";
import { cn } from "@/lib/cn";

export { CategoryFAQ as FeatureFaq };
export { CategoryQuickNav as FeatureQuickNav };
export { IndustryFinalCta as FeatureFinalCta };

export function FeatureHowItWorks({
  featureName,
  visualKind,
  caption,
  className,
}: {
  featureName: string;
  visualKind: FeatureVisualKind;
  caption: string;
  className?: string;
}) {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="how-it-works-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        How {featureName.toLowerCase()} works
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        {caption}
      </p>
      <div className="mt-5">
        <FeatureConceptVisual kind={visualKind} featureName={featureName} />
      </div>
    </section>
  );
}

export function FeatureExamples({
  featureName,
  items,
  className,
}: {
  featureName: string;
  items: FeatureDetailModel["workedExamples"];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section
      id="examples"
      aria-labelledby="examples-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="examples-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Worked examples for {featureName.toLowerCase()}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Concrete buyer situations — not product recommendations. Use them to
        test whether a CRM’s implementation matches how your team works.
      </p>
      <ul className="mt-5 grid gap-4 lg:grid-cols-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <Card className="h-full p-5">
              <span
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-full text-xs font-bold text-[var(--sg-color-navy)]",
                  hubToneClass(index + 1),
                )}
              >
                {index + 1}
              </span>
              <p className="mt-3 text-base font-semibold text-[var(--sg-color-navy)]">
                {item.title}
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    Situation
                  </p>
                  <p className="mt-1 text-[var(--sg-color-text-muted)]">
                    {item.situation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                    What good looks like
                  </p>
                  <p className="mt-1 text-[var(--sg-color-text)]">
                    {item.whatGoodLooksLike}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                    Ask vendors
                  </p>
                  <p className="mt-1 text-[var(--sg-color-text-muted)]">
                    {item.whatToAskVendors}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

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

export function FeatureImplementation({
  themes,
  products,
  seeInAction = [],
  className,
}: {
  themes: FeatureDetailModel["profile"]["implementationThemes"];
  products: FeatureProductRow[];
  seeInAction?: FeatureDetailModel["seeInAction"];
  className?: string;
}) {
  if (themes.length === 0 && seeInAction.length < 2) return null;
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
        How products implement this feature differently
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Two products can both support the feature while differing in depth.
        Official demos below are supplementary — the comparison matrix remains
        the structured source of truth.
      </p>
      {seeInAction.length >= 2 ? (
        <ul className="mt-5 grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {seeInAction.slice(0, 2).map((card) => (
            <li key={`impl-vid-${card.productSlug}`}>
              <Card className="overflow-hidden p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  {card.productName}
                </p>
                <div className="mt-3">
                  <OfficialProductVideo
                    media={card.media}
                    vendorName={card.productName}
                    variant="compact"
                    priority="low"
                  />
                </div>
                {card.whatThisShows[0] ? (
                  <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                    {card.whatThisShows[0]}
                  </p>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
      {themes.length > 0 ? (
        <ul className="mt-5 grid gap-3 lg:grid-cols-3">
          {themes.map((theme, index) => {
            const Icon = resolveIndustryIcon(theme.icon);
            const sample = products.slice(0, 3).map((p) => {
              const cell = theme.dimensionId
                ? p.dimensionCells[theme.dimensionId]
                : null;
              return {
                name: p.name,
                value: cell?.display ?? supportLabel(p.supportStatus),
              };
            });
            return (
              <li key={theme.id}>
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
                  <p className="mt-3 text-sm font-semibold">{theme.title}</p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {theme.description}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-[var(--sg-color-border)] pt-3 text-sm">
                    {sample.map((s) => (
                      <li key={s.name} className="flex justify-between gap-2">
                        <span className="text-[var(--sg-color-text-muted)]">
                          {s.name}
                        </span>
                        <span className="font-medium">{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export function FeatureDeepDives({
  featureName,
  items,
  className,
}: {
  featureName: string;
  items: FeatureProductRow[];
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
        How each product handles {featureName.toLowerCase()}
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
                    {item.name} {featureName.toLowerCase()}
                  </p>
                  <Badge
                    variant={supportBadgeVariant(item.supportStatus)}
                    className="mt-1"
                  >
                    {supportLabel(item.supportStatus)} · {item.depthLabel}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-[var(--sg-color-text-muted)]">
                Evidence: {item.evidenceCount} · {item.evidenceConfidence}{" "}
                confidence
              </p>
            </div>
            {item.minimumPlan ? (
              <p className="mt-3 text-sm">
                <span className="font-medium">Available from: </span>
                {item.minimumPlan}
              </p>
            ) : null}
            {item.howItWorks ? (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                {item.howItWorks}
              </p>
            ) : null}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Strengths
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
                      See matrix for coverage.
                    </li>
                  ) : null}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Limitations
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
                      No major limitations surfaced for this feature.
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
            {item.bestFor ? (
              <p className="mt-4 text-sm">
                <span className="font-medium">Best for: </span>
                {item.bestFor}
              </p>
            ) : null}
            {item.featureVideo ? (
              <div className="mt-5 border-t border-[var(--sg-color-border)] pt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  See it in action
                </p>
                <div className="mt-3">
                  <OfficialProductVideo
                    media={item.featureVideo}
                    vendorName={item.name}
                    variant="compact"
                    priority="low"
                  />
                </div>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  Official vendor demonstration — complementary evidence, not a
                  substitute for the comparison matrix.
                </p>
                <a
                  href="#feature-evidence"
                  className="mt-2 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  View all feature evidence
                </a>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <ButtonLink href={item.reviewHref} size="sm">
                Read {item.name} review
              </ButtonLink>
              <ButtonLink href={item.pricingHref} variant="outline" size="sm">
                View pricing
              </ButtonLink>
              <ButtonLink href={item.compareHref} variant="ghost" size="sm">
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

export function FeatureScreenshots({
  featureName,
  items,
}: {
  featureName: string;
  items: FeatureDetailModel["screenshots"];
}) {
  return (
    <CapabilityScreenshots
      capabilityName={featureName}
      items={items}
      title={`See ${featureName.toLowerCase()} in the products`}
    />
  );
}

export function FeatureTradeoffs({
  items,
  industryTradeoffs,
  className,
}: {
  items: FeatureDetailModel["profile"]["tradeoffs"];
  industryTradeoffs?: NonNullable<
    FeatureDetailModel["industryContext"]
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
      <Card className="mt-4 border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-4">
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Feature availability alone does not tell you whether the
          implementation fits your workflow. Compare depth, plan gating, and
          related dimensions before shortlisting.
        </p>
      </Card>
    </section>
  );
}

export function FeatureUseCaseRelevance({
  items,
  className,
}: {
  items: FeatureDetailModel["useCaseRelevance"];
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
        When this feature matters most
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
                <Badge variant="neutral" className="mt-2 w-fit">
                  {item.relevanceLabel}
                </Badge>
                <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.description}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                  >
                    {withSingleArrow("Explore use case")}
                  </Link>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FeatureIndustryRelevance({
  items,
  className,
}: {
  items: FeatureDetailModel["industryRelevance"];
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
        How this feature matters by industry
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
                  {withSingleArrow(`Explore for ${item.title}`)}
                </Link>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeatureVendorQuestions({
  featureName,
  items,
  className,
}: {
  featureName: string;
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
        Questions to ask vendors about {featureName.toLowerCase()}
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

export function FeatureRelated({
  features,
  capabilities,
  className,
}: {
  features: FeatureDetailModel["relatedFeatures"];
  capabilities: FeatureDetailModel["relatedCapabilities"];
  className?: string;
}) {
  if (features.length === 0 && capabilities.length === 0) return null;
  return (
    <section
      id="related"
      aria-labelledby="related-heading"
      className={cn("scroll-mt-28", className)}
    >
      {features.length > 0 ? (
        <div>
          <h2
            id="related-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            Features commonly evaluated together
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const content = (
                <>
                  <p className="text-sm font-semibold group-hover:text-[var(--sg-color-primary)]">
                    {f.name}
                  </p>
                  {f.description ? (
                    <p className="mt-2 flex-1 text-sm text-[var(--sg-color-text-muted)] line-clamp-3">
                      {f.description}
                    </p>
                  ) : null}
                  <span className="mt-3 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 group-hover:underline">
                    {withSingleArrow("Explore feature")}
                  </span>
                </>
              );
              return (
                <li key={f.slug}>
                  <Link href={f.href} className="group block h-full">
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
        <div className={features.length > 0 ? "mt-10" : undefined}>
          <h3 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h3)] font-semibold">
            Capabilities this feature supports
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
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
    </section>
  );
}

export function FeatureComparisons({
  items,
  className,
}: {
  items: FeatureDetailModel["comparisons"];
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
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Compare products on this feature
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

export function FeatureFinderBanner({
  featureName,
  finderHref,
  className,
}: {
  featureName: string;
  finderHref: string;
  className?: string;
}) {
  return (
    <section id="finder" className={cn("scroll-mt-28", className)}>
      <Card className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/50 p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Need {featureName.toLowerCase()}?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
          Add this as a requirement in your CRM shortlist and personalize for
          team size, budget, and other priorities.
        </p>
        <ButtonLink href={finderHref} size="lg" className="mt-5">
          Find My CRM
        </ButtonLink>
      </Card>
    </section>
  );
}

export function FeatureMethodology({
  featureName,
  research,
  decisionFlow,
  methodologyHref,
  className,
}: {
  featureName: string;
  research: FeatureDetailModel["research"];
  decisionFlow: FeatureDetailModel["decisionFlow"];
  methodologyHref: string;
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
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Evidence behind this feature comparison
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products covered", value: research.productCount },
          { label: "Evidence items", value: research.evidenceItemCount },
          { label: "Screenshots", value: research.screenshotCount },
          { label: "Plan records", value: research.planRecordCount },
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
          How we evaluate {featureName.toLowerCase()}
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
        <details className="group mt-5 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold">
            Evaluation steps
            <ChevronDown className="size-4 transition group-open:rotate-180" />
          </summary>
          <ol className="list-decimal space-y-1 border-t border-[var(--sg-color-border)] px-4 py-3 pl-8 text-sm text-[var(--sg-color-text-muted)]">
            <li>Define what counts as the feature</li>
            <li>Break it into evaluation dimensions</li>
            <li>Collect product evidence from research</li>
            <li>Map support, plans, and limitations</li>
            <li>Compare products consistently</li>
            <li>Editorially review conclusions</li>
          </ol>
        </details>
        <ButtonLink href={methodologyHref} variant="outline" className="mt-4">
          Read feature research methodology
        </ButtonLink>
      </div>
    </section>
  );
}

export function FeatureSidebar({
  model,
  className,
}: {
  model: FeatureDetailModel;
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
            {model.navItems.slice(0, 12).map((item) => (
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
      {model.research.officialVideoCount > 0 ||
      model.research.screenshotCount > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Media evidence
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                Official demos
              </dt>
              <dd className="font-medium tabular-nums">
                {model.research.officialVideoCount}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">Screenshots</dt>
              <dd className="font-medium tabular-nums">
                {model.research.screenshotCount}
              </dd>
            </div>
          </dl>
          <a
            href="#feature-evidence"
            className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Jump to evidence
          </a>
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
      {model.comparisons.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Popular comparisons
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {model.comparisons.slice(0, 4).map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-primary)]"
                >
                  {c.products
                    .slice(0, 2)
                    .map((p) => p.name)
                    .join(" vs ")}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {model.profile.vendorQuestions.length > 0 ? (
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Ask vendors about {model.featureName.toLowerCase()}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            {model.profile.vendorQuestions.slice(0, 5).map((q) => (
              <li key={q} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--sg-color-primary)]" />
                {q}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </aside>
  );
}
