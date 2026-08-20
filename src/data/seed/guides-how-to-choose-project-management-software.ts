import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseProjectManagementBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose project management software by the job that is blocking work — work OS / project tracking, PowerPoint timeline slides, PDF editing, remote support, or a desktop app workspace — then confirm seats, plan gates for boards/timelines/automations, and the integrations your team opens daily. Shortlist only tools whose core product is your job; a Gantt slide tool and a work OS are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Seats vs plan minimums",
      "Must-have views & gates",
      "Automation intensity",
      "Native stack integrations",
      "Trial with one real workflow",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Project management” is several products",
        body: "Work OS, timeline presenters, PDF editors, remote desktop, and desktop shells fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Plan gates change the real cost",
        body: "Timeline, workload, and automation depth often unlock above entry tiers. Price the qualifying plan, not the starter tile.",
      },
      {
        label: "Integrations beat feature lists",
        body: "Native Slack, Microsoft 365, Google, and CRM connectors save more time than a long Zapier directory.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best project management software for job-cluster awards.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Five worked examples",
    src: "/guides/how-to-choose-project-management-software-needs.png",
    alt: "Five worked examples of project management buying: work OS, collaborative hub, PowerPoint Gantt, PDF editing, and remote desktop.",
    caption: "Five teams, one category, five different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive project management selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Work OS / work management",
          "Project & task tracking",
          "Timeline / Gantt slides",
          "PDF / document productivity",
          "Remote support access",
          "Desktop app workspace",
        ],
      },
      {
        id: "team-size",
        label: "Users needing a seat",
        options: ["1–5", "6–20", "21–100", "100+"],
      },
      {
        id: "planning",
        label: "Planning depth",
        options: ["Simple task lists", "Boards + owners", "Timelines & dependencies", "Portfolio / workload"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["Slack / Teams", "Microsoft 365 / Google", "CRM", "Minimal integrations"],
      },
      {
        id: "automation",
        label: "Automation need",
        options: ["Light reminders", "Status handoffs", "Multi-step workflows", "Not needed"],
      },
    ],
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without Slack archaeology.” If the blank is about shared ownership and status, you are in the work OS cluster. If it is about executive slides, PDFs, remote sessions, or desktop shells, shortlist a specialist.\n\nWorked example: Harbor Studio’s blank was “every deliverable has an owner and a next date the account lead trusts.” That sentence ruled out PowerPoint-only tools before demos started.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-have views to plan gates",
    body: "List boards, timelines, workload, dashboards, and automations you need on day one. Ask each vendor which plan unlocks each item and whether automation actions are capped.\n\nWorked example: a 15-person ops team needed timeline and workload views. The entry plan only offered boards — so the honest shortlist compared mid-tier prices, not the advertised starter seats.",
    tip: "Put the qualifying plan name next to each must-have on your requirements sheet.",
    figure: {
      src: "/guides/how-to-choose-project-management-software-framework.png",
      alt: "Selection framework mapping job, seats, views, automations, and integrations to a shortlist.",
      caption: "Job first, then seats and plan gates, then integrations — scores come later inside one cluster.",
    },
  },
  {
    type: "step",
    id: "trial",
    stepNumber: 3,
    heading: "Trial one real workflow on the qualifying plan",
    body: "Build the same project template on each finalist: owners, due dates, one automation, and one manager dashboard. Score completion time and whether status stays accurate after three days of real use.",
    tip: "Invite one sceptic contributor to the trial — adoption failures show up early.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I shortlist monday.com and Hive together?",
        answer:
          "Yes when work OS / collaborative work management is the job. Compare them as peers inside that cluster. Do not force Office Timeline or Foxit onto the same ranked list.",
      },
      {
        question: "How do I use SoftwareGlimpse scores?",
        answer:
          "Treat methodology criteria qualitatively in guides, and use the Best page for job-cluster awards. Do not invent numeric scores from vendor marketing.",
      },
      {
        question: "When is a specialist better than a work OS?",
        answer:
          "When the blocking deliverable is a PowerPoint timeline deck, PDF workflow, remote support session, or desktop app organisation — not shared day-to-day work tracking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Compare researched options",
    body: "See work OS peers and landscape awards in one place.",
    href: "/best/project-management-software/",
    ctaLabel: "Best project management software →",
    variant: "finder",
  },
];

export const howToChooseProjectManagementSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-project-management-software",
  slug: "how-to-choose-project-management-software",
  title: "How to Choose Project Management Software",
  summary: "A practical selection framework for work OS and adjacent productivity tools — by job, seats, plan gates, and integrations.",
  categorySlugs: ["project-management"],
    topicType: "selection",
    heroVisual: {
    src: "/guides/how-to-choose-project-management-software-hero.png",
    alt: "Educational illustration for How to Choose Project Management Software.",
  },
    supports: [
    {
      contentId: "content:category:project-management",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:project-management-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-project-management-software",
    "how-to-choose-project-management-software",
    "project-management-pricing-guide",
    "project-management-requirements-guide",
    "project-management-evaluation-guide",
  ].filter((s) => s !== "how-to-choose-project-management-software"),
  blocks: howToChooseProjectManagementBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T18:00:00.000Z",
    publishedAt: "2026-08-17T18:00:00.000Z",
    reviewedAt: "2026-08-17T18:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Project Management Software | SoftwareGlimpse",
    description: "How to choose project management software by job cluster — work OS, timelines, PDFs, remote access, and desktop workspaces.",
    canonicalPath: "/guides/how-to-choose-project-management-software/",
    indexable: true,
  },
};
