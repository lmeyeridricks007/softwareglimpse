import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental marketing & growth guide — softwareglimpse-guide-template-v1.
 */
const whatIsMarketingSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Marketing software is several jobs — social publishing, landing pages and funnels, marketing automation / MAP, social listening, webinars, and specialist attribution or QR tooling — not one undifferentiated “best marketing stack.” Decision rule: name the weekly output first; if it is scheduled posts, buy a scheduler; if it is a funnel with checkout, buy a funnel builder; if it is lifecycle journeys across email/SMS/push, buy MAP-class automation; if it is media intelligence, buy listening — and treat email marketing ESPs as a related child category, not as social or funnel peers.",
    bullets: [
      "Social scheduling",
      "Funnels / landing pages",
      "MAP / automation",
      "Social listening / PR intel",
      "Webinars / live video",
      "Not one ranked list",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Schedulers, funnel builders, MAP platforms, listening suites, and webinar tools fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "Email marketing is a sibling, not a substitute",
        body: "ESPs send permission-based campaigns. MAP and funnel tools may include email, but Klaviyo-class ESPs belong on email-marketing pages — not as Hootsuite or ClickFunnels peers.",
      },
      {
        label: "Listening is not publishing",
        body: "Brand24, Meltwater, and Brandwatch monitor mentions and media. Buffer and Hootsuite publish. Do not rank them as if they were the same product.",
      },
      {
        label: "Specialists are not weaker suites",
        body: "Livestorm, WhatConverts, Uniqode, and Switcher Studio are cluster peers for webinars, call tracking, QR, and live video — not incomplete Marketo substitutes.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "mkt-building-blocks",
    title: "Marketing software building blocks",
    steps: [
      { id: "block-publish", label: "Publish", short: "Social scheduling" },
      { id: "block-capture", label: "Capture", short: "Pages & funnels" },
      { id: "block-journey", label: "Journey", short: "MAP / automation" },
      { id: "block-listen", label: "Listen", short: "Mentions & media" },
      { id: "block-event", label: "Event", short: "Webinars / live" },
      { id: "block-measure", label: "Measure", short: "Attribution / QR" },
    ],
    ctaHref: "/guides/how-to-choose-marketing-software/",
    ctaLabel: "How to choose marketing software →",
    figure: {
      src: "/guides/what-is-marketing-software-building-blocks.png",
      alt: "Six marketing software building blocks: publish, capture, journey, listen, event, and measure.",
      caption:
        "These blocks define the marketing core. Buy for the block that is blocking first — specialists sit beside each other, not in one peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does marketing software work?",
    body: "Most marketing platforms specialise: schedulers queue and report posts; funnel builders host pages, checkouts, and sequences; MAP tools run multi-step journeys from a person or account record; listening tools ingest mentions and media; webinar products run registration-to-replay; attribution and QR tools connect ads or print to leads.\n\nExample: Harbor Creative, an 11-person DTC brand, starts with Buffer for three social channels, then adds Leadpages when the weekly job is a campaign landing page — without buying Meltwater they do not need yet.",
    tip: "Write the weekly outcome you need (“every campaign has a live page” or “every brand mention is triaged by Friday”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-marketing-software-loop.png",
      alt: "Marketing software loop across publish, capture, journey, listen, events, and measurement.",
      caption:
        "Each loop is a different purchase. Your ESP still owns permission-based email; your CRM still owns pipeline.",
    },
    scenarios: [
      { title: "Publish", body: "Posts go out on a calendar with channel-level reporting." },
      { title: "Capture", body: "A landing page or funnel collects the week’s campaign leads." },
      { title: "Journey", body: "Behavioural steps run without rebuilding the same nurture in a spreadsheet." },
      { title: "Listen", body: "Mentions and coverage land in one inbox with owners." },
      { title: "Event", body: "Registration, live session, and replay sit in one workflow." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What marketing software typically includes",
    body: "Depending on job cluster: content calendars and inbox replies; landing pages, checkouts, and memberships; journey canvases and lead scoring; mention streams and media databases; webinar rooms and email reminders; call tracking or QR codes.\n\nJob clusters matter more than brand names: social suites, funnel builders, MAP platforms, listening, and event tools rarely belong on the same undifferentiated shortlist. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets “all-in-one marketing,” check whether listening, webinars, or MAP depth are actually on the plan you will buy.",
  },
  {
    type: "crm-types",
    id: "mkt-shapes",
    title: "Common marketing software shapes (not rankings)",
    types: [
      {
        id: "scheduler",
        title: "Social scheduling",
        bestFor: "Teams that need calendars, approvals, and channel analytics without buying a listening suite.",
        avoidWhen: "The blocking job is media intelligence or a paid-ads command centre.",
      },
      {
        id: "funnel",
        title: "Funnels and landing pages",
        bestFor: "Campaign teams that need pages, forms, and checkout or membership flows in one builder.",
        avoidWhen: "You only need a scheduler, or you already own a full MAP and only need an ESP.",
      },
      {
        id: "map",
        title: "MAP / marketing automation",
        bestFor: "Lifecycle teams running multi-step journeys, scoring, and CRM sync at mid-market or enterprise scale.",
        avoidWhen: "You need a simple newsletter ESP or a three-page funnel with no person model.",
      },
      {
        id: "listening",
        title: "Social listening / media intelligence",
        bestFor: "PR and brand teams who need mentions, coverage, and alerts — not a publisher.",
        avoidWhen: "The only job is scheduling posts this week.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is marketing software the same as email marketing?",
        answer:
          "No. Email marketing (ESP) is a child category for permission-based campaigns. Marketing software here covers social, funnels, MAP, listening, and events. Compare ESPs on email-marketing pages.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. Suites help when several blocks must live together; specialists win when publishing, listening, or webinars is the only gap.",
      },
      {
        question: "Where do Buffer, ClickFunnels, Marketo, and Brand24 fit?",
        answer:
          "They are cluster examples for scheduling, funnels, MAP, and listening. Compare inside those jobs — see Best marketing software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/marketing-software/",
    ctaLabel: "See Best Marketing Software →",
    variant: "finder",
  },
];

export const whatIsMarketingSoftwareGuide: GuidePage = {
  id: "guide-what-is-marketing-software",
  slug: "what-is-marketing-software",
  title: "What Is Marketing Software?",
  summary:
    "A clear definition of social scheduling, funnels, MAP automation, listening, and webinars — and how they differ from email marketing ESPs.",
  categorySlugs: ["marketing"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-marketing-software-hero.png",
    alt: "Educational SaaS mockup of marketing software spanning calendars, funnels, journeys, and listening.",
  },
  supports: [
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-marketing-software",
    label: "How to choose marketing software",
  },
  relatedGuideSlugs: [
    "how-to-choose-marketing-software",
    "marketing-software-pricing-guide",
    "marketing-software-requirements-guide",
  ],
  blocks: whatIsMarketingSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Schedule, funnel, MAP, listen, webinar, or attribution — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "Social manager, demand gen, PR, or events.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description: "Approvals, checkout, journeys, mention alerts — map to plan gates later.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T12:00:00.000Z",
    publishedAt: "2026-08-18T12:00:00.000Z",
    reviewedAt: "2026-08-18T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "What Is Marketing Software? | SoftwareGlimpse",
    description:
      "What marketing software is — social scheduling, funnels, MAP, listening, and webinars — and how to pick the right job first.",
    canonicalPath: "/guides/what-is-marketing-software/",
    indexable: true,
  },
};
