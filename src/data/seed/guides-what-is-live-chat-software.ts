import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier23GuideScheduledAt } from "@/data/config/publishing/tier-23-live-chat-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-live-chat-software";
const SCHEDULED_AT = tier23GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Live chat software embeds a messenger on your website or app, routes visitors to agents, runs proactive triggers, and deflects repeat questions with bots or AI agents. Decision rule: if the blocking job is Freshworks-aligned per-agent website chat with a free tier, shortlist Freshchat-class tools; if it is conversation-cap AI deflection, shortlist Tidio; if it is established per-seat website chat, shortlist LiveChat; if it is an AI-first shared inbox with Fin-style resolutions, shortlist Intercom — never rank those messenger clusters as one undifferentiated list.",
    bullets: [
      "Website / in-app messenger",
      "Proactive chat triggers",
      "Chatbot / AI deflection",
      "Agent routing and canned replies",
      "Helpdesk handoff integrations",
      "Not full helpdesk ticketing or ITSM",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Messenger clusters differ",
        body: "Per-agent chat, conversation-cap deflection, and AI inbox platforms are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under CS",
        body: "Use the parent Customer Service Finder with channel as the primary filter to shortlist.",
      },
      {
        label: "Pricing units matter",
        body: "Per-agent seats vs billable conversations vs outcome-priced AI change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by messenger job cluster, then run the CS Finder with live chat as the primary channel.",
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

export const whatIsLiveChatSoftwareGuide: GuidePage = {
  id: "guide-what-is-live-chat-software",
  slug: SLUG,
  title: "What Is Live Chat Software?",
  summary:
    "Live chat software for website messenger, proactive triggers, and chatbot deflection — distinct from full helpdesk ticketing.",
  categorySlugs: ["live-chat", "customer-service"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:live-chat",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-live-chat-software",
    "live-chat-pricing-guide",
    "live-chat-evaluation-guide",
    "what-is-customer-service-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Live Chat Software? | SoftwareGlimpse",
    description:
      "Website messenger, proactive chat, and chatbot deflection — how live chat differs from helpdesk ticketing.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
