import { SoftwarePromotionBanner } from "@/components/affiliate/software-promotion";
import { EditorialDisclosures } from "@/components/editorial";
import { GuideCover } from "@/components/guides/hub/guide-illustrations";
import { AuthorshipByline } from "@/components/site/authorship-byline";
import { getFounderAuthor } from "@/services/site-foundation";
import {
  ProductScreenshotGallery,
  ProductTeachingDiagramGallery,
} from "@/components/software/product-screenshot-gallery";
import {
  ProductMediaStrip,
  ProductSeeInAction,
} from "@/components/software/product-see-in-action";
import { partitionProductVisuals } from "@/services/product-media/screenshot-kind";
import { SoftwareProsCons } from "@/components/software/software-pros-cons";
import { SoftwarePricingCards } from "@/components/software/software-pricing-cards";
import { SoftwarePricingCompare } from "@/components/software/software-pricing-compare";
import { SoftwareUseCaseCards } from "@/components/software/software-use-case-cards";
import { SoftwareTeamCostEstimator } from "@/components/software/software-team-cost-estimator";
import { SoftwareReviewVerdict } from "@/components/software/software-review-verdict";
import {
  SoftwareHubFinderCta,
  SoftwareHubQuickFacts,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareHubPopularComparisons } from "@/components/software/hub/software-product-hub-shell";
import { SoftwareHubTabLink } from "@/components/software/hub/software-product-hub-client";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import type { ResolvedAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import type { CurrencyCode } from "@/domain";

type Props = {
  model: SoftwareReviewModel;
  affiliateLink: ResolvedAffiliateLink | null;
  showHeaderCta: boolean;
};

/**
 * Overview = mockup summary layer only.
 * Deep feature/pricing/evidence content lives on dedicated hub tabs.
 */
export function SoftwareHubOverviewTab({
  model,
  affiliateLink,
}: Props) {
  const software = model.software;
  const currency = (model.pricing?.currency ?? "USD") as CurrencyCode;
  const { vendorUi, diagrams } = partitionProductVisuals(model.screenshots);

  const teamCostPlans =
    model.pricing?.plans.map((plan) => {
      const seat = plan.rules.find((r) => r.kind === "per-seat");
      return {
        slug: plan.slug,
        name: plan.name,
        amountPerSeatMonthly:
          seat && seat.kind === "per-seat" ? seat.amountPerSeat : null,
        contactSales: plan.contactSales,
      };
    }) ?? [];

  return (
    <>
      {(model.assessment || model.review) && (
        <div>
          <AuthorshipByline
            author={getFounderAuthor()}
            lastReviewed={model.lastUpdated ?? undefined}
          />
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-12">
          <ProductMediaStrip
            productName={software.name}
            overviewVideo={model.overviewVideos[0] ?? null}
            featureVideos={model.featureVideos}
            screenshotCount={vendorUi.length}
            docsHref={null}
          />

          <ProductSeeInAction
            productName={software.name}
            video={model.overviewVideos[0] ?? null}
          />

          {model.pricing ? (
            <div>
              <SoftwarePricingCards
                pricing={model.pricing}
                productName={software.name}
                affiliateLink={affiliateLink}
                pricingPageHref={softwareHubPath(software.slug, "pricing")}
                intro={
                  <span className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      {model.pricingNotes ??
                        `List rates verified from first-party sources for ${software.name}.`}
                    </span>
                    <SoftwareHubTabLink
                      tab="pricing"
                      className="shrink-0 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      Full pricing details →
                    </SoftwareHubTabLink>
                  </span>
                }
              />
            </div>
          ) : null}

          <ProductScreenshotGallery
            productName={software.name}
            screenshots={vendorUi}
          />

          <ProductTeachingDiagramGallery
            productName={software.name}
            diagrams={diagrams}
          />

          <SoftwareReviewVerdict
            productName={software.name}
            verdict={model.verdict ?? undefined}
            bottomLine={model.bottomLine ?? undefined}
            bestFor={model.bestFor}
            notIdealFor={model.notIdealFor}
            provisional={!model.scoresApproved && Boolean(model.assessment)}
          />

          <SoftwareProsCons
            name={software.name}
            pros={model.pros}
            cons={model.cons}
          />

          {model.pricingCompareColumns.length > 1 &&
          model.pricingCompareRows.length > 0 ? (
            <div>
              <SoftwarePricingCompare
                columns={model.pricingCompareColumns.map((col) => ({
                  name: col.name,
                  isSubject: col.isSubject,
                }))}
                rows={model.pricingCompareRows}
                compareHref={softwareHubPath(software.slug, "comparisons")}
              />
              <div className="mt-4">
                <SoftwareHubTabLink
                  tab="comparisons"
                  className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium"
                >
                  Open full comparisons →
                </SoftwareHubTabLink>
              </div>
            </div>
          ) : null}

          {model.useCases.length > 0 ? (
            <div>
              <SoftwareUseCaseCards
                productName={software.name}
                items={model.useCases.slice(0, 6)}
                notBestIf={model.notBestIf.slice(0, 4)}
              />
              <div className="mt-4">
                <SoftwareHubTabLink
                  tab="use-cases"
                  className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium"
                >
                  Explore all use cases →
                </SoftwareHubTabLink>
              </div>
            </div>
          ) : null}

          {model.guides.filter((g) => g.href.startsWith("/guides/")).length >
          0 ? (
            <section
              aria-labelledby="product-guides-heading"
              className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
            >
              <h2
                id="product-guides-heading"
                className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
              >
                {software.name} guides
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Setup, implementation, migration, plans, and worth-it walkthroughs
                for this product.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {model.guides
                  .filter((g) => g.href.startsWith("/guides/"))
                  .slice(0, 4)
                  .map((guide) => (
                    <li key={guide.href}>
                      <a
                        href={guide.href}
                        className="group flex h-full overflow-hidden rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] transition hover:border-[var(--sg-color-primary)]/40"
                      >
                        <div className="w-[5.5rem] shrink-0 self-stretch sm:w-24">
                          <GuideCover
                            image={guide.image}
                            topicType={guide.topicType}
                            className="h-full min-h-[4.5rem] rounded-none border-0"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5">
                          <p className="line-clamp-2 text-sm font-medium text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                            {guide.title}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
              </ul>
              <div className="mt-4">
                <SoftwareHubTabLink
                  tab="guides"
                  className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 text-sm font-medium"
                >
                  Browse all {software.name} guides →
                </SoftwareHubTabLink>
              </div>
            </section>
          ) : null}

          <EditorialDisclosures
            showAffiliate={Boolean(affiliateLink?.disclosureRequired)}
            methodologyVersion={model.research.methodologyVersion ?? undefined}
            fixtureBased={false}
            aiUsed={Boolean(model.assessment || model.review)}
          />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <SoftwareHubQuickFacts
            facts={model.quickFacts}
            productSlug={software.slug}
            productName={software.name}
          />

          {model.finderHref ? (
            <SoftwareHubFinderCta
              title={`Not sure if ${software.name} fits?`}
              description={`Answer a few questions and we will compare ${software.name} against other options.`}
              href={model.finderHref}
              ctaLabel={model.finderLabel}
            />
          ) : null}

          {teamCostPlans.length > 0 ? (
            <SoftwareTeamCostEstimator
              productName={software.name}
              plans={teamCostPlans}
              calculatorHref={
                model.costCalculatorHref ??
                softwareHubPath(software.slug, "pricing")
              }
              currency={currency}
            />
          ) : null}

          <SoftwareHubPopularComparisons items={model.comparisonLinks} />

          <SoftwarePromotionBanner
            productId={software.slug}
            context="software-review"
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-gradient-to-br from-[var(--sg-color-success-soft)] to-[var(--sg-color-primary-soft)] p-5 shadow-[var(--sg-shadow-sm)]"
          />
        </aside>
      </div>
    </>
  );
}
