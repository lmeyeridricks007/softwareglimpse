import { SoftwareCta } from "@/components/affiliate/software-cta";
import { SoftwareEditorialScoreCard } from "@/components/software/software-editorial-score-card";
import { PageAffiliateDisclosure } from "@/components/site/page-affiliate-disclosure";
import { ProductHeroTourLink } from "@/components/software/product-see-in-action";
import {
  SoftwareProductHubClient,
  SoftwareHubTabLink,
  type SoftwareHubChrome,
} from "@/components/software/hub/software-product-hub-client";
import { SoftwareHubOverviewTab } from "@/components/software/hub/software-hub-overview-tab";
import { SoftwareHubFeaturesTab } from "@/components/software/hub/software-hub-features-tab";
import { SoftwareHubPricingTab } from "@/components/software/hub/software-hub-pricing-tab";
import { SoftwareHubGuidesTab } from "@/components/software/hub/software-hub-guides-tab";
import { SoftwareHubUseCasesTab } from "@/components/software/hub/software-hub-use-cases-tab";
import { SoftwareHubComparisonsTab } from "@/components/software/hub/software-hub-comparisons-tab";
import { SoftwareHubAlternativesTab } from "@/components/software/hub/software-hub-alternatives-tab";
import { SoftwareHubEvidenceTab } from "@/components/software/hub/software-hub-evidence-tab";
import { SoftwareHubMethodologyTab } from "@/components/software/hub/software-hub-methodology-tab";
import { SoftwareHubFaqTab } from "@/components/software/hub/software-hub-faq-tab";
import type { ResolvedAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import type { SoftwareReviewModel } from "@/services/software-review";
import {
  softwareHubPath,
  type SoftwareHubTabId,
} from "@/services/software-review/hub-tabs";
import type { ReactNode } from "react";

type Props = {
  model: SoftwareReviewModel;
  initialTab: SoftwareHubTabId;
  affiliateLink: ResolvedAffiliateLink | null;
  showHeaderCta: boolean;
  previewEnabled?: boolean;
  researchIncomplete?: boolean;
};

function renderTabPanel(
  tab: SoftwareHubTabId,
  model: SoftwareReviewModel,
  affiliateLink: ResolvedAffiliateLink | null,
  showHeaderCta: boolean,
): ReactNode {
  switch (tab) {
    case "overview":
      return (
        <SoftwareHubOverviewTab
          model={model}
          affiliateLink={affiliateLink}
          showHeaderCta={showHeaderCta}
        />
      );
    case "features":
      return <SoftwareHubFeaturesTab model={model} />;
    case "pricing":
      return (
        <SoftwareHubPricingTab model={model} affiliateLink={affiliateLink} />
      );
    case "guides":
      return <SoftwareHubGuidesTab model={model} />;
    case "use-cases":
      return <SoftwareHubUseCasesTab model={model} />;
    case "comparisons":
      return <SoftwareHubComparisonsTab model={model} />;
    case "alternatives":
      return <SoftwareHubAlternativesTab model={model} />;
    case "evidence":
      return <SoftwareHubEvidenceTab model={model} />;
    case "methodology":
      return <SoftwareHubMethodologyTab model={model} />;
    case "faq":
      return <SoftwareHubFaqTab model={model} />;
    default:
      return null;
  }
}

function chromeFromModel(model: SoftwareReviewModel): SoftwareHubChrome {
  return {
    software: {
      slug: model.software.slug,
      name: model.software.name,
      logo: model.software.logo ?? null,
    },
    tagline: model.tagline,
    categoryBadge: model.categoryBadge,
    primaryCategory: model.primaryCategory
      ? {
          name: model.primaryCategory.name,
          path: model.primaryCategory.path,
        }
      : null,
    lastUpdated: model.lastUpdated,
    scoresApproved: model.scoresApproved,
    heroFacts: model.heroFacts,
  };
}

/**
 * Server composer for the product hub — builds only the active tab panel so
 * unused tab trees stay out of the RSC payload. Tab switches navigate to the
 * dedicated `/software/[slug]/[tab]/` route.
 */
export function SoftwareProductHub({
  model,
  initialTab,
  affiliateLink,
  showHeaderCta,
  previewEnabled = false,
  researchIncomplete = false,
}: Props) {
  const software = model.software;

  const showScoreAside =
    model.scoresApproved ||
    model.pendingCriteriaNames.length > 0 ||
    model.criteria.some((c) => c.showScore && c.score != null);

  const heroAside = showScoreAside ? (
    <SoftwareEditorialScoreCard
      approved={model.scoresApproved}
      score={model.overallScore ?? undefined}
      criteria={model.criteria
        .filter((c) => c.showScore && c.score != null)
        .map((c) => ({
          criterionSlug: c.criterionSlug,
          name: c.name,
          score: c.score!,
        }))}
      pendingCriteriaNames={model.pendingCriteriaNames}
      methodologyHref={softwareHubPath(software.slug, "methodology")}
    />
  ) : null;

  const heroActions = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {showHeaderCta ? (
          <SoftwareCta
            productId={software.slug}
            context="software-review"
            intent="VISIT"
            variant="button"
            showDisclosure={false}
            label={`Visit ${software.name}`}
            className="[&_a]:h-11 [&_a]:px-5 [&_a]:text-base"
          />
        ) : null}
        {model.pricing ? (
          <SoftwareHubTabLink
            tab="pricing"
            className="inline-flex h-11 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 text-base font-medium text-[var(--sg-color-text)] transition-colors hover:border-[var(--sg-color-border-strong)]"
          >
            View pricing
          </SoftwareHubTabLink>
        ) : null}
        {initialTab === "overview" ? (
          <ProductHeroTourLink
            productName={software.name}
            video={model.overviewVideos[0] ?? null}
          />
        ) : null}
      </div>
      {affiliateLink?.disclosureRequired ? (
        <PageAffiliateDisclosure className="max-w-xl text-xs text-[var(--sg-color-text-muted)]" />
      ) : null}
    </div>
  );

  const panels: Partial<Record<SoftwareHubTabId, ReactNode>> = {
    [initialTab]: renderTabPanel(
      initialTab,
      model,
      affiliateLink,
      showHeaderCta,
    ),
  };

  return (
    <SoftwareProductHubClient
      chrome={chromeFromModel(model)}
      initialTab={initialTab}
      panels={panels}
      heroAside={heroAside}
      heroActions={heroActions}
      previewEnabled={previewEnabled}
      researchIncomplete={researchIncomplete}
    />
  );
}
