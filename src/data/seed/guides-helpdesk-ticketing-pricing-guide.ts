import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier24GuideScheduledAt } from "@/data/config/publishing/tier-24-helpdesk-ticketing-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "helpdesk-ticketing-pricing-guide";
const SCHEDULED_AT = tier24GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Helpdesk pricing mixes per-agent monthly plans, ticket-volume caps, and ITSM asset packs. Freshdesk Growth starts at $19/agent/mo annual; Zendesk Suite Team is $55/agent/mo annual; Help Scout is free up to 5 users with Standard at $25/user/mo annual; Gorgias Starter is $40/mo for 50 tickets; Freshservice is ITSM-priced separately — confirm live terms. Compare pricing units and overage, not headline tiles alone.",
    bullets: [
      "Per-agent monthly vs ticket caps",
      "Free tiers and agent limits",
      "SLA / automation tier gates",
      "AI and deflection add-ons",
      "ITSM vs customer helpdesk SKUs",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your agent count and ticket volume, then shortlist inside the helpdesk cluster.",
    href: "/best/helpdesk-ticketing-software/",
    ctaLabel: "Best helpdesk & ticketing software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T20:00:00.000Z",
        publishedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const helpdeskTicketingPricingGuide: GuidePage = {
  id: "guide-helpdesk-ticketing-pricing-guide",
  slug: SLUG,
  title: "Helpdesk & Ticketing Pricing Guide",
  summary:
    "Per-agent seats, ticket caps, and ITSM packaging for helpdesk and ticketing platforms.",
  categorySlugs: ["helpdesk-ticketing", "customer-service"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:helpdesk-ticketing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-helpdesk-ticketing-software",
    "how-to-choose-helpdesk-ticketing-software",
    "helpdesk-ticketing-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Helpdesk & Ticketing Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-agent, ticket-cap, and ITSM pricing for helpdesk and ticketing software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
