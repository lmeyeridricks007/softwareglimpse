import type { Metadata } from "next";
import Link from "next/link";
import { getSoftwareBySlug } from "@/data";
import {
  getCrmPricingHistory,
} from "@/data/research/pricing-history";
import {
  analyzeCategoryPriceChanges,
  listCrmStartingPriceHistory,
} from "@/services/pricing-history";
import { Section } from "@/components/layout/section";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, webPageJsonLd } from "@/seo/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "CRM Starting Price History",
  description:
    "Verified time-series of CRM starting list prices from vendor research — a linkable dataset SoftwareGlimpse updates when pricing is re-verified.",
  path: "/research/crm-pricing-history/",
  indexable: true,
  pageType: "resource",
});

export default function CrmPricingHistoryPage() {
  const dataset = getCrmPricingHistory();
  const snapshots = listCrmStartingPriceHistory();
  const changes = analyzeCategoryPriceChanges("crm");

  return (
    <>
      <JsonLdScript
        data={webPageJsonLd({
          name: "CRM starting price history",
          description: dataset.description,
          path: "/research/crm-pricing-history/",
          dateModified: snapshots[0]?.observedAt ?? undefined,
        })}
      />

      <Section padding="md" background="surface" container="narrow">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Research dataset
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--sg-color-navy)]">
          CRM starting price history
        </h1>
        <p className="mt-4 text-[var(--sg-color-text-muted)]">
          {dataset.description} {dataset.methodology}
        </p>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Machine-readable index:{" "}
          <Link href="/llms.txt" className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
            llms.txt
          </Link>
          . This dataset is collecting — new rows append on pricing re-verification, not retroactive guesses.
        </p>

        <div className="mt-8 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--sg-color-surface-tint)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Observed</th>
                <th className="px-4 py-3">Starting price</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((row, idx) => {
                const product = getSoftwareBySlug(row.productSlug);
                return (
                  <tr
                    key={`${row.productSlug}-${row.observedAt}-${row.startingPriceMonthly}-${idx}`}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <td className="px-4 py-3 font-medium">
                      {product ? (
                        <Link
                          href={`/software/${row.productSlug}/`}
                          className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          {product.name}
                        </Link>
                      ) : (
                        row.productSlug
                      )}
                    </td>
                    <td className="px-4 py-3">{row.observedAt}</td>
                    <td className="px-4 py-3">
                      {row.startingPriceMonthly == null
                        ? "—"
                        : row.startingPriceMonthly === 0
                          ? `${row.currency} 0 (free tier)`
                          : `${row.currency} ${row.startingPriceMonthly}/mo`}
                    </td>
                    <td className="px-4 py-3">{row.planName ?? "—"}</td>
                    <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                      {row.billingNotes ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {changes.sampleProductsWithHistory > 0 ? (
          <div className="mt-8 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
              Observed starting-price changes
            </h2>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              Calculated only from products with ≥2 starting-price observations
              (n={changes.sampleProductsWithHistory}). Increases:{" "}
              {changes.increases.length}. Decreases: {changes.decreases.length}.
              Same-price re-observations: {changes.unchangedReobservations}.
            </p>
            {changes.increases.length + changes.decreases.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                No material starting-price changes in the observation store yet.
                Category inflation and AI-premium deltas require more dated
                re-verifies — we do not invent them.
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {[...changes.increases, ...changes.decreases].map((c) => (
                  <li key={`${c.productId}-${c.changeDate}`}>
                    <Link
                      href={`/software/${c.productId}/`}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {c.productId}
                    </Link>
                    : {c.previousPrice} → {c.newPrice}{" "}
                    {c.currency} (
                    {c.percentageChange == null
                      ? "—"
                      : `${c.percentageChange > 0 ? "+" : ""}${c.percentageChange.toFixed(1)}%`}
                    ) on {c.changeDate}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <p className="mt-6 text-sm text-[var(--sg-color-text-muted)]">
          For catalog-wide medians and free-plan share, see{" "}
          <Link
            href="/research/crm-pricing/"
            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            CRM Pricing Benchmarks 2026
          </Link>
          . Compare live totals with the{" "}
          <Link href="/tools/crm-cost-calculator/" className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
            CRM Cost Calculator
          </Link>{" "}
          and product pricing pages. HubSpot $15 and Salesforce $25 rows stay{" "}
          <span className="font-medium text-[var(--sg-color-text)]">verify-live</span>{" "}
          until vendor HTML is re-confirmed. More datasets:{" "}
          <Link href="/research/" className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
            /research/
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
