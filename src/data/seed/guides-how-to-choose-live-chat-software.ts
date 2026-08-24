import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier23GuideScheduledAt } from "@/data/config/publishing/tier-23-live-chat-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-live-chat-software";
const SCHEDULED_AT = tier23GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose live chat software by the messenger job blocking work — per-agent website chat, conversation-cap AI deflection, or AI-first shared inbox — then confirm pricing unit (seats vs conversations vs outcomes), proactive trigger depth, bot/AI deflection, and helpdesk handoff integrations. Shortlist only tools whose core product is website messaging, not full helpdesk ticketing or ITSM.",
    bullets: [
      "Primary messenger job",
      "Per-agent vs conversation-cap pricing",
      "Proactive chat triggers",
      "Chatbot / AI deflection",
      "Helpdesk / CRM integrations",
      "Trial with one real visitor workflow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by messenger cluster, then confirm live commercial terms.",
    href: "/tools/customer-service-finder/",
    ctaLabel: "CS Finder (channel primary) →",
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

export const howToChooseLiveChatSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-live-chat-software",
  slug: SLUG,
  title: "How to Choose Live Chat Software",
  summary:
    "Pick live chat tools by messenger job cluster — website chat, deflection, or AI inbox — not as one generic list.",
  categorySlugs: ["live-chat", "customer-service"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:live-chat",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-live-chat-software",
    "live-chat-pricing-guide",
    "live-chat-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Live Chat Software | SoftwareGlimpse",
    description:
      "Choose live chat by messenger job, pricing unit, proactive triggers, and deflection depth.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
