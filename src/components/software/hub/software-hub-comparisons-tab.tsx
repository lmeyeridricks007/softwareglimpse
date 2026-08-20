import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareHubPopularComparisons } from "@/components/software/hub/software-product-hub-shell";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";

type Props = {
  model: SoftwareReviewModel;
};

export function SoftwareHubComparisonsTab({ model }: Props) {
  const software = model.software;
  const competitors = model.competitors;
  const deep = model.deepReview.competitorDeepDives;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            {software.name} vs top {model.primaryCategory?.name ?? "software"}
          </h2>
          <p className="mt-2 text-[var(--sg-color-text-muted)]">
            Detailed head-to-head comparisons to help you choose the right
            option.
          </p>
          {competitors.length === 0 ? (
            <Card className="mt-6 p-6 text-sm text-[var(--sg-color-text-muted)]">
              Comparison partners are not linked for {software.name} yet.
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {competitors.map((comp) => {
                const dive = deep.find((d) => d.competitorSlug === comp.slug);
                return (
                  <Card key={comp.slug} className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-2">
                      <ProductLogo
                        name={software.name}
                        logo={software.logo}
                        size="sm"
                      />
                      <span className="text-xs text-[var(--sg-color-text-muted)]">
                        vs
                      </span>
                      <ProductLogo
                        name={comp.name}
                        logo={comp.logo}
                        size="sm"
                      />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[var(--sg-color-text)]">
                      {software.name} vs {comp.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                      {dive?.summary ??
                        dive?.keyDifference ??
                        comp.shortDescription ??
                        `Compare ${software.name} and ${comp.name} across fit, pricing, and capabilities.`}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                      {(
                        dive?.chooseCurrentIf?.slice(0, 2) ?? [
                          "Features comparison",
                          "Pricing & plans",
                        ]
                      ).map((line) => (
                        <li key={line} className="flex gap-2">
                          <span
                            className="text-[var(--sg-color-success)]"
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                    {comp.compareHref || dive?.comparisonHref ? (
                      <Link
                        href={comp.compareHref ?? dive?.comparisonHref ?? "#"}
                        className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        View comparison →
                      </Link>
                    ) : (
                      <Link
                        href={comp.reviewHref}
                        className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        Read {comp.name} review →
                      </Link>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {model.pricingCompareColumns.length > 1 ? (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
                  Compare key capabilities side-by-side
                </h2>
                <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                  Verified pricing and capability signals only — no invented
                  third-party ratings.
                </p>
              </div>
            </div>
            <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--sg-color-surface-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium text-[var(--sg-color-text-muted)]">
                      Feature
                    </th>
                    {model.pricingCompareColumns.map((col) => (
                      <th
                        key={col.slug}
                        className="px-4 py-3 font-medium text-[var(--sg-color-text-muted)]"
                      >
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {model.pricingCompareRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-[var(--sg-color-border)]"
                    >
                      <th className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={`${row.label}-${i}`}
                          className="px-4 py-3 text-[var(--sg-color-text-muted)]"
                        >
                          {value ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {(deep.length > 0 || model.bestFor.length > 0) && (
          <section className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/40 p-5">
            <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Key takeaways
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Badge variant="success">{software.name}</Badge>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {model.bestForPrimary ??
                    model.bestFor[0] ??
                    "Strong when pipeline clarity is the primary buying criterion."}
                </p>
              </div>
              {deep.slice(0, 4).map((item) => (
                <div key={item.competitorSlug}>
                  <Badge variant="neutral">{item.competitorName}</Badge>
                  <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                    {item.chooseCompetitorIf[0] ?? item.keyDifference}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-5">
        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Why compare software?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              Clarify workflow fit before you buy
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              Spot pricing and plan tradeoffs early
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--sg-color-success)]">✓</span>
              Avoid feature checklists without context
            </li>
          </ul>
          <Link
            href={softwareHubPath(software.slug, "methodology")}
            className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            How we compare →
          </Link>
        </Card>
        {model.finderHref ? (
          <SoftwareHubFinderCta
            title="Not sure which option is right for you?"
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
        <SoftwareHubPopularComparisons items={model.comparisonLinks} />
        <ButtonLink href="/compare/" variant="outline" className="w-full">
          Open comparison builder
        </ButtonLink>
      </aside>
    </div>
  );
}
