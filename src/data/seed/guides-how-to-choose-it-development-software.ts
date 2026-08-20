import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseItDevelopmentSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose IT and development software by the job that is blocking work — ITSM, observability, incident/on-call, source control, hosting operations, or web-data collection — then confirm per-agent, per-host, ingest GB, DPS/commit, git seats, per-server panel licences, and proxy GB. Shortlist only tools whose core product is your job; Freshservice and Datadog are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Agents / hosts / GB / seats",
      "Must-have modules & gates",
      "Stack integrations",
      "Identity check (JSM ≠ Jira)",
      "Trial with one real workflow",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“IT software” is several products",
        body: "ITSM desks, observability platforms, on-call tools, git hosts, and hosting panels fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Agent vs host vs GB math changes cost",
        body: "Per-agent floors, per-host infrastructure, ingest GB, DPS/commit, git seats, and panel licences often decide TCO. Price the qualifying configuration.",
      },
      {
        label: "Identity mix-ups hide on marketing pages",
        body: "Jira Service Management is not Jira Software. PagerDuty is not Datadog. GitHub is not GitHub Copilot. Confirm which product you are actually buying.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best IT & development software for job-cluster editor’s picks.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Six worked examples",
    src: "/guides/how-to-choose-it-development-software-needs.png",
    alt: "Six worked examples of IT buying: ITSM, observability, on-call, source control, hosting panels, and web data.",
    caption:
      "Six teams, one category, six different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive IT & development selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "ITSM / service desk",
          "Observability / monitoring",
          "Incident / on-call",
          "Source control & DevOps",
          "Hosting panel / web data",
        ],
      },
      {
        id: "team-size",
        label: "People or hosts in scope",
        options: ["1–5 agents", "6–20", "21–75", "75+ / fleet"],
      },
      {
        id: "usage-unit",
        label: "Usage unit you will hit",
        options: ["Per-agent", "Per-host / ingest GB", "Git seats", "Panel licence / proxy GB"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["Atlassian", "Cloud / Kubernetes", "Git host", "Minimal integrations"],
      },
      {
        id: "budget-style",
        label: "Buying style",
        options: ["Published SKU", "Per-host / GB", "Quote-led ITSM", "Committed proxy / DPS"],
      },
    ],
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without spreadsheet archaeology.” If the blank is employee incidents and changes, you are in ITSM. If it is service maps and log search, you are in observability. If it is paging the on-call, buy PagerDuty-class tools. If it is repos and CI, buy source control.\n\nWorked example: Northline Platform wrote “every latency page includes a service map, not just a Slack ping.” That sentence ruled out on-call-only tools before demos started and pointed at Datadog, New Relic, or Grafana Cloud as observability peers.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan and usage gates",
    body: "List the workflows that must work on day one — CMDB, APM, log retention, paging policies, Actions minutes, Web Host licences, or committed proxy GB — and ask which plan, host pack, ingest GB, DPS/commit, git seat, or panel SKU unlocks them. Observability vendors need a host + GB model, not just an agent count.\n\nWorked example: Harbor Ops needed published SMB ITSM SKUs; a ServiceNow quote-only path failed that requirement, so Freshservice stayed on the ITSM sheet while Jira Service Management stayed the Atlassian-native peer — not Jira Software.",
    tip: "Ask for a written configuration quote — agents, hosts, ingest GB, DPS/commit, git seats, panel licences, proxy GB — before the demo ends.",
    figure: {
      src: "/guides/how-to-choose-it-development-software-framework.png",
      alt: "IT selection framework mapping job cluster to plan gates, usage units, and product identity.",
      caption: "Job first, then gates and units, then identity — brand comparisons come last.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy an all-in-one IT suite?",
        answer:
          "Only if you will use multiple hubs weekly. Otherwise a specialist ITSM desk, observability platform, on-call tool, git host, or hosting panel usually ships faster and clearer TCO.",
      },
      {
        question: "How do I treat PagerDuty on an IT shortlist?",
        answer:
          "As an incident/on-call product. It is not Datadog and it does not replace metrics, traces, or logs. Compare it inside the incident-oncall cluster.",
      },
      {
        question: "Where should I compare researched products?",
        answer:
          "See Best IT & development software for Wave-1 and Priority-2 editor’s picks by job cluster and disclosed methodology notes.",
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

export const howToChooseItDevelopmentSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-it-development-software",
  slug: "how-to-choose-it-development-software",
  title: "How to Choose IT & Development Software",
  summary:
    "A practical framework for shortlisting ITSM, observability, incident/on-call, source control, hosting panels, and web-data tools by job.",
  categorySlugs: ["it-development"],
  topicType: "buying-guide",
  journeyStage: "evaluate",
  heroVisual: {
    src: "/guides/how-to-choose-it-development-software-hero.png",
    alt: "Educational illustration for How to Choose IT & Development Software.",
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
  relatedGuideSlugs: [
    "what-is-it-development-software",
    "it-development-pricing-guide",
    "it-development-requirements-guide",
    "it-development-evaluation-guide",
  ],
  blocks: howToChooseItDevelopmentSoftwareBlocks as GuidePage["blocks"],
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
    title: "How to Choose IT & Development Software | SoftwareGlimpse",
    description:
      "How to choose IT and development software by job cluster — ITSM, observability, on-call, source control, hosting, and web data — with plan gates and product identity.",
    canonicalPath: "/guides/how-to-choose-it-development-software/",
    indexable: true,
  },
};
