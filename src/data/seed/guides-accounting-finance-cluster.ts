import type { GuidePage } from "@/domain";
import { tier3GuideScheduledAt } from "@/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { accountingFinancePricingGuide } from "./guides-accounting-finance-pricing-guide";
import { howToChooseAccountingFinanceSoftwareGuide } from "./guides-how-to-choose-accounting-finance-software";
import { whatIsAccountingFinanceSoftwareGuide } from "./guides-what-is-accounting-finance-software";

function withTier3Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier3GuideScheduledAt(guide.slug);
  if (!scheduledAt) return guide;
  return {
    ...guide,
    metadata: {
      ...guide.metadata,
      status: "scheduled",
      scheduledAt,
    },
    seo: {
      ...guide.seo,
      indexable: false,
    },
  };
}

/** Accounting & finance category educational guides — September 2026 launch wave. */
export const accountingFinanceCategoryGuides: GuidePage[] = [
  whatIsAccountingFinanceSoftwareGuide,
  howToChooseAccountingFinanceSoftwareGuide,
  accountingFinancePricingGuide,
  ...teachingExpansionFor("accounting-finance").map(withTier3Schedule),
];
