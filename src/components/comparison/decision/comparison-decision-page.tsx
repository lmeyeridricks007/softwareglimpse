import type { ReactNode } from "react";
import Link from "next/link";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import { ComparisonChooseSection } from "@/components/comparison/comparison-choose";
import { ComparisonBottomCta } from "@/components/comparison/page/bottom-cta";
import { RelatedDiscovery } from "@/components/comparison/page/related-discovery";
import { ComparisonVerdictHero } from "@/components/comparison/page/comparison-verdict-hero";
import { ComparisonPageHeader } from "@/components/comparison/page/comparison-page-header";
import Image from "next/image";
import { ProductLogo } from "@/components/software/product-logo";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import { publicScreenshotCaption } from "@/services/product-media/public-screenshot-copy";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { SectionNavItem } from "@/components/navigation/section-anchor-nav";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
  visitCtaA?: ReactNode;
  visitCtaB?: ReactNode;
};

function availabilityVariant(
  label: string,
): "success" | "warning" | "danger" | "neutral" {
  const lower = label.toLowerCase();
  if (
    lower.includes("present") ||
    lower === "strong" ||
    lower.includes("available") ||
    lower === "yes"
  ) {
    return "success";
  }
  if (
    lower.includes("limited") ||
    lower.includes("add-on") ||
    lower.includes("higher") ||
    lower === "moderate"
  ) {
    return "warning";
  }
  if (
    lower.includes("absent") ||
    lower === "no" ||
    lower.includes("not available")
  ) {
    return "danger";
  }
  return "neutral";
}

function buildNavItems(model: ComparisonPageModel): SectionNavItem[] {
  const d = model.decision;
  const items: SectionNavItem[] = [{ id: "verdict", label: "Verdict", icon: "star" }];
  if (d.quickVerdict) items.push({ id: "quick-verdict", label: "Quick pick", icon: "choose" });
  if (d.categoryWinners.length > 0) {
    items.push({ id: "winners", label: "By category", icon: "comparisons" });
  }
  if (model.featureGroups.length > 0) {
    items.push({ id: "features", label: "Features", icon: "features" });
  }
  if (
    model.pricing.cardA.plans.length > 0 ||
    model.pricing.cardB.plans.length > 0 ||
    model.productA.startingPriceLabel ||
    model.productB.startingPriceLabel ||
    d.seatScenarios
  ) {
    items.push({ id: "pricing", label: "Pricing", icon: "pricing" });
  }
  if (d.bestForScenarios.length > 0) {
    items.push({ id: "best-for", label: "Best for", icon: "use-cases" });
  }
  if (d.realDifferences.length > 0) {
    items.push({ id: "differences", label: "Differences", icon: "scale" });
  }
  if (
    model.productA.pros.length +
      model.productA.cons.length +
      model.productB.pros.length +
      model.productB.cons.length >
    0
  ) {
    items.push({ id: "pros-cons", label: "Pros & cons", icon: "pros-cons" });
  }
  if (d.implementation) {
    items.push({ id: "implementation", label: "Setup", icon: "clock" });
  }
  if (d.integrations) {
    items.push({ id: "integrations", label: "Integrations", icon: "puzzle" });
  }
  if (d.whoShouldNot) {
    items.push({ id: "avoid", label: "Avoid if", icon: "checklist" });
  }
  if (model.alternatives.length > 0) {
    items.push({ id: "alternatives", label: "Alternatives", icon: "alternatives" });
  }
  if (d.finalVerdict) {
    items.push({ id: "final-verdict", label: "Final call", icon: "star" });
  }
  if (model.screenshotCount > 0) {
    items.push({ id: "screenshots", label: "Screenshots", icon: "overview" });
  }
  if (model.faq.length > 0) {
    items.push({ id: "faq", label: "FAQ", icon: "faq" });
  }
  items.push({ id: "related", label: "Next steps", icon: "explore" });
  return items;
}

function SectionHeading({
  id,
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="scroll-mt-28" id={id}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">{subtitle}</p>
      ) : null}
    </div>
  );
}

/**
 * Long-scroll decision page — all SEO-critical sections in initial HTML.
 * Empty sections are omitted; sparse pairs show a transparent limited-data state.
 */
export function ComparisonDecisionPage({
  model,
  visitCtaA,
  visitCtaB,
}: Props) {
  const d = model.decision;
  const navItems = buildNavItems(model);
  const nameA = model.productA.name;
  const nameB = model.productB.name;

  const chrome = {
    slug: model.slug,
    title: d.h1,
    subtitle: d.summary,
    lastUpdated: model.lastUpdated ?? null,
    evidenceSourceCount: model.evidenceSourceCount,
    screenshotCount: model.screenshotCount,
    howWeReviewHref: model.howWeReviewHref,
    provisional: model.provisional,
    researched: model.researched,
    availableTabs: model.availableTabs,
    productAName: nameA,
    productBName: nameB,
  };

  return (
    <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 sm:px-6">
      {model.provisional ? (
        <ResearchStatusBanner
          message={
            model.researched
              ? "Some criterion outcomes on this page are still being verified. Treat conclusions as provisional until research is fully approved."
              : "This comparison is still being added. Criterion outcomes may be incomplete and should not be treated as a finished approved review."
          }
        />
      ) : null}

      <ComparisonPageHeader chrome={chrome} />
      <CategoryQuickNav items={navItems} className="mt-6" />

      {d.limitedData ? (
        <Card className="mt-6 border-dashed border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface-muted)] p-4 text-sm text-[var(--sg-color-text-muted)]">
          Limited researched evidence for this pair. We show only what we can
          verify — empty sections are omitted rather than filled with generic
          copy.
        </Card>
      ) : null}

      <div id="verdict" className="mt-8 scroll-mt-28">
        <ComparisonVerdictHero
          model={model}
          visitCtaA={visitCtaA}
          visitCtaB={visitCtaB}
        />
      </div>

      <div className="mt-14 space-y-14">
        {d.quickVerdict ? (
          <section aria-labelledby="quick-verdict-heading">
            <SectionHeading
              id="quick-verdict"
              title="Quick verdict"
              subtitle="Start here — then dig into the evidence below."
            />
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {d.quickVerdict.chooseA.length > 0 ? (
                <Card className="border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/40">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Choose {nameA} if…
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.quickVerdict.chooseA.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {d.quickVerdict.chooseB.length > 0 ? (
                <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/30">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Choose {nameB} if…
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.quickVerdict.chooseB.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
            <Card className="mt-4 bg-[var(--sg-color-surface-tint)]">
              <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                Overall recommendation
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {d.quickVerdict.overallRecommendation}
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--sg-color-text)]">
                Key trade-off
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {d.quickVerdict.keyTradeoff}
              </p>
            </Card>
          </section>
        ) : null}

        {d.categoryWinners.length > 0 ? (
          <section aria-labelledby="winners-heading">
            <SectionHeading
              id="winners"
              title="Winner by category"
              subtitle="Only dimensions with researched evidence for this pair."
            />
            <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Dimension</th>
                    <th className="px-4 py-3 font-semibold">Winner</th>
                    <th className="px-4 py-3 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {d.categoryWinners.map((row) => (
                    <tr
                      key={row.slug}
                      className="border-t border-[var(--sg-color-border)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                        {row.dimension}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            row.result === "tie" ? "primary" : "success"
                          }
                        >
                          {row.winnerName}
                          {row.result === "tie" ? "" : " wins"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                        {row.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {model.featureGroups.length > 0 ? (
          <section aria-labelledby="features-heading">
            <SectionHeading
              id="features"
              title="Side-by-side feature matrix"
              subtitle="Normalized availability from product research — empty rows are not shown."
            />
            <div className="mt-5 space-y-8">
              {model.featureGroups.map((group) => (
                <div key={group.group}>
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    {group.group}
                  </h3>
                  <div className="mt-3 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Feature</th>
                          <th className="px-4 py-3 font-semibold">{nameA}</th>
                          <th className="px-4 py-3 font-semibold">{nameB}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row) => (
                          <tr
                            key={row.featureSlug}
                            className="border-t border-[var(--sg-color-border)]"
                          >
                            <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                              {row.name}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={availabilityVariant(row.labelA)}>
                                {row.labelA}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={availabilityVariant(row.labelB)}>
                                {row.labelB}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {model.pricing.cardA.plans.length > 0 ||
        model.pricing.cardB.plans.length > 0 ||
        model.productA.startingPriceLabel ||
        model.productB.startingPriceLabel ||
        d.seatScenarios ? (
          <section aria-labelledby="pricing-heading">
            <SectionHeading
              id="pricing"
              title="Pricing comparison"
              subtitle={
                model.pricing.verifiedAt
                  ? `Pricing evidence last checked ${model.pricing.verifiedAt}.`
                  : "Only verified starting prices and plans are shown."
              }
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                {
                  product: model.productA,
                  card: model.pricing.cardA,
                  accent: "a" as const,
                },
                {
                  product: model.productB,
                  card: model.pricing.cardB,
                  accent: "b" as const,
                },
              ].map(({ product, card, accent }) => {
                const has =
                  card.starting ||
                  card.freePlan ||
                  card.trial ||
                  card.plans.length > 0;
                if (!has) {
                  return (
                    <Card
                      key={product.slug}
                      className="border-dashed text-sm text-[var(--sg-color-text-muted)]"
                    >
                      <div className="flex items-center gap-3">
                        <ProductLogo
                          name={product.name}
                          logo={product.logo}
                          size="md"
                        />
                        <p>{product.name}: starting price not evidenced yet.</p>
                      </div>
                    </Card>
                  );
                }
                return (
                  <Card
                    key={product.slug}
                    className={cn(
                      "overflow-hidden p-0",
                      accent === "a"
                        ? "ring-1 ring-[var(--sg-color-primary)]/20"
                        : "ring-1 ring-[var(--sg-color-danger)]/15",
                    )}
                  >
                    <div
                      className={cn(
                        "border-b border-[var(--sg-color-border)] px-5 py-4",
                        accent === "a"
                          ? "bg-[var(--sg-color-primary-soft)]/50"
                          : "bg-[var(--sg-color-danger-soft)]/35",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ProductLogo
                          name={product.name}
                          logo={product.logo}
                          size="md"
                        />
                        <div>
                          <h3 className="font-semibold text-[var(--sg-color-text)]">
                            {product.name}
                          </h3>
                          {card.starting ? (
                            <p className="text-sm text-[var(--sg-color-text-muted)]">
                              From {card.starting}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {card.freePlan ? (
                          <Badge variant="neutral">{card.freePlan}</Badge>
                        ) : null}
                        {card.trial ? (
                          <Badge variant="primary">{card.trial}</Badge>
                        ) : null}
                      </div>
                    </div>
                    {card.plans.length > 0 ? (
                      <ul className="space-y-2 px-5 py-4 text-sm">
                        {card.plans.map((plan) => (
                          <li
                            key={plan.name}
                            className="flex items-baseline justify-between gap-3 border-b border-[var(--sg-color-border)] pb-2 last:border-0 last:pb-0"
                          >
                            <span className="font-medium text-[var(--sg-color-text)]">
                              {plan.name}
                            </span>
                            <span className="text-[var(--sg-color-text-muted)]">
                              {plan.priceLabel}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </Card>
                );
              })}
            </div>

            {d.seatScenarios ? (
              <div className="mt-6">
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  Seat-count estimates
                </h3>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  Labeled estimates from verified starting per-seat pricing —
                  not invoices.
                </p>
                <div className="mt-3 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Seats</th>
                        <th className="px-4 py-3 font-semibold">{nameA}</th>
                        <th className="px-4 py-3 font-semibold">{nameB}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.seatScenarios.map((row) => (
                        <tr
                          key={row.seats}
                          className="border-t border-[var(--sg-color-border)]"
                        >
                          <td className="px-4 py-3 font-medium">{row.seats}</td>
                          <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                            {row.labelA ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                            {row.labelB ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                  {d.seatScenarios[0]?.estimateNote}
                </p>
              </div>
            ) : null}

            {model.pricing.notes ? (
              <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
                {model.pricing.notes}
              </p>
            ) : null}

            {model.costCalculatorHref ? (
              <p className="mt-4 text-sm">
                <Link
                  href={model.costCalculatorHref}
                  className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Open cost calculator →
                </Link>
              </p>
            ) : null}
          </section>
        ) : null}

        {d.bestForScenarios.length > 0 ? (
          <section aria-labelledby="best-for-heading">
            <SectionHeading
              id="best-for"
              title="Best for"
              subtitle="Scenario picks from researched strengths — not a universal ranking."
            />
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.bestForScenarios.map((card) => {
                const isA = card.winnerSlug === model.productA.slug;
                return (
                  <li key={card.id}>
                    <Card
                      className={
                        isA
                          ? "h-full border-[var(--sg-color-success)]/25 bg-[var(--sg-color-success-soft)]/35"
                          : "h-full border-[var(--sg-color-danger)]/20 bg-[var(--sg-color-danger-soft)]/30"
                      }
                    >
                      <Badge variant={isA ? "success" : "danger"} className="w-fit">
                        → {card.winnerName}
                      </Badge>
                      <h3 className="mt-3 font-semibold text-[var(--sg-color-text)]">
                        {card.label}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                        {card.explanation}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {d.realDifferences.length > 0 ? (
          <section aria-labelledby="differences-heading">
            <SectionHeading
              id="differences"
              title="The differences that actually matter"
              subtitle={`Pair-specific analysis for ${nameA} vs ${nameB} — not generic category copy.`}
            />
            <ul className="mt-5 space-y-4">
              {d.realDifferences.map((diff) => (
                <li key={diff.id}>
                  <Card>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold text-[var(--sg-color-text)]">
                        {diff.title}
                      </h3>
                      {diff.winnerName ? (
                        <Badge
                          variant={
                            diff.winnerName === "Tie" ||
                            diff.winnerName === "Depends"
                              ? "primary"
                              : "success"
                          }
                        >
                          {diff.winnerName === "Tie" ||
                          diff.winnerName === "Depends"
                            ? diff.winnerName
                            : `${diff.winnerName} ahead`}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                      {diff.analysis}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {model.productA.pros.length +
          model.productA.cons.length +
          model.productB.pros.length +
          model.productB.cons.length >
        0 ? (
          <section aria-labelledby="pros-cons-heading">
            <SectionHeading
              id="pros-cons"
              title="Pros and cons"
              subtitle="Product-specific for this pair — derived from researched outcomes and editorial notes."
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[model.productA, model.productB].map((product) => (
                <Card key={product.slug}>
                  <div className="flex items-center gap-3">
                    <ProductLogo
                      name={product.name}
                      logo={product.logo}
                      size="sm"
                    />
                    <h3 className="font-semibold text-[var(--sg-color-text)]">
                      {product.name}
                    </h3>
                  </div>
                  {product.pros.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                        Pros
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                        {product.pros.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {product.cons.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-danger)]">
                        Cons
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                        {product.cons.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        {d.implementation ? (
          <section aria-labelledby="implementation-heading">
            <SectionHeading
              id="implementation"
              title="Implementation & learning curve"
              subtitle="Based on researched setup / ease criteria for this pair."
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Card>
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  {nameA}
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {d.implementation.pointsA.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Card>
              <Card>
                <h3 className="font-semibold text-[var(--sg-color-text)]">
                  {nameB}
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                  {d.implementation.pointsB.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        ) : null}

        {d.integrations ? (
          <section aria-labelledby="integrations-heading">
            <SectionHeading
              id="integrations"
              title="Integrations"
              subtitle="Overlaps and exclusives from product integration data when available."
            />
            {d.integrations.breadthNote ? (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                {d.integrations.breadthNote}
              </p>
            ) : null}
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {d.integrations.shared.length > 0 ? (
                <Card>
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Shared
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.integrations.shared.map((i) => (
                      <li key={i.slug}>{i.name}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {d.integrations.exclusiveA.length > 0 ? (
                <Card>
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Notable on {nameA}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.integrations.exclusiveA.map((i) => (
                      <li key={i.slug}>{i.name}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {d.integrations.exclusiveB.length > 0 ? (
                <Card>
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Notable on {nameB}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.integrations.exclusiveB.map((i) => (
                      <li key={i.slug}>{i.name}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          </section>
        ) : null}

        {d.whoShouldNot ? (
          <section aria-labelledby="avoid-heading">
            <SectionHeading
              id="avoid"
              title="Who should not choose each product"
              subtitle="Decision quality improves when we say who should walk away."
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {d.whoShouldNot.dontChooseA.length > 0 ? (
                <Card className="border-[var(--sg-color-danger)]/20">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Don&apos;t choose {nameA} if…
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.whoShouldNot.dontChooseA.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
              {d.whoShouldNot.dontChooseB.length > 0 ? (
                <Card className="border-[var(--sg-color-danger)]/20">
                  <h3 className="font-semibold text-[var(--sg-color-text)]">
                    Don&apos;t choose {nameB} if…
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--sg-color-text-muted)]">
                    {d.whoShouldNot.dontChooseB.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          </section>
        ) : null}

        {model.alternatives.length > 0 ? (
          <section aria-labelledby="alternatives-heading">
            <SectionHeading
              id="alternatives"
              title="Alternatives worth considering"
              subtitle="When neither product is the right fit."
            />
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {model.alternatives.map((alt) => (
                <li key={alt.slug}>
                  <Card className="h-full">
                    <div className="flex items-center gap-2">
                      <ProductLogo name={alt.name} logo={alt.logo} size="sm" />
                      <Link
                        href={alt.href}
                        className="font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {alt.name}
                      </Link>
                    </div>
                    {alt.bestFor ? (
                      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                        Best for: {alt.bestFor}
                      </p>
                    ) : alt.why ? (
                      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                        {alt.why}
                      </p>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {d.finalVerdict ? (
          <section aria-labelledby="final-verdict-heading">
            <SectionHeading
              id="final-verdict"
              title="Final verdict"
              subtitle="Scenario-level close — not a repeat of the intro."
            />
            <Card className="mt-5 bg-[var(--sg-color-surface-tint)]">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-[var(--sg-color-success)]">
                    {nameA} wins when…
                  </p>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {d.finalVerdict.winsWhenA}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--sg-color-primary)]">
                    {nameB} wins when…
                  </p>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {d.finalVerdict.winsWhenB}
                  </p>
                </div>
              </div>
              {d.finalVerdict.byScenario.length > 0 ? (
                <ul className="mt-5 space-y-2 border-t border-[var(--sg-color-border)] pt-4">
                  {d.finalVerdict.byScenario.map((row) => (
                    <li
                      key={row.scenario}
                      className="flex flex-wrap items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-[var(--sg-color-text-muted)]">
                        {row.scenario}
                      </span>
                      <Badge variant="success">{row.choice}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          </section>
        ) : null}

        {model.productA.bestFor.length > 0 ||
        model.productB.bestFor.length > 0 ? (
          <ComparisonChooseSection
            chooseA={
              model.productA.bestFor.length > 0
                ? {
                    productName: nameA,
                    scenarios: model.productA.bestFor,
                  }
                : undefined
            }
            chooseB={
              model.productB.bestFor.length > 0
                ? {
                    productName: nameB,
                    scenarios: model.productB.bestFor,
                  }
                : undefined
            }
          />
        ) : null}

        {model.screenshotCount > 0 ? (
          <section aria-labelledby="screenshots-heading">
            <SectionHeading
              id="screenshots"
              title="Product screenshots"
              subtitle="Real product UI from our media library — no placeholders."
            />
            <div className="mt-5 grid gap-8 lg:grid-cols-2">
              {[
                { product: model.productA, label: nameA },
                { product: model.productB, label: nameB },
              ].map(({ product, label }) => {
                const shots = product.screenshots
                  .filter((shot) => {
                    if (shot.kind === "original-diagram") return false;
                    if (shot.kind === "vendor-ui") return true;
                    return !(shot.annotation ?? "")
                      .toLowerCase()
                      .includes("softwareglimpse original");
                  })
                  .slice(0, 4);
                if (shots.length === 0) return null;
                return (
                  <div key={product.slug}>
                    <h3 className="mb-3 font-semibold text-[var(--sg-color-text)]">
                      {label}
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {shots.map((shot) => (
                        <li
                          key={shot.id ?? shot.src}
                          className="overflow-hidden rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]"
                        >
                          <Image
                            src={shot.src}
                            alt={
                              publicScreenshotCaption(shot) ||
                              shot.alt ||
                              `${label} product screenshot`
                            }
                            width={960}
                            height={600}
                            className="h-auto w-full object-cover"
                            sizes="(max-width: 768px) 100vw, 40vw"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {model.faq.length > 0 ? (
          <section aria-labelledby="faq-heading">
            <SectionHeading id="faq" title="FAQ" />
            <dl className="mt-5 space-y-4">
              {model.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-4"
                >
                  <dt className="font-semibold text-[var(--sg-color-text)]">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="related-heading">
          <SectionHeading
            id="related"
            title="Related decision paths"
            subtitle="Reviews, pricing, guides, and tools that continue this decision."
          />
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.relatedPaths.map((path) => (
              <li key={`${path.kind}-${path.href}`}>
                <Link
                  href={path.href}
                  className="flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 text-sm transition-colors hover:border-[var(--sg-color-primary)]"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    {path.kind}
                  </span>
                  <span className="mt-1 font-medium text-[var(--sg-color-primary)]">
                    {path.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <RelatedDiscovery model={model} />
          </div>
        </section>

        <ComparisonBottomCta model={model} />
      </div>
    </div>
  );
}
