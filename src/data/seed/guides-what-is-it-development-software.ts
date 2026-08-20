import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental IT & development guide — softwareglimpse-guide-template-v1.
 */
const whatIsItDevelopmentSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "IT and development software is several jobs — ITSM service desks, observability, incident/on-call, source control and DevOps, hosting panels, managed hosting providers, and web-data collection — not one undifferentiated “best IT tool” list. Decision rule: name the weekly ritual first; if it is employee incidents and changes, buy ITSM; if it is metrics, traces, and logs, buy observability (Sentry is an error-monitoring specialist inside that job, not a suite award); if it is paging a human, buy on-call; if it is managed WordPress or multi-cloud apps without a panel licence, buy a hosting provider — and never treat Jira Service Management as Jira Software, PagerDuty as Datadog, CircleCI as a git host, Splunk Observability Cloud as Splunk Platform SIEM, or WP Engine as Plesk.",
    bullets: [
      "ITSM / service desk",
      "Observability",
      "Incident / on-call",
      "Source control & DevOps",
      "Hosting panels vs providers",
      "Web-data collection",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "ITSM desks, observability platforms, on-call tools, git hosts, hosting panels, managed hosting providers, and proxy/web-data products fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "Identity mix-ups are expensive",
        body: "Jira Service Management is not Jira Software. PagerDuty is not Datadog. GitHub is not GitHub Copilot. WP Engine / Cloudways are not Plesk / cPanel. Rank each inside its own job.",
      },
      {
        label: "Pricing units are not interchangeable",
        body: "Per-agent ITSM, per-host and ingest-GB observability, DPS/commit, git seats, per-server panel licences, managed hosting plan floors, and proxy GB change TCO more than the starter tile.",
      },
      {
        label: "Specialists are not weaker suites",
        body: "PagerDuty, incident.io, FireHydrant and Rootly, Plesk / cPanel / DirectAdmin, Cloudways / WP Engine / Kinsta / SiteGround, Bright Data, Decodo (Smartproxy), Zyte and IPRoyal, Splunk Observability Cloud, Elastic Observability, Sentry (error-monitoring specialist — not the observability award), AppDynamics, Honeycomb, CircleCI and Buildkite (CI, not git hosts), Dynatrace, Azure DevOps, and SMB ITSM peers (ManageEngine ServiceDesk Plus, SysAid, HaloITSM) are cluster peers for their jobs — not Datadog or ServiceNow substitutes to rank on one list.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "it-building-blocks",
    title: "IT & development software building blocks",
    steps: [
      { id: "block-itsm", label: "ITSM", short: "Incidents & change" },
      { id: "block-obs", label: "Observe", short: "Metrics / traces / logs" },
      { id: "block-page", label: "Page", short: "On-call & incident" },
      { id: "block-git", label: "Git", short: "Source & CI/CD" },
      { id: "block-host", label: "Host", short: "Panels & providers" },
      { id: "block-data", label: "Collect", short: "Web data / proxy" },
    ],
    ctaHref: "/guides/how-to-choose-it-development-software/",
    ctaLabel: "How to choose IT & development software →",
    figure: {
      src: "/guides/what-is-it-development-software-building-blocks.png",
      alt: "Six IT and development software building blocks: ITSM, observability, on-call, git, hosting, and web data.",
      caption:
        "These blocks define the IT core. Buy for the block that is blocking first — specialists sit beside each other, not in one peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does IT & development software work?",
    body: "Most IT platforms specialise: ITSM desks turn employee requests into incidents, problems, and changes; observability products ingest metrics, traces, and logs; on-call tools page the right human; git hosts store code and run CI/CD; hosting panels licence servers; managed hosting providers run WordPress or multi-cloud apps without selling you a panel licence; web-data products sell proxy GB.\n\nExample: Harbor Ops, a 22-person platform team, starts with GitHub for source control, then adds Datadog when latency pages still lack a service map — without buying an ITSM suite they do not need yet.",
    tip: "Write the weekly ritual you need (“every employee ticket has an owner” or “every page reaches the on-call”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-it-development-software-loop.png",
      alt: "IT software loop across ITSM, observability, on-call, git, hosting, and web-data jobs.",
      caption:
        "Each loop is a different purchase. Jira Service Management is not Jira Software; PagerDuty is not Datadog.",
    },
    scenarios: [
      { title: "ITSM", body: "Employee incidents, problems, changes, and assets." },
      { title: "Observe", body: "Host metrics, traces, logs, and service maps." },
      { title: "Page", body: "Schedules, escalation, and war-room workflow." },
      { title: "Git", body: "Repos, pull requests, and CI/CD on git seats." },
      { title: "Host", body: "Per-server panel licences for web ops." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What IT & development software typically includes",
    body: "Depending on job cluster: ITIL incidents and CMDB; infrastructure, APM, and log ingest; on-call schedules and paging; git hosting and Actions or pipelines; Web Admin/Pro/Host panel SKUs; or PAYG/committed proxy tiers.\n\nJob clusters matter more than brand names: ServiceNow, Jira Service Management, and Freshservice are ITSM shapes; Datadog, Dynatrace, New Relic, and Grafana Cloud are observability shapes; PagerDuty is on-call; GitHub, GitLab, Bitbucket, and Azure DevOps are source-control shapes; Plesk and cPanel are hosting panels; Bright Data, Oxylabs, ScraperAPI, Apify, and ThorData are web-data collection shapes (proxy networks, managed scrape APIs, and Actor platforms — compare by primary job, not one undifferentiated list).",
    tip: "If a vendor markets “all-in-one IT,” check which hub is actually strong before you buy for a secondary job.",
  },
  {
    type: "crm-types",
    id: "it-shapes",
    title: "Common IT & development software shapes (not rankings)",
    types: [
      {
        id: "itsm-service-desk",
        title: "ITSM / service desk",
        bestFor: "IT teams running employee incidents, problems, changes, and assets.",
        avoidWhen: "Your primary job is observability telemetry or git hosting.",
      },
      {
        id: "observability-monitoring",
        title: "Observability / monitoring",
        bestFor: "Teams that need host metrics, traces, logs, and service maps.",
        avoidWhen: "You only need to page a human — that is an on-call purchase.",
      },
      {
        id: "incident-oncall",
        title: "Incident / on-call",
        bestFor: "Teams that need schedules, escalation, and incident response.",
        avoidWhen: "You are shopping Datadog as if it were PagerDuty.",
      },
      {
        id: "source-host-data",
        title: "Git, hosting, web data",
        bestFor: "Source control and CI/CD, per-server panels, or proxy/web-data collection.",
        avoidWhen: "You are shopping an undifferentiated “best IT tool” list against ServiceNow.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is Jira Service Management the same as Jira Software?",
        answer:
          "No. Jira Service Management is an ITSM / employee service-desk product. Jira Software is a project-management work tracker. Compare JSM to ServiceNow and Freshservice inside the ITSM cluster only.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. Suites help when you will use multiple hubs weekly; specialists win when one job dominates — paging, git, a hosting panel, or proxy GB.",
      },
      {
        question: "Where do ServiceNow, Datadog, Dynatrace, PagerDuty, GitHub, and Azure DevOps fit?",
        answer:
          "They are catalogue cluster leaders or peers for ITSM, observability, incident/on-call, and source control. Dynatrace is an observability peer of Datadog — not PagerDuty. Azure DevOps is a source-control peer of GitHub — not GitHub Copilot and not Jira Software. Compare inside those jobs — see Best IT & development software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/it-development-software/",
    ctaLabel: "See Best IT & Development Software →",
    variant: "finder",
  },
];

export const whatIsItDevelopmentSoftwareGuide: GuidePage = {
  id: "guide-what-is-it-development-software",
  slug: "what-is-it-development-software",
  title: "What Is IT & Development Software?",
  summary:
    "A clear definition of ITSM, observability, incident/on-call, source control, hosting panels, and web-data tools — and why they are not one ranking.",
  categorySlugs: ["it-development"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-it-development-software-hero.png",
    alt: "Educational SaaS mockup of IT software spanning ITSM, observability, on-call, and git jobs.",
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
  nextAction: {
    contentId: "content:guide:how-to-choose-it-development-software",
    label: "How to choose IT & development software",
  },
  relatedGuideSlugs: [
    "how-to-choose-it-development-software",
    "it-development-pricing-guide",
    "it-development-requirements-guide",
    "it-development-evaluation-guide",
  ],
  blocks: whatIsItDevelopmentSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description:
        "ITSM, observability, on-call, source control, hosting panel, or web data — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "IT agents, SREs, on-call responders, developers, or hosting operators.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description:
        "ITIL change, log ingest, paging, CI/CD, panel licences, or proxy GB — map to plan gates later.",
      order: 2,
    },
  ],
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
    title: "What Is IT & Development Software? | SoftwareGlimpse",
    description:
      "What is IT and development software? A clear definition of ITSM, observability, on-call, source control, hosting panels, managed hosting providers, and web-data tools — not one ranking.",
    canonicalPath: "/guides/what-is-it-development-software/",
    indexable: true,
  },
};
