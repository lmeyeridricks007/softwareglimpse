import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental project management guide — softwareglimpse-guide-template-v1.
 */
const whatIsProjectManagementBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Project management software plans, tracks, and coordinates work — work OS boards and timelines, task ownership, automations, and portfolio reporting — plus closely adjacent productivity tools such as PowerPoint Gantt presenters, PDF editors, remote desktop, and desktop app workspaces. Decision rule: if the blocking job is “our team needs shared ownership of work and status,” buy a work OS / PM platform; if the job is timeline slides, PDFs, remote support, or desktop shells, shortlist a specialist instead of forcing it into an undifferentiated ranking.",
    bullets: [
      "Work OS / boards",
      "Timelines / Gantt",
      "Automations",
      "Collaboration & docs",
      "Adjacent specialists",
      "Not a CRM",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Work management, timeline presentation, PDF editing, remote access, and desktop workspaces fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "A work OS is not a CRM",
        body: "CRMs own pipeline and customer records. A work OS owns how internal work is planned, assigned, and reported — then integrates with chat, storage, and CRM when needed.",
      },
      {
        label: "Views and automations usually gate by plan",
        body: "Timeline, workload, and automation depth often unlock above entry tiers. Map must-haves to the qualifying plan before the demo.",
      },
      {
        label: "Specialists belong on landscape shortlists",
        body: "PowerPoint Gantt tools, PDF editors, remote desktop, and desktop shells solve adjacent jobs — they should not be ranked as if they were work OS peers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pm-building-blocks",
    title: "Project management building blocks",
    steps: [
      { id: "block-capture", label: "Capture", short: "Work items & owners" },
      { id: "block-plan", label: "Plan", short: "Boards & timelines" },
      { id: "block-automate", label: "Automate", short: "Rules & handoffs" },
      { id: "block-collaborate", label: "Collaborate", short: "Docs & comments" },
      { id: "block-integrate", label: "Integrate", short: "Chat / files / CRM" },
      { id: "block-report", label: "Report", short: "Dashboards & status" },
    ],
    ctaHref: "/guides/how-to-choose-project-management-software/",
    ctaLabel: "How to choose project management software →",
    figure: {
      src: "/guides/what-is-project-management-software-building-blocks.png",
      alt: "Six project management building blocks: capture, plan, automate, collaborate, integrate, and report.",
      caption:
        "These blocks define the work-OS core of the category. Specialists (timeline slides, PDF, remote desktop, desktop shells) sit beside — not inside — this loop.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does project management software work?",
    body: "Most work platforms share a loop: capture work items with owners and due dates, plan them on boards or timelines, automate status and handoffs, collaborate in comments or docs, integrate with chat and files, then report progress for managers.\n\nExample: Northline Agency, a twelve-person studio, moves from shared spreadsheets and Slack threads to a work OS. Every client deliverable has an owner and stage, deadlines appear on a timeline, and status changes notify the account lead — without rebuilding the plan in a Friday email.",
    tip: "Write the weekly outcome you need (“every project has an owner and a next date we trust”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-project-management-software-loop.png",
      alt: "Project management loop: capture work, plan views, automate, collaborate, integrate, and report.",
      caption:
        "The platform closes the work loop; your CRM still owns customer records when sales is a separate system.",
    },
    scenarios: [
      { title: "Capture", body: "Tasks, projects, and owners land in one shared system." },
      { title: "Plan", body: "Boards, lists, and timelines show sequence and load." },
      { title: "Automate", body: "Rules move status, assignees, and notifications without manual updates." },
      { title: "Collaborate", body: "Comments, docs, and files stay attached to the work item." },
      { title: "Report", body: "Dashboards and portfolio views feed weekly reviews." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What project management software typically includes",
    body: "Core work OS products cover boards and lists, timelines or Gantt, automations, docs/comments, integrations, and reporting. Many add workload/resourcing, time tracking, and AI assistance for planning or updates.\n\nJob clusters matter more than brand names: work OS peers (monday.com, Hive class), timeline presenters (Office Timeline class), PDF productivity (Foxit class), remote access (Getscreen.me class), and desktop workspaces (WebCatalog class) rarely belong on the same undifferentiated shortlist. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets both work tracking and a specialist add-on, check which one is the real product before you buy for the second job.",
  },
  {
    type: "crm-types",
    id: "pm-shapes",
    title: "Common project management shapes (not rankings)",
    types: [
      {
        id: "work-os",
        title: "Work OS / work management platform",
        bestFor: "Teams that need multi-view planning, ownership, and automations as the daily job.",
        avoidWhen: "You only need PowerPoint timeline slides or a PDF editor.",
      },
      {
        id: "timeline",
        title: "Timeline / Gantt presenter",
        bestFor: "PMs building executive or client-ready roadmap decks in PowerPoint.",
        avoidWhen: "Day-to-day task ownership and automations are the blocking need.",
      },
      {
        id: "document",
        title: "Document / PDF productivity",
        bestFor: "Teams whose bottleneck is editing, signing, or redacting PDFs.",
        avoidWhen: "Work tracking is the purchase — keep PDF tools adjacent.",
      },
      {
        id: "remote-desktop",
        title: "Remote access / desktop workspace",
        bestFor: "Remote support sessions or organising many web apps on the desktop.",
        avoidWhen: "You need boards, Gantt, and portfolio reporting as the core system.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is project management software the same as a CRM?",
        answer:
          "No. CRM systems track customers and revenue. Project management software tracks internal work, projects, and delivery — though the two often integrate.",
      },
      {
        question: "Do I need a work OS or just a task list?",
        answer:
          "If one person manages a short list, a simple task tool may be enough. A work OS earns its cost when multiple people need shared ownership, timelines, automations, and manager visibility.",
      },
      {
        question: "Where do monday.com and Hive fit?",
        answer:
          "They are work OS / collaborative work-management shapes. Compare them inside that job cluster — not against PowerPoint timeline tools or PDF editors. See our Best project management software page for methodology-based awards.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — work OS peers and landscape specialists are called out separately.",
    href: "/best/project-management-software/",
    ctaLabel: "See Best Project Management Software →",
    variant: "finder",
  },
];

export const whatIsProjectManagementSoftwareGuide: GuidePage = {
  id: "guide-what-is-project-management-software",
  slug: "what-is-project-management-software",
  title: "What Is Project Management Software?",
  summary:
    "A clear definition of work OS, timelines, automations, and adjacent productivity tools — and how they differ from CRM.",
  categorySlugs: ["project-management"],
    topicType: "fundamental",
    heroVisual: {
    src: "/guides/what-is-project-management-software-hero.png",
    alt: "Educational SaaS mockup of a project management work OS board with timeline and status columns.",
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
  nextAction: {
    contentId: "content:guide:how-to-choose-project-management-software",
    label: "How to choose project management software",
  },
  relatedGuideSlugs: [
    "how-to-choose-project-management-software",
    "project-management-pricing-guide",
    "project-management-requirements-guide",
    "project-management-evaluation-guide",
  ],
  blocks: whatIsProjectManagementBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Work OS, timeline slides, PDF, remote access, or desktop workspace — one sentence.",
      order: 0,
    },
    {
      id: "owners",
      label: "List who needs to update work weekly",
      description: "Contributors and managers who must share status.",
      order: 1,
    },
    {
      id: "views",
      label: "Note must-have views",
      description: "Board, timeline, workload, dashboard — map to plan gates later.",
      order: 2,
    },
  ],
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
    title: "What Is Project Management Software? | SoftwareGlimpse",
    description: "What is project management software? A clear definition of work OS, timelines, automations, and adjacent productivity tools — and how they differ from CRM.",
    canonicalPath: "/guides/what-is-project-management-software/",
    indexable: true,
  },
};
