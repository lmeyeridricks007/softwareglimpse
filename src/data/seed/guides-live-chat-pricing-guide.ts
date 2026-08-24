import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier23GuideScheduledAt } from "@/data/config/publishing/tier-23-live-chat-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "live-chat-pricing-guide";
const SCHEDULED_AT = tier23GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Live chat pricing mixes per-agent monthly plans, billable conversation packs, and outcome-priced AI resolutions. Freshchat is free up to 10 agents with Growth from $19/agent/mo annual; LiveChat Starter is $19 per person/mo annual; Tidio Starter is $24.17/mo annual for 100 billable conversations; Intercom Essential starts around $29/seat/mo plus Fin outcomes — confirm live terms. Compare pricing units and overage, not headline tiles alone.",
    bullets: [
      "Per-agent monthly vs conversation caps",
      "Free tiers and agent limits",
      "AI / bot add-on packaging",
      "Proactive chat tier gates",
      "Helpdesk integration costs",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your agent count and chat volume, then shortlist inside the messenger cluster.",
    href: "/best/live-chat-software/",
    ctaLabel: "Best live chat software →",
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

export const liveChatPricingGuide: GuidePage = {
  id: "guide-live-chat-pricing-guide",
  slug: SLUG,
  title: "Live Chat Pricing Guide",
  summary:
    "Per-agent seats, conversation packs, and AI outcome pricing for live chat platforms.",
  categorySlugs: ["live-chat", "customer-service"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:live-chat",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-live-chat-software",
    "how-to-choose-live-chat-software",
    "live-chat-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Live Chat Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-agent, conversation-cap, and AI outcome pricing for live chat software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
