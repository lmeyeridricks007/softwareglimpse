import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const itDevelopmentPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "IT and development software pricing is usually per agent, per host, per ingest GB, DPS/commit, per-user git seats, per-server panel licences, or proxy GB — plus modules. Decision rule: never compare the advertised starter tile; compare the total for your real agents, hosts, and GB on the configuration that unlocks your must-have ITSM, APM, paging, CI, or panel SKU.",
    bullets: [
      "Per-agent",
      "Per-host",
      "Ingest GB",
      "DPS / commit",
      "Git seats / panel licences",
      "Proxy GB",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "A cheap tile that blocks CMDB, APM, log retention, paging policies, or Web Host licences forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Units are not comparable on a tile alone",
        body: "Per-agent ITSM, per-host observability, ingest GB, git seats, and panel licences need a volume model for the same team.",
      },
      {
        label: "Modules stack on the core",
        body: "APM, logs, AIOps, and committed proxy GB can exceed the infrastructure floor. Treat modules as line items, not free checkboxes.",
      },
      {
        label: "ITSM floors are a different purchase",
        body: "Employee service-desk SKUs are not cheaper observability. Do not compare Freshservice tiles to Datadog host prices as peers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "agents", label: "Agents", short: "ITSM headcount" },
      { id: "hosts", label: "Hosts", short: "Infra floor" },
      { id: "gb", label: "GB", short: "Ingest / proxy" },
      { id: "seats", label: "Seats", short: "Git / DPS" },
      { id: "panels", label: "Panels", short: "Per-server SKUs" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/it-development-software/",
    ctaLabel: "See Best IT & Development Software →",
    figure: {
      src: "/guides/it-development-pricing-guide-stack.png",
      alt: "IT cost stack: per-agent, per-host, ingest GB, git seats, panel licences, and proxy GB.",
      caption:
        "The starter tile is the bottom layer. Hosts, GB, and modules often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: IT agents, hosts or containers, monthly ingest GB, git users, panel servers, and whether proxy GB or DPS/commit is in scope. Total the qualifying configuration.\n\nWorked example: Northline Platform needs 15 ITSM agents and ~80 hosts with 30-day log retention. Vendor A’s host tile looks cheaper until APM unlocks; Vendor B’s ITSM pack looks expensive until you include the observability bill they still need. The honest comparison is qualifying config × units, not the homepage tile.",
    tip: "Ask for a written quote on the qualifying configuration for your agents, hosts, GB, seats, and licences.",
    figure: {
      src: "/guides/it-development-pricing-guide-worked-example.png",
      alt: "Worked example comparing two IT quotes at the same host count with ingest and module effects.",
      caption:
        "Same team, same requirements — the cheaper tile is not always the cheaper deployment once hosts, GB, and modules apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does IT & development software cost?",
        answer:
          "Models vary: published per-agent ITSM, quote-led ServiceNow, per-host and ingest-GB observability, git seats, per-server panel licences, and committed proxy GB. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted but locks hosts and GB commits. If traffic spikes drive ingest, price both committed and on-demand overage.",
      },
      {
        question: "Do affiliate deals change our advice?",
        answer:
          "No. SoftwareGlimpse methodology excludes affiliate economics from rankings and pricing guidance.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/it-development-software/",
    ctaLabel: "Best IT & development software →",
    variant: "finder",
  },
];

export const itDevelopmentPricingGuide: GuidePage = {
  id: "guide-it-development-pricing-guide",
  slug: "it-development-pricing-guide",
  title: "IT & Development Software Pricing Guide",
  summary:
    "Budget ITSM, observability, on-call, source control, hosting panels, and web-data tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["it-development"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/it-development-pricing-guide-hero.png",
    alt: "Educational illustration for IT & Development Software Pricing Guide.",
  },
  supports: [
    {
      contentId: "content:category:it-development",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:it-development-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-it-development-software",
    "how-to-choose-it-development-software",
    "it-development-requirements-guide",
    "it-development-evaluation-guide",
  ],
  blocks: itDevelopmentPricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "IT & Development Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget IT and development software — per-agent, per-host, ingest GB, DPS/commit, git seats, panel licences, and proxy GB.",
    canonicalPath: "/guides/it-development-pricing-guide/",
    indexable: true,
  },
};
