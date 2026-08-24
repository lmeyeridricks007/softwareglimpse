import type { GuidePage } from "@/domain";
import { tier24GuideScheduledAt } from "@/data/config/publishing/tier-24-helpdesk-ticketing-launch-2027-07-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseHelpdeskTicketingSoftwareGuide } from "./guides-how-to-choose-helpdesk-ticketing-software";
import { helpdeskTicketingPricingGuide } from "./guides-helpdesk-ticketing-pricing-guide";
import { whatIsHelpdeskTicketingSoftwareGuide } from "./guides-what-is-helpdesk-ticketing-software";

function withTier24Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier24GuideScheduledAt(guide.slug);
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

/** Helpdesk & ticketing subcategory guides — July 2027 launch wave. */
export const helpdeskTicketingCategoryGuides: GuidePage[] = [
  whatIsHelpdeskTicketingSoftwareGuide,
  howToChooseHelpdeskTicketingSoftwareGuide,
  helpdeskTicketingPricingGuide,
  ...teachingExpansionFor("helpdesk-ticketing").map(withTier24Schedule),
];
