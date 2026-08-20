import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { crmRequirementsFromCalculatorInput } from "@/domain";
import {
  canCalculatePricing,
} from "@/services/pricing";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd } from "@/seo/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Software pricing",
  description:
    "Product pricing pages built from public list prices. Estimates are before tax; affiliate relationships do not change costs.",
  path: "/pricing/",
  indexable: true,
});

export default function PricingIndexPage() {
  const snapshots = listCrmPricingSnapshots().filter((snapshot) => {
    const eligibility = canCalculatePricing(snapshot, {
      requirements: crmRequirementsFromCalculatorInput({
        crmUsers: 5,
        requiredFeatureSlugs: [],
        billingPreference: "either",
      }),
    });
    return eligibility.status !== "INSUFFICIENT_DATA";
  });

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing/" },
  ];

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd(breadcrumbItems)} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHero
        title="Pricing"
        description="Product pricing pages use typed pricing rules from verified public sources. We never invent list prices."
      >
        <Link
          href="/tools/crm-cost-calculator/"
          className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-[var(--color-accent-fg)]"
        >
          CRM Cost Calculator
        </Link>
      </PageHero>

      {snapshots.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {snapshots.map((snapshot) => (
            <li
              key={snapshot.productSlug}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <Link
                  href={`/pricing/${snapshot.productSlug}/`}
                  className="text-sm font-medium underline-offset-2 hover:underline"
                >
                  {snapshot.name} pricing
                </Link>
                {snapshot.hasFixtureResearch ? (
                  <span className="text-xs text-[var(--color-fg-muted)]">
                    Fixture research · noindex
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[var(--color-accent)]">
                    Available
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Plans, example seat costs, and calculator handoff.
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
          No calculable product pricing pages yet. Products without verified
          plans stay off this list.
        </p>
      )}
    </>
  );
}
