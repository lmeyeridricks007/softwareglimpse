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
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";

type Props = {
  model: SoftwareReviewModel;
};

function pricingCompareValue(
  model: SoftwareReviewModel,
  label: string,
  productSlug: string,
): string | null {
  const row = model.pricingCompareRows.find((r) => r.label === label);
  if (!row) return null;
  const columns = [
    model.software.slug,
    ...model.competitors.slice(0, 4).map((c) => c.slug),
  ];
  const idx = columns.indexOf(productSlug);
  if (idx < 0) return null;
  return row.values[idx] ?? null;
}

export function SoftwareHubAlternativesTab({ model }: Props) {
  const software = model.software;
  const alternatives = software.alternativeSlugs
    .map((slug, index) => {
      const alt = getSoftwareBySlug(slug, { includeUnpublished: true });
      if (!alt) return null;
      const competitor = model.competitors.find((c) => c.slug === slug);
      const dive = model.deepReview.competitorDeepDives.find(
        (d) => d.competitorSlug === slug,
      );
      const price =
        pricingCompareValue(model, "Starting price", slug) ?? null;
      const freePlan =
        pricingCompareValue(model, "Free plan", slug) === "Yes";
      const freeTrial =
        pricingCompareValue(model, "Free trial", slug) === "Yes";
      return {
        rank: index + 1,
        slug,
        name: alt.name,
        logo: alt.logo,
        shortDescription:
          dive?.summary ??
          competitor?.shortDescription ??
          alt.shortDescription ??
          null,
        price,
        tag: dive?.chooseCompetitorIf[0] ?? null,
        compareHref: competitor?.compareHref ?? dive?.comparisonHref ?? null,
        reviewHref: `/software/${slug}/`,
        freeTrial,
        freePlan,
      };
    })
    .filter(Boolean) as Array<{
    rank: number;
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
    shortDescription: string | null;
    price: string | null;
    tag: string | null;
    compareHref: string | null;
    reviewHref: string;
    freeTrial: boolean;
    freePlan: boolean;
  }>;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
            Best {software.name} alternatives
          </h2>
          <p className="mt-2 text-[var(--sg-color-text-muted)]">
            Alternatives are drawn from the product graph and editorial
            comparisons — not paid placements.
          </p>

          {alternatives.length === 0 ? (
            <Card className="mt-6 p-6 text-sm text-[var(--sg-color-text-muted)]">
              Alternatives have not been linked for {software.name} yet.
            </Card>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {alternatives.map((alt) => (
                <Card key={alt.slug} className="relative flex h-full flex-col p-5">
                  <Badge
                    variant="success"
                    className="absolute -top-2 left-4 tabular-nums"
                  >
                    #{alt.rank}
                  </Badge>
                  <div className="mt-2 flex items-center gap-3">
                    <ProductLogo name={alt.name} logo={alt.logo} size="md" />
                    <h3 className="text-base font-semibold text-[var(--sg-color-text)]">
                      {alt.name}
                    </h3>
                  </div>
                  {alt.shortDescription ? (
                    <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                      {alt.shortDescription}
                    </p>
                  ) : null}
                  {alt.price ? (
                    <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
                      From {alt.price}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                      Pricing coverage pending
                    </p>
                  )}
                  {alt.tag ? (
                    <Badge variant="neutral" className="mt-3 w-fit">
                      {alt.tag}
                    </Badge>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    <Link
                      href={alt.reviewHref}
                      className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      View review →
                    </Link>
                    {alt.compareHref ? (
                      <Link
                        href={alt.compareHref}
                        className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        Compare →
                      </Link>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {alternatives.length > 0 ? (
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              Alternatives comparison at a glance
            </h2>
            <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Starting price</th>
                    <th className="px-4 py-3 font-medium">Free plan</th>
                    <th className="px-4 py-3 font-medium">Free trial</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[var(--sg-color-border)]">
                    <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                      {software.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                      {model.quickFacts.find((f) => f.label === "Starting price")
                        ?.value ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                      {model.pricing?.hasFreePlan ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                      {model.pricing?.hasFreeTrial ? "Yes" : "No"}
                    </td>
                  </tr>
                  {alternatives.map((alt) => (
                    <tr
                      key={alt.slug}
                      className="border-t border-[var(--sg-color-border)]"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                        {alt.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                        {alt.price ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                        {alt.freePlan ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-[var(--sg-color-text-muted)]">
                        {alt.freeTrial ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section className="rounded-[var(--sg-radius-lg)] bg-[var(--sg-color-primary-soft)]/40 p-6">
          <h2 className="text-base font-semibold text-[var(--sg-color-text)]">
            How we choose alternatives
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-medium text-[var(--sg-color-text)]">
                Based on our recommendations
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Alternatives come from product relationships and documented
                capability overlap.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--sg-color-text)]">
                Focused on your needs
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                We highlight when another tool fits a different workflow better.
              </p>
            </div>
            <div>
              <p className="font-medium text-[var(--sg-color-text)]">
                Independently evaluated
              </p>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Affiliate relationships never decide who appears here.
              </p>
            </div>
          </div>
          <ButtonLink
            href={softwareHubPath(software.slug, "methodology")}
            className="mt-5"
          >
            Learn about our methodology →
          </ButtonLink>
        </section>
      </div>

      <aside className="space-y-5">
        <SoftwareHubQuickFacts
          facts={model.quickFacts}
          productSlug={software.slug}
          productName={software.name}
        />
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
            Why consider an alternative?
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
            {model.notIdealFor.slice(0, 4).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--sg-color-success)]">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {model.alternativesHref ? (
            <Link
              href={model.alternativesHref}
              className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Full alternatives page →
            </Link>
          ) : null}
        </Card>
        {model.finderHref ? (
          <SoftwareHubFinderCta
            title={`Not sure which tool is right for you?`}
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}
        <SoftwareHubPopularComparisons items={model.comparisonLinks} />
      </aside>
    </div>
  );
}
