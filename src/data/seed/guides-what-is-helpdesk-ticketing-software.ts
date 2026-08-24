import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier24GuideScheduledAt } from "@/data/config/publishing/tier-24-helpdesk-ticketing-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-helpdesk-ticketing-software";
const SCHEDULED_AT = tier24GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Helpdesk and ticketing software manages shared inboxes, ticket workflows, SLA routing, knowledge bases, and omnichannel agent workspaces. Decision rule: if the blocking job is mid-market Freshworks helpdesk at a similar $19/agent floor, shortlist Freshdesk-class tools; if it is enterprise omnichannel SLAs, shortlist Zendesk Suite; if it is Shopify order-native support, shortlist Gorgias; if it is email-first SMB shared inbox, shortlist Help Scout; if it is internal ITSM, shortlist Freshservice — never rank those helpdesk clusters as one undifferentiated list.",
    bullets: [
      "Ticket workflows and case management",
      "Shared team inbox",
      "SLA policies and routing",
      "Knowledge base and self-service",
      "Omnichannel agent workspace",
      "Not website live chat widgets or phone-only VoIP",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Helpdesk clusters differ",
        body: "SMB helpdesk, enterprise omnichannel, ecommerce helpdesk, and ITSM are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under CS",
        body: "Use the parent Customer Service Finder with helpdesk as the primary job to shortlist.",
      },
      {
        label: "Pricing units matter",
        body: "Per-agent seats vs ticket caps vs ITSM asset packs change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by helpdesk job cluster, then run the CS Finder with ticketing as the primary job.",
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

export const whatIsHelpdeskTicketingSoftwareGuide: GuidePage = {
  id: "guide-what-is-helpdesk-ticketing-software",
  slug: SLUG,
  title: "What Is Helpdesk & Ticketing Software?",
  summary:
    "Helpdesk and ticketing software for shared inboxes, SLA workflows, and knowledge bases — distinct from live chat widgets and phone-only support.",
  categorySlugs: ["helpdesk-ticketing", "customer-service"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:helpdesk-ticketing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-helpdesk-ticketing-software",
    "helpdesk-ticketing-pricing-guide",
    "helpdesk-ticketing-evaluation-guide",
    "what-is-customer-service-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Helpdesk & Ticketing Software? | SoftwareGlimpse",
    description:
      "Shared inbox, ticketing, SLA routing, and knowledge bases — how helpdesk software differs from live chat and ITSM.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
