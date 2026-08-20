import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SoftwareCta } from "@/components/affiliate/software-cta";
import { SoftwarePromotionBanner } from "@/components/affiliate/software-promotion";
import { PricingPlansTable } from "@/components/pricing/pricing-plans-table";
import { ResearchTrustNote } from "@/components/research/research-trust-note";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import {
  crmRequirementsFromCalculatorInput,
  formatMoney,
  type ProductCostEstimate,
} from "@/domain";
import { resolveAlternativeSlugs } from "@/services/graph/resolve-relationships";
import {
  calculateProductCost,
  canCalculatePricing,
  type PricingSnapshot,
} from "@/services/pricing";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd } from "@/seo/structured-data";
import { getAllSoftwareUnfiltered } from "@/data";

type Props = {
  params: Promise<{ slug: string }>;
};

const EXAMPLE_USER_COUNTS = [5, 10, 25, 50] as const;

function isCalculableSnapshot(snapshot: PricingSnapshot): boolean {
  const eligibility = canCalculatePricing(snapshot, {
    requirements: crmRequirementsFromCalculatorInput({
      crmUsers: 5,
      requiredFeatureSlugs: [],
      billingPreference: "either",
    }),
  });
  return eligibility.status !== "INSUFFICIENT_DATA";
}

export function generateStaticParams() {
  return listCrmPricingSnapshots()
    .filter(isCalculableSnapshot)
    .map((snapshot) => ({ slug: snapshot.productSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const snapshot = listCrmPricingSnapshots().find(
    (item) => item.productSlug === slug,
  );
  if (!snapshot || !isCalculableSnapshot(snapshot)) {
    return buildPageMetadata({
      title: "Pricing not found",
      description: "This product pricing page is not available.",
      path: `/pricing/${slug}/`,
      indexable: false,
    });
  }

  // Fixture research stays noindex until live verification.
  const indexable = !snapshot.hasFixtureResearch;

  return buildPageMetadata({
    title: `${snapshot.name} Pricing: Plans, Costs & What You'll Actually Pay`,
    description: `Verified ${snapshot.name} plans and example seat costs from public pricing. Estimates are before tax; invoices may differ.`,
    path: `/pricing/${slug}/`,
    indexable,
  });
}

export default async function ProductPricingPage({ params }: Props) {
  const { slug } = await params;
  const snapshot = listCrmPricingSnapshots().find(
    (item) => item.productSlug === slug,
  );
  if (!snapshot || !isCalculableSnapshot(snapshot)) notFound();

  const plans = snapshot.pricing?.plans ?? [];
  const currency = snapshot.pricing?.currency;

  const exampleRows: {
    users: number;
    estimate: ProductCostEstimate;
  }[] = EXAMPLE_USER_COUNTS.map((users) => ({
    users,
    estimate: calculateProductCost(
      snapshot,
      crmRequirementsFromCalculatorInput({
        crmUsers: users,
        requiredFeatureSlugs: [],
        billingPreference: "either",
      }),
    ),
  }));

  const exampleMonthlyByPlanSlug: Record<string, number> = {};
  // Prefer the 10-user example for the plans table column when calculable.
  const tenUser = exampleRows.find((row) => row.users === 10)?.estimate;
  if (
    tenUser?.recommendedPlan &&
    tenUser.monthlyEquivalent &&
    (tenUser.status === "calculated" || tenUser.status === "partial")
  ) {
    exampleMonthlyByPlanSlug[tenUser.recommendedPlan.slug] =
      tenUser.monthlyEquivalent.amountMinor / 100;
  }

  const alternatives = resolveAlternativeSlugs(slug)
    .map((altSlug) =>
      getAllSoftwareUnfiltered().find((item) => item.slug === altSlug),
    )
    .filter(Boolean)
    .slice(0, 4);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing/" },
    { name: snapshot.name, path: `/pricing/${slug}/` },
  ];

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />

      {snapshot.hasFixtureResearch ? (
        <ResearchStatusBanner message="This pricing page uses fixture research for pipeline demonstration. It remains noindex until live vendor pricing is verified." />
      ) : null}

      <PageHero
        title={`${snapshot.name} pricing`}
        description={`Plans, verified list prices, and example seat costs for ${snapshot.name}. Affiliate relationships do not change these figures.`}
      >
        <div className="flex flex-col gap-4">
          <SoftwarePromotionBanner
            productId={slug}
            context="pricing-page"
          />
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tools/crm-plan-selector/?vendor=${encodeURIComponent(slug)}`}
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]"
            >
              Find my {snapshot.name} plan
            </Link>
            <Link
              href="/tools/crm-cost-calculator/"
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2.5 text-sm font-medium"
            >
              Calculate what {snapshot.name} would cost
            </Link>
            <SoftwareCta
              productId={slug}
              context="pricing-page"
              intent="VIEW_PRICING"
              variant="button"
            />
          </div>
        </div>
      </PageHero>

      <section className="mb-10" aria-labelledby="summary-heading">
        <h2
          id="summary-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold"
        >
          Summary
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
          {snapshot.pricing?.notes ||
            `${snapshot.name} pricing model: ${snapshot.pricing?.model ?? "unknown"}.`}
          {snapshot.pricing?.startingPriceMonthly != null && currency
            ? ` Starting from roughly ${formatMoney({
                amountMinor: Math.round(
                  snapshot.pricing.startingPriceMonthly * 100,
                ),
                currency,
              })} / seat / month (list, before tax) when a calculable plan exists.`
            : null}
        </p>
        <ResearchTrustNote
          checkedAt={snapshot.pricingCheckedAt}
          label="Pricing"
          fixture={snapshot.hasFixtureResearch}
        />
      </section>

      <section className="mb-10" aria-labelledby="plans-heading">
        <h2
          id="plans-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold"
        >
          Plans
        </h2>
        <div className="mt-4">
          <PricingPlansTable
            plans={plans}
            currency={currency}
            exampleMonthlyByPlanSlug={
              Object.keys(exampleMonthlyByPlanSlug).length > 0
                ? exampleMonthlyByPlanSlug
                : undefined
            }
            exampleUsers={10}
          />
        </div>
      </section>

      <section className="mb-10" aria-labelledby="examples-heading">
        <h2
          id="examples-heading"
          className="font-[family-name:var(--font-display)] text-xl font-semibold"
        >
          Example costs
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Same engine as the CRM Cost Calculator. No required features applied —
          cheapest calculable plan when the feature–plan matrix is incomplete.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Example {snapshot.name} costs by seat count
            </caption>
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Users
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Status
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Plan
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Monthly eq.
                </th>
                <th scope="col" className="py-2 font-medium">
                  Annual
                </th>
              </tr>
            </thead>
            <tbody>
              {exampleRows.map(({ users, estimate }) => (
                <tr
                  key={users}
                  className="border-b border-[var(--color-border)]"
                >
                  <th scope="row" className="py-3 pr-3 font-medium">
                    {users}
                  </th>
                  <td className="py-3 pr-3">{estimate.status}</td>
                  <td className="py-3 pr-3">
                    {estimate.recommendedPlan?.name ??
                      (estimate.status === "custom-quote"
                        ? "Contact sales"
                        : "—")}
                  </td>
                  <td className="py-3 pr-3 tabular-nums">
                    {estimate.monthlyEquivalent
                      ? formatMoney(estimate.monthlyEquivalent)
                      : "—"}
                  </td>
                  <td className="py-3 tabular-nums">
                    {estimate.annualCost
                      ? formatMoney(estimate.annualCost)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          Not sure which plan?
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Answer a few questions and find the lowest {snapshot.name} plan that
          meets your requirements — or estimate seat costs across CRMs.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href={`/tools/crm-plan-selector/?vendor=${encodeURIComponent(slug)}`}
            className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline"
          >
            Find my plan
          </Link>
          <Link
            href="/tools/crm-cost-calculator/"
            className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline"
          >
            Open CRM Cost Calculator
          </Link>
        </div>
      </section>

      {alternatives.length > 0 ? (
        <section className="mb-10" aria-labelledby="alts-heading">
          <h2
            id="alts-heading"
            className="font-[family-name:var(--font-display)] text-xl font-semibold"
          >
            Alternatives
          </h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {alternatives.map((item) =>
              item ? (
                <li key={item.id}>
                  <Link
                    href={`/software/${item.slug}/`}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm underline-offset-2 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      <p className="text-sm text-[var(--color-fg-muted)]">
        <Link
          href={`/software/${slug}/`}
          className="font-medium text-[var(--color-fg)] underline-offset-2 hover:underline"
        >
          Back to {snapshot.name} profile
        </Link>
      </p>
    </>
  );
}
