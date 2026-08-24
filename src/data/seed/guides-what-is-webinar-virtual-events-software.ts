import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier14GuideScheduledAt } from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-webinar-virtual-events-software";
const SCHEDULED_AT = tier14GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Webinar and virtual events software helps teams host live webinars, run multi-session virtual events, automate evergreen replays, and produce multi-camera live streams for demand gen and customer education — not generic MAP platforms or meetings-first UCaaS. Decision rule: if the blocking job is live + evergreen webinar automation, shortlist WebinarJam-class hosts; if it is browser-based virtual events, shortlist Livestorm-class platforms; if it is multi-camera production, shortlist Switcher Studio-class tools — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Live webinar hosting",
      "Evergreen / simulive automation",
      "Virtual event rooms",
      "Live stream production",
      "Registration & reminders",
      "Not a MAP / funnel suite",
      "Not meetings-only UCaaS",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Webinars are several purchases",
        body: "Hosts, event platforms, and production tools fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Distinct from generic marketing software",
        body: "MAP and funnel tools may integrate with webinars — but webinar execution is a different buyer job.",
      },
      {
        label: "Pricing units differ",
        body: "Per-host, per-attendee caps, and contact tiers change TCO more than the starter tile.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "wve-shapes",
    title: "Common webinar & virtual events shapes (not rankings)",
    types: [
      {
        id: "live-host",
        title: "Live webinar hosting",
        bestFor: "Registration pages, live rooms, polls, and follow-up.",
        avoidWhen: "Multi-session virtual events or multi-camera production is the primary job.",
      },
      {
        id: "evergreen",
        title: "Evergreen / simulive",
        bestFor: "Automated replays that mimic live sessions on a schedule.",
        avoidWhen: "You only run one-off live events with no replay automation.",
      },
      {
        id: "virtual-events",
        title: "Virtual events",
        bestFor: "Multi-session events, stages, and attendee networking.",
        avoidWhen: "You need a lightweight single-room webinar only.",
      },
      {
        id: "production",
        title: "Live stream production",
        bestFor: "Multi-camera switching, overlays, and multistream outputs.",
        avoidWhen: "Registration and attendee management is the blocking job.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary webinar job, then shortlist within that cluster.",
    href: "/best/webinar-virtual-events-software/",
    ctaLabel: "See Best Webinar & Virtual Events Software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T15:00:00.000Z",
        publishedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const whatIsWebinarVirtualEventsSoftwareGuide: GuidePage = {
  id: "guide-what-is-webinar-virtual-events-software",
  slug: SLUG,
  title: "What Is Webinar & Virtual Events Software?",
  summary:
    "A clear definition of live webinar hosts, virtual event platforms, evergreen automation, and live production tools — and how they differ from MAP and meetings UCaaS.",
  categorySlugs: ["webinar-virtual-events"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:webinar-virtual-events",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:webinar-virtual-events-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-webinar-virtual-events-software",
    label: "How to choose webinar software →",
  },
  relatedGuideSlugs: [
    "how-to-choose-webinar-virtual-events-software",
    "webinar-virtual-events-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Webinar & Virtual Events Software? | SoftwareGlimpse",
    description:
      "Definition of webinar hosting, virtual events, evergreen automation, and live production — distinct from MAP and meetings software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
